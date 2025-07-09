// src/components/CustomerMetricsPanel/CustomerMetricsPanel.tsx
import React from 'react';
import './CustomerMetricsPanel.scss';

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
      </div>
      <div className="metric-card__amount">
        {amount}
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

const CustomerMetricsPanel: React.FC = () => {
  return (
    <div className="customer-metrics-panel">
      <MetricCard
        title="New Customers"
        amount="1,250"
        change="15%"
        changeType="positive"
      />
      <MetricCard
        title="Returning Customers"
        amount="850"
        change="5%"
        changeType="negative"
      />
      <MetricCard
        title="Inactive Customers"
        amount="320"
        change="12%"
        changeType="negative"
      />
    </div>
  );
};

export default CustomerMetricsPanel;
