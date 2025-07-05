import React from 'react';
import { useLocation } from 'react-router-dom';
import './Navbar.scss';

const pageInfo: Record<string, { title: string; description: string }> = {
  '/servicecenter/dashboard': {
    title: 'Welcome back, John!',
    description: 'Overview of your balance and accounts',
  },
  '/servicecenter/jobs': {
    title: 'Job board',
    description: 'Manage your services, inspections and appointments',
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
  '/servicecenter/appointments/details': {
    title: 'Appointment Details',
    description: 'View details about the appointment request',
  },
  '/servicecenter/reports': {
    title: 'Reports',
    description: 'Manage your estimates and invoices',
  },
  '/servicecenter/inspections': {
    title: 'Digital Inspections',
    description: 'Manage vehicle inspections and checklists',
  },
  '/servicecenter/calendar': {
    title: 'Calendar',
    description: 'Manage your appointments',
  },
}
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

        <button aria-label="Cart" className="icon-btn notification-btn">
          <i className="bx bx-cart"></i>
          <span className="notification-badge">1</span>
        </button>

        <div className="user-profile">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8cUiQAZ26gJeXbeZOoLvnX77pZiZqPWaDNgZ6yFwGERlhsHKYzjsXl7EPGp5YUmItuKk&usqp=CAU"
            alt="User Profile"
            className="user-photo"
          />
          <div className="user-info">
            <div className="user-name">Mag City</div>
            <div className="user-email">magcity@gmail.com</div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;