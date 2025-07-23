// src/components/PartVendorComponents/SalesByItemChart/SalesByItemChart.tsx
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import './SalesByItemChart.scss';

const data = [
  { item: 'Brake Pads', retailSales: 1500, serviceSales: 1200 },
  { item: 'Air Filter', retailSales: 1100, serviceSales: 850 },
  { item: 'Spark Plug', retailSales: 800, serviceSales: 1400 },
  { item: 'Oil Filter', retailSales: 1300, serviceSales: 900 },
  { item: 'Fuel Pump', retailSales: 700, serviceSales: 500 },
  { item: 'Headlight', retailSales: 900, serviceSales: 600 },
  { item: 'Radiator', retailSales: 600, serviceSales: 400 },
  { item: 'Alternator', retailSales: 750, serviceSales: 950 },
  { item: 'Battery', retailSales: 1200, serviceSales: 1100 },
  { item: 'Brake Disc', retailSales: 1000, serviceSales: 1050 },
    { item: 'Fuel Pump', retailSales: 700, serviceSales: 500 },
  { item: 'Headlight', retailSales: 900, serviceSales: 600 },
  { item: 'Radiator', retailSales: 600, serviceSales: 400 },
];


const SalesByItemChart: React.FC = () => {
  return (
    <div className="sales-by-item-chart">
      <div className="sales-by-item-chart__header">
        <h3 className="sales-by-item-chart__title">Sales by Item</h3>
      </div>

      <div className="sales-by-item-chart__chart">
<ResponsiveContainer width="100%" height="100%">
  <BarChart data={data} barGap={4} barCategoryGap={20}>
    <XAxis 
      dataKey="item" 
      tick={{ fill: '#9ca3af', fontSize: 10 }}
      axisLine={false}
      tickLine={false}
    />
    <YAxis
      tick={{ fill: '#9ca3af', fontSize: 10}}
      axisLine={false}
      tickLine={false}
      tickCount={6}
      allowDecimals={false}
    />
    <Tooltip 
      contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.9)', border: 'none' }}
      itemStyle={{ color: '#f9fafb' }}
      labelStyle={{ color: '#f9fafb' }}
    />
    <Legend wrapperStyle={{ color: '#6b7280', fontSize: 11, fontFamily: 'Poppins' }} />
    <Bar 
      dataKey="retailSales" 
      fill="#374151" 
      name="Retail Sales" 
      radius={[10, 10, 0, 0]} 
      barSize={28} 
    />
    <Bar 
      dataKey="serviceSales" 
      fill="#9ca3af" 
      name="Service Sales" 
      radius={[10, 10, 0, 0]} 
      barSize={28} 
    />
  </BarChart>
</ResponsiveContainer>



      </div>
    </div>
  );
};

export default SalesByItemChart;
