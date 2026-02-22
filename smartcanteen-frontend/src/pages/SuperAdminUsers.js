import React, { useEffect, useState } from "react";
import api from "../services/api";

function SuperAdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await api.get("/superadmin/users");
    setUsers(res.data);
  };

  const blockUser = async (id) => {
    await api.put(`/superadmin/block-user/${id}`);
    alert("User blocked");
    fetchUsers();
  };

  const unblockUser = async (id) => {
    await api.put(`/superadmin/unblock-user/${id}`);
    alert("User unblocked");
    fetchUsers();
  };

  return (
    <div>
      <h2>👑 Super Admin - Manage Users</h2>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map(user => (
            <tr key={user.user_id}>
              <td>{user.user_id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.status}</td>
              <td>
                {user.status === "ACTIVE" ? (
                  <button onClick={() => blockUser(user.user_id)}>Block</button>
                ) : (
                  <button onClick={() => unblockUser(user.user_id)}>Unblock</button>
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