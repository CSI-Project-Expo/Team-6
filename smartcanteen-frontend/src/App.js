import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentMenu from "./pages/StudentMenu";
import PlaceOrder from "./pages/PlaceOrder";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import TokenPage from "./pages/TokenPage";
import StaffTokenPage from "./pages/StaffTokenPage";
import TrackOrder from "./pages/TrackOrder";
import MyOrders from "./pages/MyOrders";
import PaymentPage from "./pages/PaymentPage";
import SuperAdminLogin from "./pages/SuperAdminLogin";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
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
        <Route path="/payment/:orderId" element={<PaymentPage />} />
        <Route path="/order-status/:orderId" element={<TrackOrder />} />
<Route path="/my-orders" element={<MyOrders />} />

<Route path="/staff" element={<StaffTokenPage />} />
<Route path="/superadmin/login" element={<SuperAdminLogin />} />
<Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
