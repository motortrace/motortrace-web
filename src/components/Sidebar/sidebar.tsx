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

  // Get the base path from current location (e.g., '/serviceadvisor', '/manager', etc.)
  const getBasePath = () => {
    const pathSegments = location.pathname.split('/');
    return `/${pathSegments[1]}`; // Gets the first segment after the root
  };

  const basePath = getBasePath();

  // Get user role from localStorage
  const getUserRole = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user?.role || 'serviceadvisor';
    } catch {
      return 'serviceadvisor';
    }
  };

  const userRole = getUserRole();
  const isServiceAdvisor = userRole === 'serviceadvisor' || userRole === 'service_advisor' || userRole === 'advisor';

  // Define all menu groups
  const allMenuGroups: MenuGroup[] = [
    {
      title: 'Dashboard',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: 'bx bx-grid-alt', route: `${basePath}/dashboard` },
      ]
    },
    {
      title: 'Appointments',
      items: [
        { id: 'appointments', label: 'Appointments', icon: 'bx bx-calendar', route: `${basePath}/appointments` },
      ]
    },
    {
      title: 'Staff',
      items: [
        { id: 'manage-technicians', label: 'Technicians', icon: 'bx bx-id-card', route: `${basePath}/employee-management` },
      ]
    },
    {
      title: 'Operations',
      items: [
        // { id: 'calendar', label: 'Calendar', icon: 'bx bx-calendar-week', route: `${basePath}/calendar` },
        { id: 'Workflow', label: 'Workflow', icon: 'bx bx-briefcase', route: `${basePath}/workflow` },
        // { id: 'work-orders', label: 'Work Orders', icon: 'bx bx-briefcase', route: `${basePath}/work-order` },
        // { id: 'services', label: 'Services', icon: 'bx bx-search-alt', route: `${basePath}/services` },
      ]
    },
    {
      title: 'Inspections',
      items: [
        { id: 'inspection-templates', label: 'Templates', icon: 'bx bx-folder', route: `${basePath}/inspection-templates` },
        { id: 'inspection-records', label: 'Records', icon: 'bx bx-clipboard', route: `${basePath}/inspection-records` },
      ]
    },
    {
      title: 'Invoices',
      items: [
        { id: 'invoices', label: 'Invoices', icon: 'bx bx-folder', route: `${basePath}/invoices` },
      ] 
    },
    {
      title: 'Spare Parts',
      items: [
        { id: 'inventory', label: 'Inventory', icon: 'bx bx-box', route: `${basePath}/inventory` },
      ]
    },
    {
      title: 'Settings',
      items: [
        { id: 'settings', label: 'Settings', icon: 'bx bx-cog', route: `${basePath}/settings` },
      ]
    }
  ];

  // Filter menu groups based on user role
  const menuGroups = isServiceAdvisor 
    ? allMenuGroups.filter(group => {
        // For service advisors, exclude: Appointments, Staff, Templates under Inspections, Business
        const excludedTitles = ['Appointments', 'Staff', 'Business'];
        const excludedItems = ['inspection-templates']; // Templates under Inspections
        
        if (excludedTitles.includes(group.title || '')) {
          return false;
        }
        
        // Filter out specific items within allowed groups
        if (group.title === 'Inspections') {
          group.items = group.items.filter(item => !excludedItems.includes(item.id));
          return group.items.length > 0; // Only include if there are remaining items
        }
        
        return true;
      })
    : allMenuGroups; // Managers see all menu groups

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