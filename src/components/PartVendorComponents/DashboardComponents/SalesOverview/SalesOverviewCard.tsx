import React from 'react';
import './SalesOverviewCard.scss';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

interface SalesData {
  label: string;
  value: number;
}

const COLORS = ['#9ca3af', '#d1d5db']; // Neutral greys

const data: SalesData[] = [
  { label: 'Service Center Sales', value: 420000 },
  { label: 'Customer Sales', value: 280000 },
];

const currencyFormatter = (value: number) =>
  `LKR ${value.toLocaleString('en-LK')}`;

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <span>{`${payload[0].name}: ${currencyFormatter(payload[0].value)}`}</span>
      </div>
    );
  }
  return null;
};

const SalesOverviewCard: React.FC = () => {
  const totalSales = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="sales-overview-card">
      <div className="sales-overview-card__header">
        <h3>Sales Overview</h3>
        <div className="total">{currencyFormatter(totalSales)}</div>
      </div>

      <div className="sales-overview-card__chart-container">
        {/* Pie Chart */}
        <PieChart width={180} height={180}>
          <Pie
            data={data}
            dataKey="value"
            nameKey="label"
            outerRadius={75}
            innerRadius={45}
            paddingAngle={2}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>

        {/* Legend */}
        <div className="sales-overview-card__legend">
          {data.map((entry, index) => (
            <div key={index} className="sales-overview-card__legend-item">
              <div className="color" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
              <div className="label">{entry.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SalesOverviewCard;
