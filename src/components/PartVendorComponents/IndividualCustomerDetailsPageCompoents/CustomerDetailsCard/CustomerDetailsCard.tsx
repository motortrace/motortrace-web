import React from 'react';
import './CustomerDetailsCard.scss';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';

interface CustomerDetailsProps {
  profileImage?: string;
  name: string;
  email: string;
  phone: string;
  billingAddress: string;
  shippingAddress: string;
  joinedDate: string;
}

const CustomerDetailsCard: React.FC<CustomerDetailsProps> = ({
  profileImage,
  name,
  email,
  phone,
  billingAddress,
  shippingAddress,
  joinedDate,
}) => {
  return (
    <div className="customer-details-card">
      <div className="customer-details-card__avatar">
        {profileImage ? (
          <img src={profileImage} alt={name} />
        ) : (
          <div className="customer-details-card__initials">
            {name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .substring(0, 2)
              .toUpperCase()}
          </div>
        )}
      </div>

      <div className="customer-details-card__info">
        <div className="customer-details-card__row">
          <span className="customer-details-card__label">Name</span>
          <span className="customer-details-card__value">{name}</span>
        </div>

        <div className="customer-details-card__row">
          <FaEnvelope className="customer-details-card__icon" />
          <span className="customer-details-card__label">Email</span>
          <span className="customer-details-card__value">{email}</span>
        </div>

        <div className="customer-details-card__row">
          <FaPhone className="customer-details-card__icon" />
          <span className="customer-details-card__label">Phone</span>
          <span className="customer-details-card__value">{phone}</span>
        </div>

        <div className="customer-details-card__row">
          <FaMapMarkerAlt className="customer-details-card__icon" />
          <span className="customer-details-card__label">Billing Address</span>
          <span className="customer-details-card__value">{billingAddress}</span>
        </div>

        <div className="customer-details-card__row">
          <FaMapMarkerAlt className="customer-details-card__icon" />
          <span className="customer-details-card__label">Shipping Address</span>
          <span className="customer-details-card__value">{shippingAddress}</span>
        </div>

        <div className="customer-details-card__row">
          <FaCalendarAlt className="customer-details-card__icon" />
          <span className="customer-details-card__label">Joined Date</span>
          <span className="customer-details-card__value">{joinedDate}</span>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailsCard;
