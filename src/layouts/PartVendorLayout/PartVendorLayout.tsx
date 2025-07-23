import React from 'react';  
import { Outlet, useLocation } from 'react-router-dom';
// import Sidebar from '../components/Sidebar/sidebar';

import './PartVendorLayout.scss';
import PartVendorSideBar from '../../components/PartVendorComponents/SideBar/partVendorSidebar';
import Navbar from '../../components/PartVendorComponents/Navbar/Navbar';

const PartVendorDashboardLayout: React.FC = () => {
  const location = useLocation();
  return (
    <div className="dashboard-layout">
      <PartVendorSideBar/>
      <main className="main-content">
        <Navbar />
        <div className="page-content">
          <Outlet key={location.pathname} />
        </div>
      </main>
    </div>
  );
};

export default PartVendorDashboardLayout;