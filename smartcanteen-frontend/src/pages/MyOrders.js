import React, { useEffect, useState } from "react";
import axios from "axios";

function MyOrders() {
  const userId = localStorage.getItem("user_id");
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:5000/student/orders/${userId}`)
      .then(res => setOrders(res.data))
      .catch(err => console.log(err));
  }, [userId]);

  return (
    <div>
      <h2>📜 My Orders</h2>

      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        orders.map(order => (
          <div key={order.order_id} style={{border:"1px solid gray", padding:"10px", margin:"10px"}}>
            <p><b>Order ID:</b> {order.order_id}</p>
            <p><b>Date:</b> {order.order_date}</p>
            <p><b>Total:</b> ₹{order.total_amount}</p>
            <p><b>Status:</b> {order.status}</p>
            <p><b>Token:</b> {order.token_code || "Not generated yet"}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default MyOrders;