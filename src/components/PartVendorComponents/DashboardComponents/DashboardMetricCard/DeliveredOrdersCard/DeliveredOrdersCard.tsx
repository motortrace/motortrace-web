import React from 'react';
import './DeliveredOrdersCard.scss';

interface DeliveredOrderItem {
  orderNumber: string;
  location: string;
  status: 'delivered' | 'dispatched' | 'missed';
}

interface DeliveredOrdersCardProps {
  count: number;
  orders: DeliveredOrderItem[];
}

const DeliveredOrdersCard: React.FC<DeliveredOrdersCardProps> = ({ count, orders }) => {
  return (
    <div className="delivered-orders-card">
      <div className="delivered-orders-card__header">
        <h3 className="delivered-orders-card__title">Delivered Orders</h3>
        <span className="delivered-orders-card__count">{count}</span>
      </div>
      <ul className="delivered-orders-card__list">
        {orders.map((order, index) => (
          <li key={index} className="delivered-orders-card__item">
            <div className="delivered-orders-card__order-info">
              <span className="delivered-orders-card__order-id">{order.orderNumber}</span>
              <span>{order.location}</span>
            </div>
            <span className={`badge badge--${order.status}`}>{order.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DeliveredOrdersCard;
