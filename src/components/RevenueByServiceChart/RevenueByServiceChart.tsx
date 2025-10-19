import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import './RevenueByServiceChart.scss';

interface RevenueByServiceData {
  serviceId: string;
  serviceName: string;
  serviceCode: string;
  totalRevenue: number;
  bookingCount: number;
  averageRevenue: number;
}

interface RevenueByServiceChartProps {
  className?: string;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

const RevenueByServiceChart: React.FC<RevenueByServiceChartProps> = ({ className = '' }) => {
  const [data, setData] = useState<RevenueByServiceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRevenueByService();
  }, []);

  const fetchRevenueByService = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/canned-services/analytics/revenue', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setData(result.data);
        } else {
          setError('Failed to fetch revenue by service data');
        }
      } else {
        setError('Failed to fetch revenue by service data');
      }
    } catch (err) {
      setError('Error fetching revenue by service data');
      console.error('Error fetching revenue by service:', err);
    } finally {
      setLoading(false);
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="revenue-service-tooltip">
          <p className="tooltip-title">{data.serviceName}</p>
          <p className="tooltip-code">{data.serviceCode}</p>
          <p className="tooltip-revenue">{`Revenue: LKR ${data.totalRevenue.toLocaleString()}`}</p>
          <p className="tooltip-bookings">{`Bookings: ${data.bookingCount}`}</p>
          <p className="tooltip-average">{`Avg: LKR ${data.averageRevenue.toLocaleString()}`}</p>
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.05) return null; // Don't show labels for slices smaller than 5%

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADAngle);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={12}
        fontWeight="500"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (loading) {
    return (
      <div className={`revenue-by-service-chart ${className}`}>
        <div className="chart-header">
          <h3>Revenue by Service</h3>
          <p>Which services bring in the most revenue?</p>
        </div>
        <div className="chart-loading">
          <div className="loading-spinner"></div>
          <p>Loading revenue data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`revenue-by-service-chart ${className}`}>
        <div className="chart-header">
          <h3>Revenue by Service</h3>
          <p>Which services bring in the most revenue?</p>
        </div>
        <div className="chart-error">
          <p>{error}</p>
          <button onClick={fetchRevenueByService} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`revenue-by-service-chart ${className}`}>
      <div className="chart-header">
        <h3>Revenue by Service</h3>
        <p>Which services bring in the most revenue?</p>
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={100}
              fill="#8884d8"
              dataKey="totalRevenue"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value, entry: any) => (
                <span style={{ color: '#374151', fontSize: '12px' }}>
                  {entry.payload.serviceName}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueByServiceChart;