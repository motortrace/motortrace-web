import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import './CustomerEngagementChart.scss';

const data = [
  {
    category: 'New Customers',
    serviceCenter: 120,
    other: 80,
  },
  {
    category: 'Returning Customers',
    serviceCenter: 200,
    other: 150,
  },
  {
    category: 'Inactive Customers',
    serviceCenter: 40,
    other: 70,
  },
];

const CustomerEngagementChart: React.FC = () => {
  return (
    <div className="customer-engagement-chart">
      <h2 className="chart-title">Customer Engagement Overview</h2>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="serviceCenter" name="Service Center Customers" fill="#2c3e50" barSize={32} />
            <Bar dataKey="other" name="Other Customers" fill="#34495e" barSize={32} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CustomerEngagementChart;
