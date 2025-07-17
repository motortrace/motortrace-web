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

  '/admin/dashboard': {
    title: 'Welcome back, Admin!',
    description: 'Overview of your platform and activities',
  },
  '/admin/userManagement/carUsers': {
    title: 'Car Users Management',
    description: 'Manage and support your platform’s car users with ease',
  },
  '/admin/userManagement/serviceCenters': {
    title: 'Service Centers Management',
    description: 'Oversee service centers and maintain service quality',
  },
  '/admin/userManagement/sparePartsSellers': {
    title: 'Spare Parts Sellers Management',
    description: 'Manage seller accounts and monitor spare parts listings efficiently',
  },
  '/admin/userManagement/pendingApprovals': {
    title: 'Pending Registration Requests',
    description: 'Quickly review and approve new user registration requests to keep your platform active and up-to-date',
  },
  '/admin/bookingOversight': {
    title: 'Booking Oversight',
    description: 'Track and manage all service bookings across the platform',
  },
  '/admin/refundManagement': {
    title: 'Refund Management',
    description: 'Manage cancellation refunds based on your refund policy',
  },
  '/admin/contentModeration': {
    title: 'Content Moderation',
    description: 'Handle reported posts and comments to maintain a respectful community environment',
  },
  '/admin/revenueAndPayouts': {
    title: 'Revenue & Payouts',
    description: 'Monitor platform earnings and payouts to service providers seamlessly',
  },
  '/admin/settings': {
    title: 'System Configuration',
    description: 'Manage essential platform settings to ensure seamless experience for all users',
  }
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