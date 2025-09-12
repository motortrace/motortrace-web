import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import './DailyCustomersLineChart.scss';

interface DailyCustomerData {
  date: string;
  customers: number;
}

interface DailyCustomersLineChartProps {
  data: DailyCustomerData[];
}

const DailyCustomersLineChart: React.FC<DailyCustomersLineChartProps> = ({ data }) => {
  // Transform data for Recharts
  const chartData = data.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    customers: item.customers,
    fullDate: item.date
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="daily-customers-line-chart__tooltip">
          <p className="daily-customers-line-chart__tooltip-label">{label}</p>
          <p className="daily-customers-line-chart__tooltip-value">
            <span className="daily-customers-line-chart__tooltip-dot" />
            Customers: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  const averageCustomers = Math.round(data.reduce((sum, d) => sum + d.customers, 0) / data.length);
  const maxCustomers = Math.max(...data.map(d => d.customers));
  const totalCustomers = data.reduce((sum, d) => sum + d.customers, 0);

  return (
    <div className="daily-customers-line-chart">
      <div className="daily-customers-line-chart__header">
        <h3 className="daily-customers-line-chart__title">Daily Customers</h3>
        <div className="daily-customers-line-chart__period">
          Last 7 Days
        </div>
      </div>

      <div className="daily-customers-line-chart__content">
        <div className="daily-customers-line-chart__chart">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <defs>
                <linearGradient id="colorCustomers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                domain={['dataMin - 2', 'dataMax + 2']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="customers"
                stroke="#3b82f6"
                strokeWidth={3}
                fill="url(#colorCustomers)"
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Stats */}
        <div className="daily-customers-line-chart__stats">
          <div className="daily-customers-line-chart__stat">
            <div className="daily-customers-line-chart__stat-value">
              {averageCustomers}
            </div>
            <div className="daily-customers-line-chart__stat-label">Avg Daily</div>
          </div>
          <div className="daily-customers-line-chart__stat">
            <div className="daily-customers-line-chart__stat-value">
              {maxCustomers}
            </div>
            <div className="daily-customers-line-chart__stat-label">Peak</div>
          </div>
          <div className="daily-customers-line-chart__stat">
            <div className="daily-customers-line-chart__stat-value">
              {totalCustomers}
            </div>
            <div className="daily-customers-line-chart__stat-label">Total</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyCustomersLineChart;
