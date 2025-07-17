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
import './CommissionBarChart.scss';

interface CommissionDataPoint {
  month: string;
  serviceCenters: number;
  sparePartsSellers: number;
  total: number;
}

interface CommissionBarChartProps {
  data: CommissionDataPoint[];
}

const CommissionBarChart: React.FC<CommissionBarChartProps> = ({ data }) => {
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
    <div className="commission-bar-chart">
      <div className="chart-header">
        <h2 className="chart-title">Monthly Commission Breakdown</h2>
        <p className="chart-subtitle">Commission Distribution by Partner Type - Past 6 Months</p>
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
            
            <Bar
              dataKey="serviceCenters"
              fill="#1a1a1a"
              name="Service Centers"
              radius={[4, 4, 0, 0]}
            />
            
            <Bar
              dataKey="sparePartsSellers"
              fill="#666666"
              name="Spare Parts Sellers"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
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

export default CommissionBarChart;