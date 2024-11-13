from rest_framework.response import Response

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from langchain_groq import ChatGroq
from langchain_community.utilities import ArxivAPIWrapper, WikipediaAPIWrapper, PubMedAPIWrapper
from langchain_community.tools import ArxivQueryRun, WikipediaQueryRun, DuckDuckGoSearchRun
from langchain_community.tools.pubmed.tool import PubmedQueryRun
from langchain.agents import initialize_agent, AgentType
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from langchain_community.agent_toolkits.sql.base import create_sql_agent
from langchain_community.utilities import SQLDatabase
from langchain.agents.agent_types import AgentType
from langchain_community.agent_toolkits.sql.toolkit import SQLDatabaseToolkit
from langchain_groq import ChatGroq

from django.conf import settings
import os
from dotenv import load_dotenv

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def search(request):
    messages = request.data.get('messages')

    pubmed_wrapper = PubMedAPIWrapper(top_k_results=1, doc_content_chars_max=200)
    arxiv_wrapper = ArxivAPIWrapper(top_k_results=1, doc_content_chars_max=200)
    wiki_wrapper = WikipediaAPIWrapper(top_k_results=1, doc_content_chars_max=200)
    search = DuckDuckGoSearchRun(name="Search")

    llm = ChatGroq(groq_api_key=os.getenv("GROQ_API_KEY"), model_name="mixtral-8x7b-32768", streaming=True)
    tools = [search, ArxivQueryRun(api_wrapper=arxiv_wrapper), WikipediaQueryRun(api_wrapper=wiki_wrapper), PubmedQueryRun(api_wrapper=pubmed_wrapper)]

    search_agent = initialize_agent(tools, llm, agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION, handle_parsing_errors=True)

    response = search_agent.run(messages)
    return Response(response)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def chat_with_db(request):
    user_query = request.data.get('query')
    
    if not user_query:
        return Response({"error": "No query provided"}, status=400)

    db_path = settings.DATABASES['default']['NAME']
    db = SQLDatabase.from_uri(f"sqlite:///{db_path}")

    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        return Response({"error": "GROQ API key not found"}, status=500)

    llm = ChatGroq(groq_api_key=api_key, model_name="Llama3-8b-8192", streaming=True)

    # Create a custom prompt that encourages more readable output
    custom_prompt = """
    You are an AI assistant that helps with database queries. When querying appointment information,
    always join with the Patient and Doctor tables to get names instead of IDs. Format your response
    in a readable way, like this:

    Patient: [patient_name], Doctor: [doctor_name], Appointment Date: [YYYY/MM/DD HH:MM], 
    Reason: [reason], Status: [status]

    If multiple appointments are returned, list each one on a new line.
    """

    # Create SQL agent with custom prompt
    toolkit = SQLDatabaseToolkit(db=db, llm=llm)
    agent = create_sql_agent(
        llm=llm,
        toolkit=toolkit,
        verbose=True,
        agent_type=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
        prefix=custom_prompt
    )

    # Run the agent
    try:
        response = agent.run(user_query)
        
        # Additional formatting if needed
        formatted_response = response.replace('), (', ')\n(')
        
        return Response({"response": formatted_response})
    except Exception as e:
        return Response({"error": str(e)}, status=500)