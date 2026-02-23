import { useNavigate } from "react-router-dom";

function StudentDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🎓 Student Dashboard</h2>

      <button onClick={() => navigate("/student/menu")}>
        🍽 Order Food
      </button>
      <br /><br />

      <button onClick={() => navigate("/my-orders")}>
        📜 My Orders
      </button>
      <br /><br />

      <button onClick={handleLogout}>
        🚪 Logout
      </button>
    </div>
  );
}

export default StudentDashboard;