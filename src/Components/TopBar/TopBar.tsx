import React from 'react';
import './TopBar.scss';
import { HiArrowLeft } from 'react-icons/hi';

function TopBar() {
  return (
    <div className="topbar">
      <div className="topbar__left">
        <a href="/dashboard" className="dashboard-link">
          <HiArrowLeft className="icon" />
          <span>Go to Dashboard</span>
        </a>
      </div>

      <div className="topbar__right">
        <a href="/track-order">Track Order</a>
        <span>|</span>
        <a href="/seller/register">Become a Seller</a>
        <span>|</span>
        <a href="/support">Help</a>
        <span>|</span>
        <a href="/login">Sign In</a>
        <span>|</span>
        <a href="/register">Register</a>
      </div>
    </div>
  );
}

export default TopBar;
