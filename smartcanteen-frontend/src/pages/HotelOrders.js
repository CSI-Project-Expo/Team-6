import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import "./HotelOrders.css";

function HotelOrders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  // TEMP hotel_id (later from login)
  const hotelId = 1;

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get(`/hoteladmin/orders/${hotelId}`);
      setOrders(res.data);
    } catch (error) {
      console.log(error);
      alert("Failed to fetch orders");
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await api.put("/hoteladmin/update-order", {
        order_id: orderId,
        status: status,
      });

      alert("Order status updated");
      fetchOrders();
    } catch (error) {
      console.log(error);
      alert("Update failed");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="hotel-page">
      {/* HEADER */}
      <div className="hotel-header">
        <h2>🏨 Hotel Admin - Orders</h2>
        <div className="hotel-actions">
          <button onClick={() => navigate(-1)}>⬅ Back</button>
          <button className="logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="table-wrapper">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Student</th>
              <th>Total</th>
              <th>Status</th>
              <th>Order Date</th>
              <th>Update Status</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.order_id}>
                <td>{order.order_id}</td>
                <td>{order.student_name}</td>
                <td>₹{order.total_amount}</td>
                <td>
                  <span className={`status ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </td>
                <td>{order.order_date}</td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateStatus(order.order_id, e.target.value)
                    }
                  >
                    <option value="PLACED">PLACED</option>
                    <option value="PREPARING">PREPARING</option>
                    <option value="READY">READY</option>
                    <option value="COLLECTED">COLLECTED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* FOOTER */}
      <div className="footer">
        © 2026 Smart Canteen System | All Rights Reserved
      </div>
    </div>
  );
}

export default HotelOrders;