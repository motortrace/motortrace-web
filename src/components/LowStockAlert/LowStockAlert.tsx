import React from 'react';
import './LowStockAlert.scss';

interface LowStockAlertProps {
  lowStockCount: number;
  outOfStockCount: number;
  onViewDetails: () => void;
}

const LowStockAlert: React.FC<LowStockAlertProps> = ({ lowStockCount, outOfStockCount, onViewDetails }) => {
  return (
    <div className="low-stock-alert">
      <div className="low-stock-alert__icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      </div>
      <div className="low-stock-alert__content">
        <h3 className="low-stock-alert__title">Inventory Alert</h3>
        <p className="low-stock-alert__message">
          You have <span className="low-stock-alert__count--warning">{lowStockCount} items</span> with low stock and <span className="low-stock-alert__count--critical">{outOfStockCount} items</span> out of stock.
        </p>
      </div>
      <div className="low-stock-alert__actions">
        <button onClick={onViewDetails} className="btn btn--warning">
          View Items
        </button>
      </div>
    </div>
  );
};

export default LowStockAlert;