import React from 'react';
import './OrderHeaderActions.scss';
import { ChevronLeft, Check, X, CornerUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface OrderHeaderActionsProps {
  orderNumber: string;
  customerName: string;
  status: 'Paid' | 'Pending' | 'Failed' | 'Accepted';
  onAccept: () => void;
  onDecline: () => void;
}

const OrderHeaderActions: React.FC<OrderHeaderActionsProps> = ({
  orderNumber,
  customerName,
  status,
  onAccept,
  onDecline,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/PartVendor/OrderSummary');
  };

  const handleCustomerClick = () => {
    // Replace with the correct dynamic route if needed
    const encodedName = encodeURIComponent(customerName);
    navigate(`/PartVendor/Customers/${encodedName}`);
  };

  return (
    <div className="order-header-actions">
      <button className="order-header-actions__back-button" onClick={handleBack}>
        <ChevronLeft size={16} /> Back to Orders
      </button>

      <div className="order-header-actions__details">
        <div className="order-header-actions__info">
          <h2 className="order-header-actions__order-number">
            Order: {orderNumber}
          </h2>
          <span
            className={`order-header-actions__status order-header-actions__status--${status.toLowerCase()}`}
          >
            {status}
          </span>
        </div>

        {status === 'Pending' && (
          <div className="order-header-actions__buttons">
            <button className="order-header-actions__button" onClick={onAccept}>
              <span className="order-header-actions__button-icon">
                <Check size={12} />
              </span>
              Accept
            </button>
            <button className="order-header-actions__button" onClick={onDecline}>
              <span className="order-header-actions__button-icon">
                <X size={12} />
              </span>
              Decline
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHeaderActions;
