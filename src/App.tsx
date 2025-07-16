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
import RegisterPage from './pages/RegisterPage/RegisterPage';
import SetupDetailsPage from './pages/SetupDetailsPage/SetupDetailsPage';
import SetupPaymentPage from './pages/SetupPaymentPage/SetupPaymentPage';
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
        </Route>

        {/* Auth Callback Route */}
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Setup Flow Routes */}
        <Route path="/setup">
          <Route path="details" element={<SetupDetailsPage />} />
          <Route path="payment" element={<SetupPaymentPage />} />
        </Route>

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

        {/* Redirect dashboard to service center dashboard for now */}
        <Route path="/dashboard" element={<Navigate to="/servicecenter/dashboard" replace />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
