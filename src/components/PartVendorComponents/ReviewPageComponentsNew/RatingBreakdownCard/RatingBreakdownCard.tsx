import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const data = [
  { rating: '5 Stars', Google: 80, MotorTrace: 50 },
  { rating: '4 Stars', Google: 30, MotorTrace: 20 },
  { rating: '3 Stars', Google: 10, MotorTrace: 8 },
  { rating: '2 Stars', Google: 5, MotorTrace: 5 },
  { rating: '1 Star', Google: 3, MotorTrace: 2 },
];

const RatingComparisonChart = () => {
  return (
    <div style={{
      background: '#fff',
      borderRadius: '16px',
      padding: '20px',
      border: '2px solid #e5e7eb',
      fontFamily: 'Poppins, sans-serif',
      maxHeight: '350px',
    }}>
      <h3 style={{
        marginBottom: '16px',
        color: '#111827',
        fontSize: '1.1rem',
        fontWeight: 600
      }}>
        Review Stats
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={data}
          barGap={8}
          barCategoryGap="25%"
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="rating"
            tickLine={false}
            axisLine={{ stroke: '#e5e7eb' }}
            style={{ fontSize: '12px', fill: '#4b5563' }}
          />
          <YAxis
            allowDecimals={false}
            tickLine={false}
            axisLine={{ stroke: '#e5e7eb' }}
            style={{ fontSize: '12px', fill: '#4b5563' }}
          />
          <Tooltip />
          <Legend
            verticalAlign="top"
            iconType="circle"
            formatter={(value) => <span style={{ color: '#4b5563', fontSize: '13px' }}>{value}</span>}
          />
          <Bar dataKey="Google" fill="#2f3136ff" radius={[4, 4, 0, 0]} />
          <Bar dataKey="MotorTrace" fill="#2441fb" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RatingComparisonChart;
