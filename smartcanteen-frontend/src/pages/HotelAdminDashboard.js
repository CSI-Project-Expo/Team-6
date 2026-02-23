import { useNavigate } from "react-router-dom";

function HotelAdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("role");
    localStorage.removeItem("hotel_id");
    navigate("/login");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🏨 Hotel Admin Dashboard</h2>

      <button onClick={() => navigate("/hoteladmin/menu")}>
        🍽 Manage Menu
      </button>
      <br /><br />
      <button onClick={() => navigate("/hoteladmin/validate-token")}>
  🎟 Validate Token
</button>
<br/><br/>

      <button onClick={() => navigate("/hoteladmin/orders")}>
        📦 View Orders
      </button>
      <br /><br />

      <button onClick={handleLogout}>
        🚪 Logout
      </button>
    </div>
  );
}

export default HotelAdminDashboard;