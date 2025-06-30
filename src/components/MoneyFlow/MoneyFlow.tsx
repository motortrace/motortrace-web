import React, { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  BarController
} from 'chart.js';
import './MoneyFlow.scss';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend
);

interface MoneyFlowData {
  month: string;
  income: number;
  expense: number;
}

interface MoneyFlowProps {
  data?: MoneyFlowData[];
}

const MoneyFlow: React.FC<MoneyFlowProps> = ({ data }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<ChartJS | null>(null);

  const defaultData = [
    { month: 'Jan', income: 10000, expense: 8000 },
    { month: 'Feb', income: 12000, expense: 9000 },
    { month: 'Mar', income: 11000, expense: 8500 },
    { month: 'Apr', income: 13000, expense: 10000 },
    { month: 'May', income: 12500, expense: 9500 },
    { month: 'Jun', income: 8000, expense: 6000 },
    { month: 'Jul', income: 9000, expense: 7000 },
  ];

  const chartData = data || defaultData;

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        // Destroy existing chart if it exists
        if (chartInstance.current) {
          chartInstance.current.destroy();
          chartInstance.current = null;
        }

        chartInstance.current = new ChartJS(ctx, {
          type: 'bar',
          data: {
            labels: chartData.map(item => item.month),
            datasets: [
              {
                label: 'Income',
                data: chartData.map(item => item.income),
                backgroundColor: '#313133',
                borderColor: '#2563eb',
                borderWidth: 0,
                borderRadius: {
                  topLeft: 20,
                  topRight: 20,
                },
                borderSkipped: false,
                categoryPercentage: 0.8,
                barPercentage: 0.6,
              },
              {
                label: 'Expense',
                data: chartData.map(item => item.expense),
                backgroundColor: '#81818D',
                borderColor: '#93c5fd',
                borderWidth: 0,
                borderRadius: {
                  topLeft: 20,
                  topRight: 20,
                },
                borderSkipped: false,
                categoryPercentage: 0.8,
                barPercentage: 0.6,
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false, // We'll use custom legend
              },
              tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: '#374151',
                borderWidth: 1,
                callbacks: {
                  label: function(context) {
                    return `${context.dataset.label}: $${context.parsed.y.toLocaleString()}`;
                  }
                }
              }
            },
            scales: {
              x: {
                grid: {
                  display: false,
                },
                ticks: {
                  color: '#9ca3af',
                  font: {
                    size: 10
                  }
                }
              },
              y: {
                beginAtZero: true,
                grid: {
                  color: '#f3f4f6',
                },
                ticks: {
                  color: '#9ca3af',
                  font: {
                    size: 10
                  },
                  callback: function(value) {
                    return 'Rs. ' + (value as number).toLocaleString();
                  }
                }
              }
            },
            interaction: {
              intersect: false,
              mode: 'index'
            }
          }
        });
      }
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [chartData]);

  return (
    <div className="money-flow">
      <div className="money-flow__header">
        <h3 className="money-flow__title">Money flow</h3>
        <div className="money-flow__controls">
          <div className="money-flow__legend">
            <div className="money-flow__legend-item">
              <span className="money-flow__legend-dot money-flow__legend-dot--income"></span>
              <span>Income</span>
            </div>
            <div className="money-flow__legend-item">
              <span className="money-flow__legend-dot money-flow__legend-dot--expense"></span>
              <span>Expense</span>
            </div>
          </div>
          <div className="money-flow__filters">
            <select className="money-flow__select">
              <option>All accounts</option>
              <option>Checking</option>
              <option>Savings</option>
              <option>Credit Card</option>
            </select>
            <select className="money-flow__select">
              <option>This year</option>
              <option>This month</option>
              <option>Last 6 months</option>
              <option>Last year</option>
            </select>
          </div>
        </div>
      </div>

      <div className="money-flow__chart">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default MoneyFlow;