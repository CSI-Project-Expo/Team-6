import { useNavigate } from "react-router-dom";
import "./SuperAdminDashboard.css";

function SuperAdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="page-wrapper">
      {/* HEADER */}
      <header className="dashboard-header">
        <h1>👑 Super Admin</h1>
        <button className="header-logout" onClick={handleLogout}>
          Logout
        </button>
      </header>

      {/* MAIN (SAME AS STUDENT DASHBOARD) */}
      <main className="dashboard-main">
        <h2 className="dashboard-title">Dashboard</h2>

        <div className="dashboard-grid">
          <div className="dashboard-card" onClick={() => navigate("/superadmin/add-hotel")}>
            ➕ Add Hotel
          </div>

          <div className="dashboard-card" onClick={() => navigate("/superadmin/create-hotel-admin")}>
            👨‍🍳 Create Hotel Admin
          </div>

          <div className="dashboard-card" onClick={() => navigate("/superadmin/assign-hotel-admin")}>
            🔗 Assign Hotel Admin
          </div>

          <div className="dashboard-card" onClick={() => navigate("/superadmin/users")}>
            👥 Manage Users
          </div>

          <div className="dashboard-card" onClick={() => navigate("/superadmin/view-hotels")}>
            🏨 View Hotels
          </div>

          <div className="dashboard-card logout-card" onClick={handleLogout}>
            🚪 Logout
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="dashboard-footer">
        © 2026 Smart Canteen System
      </footer>
    </div>
  );
}

export default SuperAdminDashboard;