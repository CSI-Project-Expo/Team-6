import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./StudentMenu.css";

function StudentMenu() {
  const navigate = useNavigate();
  const userId = Number(localStorage.getItem("user_id"));

  const [menu, setMenu] = useState([]);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [cartItems, setCartItems] = useState([]);

  const hotelId = 1;

  useEffect(() => {
    if (!userId) {
      alert("Please login again");
      navigate("/login");
    }
  }, [userId, navigate]);

  useEffect(() => {
    axios.get(`http://127.0.0.1:5000/student/menu/${hotelId}`)
      .then(res => setMenu(res.data))
      .catch(err => console.error(err));
  }, [hotelId]);

  useEffect(() => {
    axios.get(`http://127.0.0.1:5000/student/pickup-slots/${hotelId}`)
      .then(res => setSlots(res.data))
      .catch(err => console.error(err));
  }, [hotelId]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const addToCart = (item) => {
    const exists = cartItems.find(i => i.menu_item_id === item.menu_item_id);
    if (exists) {
      setCartItems(cartItems.map(i =>
        i.menu_item_id === item.menu_item_id
          ? { ...i, quantity: i.quantity + 1 }
          : i
      ));
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleConfirmOrder = async () => {
    if (!selectedSlot) return alert("Please select a pickup slot");
    if (cartItems.length === 0) return alert("Cart is empty");

    const orderData = {
      user_id: userId,
      hotel_id: hotelId,
      slot_id: Number(selectedSlot),
      total_amount: totalAmount,
      items: cartItems.map(item => ({
        menu_item_id: item.menu_item_id,
        quantity: item.quantity,
        price: item.price
      }))
    };

    try {
      const res = await axios.post(
        "http://127.0.0.1:5000/student/order",
        orderData
      );
      alert("Order placed successfully");
      navigate(`/token/${res.data.order_id}`);
    } catch (error) {
      alert("Order failed");
    }
  };

  return (
    <div className="menu-wrapper">

      {/* HEADER */}
      <header className="menu-header">
        <h1>🍽 SmartCanteen</h1>
        <p>Order food. Skip the queue.</p>
        <div className="menu-actions">
          <button onClick={() => navigate("/my-orders")}>📜 My Orders</button>
          <button onClick={() => navigate(-1)}>⬅ Back</button>
          <button className="logout-btn" onClick={handleLogout}>🚪 Logout</button>
        </div>
      </header>

      <div className="menu-layout">

        {/* MENU */}
        <div className="menu-section">
          <h2>Menu</h2>
          <div className="menu-grid">
            {menu.map(item => (
              <div className="menu-card" key={item.menu_item_id}>
                <h3>{item.item_name}</h3>
                <p className="price">₹{item.price}</p>
                <button onClick={() => addToCart(item)}>➕ Add</button>
              </div>
            ))}
          </div>
        </div>

        {/* CART */}
        <div className="cart-section">
          <h2>🛒 Your Cart</h2>

          {cartItems.length === 0 && (
            <p className="empty-cart">No items added</p>
          )}

          {cartItems.map(item => (
            <div className="cart-item" key={item.menu_item_id}>
              <span>{item.item_name} x {item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}

          <hr />

          <h3>Total: ₹{totalAmount}</h3>

          <label>Pickup Slot</label>
          <select value={selectedSlot} onChange={(e) => setSelectedSlot(e.target.value)}>
            <option value="">-- Choose Slot --</option>
            {slots.map(slot => (
              <option key={slot.slot_id} value={slot.slot_id}>
                {slot.start_time} - {slot.end_time}
              </option>
            ))}
          </select>

          <button className="confirm-btn" onClick={handleConfirmOrder}>
            ✅ Confirm Order
          </button>
        </div>

      </div>

      {/* FOOTER */}
      <footer className="footer">
        <p>© 2026 🍽 SmartCanteen – Digital Food Ordering & Token System | CSI Project Expo</p>
      </footer>

    </div>
  );
}

export default StudentMenu;