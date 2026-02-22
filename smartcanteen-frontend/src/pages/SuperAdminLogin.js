import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

      localStorage.setItem("user_id", res.data.user_id);
      localStorage.setItem("role", res.data.role);

      navigate("/superadmin/dashboard");
    } catch (error) {
      alert("Invalid credentials");
    }
  };

  return (
    <div>
      <h2>Super Admin Login</h2>

      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      /><br /><br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      /><br /><br />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default SuperAdminLogin;