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

      {/* HEADER */}
      <header className="dashboard-header">
        <h1>👩‍🎓 Student Portal</h1>
        <div className="header-actions">
          <button onClick={() => navigate("/my-orders")}>📜 My Orders</button>
          <button className="logout-btn" onClick={handleLogout}>🚪 Logout</button>
        </div>
      </header>

      {/* HERO */}
      <section className="hero-section">
        <h2>Welcome to SmartCanteen 👋</h2>
        <p>
          Order your food digitally, get a token, and skip long queues!
        </p>
        <button className="hero-btn" onClick={() => navigate("/student/menu")}>
          🍽 Start Ordering
        </button>
      </section>

      {/* STUDENT FEATURES */}
      <section className="dashboard-cards">

        <div className="card" onClick={() => navigate("/student/menu")}>
          <h3>🍔 Order Food</h3>
          <p>Choose from today’s menu and place your order</p>
        </div>

        <div className="card" onClick={() => navigate("/my-orders")}>
          <h3>📦 Track My Orders</h3>
          <p>Check food status and token number</p>
        </div>

        <div className="card logout-card" onClick={handleLogout}>
          <h3>🚪 Logout</h3>
          <p>Exit from Student Portal securely</p>
        </div>

      </section>

      {/* HOW IT WORKS */}
      <section className="how-it-works">
        <h2>How Students Use SmartCanteen ⚙️</h2>

        <div className="steps">
          <div className="step">1️⃣ Select Food</div>
          <div className="step">2️⃣ Place Order</div>
          <div className="step">3️⃣ Receive Token</div>
          <div className="step">4️⃣ Collect Food</div>
        </div>
      </section>

     <footer className="footer">
        <p>© 2026 🍽 SmartCanteen – Digital Food Ordering & Token System | CSI Project Expo</p>
      </footer>


    </div>
  );
}

export default StudentDashboard;