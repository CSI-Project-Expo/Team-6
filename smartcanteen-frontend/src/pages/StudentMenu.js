import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./StudentMenu.css";

function StudentMenu() {
  const navigate = useNavigate();
  const userId = Number(localStorage.getItem("user_id"));

  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState("");
  const [menu, setMenu] = useState([]);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (!userId) {
      alert("Please login again");
      navigate("/login");
    }
  }, [userId, navigate]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/student/hotels")
      .then((res) => setHotels(res.data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (!selectedHotel) {
      setMenu([]);
      setSlots([]);
      setSelectedSlot("");
      setCartItems([]);
      return;
    }

    axios
      .get(`http://127.0.0.1:5000/student/menu/${selectedHotel}`)
      .then((res) => setMenu(res.data))
      .catch((err) => console.error(err));

    axios
      .get(`http://127.0.0.1:5000/student/pickup-slots/${selectedHotel}`)
      .then((res) => setSlots(res.data))
      .catch((err) => console.error(err));
  }, [selectedHotel]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const addToCart = (item) => {
    const exists = cartItems.find((i) => i.menu_item_id === item.menu_item_id);
    if (exists) {
      setCartItems(
        cartItems.map((i) =>
          i.menu_item_id === item.menu_item_id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      );
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleConfirmOrder = async () => {
    if (!selectedHotel) return alert("Please select a hotel first");
    if (!selectedSlot) return alert("Please select a pickup slot");
    if (cartItems.length === 0) return alert("Cart is empty");

    const orderData = {
      user_id: userId,
      hotel_id: Number(selectedHotel),
      slot_id: Number(selectedSlot),
      total_amount: totalAmount,
      items: cartItems.map((item) => ({
        menu_item_id: item.menu_item_id,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    try {
      const res = await axios.post("http://127.0.0.1:5000/student/order", orderData);
      alert("Order placed successfully");
      navigate(`/token/${res.data.order_id}`);
    } catch (error) {
      alert("Order failed");
    }
  };

  return (
    <div className="menu-wrapper">
      <header className="menu-header">
        <h1>SmartCanteen</h1>
        <p>Order food. Skip the queue.</p>
        <div className="menu-actions">
          <button onClick={() => navigate("/my-orders")}>My Orders</button>
          <button onClick={() => navigate(-1)}>Back</button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="hotel-select-bar">
        <h3>Choose Hotel</h3>
        {hotels.length === 0 && (
          <p className="empty-state">No active hotels available right now.</p>
        )}
        <div className="hotel-cards-grid">
          {hotels.map((hotel) => {
            const isSelected = String(hotel.hotel_id) === selectedHotel;
            return (
              <button
                key={hotel.hotel_id}
                type="button"
                className={`hotel-card ${isSelected ? "active" : ""}`}
                onClick={() => setSelectedHotel(String(hotel.hotel_id))}
              >
                <span className="hotel-name">{hotel.hotel_name}</span>
                <span className="hotel-location">{hotel.location}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="menu-layout">
        <div className="menu-section">
          <h2>Menu</h2>
          {!selectedHotel && (
            <p className="empty-state">Select a hotel to view menu items.</p>
          )}
          {selectedHotel && menu.length === 0 && (
            <p className="empty-state">No menu items available for this hotel.</p>
          )}
          <div className="menu-grid">
            {menu.map((item) => (
              <div className="menu-card" key={item.menu_item_id}>
                <h3>{item.item_name}</h3>
                <p className="price">Rs {item.price}</p>
                <button onClick={() => addToCart(item)}>Add</button>
              </div>
            ))}
          </div>
        </div>

        <div className="cart-section">
          <h2>Your Cart</h2>

          {cartItems.length === 0 && <p className="empty-cart">No items added</p>}

          {cartItems.map((item) => (
            <div className="cart-item" key={item.menu_item_id}>
              <span>
                {item.item_name} x {item.quantity}
              </span>
              <span>Rs {item.price * item.quantity}</span>
            </div>
          ))}

          <hr />

          <h3>Total: Rs {totalAmount}</h3>

          <label>Pickup Slot</label>
          <select
            value={selectedSlot}
            onChange={(e) => setSelectedSlot(e.target.value)}
            disabled={!selectedHotel}
          >
            <option value="">-- Choose Slot --</option>
            {slots.map((slot) => (
              <option key={slot.slot_id} value={slot.slot_id}>
                {slot.start_time} - {slot.end_time}
              </option>
            ))}
          </select>

          <button className="confirm-btn" onClick={handleConfirmOrder}>
            Confirm Order
          </button>
        </div>
      </div>

      <footer className="footer">
        <p>2026 SmartCanteen - Digital Food Ordering and Token System</p>
      </footer>
    </div>
  );
}

export default StudentMenu;
