import React from 'react';
import PartVendorSideBar from '../../../components/PartVendorComponents/SideBar/partVendorSidebar';
import SalesOverviewChart from '../../../components/PartVendorComponents/DashboardComponents/SalesOverviewChart/SalesOverviewChart';
import InventoryOverview from '../../../components/PartVendorComponents/DashboardComponents/InventoryOverview/InventoryOverview';
import InventoryMetricCard from '../../../components/PartVendorComponents/DashboardComponents/InventoryMetricCard/InventoryMetricCard';
import SalesMetricCard from '../../../components/PartVendorComponents/DashboardComponents/SalesMetricCard/SalesMetricCard';
import DashboardMetricCard from '../../../components/PartVendorComponents/DashboardComponents/DashboardMetricCard/DashboardMetrics';
import SalesByItemChart from '../../../components/PartVendorComponents/DashboardComponents/SalesByItemChart/SalesByItemChart';
import OrdersOverview from '../../../components/PartVendorComponents/DashboardComponents/OrdersOverview/OrdersOverview';
import SalesOverview from '../../../components/PartVendorComponents/DashboardComponents/SalesOverview/SalesOverview';
import DashboardCharts from '../../../components/PartVendorComponents/DashboardComponents/DashboardCharts/DashboardCharts';
import DashboardMetrics from '../../../components/PartVendorComponents/DashboardComponents/DashboardMetricCard/DashboardMetrics';
import UnpaidPaymentsCard from '../../../components/PartVendorComponents/DashboardComponents/UnpaidPaymentsCard/UnpaidPaymentsCard';

const PartVendorDashboard = () => {
  return (
    <div>
      {/* <PartVendorSideBar /> */}
      {/* <SalesOverviewChart /> */}
      {/* <InventoryOverview /> */}
      <DashboardMetrics/>
      <UnpaidPaymentsCard
  payments={[
    { serviceCenter: 'AutoFix Center', month: 'June 2025', amount: 4500, status: 'reminder' },
    { serviceCenter: 'Speedy Motors', month: 'May 2025', amount: 6700, status: 'pending' },
    { serviceCenter: 'Quick Auto Hub', month: 'July 2025', amount: 3000, status: 'settled' },
  ]}
/>

      <SalesByItemChart />
      <OrdersOverview/>
      <DashboardCharts/>
    </div>
  );
};

export default PartVendorDashboard;
