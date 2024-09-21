import { useState } from "react";
import "./Display.css";

const Display = ({ contract, account }) => {
  const [data, setData] = useState([]);
  const [otherAddress, setOtherAddress] = useState("");

  const getData = async () => {
    let dataArray;

    try {
      dataArray = otherAddress ? await contract.display(otherAddress) : await contract.display(account);
    } catch (e) {
      alert("You don't have access or an error occurred.");
      console.error("Error fetching data:", e);
      return; 
    }

    if (dataArray.length === 0) {
      alert("No images to display.");
      setData([]); 
      return;
    }

    const images = dataArray.map((item, i) => (
      <a href={item} key={i} target="_blank" rel="noopener noreferrer">
        <img
          src={`https://gateway.pinata.cloud/ipfs/${item.substring(6)}`}
          alt={`Uploaded content ${i}`}
          className="image-list"
        />
      </a>
    ));

    setData(images);
  };

  return (
    <>
      <div className="image-list">{data}</div>
      <input
        type="text"
        placeholder="Enter Address"
        className="address"
        value={otherAddress}
        onChange={(e) => setOtherAddress(e.target.value)}
      />
      <button className="center button" onClick={getData}>
        Get Data
      </button>
    </>
  );
};

export default Display;
