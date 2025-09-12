// src/components/ProductMetricsCard/ProductMetricsCard.tsx
import React from 'react';
import { PackageCheck, AlertTriangle, PackageX, Boxes } from 'lucide-react';
import './ProductMetricCard.scss';

interface ProductMetric {
  title: string;
  amount: string;
  change?: string;
  changeType?: 'positive' | 'negative';
  icon: React.ReactNode;
  period?: string;
}

const productMetrics: ProductMetric[] = [
  {
    title: 'Total Products',
    amount: '152',
    // change: '5%',
    // changeType: 'positive',
    icon: <PackageCheck size={24} />
  },
  {
    title: 'Low Stock Items',
    amount: '8',
    // change: '2%',
    // changeType: 'negative',
    icon: <AlertTriangle size={24} />
  },
  {
    title: 'Out of Stock',
    amount: '3',
    // change: '1%',
    // changeType: 'negative',
    icon: <PackageX size={24} />
  },
  {
    title: 'Inventory Value',
    amount: 'LKR 1.2M',
    // change: '3%',
    // changeType: 'positive',
    icon: <Boxes size={24} />
  }
];

const ProductMetricsCard: React.FC = () => {
  return (
    <div className="product-metrics-row">
      {productMetrics.map((metric) => (
        <div className="product-metrics-card" key={metric.title}>
          <div className="product-metrics-card__content">
            <div className="product-metrics-card__header">
              <div className="product-metrics-card__icon">{metric.icon}</div>
              <h3 className="product-metrics-card__title">{metric.title}</h3>
            </div>
            <p className="product-metrics-card__amount">{metric.amount}</p>
            <div className="product-metrics-card__footer">
              {metric.change && (
                <span className={`product-metrics-card__change product-metrics-card__change--${metric.changeType}`}>
                  {metric.changeType === 'positive' ? '↑' : '↓'} {metric.change}
                </span>
              )}
              {/* <span className="product-metrics-card__period">{metric.period || 'vs last month'}</span> */}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductMetricsCard;

