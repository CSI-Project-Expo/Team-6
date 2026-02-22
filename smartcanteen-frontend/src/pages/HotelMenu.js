import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function HotelMenu() {
  const [menu, setMenu] = useState([]);
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");

  const navigate = useNavigate();

  // TEMP hotel_id (later from login)
  const hotelId = 1;

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await api.get(`/hoteladmin/menu/${hotelId}`);
      setMenu(res.data);
    } catch (error) {
      console.log(error);
      alert("Failed to load menu");
    }
  };

  const addMenuItem = async () => {
    if (!itemName || !price) {
      alert("Fill all fields");
      return;
    }

    try {
      await api.post("/hoteladmin/menu", {
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

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div>
      <h2>🏨 Hotel Admin - Menu Management</h2>

      <button onClick={() => navigate("/hotel/orders")}>📦 View Orders</button>
      <button onClick={handleLogout}>🚪 Logout</button>

      <h3>Add New Item</h3>
      <input
        type="text"
        placeholder="Item Name"
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <button onClick={addMenuItem}>Add Item</button>

      <h3>Menu Items</h3>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>Item</th>
            <th>Price</th>
            <th>Available</th>
          </tr>
        </thead>

        <tbody>
          {menu.map(item => (
            <tr key={item.menu_item_id}>
              <td>{item.menu_item_id}</td>
              <td>{item.item_name}</td>
              <td>₹{item.price}</td>
              <td>{item.is_available ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HotelMenu;