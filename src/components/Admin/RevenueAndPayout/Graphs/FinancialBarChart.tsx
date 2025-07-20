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
import './FinancialBarChart.scss';

interface DataPoint {
  month: string;
  advancePayments: number;
  commissions: number;
  payouts: number;
}

interface FinancialBarChartProps {
  data: DataPoint[];
}

const FinancialBarChart: React.FC<FinancialBarChartProps> = ({ data }) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const formatCurrency = (value: number): string => {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'LKR',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(value);
      };

      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="tooltip-item" style={{ color: entry.color }}>
              {`${entry.name}: ${formatCurrency(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Calculate totals for stats
  const totalAdvancePayments = data.reduce((sum, item) => sum + item.advancePayments, 0);
  const totalCommissions = data.reduce((sum, item) => sum + item.commissions, 0);
  const totalPayouts = data.reduce((sum, item) => sum + item.payouts, 0);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="financial-bar-chart">
      <div className="chart-header">
        <h2 className="chart-title">Booking Payment Flow Analysis</h2>
        <p className="chart-subtitle">Advanced payments received, commissions earned, and payouts processed past 6 months</p>
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
              tickFormatter={(value) => `${(value / 1000)}K`}
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
              dataKey="advancePayments"
              fill="#1a1a1a"
              name="Advance Payments"
              radius={[4, 4, 0, 0]}
            />
            
            <Bar
              dataKey="commissions"
              fill="#666666"
              name="Commissions"
              radius={[4, 4, 0, 0]}
            />
            
            <Bar
              dataKey="payouts"
              fill="#999999"
              name="Payouts"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="chart-stats">
        <div className="stat-card">
          <div className="stat-icon advance-payments"></div>
          <div className="stat-info">
            <span className="stat-value">{formatCurrency(totalAdvancePayments)}</span>
            <span className="stat-label">Total Advance Payments</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon commissions"></div>
          <div className="stat-info">
            <span className="stat-value">{formatCurrency(totalCommissions)}</span>
            <span className="stat-label">Total Commissions</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon payouts"></div>
          <div className="stat-info">
            <span className="stat-value">{formatCurrency(totalPayouts)}</span>
            <span className="stat-label">Total Payouts</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialBarChart;