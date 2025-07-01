// components/SidebarFilters.tsx
import React, { useState } from 'react';
import './SideBarFilter.scss';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { FaStar } from 'react-icons/fa';

const SidebarFilters: React.FC = () => {
  const [priceRange, setPriceRange] = useState<[number, number]>([1000, 8000]);

  return (
    <aside className="sidebar-filters">
      <h3 className="sidebar-title">FILTER BY</h3>

      <div className="filter-section">
        <h4>CATERGORY</h4>
        <div className="filter-option">
          <input type="checkbox" id="engine-oil" />
          <label htmlFor="engine-oil">Engine Oil</label>
        </div>
        <div className="filter-option">
          <input type="checkbox" id="brake-fluid" />
          <label htmlFor="brake-fluid">Brake Fluid</label>
        </div>
        <div className="filter-option">
          <input type="checkbox" id="coolant" />
          <label htmlFor="coolant">Coolant</label>
        </div>
      </div>

      <hr />

      <div className="filter-section">
        <h4>AVAILABILITY</h4>
        <div className="filter-option">
          <input type="checkbox" id="in-stock" />
          <label htmlFor="in-stock">In Stock</label>
          <span className="count">7</span>
        </div>
        <div className="filter-option">
          <input type="checkbox" id="out-of-stock" />
          <label htmlFor="out-of-stock">Out of Stock</label>
          <span className="count">1</span>
        </div>
      </div>

      <hr />

      <div className="filter-section">
        <h4>BRAND</h4>
        <div className="filter-option">
          <input type="checkbox" id="zic" />
          <label htmlFor="zic">ZIC</label>
          <span className="count">4</span>
        </div>
        <div className="filter-option">
          <input type="checkbox" id="shell" />
          <label htmlFor="shell">Shell</label>
          <span className="count">3</span>
        </div>
        <div className="filter-option">
          <input type="checkbox" id="total" />
          <label htmlFor="total">Total</label>
          <span className="count">2</span>
        </div>
      </div>

      <hr />

      <div className="filter-section">
        <h4>PRICE</h4>
        <div className="price-slider">
          <Slider
            range
            min={0}
            max={10000}
            step={100}
            defaultValue={priceRange}
            onChange={(value) => setPriceRange(value as [number, number])}
          />
          <div className="price-values">
            <span>Rs {priceRange[0]}</span>
            <span>Rs {priceRange[1]}</span>
          </div>
        </div>
      </div>

      <hr />

      <div className="filter-section">
        <h4>CUSTOMER RATING</h4>
        {[4, 3, 2, 1].map((stars) => (
          <div className="filter-option" key={stars}>
            <input type="checkbox" id={`rating-${stars}`} />
            <label htmlFor={`rating-${stars}`}>
              {Array.from({ length: stars }).map((_, i) => (
                <FaStar key={i} color="#facc15" size={14} />
              ))}
              &nbsp; & Up
            </label>
            <span className="count">{Math.floor(Math.random() * 5) + 1}</span>
          </div>
        ))}
      </div>

      <hr />

      <div className="filter-section">
        <h4>VEHICLE TYPE</h4>
        <div className="filter-option">
          <input type="checkbox" id="car" />
          <label htmlFor="car">Car</label>
        </div>
        <div className="filter-option">
          <input type="checkbox" id="bike" />
          <label htmlFor="bike">Bike</label>
        </div>
        <div className="filter-option">
          <input type="checkbox" id="truck" />
          <label htmlFor="truck">Truck</label>
        </div>
      </div>
    </aside>
  );
};

export default SidebarFilters;
