import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import './TechnicianWorkingStatusChart.scss';

ChartJS.register(ArcElement, Tooltip, Legend);

interface WorkingStatusData {
  totalTechnicians: number;
  currentlyWorking: number;
  notWorking: number;
}

interface TechnicianWorkingStatusChartProps {
  className?: string;
}

const TechnicianWorkingStatusChart: React.FC<TechnicianWorkingStatusChartProps> = ({ className }) => {
  const [data, setData] = useState<WorkingStatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWorkingStatus();
  }, []);

  const fetchWorkingStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/technicians/working-status', {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setData(result.data);
        } else {
          setError('Failed to fetch technician working status data');
        }
      } else {
        setError('Failed to fetch technician working status data');
      }
    } catch (err) {
      setError('Error fetching technician working status data');
      console.error('Error fetching technician working status data:', err);
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: ['Currently Working', 'Not Working'],
    datasets: [
      {
        data: data ? [data.currentlyWorking, data.notWorking] : [],
        backgroundColor: ['#2563EB', '#E5E7EB'],
        borderColor: ['#2563EB', '#E5E7EB'],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '60%',
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  if (loading) {
    return (
      <div className={`technician-working-status-chart ${className || ''}`}>
        <div className="chart-header">
          <h3>Working Status</h3>
          <p>Current technician availability</p>
        </div>
        <div className="chart-loading">
          <div className="loading-spinner"></div>
          <p>Loading status data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`technician-working-status-chart ${className || ''}`}>
        <div className="chart-header">
          <h3>Working Status</h3>
          <p>Current technician availability</p>
        </div>
        <div className="chart-error">
          <p>{error}</p>
          <button onClick={fetchWorkingStatus} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`technician-working-status-chart ${className || ''}`}>
      <div className="chart-header">
        <h3>Working Status</h3>
        <p>Current technician availability</p>
      </div>
      <div className="chart-container">
        <Doughnut data={chartData} options={options} />
      </div>
      {data && (
        <div className="chart-summary">
          <div className="summary-item">
            <span className="label">Total Technicians:</span>
            <span className="value">{data.totalTechnicians}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechnicianWorkingStatusChart;