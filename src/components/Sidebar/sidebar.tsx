import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [activeItem, setActiveItem] = useState('dashboard');
  const navigate = useNavigate();

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
        { id: 'inspections', label: 'Inspections', icon: 'bx bx-search-alt', route: '/servicecenter/inspections' },
        { id: 'jobs', label: 'Jobs', icon: 'bx bx-briefcase', route: '/servicecenter/jobs' },
      ]
    },
    {
      title: 'Business',
      items: [
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
    setActiveItem(item.id);
    navigate(item.route);
  }, [navigate]);

  const renderMenuItem = (item: MenuItem, isBottomMenu = false) => (
    <li key={item.id} className="sidebar-menu-item">
      <button
        className={`sidebar-menu-link ${activeItem === item.id ? 'active' : ''} ${isBottomMenu ? 'sidebar-menu-link--bottom' : ''}`}
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
    </aside>
  );
};

export default Sidebar;