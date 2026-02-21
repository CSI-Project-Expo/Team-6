import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentMenu from "./pages/StudentMenu";
import PlaceOrder from "./pages/PlaceOrder";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import TokenPage from "./pages/TokenPage";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/menu" element={<StudentMenu />} />
        <Route path="/order" element={<PlaceOrder />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/token/:orderId" element={<TokenPage />} />
      </Routes>
    </Router>
  );
}

export default App;
