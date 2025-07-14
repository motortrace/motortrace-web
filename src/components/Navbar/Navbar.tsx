import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './Navbar.scss';
import { fetchUserStatus } from '../../utils/fetchUserStatus';

const pageInfo: Record<string, { title: string; description: string }> = {
  '/servicecenter/dashboard': {
    title: 'Welcome back, John!',
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
    title: 'Welcome!',
    description: 'Select a page to get started',
  };

  const [user, setUser] = useState<{ name?: string; email?: string }>({});

  useEffect(() => {
    const getUser = async () => {
      const status = await fetchUserStatus();
      if (status && status.name && status.email) {
        setUser({ name: status.name, email: status.email });
      } else if (status && status.user) {
        setUser({ name: status.user.name, email: status.user.email });
      }
    };
    getUser();
  }, []);

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
            src="https://i.pravatar.cc/40?img=1"
            alt="User Profile"
            className="user-photo"
          />
          <div className="user-info">
            <div className="user-name">{user.name ? user.name : 'Guest User'}</div>
            <div className="user-email">{user.email ? user.email : 'guest@example.com'}</div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;