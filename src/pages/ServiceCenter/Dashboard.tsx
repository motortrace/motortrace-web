import React from 'react';
import TechniciansTableCard from '../../components/TechniciansTableCard/TechniciansTableCard';
import DailyCustomersLineChart from '../../components/DailyCustomersLineChart/DailyCustomersLineChart';

// MetricCard Component
interface MetricCardProps {
  title: string;
  amount: string;
  change: string;
  changeType: 'positive' | 'negative';
  period?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  amount,
  change,
  changeType,
  period = 'vs last month'
}) => {
  return (
    <div style={{
      backgroundColor: 'white',
      padding: '24px',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      position: 'relative'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '16px'
      }}>
        <h3 style={{
          fontSize: '14px',
          fontWeight: '500',
          color: '#64748b',
          margin: 0
        }}>
          {title}
        </h3>
        <button style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '4px',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <i className='bx bx-right-top-arrow-circle' style={{
            fontSize: '20px',
            color: '#64748b'
          }}></i>
        </button>
      </div>
      
      <div style={{
        fontSize: '28px',
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: '12px'
      }}>
        {amount}
      </div>
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px'
      }}>
        <span style={{
          color: changeType === 'positive' ? '#10b981' : '#ef4444',
          fontWeight: '500'
        }}>
          {changeType === 'positive' ? '↑' : '↓'} {change}
        </span>
        <span style={{
          color: '#64748b'
        }}>
          {period}
        </span>
      </div>
    </div>
  );
};

const Dashboard = () => {
  // Fake data for technicians
  const techniciansData = [
    {
      id: '1',
      name: 'Mike Johnson',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      currentWorkOrder: {
        id: 'WO-001',
        title: 'Brake Pad Replacement',
        customer: 'John Smith',
        vehicle: 'Toyota Camry 2020',
        taskType: 'Labor' as const
      }
    },
    {
      id: '2',
      name: 'Sarah Wilson',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      currentWorkOrder: {
        id: 'WO-002',
        title: 'Battery Replacement',
        customer: 'Alice Johnson',
        vehicle: 'Honda Civic 2019',
        taskType: 'Labor' as const
      }
    },
    {
      id: '3',
      name: 'David Brown',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      currentWorkOrder: {
        id: 'WO-003',
        title: 'Spark Plug Replacement',
        customer: 'Robert Davis',
        vehicle: 'Ford Focus 2021',
        taskType: 'Labor' as const
      }
    },
    {
      id: '4',
      name: 'Alex Green',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      currentWorkOrder: {
        id: 'WO-004',
        title: 'Transmission Service',
        customer: 'Lisa Anderson',
        vehicle: 'Nissan Altima 2018',
        taskType: 'Inspection' as const
      }
    }
  ];

  // Fake data for daily customers
  const dailyCustomersData = [
    { date: '2024-01-15', customers: 15 },
    { date: '2024-01-16', customers: 22 },
    { date: '2024-01-17', customers: 18 },
    { date: '2024-01-18', customers: 28 },
    { date: '2024-01-19', customers: 24 },
    { date: '2024-01-20', customers: 31 },
    { date: '2024-01-21', customers: 19 }
  ];

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      padding: '24px'
    }}>
      {/* Add Boxicons CSS */}
      <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet' />
      
      {/* Metrics Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '24px',
        marginBottom: '32px'
      }}>
        <MetricCard
          title="Revenue"
          amount="30,000 LKR"
          change="12%"
          changeType="positive"
          period="vs last month"
        />
        <MetricCard
          title="Daily Sales"
          amount="10,000 LKR"
          change="8%"
          changeType="positive"
          period="vs last month"
        />
        <MetricCard
          title="Average Appointment Time"
          amount="3 hrs"
          change="5%"
          changeType="negative"
          period="vs last month"
        />
        <MetricCard
          title="Customer Ratings"
          amount="4.27/5"
          change="2%"
          changeType="positive"
          period="vs last month"
        />
      </div>

      {/* Charts Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px',
        marginBottom: '32px'
      }}>
        <TechniciansTableCard technicians={techniciansData} />
        <DailyCustomersLineChart data={dailyCustomersData} />
      </div>
    </div>
  );
};

export default Dashboard;