import React, { useState } from 'react';
import KanbanBoard from '../../components/KanbanBoard/KanbanBoard';
import { FileText, Calendar, Search, Users, Clock, Star, Bookmark, Wrench, Eye, Calendar as CalendarIcon } from 'lucide-react';
import './KanbanPage.scss';

interface ServiceItem {
  id: string;
  type: 'service' | 'inspection' | 'appointment';
  title: string;
  workOrderId: string;
  workOrderNumber: string;
  customer: string;
  vehicle: string;
  estimatedDuration: number; // in hours
  assignedTechnician: string;
  priority: 'high' | 'medium' | 'low';
  status: 'created' | 'to-do' | 'in-progress' | 'done' | 'not-done';
  description?: string;
  notes?: string;
}

const KanbanPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  const [technicianFilter, setTechnicianFilter] = useState<string>('');

  // Sample data for Services, Inspections, and Appointments
  const [serviceItems, setServiceItems] = useState<ServiceItem[]>([
    {
      id: 'SVC-001',
      type: 'service',
      title: 'Brake Pad Replacement',
      workOrderId: 'WO-1001',
      workOrderNumber: 'WO-1001',
      customer: 'John Smith',
      vehicle: '2020 Toyota Camry',
      estimatedDuration: 2.5,
      assignedTechnician: 'Mike Johnson',
      priority: 'high',
      status: 'in-progress',
      description: 'Replace front brake pads and rotors'
    },
    {
      id: 'SVC-002',
      type: 'service',
      title: 'Oil Change & Filter',
      workOrderId: 'WO-1001',
      workOrderNumber: 'WO-1001',
      customer: 'John Smith',
      vehicle: '2020 Toyota Camry',
      estimatedDuration: 1.0,
      assignedTechnician: 'Sarah Lee',
      priority: 'medium',
      status: 'to-do',
      description: 'Full synthetic oil change with filter replacement'
    },
    {
      id: 'INS-001',
      type: 'inspection',
      title: 'Brake System Inspection',
      workOrderId: 'WO-1001',
      workOrderNumber: 'WO-1001',
      customer: 'John Smith',
      vehicle: '2020 Toyota Camry',
      estimatedDuration: 0.5,
      assignedTechnician: 'Mike Johnson',
      priority: 'high',
      status: 'done',
      description: 'Complete brake system safety inspection'
    },
    {
      id: 'APT-001',
      type: 'appointment',
      title: 'Customer Consultation',
      workOrderId: 'WO-1001',
      workOrderNumber: 'WO-1001',
      customer: 'John Smith',
      vehicle: '2020 Toyota Camry',
      estimatedDuration: 0.5,
      assignedTechnician: 'Service Advisor',
      priority: 'medium',
      status: 'created',
      description: 'Discuss repair options and pricing'
    },
    {
      id: 'SVC-003',
      type: 'service',
      title: 'Tire Rotation',
      workOrderId: 'WO-1002',
      workOrderNumber: 'WO-1002',
      customer: 'Emma Wilson',
      vehicle: '2019 Honda CR-V',
      estimatedDuration: 1.0,
      assignedTechnician: 'David Chen',
      priority: 'low',
      status: 'to-do',
      description: 'Rotate all four tires and balance'
    },
    {
      id: 'INS-002',
      type: 'inspection',
      title: 'Pre-Purchase Inspection',
      workOrderId: 'WO-1003',
      workOrderNumber: 'WO-1003',
      customer: 'Alex Brown',
      vehicle: '2018 Ford F-150',
      estimatedDuration: 2.0,
      assignedTechnician: 'Mike Johnson',
      priority: 'high',
      status: 'in-progress',
      description: 'Comprehensive vehicle inspection for purchase'
    },
    {
      id: 'APT-002',
      type: 'appointment',
      title: 'Vehicle Pickup',
      workOrderId: 'WO-1001',
      workOrderNumber: 'WO-1001',
      customer: 'John Smith',
      vehicle: '2020 Toyota Camry',
      estimatedDuration: 0.25,
      assignedTechnician: 'Service Advisor',
      priority: 'medium',
      status: 'not-done',
      description: 'Customer pickup and payment processing'
    },
    {
      id: 'SVC-004',
      type: 'service',
      title: 'Air Filter Replacement',
      workOrderId: 'WO-1002',
      workOrderNumber: 'WO-1002',
      customer: 'Emma Wilson',
      vehicle: '2019 Honda CR-V',
      estimatedDuration: 0.5,
      assignedTechnician: 'Sarah Lee',
      priority: 'low',
      status: 'done',
      description: 'Replace engine air filter'
    }
  ]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (filters: string[]) => {
    setSelectedFilters(filters);
  };

  const handleCardMove = (cardId: string, newStatus: ServiceItem['status']) => {
    setServiceItems(prev => 
      prev.map(item => 
        item.id === cardId 
          ? { ...item, status: newStatus }
          : item
      )
    );
  };

  const getTypeIcon = (type: ServiceItem['type']) => {
    switch (type) {
      case 'service':
        return <Wrench size={16} />;
      case 'inspection':
        return <Eye size={16} />;
      case 'appointment':
        return <CalendarIcon size={16} />;
      default:
        return <FileText size={16} />;
    }
  };

  const getTypeColor = (type: ServiceItem['type']) => {
    switch (type) {
      case 'service':
        return '#3b82f6';
      case 'inspection':
        return '#10b981';
      case 'appointment':
        return '#8b5cf6';
      default:
        return '#6b7280';
    }
  };

  const getPriorityColor = (priority: ServiceItem['priority']) => {
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

  return (
    <>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title">
          <h1></h1>
          <p></p>
        </div>
        <div className="page-controls">
          <div className="search-and-filters">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="filter-buttons">
              <button 
                className={`filter-button ${typeFilter === 'service' ? 'active' : ''}`}
                onClick={() => setTypeFilter(typeFilter === 'service' ? '' : 'service')}
                style={{ borderColor: typeFilter === 'service' ? '#3b82f6' : undefined }}
              >
                <Wrench size={16} />
                <span>Services</span>
              </button>
              
              <button 
                className={`filter-button ${typeFilter === 'inspection' ? 'active' : ''}`}
                onClick={() => setTypeFilter(typeFilter === 'inspection' ? '' : 'inspection')}
                style={{ borderColor: typeFilter === 'inspection' ? '#10b981' : undefined }}
              >
                <Eye size={16} />
                <span>Inspections</span>
              </button>
              
              <button 
                className={`filter-button ${typeFilter === 'appointment' ? 'active' : ''}`}
                onClick={() => setTypeFilter(typeFilter === 'appointment' ? '' : 'appointment')}
                style={{ borderColor: typeFilter === 'appointment' ? '#8b5cf6' : undefined }}
              >
                <CalendarIcon size={16} />
                <span>Appointments</span>
              </button>
              
              <button 
                className={`filter-button ${priorityFilter ? 'active' : ''}`}
                onClick={() => setPriorityFilter(priorityFilter ? '' : 'priority')}
              >
                <Star size={16} />
                <span>Priority</span>
              </button>
              
              <button 
                className={`filter-button ${technicianFilter ? 'active' : ''}`}
                onClick={() => setTechnicianFilter(technicianFilter ? '' : 'technician')}
              >
                <Users size={16} />
                <span>Technician</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Kanban Content */}
      <KanbanBoard 
        serviceItems={serviceItems}
        onCardMove={handleCardMove}
        searchTerm={searchTerm}
        selectedFilters={selectedFilters}
        typeFilter={typeFilter}
        priorityFilter={priorityFilter}
        technicianFilter={technicianFilter}
        getTypeIcon={getTypeIcon}
        getTypeColor={getTypeColor}
        getPriorityColor={getPriorityColor}
      />
    </>
  );
};

export default KanbanPage;