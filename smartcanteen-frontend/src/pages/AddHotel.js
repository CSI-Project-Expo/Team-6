import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AddHotel.css";

function AddHotel() {
  const [hotelName, setHotelName] = useState("");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleAddHotel = async () => {
    if (!hotelName || !location) {
      alert("Please fill all fields");
      return;
    }

    const role = localStorage.getItem("role");

    if (role !== "ADMIN") {
      alert("Access denied. Only Super Admin can add hotels.");
      return;
    }

    try {
      const res = await axios.post(
        "http://127.0.0.1:5000/superadmin/add-hotel",
        { hotel_name: hotelName, location },
        { headers: { role } }
      );

      setMessage(res.data.message);
      setHotelName("");
      setLocation("");
    } catch (error) {
      console.log(error);
      setMessage("Failed to add hotel");
    }
  };

  return (
    <div className="ah-page">
      {/* HEADER */}
      <header className="ah-header">
        <h1>Super Admin</h1>
        <button onClick={() => navigate("/superadmin/dashboard")}>
          ⬅ Back
        </button>
      </header>

      {/* MAIN */}
      <main className="ah-main">
        <div className="superadmin-card">
          <h2>➕ Add Hotel</h2>

          <div className="form-group">
            <label>Hotel Name</label>
            <input
              type="text"
              placeholder="Enter hotel name"
              value={hotelName}
              onChange={(e) => setHotelName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              placeholder="Enter location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <button onClick={handleAddHotel}>Add Hotel</button>

          {message && <p className="status-msg">{message}</p>}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="ah-footer">
        © 2026 Smart Canteen System
      </footer>
    </div>
  );
}

export default AddHotel;