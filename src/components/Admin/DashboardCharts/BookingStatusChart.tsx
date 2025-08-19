import React from 'react';
import './BookingStatusChart.scss'

interface BookingData {
  label: string;
  value: number;
  color: string;
}

interface BookingStatusChartProps {
  data?: BookingData[];
  title?: string;
  size?: number;
}

const BookingStatusChart: React.FC<BookingStatusChartProps> = ({
  data = [
    { label: 'Up Coming', value: 85, color: '#3b82f6' },
    { label: 'On Going', value: 45, color: '#f59e0b' },
    { label: 'Completed', value: 388, color: '#10b981' },
    { label: 'Cancelled', value: 18, color: '#ef4444' },
    { label: 'No Show', value: 8, color: '#6b7280' },
  ],
  title = 'Total Bookings by Status',
  size = 487.5
}) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = size / 2 - 40;
  const innerRadius = radius * 0.6;
  const centerX = size / 2;
  const centerY = size / 2;

  const createPath = (startAngle: number, endAngle: number, outerRadius: number, innerRadius: number) => {
    const startAngleRad = (startAngle - 90) * (Math.PI / 180);
    const endAngleRad = (endAngle - 90) * (Math.PI / 180);

    const x1 = centerX + outerRadius * Math.cos(startAngleRad);
    const y1 = centerY + outerRadius * Math.sin(startAngleRad);
    const x2 = centerX + outerRadius * Math.cos(endAngleRad);
    const y2 = centerY + outerRadius * Math.sin(endAngleRad);

    const x3 = centerX + innerRadius * Math.cos(endAngleRad);
    const y3 = centerY + innerRadius * Math.sin(endAngleRad);
    const x4 = centerX + innerRadius * Math.cos(startAngleRad);
    const y4 = centerY + innerRadius * Math.sin(startAngleRad);

    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

    return `M ${x1} ${y1} 
            A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}
            L ${x3} ${y3}
            A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}
            Z`;
  };

  let currentAngle = 0;
  const segments = data.map(item => {
    const angle = (item.value / total) * 360;
    const path = createPath(currentAngle, currentAngle + angle, radius, innerRadius);
    const segment = {
      ...item,
      path,
      percentage: ((item.value / total) * 100).toFixed(1),
      startAngle: currentAngle,
      endAngle: currentAngle + angle
    };
    currentAngle += angle;
    return segment;
  });

  return (
    <div className="booking-status-chart">

      <h2 className="chart-title">{title}</h2>

      <div className="chart-container">
        <div className="chart-wrapper">
          <svg
            width={size}
            height={size}
            className="donut-chart"
            viewBox={`0 0 ${size} ${size}`}
          >
            {segments.map((segment, index) => (
              <g key={index} className="segment-group">
                <path
                  d={segment.path}
                  fill={segment.color}
                  className="segment"
                  data-label={segment.label}
                  data-value={segment.value}
                  data-percentage={segment.percentage}
                />
              </g>
            ))}
           
          </svg>

          <div className="center-content">
            <div className="total-bookings">{total}</div>
            <div className="total-label">Total Bookings</div>
          </div>

          <div className="legend">
            {segments.map((segment, index) => (
              <div key={index} className="legend-item">
                <div
                  className="legend-color"
                  style={{ backgroundColor: segment.color }}
                ></div>
                <span className="legend-label">{segment.label}</span>
                <span className="legend-value">
                  {segment.value} ({segment.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </div>


      </div>
    </div>
  );
};

export default BookingStatusChart;