import DashboardLayout from './layouts/DashboardLayout';
import PartVendorDashboardLayout from './layouts/PartVendorLayout/PartVendorLayout';

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Dashboard from './pages/ServiceCenter/Dashboard';
import KanbanPage from './pages/ServiceCenter/KanbanPage';
import AppointmentPage from './pages/ServiceCenter/Appointment/AppointmentPage';
import TestTablePage from './pages/ServiceCenter/TestTablePage';
import JobCard from './pages/ServiceCenter/JobCard/JobCard';
import TechnicianSchedulingPage from './pages/ServiceCenter/TechnicianScheduling/TechnicianSchedulingPage';
import PartsInventory from './pages/ServiceCenter/Inventory/PartsInventory';
import SupplierConnectionPage from './pages/ServiceCenter/Suppliers/SupplierConnectionPage';
import PartsSearch from './pages/ServiceCenter/PartsSearch/PartsSearch';
import AppointmentDetails from './pages/ServiceCenter/Appointment/AppointmentDetails';
import EstimatesInvoices from './pages/ServiceCenter/EstimatesInvoices';
import DigitalInspections from './pages/ServiceCenter/DigitalInspections';
import Calendar from './pages/ServiceCenter/Calendar';
import TimelineBoardPage from './pages/ServiceCenter/TimelineBoardPage';
import CannedServices from './pages/ServiceCenter/Services/CannedServices';
import WorkOrdersPage from './pages/ServiceCenter/WorkOrdersPage';
import AutoRepairReviews from './pages/ServiceCenter/Reviews/AutoRepairReviews';
import AutoRepairChat from './pages/ServiceCenter/AutoRepairChat/AutoRepairChat';

import PartVendorDashboard from './pages/PartVendor/Dashboard/PartVendorDashboard';
import OrderSummary from './pages/PartVendor/OrderPages/OrderSummary';
import ProductList from './pages/PartVendor/Products/ProductList';
import AddProduct from './pages/PartVendor/Products/AddProduct';
import ProfilePartVendor from './pages/PartVendor/Profile/Profile';

import Login from './pages/Login/login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root Redirect */}
        <Route path="/" element={<Navigate to="/servicecenter/dashboard" replace />} />

        {/* Service Center */}
        <Route path="/servicecenter" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/servicecenter/dashboard" replace />} />
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
        </Route>

        {/* Part Vendor */}
        <Route path="/partvendor" element={<PartVendorDashboardLayout />}>
          <Route index element={<Navigate to="/partvendor/dashboard" replace />} />
          <Route path="dashboard" element={<PartVendorDashboard />} />
          <Route path="OrderSummary" element={<OrderSummary />} />
          <Route path="ProductList" element={<ProductList />} />
          <Route path="AddProduct" element={<AddProduct />} />
          <Route path="ProfilePartVendor" element={<ProfilePartVendor />} />
        </Route>

        {/* Login */}
        <Route path="/user" element={<Login />}>
          <Route index element={<Navigate to="/user/login" replace />} />
          <Route path="login" element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
