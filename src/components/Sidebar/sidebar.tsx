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

interface MenuGroup {
  title?: string;
  items: MenuItem[];
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

  const menuGroups: MenuGroup[] = [
    {
      title: 'Overview',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: 'bx bx-grid-alt' },
      ]
    },
    {
      title: 'Operations',
      items: [
        { id: 'appointments', label: 'Appointments', icon: 'bx bx-calendar' },
        { id: 'scheduling', label: 'Scheduling', icon: 'bx bx-calendar-check' },
        { id: 'inspections', label: 'Inspections', icon: 'bx bx-search-alt' },
      ]
    },
    {
      title: 'Business',
      items: [
        { id: 'estimates', label: 'Estimates', icon: 'bx bx-calculator' },
        { id: 'invoices', label: 'Invoices', icon: 'bx bx-file' },
        { id: 'payments', label: 'Payments', icon: 'bx bx-credit-card' },
      ]
    },
    {
      title: 'Management',
      items: [
        { id: 'inventory', label: 'Inventory', icon: 'bx bx-box' },
        { id: 'settings', label: 'Settings', icon: 'bx bx-cog' },
      ]
    }
  ];

  // const bottomMenuItems: MenuItem[] = [
  //   { 
  //     id: 'logout', 
  //     label: 'Log out', 
  //     icon: 'bx bx-log-out',
  //     onClick: () => {
  //       console.log('Logout clicked');
  //     }
  //   },
  // ];

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
        <span className={`sidebar-menu-icon ${isBottomMenu ? 'sidebar-menu-icon--danger' : ''}`}>
          <i className={item.icon} aria-hidden="true"></i>
        </span>
        <span className={`sidebar-menu-label ${isBottomMenu ? 'sidebar-menu-label--danger' : ''}`}>
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

      {/* Bottom Menu, ill add later ok */}
      {/* <div className="sidebar-bottom">
        <ul className="sidebar-menu" role="menu">
          {bottomMenuItems.map((item) => renderMenuItem(item, true))}
        </ul>
      </div> */}
    </aside>
  );
};

export default Sidebar;