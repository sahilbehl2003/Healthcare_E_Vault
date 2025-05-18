import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Upload from "./artifacts/contracts/Upload.sol/Upload.json";

import FileUpload from "./components/FileUpload";
import Display from "./components/Display";
import Modal from "./components/Modal";
import Ocr from "./components/Ocr";
import Login from "./components/Login"; // Import the Login component

import "./App.css";

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showOcr, setShowOcr] = useState(false);
  const [user, setUser] = useState(localStorage.getItem("user") || ""); // Load user from localStorage

  useEffect(() => {
    const loadProvider = async () => {
      if (window.ethereum) {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);

          window.ethereum.on("chainChanged", () => {
            window.location.reload();
          });
          window.ethereum.on("accountsChanged", () => {
            window.location.reload();
          });

          await provider.send("eth_requestAccounts", []);
          const signer = provider.getSigner();
          const address = await signer.getAddress();
          setAccount(address);

          const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
          const contract = new ethers.Contract(contractAddress, Upload.abi, signer);

          setContract(contract);
          setProvider(provider);
        } catch (error) {
          console.error("Error connecting to the contract or MetaMask:", error);
        } finally {
          setLoading(false);
        }
      } else {
        alert("Please install MetaMask to use this app.");
        setLoading(false);
      }
    };

    loadProvider();
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser("");
  };

  return (
    <>
      {loading ? (
        <div className="App">
          <h1>Loading...</h1>
        </div>
      ) : !user ? ( // Show login if user is not set
        <Login setUser={setUser} />
      ) : showOcr ? (
        <Ocr onBack={() => setShowOcr(false)} />
      ) : (
        <>
          <div className="bg"></div>
          <div className="bg bg2"></div>
          <div className="bg bg3"></div>

          <div className="App">
            <h1>MedVault</h1>
            <p>Logged in as: {user}</p>
            <p>Account: {account || "Not connected"}</p>

            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>

            {contract && (
              <>
                {user === "Doctor" || user==="doctor" ? (
                  <>
                    <FileUpload account={account} provider={provider} contract={contract} />
                    <Display contract={contract} account={account} onImageClick={() => setShowOcr(true)} />
                  </>
                ) : (
                  <>
                  <p>Welcome, Patient! You can view and manage your records.</p>
                  <Display contract={contract} account={account} onImageClick={() => setShowOcr(true)} />
                  </>
                  
                )}
              </>
            )}

            {!modalOpen && (
              <button className="share" onClick={() => setModalOpen(true)}>
                Share
              </button>
            )}
            {modalOpen && contract && (
              <Modal setModalOpen={setModalOpen} contract={contract}></Modal>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default App;
