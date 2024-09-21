import { useState } from "react";
import axios from "axios";
import "./FileUpload.css";
const FileUpload = ({ contract, account, provider }) => {
    const handleSubmit = async (e) => {}
    const retrieveFile = (e) => {}
    return
    <div className="top">
        <form className="form" onSubmit={handleSubmit}></form>
        <label htmlFor="file-upload" className="choose">
          Choose Image
        </label>
        <input
          disabled={!account}
          type="file"
          id="file-upload"
          name="data"
          onChange={retrieveFile}
        />
    </div>;
}
export default FileUpload;