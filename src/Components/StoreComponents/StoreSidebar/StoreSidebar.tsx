import React from 'react';
import './StoreSidebar.scss';

const StoreSidebar = () => {
  return (
    <aside className="store-sidebar">
      <div className="filter-section">
        <h3 className="filter-title">Categories</h3>
        <ul className="filter-list">
          <li>Engine Parts</li>
          <li>Brake Systems</li>
          <li>Suspension</li>
          <li>Electrical</li>
          <li>Body Parts</li>
        </ul>
      </div>

      <div className="filter-section">
        <h3 className="filter-title">Brands</h3>
        <ul className="filter-list">
          <li><input type="checkbox" /> Bosch</li>
          <li><input type="checkbox" /> Brembo</li>
          <li><input type="checkbox" /> Denso</li>
          <li><input type="checkbox" /> Delphi</li>
        </ul>
      </div>

      <div className="filter-section">
        <h3 className="filter-title">Price Range</h3>
        <div className="price-inputs">
          <input type="number" placeholder="Min" />
          <span>—</span>
          <input type="number" placeholder="Max" />
        </div>
        <button className="apply-button">Apply</button>
      </div>
    </aside>
  );
};

export default StoreSidebar;
