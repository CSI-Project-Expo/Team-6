import React, { useEffect, useState } from "react";
import api from "../services/api";
import { useSearchParams, useNavigate } from "react-router-dom";

function StudentMenu() {
  const [menu, setMenu] = useState([]);
  const [slots, setSlots] = useState([]);
  const [slotId, setSlotId] = useState("");

  const [params] = useSearchParams();
  const hotel_id = params.get("hotel_id");

  const navigate = useNavigate();

  useEffect(() => {
    fetchMenu();
    fetchSlots();
  }, []);

  const fetchMenu = async () => {
    const res = await api.get(`/student/menu/${hotel_id}`);
    setMenu(res.data);
  };

  const fetchSlots = async () => {
    const res = await api.get(`/student/pickup-slots/${hotel_id}`);
    setSlots(res.data);
  };

  return (
    <div>
      <h2>Menu</h2>

      <h3>Pickup Slot</h3>
      <select onChange={(e) => setSlotId(e.target.value)}>
        <option>Select Slot</option>
        {slots.map((slot) => (
          <option key={slot.slot_id} value={slot.slot_id}>
            {slot.start_time} - {slot.end_time}
          </option>
        ))}
      </select>

      <h3>Food Items</h3>
      {menu.map((item) => (
        <div key={item.menu_item_id}>
          {item.item_name} - ₹{item.price}
        </div>
      ))}

      <button onClick={() => navigate(`/order?hotel_id=${hotel_id}&slot_id=${slotId}`)}>
        Place Order
      </button>
    </div>
  );
}

export default StudentMenu;