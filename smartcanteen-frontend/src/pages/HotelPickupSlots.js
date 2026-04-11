import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./HotelPickupSlots.css";

function HotelPickupSlots() {
  const navigate = useNavigate();
  const [slots, setSlots] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(false);

  const role = sessionStorage.getItem("role");

  const fetchSlots = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/hoteladmin/pickup-slots/my");
      setSlots(res.data || []);
    } catch (error) {
      console.log(error);
      alert("Failed to load pickup slots");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (role !== "HOTEL_ADMIN") {
      alert("Unauthorized access");
      navigate("/login");
      return;
    }
    fetchSlots();
  }, [role, navigate, fetchSlots]);

  const formatTime = (value) => {
    if (!value) return "";
    return value.slice(0, 5);
  };

  const addSlot = async () => {
    if (!startTime || !endTime) {
      alert("Select both start and end time");
      return;
    }
    if (startTime >= endTime) {
      alert("End time must be after start time");
      return;
    }

    try {
      await api.post("/hoteladmin/pickup-slots", {
        start_time: startTime,
        end_time: endTime
      });
      setStartTime("");
      setEndTime("");
      fetchSlots();
    } catch (error) {
      console.log(error);
      alert(error?.response?.data?.message || "Failed to add slot");
    }
  };

  const deleteSlot = async (slotId) => {
    if (!window.confirm("Delete this pickup slot?")) return;
    try {
      await api.delete(`/hoteladmin/pickup-slots/${slotId}`);
      fetchSlots();
    } catch (error) {
      console.log(error);
      alert(error?.response?.data?.message || "Failed to delete slot");
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <div className="pickup-page">
      <div className="pickup-header">
        <h2>Pickup Slot Management</h2>
        <div className="pickup-actions">
          <button onClick={() => navigate("/hoteladmin")}>Back</button>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="pickup-form">
        <div className="field">
          <label>Start Time</label>
          <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
        </div>
        <div className="field">
          <label>End Time</label>
          <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
        </div>
        <button className="add-btn" onClick={addSlot}>Add Slot</button>
      </div>

      <div className="slot-table-wrap">
        <table className="slot-table">
          <thead>
            <tr>
              <th>Slot ID</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="4">Loading slots...</td>
              </tr>
            )}
            {!loading && slots.length === 0 && (
              <tr>
                <td colSpan="4">No pickup slots configured.</td>
              </tr>
            )}
            {slots.map((slot) => (
              <tr key={slot.slot_id}>
                <td>{slot.slot_id}</td>
                <td>{formatTime(slot.start_time)}</td>
                <td>{formatTime(slot.end_time)}</td>
                <td>
                  <button className="delete-btn" onClick={() => deleteSlot(slot.slot_id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default HotelPickupSlots;
