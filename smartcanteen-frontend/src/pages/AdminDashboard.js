import React from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div>
      <h2>👨‍🍳 Hotel Admin Dashboard</h2>

      <button onClick={() => navigate("/hoteladmin/menu")}>
        📋 View Menu
      </button>
      <br /><br />

      <button onClick={() => navigate("/hoteladmin/add-menu")}>
        ➕ Add Menu Item
      </button>
      <br /><br />

      <button onClick={() => navigate("/hoteladmin/orders")}>
        📦 View Orders
      </button>
      <br /><br />

      <button onClick={() => navigate("/hoteladmin/update-order")}>
        🔄 Update Order Status
      </button>
      <br /><br />

      <button onClick={handleLogout}>
        🚪 Logout
      </button>
    </div>
  );
}

export default AdminDashboard;