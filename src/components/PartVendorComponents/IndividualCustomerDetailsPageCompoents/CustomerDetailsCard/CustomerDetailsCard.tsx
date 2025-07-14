import React from 'react';
import {Calendar, DollarSign } from 'lucide-react';
import './CustomerDetailsCard.scss';

const CustomerDetailsCard = () => {
  const customer = {
    profilePic: 'https://i.pravatar.cc/100?img=12',
    name: 'Nimal Perera',
    email: 'nimalp@example.lk',
    phone: '077-1234567',
    billingAddress: {
      number: '45',
      street: 'Temple Road',
      city: 'Colombo',
      province: 'Western Province',
      postalCode: '00700'
    },
    shippingAddress: {
      number: '45',
      street: 'Temple Road',
      city: 'Colombo',
      province: 'Western Province',
      postalCode: '00700'
    },
    joinedDate: '2023-02-12',
    spending: 'LKR 45,000'
  };

  return (
    <div className="customer-details-card">
      <div className="customer-details-card__avatar-section">
        <img src={customer.profilePic} alt={customer.name} className="customer-details-card__avatar" />
      </div>
      <div className="customer-details-card__info-section">
        <div className="customer-details-card__column">
          <h3>Customer Info</h3>
          <p><strong>{customer.name}</strong></p>
          <p>{customer.email}</p>
          <p>{customer.phone}</p>
        </div>
        <div className="customer-details-card__column">
          <h3>Billing Address</h3>
          <p>{customer.billingAddress.number} {customer.billingAddress.street}</p>
          <p>{customer.billingAddress.city}, {customer.billingAddress.province}</p>
          <p>{customer.billingAddress.postalCode}</p>
        </div>
        <div className="customer-details-card__column">
          <h3>Shipping Address</h3>
          <p>{customer.shippingAddress.number} {customer.shippingAddress.street}</p>
          <p>{customer.shippingAddress.city}, {customer.shippingAddress.province}</p>
          <p>{customer.shippingAddress.postalCode}</p>
        </div>
      </div>
<div className="customer-details-card__footer">
  <span className="customer-details-card__badge">
    <Calendar size={14} /> Joined: {customer.joinedDate}
  </span>
  <span className="customer-details-card__badge">
    <DollarSign size={14} /> Spending: {customer.spending}
  </span>
</div>

    </div>
  );
};

export default CustomerDetailsCard;
