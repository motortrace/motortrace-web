import React, { useMemo } from 'react';
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
  // Memoize the search term in lowercase to avoid repeated toLowerCase() calls
  const searchTermLower = useMemo(() => searchTerm.toLowerCase(), [searchTerm]);
  const technicianFilterLower = useMemo(() => technicianFilter.toLowerCase(), [technicianFilter]);

  // Memoize filtered work orders grouped by workflowStep
  const filteredWorkOrdersByStep = useMemo(() => {
    const result: Record<string, WorkOrder[]> = {};
    
    for (const item of workOrders) {
      const customerName = item.customer ? `${item.customer.firstName} ${item.customer.lastName}` : '';
      const vehicleInfo = item.vehicle ? `${item.vehicle.year} ${item.vehicle.make} ${item.vehicle.model}` : '';
      const serviceAdvisorName = item.serviceAdvisor ? `${item.serviceAdvisor.userProfile.firstName} ${item.serviceAdvisor.userProfile.lastName}` : '';
      
      const matchesSearch = searchTermLower === '' ||
        item.workOrderNumber.toLowerCase().includes(searchTermLower) ||
        customerName.toLowerCase().includes(searchTermLower) ||
        vehicleInfo.toLowerCase().includes(searchTermLower) ||
        serviceAdvisorName.toLowerCase().includes(searchTermLower);
      
      const matchesPriority = priorityFilter === '' || item.priority === priorityFilter;
      const matchesTechnician = technicianFilterLower === '' || serviceAdvisorName.toLowerCase().includes(technicianFilterLower);
      
      if (matchesSearch && matchesPriority && matchesTechnician) {
        const step = item.workflowStep;
        if (!result[step]) {
          result[step] = [];
        }
        result[step].push(item);
      }
    }
    
    return result;
  }, [workOrders, searchTermLower, priorityFilter, technicianFilterLower]);

  return (
    <div className="kanban-board">
      <div className="kanban-columns">
        {columns.map((column) => {
          const columnItems = filteredWorkOrdersByStep[column.id] || [];
          return (
            <KanbanColumn
              key={column.id}
              title={column.title}
              color={column.color}
              count={columnItems.length}
              serviceItems={columnItems}
              onCardMove={onCardMove}
              columnId={column.id}
              getTypeIcon={getTypeIcon}
              getTypeColor={getTypeColor}
              getPriorityColor={getPriorityColor}
              onCardClick={onCardClick}
            />
          );
        })}
      </div>
    </div>
  );
};

export default KanbanBoard;