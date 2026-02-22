import { useState } from "react";
import axios from "axios";

function TokenValidation() {
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");

  const validateToken = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:5000/token/validate", {
        token_code: token
      });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response.data.message);
    }
  };

  return (
    <div>
      <h2>Validate Token</h2>

      <input placeholder="Enter token" onChange={e=>setToken(e.target.value)} />
      <button onClick={validateToken}>Validate</button>

      <p>{message}</p>
    </div>
  );
}

export default TokenValidation;