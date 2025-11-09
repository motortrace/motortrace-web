import React, { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import 'boxicons/css/boxicons.min.css';
import './partVendorSidebar.scss';
import logo from '../../../assets/images/motortraceLogo.png';

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

const PartVendorSideBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

const menuGroups: MenuGroup[] = [
  {
    title: 'Issuances',
    items: [
      { id: 'orders', label: 'Issuance', icon: 'bx bx-shopping-bag', route: '/inventorymanager/OrderSummary' },
      // { id: 'payments', label: 'Payments', icon: 'bx bx-wallet', route: '/inventorymanager/IncomeSummary' },
    ]
  },
  // {
  //   title: 'Reviews',
  //   items: [
  //     { id: 'reviews', label: 'Reviews', icon: 'bx bx-message-rounded-dots', route: '/inventorymanager/ReviewPage' },
  //     // { id: 'ratings', label: 'Ratings', icon: 'bx bx-star', route: '/inventorymanager/RatingsPage' },
  //   ]
  // },
  {
    title: 'Inventory',
    items: [
      { id: 'products', label: 'Products', icon: 'bx bx-package', route: '/inventorymanager/ProductList' },
      { id: 'stock', label: 'Stock level', icon: 'bx bx-error', route: '/inventorymanager/StockLevel' },
      
    ]
  },
    //   {
    //   title: 'Customers',
    //   items: [
    //     { id: 'customer', label: 'Customers', icon: 'bx bx-grid-alt', route: '/inventorymanager/CustomerSummary' },
    //   ]
    // },
  {
    title: 'Reports',
    items: [
      { id: 'reports', label: 'Reports', icon: 'bx bx-bar-chart-alt-2', route: '/inventorymanager/ReportsSummary' },
    ]
  },
  {
    title: 'Account',
    items: [
      { id: 'logout', label: 'Log Out', icon: 'bx bx-log-out', route: '/logout' },
    ]
  }
];


  const handleMenuClick = useCallback((item: MenuItem) => {
    navigate(item.route);
  }, [navigate]);

  const renderMenuItem = (item: MenuItem) => {
    const isActive = location.pathname === item.route;
    return (
      <li key={item.id} className="sidebar-menu-item">
        <button
          className={`sidebar-menu-link ${isActive ? 'active' : ''}`}
          onClick={() => handleMenuClick(item)}
          aria-label={item.label}
          type="button"
        >
          <span className="sidebar-menu-icon">
            <i className={item.icon} aria-hidden="true"></i>
          </span>
          <span className="sidebar-menu-label">{item.label}</span>
        </button>
      </li>
    );
  };

  return (
    <aside className="sidebar" role="navigation" aria-label="Spare Parts Navigation">
      {/* Header */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo-icon">
            <img src={logo} alt="MotorTrace Logo" />
          </div>
          <span className="logo-text">MotorTrace</span>
        </div>
      </div>

      {/* Menu */}
      <nav className="sidebar-nav">
        {menuGroups.map((group, index) => (
          <div key={index} className="sidebar-menu-group">
            {group.title && <div className="sidebar-menu-group-title">{group.title}</div>}
            <ul className="sidebar-menu" role="menu">
              {group.items.map(item => renderMenuItem(item))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default PartVendorSideBar;
