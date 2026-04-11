import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CreateHotelAdmin.css";

function CreateHotelAdmin() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const isValidEmail = (value) =>
    /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(value);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  const handleCreateAdmin = async () => {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName || !cleanEmail || !password) {
      alert("Please fill all fields");
      return;
    }

    if (!isValidEmail(cleanEmail)) {
      alert("Enter a valid email address");
      return;
    }

    const role = sessionStorage.getItem("role");
    if (role !== "ADMIN") {
      alert("Access denied");
      return;
    }

    try {
      const res = await axios.post(
        "http://127.0.0.1:5000/superadmin/create-hotel-admin",
        { name: cleanName, email: cleanEmail, password },
        { headers: { role } }
      );

      setMessage(res.data.message);
      setName("");
      setEmail("");
      setPassword("");
    } catch {
      setMessage("Failed to create hotel admin");
    }
  };

  return (
    <div className="cha-page">
      <header className="cha-header">
        <h1>Super Admin</h1>
        <div className="cha-header-actions">
          <button onClick={() => navigate("/superadmin/dashboard")}>Back</button>
          <button className="cha-logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <section className="cha-hero">
        <h2>Create Hotel Admin</h2>
        <p>Add a new hotel administrator</p>
      </section>

      <main className="cha-main">
        <div className="cha-card">
          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
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

          <button className="cha-primary" onClick={handleCreateAdmin}>
            Create Hotel Admin
          </button>

          {message && <p className="cha-msg">{message}</p>}
        </div>
      </main>

      <footer className="cha-footer">2026 Smart Canteen System</footer>
    </div>
  );
}

export default CreateHotelAdmin;
