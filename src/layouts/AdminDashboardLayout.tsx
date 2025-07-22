import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Admin/Sidebar';
import Navbar from '../components/Navbar/Navbar';
import './DashboardLayout.scss';

const AdminDashboardLayout: React.FC = () => {
  const location = useLocation();
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">
        <Navbar />
        <div className="page-content">
          <Outlet key={location.pathname} />
        </div>
      </main>
    </div>
  );
}

export default AdminDashboardLayout
