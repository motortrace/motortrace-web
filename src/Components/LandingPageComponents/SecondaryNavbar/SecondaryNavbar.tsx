import React from 'react';
import './SecondaryNavbar.scss';

function SecondaryNavbar() {
  return (
    <div className="secondary-navbar">
      <button className="category-button">☰ Shop by Categories</button>

      <div className="nav-links">
        <a href="#">Home</a>
        <a href="#">Electronics</a>
        <a href="#">Fashion</a>
        <a href="#">Exclusives</a>
        <a href="#">Specialty</a>
      </div>

      <button className="deals-button">🎟 Super Deals Day</button>
    </div>
  );
}

export default SecondaryNavbar;
