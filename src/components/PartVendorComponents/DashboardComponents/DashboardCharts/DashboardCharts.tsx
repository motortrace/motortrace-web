import React from 'react';
import SalesOverviewChart from '../SalesOverview/SalesOverview';
import CustomerEngagementChart from '../CustomerEngagementChart/CustomerEngagementChart';
import './DashboardCharts.scss';

const DashboardCharts: React.FC = () => {
  return (
    <div className="dashboard-charts">
      <div className="chart-column">
        <SalesOverviewChart />
      </div>
      <div className="chart-column">
        <CustomerEngagementChart />
      </div>
    </div>
  );
};

export default DashboardCharts;
