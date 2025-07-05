import React from 'react';
import KanbanColumn from '../KanbanColumn/KanbanColumn';
import './KanbanBoard.scss';

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

interface KanbanBoardProps {
  serviceItems: ServiceItem[];
  onCardMove: (cardId: string, newStatus: ServiceItem['status']) => void;
  searchTerm: string;
  selectedFilters: string[];
  typeFilter: string;
  priorityFilter: string;
  technicianFilter: string;
  getTypeIcon: (type: ServiceItem['type']) => React.ReactNode;
  getTypeColor: (type: ServiceItem['type']) => string;
  getPriorityColor: (priority: ServiceItem['priority']) => string;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  serviceItems,
  onCardMove,
  searchTerm,
  selectedFilters,
  typeFilter,
  priorityFilter,
  technicianFilter,
  getTypeIcon,
  getTypeColor,
  getPriorityColor
}) => {
  const columns = [
    {
      id: 'created',
      title: 'Created',
      color: '#6B7280',
      count: serviceItems.filter(item => item.status === 'created').length
    },
    {
      id: 'to-do',
      title: 'To Do',
      color: '#F59E0B',
      count: serviceItems.filter(item => item.status === 'to-do').length
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      color: '#3B82F6',
      count: serviceItems.filter(item => item.status === 'in-progress').length
    },
    {
      id: 'done',
      title: 'Done',
      color: '#10B981',
      count: serviceItems.filter(item => item.status === 'done').length
    },
    {
      id: 'not-done',
      title: 'Not Done',
      color: '#EF4444',
      count: serviceItems.filter(item => item.status === 'not-done').length
    }
  ];

  const filterServiceItems = (items: ServiceItem[], status: ServiceItem['status']) => {
    return items.filter(item => {
      const matchesStatus = item.status === status;
      const matchesSearch = searchTerm === '' || 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.workOrderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.assignedTechnician.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = typeFilter === '' || item.type === typeFilter;
      const matchesPriority = priorityFilter === '' || item.priority === priorityFilter;
      const matchesTechnician = technicianFilter === '' || item.assignedTechnician.toLowerCase().includes(technicianFilter.toLowerCase());
      
      return matchesStatus && matchesSearch && matchesType && matchesPriority && matchesTechnician;
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
            count={column.count}
            serviceItems={filterServiceItems(serviceItems, column.id as ServiceItem['status'])}
            onCardMove={onCardMove}
            columnId={column.id as ServiceItem['status']}
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