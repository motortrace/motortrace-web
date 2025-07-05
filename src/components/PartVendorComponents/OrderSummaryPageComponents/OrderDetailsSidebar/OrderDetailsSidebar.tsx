import React from 'react';
import './OrderDetailsSidebar.scss';

interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
}

interface PaymentDetails {
  method: string;
  status: string;
}

interface AddressDetails {
  addressLine1: string;
  city: string;
  country?: string;
}

interface OrderDetailsSidebarProps {
  customer: CustomerDetails;
  payment: PaymentDetails;
  billing: AddressDetails;
  shipping: AddressDetails;
}

const OrderDetailsSidebar: React.FC<OrderDetailsSidebarProps> = ({
  customer,
  payment,
  billing,
  shipping,
}) => {
  return (
    <div className="order-details-sidebar">
      <div className="order-details-sidebar__section">
        <h4 className="order-details-sidebar__section-title">Customer Details</h4>
        <div className="order-details-sidebar__info">
          {/* <span>Name:</span> */}
          <span>{customer.name}</span>
        </div>
        <div className="order-details-sidebar__info">
          {/* <span>Email:</span> */}
          <span>{customer.email}</span>
        </div>
        <div className="order-details-sidebar__info">
          {/* <span>Phone:</span> */}
          <span>{customer.phone}</span>
        </div>
      </div>

      <div className="order-details-sidebar__divider" />

      <div className="order-details-sidebar__section">
        <h4 className="order-details-sidebar__section-title">Payment Details</h4>
        <div className="order-details-sidebar__info">
          {/* <span>Method:</span> */}
          <span>{payment.method}</span>
        </div>
        <div className="order-details-sidebar__info">
          {/* <span>Status:</span> */}
          <span>{payment.status}</span>
        </div>
      </div>

      <div className="order-details-sidebar__divider" />

      <div className="order-details-sidebar__section">
        <h4 className="order-details-sidebar__section-title">Billing Details</h4>
        <div className="order-details-sidebar__info">
          {/* <span>Address:</span> */}
          <span>{billing.addressLine1}</span>
        </div>
        <div className="order-details-sidebar__info">
          {/* <span>City:</span> */}
          <span>{billing.city}</span>
        </div>
        {billing.country && (
          <div className="order-details-sidebar__info">
            {/* <span>Country:</span> */}
            <span>{billing.country}</span>
          </div>
        )}
      </div>

      <div className="order-details-sidebar__divider" />

      <div className="order-details-sidebar__section">
        <h4 className="order-details-sidebar__section-title">Shipping Details</h4>
        <div className="order-details-sidebar__info">
          {/* <span>Address:</span> */}
          <span>{shipping.addressLine1}</span>
        </div>
        <div className="order-details-sidebar__info">
          {/* <span>City:</span> */}
          <span>{shipping.city}</span>
        </div>
        {shipping.country && (
          <div className="order-details-sidebar__info">
            {/* <span>Country:</span> */}
            <span>{shipping.country}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetailsSidebar;
