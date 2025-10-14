import React, { useEffect, useState } from 'react';
import './Navbar.scss';
import { fetchUserStatus } from '../../utils/fetchUserStatus';

const Navbar: React.FC = () => {

  const [user, setUser] = useState<{ name?: string; email?: string }>({});

  useEffect(() => {
    const getUser = async () => {
      const status = await fetchUserStatus();
      if (status && status.name && status.email) {
        setUser({ name: status.name, email: status.email });
      } else if (status && status.user) {
        setUser({ name: status.user.name, email: status.user.email });
      }
    };
    getUser();
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="search-box">
          <i className="bx bx-search"></i>
          <input
            type="text"
            placeholder="Search..."
            className="search-input"
          />
        </div>
      </div>

      <div className="navbar-right">
        <button aria-label="Notifications" className="icon-btn notification-btn">
          <i className="bx bx-bell"></i>
          <span className="notification-badge">3</span>
        </button>

        <div className="user-profile">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8cUiQAZ26gJeXbeZOoLvnX77pZiZqPWaDNgZ6yFwGERlhsHKYzjsXl7EPGp5YUmItuKk&usqp=CAU"
            alt="User Profile"
            className="user-photo"
          />
          <div className="user-info">
            <div className="user-name">{user.name ? user.name : 'Guest User'}</div>
            <div className="user-email">{user.email ? user.email : 'guest@example.com'}</div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;