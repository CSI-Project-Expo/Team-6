import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

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

    // Redirect based on role after successful login
localStorage.setItem("user_id", res.data.user_id);
localStorage.setItem("role", res.data.role);

    if (res.data.role === "ADMIN") {
      navigate("/superadmin");
    } else if (res.data.role === "HOTEL_ADMIN") navigate("/hoteladmin");
    else {
      navigate("/student");
    }

  } catch (err) {
    setMessage("Login failed");
  }
};

  return (
    <div>
      <h2>Login</h2>

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

      <button onClick={handleLogin}>Login</button>

      <p>{message}</p>
      <hr />

      {/* Register option */}
      <p>Don’t have an account?</p>
      <button onClick={() => navigate("/register")}>
        Register Here
      </button>
    
    </div>
  );
}

export default Login;