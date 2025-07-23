import React from 'react';
import './OrderSummary.scss';

interface OrderSummaryProps {
  itemsCount: number;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  paymentMethod?: string;
  estimatedDelivery?: string;
  currency?: string;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  itemsCount,
  subtotal,
  discount,
  shipping,
  tax,
  total,
  paymentMethod = 'Credit/Debit Card',
  estimatedDelivery = '3-5 Business Days',
  currency = 'LKR',
}) => {
  return (
    <div className="order-summary">
      <div className="order-summary__header">
        <div className="order-summary__title">Order Summary</div>
        <div className="order-summary__header-info">
          <span className="order-summary__delivery">{estimatedDelivery}</span>
          <span className="order-summary__payment-method">{paymentMethod}</span>
        </div>
      </div>

      <div className="order-summary__item">
        <span>Number of Items</span>
        <span>{itemsCount}</span>
      </div>
      <div className="order-summary__item">
        <span>Subtotal</span>
        <span>{currency} {subtotal.toLocaleString()}</span>
      </div>
      <div className="order-summary__item">
        <span>Discount -- (CODE20OFF)</span>
        <span>- {currency} {discount.toLocaleString()}</span>
      </div>
      <div className="order-summary__item">
        <span>Shipping Fee</span>
        <span>{currency} {shipping.toLocaleString()}</span>
      </div>
      <div className="order-summary__item">
        <span>Tax</span>
        <span>{currency} {tax.toLocaleString()}</span>
      </div>

      <div className="order-summary__divider" />

      <div className="order-summary__total">
        <span>Total</span>
        <span>{currency} {total.toLocaleString()}</span>
      </div>
    </div>
  );
};

export default OrderSummary;
