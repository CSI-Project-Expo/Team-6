import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SuperAdminUsers() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  // fetch users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/superadmin/users");
      setUsers(res.data);
    } catch (error) {
      console.log(error);
      alert("Failed to fetch users");
    }
  };

  const blockUser = async (userId) => {
    if (!window.confirm("Are you sure to block this user?")) return;

    try {
      await axios.put(`http://127.0.0.1:5000/superadmin/block-user/${userId}`);
      alert("User blocked ✅");
      fetchUsers();
    } catch (error) {
      console.log(error);
      alert("Failed to block user");
    }
  };

  return (
    <div>
      <h2>👥 Manage Users</h2>

      <button onClick={() => navigate("/superadmin")}>⬅ Back</button>

      <table border="1" cellPadding="10" style={{ marginTop: "20px" }}>
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
              <td>{user.status}</td>
              <td>
                {user.status === "ACTIVE" ? (
                  <button onClick={() => blockUser(user.user_id)}>
                    🚫 Block
                  </button>
                ) : (
                  "Blocked"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SuperAdminUsers;