import { useNavigate } from "react-router-dom";

function SuperAdminDashboard() {
  const navigate = useNavigate();
  const handleLogout = () => {
  localStorage.clear();
  navigate("/login");
};

  return (
    <div>
      <h2>👑 Super Admin Dashboard</h2>

      <button onClick={() => navigate("/superadmin/add-hotel")}>
        ➕ Add Hotel
      </button><br/><br/>

      <button onClick={() => navigate("/superadmin/create-hotel-admin")}>
        👨‍🍳 Create Hotel Admin
      </button><br/><br/>

      <button onClick={() => navigate("/superadmin/assign-hotel-admin")}>
        🔗 Assign Hotel Admin
      </button><br/><br/>

      <button onClick={() => navigate("/superadmin/users")}>
  👥 Manage Users
</button><br/><br/>

      <button onClick={() => navigate("/superadmin/view-hotels")}>
        🏨 View Hotels
      </button><br></br>
      <button onClick={handleLogout}>🚪 Logout</button>
    </div>
  );
}

export default SuperAdminDashboard;