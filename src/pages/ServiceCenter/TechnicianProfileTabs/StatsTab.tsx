import React from 'react';

interface Stats {
  totalTasksCompleted: { count: number }[];
  totalHoursWorked: number;
  totalRevenueGenerated: number;
  averageTaskTime: number;
  efficiencyRating: number | null;
  currentWorkingStatus: boolean;
  activeTasksCount: { count: number }[];
  last30DaysTasks: { count: number }[];
  last30DaysHours: number;
  last30DaysRevenue: number;
}

interface StatsTabProps {
  stats: Stats;
}

const StatsTab: React.FC<StatsTabProps> = ({ stats }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR'
    }).format(amount);
  };

  const formatHours = (hours: number) => {
    return `${hours.toFixed(2)} hours`;
  };

  return (
    <div className="stats-tab">
      <div className="stats-grid">
        {/* Overall Statistics */}
        <div className="stats-section">
          <h3>Overall Performance</h3>
          <div className="stats-cards">
            <div className="stat-card">
              <div className="stat-value">{stats.totalTasksCompleted[0]?.count || 0}</div>
              <div className="stat-label">Total Tasks Completed</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{formatHours(stats.totalHoursWorked)}</div>
              <div className="stat-label">Total Hours Worked</div>
            </div>
          </div>
        </div>

        {/* Last 30 Days */}
        <div className="stats-section">
          <h3>Last 30 Days</h3>
          <div className="stats-cards">
            <div className="stat-card">
              <div className="stat-value">{stats.last30DaysTasks[0]?.count || 0}</div>
              <div className="stat-label">Tasks Completed</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{formatHours(stats.last30DaysHours)}</div>
              <div className="stat-label">Hours Worked</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{formatCurrency(stats.last30DaysRevenue)}</div>
              <div className="stat-label">Revenue Generated</div>
            </div>
          </div>
        </div>

        {/* Current Activity */}
        <div className="stats-section">
          <h3>Current Activity</h3>
          <div className="current-activity">
            <div className="activity-item">
              <span className="activity-label">Active Tasks:</span>
              <span className="activity-value">{stats.activeTasksCount[0]?.count || 0}</span>
            </div>
            <div className="activity-item">
              <span className="activity-label">Average Task Time:</span>
              <span className="activity-value">{stats.averageTaskTime.toFixed(2)} hours</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsTab;