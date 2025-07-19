import React from 'react';
import './OrderDetailsSidebar.scss';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

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
  const navigate = useNavigate();

  const handleCustomerNavigate = () => {
    // const encodedName = encodeURIComponent(customer.name);
    navigate(`/PartVendor/CustomerDetails`);
  };

  return (
    <div className="order-details-sidebar">
      <div className="order-details-sidebar__section">
        <div className="order-details-sidebar__section-header">
          <h4 className="order-details-sidebar__section-title">Customer Details</h4>
          <button
            className="order-details-sidebar__arrow-button"
            onClick={handleCustomerNavigate}
            title={`Go to ${customer.name}'s profile`}
          >
            <ArrowUpRight size={14} />
          </button>
        </div>

        <div className="order-details-sidebar__info">
          <span>{customer.name}</span>
        </div>
        <div className="order-details-sidebar__info">
          <span>{customer.email}</span>
        </div>
        <div className="order-details-sidebar__info">
          <span>{customer.phone}</span>
        </div>
      </div>

      <div className="order-details-sidebar__divider" />

      <div className="order-details-sidebar__section">
        <h4 className="order-details-sidebar__section-title">Payment Details</h4>
        <div className="order-details-sidebar__info">
          <span>{payment.method}</span>
        </div>
        <div className="order-details-sidebar__info">
          <span>{payment.status}</span>
        </div>
      </div>

      <div className="order-details-sidebar__divider" />

      <div className="order-details-sidebar__section">
        <h4 className="order-details-sidebar__section-title">Billing Details</h4>
        <div className="order-details-sidebar__info">
          <span>{billing.addressLine1}</span>
        </div>
        <div className="order-details-sidebar__info">
          <span>{billing.city}</span>
        </div>
        {billing.country && (
          <div className="order-details-sidebar__info">
            <span>{billing.country}</span>
          </div>
        )}
      </div>

      <div className="order-details-sidebar__divider" />

      <div className="order-details-sidebar__section">
        <h4 className="order-details-sidebar__section-title">Shipping Details</h4>
        <div className="order-details-sidebar__info">
          <span>{shipping.addressLine1}</span>
        </div>
        <div className="order-details-sidebar__info">
          <span>{shipping.city}</span>
        </div>
        {shipping.country && (
          <div className="order-details-sidebar__info">
            <span>{shipping.country}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetailsSidebar;
