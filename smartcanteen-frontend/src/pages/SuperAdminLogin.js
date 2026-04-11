import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./LegacyPages.css";

function SuperAdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:5000/superadmin/login", {
        email,
        password
      });

      alert("Login Successful");

      sessionStorage.setItem("user_id", res.data.user_id);
      sessionStorage.setItem("role", res.data.role);
      if (res.data.name) {
        sessionStorage.setItem("user_name", res.data.name);
      } else {
        sessionStorage.removeItem("user_name");
      }

      navigate("/superadmin/dashboard");
    } catch (error) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="lp-page">
      <div className="lp-card narrow">
        <h2 className="lp-title">Super Admin Login</h2>
        <p className="lp-subtitle">Access system-level analytics and controls.</p>
        <div className="lp-form">
          <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
          <button className="lp-btn" onClick={handleLogin}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default SuperAdminLogin;
