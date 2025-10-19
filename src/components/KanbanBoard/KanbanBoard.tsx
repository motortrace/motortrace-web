import React from 'react';
import KanbanColumn from '../KanbanColumn/KanbanColumn';
import './KanbanBoard.scss';
import { type WorkOrder } from '../../utils/workOrdersApi';

interface KanbanColumnDef {
  id: WorkOrder['workflowStep'];
  title: string;
  color: string;
}

interface KanbanBoardProps {
  workOrders: WorkOrder[];
  onCardMove: (cardId: string, newStatus: WorkOrder['workflowStep']) => void;
  searchTerm: string;
  priorityFilter: string;
  technicianFilter: string;
  getTypeIcon: () => React.ReactNode;
  getTypeColor: () => string;
  getPriorityColor: (priority: WorkOrder['priority']) => string;
  columns: KanbanColumnDef[];
  onCardClick?: (workOrder: WorkOrder) => void;
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
  columns,
  onCardClick
}) => {
  const filterWorkOrders = (items: WorkOrder[], workflowStep: WorkOrder['workflowStep']) => {
    return items.filter(item => {
      const matchesStatus = item.workflowStep === workflowStep;
      const customerName = item.customer ? `${item.customer.firstName} ${item.customer.lastName}` : '';
      const vehicleInfo = item.vehicle ? `${item.vehicle.year} ${item.vehicle.make} ${item.vehicle.model}` : '';
      const serviceAdvisorName = item.serviceAdvisor ? `${item.serviceAdvisor.userProfile.firstName} ${item.serviceAdvisor.userProfile.lastName}` : '';
      
      const matchesSearch = searchTerm === '' ||
        item.workOrderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicleInfo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        serviceAdvisorName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPriority = priorityFilter === '' || item.priority === priorityFilter;
      const matchesTechnician = technicianFilter === '' || serviceAdvisorName.toLowerCase().includes(technicianFilter.toLowerCase());
      
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
            count={workOrders.filter(item => item.workflowStep === column.id).length}
            serviceItems={filterWorkOrders(workOrders, column.id)}
            onCardMove={onCardMove}
            columnId={column.id}
            getTypeIcon={getTypeIcon}
            getTypeColor={getTypeColor}
            getPriorityColor={getPriorityColor}
            onCardClick={onCardClick}
          />
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;