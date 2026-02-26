import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SuperAdminUsers.css"; // import the CSS

function SuperAdminUsers() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const role = localStorage.getItem("role");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/superadmin/users", {
        headers: { role: role }
      });
      setUsers(res.data);
    } catch (error) {
      console.log(error);
      alert("Failed to fetch users");
    }
  };

  const blockUser = async (userId) => {
    if (!window.confirm("Are you sure to block this user?")) return;

    try {
      await axios.put(
        `http://127.0.0.1:5000/superadmin/block-user/${userId}`,
        {},
        { headers: { role: role } }
      );
      alert("User blocked ✅");
      fetchUsers();
    } catch (error) {
      console.log(error);
      alert("Failed to block user");
    }
  };

  const unblockUser = async (userId) => {
    if (!window.confirm("Unblock this user?")) return;

    try {
      await axios.put(
        `http://127.0.0.1:5000/superadmin/unblock-user/${userId}`,
        {},
        { headers: { role: role } }
      );
      alert("User unblocked ✅");
      fetchUsers();
    } catch (error) {
      console.log(error);
      alert("Failed to unblock user");
    }
  };

  return (
    <div className="superadmin-page">
      <div className="superadmin-card users-card">
        <h2>👥 Manage Users</h2>

        <button className="back-btn" onClick={() => navigate("/superadmin/dashboard")}>
          ⬅ Back
        </button>

        <div className="table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.user_id}>
                  <td>{user.user_id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        user.status === "ACTIVE" ? "active" : "blocked"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td>
                    {user.status === "ACTIVE" ? (
                      <button
                        className="block-btn"
                        onClick={() => blockUser(user.user_id)}
                      >
                        🚫 Block
                      </button>
                    ) : (
                      <button
                        className="unblock-btn"
                        onClick={() => unblockUser(user.user_id)}
                      >
                        ✅ Unblock
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default SuperAdminUsers;