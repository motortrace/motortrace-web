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
  return (
    <div className="review-trends-chart">
      <h3 className="review-trends-chart__title">Monthly Rating Trends</h3>
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
            stroke="#2f3136ff"
            strokeWidth={2.5}
            dot={{ r: 4 }}
            name="Google"
          />
          <Line
            type="monotone"
            dataKey="motortrace"
            stroke="#2441fb"
            strokeWidth={2.5}
            dot={{ r: 4 }}
            name="MotorTrace"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ReviewTrendsChart;
