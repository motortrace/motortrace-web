import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import './ReviewTrendsChart.scss';

const data = [
  { month: 'Mar', google: 4.3, motortrace: 4.0 },
  { month: 'Apr', google: 4.4, motortrace: 4.2 },
  { month: 'May', google: 4.5, motortrace: 4.1 },
  { month: 'Jun', google: 4.6, motortrace: 4.3 },
  { month: 'Jul', google: 4.5, motortrace: 4.4 },
];

const ReviewTrendsChart = () => {
  // Calculate averages for stat-cards
  // Stat cards for average Google and MotorTrace ratings
  const avgGoogle = (data.reduce((sum, d) => sum + d.google, 0) / data.length).toFixed(2);
  const avgMotortrace = (data.reduce((sum, d) => sum + d.motortrace, 0) / data.length).toFixed(2);
  const statCards = (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
      gap: 20,
      marginTop: 24,
    }}>
      <div style={{
        background: '#fff',
        border: '1px solid #e8e8e8',
        borderRadius: 12,
        padding: '10px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        zIndex: 1,
        minWidth: 0,
      }}>
        <span style={{ width: 18, height: 18, borderRadius: 6, background: '#1a1a1a', display: 'inline-block', marginRight: 8 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
          <span style={{ fontSize: 16, fontWeight: 500, color: '#1a1a1a', lineHeight: 1.2 }}>{avgGoogle}</span>
          <span style={{ fontSize: 13, fontWeight: 500, color: '#666666', opacity: 0.8, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Avg. Google Rating</span>
        </div>
      </div>
      <div style={{
        background: '#fff',
        border: '1px solid #e8e8e8',
        borderRadius: 12,
        padding: '10px 12px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        zIndex: 1,
        minWidth: 0,
      }}>
        <span style={{ width: 18, height: 18, borderRadius: 6, background: '#666666', display: 'inline-block', marginRight: 8 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
          <span style={{ fontSize: 16, fontWeight: 500, color: '#1a1a1a', lineHeight: 1.2 }}>{avgMotortrace}</span>
          <span style={{ fontSize: 13, fontWeight: 500, color: '#666666', opacity: 0.8, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Avg. MotorTrace Rating</span>
        </div>
      </div>
    </div>
  );
  return (
    <div className="review-trends-chart">
      <div className="chart-header">
        <h2 className="chart-title">Monthly Rating Trends</h2>
        <p className="chart-subtitle">Google & MotorTrace Ratings Over Past 6 Months</p>
      </div>
      <div className="chart-container">
      <ResponsiveContainer width="100%" height={210}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7280' }} />
          <YAxis domain={[3.5, 5]} tick={{ fontSize: 12, fill: '#6b7280' }} />
          <Tooltip />
          <Legend verticalAlign="top" height={36} iconType="circle" />
          <Line
            type="monotone"
            dataKey="google"
              stroke="#1a1a1a"
            strokeWidth={2.5}
            dot={{ r: 4 }}
            name="Google"
          />
          <Line
            type="monotone"
            dataKey="motortrace"
              stroke="#666666"
            strokeWidth={2.5}
            dot={{ r: 4 }}
            name="MotorTrace"
          />
        </LineChart>
      </ResponsiveContainer>
      </div>
      {statCards}
    </div>
  );
};

export default ReviewTrendsChart;
