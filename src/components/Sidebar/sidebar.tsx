import React, { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import 'boxicons/css/boxicons.min.css';
import './Sidebar.scss';
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
        { id: 'dashboard', label: 'Dashboard', icon: 'bx bx-grid-alt', route: '/servicecenter/dashboard' },
      ]
    },
    {
      title: 'Operations',
      items: [
        { id: 'appointments', label: 'Appointments', icon: 'bx bx-calendar', route: '/servicecenter/appointments' },
        { id: 'scheduling', label: 'Scheduling', icon: 'bx bx-calendar-check', route: '/servicecenter/scheduling' },
        { id: 'calendar', label: 'Calendar', icon: 'bx bx-calendar-week', route: '/servicecenter/calendar' },
        { id: 'inspections', label: 'Inspections', icon: 'bx bx-search-alt', route: '/servicecenter/inspections' },
        { id: 'jobs', label: 'Jobs', icon: 'bx bx-briefcase', route: '/servicecenter/jobs' },
      ]
    },
    {
      title: 'Business',
      items: [
        { id: 'suppliers', label: 'Suppliers', icon: 'bx bx-user', route: '/servicecenter/suppliers' },
        { id: 'estimates', label: 'Estimates', icon: 'bx bx-calculator', route: '/servicecenter/estimates' },
        { id: 'invoices', label: 'Invoices', icon: 'bx bx-file', route: '/servicecenter/invoices' },
        { id: 'payments', label: 'Payments', icon: 'bx bx-credit-card', route: '/servicecenter/payments' },
      ]
    },
    {
      title: 'Management',
      items: [
        { id: 'inventory', label: 'Inventory', icon: 'bx bx-box', route: '/servicecenter/inventory' },
        { id: 'settings', label: 'Settings', icon: 'bx bx-cog', route: '/servicecenter/settings' },
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
    window.location.href = '/login';
  };

  const renderMenuItem = (item: MenuItem, isBottomMenu = false) => {
    const isActive = location.pathname === item.route;
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