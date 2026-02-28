import React, { useState } from "react";
import axios from "axios";
import "./LegacyPages.css";

function StaffTokenPage() {
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleValidate = async () => {
    if (!token) {
      setMessage("Please enter token");
      return;
    }

    try {
      const res = await axios.post("http://127.0.0.1:5000/token/validate", {
        token_code: token,
      });

      setMessage(res.data.message);
      setSuccess(true);
      setToken("");
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Server error");
      }
      setSuccess(false);
    }
  };

  return (
    <div className="lp-page">
      <div className="lp-card narrow">
        <h2 className="lp-title">Token Validation</h2>
        <p className="lp-subtitle">Validate issued token IDs quickly at pickup.</p>

        <div className="lp-form">
          <input
            type="text"
            placeholder="Enter token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
          <button className="lp-btn" onClick={handleValidate}>
            Validate Token
          </button>
        </div>

        {message && <p className={`lp-message ${success ? "success" : "error"}`}>{message}</p>}
      </div>
    </div>
  );
}

export default StaffTokenPage;
