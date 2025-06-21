import React from 'react';
import WorkOrderCard from '../WorkOrderCard/WorkOrderCard';
import type { WorkOrder } from '../../types/WorkOrder';
import './KanbanColumn.scss';

interface KanbanColumnProps {
  title: string;
  color: string;
  count: number;
  workOrders: WorkOrder[];
  onCardMove: (cardId: string, newStatus: WorkOrder['status']) => void;
  columnId: WorkOrder['status'];
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  title,
  color,
  count,
  workOrders,
  onCardMove,
  columnId
}) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData('text/plain');
    onCardMove(cardId, columnId);
  };

  return (
    <div className="kanban-column">
      <div className="column-header">
        <div className="column-title-row">
          <div className="column-indicator" style={{ backgroundColor: color }}></div>
          <h3 className="column-title">{title}</h3>
          <span className="column-count">{count}</span>
        </div>
        <button className="column-menu-button">
          <span>⋯</span>
        </button>
      </div>
      
      <div 
        className="column-content"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {workOrders.map((workOrder) => (
          <WorkOrderCard
            key={workOrder.id}
            workOrder={workOrder}
            onMove={onCardMove}
          />
        ))}
        
        {workOrders.length === 0 && (
          <div className="empty-column">
            <p>No items in this column</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;