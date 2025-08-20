// src/components/OrderMetricsCard/OrderMetricsCard.tsx
import React from 'react';
import { ShoppingCart, Clock, CheckCircle, DollarSign, XCircle, PackageCheck  } from 'lucide-react';
import './OrderMetricCard.scss';

interface OrderMetric {
  title: string;
  amount: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: React.ReactNode;
  period?: string;
}

const orderMetrics: OrderMetric[] = [
  {
    title: 'Total Issued Parts',
    amount: '129',
    change: '12%',
    changeType: 'positive',
    icon: <PackageCheck size={24} />
  },
  {
    title: 'Total Sales',
    amount: '12,500 LKR',
    change: '3%',
    changeType: 'negative',
    icon: <DollarSign   size={24} />
  },
  {
    title: 'Pending Isuuance',
    amount: '5',
    change: '1%',
    changeType: 'negative',
    icon: <Clock size={24} />
  },
  {
    title: 'Completed Issuance',
    amount: '210',
    change: '4%',
    changeType: 'positive',
    icon: <CheckCircle size={24} />
  },
  {
    title: 'Returned Parts',
    amount: '15',
    change: '2%',
    changeType: 'negative',
    icon: <XCircle size={24} />
  }
];

const OrderMetricsCard: React.FC = () => {
  return (
    <div className="order-metrics-row">
      {orderMetrics.map((metric) => (
        <div className="order-metrics-card" key={metric.title}>
          <div className="order-metrics-card__content">
                <div className="order-metrics-card__header">
      <div className="order-metrics-card__icon">{metric.icon}</div>
      <h3 className="order-metrics-card__title">{metric.title}</h3>
    </div>
            <p className="order-metrics-card__amount">{metric.amount}</p>
            <div className="order-metrics-card__footer">
              <span className={`order-metrics-card__change order-metrics-card__change--${metric.changeType}`}>
                {metric.changeType === 'positive' ? '↑' : '↓'} {metric.change}
              </span>
              <span className="order-metrics-card__period">{metric.period || 'vs last month'}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderMetricsCard;
