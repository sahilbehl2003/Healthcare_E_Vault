import React from 'react';
import './AI.css'

const AI = ({ extractedText, onBack }) => {
  return (
    <div className="ai-container">
      <button className="back-button" onClick={onBack}>← Back</button> {/* Back Button */}
      <h2>AI Assistant</h2>
      <p>Welcome to the AI Assistant! Here is the extracted text:</p>
      <div className="extracted-text-display">
        {extractedText ? extractedText : "No text available"}
      </div>
      {/* Add additional AI-related features here */}
    </div>
  );
};

export default AI;
