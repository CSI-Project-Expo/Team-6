import { useNavigate } from "react-router-dom";
import "./SuperAdminDashboard.css";

function SuperAdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="dashboard-wrapper">

      {/* HEADER */}
      <header className="dashboard-header">
        <h1>👑 Super Admin Portal</h1>
        <div className="header-actions">
          <button className="logout-btn" onClick={handleLogout}>🚪 Logout</button>
        </div>
      </header>

      {/* HERO */}
      <section className="hero-section">
        <h2>Welcome Super Admin 👋</h2>
        <p>
          Manage hotels, admins, and users from one centralized dashboard.
        </p>
      </section>

      {/* DASHBOARD CARDS */}
      <section className="dashboard-cards">

        <div className="card" onClick={() => navigate("/superadmin/add-hotel")}>
          <h3>🏨 Add Hotel</h3>
          <p>Register new hotels into SmartCanteen</p>
        </div>

        <div className="card" onClick={() => navigate("/superadmin/create-hotel-admin")}>
          <h3>👨‍🍳 Create Hotel Admin</h3>
          <p>Create login accounts for hotel managers</p>
        </div>

        <div className="card" onClick={() => navigate("/superadmin/assign-hotel-admin")}>
          <h3>🔗 Assign Hotel Admin</h3>
          <p>Link hotel admins to hotels</p>
        </div>

        <div className="card" onClick={() => navigate("/superadmin/users")}>
          <h3>👥 Manage Users</h3>
          <p>View and control all system users</p>
        </div>

        <div className="card" onClick={() => navigate("/superadmin/view-hotels")}>
          <h3>📊 View Hotels</h3>
          <p>Monitor all registered hotels</p>
        </div>

        <div className="card logout-card" onClick={handleLogout}>
          <h3>🚪 Logout</h3>
          <p>Exit Super Admin Portal securely</p>
        </div>

      </section>

      {/* HOW SUPER ADMIN WORKS */}
      <section className="how-it-works">
        <h2>How Super Admin Manages SmartCanteen ⚙️</h2>

        <div className="steps">
          <div className="step">1️⃣ Add Hotels</div>
          <div className="step">2️⃣ Create Admins</div>
          <div className="step">3️⃣ Assign Hotels</div>
          <div className="step">4️⃣ Manage Users</div>
          <div className="step">5️⃣ Monitor System</div>
        </div>
      </section>

      {/* FOOTER */}
     <footer className="footer">
        <p>© 2026 🍽 SmartCanteen – Digital Food Ordering & Token System | CSI Project Expo</p>
      </footer>

    </div>
  );
}

export default SuperAdminDashboard;