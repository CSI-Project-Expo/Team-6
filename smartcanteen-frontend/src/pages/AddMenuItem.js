import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddMenuItem() {
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const navigate = useNavigate();

  const hotelId = 1; // temporary (later from login)

  const handleAddItem = async () => {
    if (!itemName || !price) {
      alert("Please fill all fields");
      return;
    }

    try {
      await axios.post("http://127.0.0.1:5000/hoteladmin/menu", {
        hotel_id: hotelId,
        item_name: itemName,
        price: price
      });

      alert("Menu item added successfully ✅");
      navigate("/hoteladmin/menu");
    } catch (error) {
      console.log(error);
      alert("Failed to add menu item");
    }
  };

  return (
    <div>
      <h2>➕ Add Menu Item</h2>

      <input
        type="text"
        placeholder="Item Name"
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
      />
      <br /><br />

      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <br /><br />

      <button onClick={handleAddItem}>Add Item</button>
      <br /><br />

      <button onClick={() => navigate("/admin")}>⬅ Back</button>
    </div>
  );
}

export default AddMenuItem;