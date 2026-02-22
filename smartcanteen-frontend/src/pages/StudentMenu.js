import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function StudentMenu() {
  const navigate = useNavigate();

  // get user id from localStorage
  const userId = parseInt(localStorage.getItem("user_id"));

  const [menu, setMenu] = useState([]);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [cartItems, setCartItems] = useState([]);

  const hotelId = 1; // temporary

  // 🚨 safety check
  useEffect(() => {
    if (!userId) {
      alert("Please login again");
      navigate("/login");
    }
  }, [userId, navigate]);

  // Fetch Menu
  useEffect(() => {
    axios
      .get(`http://127.0.0.1:5000/student/menu/${hotelId}`)
      .then(res => setMenu(res.data))
      .catch(err => console.log(err));
  }, [hotelId]);

  // Fetch Pickup Slots
  useEffect(() => {
    axios
      .get(`http://127.0.0.1:5000/student/pickup-slots/${hotelId}`)
      .then(res => setSlots(res.data))
      .catch(err => console.log(err));
  }, [hotelId]);

  // Logout 
  const handleLogout = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("role");
    navigate("/login");
  };

  // Add to cart
  const addToCart = (item) => {
    const exists = cartItems.find(i => i.menu_item_id === item.menu_item_id);

    if (exists) {
      setCartItems(
        cartItems.map(i =>
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

  // Confirm Order
  const handleConfirmOrder = async () => {
    if (!selectedSlot) {
      alert("Please select pickup slot");
      return;
    }

    if (cartItems.length === 0) {
      alert("Cart is empty");
      return;
    }

    const orderData = {
      user_id: userId,
      hotel_id: hotelId,
      slot_id: selectedSlot,
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
      console.log(error);
      alert("Order failed");
    }
  };

  return (
    <div>
      <h2>Student Menu</h2>

      <button onClick={() => navigate("/my-orders")}>
        📜 My Orders
      </button>

      <button onClick={handleLogout}>
        🚪 Logout
      </button>

      <h3>Menu Items</h3>
      {menu.map(item => (
        <div key={item.menu_item_id}>
          {item.item_name} - ₹{item.price}
          <button onClick={() => addToCart(item)}>Add</button>
        </div>
      ))}

      <h3>Pickup Slot</h3>
      <select onChange={(e) => setSelectedSlot(e.target.value)}>
        <option value="">Select Slot</option>
        {slots.map(slot => (
          <option key={slot.slot_id} value={slot.slot_id}>
            {slot.start_time} - {slot.end_time}
          </option>
        ))}
      </select>

      <h3>Cart</h3>
      {cartItems.map(item => (
        <div key={item.menu_item_id}>
          {item.item_name} x {item.quantity}
        </div>
      ))}

      <h3>Total: ₹{totalAmount}</h3>

      <button onClick={handleConfirmOrder}>Confirm Order</button>
    </div>
  );
}

export default StudentMenu;