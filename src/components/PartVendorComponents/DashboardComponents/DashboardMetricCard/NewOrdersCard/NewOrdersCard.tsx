import React from 'react';
import './NewOrdersCard.scss';

interface NewOrdersCardProps {
  count: number;
}

const NewOrdersCard: React.FC<NewOrdersCardProps> = ({ count }) => {
  return (
    <div className="new-orders-card">
      <div className="new-orders-card__header">
        <h3 className="new-orders-card__title">New Orders</h3>
        <span className="new-orders-card__count">{count}</span>
      </div>
    </div>
  );
};

export default NewOrdersCard;
