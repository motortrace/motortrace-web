import React from 'react';
import './Navbar.scss';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h2 className="page-title">Welcome back, John!</h2>
        <p className="page-description">Overview of your balance and accounts</p>
      </div>

      <div className="navbar-right">
        <button aria-label="Search" className="icon-btn search-btn">
          <i className="bx bx-search"></i>
        </button>

        <button aria-label="Notifications" className="icon-btn notification-btn">
          <i className="bx bx-bell"></i>
          <span className="notification-badge">3</span>
        </button>

        <div className="user-profile">
          <img
            src="https://i.pravatar.cc/40?img=1"
            alt="User Profile"
            className="user-photo"
          />
          <div className="user-info">
            <div className="user-name">Adaline Lively</div>
            <div className="user-email">adaline@example.com</div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;