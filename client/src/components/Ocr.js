import React, { useEffect, useState } from "react";
import Tesseract from "tesseract.js"; 
import './Ocr.css';

const Ocr = ({ onBack }) => {
  const [imageLink, setImageLink] = useState("");
  const [extractedText, setExtractedText] = useState(""); 
  const [isProcessing, setIsProcessing] = useState(false);  

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
        {
          logger: (m) => console.log(m),  
        }
      );
      setExtractedText(result.data.text);  
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

  return (
    <div className="ocr-container">
      <button className="back-button" onClick={onBack}>← Back</button>
      {imageLink ? (
        <>
          <img src={imageLink} alt="Selected content" className="img_ocr" />
          <div className="ocr-text">
            {isProcessing ? (
              <p>Processing...</p>  
            ) : (
              <pre>{extractedText || "No text extracted"}</pre> 
            )}
          </div>
        </>
      ) : (
        <p>No image selected.</p>
      )}
    </div>
  );
};

export default Ocr;
