import React from 'react';
import PartVendorSideBar from '../../../components/PartVendorComponents/SideBar/partVendorSidebar';
import SalesOverviewChart from '../../../components/PartVendorComponents/DashboardComponents/SalesOverviewChart/SalesOverviewChart';
import InventoryOverview from '../../../components/PartVendorComponents/DashboardComponents/InventoryOverview/InventoryOverview';
import InventoryMetricCard from '../../../components/PartVendorComponents/DashboardComponents/InventoryMetricCard/InventoryMetricCard';
import SalesMetricCard from '../../../components/PartVendorComponents/DashboardComponents/SalesMetricCard/SalesMetricCard';
import DashboardMetricCard from '../../../components/PartVendorComponents/DashboardComponents/DashboardMetricCard/DashboardMetricCard';
import SalesByItemChart from '../../../components/PartVendorComponents/DashboardComponents/SalesByItemChart/SalesByItemChart';
import OrdersOverview from '../../../components/PartVendorComponents/DashboardComponents/OrdersOverview/OrdersOverview';
import SalesOverview from '../../../components/PartVendorComponents/DashboardComponents/SalesOverview/SalesOverview';
import DashboardCharts from '../../../components/PartVendorComponents/DashboardComponents/DashboardCharts/DashboardCharts';

const PartVendorDashboard = () => {
  return (
    <div>
      {/* <PartVendorSideBar /> */}
      {/* <SalesOverviewChart /> */}
      {/* <InventoryOverview /> */}

      <div className="dashboard-cards-row">
        <DashboardMetricCard
          title="New Orders"
          count={6}
          items={[
            { id: '#10458', value: '4850', itemCount: 5 },
            { id: '#10459', value: '3990' , itemCount: 2},
            { id: '#10460', value: '5120' , itemCount: 3},
          ]}
        />

        <DashboardMetricCard
          title="Low Stock"
          count={3}
          items={[
            { id: 'Air Filter', stockCount: 1 },
            { id: 'Brake Pads', stockCount: 3 },
            { id: 'Spark Plug', stockCount: 2 },
          ]}
        />

        <DashboardMetricCard
          title="Pending Orders"
          count={2}
          items={[
            { id: '#20345', daysAgo: 7, value: '6300' },
            { id: '#20346', daysAgo: 3, value: '2750' },
          ]}
        />

        <DashboardMetricCard
          title="Delivered Orders"
          count={5}
          items={[
            { id: '#50231', status: 'delivered' },
            { id: '#50232', status: 'dispatched' },
            { id: '#50233', status: 'delivered' },
          ]}
        />
      </div>
      <SalesByItemChart />
      <OrdersOverview/>
      <DashboardCharts/>
    </div>
  );
};

export default PartVendorDashboard;
