import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("STUDENT");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setMessage("All fields are required");
      return;
    }

    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
        role,
      });

      const loginRes = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("user_id", loginRes.data.user_id);
      localStorage.setItem("role", loginRes.data.role);

      setMessage("Registered & logged in successfully!");

      if (loginRes.data.role === "HOTEL_ADMIN") {
        navigate("/hotel-admin");
      } else {
        navigate("/student");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Registration failed");
      }
    }
  };

  return (
    <div className="register-page">
      {/* HEADER */}
      <div className="register-header">
        <h1>Smart Canteen</h1>
        <p>Create your account</p>
      </div>

      {/* CARD */}
      <div className="register-wrapper">
        <div className="register-card">
          <h2>Register ✨</h2>

          <input
            type="text"
            placeholder="Full Name"
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email Address"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <select onChange={(e) => setRole(e.target.value)}>
            <option value="STUDENT">Student</option>
            <option value="HOTEL_ADMIN">Hotel Admin</option>
          </select>

          <button className="register-btn" onClick={handleRegister}>
            Create Account
          </button>

          {message && <p className="register-message">{message}</p>}

          <p className="login-link">
            Already have an account?{" "}
            <span onClick={() => navigate("/login")}>Login here</span>
          </p>
        </div>
      </div>

      {/* FOOTER */}
      <div className="footer">
        © 2026 Smart Canteen System | All Rights Reserved
      </div>
    </div>
  );
}

export default Register;