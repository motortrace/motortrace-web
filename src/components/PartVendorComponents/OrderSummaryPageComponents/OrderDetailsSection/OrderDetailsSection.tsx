import React from 'react';
import './OrderDetailsSection.scss';

interface Address {
  name: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface OrderDetailsSectionProps {
  customerName: string;
  customerEmail: string;
  shippingAddress: Address;
  billingAddress: Address;
}

const OrderDetailsSection: React.FC<OrderDetailsSectionProps> = ({
  customerName,
  customerEmail,
  shippingAddress,
  billingAddress,
}) => {
  return (
    <div className="order-details-box">
      <div className="order-details-box__row">
        <div className="order-details-box__section">
          <h3 className="order-details-box__section-title">Customer Details</h3>
          <p className="order-details-box__text"><strong>Name:</strong> {customerName}</p>
          <p className="order-details-box__text"><strong>Email:</strong> {customerEmail}</p>
        </div>
        <div className="order-details-box__section">
          <h3 className="order-details-box__section-title">Shipping Address</h3>
          <address className="order-details-box__address">
            <p>{shippingAddress.name}</p>
            <p>{shippingAddress.addressLine1}</p>
            {shippingAddress.addressLine2 && <p>{shippingAddress.addressLine2}</p>}
            <p>
              {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
            </p>
            <p>{shippingAddress.country}</p>
          </address>
        </div>
        <div className="order-details-box__section">
          <h3 className="order-details-box__section-title">Billing Address</h3>
          <address className="order-details-box__address">
            <p>{billingAddress.name}</p>
            <p>{billingAddress.addressLine1}</p>
            {billingAddress.addressLine2 && <p>{billingAddress.addressLine2}</p>}
            <p>
              {billingAddress.city}, {billingAddress.state} {billingAddress.zipCode}
            </p>
            <p>{billingAddress.country}</p>
          </address>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsSection;
