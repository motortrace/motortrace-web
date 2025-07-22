import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import './GrowthLineChart.scss';

interface DataPoint {
  month: string;
  carUsers: number;
  serviceCenters: number;
  sparePartsSellers: number;
}

interface GrowthLineGraphProps {
  data: DataPoint[];
}

const GrowthLineChart: React.FC<GrowthLineGraphProps> = ({ data }) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="tooltip-item" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="growth-line-graph">
      <div className="graph-header">
        <h2 className="graph-title">User Base Expansion Trends</h2>
        <p className="graph-subtitle">Growth Trends Across User Types Over Past 6 Months</p>
      </div>
      
      <div className="graph-container">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 20,
            }}
          >
            <defs>
              <linearGradient id="gridGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#333333" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#666666" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            
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
            
            <Line
              type="monotone"
              dataKey="carUsers"
              stroke="#1a1a1a"
              strokeWidth={3}
              dot={{ fill: '#1a1a1a', strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, fill: '#1a1a1a', strokeWidth: 2 }}
              name="Car Users"
            />
            
            <Line
              type="monotone"
              dataKey="serviceCenters"
              stroke="#666666"
              strokeWidth={3}
              dot={{ fill: '#666666', strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, fill: '#666666', strokeWidth: 2 }}
              name="Service Centers"
            />
            
            <Line
              type="monotone"
              dataKey="sparePartsSellers"
              stroke="#999999"
              strokeWidth={3}
              dot={{ fill: '#999999', strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, fill: '#999999', strokeWidth: 2 }}
              name="Spare Parts Sellers"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="graph-stats">
        <div className="stat-card">
          <div className="stat-icon car-users"></div>
          <div className="stat-info">
            <span className="stat-value">400</span>
            <span className="stat-label">Car Users</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon service-centers"></div>
          <div className="stat-info">
            <span className="stat-value">200</span>
            <span className="stat-label">Service Centers</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon spare-parts"></div>
          <div className="stat-info">
            <span className="stat-value">50</span>
            <span className="stat-label">Spare Parts Sellers</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrowthLineChart;