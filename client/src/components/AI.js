import React, { useState } from 'react';
import './AI.css'; // Import the CSS for styling

function AI() {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([
        {
            message: "Hello, I am ChatGPT",
            sender: "ChatGPT"
        }
    ]);

    const handleChange = (event) => {
        setInput(event.target.value);
    };

    const handleSend = async (event) => {
        event.preventDefault();
        if (input.trim() === "") return;

        const newMessage = {
            message: input,
            sender: "user"
        };

        const newMessages = [...messages, newMessage];
        setMessages(newMessages);
        setInput('');

        await processMessageToChatGPT(newMessages);
    };
    async function processMessageToChatGPT(chatMessages) {
      const API_KEY = process.env.OPENAI_API_KEY; // Store your API key securely
  
      // Map chat messages to API format
      let apiMessages = chatMessages.map((messageObject) => {
          let role = messageObject.sender === "ChatGPT" ? "assistant" : "user";
          return { role: role, content: messageObject.message };
      });
  
      const systemMessage = {
          role: "system",
          content: "Explain all concepts as if explaining to a 10-year-old."
      };
  
      const apiRequestBody = {
          model: "gpt-3.5-turbo",
          messages: [systemMessage, ...apiMessages]
      };
  
      // Retry logic for rate limit (429) errors
      async function fetchWithRetry(url, options, retries = 3, backoff = 1000) {
          try {
              const response = await fetch(url, options);
              if (response.status === 429 && retries > 0) {
                  console.warn("Rate limit exceeded. Retrying in", backoff, "ms...");
                  await new Promise(resolve => setTimeout(resolve, backoff));
                  return fetchWithRetry(url, options, retries - 1, backoff * 2); // Exponential backoff
              } else if (!response.ok) {
                  throw new Error(`API error ${response.status}: ${response.statusText}`);
              }
              return response.json();
          } catch (error) {
              throw new Error(`Request failed: ${error.message}`);
          }
      }
  
      try {
          const data = await fetchWithRetry("https://api.openai.com/v1/chat/completions", {
              method: "POST",
              headers: {
                  "Authorization": `Bearer ${API_KEY}`,
                  "Content-Type": "application/json"
              },
              body: JSON.stringify(apiRequestBody)
          });
  
          if (!data.choices || data.choices.length === 0) {
              throw new Error("Invalid response structure from API.");
          }
  
          setMessages([
              ...chatMessages,
              {
                  message: data.choices[0].message.content,
                  sender: "ChatGPT"
              }
          ]);
      } catch (error) {
          console.error("Error:", error.message);
          setMessages([
              ...chatMessages,
              {
                  message: "Sorry, I couldn't process your request.",
                  sender: "ChatGPT"
              }
          ]);
      }
  }
  

    // async function processMessageToChatGPT(chatMessages) {
    //     const API_KEY = "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"; // Ensure API key is correct

    //     let apiMessages = chatMessages.map((messageObject) => {
    //         let role = messageObject.sender === "ChatGPT" ? "assistant" : "user";
    //         return { role: role, content: messageObject.message };
    //     });

    //     const systemMessage = {
    //         role: "system",
    //         content: "Explain all concepts as if explaining to a 10-year-old."
    //     };

    //     const apiRequestBody = {
    //         model: "gpt-3.5-turbo",
    //         messages: [systemMessage, ...apiMessages]
    //     };

    //     try {
    //         const response = await fetch("https://api.openai.com/v1/chat/completions", {
    //             method: "POST",
    //             headers: {
    //                 "Authorization": `Bearer ${API_KEY}`,
    //                 "Content-Type": "application/json"
    //             },
    //             body: JSON.stringify(apiRequestBody)
    //         });

    //         if (!response.ok) {
    //             throw new Error(`API error ${response.status}: ${response.statusText}`);
    //         }

    //         const data = await response.json();
    //         if (!data.choices || data.choices.length === 0) {
    //             throw new Error("Invalid response structure from API.");
    //         }

    //         setMessages([
    //             ...chatMessages,
    //             {
    //                 message: data.choices[0].message.content,
    //                 sender: "ChatGPT"
    //             }
    //         ]);
    //     } catch (error) {
    //         console.error("Error:", error.message);
    //         setMessages([
    //             ...chatMessages,
    //             {
    //                 message: "Sorry, I couldn't process your request.",
    //                 sender: "ChatGPT"
    //             }
    //         ]);
    //     }
    // }

    return (
        <div className="chat-container">
            <div className="messages-container">
                {messages.map((message, index) => (
                    <div key={index} className={message.sender === "ChatGPT" ? 'message gpt-message' : 'message user-message'}>
                        {message.message}
                    </div>
                ))}
            </div>
            <div className="input-container">
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={input}
                    onChange={handleChange}
                    className="message-input"
                />
                <button className="send-button" onClick={handleSend}>Send</button>
            </div>
        </div>
    );
}

export default AI;
