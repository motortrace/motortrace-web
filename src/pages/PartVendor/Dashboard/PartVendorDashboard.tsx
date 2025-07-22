import React from 'react';
import PartVendorSideBar from '../../../components/PartVendorComponents/SideBar/partVendorSidebar';
import SalesOverviewChart from '../../../components/PartVendorComponents/DashboardComponents/SalesOverviewChart/SalesOverviewChart';
import InventoryOverview from '../../../components/PartVendorComponents/DashboardComponents/InventoryOverview/InventoryOverview';
import InventoryMetricCard from '../../../components/PartVendorComponents/DashboardComponents/InventoryMetricCard/InventoryMetricCard';
import SalesMetricCard from '../../../components/PartVendorComponents/DashboardComponents/SalesMetricCard/SalesMetricCard';
import DashboardMetricCard from '../../../components/PartVendorComponents/DashboardComponents/DashboardMetricCard/DashboardMetrics';
import SalesByItemChart from '../../../components/PartVendorComponents/DashboardComponents/SalesByItemChart/SalesByItemChart';
import OrdersOverview from '../../../components/PartVendorComponents/DashboardComponents/OrdersOverview/OrdersOverview';
import DashboardCharts from '../../../components/PartVendorComponents/DashboardComponents/DashboardCharts/DashboardCharts';
import DashboardMetrics from '../../../components/PartVendorComponents/DashboardComponents/DashboardMetricCard/DashboardMetrics';
import UnpaidPaymentsCard from '../../../components/PartVendorComponents/DashboardComponents/UnpaidPaymentsCard/UnpaidPaymentsCard';
import NewReviewsCard from '../../../components/PartVendorComponents/DashboardComponents/NewReviewsCard/NewReviewsCard';
import RatingsCard from '../../../components/PartVendorComponents/DashboardComponents/RatingsCard/RatingCard';
import './PartVendorDashboard.scss'
import ProfitOverviewCard from '../../../components/PartVendorComponents/DashboardComponents/ProfitOverviewCard/ProfitOverviewCard';
import SubscriptionPlanCard from '../../../components/PartVendorComponents/DashboardComponents/SubscriptionPlanCard/SubscriptionPlanCard';
import SalesOverviewCard from '../../../components/PartVendorComponents/DashboardComponents/SalesOverview/SalesOverviewCard';
import MonthFilter from '../../../components/MonthFilter/MonthFilter';
import MetricCard from '../../../components/PartVendorComponents/DashboardComponents/MetricCard/MetricCard';

const PartVendorDashboard = () => {
  return (
    <div>
      <MonthFilter/>
      {/* <PartVendorSideBar /> */}
      {/* <SalesOverviewChart /> */}
      {/* <InventoryOverview /> */}
            <div className="metric-cards-row">
        <MetricCard
          title="New Orders"
          amount="13"
          change="12.1%"
          changeType="positive"
        />
        <MetricCard
          title="Low Stock"
          amount="19"
          change="2.4%"
          changeType="negative"
        />
        <MetricCard
          title="Pending Orders"
          amount="7"
          change="6.3%"
          changeType="positive"
        />
        <MetricCard
          title="Total Earnings"
          amount="27 500 LKR"
          change="12.1%"
          changeType="positive"
        />
      </div>
            <div className="dashboard-cards-row">
        {/* <ProfitOverviewCard
          totalRevenue={145000}
          totalCosts={87000}
          profitTrend={+4.8}
        /> */}
        <SubscriptionPlanCard
          currentPlan="Pro Seller"
          totalDays={30}
          daysLeft={12}
          suggestion={{ planName: 'Premium Seller', savings: 120 }}
          onUpdatePlan={() => console.log('Updating plan...')}
        />
        <SalesOverviewCard
        />
      </div>
      <div className="dashboard-cards-row">
        {/* <UnpaidPaymentsCard
          payments={[
            { serviceCenter: 'AutoFix Center', month: 'June 2025', amount: 4500, status: 'reminder' },
            { serviceCenter: 'Speedy Motors', month: 'May 2025', amount: 6700, status: 'pending' },
            { serviceCenter: 'Quick Auto Hub', month: 'July 2025', amount: 3000, status: 'settled' },
          ]}
        /> */}
        <NewReviewsCard
          googleRating={4.5}
          googleReviews={454}
          motortraceRating={4.3}
          motortraceReviews={325}
          newReviewsCount={12}
          reviews={[
            { id: 1, reviewer: 'John D.', content: 'Great service!', replied: false, platform: 'Google', rating: 4.5, imageCount: 4 },
            { id: 2, reviewer: 'Alex P.', content: 'Quick and reliable.', replied: true, platform: 'MotorTrace', rating: 4.3, imageCount: 0 },
          ]}
          onReply={(id) => console.log('Reply to review', id)}
        />
        <RatingsCard
          averageRating={4.3}
          totalRatedOrders={345}
          ratingBreakdown={[
            { stars: 5, count: 120 },
            { stars: 4, count: 80 },
            { stars: 3, count: 50 },
            { stars: 2, count: 10 },
            { stars: 1, count: 5 },
          ]}
          commonFeedbackTags={[
            { label: 'Fast Delivery', count: 5 },
            { label: 'Perfect Match', count: 3 },
            { label: 'Packaging Issues', count: 2 },
          ]}
          ratingTrend={+0.2}
        />
      </div>
<OrdersOverview />

{/* 
      <SalesByItemChart />
      
      <DashboardCharts /> */}
    </div>
  );
};

export default PartVendorDashboard;
