import React from 'react';
import './CartTotalSummary.scss';

interface CartTotalSummaryProps {
  subtotal: number;
  shipping?: number;
  total: number;
  onCheckout: () => void;
}

const CartTotalSummary: React.FC<CartTotalSummaryProps> = ({
  subtotal,
  shipping = 0,
  total,
  onCheckout,
}) => {
  return (
    <div className="cart-summary">
      <h3>Order Summary</h3>

      <div className="summary-row">
        <span>Subtotal:</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>

      {shipping > 0 && (
        <div className="summary-row">
          <span>Shipping:</span>
          <span>${shipping.toFixed(2)}</span>
        </div>
      )}

      <div className="summary-row total">
        <span>Total:</span>
        <span>${total.toFixed(2)}</span>
      </div>

      <button className="checkout-btn" onClick={onCheckout}>
        Proceed to Checkout
      </button>
    </div>
  );
};

export default CartTotalSummary;
