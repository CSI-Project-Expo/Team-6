import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function HotelMenuManager() {
  const navigate = useNavigate();

  const hotelId = localStorage.getItem("hotel_id") || 1; // temporary
  const role = localStorage.getItem("role");

  const [menu, setMenu] = useState([]);
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");

  // 🔐 Role protection
  useEffect(() => {
    if (role !== "HOTEL_ADMIN") {
      alert("Unauthorized access");
      navigate("/login");
    }
  }, [role, navigate]);

  // Fetch menu
  const fetchMenu = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:5000/hoteladmin/menu/${hotelId}`
      );
      setMenu(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  // Add menu item
  const handleAddItem = async () => {
    if (!itemName || !price) {
      alert("Enter item name and price");
      return;
    }

    try {
      await axios.post("http://127.0.0.1:5000/hoteladmin/menu", {
        hotel_id: hotelId,
        item_name: itemName,
        price: price
      });

      alert("Menu item added");

      setItemName("");
      setPrice("");
      fetchMenu();
    } catch (error) {
      console.log(error);
      alert("Failed to add item");
    }
  };

  // Toggle availability
  const toggleAvailability = async (menu_item_id, currentStatus) => {
    try {
      await axios.put("http://127.0.0.1:5000/hoteladmin/menu", {
        menu_item_id: menu_item_id,
        is_available: !currentStatus
      });

      fetchMenu();
    } catch (error) {
      console.log(error);
    }
  };

  // Delete item
  const deleteItem = async (menu_item_id) => {
    if (!window.confirm("Delete this item?")) return;

    try {
      await axios.delete(
        `http://127.0.0.1:5000/hoteladmin/menu/${menu_item_id}`
      );
      fetchMenu();
    } catch (error) {
      console.log(error);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div>
      <h2>🍽 Hotel Menu Manager</h2>

      <button onClick={() => navigate("/hotel-admin-dashboard")}>
        ⬅ Back
      </button>
      <button onClick={handleLogout}>🚪 Logout</button>

      <hr />

      <h3>Add New Item</h3>
      <input
        type="text"
        placeholder="Item Name"
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
      />
      <br />

      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <br />

      <button onClick={handleAddItem}>➕ Add Item</button>

      <hr />

      <h3>Menu List</h3>

      {menu.length === 0 && <p>No menu items found</p>}

      {menu.map((item) => (
        <div
          key={item.menu_item_id}
          style={{
            border: "1px solid gray",
            padding: "10px",
            margin: "10px"
          }}
        >
          <b>{item.item_name}</b> - ₹{item.price}
          <br />
          Status:{" "}
          {item.is_available ? "Available ✅" : "Not Available ❌"}
          <br />

          <button
            onClick={() =>
              toggleAvailability(item.menu_item_id, item.is_available)
            }
          >
            {item.is_available ? "Disable" : "Enable"}
          </button>

          <button
            onClick={() => deleteItem(item.menu_item_id)}
            style={{ marginLeft: "10px" }}
          >
            🗑 Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default HotelMenuManager;