import React from 'react';
import './NewOrdersCard.scss';

interface NewOrderItem {
  orderNumber: string;
  itemCount: number;
  amount: number;
}

interface NewOrdersCardProps {
  count: number;
  orders: NewOrderItem[];
}

const NewOrdersCard: React.FC<NewOrdersCardProps> = ({ count, orders }) => {
  return (
    <div className="new-orders-card">
      <div className="new-orders-card__header">
        <h3 className="new-orders-card__title">New Orders</h3>
        <span className="new-orders-card__count">{count}</span>
      </div>
      <ul className="new-orders-card__list">
        {orders.map((order, index) => (
          <li key={index} className="new-orders-card__item">
            <div className="new-orders-card__order-info">
              <span className="new-orders-card__order-id">{order.orderNumber}</span>
              <span className="badge">{order.itemCount} items</span>
            </div>
            <div className="new-orders-card__amount">
              LKR {order.amount.toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NewOrdersCard;
