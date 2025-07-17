// src/components/StatCard/StatCard.tsx
import React from 'react';
import './StatCard.scss';

interface StatCardProps {
  title: string;
  amount: string;
  change?: string;
  changeType?: 'positive' | 'negative';
  period?: string;
  subtitle?: string;
  icon?: string;
  currency?: string;
  showTrend?: boolean;
  actionable?: boolean;
  urgency?: 'normal' | 'warning' | 'critical';
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  amount,
  change,
  changeType,
  period = 'vs last month',
  subtitle,
  icon,
  currency = 'LKR',
  showTrend = true,
  actionable = false,
  urgency = 'normal'
}) => {
  const formatAmount = (amount: string) => {
    // Add thousand separators for better readability
    const numericAmount = amount.replace(/[^\d.]/g, '');
    if (numericAmount && !isNaN(Number(numericAmount))) {
      return Number(numericAmount).toLocaleString('en-US');
    }
    return amount;
  };

  return (
    <div className={`metric-card ${urgency !== 'normal' ? `metric-card--${urgency}` : ''}`}>
      <div className="metric-card__header">
        <div className="metric-card__title-section">
          {icon && (
            <div className="metric-card__icon">
              <i className={icon}></i>
            </div>
          )}
          <h3 className="metric-card__title">{title}</h3>
        </div>
        {actionable && (
          <button className="metric-card__arrow">
            <div className='metric-card__arrow-icon'>          
              <i className='bx bx-right-top-arrow-circle'></i>
            </div>
          </button>
        )}
      </div>
      
      <div className="metric-card__amount">
        {currency && <span className="metric-card__currency">{currency} </span>}
        {formatAmount(amount)}
      </div>
      
      {subtitle && (
        <div className="metric-card__subtitle">
          {subtitle}
        </div>
      )}
      
      {showTrend && change && (
        <div className="metric-card__footer">
          <span className={`metric-card__change metric-card__change--${changeType}`}>
            {changeType === 'positive' ? '↑' : '↓'} {change}
          </span>
          <span className="metric-card__period">{period}</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;