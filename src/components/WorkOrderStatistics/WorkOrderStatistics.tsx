import React, { useState, useEffect } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useAuth } from '../../hooks/useAuth';
import './WorkOrderStatistics.scss';

interface WorkOrderStatisticsData {
  totalWorkOrders: number;
  averageDaily: number;
  peakDaily: number;
  dailyBreakdown: Array<{
    date: string;
    count: number;
  }>;
}

const WorkOrderStatistics: React.FC = () => {
  const { token } = useAuth();
  const [data, setData] = useState<WorkOrderStatisticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWorkOrderStatistics = async () => {
      if (!token) return;

      setLoading(true);
      setError('');

      try {
        const response = await fetch('http://localhost:3000/work-orders/statistics/creation', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch work order statistics: ${response.statusText}`);
        }

        const result = await response.json();

        if (result.success) {
          setData(result.data);
        } else {
          throw new Error(result.message || 'Failed to fetch work order statistics');
        }
      } catch (err) {
        console.error('Error fetching work order statistics:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch work order statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkOrderStatistics();
  }, [token]);

  if (loading) {
    return (
      <div className="work-order-statistics">
        <div className="work-order-statistics__header">
          <h3 className="work-order-statistics__title">Work Order Statistics</h3>
          <div className="work-order-statistics__period">Last 7 Days</div>
        </div>
        <div className="work-order-statistics__content">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '180px' }}>
            Loading...
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="work-order-statistics">
        <div className="work-order-statistics__header">
          <h3 className="work-order-statistics__title">Work Order Statistics</h3>
          <div className="work-order-statistics__period">Last 7 Days</div>
        </div>
        <div className="work-order-statistics__content">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '180px', color: '#ef4444' }}>
            {error || 'Failed to load data'}
          </div>
        </div>
      </div>
    );
  }

  // Transform data for Recharts
  const chartData = data.dailyBreakdown.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    workOrders: item.count,
    fullDate: item.date
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="work-order-statistics__tooltip">
          <p className="work-order-statistics__tooltip-label">{label}</p>
          <p className="work-order-statistics__tooltip-value">
            <span className="work-order-statistics__tooltip-dot" />
            Work Orders: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="work-order-statistics">
      <div className="work-order-statistics__header">
        <h3 className="work-order-statistics__title">Work Order Statistics</h3>
        <div className="work-order-statistics__period">
          Last 7 Days
        </div>
      </div>

      <div className="work-order-statistics__content">
        <div className="work-order-statistics__chart">
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <defs>
                <linearGradient id="colorWorkOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="date"
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                domain={['dataMin - 1', 'dataMax + 1']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="workOrders"
                stroke="#3b82f6"
                strokeWidth={3}
                fill="url(#colorWorkOrders)"
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Stats */}
        <div className="work-order-statistics__stats">
          <div className="work-order-statistics__stat">
            <div className="work-order-statistics__stat-value">
              {Math.round(data.averageDaily)}
            </div>
            <div className="work-order-statistics__stat-label">Avg Daily</div>
          </div>
          <div className="work-order-statistics__stat">
            <div className="work-order-statistics__stat-value">
              {data.peakDaily}
            </div>
            <div className="work-order-statistics__stat-label">Peak</div>
          </div>
          <div className="work-order-statistics__stat">
            <div className="work-order-statistics__stat-value">
              {data.totalWorkOrders}
            </div>
            <div className="work-order-statistics__stat-label">Total</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkOrderStatistics;