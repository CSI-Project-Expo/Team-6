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
    <div className="dashboard-page">
      
      {/* HEADER */}
      <div className="dashboard-header">
        <h2>🏨 Hotel Admin Dashboard</h2>
        <p>Manage menu, validate tokens & track orders easily</p>
      </div>

      {/* ACTION CARDS */}
      <div className="dashboard-actions">
        <div
          className="dashboard-card"
          onClick={() => navigate("/hoteladmin/menu")}
        >
          🍽
          <h3>Manage Menu</h3>
          <p>Add, edit and update food items</p>
        </div>

        <div
          className="dashboard-card"
          onClick={() => navigate("/hoteladmin/validate-token")}
        >
          🎟
          <h3>Validate Token</h3>
          <p>Verify customer food tokens</p>
        </div>

        <div
          className="dashboard-card"
          onClick={() => navigate("/hoteladmin/orders")}
        >
          📦
          <h3>View Orders</h3>
          <p>Track and manage incoming orders</p>
        </div>
      </div>

      {/* FOOTER */}
      <div className="dashboard-footer">
        <button className="logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </div>

    </div>
  );
}

export default HotelAdminDashboard;