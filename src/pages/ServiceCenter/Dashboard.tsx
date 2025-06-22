import React from 'react';
import DashboardHeader from '../../layouts/DashboardHeader/DashboardHeader';
import MetricCard from '../../components/MetricCard/MetricCard';
import MoneyFlow from '../../components/MoneyFlow/MoneyFlow';
import Budget from '../../components/Budget/Budget';
import RecentTransactions from '../../components/RecentTransactions/RecentTransactions';
// import './Dashboard.scss';

const Dashboard = () => {
  const handleAddWidget = () => {
    console.log('Add widget clicked');
  };

  const handleManageWidgets = () => {
    console.log('Manage widgets clicked');
  };

  return (
    <div className="dashboard-page">
      <DashboardHeader 
        onAddWidget={handleAddWidget}
        onManageWidgets={handleManageWidgets}
      />
      
      <div className="metric-cards-row">
        <MetricCard
          title="Total balance"
          amount="$15,700"
          change="12.1%"
          changeType="positive"
        />
        <MetricCard
          title="Income"
          amount="$8,500"
          change="6.3%"
          changeType="positive"
        />
        <MetricCard
          title="Expense"
          amount="$6,222"
          change="2.4%"
          changeType="negative"
        />
        <MetricCard
          title="Total savings"
          amount="$32,913"
          change="12.1%"
          changeType="positive"
        />
      </div>

      <div className="dashboard-charts-row">
        <MoneyFlow />
        <RecentTransactions />
      </div>
    </div>
  );
};

export default Dashboard;