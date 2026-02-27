import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AddMenuItem() {
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const navigate = useNavigate();

  const handleAddItem = async () => {
    const numericPrice = Number(price);

    if (!itemName.trim() || !price || Number.isNaN(numericPrice) || numericPrice <= 0) {
      alert("Please fill all fields");
      return;
    }

    try {
      await api.post("/hoteladmin/menu", {
        item_name: itemName.trim(),
        price: numericPrice
      });

      alert("Menu item added successfully");
      navigate("/hoteladmin/menu");
    } catch (error) {
      console.log(error);
      alert("Failed to add menu item");
    }
  };

  return (
    <div>
      <h2>Add Menu Item</h2>

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

      <button onClick={() => navigate("/hoteladmin")}>Back</button>
    </div>
  );
}

export default AddMenuItem;
