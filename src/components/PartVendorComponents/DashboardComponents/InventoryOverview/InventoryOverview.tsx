// src/components/InventoryOverview/InventoryOverview.tsx
import React from 'react';
import './InventoryOverview.scss';

const InventoryOverview: React.FC = () => {
  return (
    <div className="inventory-overview">
      <h3 className="inventory-overview__title">Inventory Overview</h3>
      <ul className="inventory-overview__list">
        <li className="inventory-overview__item">
          <span>Low Stock Alerts:</span>
          <strong>5 Items</strong>
        </li>
        <li className="inventory-overview__item">
          <span>Out of Stock:</span>
          <strong>2 Items</strong>
        </li>
        <li className="inventory-overview__item">
          <span>Fast-moving Products:</span>
          <strong>8 Items</strong>
        </li>
      </ul>
    </div>
  );
};

export default InventoryOverview;