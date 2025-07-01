import React from 'react';
import './EmptyCart.scss';
import { FaShoppingCart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const EmptyCart: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="empty-cart">
      <FaShoppingCart className="cart-icon" />
      <h2>Your cart is empty</h2>
      <p>Looks like you haven’t added anything yet.</p>
      <button onClick={() => navigate('/')} className="shop-btn">
        Continue Shopping
      </button>
    </div>
  );
};

export default EmptyCart;
