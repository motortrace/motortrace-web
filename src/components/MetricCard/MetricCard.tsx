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

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  amount,
  change,
  changeType,
  period = 'vs last month'
}) => {
  return (
    <div className="metric-card">
      <div className="metric-card__header">
        <h3 className="metric-card__title">{title}</h3>
        <button className="metric-card__arrow">
          <div className='metric-card__arrow-icon'>          
            <i className='bx bx-right-top-arrow-circle' ></i>
          </div>


        </button>
      </div>
      
      <div className="metric-card__amount">
        {amount}<span className="metric-card__decimal">.00</span>
      </div>
      
      <div className="metric-card__footer">
        <span className={`metric-card__change metric-card__change--${changeType}`}>
          {changeType === 'positive' ? '↑' : '↓'} {change}
        </span>
        <span className="metric-card__period">{period}</span>
      </div>
    </div>
  );
};

export default MetricCard;