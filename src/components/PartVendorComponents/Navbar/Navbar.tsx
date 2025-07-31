import React from 'react';
import { useLocation } from 'react-router-dom';
import './Navbar.scss';
import autopartslogo from '../../../assets/images/autoparts.png' ;

const pageInfo: Record<string, { title: string; description: string }> = {
  '/PartVendor/dashboard': {
    title: 'Welcome back, Auto Parts Lanka!',
    description: 'Overview of your balance and accounts',
  },
  '/servicecenter/jobs': {
    title: 'Job Board',
    description: 'Manage your work orders and tasks',
  },
  '/servicecenter/appointments': {
    title: 'Appointments',
    description: 'View and manage your appointments',
  },
  '/servicecenter/table': {
    title: 'Data Table',
    description: 'Detailed data and analytics',
  },
  '/servicecenter/jobcard': {
    title: 'Job Card',
    description: 'Details for the selected job card',
  },
  '/servicecenter/scheduling': {
    title: 'Technician Scheduling',
    description: 'Schedule tasks for your technicians',
  },
  '/servicecenter/inventory': {
    title: 'Parts Inventory',
    description: 'Manage your vehicle parts',
  },
  '/servicecenter/suppliers': {
    title: 'Supplier Connection',
    description: 'Manage your suppliers',
  },
  '/servicecenter/parts-order': {
    title: 'Order Parts',
    description: 'Manage your parts',
  },
};

const Navbar: React.FC = () => {
  const location = useLocation();
  const info = pageInfo[location.pathname] || {
    title: 'Welcome Kumudu!',
    description: 'Select a page to get started',
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h2 className="page-title">{info.title}</h2>
        <p className="page-description">{info.description}</p>
      </div>

      <div className="navbar-right">
        <button aria-label="Search" className="icon-btn search-btn">
          <i className="bx bx-search"></i>
        </button>

        <button aria-label="Notifications" className="icon-btn notification-btn">
          <i className="bx bx-bell"></i>
          <span className="notification-badge">3</span>
        </button>

        <div className="user-profile">
          <img
            src={autopartslogo}
            alt="User Profile"
            className="user-photo"
          />
          <div className="user-info">
            <div className="user-name">AutoParts Lanka</div>
            <div className="user-email">autopartslanka@gmail.com</div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;