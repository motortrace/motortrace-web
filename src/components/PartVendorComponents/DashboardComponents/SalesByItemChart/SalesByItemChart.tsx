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
<ResponsiveContainer width="100%" height={300}>
  <BarChart data={data} barGap={2} barCategoryGap={10}>
    <XAxis 
      dataKey="item" 
      tick={{ fill: '#9ca3af', fontSize: 10, fontFamily: 'Poppins' }} 
      axisLine={false}
      tickLine={false}
    />
    <YAxis
      tick={{ fill: '#9ca3af', fontSize: 10, fontFamily: 'Poppins' }}
      axisLine={false}
      tickLine={false}
      tickCount={6}
      allowDecimals={false}
    />
    <Tooltip 
      contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', borderColor: '#374151', borderWidth: 1 }}
      itemStyle={{ color: '#fff' }}
      labelStyle={{ color: '#fff' }}
    />
    <Legend wrapperStyle={{ color: '#9ca3af', fontSize: 12, fontFamily: 'Poppins' }} />
    <Bar 
      dataKey="retailSales" 
      fill="#313133" 
      name="Retail Customer Sales" 
      radius={[20, 20, 0, 0]} 
      barSize={40} 
    />
    <Bar 
      dataKey="serviceSales" 
      fill="#C7C7C7" 
      name="Service Center Sales" 
      radius={[20, 20, 0, 0]} 
      barSize={40} 
    />
  </BarChart>
</ResponsiveContainer>


      </div>
    </div>
  );
};

export default SalesByItemChart;
