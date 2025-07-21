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

import PartVendorDashboard from './pages/PartVendor/Dashboard/PartVendorDashboard';
import OrderSummary from './pages/PartVendor/OrderPages/OrderSummary';
import PendingOrderDetailsPage from './pages/PartVendor/OrderPages/PendingOrderDetailsPage';
import IncomeSummaryPage from './pages/PartVendor/IncomePages/IncomeSummaryPage';
import CustomerSummaryPage from './pages/PartVendor/CustomerPages/CustomerSummaryPage';
import ReviewPage from './pages/PartVendor/ReviewPages/ReviewPage';
import CustomerDetailsPage from './pages/PartVendor/CustomerPages/CustomerDetailsPage';
import AcceptedOrderDetailsPage from './pages/PartVendor/OrderPages/AcceptedOrderDetailsPage';
import ReportPage from './pages/PartVendor/ReportPages/ReportPage';
import BackendTest from './pages/PartVendor/BackendTest/BackendTest';

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
          <Route path="appointments" element={<AppointmentPage />} />
          <Route path="table" element={<TestTablePage />} />
          <Route path="jobcard" element={<JobCard />} />
          <Route path="scheduling" element={<TechnicianSchedulingPage />} />
          <Route path="inventory" element={<PartsInventory />} />
          <Route path="suppliers" element={<SupplierConnectionPage />} />
          <Route path="parts-order" element={<PartsSearch />} />
        </Route>

        {/* Part Vendor */}
        <Route path="/partvendor" element={<PartVendorDashboardLayout />}>
          <Route index element={<Navigate to="/partvendor/dashboard" replace />} />
          <Route path="dashboard" element={<PartVendorDashboard />} />
          <Route path="OrderSummary" element={<OrderSummary />} />
          <Route path="PendingOrderDetails" element={<PendingOrderDetailsPage/>} />
          <Route path="IncomeSummary" element={<IncomeSummaryPage/>} />
          <Route path="CustomerSummary" element={<CustomerSummaryPage/>} />
          <Route path="ReviewPage" element={<ReviewPage/>} />
          <Route path="CustomerDetails" element={<CustomerDetailsPage/>} />
          <Route path="AcceptedOrders" element={<AcceptedOrderDetailsPage/>} />
          <Route path="ReportsSummary" element={<ReportPage/>}/>
          <Route path="test" element={<BackendTest/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
