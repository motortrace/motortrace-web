import DashboardLayout from './layouts/DashboardLayout';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Dashboard from './pages/ServiceCenter/Dashboard';
import KanbanPage from './pages/ServiceCenter/KanbanPage';
import AppointmentPage from './pages/ServiceCenter/Appointment/AppointmentPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/servicecenter/dashboard" replace />} />
        <Route path="/servicecenter" element={<DashboardLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="kanban" element={<KanbanPage />} />
          <Route path="appointments" element={<AppointmentPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
