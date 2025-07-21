import React, { useState } from 'react';
import KanbanBoard from '../../components/KanbanBoard/KanbanBoard';
import { Users, Car, ClipboardList, Wrench, Eye, FileText, AlertCircle, CheckCircle2, Circle, Calendar as CalendarIcon, DollarSign, PackageSearch } from 'lucide-react';
import './KanbanPage.scss';

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

const KanbanPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  const [technicianFilter, setTechnicianFilter] = useState<string>('');

  // Sample data for Work Orders
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([
    {
      id: 'WO-1001',
      workOrderNumber: 'WO-1001',
      customer: 'John Smith',
      vehicle: '2020 Toyota Camry',
      assignedTechnician: 'Mike Johnson',
      status: 'created',
      description: 'Brake pad replacement and oil change',
      priority: 'high',
    },
    {
      id: 'WO-1002',
      workOrderNumber: 'WO-1002',
      customer: 'Emma Wilson',
      vehicle: '2019 Honda CR-V',
      assignedTechnician: 'Sarah Lee',
      status: 'inspection',
      description: 'Tire rotation and air filter replacement',
      priority: 'medium',
    },
    {
      id: 'WO-1003',
      workOrderNumber: 'WO-1003',
      customer: 'Alex Brown',
      vehicle: '2018 Ford F-150',
      assignedTechnician: 'David Chen',
      status: 'estimation',
      description: 'Pre-purchase inspection',
      priority: 'high',
    },
    {
      id: 'WO-1004',
      workOrderNumber: 'WO-1004',
      customer: 'Linda Green',
      vehicle: '2021 Nissan Altima',
      assignedTechnician: 'Mike Johnson',
      status: 'in-progress',
      description: 'Engine diagnostics',
      priority: 'medium',
    },
    {
      id: 'WO-1005',
      workOrderNumber: 'WO-1005',
      customer: 'Chris Evans',
      vehicle: '2017 BMW X5',
      assignedTechnician: 'Sarah Lee',
      status: 'waiting-for-parts',
      description: 'Suspension repair',
      priority: 'high',
    },
    {
      id: 'WO-1006',
      workOrderNumber: 'WO-1006',
      customer: 'Sophia Turner',
      vehicle: '2016 Audi A4',
      assignedTechnician: 'David Chen',
      status: 'invoice',
      description: 'Invoice for completed work',
      priority: 'low',
    },
  ]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleCardMove = (cardId: string, newStatus: WorkOrder['status']) => {
    setWorkOrders(prev =>
      prev.map(item =>
        item.id === cardId
          ? { ...item, status: newStatus }
          : item
      )
    );
  };

  // Icon/color helpers for work order (optional, can be customized)
  const getTypeIcon = () => <ClipboardList size={16} />;
  const getTypeColor = () => '#3b82f6';
  const getPriorityColor = (priority: WorkOrder['priority']) => {
    switch (priority) {
      case 'high':
        return '#ef4444';
      case 'medium':
        return '#f59e0b';
      case 'low':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  // Kanban columns for work order stages
  const columns = [
    { id: 'created', title: 'Created', color: '#6B7280' },
    { id: 'inspection', title: 'Inspection', color: '#10B981' },
    { id: 'estimation', title: 'Estimation', color: '#f59e0b' },
    { id: 'in-progress', title: 'In Progress', color: '#3B82F6' },
    { id: 'waiting-for-parts', title: 'Waiting for Parts', color: '#8b5cf6' },
    { id: 'invoice', title: 'Invoice', color: '#ef4444' },
  ];

  return (
    <>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-controls">
          <div className="search-and-filters">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search work orders..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="search-input"
              />
            </div>
            {/* You can add more filters here if needed */}
          </div>
        </div>
      </div>

      {/* Main Kanban Content */}
      <KanbanBoard
        workOrders={workOrders}
        onCardMove={handleCardMove}
        searchTerm={searchTerm}
        priorityFilter={priorityFilter}
        technicianFilter={technicianFilter}
        getTypeIcon={getTypeIcon}
        getTypeColor={getTypeColor}
        getPriorityColor={getPriorityColor}
        columns={columns}
      />
    </>
  );
};

export default KanbanPage;