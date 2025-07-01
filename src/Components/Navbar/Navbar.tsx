import React, { useState, useRef, useEffect } from 'react';
import './Navbar.scss';
import {
  HiOutlineShoppingCart,
  HiOutlineUser,
  HiMagnifyingGlass,
  HiChevronDown
} from 'react-icons/hi2';

import logo from '../../assets/images/logo.jpg';
import { useNavigate } from 'react-router-dom';




const categories = [
  'Engine Parts',
  'Brakes & Suspension',
  'Electrical Systems',
  'Filters',
  'Batteries',
  'Cooling Systems',
  'Lighting',
  'Body Parts'
];

const recentSearches = [
  'Toyota brake pads',
  'Honda Civic alternator',
  'LED headlights',
  'Car battery replacement'
];

function Navbar() {
  const navigate = useNavigate();
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setDropdownVisible(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar__top">
        <div className="navbar__logo" onClick={() => navigate('/')}>
          <img src={logo} alt="MotorTrace Logo" />
          <div className="logo-text-group">
            <span className="logo-main">MotorTrace<span className="logo-sub"> | Marketplace</span></span>
          </div>
        </div>

        <div className="navbar__search-container" ref={wrapperRef}>
          <div className="search-wrapper">
            <HiMagnifyingGlass className="search-icon" />
            <input
              type="text"
              className="navbar__search"
              placeholder="Search for spare parts, brands & categories"
              onFocus={() => setDropdownVisible(true)}
            />
            {isDropdownVisible && (
              <div className="search-structured-dropdown">
                <div className="dropdown-section">
                  <div className="dropdown-title">Recently Searched</div>
                  {recentSearches.map((item, idx) => (
                    <div className="dropdown-item" key={idx}>
                      {item}
                    </div>
                  ))}
                </div>

                <div className="dropdown-section categories">
                  <div className="dropdown-title">Categories</div>
                  <div className="category-pills">
                    {categories.map((category, index) => (
                      <button key={index} className="category-pill">
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="navbar__icons">
          <div className="icon-group">
            <div className="icon-box">
              <HiOutlineUser />
            </div>
            <div className="text">
              <div className="main">My Account</div>
              <div className="sub" onClick={()=> navigate('/login')}>Login / Sign Up</div>
            </div>
          </div>

          <div className="icon-group cart" onClick={()=> navigate('/cart')}>
            <div className="icon-box">
              <HiOutlineShoppingCart />
            </div>
            <span className="badge">2</span>
            <div className="text">
              <div className="main">Checkout</div>
              <div className="sub">LRK 2500</div>
            </div>
          </div>
        </div>
      </div>

<div className="navstrip">
  <div className="navstrip__item navstrip__dropdown">
    <span className="label">All Categories</span>
    <HiChevronDown className="icon" />
  </div>
  <div className="navstrip__item">Offers</div>
  <div className="navstrip__item">New Arrivals</div>
  <div className="navstrip__item">Best Sellers</div>
  <div className="navstrip__item">Clearance Sale</div>
  <div className="navstrip__item">Verified Sellers</div>
</div>
    </nav>
  );
}

export default Navbar;
