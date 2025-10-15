import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './ServicePopularityChart.scss';

interface ServicePopularityData {
  serviceId: string;
  serviceName: string;
  serviceCode: string;
  bookingCount: number;
}

interface ServicePopularityChartProps {
  className?: string;
}

const ServicePopularityChart: React.FC<ServicePopularityChartProps> = ({ className = '' }) => {
  const [data, setData] = useState<ServicePopularityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchServicePopularity();
  }, []);

  const fetchServicePopularity = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/canned-services/analytics/popularity', {
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
          setError('Failed to fetch service popularity data');
        }
      } else {
        setError('Failed to fetch service popularity data');
      }
    } catch (err) {
      setError('Error fetching service popularity data');
      console.error('Error fetching service popularity:', err);
    } finally {
      setLoading(false);
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="service-popularity-tooltip">
          <p className="tooltip-title">{data.serviceName}</p>
          <p className="tooltip-code">{data.serviceCode}</p>
          <p className="tooltip-value">{`Bookings: ${data.bookingCount}`}</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className={`service-popularity-chart ${className}`}>
        <div className="chart-header">
          <h3>Service Popularity</h3>
          <p>Which services are booked most often?</p>
        </div>
        <div className="chart-loading">
          <div className="loading-spinner"></div>
          <p>Loading service popularity data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`service-popularity-chart ${className}`}>
        <div className="chart-header">
          <h3>Service Popularity</h3>
          <p>Which services are booked most often?</p>
        </div>
        <div className="chart-error">
          <p>{error}</p>
          <button onClick={fetchServicePopularity} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`service-popularity-chart ${className}`}>
      <div className="chart-header">
        <h3>Service Popularity</h3>
        <p>Which services are booked most often?</p>
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="serviceName"
              angle={-45}
              textAnchor="end"
              height={80}
              fontSize={12}
            />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="bookingCount"
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
              maxBarSize={35}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ServicePopularityChart;