import React from "react";
import { useNavigate } from "react-router-dom";

function SuperAdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div>
      <h2>Super Admin Dashboard</h2>

      <button onClick={() => navigate("/superadmin/add-hotel")}>
        ➕ Add Hotel
      </button>

      <br /><br />

      <button onClick={() => navigate("/superadmin/view-hotels")}>
        🏨 View Hotels
      </button>

      <br /><br />

      <button onClick={() => navigate("/superadmin/add-hotel-admin")}>
        👤 Add Hotel Admin
      </button>

      <br /><br />

      <button onClick={() => navigate("/superadmin/view-hotel-admins")}>
        📋 View Hotel Admins
      </button>

      <br /><br />

      <button onClick={handleLogout}>🚪 Logout</button>
    </div>
  );
}

export default SuperAdminDashboard;