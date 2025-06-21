import React from 'react';
import type { WorkOrder } from '../../types/WorkOrder';
import './WorkOrderCard.scss';

interface WorkOrderCardProps {
  workOrder: WorkOrder;
  onMove: (cardId: string, newStatus: WorkOrder['status']) => void;
}

const WorkOrderCard: React.FC<WorkOrderCardProps> = ({ workOrder, onMove }) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', workOrder.id);
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getTagColor = (tag: string) => {
    const tagColors: { [key: string]: string } = {
      'Follow Up': '#EF4444',
      'New Client': '#F59E0B',
      'Friends & Family': '#EC4899',
      'Buy 2 Get 1': '#3B82F6',
      'Waiting on Approval': '#10B981',
      'Same Day Pick Up': '#8B5CF6'
    };
    return tagColors[tag] || '#6B7280';
  };

  const getProgressColor = () => {
    const { left, billed } = workOrder.hours;
    const total = left + billed;
    if (total === 0) return '#E5E7EB';
    const percentage = (billed / total) * 100;
    if (percentage === 100) return '#10B981';
    if (percentage >= 50) return '#F59E0B';
    return '#3B82F6';
  };

  const getProgressPercentage = () => {
    const { left, billed } = workOrder.hours;
    const total = left + billed;
    if (total === 0) return 0;
    return (billed / total) * 100;
  };

  return (
    <div 
      className="work-order-card"
      draggable
      onDragStart={handleDragStart}
    >
      <div className="card-header">
        <span className="estimate-number">{workOrder.estimateNumber}</span>
        <button className="card-menu">⋯</button>
      </div>

      {workOrder.image && (
        <div className="card-image">
          <img src={workOrder.image} alt="Vehicle" />
        </div>
      )}

      <div className="card-content">
        <h4 className="work-title">{workOrder.title}</h4>
        
        {workOrder.tags.length > 0 && (
          <div className="tags">
            {workOrder.tags.map((tag, index) => (
              <span 
                key={index} 
                className="tag"
                style={{ backgroundColor: getTagColor(tag) }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="customer-info">
          <div className="customer-avatar">
            <span>{workOrder.customer.charAt(0)}</span>
          </div>
          <div className="customer-details">
            <p className="customer-name">{workOrder.customer}</p>
            <p className="vehicle-info">
              {workOrder.year} {workOrder.vehicle}
            </p>
          </div>
        </div>

        {(workOrder.hours.left > 0 || workOrder.hours.billed > 0) && (
          <div className="hours-info">
            <div className="hours-text">
              <span className="hours-left">{workOrder.hours.left} hrs left</span>
              <span className="hours-divider">/</span>
              <span className="hours-billed">{workOrder.hours.billed} hrs billed</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ 
                  width: `${getProgressPercentage()}%`,
                  backgroundColor: getProgressColor()
                }}
              ></div>
            </div>
          </div>
        )}

        <div className="card-footer">
          <div className="action-buttons">
            <button className="action-btn comment">💬</button>
            <button className="action-btn attach">📎</button>
            <button className="action-btn menu">📋</button>
          </div>
          <div className="amount">
            <span className="amount-value">{formatAmount(workOrder.amount)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkOrderCard;