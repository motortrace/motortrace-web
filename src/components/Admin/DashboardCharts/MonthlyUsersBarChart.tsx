import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import './MonthlyUsersBarChart.scss';

interface DataPoint {
  month: string;
  carUsers: number;
  serviceCenters: number;
  sparePartsSellers: number;
}

interface MonthlyUsersBarChartProps {
  data: DataPoint[];
}

const MonthlyUsersBarChart: React.FC<MonthlyUsersBarChartProps> = ({ data }) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="tooltip-item" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value} new users`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Calculate totals for stats
  const totalCarUsers = data.reduce((sum, item) => sum + item.carUsers, 0);
  const totalServiceCenters = data.reduce((sum, item) => sum + item.serviceCenters, 0);
  const totalSparePartsSellers = data.reduce((sum, item) => sum + item.sparePartsSellers, 0);

  return (
    <div className="monthly-users-bar-chart">
      <div className="chart-header">
        <h2 className="chart-title">Monthly New User Registrations</h2>
        <p className="chart-subtitle">New User Acquisition Overview Over Past 6 Months</p>
      </div>
      
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 20,
            }}
            barCategoryGap="20%"
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#e0e0e0" 
              opacity={0.8}
            />
            
            <XAxis 
              dataKey="month" 
              stroke="#666666"
              fontSize={12}
              fontWeight={500}
              tick={{ fill: '#666666' }}
            />
            
            <YAxis 
              stroke="#666666"
              fontSize={12}
              fontWeight={500}
              tick={{ fill: '#666666' }}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            <Legend 
              wrapperStyle={{ 
                paddingTop: '20px',
                fontSize: '14px',
                fontWeight: '500'
              }}
            />
            
            <Bar
              dataKey="carUsers"
              fill="#1a1a1a"
              name="Car Users"
              radius={[4, 4, 0, 0]}
            />
            
            <Bar
              dataKey="serviceCenters"
              fill="#666666"
              name="Service Centers"
              radius={[4, 4, 0, 0]}
            />
            
            <Bar
              dataKey="sparePartsSellers"
              fill="#999999"
              name="Spare Parts Sellers"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="chart-stats">
        <div className="stat-card">
          <div className="stat-icon car-users"></div>
          <div className="stat-info">
            <span className="stat-value">{totalCarUsers}</span>
            <span className="stat-label">Car Users</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon service-centers"></div>
          <div className="stat-info">
            <span className="stat-value">{totalServiceCenters}</span>
            <span className="stat-label">Service Centers</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon spare-parts"></div>
          <div className="stat-info">
            <span className="stat-value">{totalSparePartsSellers}</span>
            <span className="stat-label">Spare Parts Sellers</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyUsersBarChart;