import { useNavigate } from "react-router-dom";
import "./StudentDashboard.css";

function StudentDashboard() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("user_name") || "Student";

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("role");
    localStorage.removeItem("user_name");
    navigate("/login");
  };

  return (
    <div className="st-dashboard">
      <header className="st-header">
        <h1>ðŸ‘©â€ðŸŽ“ Student Portal</h1>
        <div className="st-header-actions">
          <button className="st-orders-btn" onClick={() => navigate("/my-orders")}>
            ðŸ“œ My Orders
          </button>
          <button className="st-logout-btn" onClick={handleLogout}>
            ðŸšª Logout
          </button>
        </div>
      </header>

      <section className="st-hero">
        <h2>Welcome, {userName} ðŸ‘‹</h2>
        <p>Order your food digitally, get a token, and skip long queues!</p>
        <button className="st-hero-btn" onClick={() => navigate("/student/menu")}>
          ðŸ½ Start Ordering
        </button>
      </section>

      <section className="st-cards">
        <div className="st-card" onClick={() => navigate("/student/menu")}>
          <h3>ðŸ” Order Food</h3>
          <p>Choose from today&apos;s menu and place your order</p>
        </div>

        <div className="st-card" onClick={() => navigate("/my-orders")}>
          <h3>ðŸ“¦ Track My Orders</h3>
          <p>Check food status and token number</p>
        </div>

        <div className="st-card st-card-logout" onClick={handleLogout}>
          <h3>ðŸšª Logout</h3>
          <p>Exit from Student Portal securely</p>
        </div>
      </section>

      <section className="st-how">
        <h2>How Students Use SmartCanteen âš™ï¸</h2>
        <div className="st-steps">
          <div className="st-step">1ï¸âƒ£ Select Food</div>
          <div className="st-step">2ï¸âƒ£ Place Order</div>
          <div className="st-step">3ï¸âƒ£ Receive Token</div>
          <div className="st-step">4ï¸âƒ£ Collect Food</div>
        </div>
      </section>

       <footer className="st-footer">
        <p>Â© 2026 ðŸ½ SmartCanteen - Digital Food Ordering & Token System | CSI Project Expo</p>
      </footer>
    </div>
  );
}

export default StudentDashboard;

