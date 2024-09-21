import { useEffect } from "react";
import { ethers } from "ethers"; 
import "./Modal.css";

const Modal = ({ setModalOpen, contract }) => {
  const sharing = async () => {
    const address = document.querySelector(".address").value;
    try {
      if (ethers.utils.isAddress(address)) {
        await contract.allow(address);
        alert("Access shared successfully!");
        setModalOpen(false);
      } else {
        alert("Invalid Ethereum address");
      }
    } catch (error) {
      console.error("Failed to share access:", error);
      alert("Error sharing access. Please try again.");
    }
  };

  useEffect(() => {
    const accessList = async () => {
      try {
        const addressList = await contract.shareAccess();
        let select = document.querySelector("#selectNumber");
        
        select.innerHTML = ""; 

        const defaultOption = document.createElement("option");
        defaultOption.textContent = "People With Access";
        select.appendChild(defaultOption);

        addressList.forEach((opt) => {
          const e1 = document.createElement("option");
          e1.textContent = `${opt.user} - Access: ${opt.access ? "Allowed" : "Denied"}`;
          e1.value = opt.user;
          select.appendChild(e1);
        });
      } catch (error) {
        console.error("Failed to fetch access list:", error);
      }
    };

    if (contract) accessList();
  }, [contract]);

  return (
    <div className="modalBackground">
      <div className="modalContainer">
        <div className="title">Share with</div>
        <div className="body">
          <input
            type="text"
            className="address"
            placeholder="Enter Address"
          />
        </div>
        <form id="myForm">
          <select id="selectNumber">
            <option>People With Access</option>
          </select>
        </form>
        <div className="footer">
          <button
            onClick={() => setModalOpen(false)}
            id="cancelBtn"
          >
            Cancel
          </button>
          <button onClick={sharing}>Share</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
