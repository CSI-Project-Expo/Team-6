import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ViewHotels.css";

function ViewHotels() {
  const [hotels, setHotels] = useState([]);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const res = await axios.get(
        "http://127.0.0.1:5000/superadmin/hotels",
        { headers: { role } }
      );
      setHotels(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch hotels ❌");
    }
  };

  return (
    <div className="vh-page">
      {/* HEADER */}
      <header className="vh-header">
        <h1>Super Admin</h1>
        <button onClick={() => navigate("/superadmin/dashboard")}>
          ⬅ Back
        </button>
      </header>

      {/* HERO */}
      <section className="vh-hero">
        <h2>🏨 All Hotels</h2>
        <p>View all registered hotels and assigned admins</p>
      </section>

      {/* MAIN */}
      <main className="vh-main">
        <div className="vh-card">
          <table className="vh-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Hotel Name</th>
                <th>Location</th>
                <th>Status</th>
                <th>Assigned Admin</th>
              </tr>
            </thead>
            <tbody>
              {hotels.map((hotel) => (
                <tr key={hotel.hotel_id}>
                  <td>{hotel.hotel_id}</td>
                  <td>{hotel.hotel_name}</td>
                  <td>{hotel.location}</td>
                  <td>
                    <span
                      className={
                        hotel.is_active ? "status active" : "status inactive"
                      }
                    >
                      {hotel.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>{hotel.admin_name || "Not Assigned"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="vh-footer">
        © 2026 Smart Canteen System
      </footer>
    </div>
  );
}

export default ViewHotels;