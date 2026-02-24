import { useNavigate } from "react-router-dom";
import "./StudentDashboard.css";

function StudentDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="dashboard-wrapper">

      {/* HERO SECTION */}
      <div className="hero-section">
        <h1>🍽 SmartCanteen</h1>
        <p>Skip the Queue. Order Smart. Track Your Food in Real Time.</p>
      </div>

      {/* MAIN DASHBOARD CARDS */}
      <div className="dashboard-cards">

        <div className="card" onClick={() => navigate("/student/menu")}>
          <h2>🍔 Order Food</h2>
          <p>Browse menu and place your order instantly</p>
        </div>

        <div className="card" onClick={() => navigate("/my-orders")}>
          <h2>📜 My Orders</h2>
          <p>Track your order status and token number</p>
        </div>

        <div className="card logout-card" onClick={handleLogout}>
          <h2>🚪 Logout</h2>
          <p>Securely logout from your account</p>
        </div>

      </div>

      {/* HOW IT WORKS SECTION */}
      <div className="how-it-works">
        <h2>⚙️ How SmartCanteen Works</h2>

        <div className="steps">
          <div className="step">1️⃣ Choose Food</div>
          <div className="step">2️⃣ Get Token</div>
          <div className="step">3️⃣ Track Order</div>
          <div className="step">4️⃣ Pick Up</div>
        </div>
      </div>

    </div>
  );
}

export default StudentDashboard;