import React from 'react';
import './CustomerOrderStats.scss';
import { ShoppingCart, TrendingUp, DollarSign, Star } from 'lucide-react';

interface CustomerOrderStatsProps {
  totalSpendings: number;
  totalOrders: number;
  averageOrderValue: number;
  mostPurchasedItems: string[];
}

const CustomerOrderStats: React.FC<CustomerOrderStatsProps> = ({
  totalSpendings,
  totalOrders,
  averageOrderValue,
  mostPurchasedItems,
}) => {
  return (
    <div className="customer-order-stats">
      <div className="customer-order-stats__header">
        <h3 className="customer-order-stats__title">Customer Order Stats</h3>
      </div>
      <div className="customer-order-stats__grid">
        <div className="customer-order-stats__item">
          <div className="customer-order-stats__icon">
            <DollarSign size={18} />
          </div>
          <div>
            <h4>Total Spendings</h4>
            <p>LKR {totalSpendings.toLocaleString()}</p>
          </div>
        </div>

        <div className="customer-order-stats__item">
          <div className="customer-order-stats__icon">
            <ShoppingCart size={18} />
          </div>
          <div>
            <h4>Total Orders</h4>
            <p>{totalOrders}</p>
          </div>
        </div>

        <div className="customer-order-stats__item">
          <div className="customer-order-stats__icon">
            <TrendingUp size={18} />
          </div>
          <div>
            <h4>Average Order Value</h4>
            <p>LKR {averageOrderValue.toLocaleString()}</p>
          </div>
        </div>

        <div className="customer-order-stats__item">
          <div className="customer-order-stats__icon">
            <Star size={18} />
          </div>
          <div>
            <h4>Most Purchased Items</h4>
            <div className="customer-order-stats__tags">
              {mostPurchasedItems.map((item, index) => (
                <span key={index} className="badge">{item}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerOrderStats;
