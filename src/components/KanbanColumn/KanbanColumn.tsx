import React from 'react';
import ServiceItemCard from '../ServiceItemCard/ServiceItemCard';
import './KanbanColumn.scss';
import { type WorkOrder } from '../../utils/workOrdersApi';

interface KanbanColumnProps {
  title: string;
  color: string;
  count: number;
  serviceItems: WorkOrder[];
  onCardMove: (cardId: string, newStatus: WorkOrder['status']) => void;
  columnId: WorkOrder['status'];
  getTypeIcon: () => React.ReactNode;
  getTypeColor: () => string;
  getPriorityColor: (priority: WorkOrder['priority']) => string;
  onCardClick?: (serviceItem: WorkOrder) => void; // Add this line
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  title,
  color,
  count,
  serviceItems,
  onCardMove,
  columnId,
  getTypeIcon,
  getTypeColor,
  getPriorityColor,
  onCardClick // Add this line
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
        {serviceItems.map((serviceItem) => (
          <ServiceItemCard
            key={serviceItem.id}
            serviceItem={serviceItem}
            onMove={onCardMove}
            getTypeIcon={getTypeIcon}
            getTypeColor={getTypeColor}
            getPriorityColor={getPriorityColor}
            onClick={onCardClick ? () => onCardClick(serviceItem) : undefined} // Add this line
          />
        ))}
        
        {serviceItems.length === 0 && (
          <div className="empty-column">
            <p>No items in this column</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;