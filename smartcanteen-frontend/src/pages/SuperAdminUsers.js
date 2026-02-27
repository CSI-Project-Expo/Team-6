import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SuperAdminUsers.css";

function SuperAdminUsers() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const currentUserId = Number(localStorage.getItem("user_id"));

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

  const updateUserStatus = async (userId, nextStatus) => {
    try {
      const endpoint =
        nextStatus === "BLOCKED"
          ? `http://127.0.0.1:5000/superadmin/block-user/${userId}`
          : `http://127.0.0.1:5000/superadmin/unblock-user/${userId}`;

      await axios.put(endpoint, {}, { headers: { role } });
      fetchUsers();
    } catch (error) {
      console.log(error);
      alert("Failed to update user status");
    }
  };

  return (
    <div className="dashboard-wrapper">
      <div className="hero-section">
        <h2>Manage Users</h2>
        <p>View, control, and secure access across all users.</p>
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

        <div className="users-table-wrap">
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
                  <td>
                    <span className={u.status === "BLOCKED" ? "status-badge blocked" : "status-badge active"}>
                      {u.status}
                    </span>
                  </td>
                  <td>
                    {u.role === "ADMIN" || u.user_id === currentUserId ? (
                      <span className="action-na">N/A</span>
                    ) : u.status === "BLOCKED" ? (
                      <button
                        className="action-btn unblock-btn"
                        onClick={() => updateUserStatus(u.user_id, "ACTIVE")}
                      >
                        Unblock
                      </button>
                    ) : (
                      <button
                        className="action-btn block-btn"
                        onClick={() => updateUserStatus(u.user_id, "BLOCKED")}
                      >
                        Block
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="footer">2026 Smart Canteen System</div>
    </div>
  );
}

export default SuperAdminUsers;
