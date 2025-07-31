import React from 'react';
import { Calendar, Mail, Phone } from 'lucide-react';
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
      postalCode: '00700',
    },
    shippingAddress: {
      number: '45',
      street: 'Temple Road',
      city: 'Colombo',
      province: 'Western Province',
      postalCode: '00700',
    },
    joinedDate: '2023-02-12',
    spending: 'LKR 45,000',
  };

  return (
    <div className="customer-card">
      <div className="customer-card__header">
        <img src={customer.profilePic} alt={customer.name} className="customer-card__avatar" />
        <div className="customer-card__basic">
          <h2>{customer.name}</h2>
          <p><Mail size={14} /> {customer.email}</p>
          <p><Phone size={14} /> {customer.phone}</p>
        </div>
      </div>

      <div className="customer-card__addresses">
        <div className="customer-card__block">
          <h4>Billing Address</h4>
          <p>{customer.billingAddress.number} {customer.billingAddress.street}</p>
          <p>{customer.billingAddress.city}, {customer.billingAddress.province}</p>
          <p>{customer.billingAddress.postalCode}</p>
        </div>
        <div className="customer-card__block">
          <h4>Shipping Address</h4>
          <p>{customer.shippingAddress.number} {customer.shippingAddress.street}</p>
          <p>{customer.shippingAddress.city}, {customer.shippingAddress.province}</p>
          <p>{customer.shippingAddress.postalCode}</p>
        </div>
      </div>

      <div className="customer-card__meta">
        <div className="customer-card__badge">
          <Calendar size={14} /> Joined: {customer.joinedDate}
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailsCard;
