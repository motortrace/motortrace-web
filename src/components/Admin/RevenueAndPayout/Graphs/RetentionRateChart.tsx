import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import './RetentionRateChart.scss';

interface RetentionData {
  month: string;
  retentionRate: number;
}

interface RetentionRateChartProps {
  data?: RetentionData[];
  title?: string;
}

const RetentionRateChart: React.FC<RetentionRateChartProps> = ({
  data = [
    { month: 'July 2024', retentionRate: 78.5 },
    { month: 'August 2024', retentionRate: 82.3 },
    { month: 'September 2024', retentionRate: 85.1 },
    { month: 'October 2024', retentionRate: 79.8 },
    { month: 'November 2024', retentionRate: 88.2 },
    { month: 'December 2024', retentionRate: 91.4 },
  ],
  title = 'Subscriber Retention Rate Trends'
}) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{`${label}`}</p>
          <p className="tooltip-item" style={{ color: payload[0].color }}>
            {`Retention Rate: ${payload[0].value}%`}
          </p>
        </div>
      );
    }
    return null;
  };

  // Calculate average retention rate
  const averageRetention = (data.reduce((sum, item) => sum + item.retentionRate, 0) / data.length).toFixed(1);
  const highestRetention = Math.max(...data.map(item => item.retentionRate)).toFixed(1);
  const lowestRetention = Math.min(...data.map(item => item.retentionRate)).toFixed(1);

  return (
    <div className="retention-rate-chart">
      <div className="chart-header">
        <h2 className="chart-title">{title}</h2>
        <p className="chart-subtitle">Monthly Subscriber Retention Performance Over Past 6 Months</p>
      </div>
      
      <div className="chart-container">
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
              <linearGradient id="retentionGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1a1a1a" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#1a1a1a" stopOpacity={0.02}/>
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
              domain={['dataMin - 5', 'dataMax + 5']}
              tickFormatter={(value) => `${value}%`}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            <Line
              type="monotone"
              dataKey="retentionRate"
              stroke="#1a1a1a"
              strokeWidth={4}
              dot={{ 
                fill: '#1a1a1a', 
                strokeWidth: 3, 
                r: 8,
                stroke: '#ffffff'
              }}
              activeDot={{ 
                r: 12, 
                fill: '#1a1a1a', 
                strokeWidth: 3,
                stroke: '#ffffff',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
              }}
            />
            
            {/* Area fill under the line */}
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1a1a1a" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#1a1a1a" stopOpacity={0.01}/>
              </linearGradient>
            </defs>
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="chart-stats">
        <div className="stat-card">
          <div className="stat-icon average"></div>
          <div className="stat-info">
            <span className="stat-value">{averageRetention}%</span>
            <span className="stat-label">Average Retention</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon highest"></div>
          <div className="stat-info">
            <span className="stat-value">{highestRetention}%</span>
            <span className="stat-label">Highest Month</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon lowest"></div>
          <div className="stat-info">
            <span className="stat-value">{lowestRetention}%</span>
            <span className="stat-label">Lowest Month</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetentionRateChart;