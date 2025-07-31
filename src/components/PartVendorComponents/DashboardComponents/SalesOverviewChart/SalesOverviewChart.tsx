import React from 'react';
import './SalesOverviewChart.scss';

const SalesOverviewChart: React.FC = () => {
  return (
    <div className="sales-overview-chart">
      <h3 className="sales-overview-chart__title">Sales Overview</h3>
      <div className="sales-overview-chart__placeholder">
        {/* Replace with actual chart later */}
        <span>Chart showing daily/weekly sales trends</span>
      </div>
    </div>
  );
};

export default SalesOverviewChart;
