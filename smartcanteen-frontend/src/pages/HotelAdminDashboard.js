import { useNavigate } from "react-router-dom";
import "./HotelAdminDashboard.css";

function HotelAdminDashboard() {
  const navigate = useNavigate();
  const userName = sessionStorage.getItem("user_name") || "Hotel Admin";

  const handleLogout = () => {
    sessionStorage.removeItem("user_id");
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("hotel_id");
    sessionStorage.removeItem("user_name");
    navigate("/login");
  };

  return (
    <div className="ha-dashboard">
      <header className="ha-header">
        <h1>Hotel Admin Portal</h1>
        <div className="ha-header-actions">
          <button className="ha-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <section className="ha-hero">
        <h2>Welcome, {userName}</h2>
        <p>Manage menu, pickup slots, orders and token validation from one place.</p>
      </section>

      <section className="ha-cards">
        <div className="ha-card" onClick={() => navigate("/hoteladmin/menu")}>
          <h3>Manage Menu</h3>
          <p>Add, edit and update food items</p>
        </div>

        <div className="ha-card" onClick={() => navigate("/hoteladmin/orders")}>
          <h3>View Orders</h3>
          <p>Track and manage incoming orders</p>
        </div>

        <div className="ha-card" onClick={() => navigate("/hoteladmin/kds")}>
          <h3>Kitchen Display (KDS)</h3>
          <p>Live board for New, Preparing, Ready, Collected</p>
        </div>

        <div className="ha-card" onClick={() => navigate("/hoteladmin/validate-token")}>
          <h3>Validate Token</h3>
          <p>Verify student food tokens</p>
        </div>

        <div className="ha-card" onClick={() => navigate("/hoteladmin/pickup-slots")}>
          <h3>Pickup Slots</h3>
          <p>Add and manage pickup time slots</p>
        </div>

        <div className="ha-card ha-card-logout" onClick={handleLogout}>
          <h3>Logout</h3>
          <p>Exit Hotel Admin Portal securely</p>
        </div>
      </section>

      <section className="ha-how">
        <h2>How Hotel Admin Workflow Works</h2>
        <div className="ha-steps">
          <div className="ha-step">1. Manage Menu</div>
          <div className="ha-step">2. Configure Slots</div>
          <div className="ha-step">3. Receive Orders</div>
          <div className="ha-step">4. Validate Token</div>
          <div className="ha-step">5. Serve Food</div>
        </div>
      </section>

      <footer className="ha-footer">
        <p>2026 SmartCanteen - Digital Food Ordering and Token System</p>
      </footer>
    </div>
  );
}

export default HotelAdminDashboard;
