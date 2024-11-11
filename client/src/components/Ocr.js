import React, { useEffect, useState } from "react";
import './Ocr.css';
import Tesseract from 'tesseract.js'; // Import Tesseract.js

const Ocr = ({ onBack }) => {
  const [imageLink, setImageLink] = useState("");
  const [ocrText, setOcrText] = useState(""); // State to hold the OCR text
  const [loading, setLoading] = useState(false); // Loading state for OCR process

  useEffect(() => {
    const storedImageLink = localStorage.getItem("selectedImage");
    setImageLink(storedImageLink);
  }, []);

  // Function to process OCR when the image is loaded
  const processOcr = () => {
    if (imageLink) {
      setLoading(true); // Set loading to true when OCR starts
      Tesseract.recognize(
        imageLink,
        'eng', // Language for OCR (you can add more languages if needed)
        {
          logger: (m) => console.log(m), // Optional logger to track OCR progress
        }
      ).then(({ data: { text } }) => {
        setOcrText(text); // Set the OCR text
        setLoading(false); // Set loading to false once OCR is complete
      });
    }
  };

  useEffect(() => {
    if (imageLink) {
      processOcr(); // Automatically trigger OCR when the image is loaded
    }
  }, [imageLink]);

  return (
    <div className="ocr-container">
      <button className="back-button" onClick={onBack}>← Back</button>
      {imageLink ? (
        <div>
          <img src={imageLink} alt="Selected content" className="img_ocr" />
          {loading ? (
            <p>Loading OCR...</p> 
          ) : (
            <div>
              <h3>Extracted Text:</h3>
              <p>{ocrText ? ocrText : "No text found."}</p> 
            </div>
          )}
        </div>
      ) : (
        <p>No image selected.</p>
      )}
    </div>
  );
};

export default Ocr;
