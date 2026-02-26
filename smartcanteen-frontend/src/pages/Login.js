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
      const res = await api.post("/auth/login", {
        email: email,
        password: password
      });

      setMessage(res.data.message);

      localStorage.setItem("user_id", res.data.user_id);
      localStorage.setItem("role", res.data.role);

      if (res.data.role === "ADMIN") {
        navigate("/superadmin/dashboard");
      } 
      else if (res.data.role === "HOTEL_ADMIN") {
        navigate("/hoteladmin");
      } 
      else {
        navigate("/student");
      }

    } catch (err) {
      setMessage("❌ Login failed. Invalid email or password.");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">

        <h1>🍽 SmartCanteen</h1>
        <p className="subtitle">Login to continue</p>

        <div className="input-group">
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="login-btn" onClick={handleLogin}>
          🔐 Login
        </button>

        {message && <p className="message">{message}</p>}

        <hr />

        <p className="register-text">Don’t have an account?</p>

        <button className="register-btn" onClick={() => navigate("/register")}>
          ✍ Register Here
        </button>

        <div className="role-info">
          <p>👩‍🎓 Student | 🏨 Hotel Admin | 🛡 Admin</p>
        </div>

      </div>
    </div>
  );
}

export default Login;