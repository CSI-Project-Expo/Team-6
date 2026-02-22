import { useEffect, useState } from "react";
import axios from "axios";

function HotelOrders() {
  const [orders, setOrders] = useState([]);
  const hotelId = localStorage.getItem("hotel_id");

  useEffect(() => {
    axios.get(`http://127.0.0.1:5000/hoteladmin/orders/${hotelId}`)
      .then(res => setOrders(res.data));
  }, [hotelId]);

  const updateStatus = async (orderId, status) => {
    await axios.put("http://127.0.0.1:5000/hoteladmin/update-order", {
      order_id: orderId,
      status
    });
    window.location.reload();
  };

  return (
    <div>
      <h2>Orders</h2>

      {orders.map(o => (
        <div key={o.order_id}>
          Order #{o.order_id} - {o.status} - ₹{o.total_amount}

          <button onClick={() => updateStatus(o.order_id,"PREPARING")}>Preparing</button>
          <button onClick={() => updateStatus(o.order_id,"READY")}>Ready</button>
          <button onClick={() => updateStatus(o.order_id,"COLLECTED")}>Collected</button>
        </div>
      ))}
    </div>
  );
}

export default HotelOrders;