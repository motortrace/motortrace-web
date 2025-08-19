// KPICard.tsx
import React from 'react';
import './KPICard.scss';

interface KPIData {
  current: number;
  previous: number;
  format: 'number' | 'currency' | 'percentage';
}

interface KPICardProps {
  id: string;
  title: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  description: string;
  data: KPIData;
  color: 'blue' | 'purple' | 'green' | 'orange';
  periodLabel: string;
  previousLabel: string;
}

const KPICard: React.FC<KPICardProps> = ({
  id,
  title,
  icon: Icon,
  description,
  data,
  color,
  periodLabel,
  previousLabel
}) => {
  const formatValue = (value: number, format: 'number' | 'currency' | 'percentage'): string => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-LK', {
          style: 'currency',
          currency: 'LKR',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(value);
      case 'percentage':
        return `${value.toFixed(1)}%`;
      default:
        return new Intl.NumberFormat('en-LK').format(value);
    }
  };

  const calculateChange = (current: number, previous: number): { percentage: string; type: 'positive' | 'negative' } => {
    const change = ((current - previous) / previous) * 100;
    return {
      percentage: `${Math.abs(change).toFixed(1)}%`,
      type: change >= 0 ? 'positive' : 'negative'
    };
  };

  const change = calculateChange(data.current, data.previous);

  return (
    <div className={`kpi-metrics-card kpi-metrics-card--${color}`}>
      <div className="kpi-metrics-card__header">
        <div className="kpi-metrics-card__icon-wrapper">
          <Icon className="kpi-metrics-card__icon" size={24} />
        </div>
        <div className="kpi-metrics-card__title-section">
          <h3 className="kpi-metrics-card__title">{title}</h3>
          <p className="kpi-metrics-card__description">{description}</p>
        </div>
      </div>

      <div className="kpi-metrics-card__content">
        <div className="kpi-metrics-card__value">
          {formatValue(data.current, data.format)}
        </div>
        
        <div className="kpi-metrics-card__comparison">
          <div className={`kpi-metrics-card__change kpi-metrics-card__change--${change.type}`}>
            <span className="kpi-metrics-card__change-arrow">
              {change.type === 'positive' ? '↑' : '↓'}
            </span>
            <span className="kpi-metrics-card__change-percentage">
              {change.percentage}
            </span>
          </div>
          <span className="kpi-metrics-card__comparison-label">
            {previousLabel}
          </span>
        </div>
      </div>

      <div className="kpi-metrics-card__footer">
        <span className="kpi-metrics-card__period">{periodLabel}</span>
      </div>
    </div>
  );
};

export default KPICard;