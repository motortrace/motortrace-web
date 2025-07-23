// New file By Jabir

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
import './ServiceFlow.scss';

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

interface ServiceFlowData {
  service: string;
  count: number;
}

interface ServiceFlowProps {
  data?: ServiceFlowData[];
}

const ServiceFlow: React.FC<ServiceFlowProps> = ({ data }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<ChartJS | null>(null);

  const defaultData = [
    { service: 'Oil Change', count: 44 },
    { service: 'Engine Repair', count: 8 },
    { service: 'Tire Replacement', count: 34 },
    { service: 'AC Repair', count: 18 },
    { service: 'Brake Service', count: 24 },
    { service: 'Battery Replace', count: 14 },
    { service: 'Inspection', count: 28 },
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
            labels: chartData.map(item => item.service),
            datasets: [
              {
                label: 'Services Completed',
                data: chartData.map(item => item.count),
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
                    return `${context.dataset.label}: ${context.parsed.y} services`;
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
                  },
                  maxRotation: 45,
                  minRotation: 0
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
                    return (value as number).toString();
                  },
                  stepSize: 5
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
    <div className="service-flow">
      <div className="service-flow__header">
        <h3 className="service-flow__title">No. of Services Done</h3>
        <div className="service-flow__controls">
          <div className="service-flow__legend">
            <div className="service-flow__legend-item">
              <span className="service-flow__legend-dot service-flow__legend-dot--services"></span>
              <span>Services Completed</span>
            </div>
          </div>
          <div className="service-flow__filters">
            <select className="service-flow__select">
              <option>All Mechanics</option>
              <option>L. Arun</option>
              <option>J. Nuwan</option>
              <option>T. Silva</option>
            </select>
            <select className="service-flow__select">
              <option>This Week</option>
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Year</option>
            </select>
          </div>
        </div>
      </div>

      <div className="service-flow__chart">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default ServiceFlow;