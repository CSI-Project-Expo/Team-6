import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateHotelAdmin() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleCreateAdmin = async () => {
    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    const role = localStorage.getItem("role");

    if (role !== "ADMIN") {
      alert("Access denied. Only Super Admin can create hotel admins.");
      return;
    }

    try {
      const res = await axios.post(
        "http://127.0.0.1:5000/superadmin/create-hotel-admin",
        {
          name,
          email,
          password
        },
        {
          headers: {
            role: role   // 👈 IMPORTANT
          }
        }
      );

      setMessage(res.data.message);
      setName("");
      setEmail("");
      setPassword("");

    } catch (error) {
      console.log(error);
      setMessage("Failed to create hotel admin");
    }
  };

  return (
    <div>
      <h2>👨‍🍳 Create Hotel Admin</h2>

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      /><br /><br />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      /><br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br /><br />

      <button onClick={handleCreateAdmin}>Create Hotel Admin</button>

      <p>{message}</p>

      <button onClick={() => navigate("/superadmin/dashboard")}>⬅ Back</button>
    </div>
  );
}

export default CreateHotelAdmin;