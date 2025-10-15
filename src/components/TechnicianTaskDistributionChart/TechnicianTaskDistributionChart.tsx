import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './TechnicianTaskDistributionChart.scss';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface TechnicianData {
  technicianId: string;
  technicianName: string;
  employeeId: string;
  totalHoursWorked: number;
  inspectionsCompleted: number;
  laborTasksCompleted: number;
  partsInstalled: number;
  totalTasks: number;
}

interface TechnicianTaskDistributionChartProps {
  className?: string;
}

const TechnicianTaskDistributionChart: React.FC<TechnicianTaskDistributionChartProps> = ({ className }) => {
  const [data, setData] = useState<TechnicianData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTechnicianData();
  }, []);

  const fetchTechnicianData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/technicians/performance/monthly', {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setData(result.data);
        } else {
          setError('Failed to fetch technician performance data');
        }
      } else {
        setError('Failed to fetch technician performance data');
      }
    } catch (err) {
      setError('Error fetching technician performance data');
      console.error('Error fetching technician performance data:', err);
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: data.map(item => item.technicianName),
    datasets: [
      {
        label: 'Inspections',
        data: data.map(item => item.inspectionsCompleted),
        backgroundColor: '#3B82F6',
        borderColor: '#3B82F6',
        borderWidth: 1,
        barThickness: 30,
      },
      {
        label: 'Labor Tasks',
        data: data.map(item => item.laborTasksCompleted),
        backgroundColor: '#10B981',
        borderColor: '#10B981',
        borderWidth: 1,
        barThickness: 30,
      },
      {
        label: 'Parts Installed',
        data: data.map(item => item.partsInstalled),
        backgroundColor: '#F59E0B',
        borderColor: '#F59E0B',
        borderWidth: 1,
        barThickness: 30,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        grid: {
          display: false,
        },
        ticks: {
          stepSize: 10,
        },
      },
    },
    elements: {
      bar: {
        borderRadius: 4,
      },
    },
    layout: {
      padding: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10,
      },
    },
  };

  if (loading) {
    return (
      <div className={`technician-task-distribution-chart ${className || ''}`}>
        <div className="chart-header">
          <h3>Task Distribution</h3>
          <p>Last month's task breakdown by technician</p>
        </div>
        <div className="chart-loading">
          <div className="loading-spinner"></div>
          <p>Loading technician data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`technician-task-distribution-chart ${className || ''}`}>
        <div className="chart-header">
          <h3>Task Distribution</h3>
          <p>Last month's task breakdown by technician</p>
        </div>
        <div className="chart-error">
          <p>{error}</p>
          <button onClick={fetchTechnicianData} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`technician-task-distribution-chart ${className || ''}`}>
      <div className="chart-header">
        <h3>Task Distribution</h3>
        <p>Last month's task breakdown by technician</p>
      </div>
      <div className="chart-container">
        <Bar data={chartData} options={options} width="100%" height="100%" />
      </div>
    </div>
  );
};

export default TechnicianTaskDistributionChart;