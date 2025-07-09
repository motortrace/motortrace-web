import React from 'react';
import ServiceItemCard from '../ServiceItemCard/ServiceItemCard';
import './KanbanColumn.scss';

interface ServiceItem {
  id: string;
  type: 'service' | 'inspection' | 'appointment';
  title: string;
  workOrderId: string;
  workOrderNumber: string;
  customer: string;
  vehicle: string;
  estimatedDuration: number;
  assignedTechnician: string;
  priority: 'high' | 'medium' | 'low';
  status: 'created' | 'to-do' | 'in-progress' | 'done' | 'not-done';
  description?: string;
  notes?: string;
}

interface KanbanColumnProps {
  title: string;
  color: string;
  count: number;
  serviceItems: ServiceItem[];
  onCardMove: (cardId: string, newStatus: ServiceItem['status']) => void;
  columnId: ServiceItem['status'];
  getTypeIcon: (type: ServiceItem['type']) => React.ReactNode;
  getTypeColor: (type: ServiceItem['type']) => string;
  getPriorityColor: (priority: ServiceItem['priority']) => string;
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
  getPriorityColor
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