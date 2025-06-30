import React from 'react';  
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar/sidebar';
import Navbar from '../components/Navbar/Navbar';
import './DashboardLayout.scss';

const DashboardLayout: React.FC = () => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">
        <Navbar />
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;