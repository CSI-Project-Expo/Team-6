import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SuperAdminUsers.css";

function SuperAdminUsers() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

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
      
      {/* GRADIENT STRIP — SAME AS STUDENT */}
      <div className="hero-section">
        <h2>👥 Manage Users</h2>
      </div>

      {/* PAGE CONTENT */}
      <div className="superadmin-card">
        <button className="back-btn" onClick={() => navigate("/superadmin/dashboard")}>
          ⬅ Back
        </button>

        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th><th>Name</th><th>Email</th>
              <th>Role</th><th>Status</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
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

      {/* ✅ SAME FOOTER CLASS AS STUDENT */}
      <div className="footer">
        © 2026 Smart Canteen System
      </div>
    </div>
  );
}

export default SuperAdminUsers;