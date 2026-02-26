import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      setIsError(false);
      setMessage(res.data.message);

      localStorage.setItem("user_id", res.data.user_id);
      localStorage.setItem("role", res.data.role);

      setTimeout(() => {
        if (res.data.role === "ADMIN") {
          navigate("/superadmin/dashboard");
        } else if (res.data.role === "HOTEL_ADMIN") {
          navigate("/hoteladmin");
        } else {
          navigate("/student");
        }
      }, 800);

    } catch (err) {
      setIsError(true);
      setMessage("Login failed. Invalid email or password.");
    }
  };

  return (
    <div className="login-page">
      {/* HEADER STRIP */}
      <div className="login-header">
        <h1>Smart Canteen</h1>
        <p>Fast • Smart • Cashless</p>
      </div>

      {/* LOGIN CARD */}
      <div className="login-wrapper">
        <div className="login-card">
          <h2>Welcome Back 👋</h2>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="login-btn" onClick={handleLogin}>
            Login
          </button>

          {message && (
            <p className={isError ? "msg error" : "msg success"}>
              {message}
            </p>
          )}

          <p className="register-text">Don’t have an account?</p>
          <button
            className="register-btn"
            onClick={() => navigate("/register")}
          >
            Register Here
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <div className="footer">
        © 2026 Smart Canteen System | All Rights Reserved
      </div>
    </div>
  );
}

export default Login;