import React, { useState, useCallback } from 'react';
import 'boxicons/css/boxicons.min.css';
import './Sidebar.scss';
import logo from '../../assets/images/motortraceLogo.png';

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  isActive?: boolean;
  onClick?: () => void;
}

interface SidebarProps {
  onMenuItemClick?: (itemId: string) => void;
  defaultActiveItem?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  onMenuItemClick,
  defaultActiveItem = 'dashboard'
}) => {
  const [activeItem, setActiveItem] = useState(defaultActiveItem);

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
    { 
      id: 'logout', 
      label: 'Log out', 
      icon: 'bx bx-log-out',
      onClick: () => {
        // Handle logout logic here
        console.log('Logout clicked');
      }
    },
  ];

  const handleMenuClick = useCallback((itemId: string, customOnClick?: () => void) => {
    setActiveItem(itemId);
    
    if (customOnClick) {
      customOnClick();
    } else {
      onMenuItemClick?.(itemId);
    }
  }, [onMenuItemClick]);

  const renderMenuItem = (item: MenuItem, isBottomMenu = false) => (
    <li key={item.id} className="sidebar-menu-item">
      <button
        className={`sidebar-menu-link ${activeItem === item.id ? 'active' : ''} ${isBottomMenu ? 'sidebar-menu-link--bottom' : ''}`}
        onClick={() => handleMenuClick(item.id, item.onClick)}
        aria-label={item.label}
        type="button"
      >
        <span className={`sidebar-menu-icon ${isBottomMenu ? 'sidebar-menu-icon--bottom' : ''}`}>
          <i className={item.icon} aria-hidden="true"></i>
        </span>
        <span className={`sidebar-menu-label ${isBottomMenu ? 'sidebar-menu-label--bottom' : ''}`}>
          {item.label}
        </span>
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

      {/* Main Menu */}
      <nav className="sidebar-nav">
        <ul className="sidebar-menu" role="menu">
          {mainMenuItems.map((item) => renderMenuItem(item))}
        </ul>
      </nav>

      {/* Bottom Menu */}
      <div className="sidebar-bottom">
        <ul className="sidebar-menu" role="menu">
          {bottomMenuItems.map((item) => renderMenuItem(item, true))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;