import React, { useState, useMemo } from 'react';
import { Calendar, TrendingUp, Users, BookOpen, CheckCircle, DollarSign } from 'lucide-react';
import KPICard from '../../components/Admin/KPICard/KPICard'; // Import the new KPI Card component
import BookingStatusChart from '../../components/Admin/DashboardCharts/BookingStatusChart';
import './AdminDashboard.scss';

type TimePeriod = 'today' | 'week' | 'month' | 'year';

interface KPIData {
  current: number;
  previous: number;
  format: 'number' | 'currency' | 'percentage';
}

interface DashboardData {
  newCarUsers: KPIData;
  totalBookings: KPIData;
  completedServices: KPIData;
  totalSales: KPIData;
  bookingStatuses: {
    upComing: number;
    onGoing: number;
    completed: number;
    cancelled: number;
    noShow: number;
  };
}

// Mock data - replace with actual API calls
const mockData: Record<TimePeriod, DashboardData> = {
  today: {
    newCarUsers: { current: 24, previous: 18, format: 'number' },
    totalBookings: { current: 16, previous: 20, format: 'number' },
    completedServices: { current: 7, previous: 8, format: 'number' },
    totalSales: { current: 34750, previous: 30000, format: 'currency' },
    bookingStatuses: {
      upComing: 5,
      onGoing: 3,
      completed: 7,
      cancelled: 1,
      noShow: 0
    }
  },
  week: {
    newCarUsers: { current: 164, previous: 144, format: 'number' },
    totalBookings: { current: 130, previous: 120, format: 'number' },
    completedServices: { current: 99, previous: 89, format: 'number' },
    totalSales: { current: 280650, previous: 225000, format: 'currency' },
    bookingStatuses: {
      upComing: 18,
      onGoing: 12,
      completed: 99,
      cancelled: 8,
      noShow: 3
    }
  },
  month: {
    newCarUsers: { current: 512, previous: 476, format: 'number' },
    totalBookings: { current: 544, previous: 524, format: 'number' },
    completedServices: { current: 388, previous: 380, format: 'number' },
    totalSales: { current: 975625, previous: 954350, format: 'currency' },
    bookingStatuses: {
      upComing: 85,
      onGoing: 45,
      completed: 388,
      cancelled: 18,
      noShow: 8
    }
  },
  year: {
    newCarUsers: { current: 5011, previous: 3647, format: 'number' },
    totalBookings: { current: 5596, previous: 4969, format: 'number' },
    completedServices: { current: 5120, previous: 4896, format: 'number' },
    totalSales: { current: 11100250, previous: 9960500, format: 'currency' },
    bookingStatuses: {
      upComing: 280,
      onGoing: 156,
      completed: 5120,
      cancelled: 32,
      noShow: 8
    }
  }
};


const AdminDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('month');

  const periodLabels: Record<TimePeriod, { current: string; previous: string }> = {
    today: { current: 'Today', previous: 'vs Yesterday' },
    week: { current: 'This Week', previous: 'vs Last Week' },
    month: { current: 'This Month', previous: 'vs Last Month' },
    year: { current: 'This Year', previous: 'vs Last Year' }
  };

  const formatValue = (value: number, format: 'number' | 'currency' | 'percentage'): string => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-LK', {
          style: 'currency',
          currency: 'LKR',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(value);
      case 'percentage':
        return `${value.toFixed(1)}%`;
      default:
        return new Intl.NumberFormat('en-LK').format(value);
    }
  };

  const calculateChange = (current: number, previous: number): { percentage: string; type: 'positive' | 'negative' } => {
    const change = ((current - previous) / previous) * 100;
    return {
      percentage: `${Math.abs(change).toFixed(1)}%`,
      type: change >= 0 ? 'positive' : 'negative'
    };
  };

  const currentData = mockData[selectedPeriod];

  const kpiCards = useMemo(() => [
    {
      id: 'newCarUsers',
      title: 'New Car Users',
      icon: Users,
      description: 'Customer acquisition',
      data: currentData.newCarUsers,
      color: 'blue' as const
    },
    {
      id: 'totalBookings',
      title: 'Total Bookings',
      icon: BookOpen,
      description: 'Service demand',
      data: currentData.totalBookings,
      color: 'purple' as const
    },
    {
      id: 'completedServices',
      title: 'Completed Services',
      icon: CheckCircle,
      description: 'Service delivery',
      data: currentData.completedServices,
      color: 'green' as const
    },
    {
      id: 'totalSales',
      title: 'Total Sales',
      icon: TrendingUp,
      description: 'Revenue generated',
      data: currentData.totalSales,
      color: 'orange' as const
    }
  ], [currentData]);

  const bookingChartData = useMemo(() => [
    { label: 'Up Coming', value: currentData.bookingStatuses.upComing, color: '#212529' },
    { label: 'On Going', value: currentData.bookingStatuses.onGoing, color: '#495057' },
    { label: 'Completed', value: currentData.bookingStatuses.completed, color: '#6c757d' },
    { label: 'Cancelled', value: currentData.bookingStatuses.cancelled, color: '#adb5bd' },
    { label: 'No Show', value: currentData.bookingStatuses.noShow, color: '#dee2e6' }
  ], [currentData.bookingStatuses]);


  return (
    <div className="business-dashboard-container">
      <div className="business-dashboard-container__header-section">
        {/* <div className="business-dashboard-container__title-area">
          <h1 className="business-dashboard-container__main-title">Dashboard Overview</h1>
          <p className="business-dashboard-container__subtitle-text">
            Track your key performance indicators and business metrics
          </p>
        </div> */}

        <div className="business-dashboard-container__control-panel">
          <div className="dashboard-period-selector">
            <Calendar className="dashboard-period-selector__calendar-icon" size={20} />
            <select
              className="dashboard-period-selector__dropdown"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as TimePeriod)}
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>
      </div>

      <div className="business-dashboard-container__kpi-grid">
        {kpiCards.map((card) => (
          <KPICard
            key={card.id}
            id={card.id}
            title={card.title}
            icon={card.icon}
            description={card.description}
            data={card.data}
            color={card.color}
            periodLabel={periodLabels[selectedPeriod].current}
            previousLabel={periodLabels[selectedPeriod].previous}
          />
        ))}
      </div>

      <div className="admin-dashboard__charts">
        <BookingStatusChart
          data={bookingChartData}
          title={`Booking Status Distribution - ${periodLabels[selectedPeriod].current}`}
        />
      </div>

      

    </div>
  );
};

export default AdminDashboard;