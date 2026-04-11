import React from "react";
import { useNavigate } from "react-router-dom";
import "./LegacyPages.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const userName = sessionStorage.getItem("user_name") || "Hotel Admin";

  const handleLogout = () => {
    sessionStorage.removeItem("user_id");
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("user_name");
    navigate("/login");
  };

  return (
    <div className="lp-page">
      <div className="lp-card narrow">
        <h2 className="lp-title">Welcome, {userName}</h2>
        <p className="lp-subtitle">Manage menu, orders and operational updates.</p>

        <div className="lp-actions">
          <button className="lp-btn secondary" onClick={() => navigate("/hoteladmin/menu")}>
            View Menu
          </button>
          <button className="lp-btn" onClick={() => navigate("/hoteladmin/add-menu")}>
            Add Menu Item
          </button>
          <button className="lp-btn secondary" onClick={() => navigate("/hoteladmin/orders")}>
            View Orders
          </button>
          <button className="lp-btn" onClick={() => navigate("/hoteladmin/update-order")}>
            Update Order Status
          </button>
          <button className="lp-btn danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
