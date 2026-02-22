import React, { useState } from "react";
import axios from "axios";

function ValidateToken() {
  const [token, setToken] = useState("");
  const [result, setResult] = useState(null);

  const handleValidate = async () => {
    if (!token) return alert("Enter a token");

    try {
      const res = await axios.post("http://127.0.0.1:5000/token/validate", {
        token_code: token
      });

      setResult(res.data);
    } catch (err) {
      setResult({ message: err.response?.data?.message || "Validation failed" });
    }
  };

  return (
    <div>
      <h2>Token Validation</h2>

      <input
        type="text"
        placeholder="Enter token"
        value={token}
        onChange={(e) => setToken(e.target.value)}
      />
      <button onClick={handleValidate}>Validate</button>

      {result && (
        <div style={{ marginTop: "20px" }}>
          <h3>Result:</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default ValidateToken;