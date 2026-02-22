import { useState } from "react";
import axios from "axios";

function CreateHotelAdmin() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleCreateAdmin = async () => {
    try {
      await axios.post("http://127.0.0.1:5000/superadmin/create-hotel-admin", {
        name,
        email,
        password
      });

      setMessage("Hotel Admin created ✅");
      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      setMessage("Failed to create admin ❌");
    }
  };

  return (
    <div>
      <h2>Create Hotel Admin</h2>

      <input placeholder="Name" onChange={(e)=>setName(e.target.value)} /><br/>
      <input placeholder="Email" onChange={(e)=>setEmail(e.target.value)} /><br/>
      <input placeholder="Password" type="password" onChange={(e)=>setPassword(e.target.value)} /><br/>

      <button onClick={handleCreateAdmin}>Create Admin</button>

      <p>{message}</p>
    </div>
  );
}

export default CreateHotelAdmin;