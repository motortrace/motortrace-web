import React from 'react';
import NewOrdersCard from './NewOrdersCard/NewOrdersCard';
import LowStockCard from './LowStockCard/LowStockCard';
import PendingOrdersCard from './PendingOrdersCard/PendingOrdersCard';
import DeliveredOrdersCard from './DeliveredOrdersCard/DeliveredOrdersCard';
import './DashboardMetrics.scss';

const DashboardMetrics = () => {
  return (
    <div className="dashboard-cards-row">
      <NewOrdersCard
        count={3}
        orders={[
          { orderNumber: 'ORD123', itemCount: 2, amount: 5600 },
          { orderNumber: 'ORD124', itemCount: 5, amount: 13200 },
          { orderNumber: 'ORD125', itemCount: 1, amount: 2900 },
        ]}
      />
      <LowStockCard
        count={3}
        items={[
          { name: 'Engine Oil', stockCount: 1 },
          { name: 'Brake Pads', stockCount: 2 },
          { name: 'Air Filter', stockCount: 0 },
        ]}
      />
      <PendingOrdersCard
        count={3}
        orders={[
          { orderNumber: 'ORD998', daysAgo: 5, amount: 2300 },
          { orderNumber: 'ORD999', daysAgo: 2, amount: 4500 },
          { orderNumber: 'ORD1000', daysAgo: 4, amount: 3800 },
        ]}
      />
      <DeliveredOrdersCard
        count={3}
        orders={[
          { orderNumber: 'ORD456', location: 'Colombo', status: 'delivered' },
          { orderNumber: 'ORD457', location: 'Kandy', status: 'dispatched' },
          { orderNumber: 'ORD458', location: 'Galle', status: 'missed' },
        ]}
      />
    </div>
  );
};

export default DashboardMetrics;
