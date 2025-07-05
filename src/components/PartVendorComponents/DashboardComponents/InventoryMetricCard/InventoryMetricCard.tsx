// src/components/InventoryMetricCard/InventoryMetricCard.tsx
import React from 'react';
import './InventoryMetricCard.scss';

interface InventoryMetricCardProps {
  title: string;
  description: string;
  total: number;
  items: { name: string; count: number }[];
}

const InventoryMetricCard: React.FC<InventoryMetricCardProps> = ({
  title,
  description,
  total,
  items
}) => {
  return (
    <div className="inventory-metric-card">
      <div className="inventory-metric-card__header">
        <h3 className="inventory-metric-card__title">{title}</h3>
        <p className="inventory-metric-card__description">{description}</p>
      </div>

      <div className="inventory-metric-card__total">
        Total: <strong>{total}</strong>
      </div>

      <ul className="inventory-metric-card__list">
        {items.map((item, index) => (
          <li key={index} className="inventory-metric-card__item">
            <span>{item.name}</span>
            <strong>{item.count}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InventoryMetricCard;
