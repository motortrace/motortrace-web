import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import './SalesOverview.scss';

interface SalesData {
  label: string;
  value: number;
  color: string;
}

const data: SalesData[] = [
  { label: 'Service Center Sales', value: 400, color: '#2c3e50' },
  { label: 'Customer Sales', value: 300, color: '#34495e' },
];

const SalesOverview: React.FC = () => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="sales-overview-chart">
      <h2 className="chart-title">Today's Sales Overview</h2>

      <div className="chart-container">
        <div className="pie-wrapper">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="label"
                innerRadius="60%"
                outerRadius="100%"
                paddingAngle={2}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="legend">
          {data.map((entry, index) => (
            <div key={index} className="legend-item">
              <div
                className="legend-color"
                style={{ backgroundColor: entry.color }}
              ></div>
              <span className="legend-label">{entry.label}</span>
              <span className="legend-value">
                {entry.value} ({((entry.value / total) * 100).toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SalesOverview;
