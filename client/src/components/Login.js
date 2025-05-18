import { useState } from "react";
import "../App.css"; // Import CSS for styling

const Login = ({ setUser }) => {
  const [username, setUsername] = useState("");

  const handleLogin = () => {
    if (!username.trim()) {
      alert("Please enter a valid username (Doctor or Patient).");
      return;
    }
    localStorage.setItem("user", username);
    setUser(username);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>MedVault Login</h2>
        <input
          type="text"
          placeholder="Enter Role (Doctor/Patient)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
};

export default Login;
