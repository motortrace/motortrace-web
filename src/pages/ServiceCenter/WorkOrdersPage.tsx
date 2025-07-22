import React, { useState } from 'react';
import Table, { type TableColumn } from '../../components/Table/Table';
import type { WorkOrder } from '../../types/WorkOrder';
import './WorkOrdersPage.scss';
import ManageWorkOrderModal from '../../components/WorkOrderModal/ManageWorkOrderModal';

const getStatusBadge = (status: WorkOrder['status']) => {
  const badgeClass = {
    'opened': 'status-badge status-in-stock',
    'in-progress': 'status-badge status-low-stock',
    'on-hold': 'status-badge status-out-of-stock',
    'completed': 'status-badge status-overstock',
  }[status];

  const statusText = {
    'opened': 'Opened',
    'in-progress': 'In Progress',
    'on-hold': 'On Hold',
    'completed': 'Completed',
  }[status];

  return <span className={badgeClass}>{statusText}</span>;
};

const WorkOrdersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCustomer, setFilterCustomer] = useState('all');
  const [filterVehicle, setFilterVehicle] = useState('all');

  // Modal state
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(null);

  // Sample work orders data
  const [workOrders] = useState<WorkOrder[]>([
    {
      id: 'WO-001',
      title: 'Brake Pad Replacement',
      customer: 'John Doe',
      vehicle: '2018 Honda Accord',
      year: 2018,
      amount: 245.00,
      hours: { left: 1.5, billed: 2 },
      tags: ['brakes', 'maintenance'],
      status: 'opened',
      assignedPeople: [
        { id: 'T1', name: 'Mike Smith', profilePhoto: 'https://randomuser.me/api/portraits/men/32.jpg' }
      ]
    },
    {
      id: 'WO-002',
      title: 'Oil Change & Inspection',
      customer: 'Jane Smith',
      vehicle: '2020 Toyota Camry',
      year: 2020,
      amount: 89.99,
      hours: { left: 0.5, billed: 1 },
      tags: ['oil', 'inspection'],
      status: 'in-progress',
      assignedPeople: [
        { id: 'T2', name: 'Sara Lee', profilePhoto: 'https://randomuser.me/api/portraits/women/44.jpg' },
        { id: 'T3', name: 'Tom Brown', profilePhoto: 'https://randomuser.me/api/portraits/men/45.jpg' }
      ]
    },
    {
      id: 'WO-003',
      title: 'Battery Replacement',
      customer: 'Carlos Rivera',
      vehicle: '2017 Ford F-150',
      year: 2017,
      amount: 179.50,
      hours: { left: 0, billed: 1 },
      tags: ['battery'],
      status: 'on-hold',
      assignedPeople: []
    },
    {
      id: 'WO-004',
      title: 'Tire Rotation',
      customer: 'Emily Chen',
      vehicle: '2022 Tesla Model 3',
      year: 2022,
      amount: 59.99,
      hours: { left: 0, billed: 0.5 },
      tags: ['tires'],
      status: 'completed',
      assignedPeople: [
        { id: 'T4', name: 'Alex Kim', profilePhoto: 'https://randomuser.me/api/portraits/men/46.jpg' }
      ]
    }
  ]);

  // Unique filter values
  const uniqueCustomers = [...new Set(workOrders.map(w => w.customer))];
  const uniqueVehicles = [...new Set(workOrders.map(w => w.vehicle))];

  // Filtering logic
  const filteredWorkOrders = workOrders.filter(order => {
    const matchesSearch = order.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.vehicle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesCustomer = filterCustomer === 'all' || order.customer === filterCustomer;
    const matchesVehicle = filterVehicle === 'all' || order.vehicle === filterVehicle;
    return matchesSearch && matchesStatus && matchesCustomer && matchesVehicle;
  });

  const handleView = (id: string) => {
    const wo = workOrders.find(w => w.id === id) || null;
    setSelectedWorkOrder(wo);
    setViewModalOpen(true);
  };
  const handleEdit = (id: string) => {
    console.log('Edit work order', id);
  };
  const handleDelete = (id: string) => {
    console.log('Delete work order', id);
  };

  const columns: TableColumn<WorkOrder>[] = [
    {
      key: 'id',
      label: 'Work Order',
      sortable: true,
      render: (value) => <strong>{String(value)}</strong>
    },
    {
      key: 'title',
      label: 'Title',
      sortable: true,
      render: (value, row) => <span>{String(value)}</span>
    },
    {
      key: 'customer',
      label: 'Customer',
      sortable: true,
      render: (value) => <span>{String(value)}</span>
    },
    {
      key: 'vehicle',
      label: 'Vehicle',
      sortable: true,
      render: (value, row) => <span>{String(value)}</span>
    },
    {
      key: 'amount',
      label: 'Amount',
      sortable: true,
      align: 'right',
      render: (value) => `LKR ${Number(value).toFixed(2)}`
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      align: 'center',
      render: (status) => getStatusBadge(status as WorkOrder['status'])
    },
    {
      key: 'assignedPeople',
      label: 'Assigned',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: 4 }}>
          {row.assignedPeople && row.assignedPeople.length > 0 ? (
            row.assignedPeople.slice(0, 2).map(person => (
              <img
                key={person.id}
                src={person.profilePhoto}
                alt={person.name}
                title={person.name}
                style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #fff', boxShadow: '0 1px 2px rgba(0,0,0,0.08)' }}
              />
            ))
          ) : (
            <span style={{ fontSize: 11, color: '#aaa', fontStyle: 'italic' }}>Unassigned</span>
          )}
          {row.assignedPeople && row.assignedPeople.length > 2 && (
            <span style={{ fontSize: 11, color: '#888', marginLeft: 2 }}>+{row.assignedPeople.length - 2}</span>
          )}
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'center',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          <button className="btn-icon" title="View" onClick={e => { e.stopPropagation(); handleView(row.id); }}>
            <i className='bx bx-show'></i>
          </button>
          <button className="btn-icon" title="Edit" onClick={e => { e.stopPropagation(); handleEdit(row.id); }}>
            <i className='bx bx-edit'></i>
          </button>
          <button className="btn-icon btn-danger" title="Delete" onClick={e => { e.stopPropagation(); handleDelete(row.id); }}>
            <i className='bx bx-trash'></i>
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="work-orders-page">
      <div className="page-header">
        <h2 className="page-title"></h2>
        <button className="btn btn--primary" style={{ marginLeft: 'auto' }}>
          <i className='bx bx-plus'></i>
          Create Work Order
        </button>
      </div>

      <div className="inventory-controls">
        <div className="search-filters">
          <div className="search-box">
            <i className='bx bx-search search-icon'></i>
            <input
              type="text"
              placeholder="Search by title, customer, vehicle, or estimate..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Statuses</option>
            <option value="opened">Opened</option>
            <option value="in-progress">In Progress</option>
            <option value="on-hold">On Hold</option>
            <option value="completed">Completed</option>
          </select>
          <select
            value={filterCustomer}
            onChange={(e) => setFilterCustomer(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Customers</option>
            {uniqueCustomers.map(customer => (
              <option key={customer} value={customer}>{customer}</option>
            ))}
          </select>
          <select
            value={filterVehicle}
            onChange={(e) => setFilterVehicle(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Vehicles</option>
            {uniqueVehicles.map(vehicle => (
              <option key={vehicle} value={vehicle}>{vehicle}</option>
            ))}
          </select>
        </div>
        <div className="quick-actions">
          <button className="btn btn--ghost">
            <i className='bx bx-filter'></i>
            Advanced Filters
          </button>
          <button className="btn btn--ghost">
            <i className='bx bx-refresh'></i>
            Refresh
          </button>
        </div>
      </div>

      <div className="parts-table-container">
        <Table
          columns={columns}
          data={filteredWorkOrders}
          onRowClick={(order) => console.log('View work order details:', order.title)}
          emptyMessage="No work orders found matching your search criteria."
        />
      </div>

      <ManageWorkOrderModal open={viewModalOpen} onClose={() => setViewModalOpen(false)} />
    </div>
  );
};

export default WorkOrdersPage; 