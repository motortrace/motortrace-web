import React from 'react';  
import Sidebar from '../components/Sidebar/sidebar';
import Navbar from '../components/Navbar/Navbar';
import './DashboardLayout.scss';
import DashboardHeader from './DashboardHeader/DashboardHeader';
import MetricCard from '../components/MetricCard/MetricCard';
import MoneyFlow from '../components/MoneyFlow/MoneyFlow';
import Budget from '../components/Budget/Budget';
import RecentTransactions from '../components/RecentTransactions/RecentTransactions';

interface Props {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<Props> = ({ children }) => {
  const handleAddWidget = () => {
    console.log('Add widget clicked');
  };

  const handleManageWidgets = () => {
    console.log('Manage widgets clicked');
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">
        <Navbar />
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

        <div className="page-content">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;