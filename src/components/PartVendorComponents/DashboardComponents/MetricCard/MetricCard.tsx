// src/components/MetricCard/MetricCard.tsx
import React from 'react';
import { TrendingUp } from 'lucide-react';
import './MetricCard.scss';

interface MetricCardProps {
  title: string;
  amount: string;
  change: string;
  changeType: 'positive' | 'negative';
  period?: string;
}

const PartVendorMetricCard: React.FC<MetricCardProps> = ({
  title,
  amount,
  change,
  changeType,
  period = 'vs last month'
}) => {
  return (
    <div className="partvendor-metric-card">
      <div className="partvendor-metric-card__header">
        <h3 className="partvendor-metric-card__title">{title}</h3>
        <button className="partvendor-metric-card__arrow">
          <div className='partvendor-metric-card__arrow-icon'>
            <i className='bx bx-right-top-arrow-circle' ></i>
          </div>
        </button>
      </div>
      <div className="partvendor-metric-card__amount">
        {amount}<span className="partvendor-metric-card__decimal"></span>
      </div>
      <div className="partvendor-metric-card__footer">
        <span className={`partvendor-metric-card__change partvendor-metric-card__change--${changeType}`}>
          {changeType === 'positive' ? '↑' : '↓'} {change}
        </span>
        <span className="partvendor-metric-card__period">{period}</span>
      </div>
    </div>
  );
};

export default PartVendorMetricCard;