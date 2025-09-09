import React, { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import 'boxicons/css/boxicons.min.css';
import '../Sidebar/sidebar.scss';
import logo from '../../assets/images/motortraceLogo.png';

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  route: string;
}

interface MenuGroup {
  title?: string;
  items: MenuItem[];
}

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuGroups: MenuGroup[] = [
    {
      title: 'Overview',
      items: [
        { id: 'adminDashboard', label: 'Dashboard', icon: 'bx bx-grid-alt', route: '/admin/dashboard' },
      ]
    },
    {
      title: 'Manage Offerings',
      items: [
        { id: 'servicesManagement', label: 'Services', icon: 'bx bx-briefcase-alt', route: '/admin/offeringManagement/services' },
        { id: 'packagesManagement', label: 'Packages', icon: 'bx bx-package', route: '/admin/offeringManagement/packages' }
      ]
    },
    {
      title: 'Manage Users',
      items: [
        { id: 'carUsers', label: 'Car Users', icon: 'bx bx-car', route: '/admin/userManagement/carUsers' },
        { id: 'employees', label: 'Employees', icon: 'bx bx-group', route: '/admin/userManagement/employees/serviceAdvisors' }
      ]
    },
    {
      title: 'Manage Bookings',
      items: [
        { id: 'activeBookings', label: 'Active Bookings', icon: 'bx bx-loader-circle', route: '/admin/bookingManagement/upComing' },
        { id: 'completedBookings', label: 'Completed Bookings', icon: 'bx bx-calendar-check', route: '/admin/completedBookings' },
        { id: 'cancelledBookings', label: 'Cancelled Bookings', icon: 'bx bx-x-circle', route: '/admin/cancelledBookings' }
      ]
    },
    {
      title: ' Manage Revenue',
      items: [
        { id: 'issueRefund', label: 'Transaction History', icon: 'bx bx-history', route: '/admin/incomeManagement' },
      ]
    },
    {
      title: ' System Management',
      items: [
        { id: 'settings', label: 'Settings', icon: 'bx bx-cog', route: '/admin/settings' }
        
      ]
    }
  ];

  const handleMenuClick = useCallback((item: MenuItem) => {
    navigate(item.route);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Optionally clear other user/session data here
    window.location.href = '/admin';
  };

  // Helper function to check if a menu item is active
  const isMenuItemActive = (route: string, id?: string) => {
    if (id === 'carUsers') {
      // Active for car users route
      return location.pathname.startsWith('/admin/userManagement/carUsers');
      
    }
    if (id === 'employees') {
      // Active for employees route
      return location.pathname.startsWith('/admin/userManagement/employees')
    }
    if (id === 'activeBookings') {
      // Active for pending approvals route
      return location.pathname.startsWith('/admin/bookingManagement')
    }

    return location.pathname === route;
  };

  const renderMenuItem = (item: MenuItem, isBottomMenu = false) => {
    const isActive = isMenuItemActive(item.route, item.id);
    return (
      <li key={item.id} className="sidebar-menu-item">
        <button
          className={`sidebar-menu-link ${isActive ? 'active' : ''} ${isBottomMenu ? 'sidebar-menu-link--bottom' : ''}`}
          onClick={() => handleMenuClick(item)}
          aria-label={item.label}
          type="button"
        >
          <span className={`sidebar-menu-icon ${isBottomMenu ? 'sidebar-menu-icon--danger' : ''}`}>
            <i className={item.icon} aria-hidden="true"></i>
          </span>
          <span className={`sidebar-menu-label ${isBottomMenu ? 'sidebar-menu-label--danger' : ''}`}>{item.label}</span>
        </button>
      </li>
    );
  };

  return (
    <aside className="sidebar" role="navigation" aria-label="Main navigation">
      {/* Header */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo-icon">
            <img src={logo} alt="MotorTrace Logo" />
          </div>
          <span className="logo-text">MotorTrace</span>
        </div>
      </div>

      {/* Main Menu with Groups */}
      <nav className="sidebar-nav">
        {menuGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="sidebar-menu-group">
            {group.title && (
              <div className="sidebar-menu-group-title">
                {group.title}
              </div>
            )}
            <ul className="sidebar-menu" role="menu">
              {group.items.map((item) => renderMenuItem(item))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Logout Button at the bottom */}
      <div style={{ marginTop: 'auto', padding: '1rem' }}>
        <button
          className="sidebar-menu-link sidebar-menu-link--bottom"
          onClick={handleLogout}
          aria-label="Logout"
          type="button"
          style={{ color: '#ef4444', width: '100%', display: 'flex', alignItems: 'center', gap: '0.625rem', fontWeight: 600 }}
        >
          <span className="sidebar-menu-icon sidebar-menu-icon--danger">
            <i className="bx bx-log-out" aria-hidden="true"></i>
          </span>
          <span className="sidebar-menu-label sidebar-menu-label--danger">Logout</span>
        </button>
      </div>

    </aside>
  );
};

export default Sidebar;