import React from 'react';
import './ShippingStatus.scss';

const ShippingStatus: React.FC = () => {
  return (
    <div className="shipping-status">
      <h4>Shipment Scheduled</h4>
      <p>Your order will be assigned to a driver shortly.</p>
      <div className="spinner" />
    </div>
  );
};

export default ShippingStatus;
