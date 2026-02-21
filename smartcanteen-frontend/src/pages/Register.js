import React, { useState } from "react";
import api from "../services/api";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("STUDENT");
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
  try {
    const res = await api.post("/auth/register", {
      name,
      email,
      password,
      role
    });

    console.log(res.data);
    alert("Registered successfully!");
  } catch (err) {
    console.log("ERROR:", err.response?.data || err.message);
    alert("Registration failed");
  }
};

  return (
    <div>
      <h2>Register</h2>

      <input placeholder="Name" onChange={(e) => setName(e.target.value)} /><br/>

      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} /><br/>

      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} /><br/>

      <select onChange={(e) => setRole(e.target.value)}>
        <option value="STUDENT">Student</option>
        <option value="ADMIN">Admin</option>
        <option value="HOTEL_ADMIN">Hotel Admin</option>
      </select><br/>

      <button onClick={handleRegister}>Register</button>

      <p>{message}</p>
    </div>
  );
}

export default Register;