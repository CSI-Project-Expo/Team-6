import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SuperAdminDashboard.css";

function SuperAdminDashboard() {
  const navigate = useNavigate();

  // Set body background white for this page
  useEffect(() => {
    document.body.style.background = "white";
    return () => {
      document.body.style.background = ""; // reset when leaving
    };
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("role");
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  const cards = [
    { name: "Manage Users", emoji: "👥", route: "/superadmin/users" },
    { name: "Manage Hotels", emoji: "🏨", route: "/superadmin/hotels" },
    { name: "Manage Bookings", emoji: "📅", route: "/superadmin/bookings" },
    { name: "Reports", emoji: "📊", route: "/superadmin/reports" },
  ];

  return (
    <div className="dashboard-wrapper">

      {/* HEADER */}
      <div className="dashboard-header">
        <h1>Super Admin</h1>
        <div className="header-actions">
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* HERO SECTION */}
      <div className="hero-section">
        <h2>🌟 Welcome, Super Admin!</h2>
        <p>Manage users, hotels, bookings, and view reports effortlessly.</p>
        <button
          className="hero-btn"
          onClick={() => navigate("/superadmin/users")}
        >
          Get Started
        </button>
      </div>

      {/* DASHBOARD CARDS */}
      <div className="dashboard-cards">
        {cards.map((card) => (
          <div
            key={card.name}
            className="card"
            onClick={() => navigate(card.route)}
          >
            <span className="card-emoji">{card.emoji}</span>
            <h3>{card.name}</h3>
          </div>
        ))}

        {/* Logout Card */}
        <div className="card logout-card" onClick={handleLogout}>
          <span className="card-emoji">🔒</span>
          <h3>Logout</h3>
        </div>
      </div>

      {/* FOOTER */}
      <div className="footer">
        &copy; 2026 Smart Canteen System. All rights reserved.
      </div>

    </div>
  );
}

export default SuperAdminDashboard;