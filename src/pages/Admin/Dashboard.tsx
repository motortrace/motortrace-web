import React, { useState, useEffect } from 'react';
import '../../layouts/DashboardLayout.scss';
import "./Dashboard.scss"
import MetricCard from '../../components/Admin/MetricCard/MetricCard';
import BookingStatusChart from '../../components/Admin/DashboardCharts/BookingStatusChart';
import GrowthLineChart from '../../components/Admin/DashboardCharts/GrowthLineChart';
import MonthlyUsersBarChart from '../../components/Admin/DashboardCharts/MonthlyUsersBarChart';


interface DashboardData {
  platformActivity: any;
  revenue: any;
  operations: any;
  urgent: any;
}

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchDashboardData = async () => {
      setLoading(true);
      // Your API call here
      setTimeout(() => {
        setDashboardData({
          platformActivity: {
            totalUsers: 650,
            change: '+8',
            changeType: 'positive',
            details: [
              { label: 'Car Users', value: '400 (61.5%)', color: '#334155' },
              { label: 'Service Centers', value: '200 (30.7%)', color: '#334155' },
              { label: 'Spare Part Sellers', value: '50 (7.8%)', color: '#334155' },
              { label: 'New Today', value: '22', color: '#334155' }
            ]
          },
          revenue: {
            todayRevenue: '34000 LKR',
            change: '+10%',
            changeType: 'positive',
            details: [
              { label: 'Subscription Received', value: '21 000 LKR', color: '#334155' },
              { label: 'Commission Earned', value: '13 000 LKR', color: '#334155' },
              { label: 'Pending Payouts ', value: '24 000 LKR', color: '#334155' },
              { label: 'This Month', value: '350 000 LKR', color: '#334155' }
            ]
          },
          operations: {
            activeBookings: 25,
            change: '+6',
            changeType: 'positive',
            details: [
              { label: 'Checked In', value: '22', color: '#334155' },
              { label: 'In Progress', value: '14', color: '#334155' },
              { label: 'Service Completed', value: '5', color: '#334155' },
              { label: 'Collected', value: '3', color: '#334155' }
            ]
          },
          urgent: {
            urgentItems: 8,
            change: '3',
            changeType: 'negative',
            details: [
              { label: 'Registration Approvals', value: '3', color: '#334155' },
              { label: 'Refund Requests', value: '2', color: '#334155' },
              { label: 'Escalated Disputes', value: '1', color: '#334155' },
              { label: 'Content Reports', value: '2', color: '#334155' }
            ]
          }
        });
        setLoading(false);
      }, 1000);
    };

    fetchDashboardData();
  }, []);

  const handleCardClick = (cardType: string) => {
    // Navigate to respective detailed view
    console.log(`Navigate to ${cardType} details`);
    // Your navigation logic here
  };

  const data = [
    { month: 'Jan', carUsers: 45, serviceCenters: 15, sparePartsSellers: 5 },
    { month: 'Feb', carUsers: 105, serviceCenters: 35, sparePartsSellers: 17 },
    { month: 'Mar', carUsers: 180, serviceCenters: 80, sparePartsSellers: 30 },
    { month: 'Apr', carUsers: 280, serviceCenters: 120, sparePartsSellers: 35 },
    { month: 'May', carUsers: 322, serviceCenters: 150, sparePartsSellers: 41 },
    { month: 'Jun', carUsers: 400, serviceCenters: 200, sparePartsSellers: 50 },
  ];

  const newUsersData = [
    { month: 'Jan', carUsers: 45, serviceCenters: 15, sparePartsSellers: 5 },
    { month: 'Feb', carUsers: 60, serviceCenters: 20, sparePartsSellers: 12 },
    { month: 'Mar', carUsers: 75, serviceCenters: 45, sparePartsSellers: 13 },
    { month: 'Apr', carUsers: 100, serviceCenters: 40, sparePartsSellers: 5 },
    { month: 'May', carUsers: 42, serviceCenters: 30, sparePartsSellers: 6 },
    { month: 'Jun', carUsers: 78, serviceCenters: 50, sparePartsSellers: 9 },
  ];

  return (
    <div className="dashboard">

      <div className="dashboard__metrics">
        <MetricCard
          title="Platform Activity"
          amount={loading ? "..." : dashboardData?.platformActivity.totalUsers.toLocaleString() || "0"}
          change={loading ? "..." : dashboardData?.platformActivity.change || "0%"}
          changeType={dashboardData?.platformActivity.changeType || 'neutral'}
          period="vs Yesterday"
          icon="bx bx-trending-up"
          color="activity"
          details={dashboardData?.platformActivity.details || []}
          onClick={() => handleCardClick('users')}
          loading={loading}
        />

        <MetricCard
          title="Revenue Dashboard"
          amount={loading ? "..." : dashboardData?.revenue.todayRevenue || "$0"}
          change={loading ? "..." : dashboardData?.revenue.change || "0%"}
          changeType={dashboardData?.revenue.changeType || 'neutral'}
          period="vs Yesterday"
          icon="bx bx-dollar-circle"
          color="revenue"
          details={dashboardData?.revenue.details || []}
          onClick={() => handleCardClick('revenue')}
          loading={loading}
        />

        <MetricCard
          title="Live Operations"
          amount={loading ? "..." : dashboardData?.operations.activeBookings?.toString() || "0"}
          change={loading ? "..." : dashboardData?.operations.change || "0"}
          changeType={dashboardData?.operations.changeType || 'neutral'}
          period="vs Yesterday"
          icon="bx bx-pulse"
          color="operations"
          details={dashboardData?.operations.details || []}
          onClick={() => handleCardClick('operations')}
          loading={loading}
        />

        <MetricCard
          title="Needs Attention"
          amount={loading ? "..." : dashboardData?.urgent.urgentItems?.toString() || "0"}
          change={loading ? "..." : dashboardData?.urgent.change || "0"}
          changeType={dashboardData?.urgent.changeType || 'neutral'}
          period="urgent items"
          icon="bx bx-error"
          color="urgent"
          details={dashboardData?.urgent.details || []}
          //   urgentCount={dashboardData?.urgent.urgentItems || 0}
          onClick={() => handleCardClick('urgent')}
          loading={loading}
        />
      </div>

      <div className='admin-dashboard__graphs-container '>
        <MonthlyUsersBarChart data={newUsersData} />
        <GrowthLineChart data={data} />
      </div>

      <div className="dashboard__metrics" style={{marginTop: '32px'}}>
        <BookingStatusChart />
      </div>

    </div>
  );
};

export default Dashboard;