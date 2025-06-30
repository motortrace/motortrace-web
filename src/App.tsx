import DashboardLayout from './layouts/DashboardLayout';
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/servicecenter/dashboard" replace />} />
        <Route path="/servicecenter" element={<DashboardLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
