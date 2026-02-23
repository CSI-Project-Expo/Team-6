import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function TokenValidate() {
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  // 🔐 Protect page
  useEffect(() => {
    if (!role || role !== "HOTEL_ADMIN") {
      alert("Unauthorized access");
      navigate("/login");
    }
  }, [role, navigate]);

  const validateToken = async () => {
    if (!token.trim()) {
      alert("Enter token code");
      return;
    }

    try {
      setLoading(true);

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
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🎟 Token Validation</h2>

      <button onClick={() => navigate("/hoteladmin/menu")}>🏨 Menu</button>
      <button onClick={handleLogout}>🚪 Logout</button>

      <hr />

      <input
        type="text"
        placeholder="Enter Token Code"
        value={token}
        onChange={(e) => setToken(e.target.value)}
      />

      <button onClick={validateToken} disabled={loading}>
        {loading ? "Validating..." : "Validate Token"}
      </button>

      {message && <h3>{message}</h3>}
    </div>
  );
}

export default TokenValidate;