import React from 'react';
import './CartStoreGroup.scss';

type CartItem = {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
};

type CartStoreGroupProps = {
  storeName: string;
  items: CartItem[];
};

const CartStoreGroup: React.FC<CartStoreGroupProps> = ({ storeName, items }) => {
  return (
    <div className="cart-store-group">
      <h3 className="store-name">{storeName}</h3>

      {items.map((item) => (
        <div className="cart-item" key={item.id}>
          <div className="cart-item__image">
            <img src={item.image} alt={item.name} />
          </div>

          <div className="cart-item__info">
            <p className="name">{item.name}</p>

            <div className="details">
              <span className="price">${item.price.toFixed(2)}</span>

              <div className="quantity">
                <button aria-label="Decrease quantity">−</button>
                <span>{item.quantity}</span>
                <button aria-label="Increase quantity">+</button>
              </div>

              <button className="remove">Remove</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartStoreGroup;
