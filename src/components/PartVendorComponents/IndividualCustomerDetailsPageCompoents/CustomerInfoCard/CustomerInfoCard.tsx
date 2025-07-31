import React from 'react';
import './CustomerInfoCard.scss';
import customerAvatar from '../../../../assets/images/customer-avatar.png';

interface CustomerInfoCardProps {
  name: string;
  email: string;
  phone: string;
  billingAddress: string;
  shippingAddress: string;
  joinedDate: string;
  spending: number;
}

const CustomerInfoCard: React.FC<CustomerInfoCardProps> = ({
  name,
  email,
  phone,
  billingAddress,
  shippingAddress,
  joinedDate,
  spending,
}) => {
  return (
    <div className="customer-info-card">
      {/* Header */}
      <div className="customer-info-card__top">
        <img src={customerAvatar} alt="Customer" className="customer-info-card__avatar" />
        <div>
          <h2 className="customer-info-card__name">{name}</h2>
          <p className="customer-info-card__email">{email}</p>
          <p className="customer-info-card__phone">{phone}</p>
        </div>
      </div>

      {/* Address Section */}
      <div className="customer-info-card__addresses">
        <div>
          <h4>Billing Address</h4>
          <p>{billingAddress}</p>
        </div>
        <div>
          <h4>Shipping Address</h4>
          <p>{shippingAddress}</p>
        </div>
      </div>

      {/* Meta Info */}
      <div className="customer-info-card__footer">
        <div className="customer-info-card__badge">
          <span>Joined</span>
          <strong>{joinedDate}</strong>
        </div>
        <div className="customer-info-card__badge">
          <span>Total Spending</span>
          <strong>LKR {spending.toLocaleString()}</strong>
        </div>
      </div>
    </div>
  );
};

export default CustomerInfoCard;
