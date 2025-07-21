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
      title: 'User Management',
      items: [
        // { id: 'carUsers', label: 'Car Users', icon: 'bx bx-car', route: '/admin/userManagement/carUsers' },
        // { id: 'serviceCenters', label: 'Service Centers', icon: 'bx bx-wrench', route: '/admin/userManagement/serviceCenters' },
        // { id: 'sparePartsSellers', label: 'Spare Parts Sellers', icon: 'bx bx-store', route: '/admin/userManagement/sparePartsSellers' },
        { id: 'allUsers', label: 'All Users', icon: 'bx bx-group', route: '/admin/userManagement/carUsers' },
        { id: 'pendingApprovals', label: 'Pending Approvals', icon: 'bx bx-hourglass', route: '/admin/userManagement/pendingApprovals' },
      ]
    },
    {
      title: 'Bookings & Orders',
      items: [
        { id: 'bookingOversight', label: 'Booking Oversight', icon: 'bx bx-calendar-check', route: '/admin/bookingOversight' },
        { id: 'orderManagement', label: 'Order Management', icon: 'bx bx-cart', route: '/servicecenter/estimates' },
        { id: 'refundsAndCancellations', label: 'Refund Management', icon: 'bx bx-undo', route: '/admin/refundManagement' }
      ]
    },
    {
      title: ' Content Moderation',
      items: [
        // { id: 'reviewManagement', label: 'Review Management', icon: 'bx bx-star', route: '/admin/viewThread' },
        { id: 'forumPosts', label: 'Forum Management', icon: 'bx bx-chat', route: '/admin/contentModeration' },
      ]
    },
    {
      title: ' Financial Overview',
      items: [
        // { id: 'subscriptionEarnings', label: 'Subscription Earnings', icon: 'bx bx-receipt', route: '/servicecenter/inventory' },
        { id: 'revenueAndPayouts', label: 'Revenue & Payouts', icon: 'bx bx-line-chart', route: '/admin/revenueAndPayouts' },
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

  // Helper function to check if a menu item is active
  const isMenuItemActive = (route: string, id?: string) => {
    if (id === 'allUsers') {
      // Active for any user management tab except pending approvals
      return (
        location.pathname.startsWith('/admin/userManagement/') &&
        !location.pathname.includes('pendingApprovals')
      );
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
    </aside>
  );
};

export default Sidebar;