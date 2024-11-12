import React, { useEffect, useState } from "react";
import Tesseract from "tesseract.js";
import './Ocr.css';
import AI from './AI';  // Import AI Component

const Ocr = ({ onBack }) => {
  const [imageLink, setImageLink] = useState("");
  const [extractedText, setExtractedText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAI, setShowAI] = useState(false);  // New state to show AI page

  useEffect(() => {
    const storedImageLink = localStorage.getItem("selectedImage");
    setImageLink(storedImageLink);
  }, []);

  const extractTextFromImage = async (image) => {
    setIsProcessing(true);
    try {
      const result = await Tesseract.recognize(
        image,
        'eng+osd',
        { logger: (m) => console.log(m) }
      );
      const cleanedText = result.data.text.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
      setExtractedText(cleanedText);
    } catch (error) {
      console.error("Error during OCR:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (imageLink) {
      extractTextFromImage(imageLink);
    }
  }, [imageLink]);

  // Toggle to show AI component
  const openAI = () => setShowAI(true);
  const handleBackToOcr = () => setShowAI(false);  // New function to go back to OCR

  if (showAI) return <AI extractedText={extractedText} onBack={handleBackToOcr} />;  // Pass extracted text and onBack to AI

  return (
    <div className="ocr-container">
      <button className="back-button" onClick={onBack}>← Back</button>
      {extractedText && (  // Show AI Assistant button only if extractedText is not empty
        <button className="ai-button" onClick={openAI}>
          <i className="ai-icon">🤖</i> AI Assistant
        </button>
      )}
      {imageLink ? (
        <>
          <img src={imageLink} alt="Selected content" className="img_ocr" />
          <div className="ocr-text-container">
            {isProcessing ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>Processing...</p>
              </div>
            ) : (
              <p className="extracted-text">{extractedText || "No text extracted"}</p>
            )}
          </div>
        </>
      ) : (
        <p className="no-image-text">No image selected.</p>
      )}
    </div>
  );
};

export default Ocr;
