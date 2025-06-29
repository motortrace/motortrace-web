import React from 'react';
import KanbanColumn from '../KanbanColumn/KanbanColumn';
import type { WorkOrder } from '../../types/WorkOrder';
import './KanbanBoard.scss';

interface KanbanBoardProps {
  workOrders: WorkOrder[];
  onCardMove: (cardId: string, newStatus: WorkOrder['status']) => void;
  searchTerm: string;
  selectedFilters: string[];
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  workOrders,
  onCardMove,
  searchTerm,
  selectedFilters
}) => {
  const columns = [
    {
      id: 'opened',
      title: 'Opened',
      color: '#6B7280',
      count: workOrders.filter(order => order.status === 'opened').length
    },
    {
      id: 'estimate-sent',
      title: 'Estimate Sent',
      color: '#F59E0B',
      count: workOrders.filter(order => order.status === 'estimate-sent').length
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      color: '#3B82F6',
      count: workOrders.filter(order => order.status === 'in-progress').length
    },
    {
      id: 'invoiced',
      title: 'Invoiced',
      color: '#8B5CF6',
      count: workOrders.filter(order => order.status === 'invoiced').length
    }
  ];

  const filterWorkOrders = (orders: WorkOrder[], status: WorkOrder['status']) => {
    return orders.filter(order => {
      const matchesStatus = order.status === status;
      const matchesSearch = searchTerm === '' || 
        order.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.estimateNumber.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesStatus && matchesSearch;
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
            workOrders={filterWorkOrders(workOrders, column.id as WorkOrder['status'])}
            onCardMove={onCardMove}
            columnId={column.id as WorkOrder['status']}
          />
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;