import React, { useState } from 'react';
import KanbanBoard from '../../components/KanbanBoard/KanbanBoard';
import type { WorkOrder } from '../../types/WorkOrder';

const KanbanPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  // Sample data based on your screenshot
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([
    {
      id: 'EST-1037',
      title: 'ABS System Inspect and 6 more',
      customer: 'Zoe Stewart',
      vehicle: '2020 Toyota Tacoma TRD Sport',
      year: 2020,
      estimateNumber: 'EST-1037',
      amount: 1095.84,
      hours: { left: 0, billed: 0 },
      tags: ['Follow Up'],
      image: '/api/placeholder/280/160',
      status: 'estimates'
    },
    {
      id: 'RO-1002',
      title: 'Premium Oil Change - Full Synthetic and...',
      customer: 'Benjamin Clarke',
      vehicle: '2021 Ford F-150 Lariat',
      year: 2021,
      estimateNumber: 'RO-1002',
      amount: 147.80,
      hours: { left: 0.4, billed: 0.4 },
      tags: ['New Client', 'Friends & Family'],
      image: '/api/placeholder/280/160',
      status: 'approved'
    },
    {
      id: 'RO-1003',
      title: 'Engine Air Filter Element R&R and 2 more',
      customer: 'Subaru Crosstrek Wilderness',
      vehicle: '2024 Subaru Crosstrek Wilderness',
      year: 2024,
      estimateNumber: 'RO-1003',
      amount: 322.09,
      hours: { left: 0.75, billed: 0.92 },
      tags: ['Buy 2 Get 1'],
      image: '/api/placeholder/280/160',
      status: 'in-progress'
    },
    {
      id: 'INV-1005',
      title: 'Spark Plugs R&R',
      customer: 'Bella Evans',
      vehicle: '2015 Toyota 4Runner Trail',
      year: 2015,
      estimateNumber: 'INV-1005',
      amount: 419.24,
      hours: { left: 0, billed: 2 },
      tags: ['Same Day Pick Up'],
      image: '/api/placeholder/280/160',
      status: 'completed'
    },
    {
      id: 'RO-1013',
      title: 'Premium Oil Change - Full Synthetic',
      customer: 'Base',
      vehicle: '2023 Lexus NX350 Base',
      year: 2023,
      estimateNumber: 'RO-1013',
      amount: 0,
      hours: { left: 0, billed: 0 },
      tags: ['Waiting on Approval', 'New Client'],
      image: '/api/placeholder/280/160',
      status: 'estimates'
    },
    {
      id: 'INV-1004',
      title: 'Clutch Assembly R&R and 2 more',
      customer: '',
      vehicle: '',
      year: 0,
      estimateNumber: 'INV-1004',
      amount: 0,
      hours: { left: 0, billed: 0 },
      tags: [],
      image: '/api/placeholder/280/160',
      status: 'completed'
    }
  ]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (filters: string[]) => {
    setSelectedFilters(filters);
  };

  const handleNewEstimate = () => {
    console.log('Create new estimate');
  };

  const handleCardMove = (cardId: string, newStatus: WorkOrder['status']) => {
    setWorkOrders(prev => 
      prev.map(order => 
        order.id === cardId 
          ? { ...order, status: newStatus }
          : order
      )
    );
  };

  return (
    <>
      {/* Page Header - this replaces your DashboardHeader */}
      <div className="page-header">
        <div className="page-title">
          <h1>Workflow</h1>
        </div>
        <div className="page-controls">
          <div className="view-toggles">
            <button className="view-toggle active">
              <span className="icon">⋮⋮</span>
              Columns
            </button>
            <button className="view-toggle">
              <span className="icon">☰</span>
              List
            </button>
            <button className="view-toggle">
              <span className="icon">🌳</span>
              Parts & Trees
            </button>
          </div>
          <div className="search-and-filters">
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="search-input"
            />
            <button className="filters-button">
              Filters
            </button>
          </div>
          <button className="new-estimate-button" onClick={handleNewEstimate}>
            + New Estimate
          </button>
        </div>
      </div>

      {/* Main Kanban Content */}
      <KanbanBoard 
        workOrders={workOrders}
        onCardMove={handleCardMove}
        searchTerm={searchTerm}
        selectedFilters={selectedFilters}
      />
    </>
  );
};

export default KanbanPage;