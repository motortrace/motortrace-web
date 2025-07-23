import React from 'react';
import './CustomerSpendingSummary.scss';
import { ArrowUpRight, ShoppingCart, Star, TrendingUp } from 'lucide-react';

const CustomerSpendingSummary = () => {
  return (
    <div className="customer-spending-summary">
      <div className="customer-spending-summary__main">
        <h3>Total Spent</h3>
        <div className="customer-spending-summary__amount">LKR 34,000</div>
        <div className="customer-spending-summary__change">
          <ArrowUpRight size={14} /> Up 12.5% from last month
        </div>
      </div>

      <div className="customer-spending-summary__stats">
        <div className="stat-card">
          <div className="stat-card__icon"><ShoppingCart size={18} /></div>
          <h4>Total Orders</h4>
          <p className="stat-card__value">8</p>
          <span className="stat-card__change">↑ 14% vs last month</span>
        </div>

        <div className="stat-card">
          <div className="stat-card__icon"><TrendingUp size={18} /></div>
          <h4>Avg Order Spend</h4>
          <p className="stat-card__value">LKR 4,250</p>
          <span className="stat-card__change">↑ 9% vs last month</span>
        </div>

        <div className="stat-card">
          <div className="stat-card__icon"><Star size={18} /></div>
          <h4>Avg Order Rating</h4>
          <div className="stat-card__rating">
            <span>4.3 ⭐</span>
            <span className="stat-card__sub">6 rated</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerSpendingSummary;
