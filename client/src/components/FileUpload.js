import { useState } from "react";
import axios from "axios";
import "./FileUpload.css";

const FileUpload = ({ contract, account, provider }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No image selected");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: "979cad7b7076c66d482d", 
            pinata_secret_api_key: "d15141fc7ff5295bc5a717c4ac36f50e4bcfb39df43e625b20eca97e826bbf6a",
            "Content-Type": "multipart/form-data",
          },
        });

        const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
        await contract.add(account, ImgHash);

        alert("Successfully uploaded image");
        setFileName("No image selected");
        setFile(null);
      } catch (e) {
        console.error("Error uploading image:", e);
        alert("Unable to upload image to Pinata or share access.");
      }
    }
  };

  const retrieveFile = (e) => {
    const data = e.target.files[0];
    const reader = new window.FileReader();
    
    reader.readAsArrayBuffer(data);
    reader.onloadend = () => {
      setFile(data);
    };
    setFileName(data.name);
    e.preventDefault();
  };

  return (
    <div className="upload-container">
      <form className="upload-form" onSubmit={handleSubmit}>
        <label htmlFor="file-upload" className="choose-btn">
          Choose File
        </label>
        <input
          disabled={!account}
          type="file"
          id="file-upload"
          name="data"
          onChange={retrieveFile}
        />
        <span className="file-info">Selected: {fileName}</span>
        <button type="submit" className="upload-btn" disabled={!file}>
          Upload
        </button>
      </form>
    </div>
  );
};

export default FileUpload;
