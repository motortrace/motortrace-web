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
  // Custom legend to match admin dashboard
  const customLegend = (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      gap: 32,
      marginTop: 18,
      marginBottom: 16,
      alignItems: 'center',
      width: '100%',
    }}>
      <div style={{
        background: '#fff',
        border: '1px solid #e8e8e8',
        borderRadius: 12,
        padding: '10px 24px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        minWidth: 120,
        justifyContent: 'center',
      }}>
        <span style={{ width: 16, height: 16, borderRadius: 6, background: '#1a1a1a', display: 'inline-block' }} />
        <span style={{ fontSize: 15, fontWeight: 500, color: '#1a1a1a' }}>Google</span>
      </div>
      <div style={{
        background: '#fff',
        border: '1px solid #e8e8e8',
        borderRadius: 12,
        padding: '10px 24px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        minWidth: 120,
        justifyContent: 'center',
      }}>
        <span style={{ width: 16, height: 16, borderRadius: 6, background: '#666666', display: 'inline-block' }} />
        <span style={{ fontSize: 15, fontWeight: 500, color: '#666666' }}>MotorTrace</span>
      </div>
    </div>
  );
  return (
    <div style={{
      fontFamily: 'Poppins',
      background: '#ffffff',
      borderRadius: 16,
      padding: 32,
      margin: 0,
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.06)',
      border: '1px solid #f0f0f0',
      position: 'relative',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      isolation: 'isolate',
    }}>
      <h3 style={{
        marginBottom: '16px',
        color: '#111827',
        fontSize: '1.1rem',
        fontWeight: 600
      }}>
        Review Stats
      </h3>
      {customLegend}
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
          <Bar dataKey="Google" fill="#1a1a1a" radius={[4, 4, 0, 0]} />
          <Bar dataKey="MotorTrace" fill="#666666" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RatingComparisonChart;
