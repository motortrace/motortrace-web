import React from 'react';
import './PendingOrdersCard.scss';

interface PendingOrderItem {
  orderNumber: string;
  daysAgo: number;
  amount: number;
}

interface PendingOrdersCardProps {
  count: number;
  orders: PendingOrderItem[];
}

const PendingOrdersCard: React.FC<PendingOrdersCardProps> = ({ count, orders }) => {
  return (
    <div className="pending-orders-card">
      <div className="pending-orders-card__header">
        <h3 className="pending-orders-card__title">Pending Orders</h3>
        <span className="pending-orders-card__count">{count}</span>
      </div>
      <ul className="pending-orders-card__list">
        {orders.map((order, index) => (
          <li key={index} className="pending-orders-card__item">
            <div className="pending-orders-card__order-info">
              <span className="pending-orders-card__order-id">{order.orderNumber}</span>
              <span className="badge">{order.daysAgo} days ago</span>
            </div>
            <div className="pending-orders-card__amount">
              LKR {order.amount.toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PendingOrdersCard;
