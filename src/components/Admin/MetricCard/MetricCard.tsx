// src/components/MetricCard/MetricCard.tsx
import React from 'react';
import './MetricCard.scss';

interface MetricDetail {
  label: string;
  value: string | number;
  color?: string;
}

interface MetricCardProps {
  title: string;
  amount: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  period?: string;
  icon?: string; // Box icon class name
  details?: MetricDetail[]; // Array of sub-metrics
  urgentCount?: number; // For urgent items (red badge)
  onClick?: () => void; // Click handler for navigation
  loading?: boolean; // Loading state
  color?: 'default' | 'revenue' | 'activity' | 'operations' | 'urgent';
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  amount,
  change,
  changeType,
  period = 'vs last month',
  icon,
  details = [],
  urgentCount,
  onClick,
  loading = false,
  color = 'default'
}) => {
  const handleCardClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const getCardColorClass = () => {
    switch (color) {
      case 'revenue':
        return 'metric-card--revenue';
      case 'activity':
        return 'metric-card--activity';
      case 'operations':
        return 'metric-card--operations';
      case 'urgent':
        return 'metric-card--urgent';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className={`metric-card metric-card--loading ${getCardColorClass()}`}>
        <div className="metric-card__skeleton">
          <div className="skeleton-header"></div>
          <div className="skeleton-amount"></div>
          <div className="skeleton-details"></div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`metric-card ${getCardColorClass()} ${onClick ? 'metric-card--clickable' : ''}`}
      onClick={handleCardClick}
    >
      <div className="metric-card__header">
        <div className="metric-card__title-container">
          {icon && (
            <div className="metric-card__icon">
              <i className={icon}></i>
            </div>
          )}
          <h3 className="metric-card__title">{title}</h3>
        </div>
        <div className="metric-card__actions">
          {urgentCount && urgentCount > 0 && (
            <div className="metric-card__urgent-badge">
              {urgentCount}
            </div>
          )}
          <button className="metric-card__arrow">
            <div className='metric-card__arrow-icon'>          
              <i className='bx bx-right-top-arrow-circle'></i>
            </div>
          </button>
        </div>
      </div>
      
      <div className="metric-card__amount">
        {amount}<span className="metric-card__decimal"></span>
      </div>
      
      {details.length > 0 && (
        <div className="metric-card__details">
          {details.map((detail, index) => (
            <div key={index} className="metric-card__detail">
              <span className="metric-card__detail-label">{detail.label}:</span>
              <span 
                className="metric-card__detail-value"
                style={{ color: detail.color }}
              >
                {detail.value}
              </span>
            </div>
          ))}
        </div>
      )}
      
      <div className="metric-card__footer">
        <span className={`metric-card__change metric-card__change--${changeType}`}>
          {changeType === 'positive' ? '↗️' : changeType === 'negative' ? '↘️' : '→'} {change}
        </span>
        <span className="metric-card__period">{period}</span>
      </div>
    </div>
  );
};

export default MetricCard;