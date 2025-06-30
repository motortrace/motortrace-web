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
      id: 'estimates',
      title: 'Estimates',
      color: '#6B7280',
      count: workOrders.filter(order => order.status === 'estimates').length
    },
    {
      id: 'approved',
      title: 'Approved Work',
      color: '#10B981',
      count: workOrders.filter(order => order.status === 'approved').length
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      color: '#3B82F6',
      count: workOrders.filter(order => order.status === 'in-progress').length
    },
    {
      id: 'completed',
      title: 'Completed Work - Invoices',
      color: '#10B981',
      count: workOrders.filter(order => order.status === 'completed').length
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