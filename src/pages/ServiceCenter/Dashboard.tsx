import DashboardHeader from '../../layouts/DashboardHeader/DashboardHeader';
import MetricCard from '../../components/MetricCard/MetricCard';
// import Budget from '../../components/Budget/Budget';
// import RecentTransactions from '../../components/RecentTransactions/RecentTransactions';
import ServiceFlow from '../../components/ServiceFlow/ServiceFlow';
import TodaysBookingsOverview from '../../components/TodaysBookingOverview/TodaysBookingsOverview';
import Budget from '../../components/Budget/Budget';
import BayUtilizationChart from '../../components/BayUtilizationChart/BayUtilizationChart';
import BasicInformation from '../../components/ProfileSetup/BasicInformation';
import LocationInformation from '../../components/ProfileSetup/LocationInformation';
import OperationalInformation from '../../components/ProfileSetup/OperationalInformation';
import CapacityInformation from '../../components/ProfileSetup/CapacityInformation';
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
          title="Total Appointments"
          amount="13"
          change="12.1%"
          changeType="positive"
        />
        <MetricCard
          title="New Requests"
          amount="7"
          change="6.3%"
          changeType="positive"
        />
        <MetricCard
          title="Pending Requests"
          amount="19"
          change="2.4%"
          changeType="negative"
        />
        <MetricCard
          title="Total Earnings"
          amount="27 500 LKR"
          change="12.1%"
          changeType="positive"
        />
      </div>

      <div className="dashboard-charts-row">
        {/* <ServiceFlow/> */}
        <TodaysBookingsOverview />

      </div>
      <div className="dashboard-charts-row">
        <ServiceFlow />
        <BayUtilizationChart />
      </div>

      <div className="dashboard-charts-row">
        <BasicInformation />
      </div>

      <div className="dashboard-charts-row">
        <LocationInformation />
      </div>

      <div className="dashboard-charts-row">
        <OperationalInformation />
      </div>

       <div className="dashboard-charts-row">
        <CapacityInformation />
      </div>

    </div>
  );
};

export default Dashboard;