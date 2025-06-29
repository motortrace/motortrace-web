import React from 'react';
import { useLocation } from 'react-router-dom';
import './Navbar.scss';

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
};

const Navbar: React.FC = () => {
  const location = useLocation();
  const info = pageInfo[location.pathname] || {
    title: 'Welcome!',
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
            src="https://i.pravatar.cc/40?img=1"
            alt="User Profile"
            className="user-photo"
          />
          <div className="user-info">
            <div className="user-name">Adaline Lively</div>
            <div className="user-email">adaline@example.com</div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;