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
import './CommissionChart.scss';

interface CommissionDataPoint {
  month: string;
  serviceCenters: number;
  sparePartsSellers: number;
  total: number;
}

interface CommissionChartProps {
  data: CommissionDataPoint[];
}

const CommissionChart: React.FC<CommissionChartProps> = ({ data }) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="tooltip-item" style={{ color: entry.color }}>
              {`${entry.name}: LKR ${entry.value.toLocaleString()}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Calculate totals for stats
  const totalServiceCenterCommission = data.reduce((sum, item) => sum + item.serviceCenters, 0);
  const totalSparePartsCommission = data.reduce((sum, item) => sum + item.sparePartsSellers, 0);
  const totalCommission = totalServiceCenterCommission + totalSparePartsCommission;

  // Calculate average monthly earnings
  const avgServiceCenter = Math.round(totalServiceCenterCommission / data.length);
  const avgSpareParts = Math.round(totalSparePartsCommission / data.length);

  return (
    <div className="commission-chart">
      <div className="chart-header">
        <h2 className="chart-title">Commission Earnings Overview</h2>
        <p className="chart-subtitle">Revenue from Service Centers & Spare Parts Sellers - Past 6 Months</p>
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
              tickFormatter={(value) => `LKR ${value.toLocaleString()}`}
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
            
            <Line
              type="monotone"
              dataKey="total"
              stroke="#1a1a1a"
              strokeWidth={3}
              dot={{ fill: '#1a1a1a', strokeWidth: 2, r: 6 }}
              activeDot={{ r: 8, fill: '#1a1a1a', strokeWidth: 2 }}
              name="Total Commission"
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="chart-stats">
        <div className="stat-card">
          <div className="stat-icon total-commission"></div>
          <div className="stat-info">
            <span className="stat-value">LKR {totalCommission.toLocaleString()}</span>
            <span className="stat-label">Total Commission</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon service-commission"></div>
          <div className="stat-info">
            <span className="stat-value">LKR {avgServiceCenter.toLocaleString()}</span>
            <span className="stat-label">Avg. Service Centers</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon parts-commission"></div>
          <div className="stat-info">
            <span className="stat-value">LKR {avgSpareParts.toLocaleString()}</span>
            <span className="stat-label">Avg. Spare Parts</span>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default CommissionChart;