import React, { useState, useEffect } from 'react';
import './ServiceCategoriesChart.scss';

interface CategoryData {
  category: string;
  serviceCount: number;
  totalRevenue: number;
}

interface ServiceCategoriesChartProps {
  className?: string;
}

const ServiceCategoriesChart: React.FC<ServiceCategoriesChartProps> = ({ className }) => {
  const [data, setData] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Blue-based color palette close to #3B82F6
  const blueColorPalette = [
    '#3B82F6', // Base blue
    '#60A5FA', // Lighter blue
    '#93C5FD', // Very light blue
    '#1D4ED8', // Darker blue
    '#2563EB', // Medium blue
    '#7C3AED', // Blue-purple
    '#06B6D4', // Cyan-blue
    '#0891B2', // Dark cyan
  ];

  useEffect(() => {
    fetchCategoriesData();
  }, []);

  const fetchCategoriesData = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/canned-services/analytics/categories', {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setData(result.data);
        } else {
          setError('Failed to fetch categories data');
        }
      } else {
        setError('Failed to fetch categories data');
      }
    } catch (err) {
      setError('Error fetching categories data');
      console.error('Error fetching categories data:', err);
    } finally {
      setLoading(false);
    }
  };

  const maxServiceCount = Math.max(...data.map(item => item.serviceCount), 1);

  if (loading) {
    return (
      <div className={`service-categories-chart ${className || ''}`}>
        <div className="chart-header">
          <h3>Service Categories</h3>
          <p>Distribution of services by category</p>
        </div>
        <div className="chart-loading">
          <div className="loading-spinner"></div>
          <p>Loading categories data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`service-categories-chart ${className || ''}`}>
        <div className="chart-header">
          <h3>Service Categories</h3>
          <p>Distribution of services by category</p>
        </div>
        <div className="chart-error">
          <p>{error}</p>
          <button onClick={fetchCategoriesData} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`service-categories-chart ${className || ''}`}>
      <div className="chart-header">
        <h3>Service Categories</h3>
        <p>Distribution of services by category</p>
      </div>

      <div className="chart-content">
        <div className="categories-list">
          {data.map((item, index) => (
            <div key={item.category} className="category-item">
              <div className="category-info">
                <div className="category-name">{item.category}</div>
                <div className="category-stats">
                  <span className="service-count">{item.serviceCount} services</span>
                </div>
              </div>
              <div className="category-bar">
                <div
                  className="bar-fill"
                  style={{
                    width: `${(item.serviceCount / maxServiceCount) * 100}%`,
                    backgroundColor: blueColorPalette[index % blueColorPalette.length]
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        <div className="chart-summary">
          <div className="summary-item">
            <span className="label">Total Categories:</span>
            <span className="value">{data.length}</span>
          </div>
          <div className="summary-item">
            <span className="label">Total Services:</span>
            <span className="value">{data.reduce((sum, item) => sum + item.serviceCount, 0)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCategoriesChart;