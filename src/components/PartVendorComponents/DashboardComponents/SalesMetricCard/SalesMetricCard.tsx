// src/components/SalesMetricCard/SalesMetricCard.tsx
import React from 'react';
import './SalesMetricCard.scss';

interface SalesMetricCardProps {
  title: string;
  amount: string;
  change: string;
  changeType: 'positive' | 'negative';
}

const SalesMetricCard: React.FC<SalesMetricCardProps> = ({
  title,
  amount,
  change,
  changeType
}) => {
  return (
    <div className="sales-metric-card">
      <div className="sales-metric-card__header">
        <h3 className="sales-metric-card__title">{title}</h3>
      </div>
      <div className="sales-metric-card__amount">{amount}</div>
      <div className="sales-metric-card__footer">
        <span className={`sales-metric-card__change sales-metric-card__change--${changeType}`}>
          {changeType === 'positive' ? '↑' : '↓'} {change}
        </span>
        <span className="sales-metric-card__period">vs last month</span>
      </div>
    </div>
  );
};

export default SalesMetricCard;
