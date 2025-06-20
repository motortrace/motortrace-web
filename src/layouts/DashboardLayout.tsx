import React from 'react';  
import Sidebar from '../components/Sidebar/sidebar';
import Navbar from '../components/Navbar/Navbar';
import './DashboardLayout.scss'; // Add styles if needed

interface Props {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">
        <Navbar />
        <div className="page-content">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
