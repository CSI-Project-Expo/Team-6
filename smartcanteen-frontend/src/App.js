import { BrowserRouter as Router, Routes, Route ,Navigate } from "react-router-dom";
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
import SuperAdminHotels from "./pages/SuperAdminHotels";
import AddHotel from "./pages/AddHotel";
import CreateHotelAdmin from "./pages/CreateHotelAdmin";
import AssignHotelAdmin from "./pages/AssignHotelAdmin";
import ViewHotels from "./pages/ViewHotels";
import HotelAdminDashboard from "./pages/HotelAdminDashboard";
import HotelMenu from "./pages/HotelMenu";
import HotelOrders from "./pages/HotelOrders";
import HotelAdminValidateToken from "./pages/HotelAdminValidateToken";
import SuperAdminUsers from "./pages/SuperAdminUsers";
import AddMenuItem from "./pages/AddMenuItem";
import UpdateOrderStatus from "./pages/UpdateOrderStatus";
import HotelPickupSlots from "./pages/HotelPickupSlots";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/student/menu" element={<StudentMenu />} />
        <Route path="/order" element={<PlaceOrder />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/token/:orderId" element={<TokenPage />} />
        <Route path="/payment/:orderId" element={<PaymentPage />} />
        <Route path="/order-status/:orderId" element={<TrackOrder />} />
<Route path="/my-orders" element={<MyOrders />} />

<Route path="/staff" element={<StaffTokenPage />} />
<Route path="/superadmin/login" element={<SuperAdminLogin />} />
<Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />

<Route path="/superadmin/add-hotel" element={<AddHotel />} />
<Route path="/superadmin/create-hotel-admin" element={<CreateHotelAdmin />} />
<Route path="/superadmin/assign-hotel-admin" element={<AssignHotelAdmin />} />
<Route path="/superadmin/view-hotels" element={<ViewHotels />} />
<Route path="/superadmin/users" element={<SuperAdminUsers />} />
<Route path="/superadmin/view-hotels" element={<SuperAdminHotels />} />
<Route path="/hoteladmin/add-menu" element={<AddMenuItem />} />
<Route path="/hoteladmin/update-order" element={<UpdateOrderStatus />} />


<Route path="/hoteladmin" element={<HotelAdminDashboard />} />
<Route path="/hoteladmin/menu" element={<HotelMenu />} />
<Route path="/hoteladmin/orders" element={<HotelOrders />} />
<Route path="/hoteladmin/validate-token" element={<HotelAdminValidateToken />} />
<Route path="/hoteladmin/pickup-slots" element={<HotelPickupSlots />} />

      </Routes>
    </Router>
  );
}

export default App;
