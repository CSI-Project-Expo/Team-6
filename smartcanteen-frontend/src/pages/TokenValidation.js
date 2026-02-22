import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function TokenValidate() {
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const validateToken = async () => {
    if (!token) {
      alert("Enter token code");
      return;
    }

    try {
      const res = await api.post("/token/validate", {
        token_code: token
      });

      setMessage(res.data.message);
      setToken("");
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Validation failed");
      }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div>
      <h2>🎟 Token Validation</h2>

      <button onClick={() => navigate("/hotel/menu")}>🏨 Menu</button>
      <button onClick={handleLogout}>🚪 Logout</button>

      <br /><br />

      <input
        type="text"
        placeholder="Enter Token Code"
        value={token}
        onChange={(e) => setToken(e.target.value)}
      />

      <button onClick={validateToken}>Validate Token</button>

      <h3>{message}</h3>
    </div>
  );
}

export default TokenValidate;