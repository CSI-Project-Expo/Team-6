import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import "./TokenValidate.css";

function TokenValidate() {
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const role = sessionStorage.getItem("role");

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
        token_code: token,
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
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <div className="token-page">
      {/* HEADER */}
      <div className="token-header">
        <h2>🎟 Token Validation</h2>
        <p>Verify student pickup tokens quickly and securely</p>
      </div>

      {/* ACTIONS */}
      <div className="token-actions">
        <button onClick={() => navigate("/hoteladmin/menu")}>🏨 Menu</button>
        <button onClick={() => navigate(-1)}>⬅ Back</button>
        <button className="logout-btn" onClick={handleLogout}>🚪 Logout</button>
      </div>

      {/* CARD */}
      <div className="token-card">
        <input
          type="text"
          placeholder="Enter Token Code"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />

        <button onClick={validateToken} disabled={loading}>
          {loading ? "Validating..." : "Validate Token"}
        </button>

        {message && <p className="token-message">{message}</p>}
      </div>

      <footer className="token-footer">
        <p>© 2026 🍽 SmartCanteen | Token Validation Module</p>
      </footer>
    </div>
  );
}

export default TokenValidate;
