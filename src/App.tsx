import DashboardLayout from './layouts/DashboardLayout';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

import Dashboard from './pages/ServiceCenter/Dashboard';
import KanbanPage from './pages/ServiceCenter/KanbanPage';
import AppointmentPage from './pages/ServiceCenter/Appointment/AppointmentPage';
import TestTablePage from './pages/ServiceCenter/TestTablePage';
import JobCard from './pages/ServiceCenter/JobCard/JobCard';
import TechnicianSchedulingPage from './pages/ServiceCenter/TechnicianScheduling/TechnicianSchedulingPage';
import PartsInventory from './pages/ServiceCenter/Inventory/PartsInventory';
import SupplierConnectionPage from './pages/ServiceCenter/Suppliers/SupplierConnectionPage';
import PartsSearch from './pages/ServiceCenter/PartsSearch/PartsSearch';
import LandingPage from './pages/LandingPage/LandingPage';
import LoginPage from './pages/LoginPage/LoginPage';
import PricingPage from './pages/PricingPage/PricingPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import AuthCallback from './pages/AuthCallback/AuthCallback';
import AppointmentDetails from './pages/ServiceCenter/Appointment/AppointmentDetails';
import EstimatesInvoices from './pages/ServiceCenter/EstimatesInvoices';
import DigitalInspections from './pages/ServiceCenter/DigitalInspections';
import Calendar from './pages/ServiceCenter/Calendar';
import TimelineBoardPage from './pages/ServiceCenter/TimelineBoardPage';
import CannedServices from './pages/ServiceCenter/Services/CannedServices';
import WorkOrdersPage from './pages/ServiceCenter/WorkOrdersPage';
import AutoRepairReviews from './pages/ServiceCenter/Reviews/AutoRepairReviews';
import AutoRepairChat from './pages/ServiceCenter/AutoRepairChat/AutoRepairChat';
import EditProfile from './pages/ServiceCenter/EditProfile';

import AdminDashboardLayout from "./layouts/AdminDashboardLayout"
import AdminDashboard from './pages/Admin/Dashboard';
import UserManagement from './pages/Admin/UserManagement';
import BookingOversight from './pages/Admin/BookingOversight';
import RefundManagement from './pages/Admin/RefundManagement';
import ContentModeration from './pages/Admin/ContentModeration';
import ViewUserProfile from './components/Admin/ViewUserProfile/UserProfile';
import AdminSettings from './pages/Admin/AdminSettings';
import RevenueAndPayouts from './pages/Admin/RevenueAndPayouts';
import RegistrationRequests from './components/Admin/UserManagement/RegistrationRequests';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/index" replace />} />
        
        {/* Public Routes */}
        <Route path="/" >
           <Route index element={<Navigate to="index" replace />} />
           <Route path="index" element={<LandingPage />} />
           <Route path="login" element={<LoginPage />} />
           <Route path="register" element={<RegisterPage />} />
           <Route path="pricing" element={<PricingPage/>} />
        </Route>

        {/* Auth Callback Route */}
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Protected Dashboard Routes */}
        <Route path="/servicecenter" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="jobs" element={<KanbanPage />} />
          <Route path="workorders" element={<WorkOrdersPage />} />
          <Route path="appointments">
            <Route index element={<AppointmentPage />} />
            <Route path="details" element={<AppointmentDetails />} />
          </Route>
          <Route path="table" element={<TestTablePage />} />
          <Route path="jobcard" element={<JobCard />} />
          <Route path="scheduling" element={<TechnicianSchedulingPage />} />
          <Route path="inventory" element={<PartsInventory />} />
          <Route path="suppliers" element={<SupplierConnectionPage />} />
          <Route path="parts-order" element={<PartsSearch />} />
          <Route path="reports" element={<EstimatesInvoices />} />
          <Route path="inspections" element={<DigitalInspections />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="timeline-board" element={<TimelineBoardPage />} />
          <Route path="services" element={<CannedServices />} />
          <Route path="work-order" element={<WorkOrdersPage />} />
          <Route path="reviews" element={<AutoRepairReviews />} />
          <Route path="chat" element={<AutoRepairChat />} />
          <Route path="profile" element={<EditProfile />} />
        </Route>

        <Route path="/admin" element={<AdminDashboardLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          
          <Route path="userManagement">
            <Route index element={<Navigate to="carUsers" replace />} />
            <Route path=":userType" element={<UserManagement />} />
            <Route path=":userType/:userId/profile" element={<ViewUserProfile />} />
            <Route path="pendingApprovals" element={<RegistrationRequests />} />
          </Route>

          <Route path = "bookingOversight" element = {<BookingOversight />} />
          <Route path = "refundManagement" element = {<RefundManagement />} />
          <Route path = "contentModeration" element = {<ContentModeration />} />
          <Route path = "revenueAndPayouts" element = {<RevenueAndPayouts />} />
          <Route path = "settings" element = {<AdminSettings />} />
          
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
