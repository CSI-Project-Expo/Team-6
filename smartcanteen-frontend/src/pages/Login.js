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

      // Redirect based on role
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
      setMessage("Login failed. Invalid email or password.");
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      /><br/>

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br/>

      <button onClick={handleLogin}>Login</button>

      <p>{message}</p>
      <hr />

      <p>Don’t have an account?</p>
      <button onClick={() => navigate("/register")}>
        Register Here
      </button>
    </div>
  );
}

export default Login;