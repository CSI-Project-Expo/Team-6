import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ViewHotels.css";

function ViewHotels() {
  const [hotels, setHotels] = useState([]);
  const navigate = useNavigate();
  const role = sessionStorage.getItem("role");

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

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
      alert("Failed to fetch hotels");
    }
  };

  return (
    <div className="vhp-page">
      <header className="vhp-header">
        <h1>SmartCanteen Admin</h1>
        <div className="vhp-header-actions">
          <button className="vhp-back-btn" onClick={() => navigate("/superadmin/dashboard")}>
            Back to Dashboard
          </button>
          <button className="vhp-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <section className="vhp-hero">
        <h2>All Registered Hotels</h2>
        <p>
          View the list of hotels, their locations, current status and assigned administrators.
        </p>
      </section>

      <main className="vhp-main">
        <div className="vhp-card">
          <h3 className="vhp-table-title">Hotel Directory</h3>

          <table className="vhp-table">
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
                        hotel.is_active
                          ? "vhp-status vhp-active"
                          : "vhp-status vhp-inactive"
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

          {hotels.length === 0 && (
            <p className="vhp-empty">No hotels found in the system.</p>
          )}
        </div>
      </main>

      <footer className="vhp-footer">2026 Smart Canteen System | Super Admin Module</footer>
    </div>
  );
}

export default ViewHotels;
