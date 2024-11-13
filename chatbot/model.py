from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from langchain.prompts import PromptTemplate
# from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_community.llms import CTransformers
from langchain.chains import RetrievalQA
import logging

DB_FAISS_PATH = 'vectorstore/db_faiss'
logging.basicConfig(level=logging.DEBUG)

custom_prompt_template = """Use the following pieces of information to answer the user's question.
If you don't know the answer, just say that you don't know, don't try to make up an answer.

Context: {context}
Question: {question}

Only return the helpful answer below and nothing else.
Helpful answer:
"""

def set_custom_prompt():
    prompt = PromptTemplate(template=custom_prompt_template, input_variables=['context', 'question'])
    return prompt

def load_llm():
    try:
        logging.debug("Loading language model...")
        llm = CTransformers(
            model="TheBloke/Llama-2-7B-Chat-GGML",
            model_type="llama",
            max_new_tokens=512,
            temperature=0.5
        )
        logging.debug("Language model loaded successfully.")
        return llm
    except Exception as e:
        logging.error(f"Error loading LLM: {e}")
        raise

def retrieval_qa_chain(llm, prompt, db):
    try:
        logging.debug("Setting up RetrievalQA chain...")
        qa_chain = RetrievalQA.from_chain_type(
            llm=llm,
            chain_type='stuff',
            retriever=db.as_retriever(search_kwargs={'k': 2}),
            return_source_documents=True,
            chain_type_kwargs={'prompt': prompt}
        )
        logging.debug("RetrievalQA chain set up successfully.")
        return qa_chain
    except Exception as e:
        logging.error(f"Error setting up RetrievalQA chain: {e}")
        raise

def qa_bot():
    try:
        logging.debug("Loading embeddings and FAISS vector store...")
        embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2", model_kwargs={'device': 'cpu'})
        db = FAISS.load_local(DB_FAISS_PATH, embeddings, allow_dangerous_deserialization=True)
        logging.debug("FAISS vector store loaded successfully.")
        
        llm = load_llm()
        qa_prompt = set_custom_prompt()
        qa_chain = retrieval_qa_chain(llm, qa_prompt, db)
        
        return qa_chain
    except Exception as e:
        logging.error(f"Error initializing QA bot: {e}")
        raise

def get_answer(query: str) -> str:
    qa_result = qa_bot()
    try:
        logging.debug(f"Processing query: {query}")
        response = qa_result({'query': query})
        logging.debug(f"Query processed successfully.")
        return response['result']
    except Exception as e:
        logging.error(f"Error processing query: {e}")
        raise

app = FastAPI()

class QueryRequest(BaseModel):
    query: str

@app.post("/get-answer/")
async def get_answer_endpoint(request: QueryRequest):
    try:
        query = request.query
        answer = get_answer(query)
        return {"answer": answer}
    except Exception as e:
        logging.error(f"Error in /get-answer endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# Run the app using Uvicorn server (run `uvicorn app_name:app --reload` from terminal)