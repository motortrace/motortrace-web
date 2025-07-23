import React from 'react';
import './CustomerOrderStats.scss';
import { DollarSign, ShoppingCart, TrendingUp } from 'lucide-react';

const CustomerOrderStats = () => {
  const spend = 45000;
  const orders = 8;
  const avgOrder = 5625;

  return (
    <div className="stat-orb">
      <div className="stat-orb__center">
        <div className="stat-orb__ring"></div>
        <div className="stat-orb__value">
          <DollarSign size={16} />
          LKR {spend.toLocaleString()}
        </div>
      </div>

      <div className="stat-orb__item stat-orb__item--top">
        <ShoppingCart size={18} />
        <span>{orders} Orders</span>
      </div>
      <div className="stat-orb__item stat-orb__item--left">
        <TrendingUp size={18} />
        <span>LKR {avgOrder.toLocaleString()}</span>
      </div>
      <div className="stat-orb__item stat-orb__item--right">
        <span>Top Items</span>
        <ul>
          <li>Brake Pads</li>
          <li>Oil Filter</li>
        </ul>
      </div>
    </div>
  );
};

export default CustomerOrderStats;
