// components/JobCard/CustomerInfoCard.tsx
import React from 'react';

export const CustomerInfoCard: React.FC = () => {
  const customerImageUrl = "https://i.pravatar.cc/150?u=a042581f4e29026704d";
  
  return (
    <div className="info-card">
      <h3 className="info-card__title">Customer</h3>
      <div className="info-card__body">
        <div className="info-card__item info-card__item--image">
          <img src={customerImageUrl} alt="Amber Miller" className="customer-image"/>
        </div>
        <div className="info-card__item">
          <span className="info-card__label">Name</span>
          <span className="info-card__value">Amber Miller</span>
        </div>
        <div className="info-card__item">
          <span className="info-card__label">Phone</span>
          <span className="info-card__value">(555) 123-4567</span>
        </div>
        <div className="info-card__item">
          <span className="info-card__label">Email</span>
          <span className="info-card__value">amber.miller@email.com</span>
        </div>
      </div>
    </div>
  );
};