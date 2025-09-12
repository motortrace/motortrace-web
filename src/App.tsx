import DashboardLayout from './layouts/DashboardLayout';
import PartVendorDashboardLayout from './layouts/PartVendorLayout/PartVendorLayout';

import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { useEffect } from 'react';

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
import AuthCallback from './pages/AuthCallback/AuthCallback';
import AppointmentDetails from './pages/ServiceCenter/Appointment/AppointmentDetails';
import EstimatesInvoices from './pages/ServiceCenter/EstimatesInvoices';
import InspectionTemplates from './pages/ServiceCenter/InspectionTemplates';
import InspectionRecordsPage from './pages/ServiceCenter/InspectionRecordsPage';
import InspectionDetailPage from './pages/ServiceCenter/InspectionDetailPage';
import Calendar from './pages/ServiceCenter/Calendar';
import TimelineBoardPage from './pages/ServiceCenter/TimelineBoardPage';
import CannedServices from './pages/ServiceCenter/Services/CannedServices';
import WorkOrdersPage from './pages/ServiceCenter/WorkOrdersPage';
import AutoRepairReviews from './pages/ServiceCenter/Reviews/AutoRepairReviews';
import AutoRepairChat from './pages/ServiceCenter/AutoRepairChat/AutoRepairChat';
import EditProfile from './pages/ServiceCenter/EditProfile';
import EmployeeManagement from './pages/ServiceCenter/EmployeeManagement';
import OrderHistory from './pages/ServiceCenter/OrderHistory';


import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboardLayout from "./layouts/AdminDashboardLayout"
import AdminDashboard from './pages/Admin/AdminDashboard';
import CarUsers from './pages/Admin/CarUsers';
import Employees from './pages/Admin/Employees';
import BookingOversight from './pages/Admin/BookingOversight';
import CompletedBookings from './pages/Admin/CompletedBookings';
import RefundManagement from './pages/Admin/RefundManagement';
import ContentModeration from './pages/Admin/ContentModeration';
import ViewUserProfile from './components/Admin/ViewUserProfile/UserProfile';
import AdminSettings from './pages/Admin/AdminSettings';
import RevenueAndPayouts from './pages/Admin/RevenueAndPayouts';
import IncomeManagement from './pages/Admin/IncomeManagement';


import PartVendorDashboard from './pages/PartVendor/Dashboard/PartVendorDashboard';
import OrderSummary from './pages/PartVendor/OrderPages/OrderSummary';
import PendingOrderDetailsPage from './pages/PartVendor/OrderPages/PendingOrderDetailsPage';
import IncomeSummaryPage from './pages/PartVendor/IncomePages/IncomeSummaryPage';
import CustomerSummaryPage from './pages/PartVendor/CustomerPages/CustomerSummaryPage';
import ReviewPage from './pages/PartVendor/ReviewPages/ReviewPage';
import CustomerDetailsPage from './pages/PartVendor/CustomerPages/CustomerDetailsPage';
import AcceptedOrderDetailsPage from './pages/PartVendor/OrderPages/AcceptedOrderDetailsPage';
import ReportPage from './pages/PartVendor/ReportPages/ReportPage';
import DeclinedOrderDetailsPage from './pages/PartVendor/OrderPages/DeclinedOrderDetailsPage';
import CompletedOrderDetailsPage from './pages/PartVendor/OrderPages/CompletedOrderDetailsPage';
import FailedOrderDetailsPage from './pages/PartVendor/OrderPages/FailedOrderDetailsPage';
import ServiceCenterCustomerDetailsPage from './pages/PartVendor/CustomerPages/ServiceCenterCustomerDetailsPage';
import AddProduct from './pages/PartVendor/Products/AddProduct';
import ProfilePartVendor from './pages/PartVendor/Profile/Profile';
import ProductList from './pages/PartVendor/Products/ProductList';
import CancelledBookings from './pages/Admin/CancelledBookings';
import ServicePackageManager from './pages/Admin/ServicePackageManager';


function NotFoundRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    let user = null;
    try {
      user = JSON.parse(localStorage.getItem('user') || '{}');
    } catch { }
    if (user && user.role === 'admin') {
      navigate('/admin/dashboard', { replace: true });
    } else if (user && user.role === 'service_center') {
      navigate('/servicecenter/dashboard', { replace: true });
    } else {
      navigate('/index', { replace: true });
    }
  }, [navigate]);
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root Redirect */}
        <Route path="/" element={<Navigate to="/index" replace />} />

        <Route path="/" >
          <Route index element={<Navigate to="index" replace />} />
          <Route path="index" element={<LandingPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="pricing" element={<PricingPage />} />
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
          <Route path="workflow" element={<KanbanPage />} />
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
          <Route path="order-history" element={<OrderHistory />} />
          <Route path="reports" element={<EstimatesInvoices />} />
          <Route path="inspection-templates" element={<InspectionTemplates />} />
          <Route path="inspection-records" element={<InspectionRecordsPage />} />
          <Route path="inspection-detail/:workOrderId" element={<InspectionDetailPage />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="timeline-board" element={<TimelineBoardPage />} />
          <Route path="services" element={<CannedServices />} />
          <Route path="work-order" element={<WorkOrdersPage />} />
          <Route path="reviews" element={<AutoRepairReviews />} />
          <Route path="chat" element={<AutoRepairChat />} />
          <Route path="profile" element={<EditProfile />} />
          <Route path="employee-management" element={<EmployeeManagement />} />
        </Route>

        <Route path="admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<Navigate to="login" replace />} />
        <Route path="/admin/*" element={<AdminDashboardLayout />}>

          <Route path="dashboard" element={<AdminDashboard />} />

          <Route path="userManagement">
            <Route index element={<Navigate to="carUsers" replace />} />
            <Route path="carUsers" element={<CarUsers />} />
            <Route path="carUsers/:userId/profile" element={<ViewUserProfile />} />
            <Route path="employees/:employeeType" element={<Employees />} />
            <Route path="employees/:employeeType/:userId/profile" element={<ViewUserProfile />} />
          </Route>

          <Route path="offeringManagement">
            <Route index element={<Navigate to="services" replace />} />
            <Route path=":tabType" element={<ServicePackageManager />} />
          </Route>

          <Route path="bookingManagement">
            <Route index element={<Navigate to="upComing" replace />} />
            <Route path=":bookingType" element={<BookingOversight />} />
          </Route>

          <Route path="completedBookings" element={<CompletedBookings />} />
          <Route path="cancelledBookings" element={<CancelledBookings />} />

          <Route path = "incomeManagement" element = {<IncomeManagement />} />

          <Route path="refundManagement" element={<RefundManagement />} />
          <Route path="contentModeration" element={<ContentModeration />} />
          <Route path="revenueAndPayouts" element={<RevenueAndPayouts />} />
          <Route path="settings" element={<AdminSettings />} />

        </Route>

        <Route path="*" element={<NotFoundRedirect />} />

        {/* Part Vendor */}
        <Route path="/partvendor" element={<PartVendorDashboardLayout />}>
          <Route index element={<Navigate to="/partvendor/dashboard" replace />} />
          <Route path="dashboard" element={<PartVendorDashboard />} />
          <Route path="OrderSummary" element={<OrderSummary />} />
          <Route path="PendingOrderDetails" element={<PendingOrderDetailsPage />} />
          <Route path="IncomeSummary" element={<IncomeSummaryPage />} />
          <Route path="CustomerSummary" element={<CustomerSummaryPage />} />
          <Route path="ReviewPage" element={<ReviewPage />} />
          <Route path="CustomerDetails" element={<CustomerDetailsPage />} />
          <Route path="ServiceCenterCustomerDetails" element={<ServiceCenterCustomerDetailsPage />} />
          <Route path="AcceptedOrders" element={<AcceptedOrderDetailsPage />} />
          <Route path="CompletedOrders" element={<CompletedOrderDetailsPage />} />
          <Route path="ReportsSummary" element={<ReportPage />} />
          <Route path="DeclinedOrderDetailsPage" element={<DeclinedOrderDetailsPage />} />
          <Route path="FailedOrderDetailsPage" element={<FailedOrderDetailsPage />} />
          <Route path="ProductList" element={<ProductList />} />
          <Route path="AddProduct" element={<AddProduct />} />
          <Route path="ProfilePartVendor" element={<ProfilePartVendor />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
