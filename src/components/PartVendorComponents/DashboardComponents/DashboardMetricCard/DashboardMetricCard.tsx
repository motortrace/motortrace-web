import React from 'react';
import { PlusCircle, Clock, Package } from 'lucide-react';
import './DashboardMetricCard.scss';

interface DashboardMetricCardProps {
  title: string;
  count: number;
  items: {
    id: string;
    value?: string;
    status?: 'delivered' | 'dispatched' | 'pending';
    daysAgo?: number;
    stockCount?: number;
    itemCount?: number;
  }[];
}

const DashboardMetricCard: React.FC<DashboardMetricCardProps> = ({
  title,
  count,
  items,
}) => {
  return (
    <div className="dashboard-metric-card">
      <div className="dashboard-metric-card__header">
        <h3 className="dashboard-metric-card__title">{title}</h3>
        <span className="dashboard-metric-card__count">{count}</span>
      </div>
      <ul className="dashboard-metric-card__list">
        {items.map((item, index) => {
          const showRestockIcon = item.stockCount !== undefined && item.stockCount <= 2;
          const showPendingIcon = title === 'Pending Orders';
          const showNewOrderIcon = title === 'New Orders';

          return (
            <li key={index} className="dashboard-metric-card__item">
              <div>
                <span className="dashboard-metric-card__item-id">{item.id}</span>
                {item.daysAgo !== undefined && (
                  title === 'Pending Orders' ? (
                    <span
                      className={`badge ${
                        item.daysAgo >= 3 ? 'badge--high' : 'badge--low'
                      }`}
                    >
                      {item.daysAgo} days ago
                    </span>
                  ) : (
                    <span>{item.daysAgo} days ago</span>
                  )
                )}
              </div>

              <div className="dashboard-metric-card__item-info">
                {title === 'New Orders' && item.itemCount !== undefined && (
                  <span className="badge">{item.itemCount} items</span>
                )}
                {title === 'New Orders' && item.value && (
                  <span>LKR {item.value}</span>
                )}

                {item.stockCount !== undefined && (
                  <span
                    className={`badge ${
                      item.stockCount <= 2 ? 'badge--high' : 'badge--low'
                    }`}
                  >
                    {item.stockCount} left
                  </span>
                )}

                {(item.status === 'delivered' || item.status === 'dispatched') && (
                  <span className={`badge badge--${item.status}`}>
                    {item.status}
                  </span>
                )}

                {/* Action Icons */}
                {showRestockIcon && (
                  <PlusCircle size={16} title="Restock Item" className="dashboard-metric-card__icon" />
                )}
                {showPendingIcon && (
                  <Clock size={16} title="Pending Order" className="dashboard-metric-card__icon" />
                )}
                {showNewOrderIcon && (
                  <Package size={16} title="View Order Details" className="dashboard-metric-card__icon" />
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default DashboardMetricCard;
