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
      </div>
    </div>
  );
};

export default WorkOrderCard;