import React from 'react';
import { HiChevronDown } from 'react-icons/hi';
import './NavStrip.scss';

const NavStrip = () => {
  return (
    <div className="navstrip">
      <div className="navstrip__item navstrip__dropdown">
        <span className="label">All Categories</span>
        <HiChevronDown className="icon" />
      </div>
      <div className="navstrip__item">Offers</div>
      <div className="navstrip__item">Top Brands</div>
      <div className="navstrip__item">New Arrivals</div>
      <div className="navstrip__item">Bulk Orders</div>
    </div>
  );
};

export default NavStrip;
