import React from 'react';
import './ReviewMetricCard.scss';

interface ReviewMetricCardProps {
  title: string;
  count: string;
  change: string;
  changeType: 'positive' | 'negative';
  period?: string;
}

const ReviewMetricCard: React.FC<ReviewMetricCardProps> = ({
  title,
  count,
  change,
  changeType,
  period = 'vs last month'
}) => {
  return (
    <div className="review-metric-card">
      <div className="review-metric-card__header">
        <h3 className="review-metric-card__title">{title}</h3>
      </div>
      
      <div className="review-metric-card__count">
        {count}
      </div>
      
      <div className="review-metric-card__footer">
        <span className={`review-metric-card__change review-metric-card__change--${changeType}`}>
          {changeType === 'positive' ? '↑' : '↓'} {change}
        </span>
        <span className="review-metric-card__period">{period}</span>
      </div>
    </div>
  );
};

export default ReviewMetricCard;
