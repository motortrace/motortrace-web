import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './Navbar.scss';
import { fetchUserStatus } from '../../utils/fetchUserStatus';

const pageInfo: Record<string, { title: string; description: string }> = {
  '/servicecenter/dashboard': {
    title: 'Dashboard',
    description: 'Overview of your service center',
  },
  '/servicecenter/workflow': {
    title: 'Workflow',
    description: 'Manage your workflow',
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
  '/servicecenter/services': {
    title: 'Services',
    description: 'Manage your services',
  },
  '/servicecenter/work-order': {
    title: 'Work Orders',
    description: 'Manage your work orders',
  },
  '/servicecenter/reviews': {
    title: 'Reviews and Ratings',
    description: 'View your reviews and ratings',
  },
  '/servicecenter/chat': {
    title: 'Client Chat',
    description: 'Message your clients',
  },
  '/servicecenter/profile': {
    title: 'Profile',
    description: 'Manage your profile',
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
  
  // Function to get page info with support for dynamic routes
  const getPageInfo = (pathname: string) => {
    // Check for exact match first
    if (pageInfo[pathname]) {
      return pageInfo[pathname];
    }
    
    // Check for dynamic profile routes
    const profileMatch = pathname.match(/^\/admin\/userManagement\/(carUsers|serviceCenters|sparePartsSellers)\/\d+\/profile$/);
    if (profileMatch) {
      const userType = profileMatch[1];
      const userTypeMap = {
        carUsers: 'Car User',
        serviceCenters: 'Service Center', 
        sparePartsSellers: 'Spare Parts Seller'
      };
      
      return {
        title: `${userTypeMap[userType as keyof typeof userTypeMap]} Profile`,
        description: `View and manage detailed information about this ${userTypeMap[userType as keyof typeof userTypeMap].toLowerCase()} account`
      };
    }
    
    return {
      title: 'Welcome!',
      description: 'Select a page to get started',
    };
  };
  
  const info = getPageInfo(location.pathname);

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
            <div className="user-name">{user.name ? user.name : 'Guest User'}</div>
            <div className="user-email">{user.email ? user.email : 'guest@example.com'}</div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;