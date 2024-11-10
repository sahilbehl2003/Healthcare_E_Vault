import { useEffect, useState } from "react";
import { ethers } from "ethers";
import "./Modal.css";

const Modal = ({ setModalOpen, contract }) => {
  const [addressList, setAddressList] = useState([]); // Define state for address list

  const sharing = async () => {
    const address = document.querySelector(".address").value;
    try {
      if (ethers.utils.isAddress(address)) {
        await contract.allow(address);
        alert("Access shared successfully!");
        refreshAccessList(); // Refresh the access list after sharing
        setModalOpen(false);
      } else {
        alert("Invalid Ethereum address");
      }
    } catch (error) {
      console.error("Failed to share access:", error);
      alert("Error sharing access. Please try again.");
    }
  };

  const revokeAccess = async (userAddress) => {
    try {
      await contract.disallow(userAddress); // Revoke access
      alert("Access revoked successfully!");
      refreshAccessList(); // Refresh the access list after revoking
    } catch (error) {
      console.error("Failed to revoke access:", error);
      alert("Error revoking access. Please try again.");
    }
  };

  const refreshAccessList = async () => {
    try {
      const addressListFromContract = await contract.shareAccess();
      setAddressList(addressListFromContract); // Store the fetched list in state

      const select = document.querySelector("#selectNumber");
      select.innerHTML = ""; // Clear existing options

      const defaultOption = document.createElement("option");
      defaultOption.textContent = "People With Access";
      select.appendChild(defaultOption);

      addressListFromContract.forEach((opt) => {
        const e1 = document.createElement("option");
        e1.textContent = `${opt.user} - Access: ${opt.access ? "Allowed" : "Denied"}`;
        e1.value = opt.user;
        select.appendChild(e1);
      });
    } catch (error) {
      console.error("Failed to fetch access list:", error);
    }
  };

  useEffect(() => {
    if (contract) refreshAccessList(); // Fetch access list on load
  }, [contract]);

  return (
    <div className="modalBackground">
      <div className="modalContainer">
        <div className="title">Share Access</div>
        <div className="body">
          <input
            type="text"
            className="address"
            placeholder="Enter Ethereum Address"
          />
        </div>
        <div className="access-list-container">
          <h3 className="access-list-title">People With Access</h3>
          <form id="myForm">
            <select id="selectNumber" className="access-list-select">
              <option>People With Access</option>
            </select>
          </form>
        </div>
        <div className="footer">
          <button
            onClick={() => setModalOpen(false)}
            id="cancelBtn"
          >
            Cancel
          </button>
          <button onClick={sharing}>Share</button>
        </div>
        {/* Revoke Access List */}
        <div className="revoke-list-container">
          <h3>Revoke Access</h3>
          <ul>
            {addressList.map((opt, index) => (
              <li key={index}>
                <span>{opt.user} - Access: {opt.access ? "Allowed" : "Denied"}</span>
                {opt.access && (
                  <button onClick={() => revokeAccess(opt.user)}>Revoke</button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Modal;
