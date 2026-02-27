import { useNavigate } from "react-router-dom";
import "./HotelAdminDashboard.css";

function HotelAdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("role");
    localStorage.removeItem("hotel_id");
    navigate("/login");
  };

  return (
    <div className="dashboard-wrapper">

      {/* HEADER */}
      <header className="dashboard-header">
        <h1>🏨 Hotel Admin Portal</h1>
        <div className="header-actions">
          <button className="logout-btn" onClick={handleLogout}>🚪 Logout</button>
        </div>
      </header>

      {/* HERO */}
      <section className="hero-section">
        <h2>Welcome Hotel Admin 👋</h2>
        <p>
          Manage menu, validate tokens and track customer orders efficiently.
        </p>
      </section>

      {/* DASHBOARD CARDS */}
      <section className="dashboard-cards">

        <div className="card" onClick={() => navigate("/hoteladmin/menu")}>
          <h3>🍽 Manage Menu</h3>
          <p>Add, edit and update food items</p>
        </div>

        <div className="card" onClick={() => navigate("/hoteladmin/orders")}>
          <h3>📦 View Orders</h3>
          <p>Track and manage incoming orders</p>
        </div>

        <div className="card" onClick={() => navigate("/hoteladmin/validate-token")}>
          <h3>🎟 Validate Token</h3>
          <p>Verify student food tokens</p>
        </div>

        <div className="card logout-card" onClick={handleLogout}>
          <h3>🚪 Logout</h3>
          <p>Exit Hotel Admin Portal securely</p>
        </div>

      </section>

      {/* HOW HOTEL ADMIN WORKS */}
      <section className="how-it-works">
        <h2>How Hotel Admin Manages Orders ⚙️</h2>

        <div className="steps">
          <div className="step">1️⃣ Manage Menu</div>
          <div className="step">2️⃣ Receive Orders</div>
          <div className="step">3️⃣ Validate Token</div>
          <div className="step">4️⃣ Update Status</div>
          <div className="step">5️⃣ Serve Food</div>
        </div>
      </section>

      <footer className="footer">
        <p>© 2026 🍽 SmartCanteen – Digital Food Ordering & Token System | CSI Project Expo</p>
      </footer>

    </div>
  );
}

export default HotelAdminDashboard;