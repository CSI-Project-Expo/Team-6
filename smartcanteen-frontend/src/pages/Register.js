import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      // 1. Register user
      await api.post("/auth/register", {
        name,
        email,
        password,
        role: "STUDENT"
      });

      // 2. Auto login after register
      const loginRes = await api.post("/auth/login", {
        email,
        password
      });

      // 3. Save user info
      localStorage.setItem("user_id", loginRes.data.user_id);
      localStorage.setItem("role", loginRes.data.role);

      setMessage("Registered & logged in successfully!");

      // 4. Redirect
      if (loginRes.data.role === "ADMIN") {
        navigate("/admin");
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
    <div>
      <h2>Register</h2>

      <input
        type="text"
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
      /><br/>

      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      /><br/>

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      /><br/>

      <button onClick={handleRegister}>Register</button>

      <p>{message}</p>

      <p>
        Already have an account?{" "}
        <span 
          style={{ color: "blue", cursor: "pointer" }}
          onClick={() => navigate("/login")}
        >
          Login here
        </span>
      </p>
    </div>
  );
}

export default Register;