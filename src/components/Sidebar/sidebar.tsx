import React, { useState } from 'react';
import 'boxicons/css/boxicons.min.css';
import './Sidebar.scss';
import logo from '../../assets/images/motortraceLogo.png';

interface MenuItem {
  id: string;
  label: string;
  icon: string; // Boxicon class name
  isActive?: boolean;
}

const Sidebar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeItem, setActiveItem] = useState('dashboard');

  const mainMenuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'bx bx-grid-alt' },
    { id: 'appointments', label: 'Appointments', icon: 'bx bx-calendar' },
    { id: 'estimates', label: 'Estimates', icon: 'bx bx-calculator' },
    { id: 'inspections', label: 'Inspections', icon: 'bx bx-search-alt' },
    { id: 'scheduling', label: 'Scheduling', icon: 'bx bx-calendar-check' },
    { id: 'invoices', label: 'Invoices', icon: 'bx bx-file' },
    { id: 'payments', label: 'Payments', icon: 'bx bx-credit-card' },
    { id: 'inventory', label: 'Inventory', icon: 'bx bx-box' },
    { id: 'settings', label: 'Settings', icon: 'bx bx-cog' },

  ];

  const bottomMenuItems: MenuItem[] = [
    { id: 'help', label: 'Help', icon: 'bx bx-help-circle' },
    { id: 'logout', label: 'Log out', icon: 'bx bx-log-out' },
  ];

  const handleMenuClick = (itemId: string) => {
    setActiveItem(itemId);
  };

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
      {/* Header */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo-icon">
            <img src={logo} alt="MotorTrace Logo" />
          </div>
          {isExpanded && <span className="logo-text">MotorTrace</span>}
        </div>
        <button 
          className="sidebar-toggle"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <i className={`bx ${isExpanded ? 'bx-chevron-left' : 'bx-chevron-right'}`}></i>
        </button>
      </div>

      {/* Main Menu */}
      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          {mainMenuItems.map((item) => (
            <li key={item.id} className="sidebar-menu-item">
              <button
                className={`sidebar-menu-link ${activeItem === item.id ? 'active' : ''}`}
                onClick={() => handleMenuClick(item.id)}
              >
                <span className="sidebar-menu-icon">
                  <i className={item.icon}></i>
                </span>
                {isExpanded && (
                  <span className="sidebar-menu-label">{item.label}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Menu */}
      <div className="sidebar-bottom">
        <ul className="sidebar-menu">
          {bottomMenuItems.map((item) => (
            <li key={item.id} className="sidebar-menu-item">
              <button
                className={`sidebar-menu-link ${activeItem === item.id ? 'active' : ''}`}
                onClick={() => handleMenuClick(item.id)}
              >
                <span className="sidebar-menu-icon">
                  <i className={item.icon}></i>
                </span>
                {isExpanded && (
                  <span className="sidebar-menu-label">{item.label}</span>
                )}
              </button>
            </li>
          ))}
        </ul>


      </div>
    </div>
  );
};

export default Sidebar;
