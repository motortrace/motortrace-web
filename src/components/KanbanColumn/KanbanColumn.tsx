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
  // Helper function to get light background color for column labels
  const getColumnBackgroundColor = (badgeColor: string) => {
    const colorMap: { [key: string]: string } = {
      '#6B7280': '#F3F4F6', // Gray - light gray background
      '#f59e0b': '#FFF8E1', // Amber - light yellow background
      '#10B981': '#E8F5E9', // Green - light green background
      '#3B82F6': '#E3F2FD', // Blue - light blue background
      '#8b5cf6': '#F3E5F5', // Purple - light purple background
      '#059669': '#E8F5E9', // Emerald - light green background
    };
    return colorMap[badgeColor] || '#F3F4F6'; // Default to light gray
  };

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
        <div className="column-label" style={{ backgroundColor: getColumnBackgroundColor(color) }}>
          <span className="column-title">{title}</span>
          <span className="column-count" style={{ backgroundColor: color }}>{count}</span>
        </div>
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