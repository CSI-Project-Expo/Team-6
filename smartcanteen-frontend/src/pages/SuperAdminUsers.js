import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SuperAdminUsers.css";

function SuperAdminUsers() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await axios.get("http://127.0.0.1:5000/superadmin/users", {
      headers: { role }
    });
    setUsers(res.data);
  };

  return (
    <div className="dashboard-wrapper">
      <div className="hero-section">
        <h2>Manage Users</h2>
      </div>

      <div className="superadmin-card">
        <div className="users-actions">
          <button className="back-btn" onClick={() => navigate("/superadmin/dashboard")}>
            Back
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th><th>Name</th><th>Email</th>
              <th>Role</th><th>Status</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.user_id}>
                <td>{u.user_id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.status}</td>
                <td>---</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="footer">2026 Smart Canteen System</div>
    </div>
  );
}

export default SuperAdminUsers;
