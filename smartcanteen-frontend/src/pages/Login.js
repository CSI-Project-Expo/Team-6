import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", { email, password });

      setMessage(res.data.message);

      localStorage.setItem("user_id", res.data.user_id);
      localStorage.setItem("role", res.data.role);
      if (res.data.hotel_id) {
        localStorage.setItem("hotel_id", res.data.hotel_id);
      } else {
        localStorage.removeItem("hotel_id");
      }

      if (res.data.role === "ADMIN") navigate("/superadmin/dashboard");
      else if (res.data.role === "HOTEL_ADMIN") navigate("/hoteladmin");
      else navigate("/student");

    } catch {
      setMessage("❌ Login failed. Invalid email or password.");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">

        <h1 className="app-title">🍽 SmartCanteen</h1>
        <p className="subtitle">Smart food ordering for campus</p>

        <div className="input-group">
          <input
            type="email"
            placeholder="📧 Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="🔒 Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="login-btn" onClick={handleLogin}>
          🚀 Login
        </button>

        {message && <p className="message">{message}</p>}

        <div className="divider">or</div>

        <button className="register-btn" onClick={() => navigate("/register")}>
          ✍ Create New Account
        </button>

        <div className="role-info">
          <span>👩‍🎓 Student</span>
          <span>🏨 Hotel Admin</span>
          <span>🛡 Super Admin</span>
        </div>

        <p className="footer-text">
          © 2026 SmartCanteen | CSI Project Expo
        </p>

      </div>
    </div>
  );
}

export default Login;
