import React, { useState } from "react";
import axios from "axios";

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
        token_code: token
      });

      setMessage(res.data.message);
      setSuccess(true);
      setToken(""); // auto clear for next scan

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
    <div>
      <h2>🎟 Token Validation</h2>

      <input
        type="text"
        placeholder="Enter token"
        value={token}
        onChange={(e) => setToken(e.target.value)}
      />
      <br /><br />

      <button onClick={handleValidate}>Validate Token</button>

      {message && (
        <p style={{ color: success ? "green" : "red" }}>{message}</p>
      )}
    </div>
  );
}

export default StaffTokenPage;