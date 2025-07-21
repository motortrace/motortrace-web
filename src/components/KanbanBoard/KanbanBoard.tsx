import React from 'react';
import KanbanColumn from '../KanbanColumn/KanbanColumn';
import './KanbanBoard.scss';

interface WorkOrder {
  id: string;
  workOrderNumber: string;
  customer: string;
  vehicle: string;
  assignedTechnician: string;
  status: 'created' | 'inspection' | 'estimation' | 'in-progress' | 'waiting-for-parts' | 'invoice';
  description?: string;
  priority: 'high' | 'medium' | 'low';
}

interface KanbanColumnDef {
  id: WorkOrder['status'];
  title: string;
  color: string;
}

interface KanbanBoardProps {
  workOrders: WorkOrder[];
  onCardMove: (cardId: string, newStatus: WorkOrder['status']) => void;
  searchTerm: string;
  priorityFilter: string;
  technicianFilter: string;
  getTypeIcon: () => React.ReactNode;
  getTypeColor: () => string;
  getPriorityColor: (priority: WorkOrder['priority']) => string;
  columns: KanbanColumnDef[];
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  workOrders,
  onCardMove,
  searchTerm,
  priorityFilter,
  technicianFilter,
  getTypeIcon,
  getTypeColor,
  getPriorityColor,
  columns
}) => {
  const filterWorkOrders = (items: WorkOrder[], status: WorkOrder['status']) => {
    return items.filter(item => {
      const matchesStatus = item.status === status;
      const matchesSearch = searchTerm === '' ||
        item.workOrderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.assignedTechnician.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPriority = priorityFilter === '' || item.priority === priorityFilter;
      const matchesTechnician = technicianFilter === '' || item.assignedTechnician.toLowerCase().includes(technicianFilter.toLowerCase());
      return matchesStatus && matchesSearch && matchesPriority && matchesTechnician;
    });
  };

  return (
    <div className="kanban-board">
      <div className="kanban-columns">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            title={column.title}
            color={column.color}
            count={workOrders.filter(item => item.status === column.id).length}
            serviceItems={filterWorkOrders(workOrders, column.id)}
            onCardMove={onCardMove}
            columnId={column.id}
            getTypeIcon={getTypeIcon}
            getTypeColor={getTypeColor}
            getPriorityColor={getPriorityColor}
          />
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;