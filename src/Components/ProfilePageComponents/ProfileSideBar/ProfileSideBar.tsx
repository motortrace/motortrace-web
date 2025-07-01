import React from 'react';
import {
  FaUser,
  FaClipboardList,
  FaBoxOpen,
  FaHeart,
  FaSignOutAlt,
  FaAddressCard,
  FaCogs,
} from 'react-icons/fa';
import './ProfileSidebar.scss';

const menuItems = [
  { label: 'My Profile', icon: <FaUser />, path: '/profile' },
  { label: 'My Orders', icon: <FaClipboardList />, path: '/profile/orders' },
  { label: 'Parts Requests', icon: <FaCogs />, path: '/profile/requests' },
  { label: 'Saved Items', icon: <FaHeart />, path: '/profile/wishlist' },
  { label: 'Addresses', icon: <FaAddressCard />, path: '/profile/addresses' },
  { label: 'Logout', icon: <FaSignOutAlt />, path: '/logout' },
];

const ProfileSidebar = () => {
  return (
    <aside className="profile-sidebar">
      <div className="sidebar-header">My Account</div>
      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li key={item.label} className="sidebar-item">
            <a href={item.path}>
              <span className="icon">{item.icon}</span>
              <span className="label">{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default ProfileSidebar;
