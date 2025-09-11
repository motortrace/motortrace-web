import React, { useState, useEffect } from 'react';
import Table, { type TableColumn } from '../../components/Table/Table';
import './WorkOrdersPage.scss';
import ManageWorkOrderModal from '../../components/WorkOrderModal/ManageWorkOrderModal';
import { getWorkOrders } from '../../utils/workOrdersApi';
import type { WorkOrder } from '../../utils/workOrdersApi';

const getStatusBadge = (status: string) => {
  const badgeClass = {
    'RECEIVED': 'status-badge status-in-stock',
    'ESTIMATE': 'status-badge status-low-stock',
    'APPROVAL': 'status-badge status-out-of-stock',
    'IN_PROGRESS': 'status-badge status-overstock',
    'WAITING_FOR_PARTS': 'status-badge status-out-of-stock',
    'COMPLETED': 'status-badge status-in-stock',
    'CANCELLED': 'status-badge status-out-of-stock',
  }[status] || 'status-badge';
  const statusText = status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  return <span className={badgeClass}>{statusText}</span>;
};

const WorkOrdersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCustomer, setFilterCustomer] = useState('all');
  const [filterVehicle, setFilterVehicle] = useState('all');
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal state
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(null);

  useEffect(() => {
    setLoading(true);
    getWorkOrders()
      .then((data) => {
        setWorkOrders(Array.isArray(data) ? data : data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to fetch work orders');
        setLoading(false);
      });
  }, []);

  // Unique filter values
  const uniqueCustomers = [...new Set(workOrders.map((w: WorkOrder) => w.customer?.firstName ? `${w.customer.firstName} ${w.customer.lastName}` : w.customerId))];
  const uniqueVehicles = [...new Set(workOrders.map((w: WorkOrder) => w.vehicle?.make ? `${w.vehicle.year} ${w.vehicle.make} ${w.vehicle.model}` : w.vehicleId))];

  // Filtering logic
  const filteredWorkOrders = workOrders.filter((order: WorkOrder) => {
    const customerName = order.customer?.firstName ? `${order.customer.firstName} ${order.customer.lastName}` : order.customerId;
    const vehicleName = order.vehicle?.make ? `${order.vehicle.year} ${order.vehicle.make} ${order.vehicle.model}` : order.vehicleId;
    const title = order.complaint || '';
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicleName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesCustomer = filterCustomer === 'all' || customerName === filterCustomer;
    const matchesVehicle = filterVehicle === 'all' || vehicleName === filterVehicle;
    return matchesSearch && matchesStatus && matchesCustomer && matchesVehicle;
  });

  const handleView = (id: string) => {
    const wo = workOrders.find((w: WorkOrder) => w.id === id) || null;
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
      key: 'workOrderNumber',
      label: 'Work Order',
      sortable: true,
      render: (value: any) => <strong>{String(value)}</strong>
    },
    {
      key: 'complaint',
      label: 'Title',
      sortable: true,
      render: (value: any) => <span>{String(value)}</span>
    },
    {
      key: 'customer',
      label: 'Customer',
      sortable: true,
      render: (_: any, row: WorkOrder) => <span>{row.customer?.firstName ? `${row.customer.firstName} ${row.customer.lastName}` : row.customerId}</span>
    },
    {
      key: 'vehicle',
      label: 'Vehicle',
      sortable: true,
      render: (_: any, row: WorkOrder) => <span>{row.vehicle?.make ? `${row.vehicle.year} ${row.vehicle.make} ${row.vehicle.model}` : row.vehicleId}</span>
    },
    {
      key: 'estimatedTotal',
      label: 'Amount',
      sortable: true,
      align: 'right' as const,
      render: (value: any) => value ? `LKR ${Number(value).toFixed(2)}` : '-'
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      align: 'center' as const,
      render: (status: any) => getStatusBadge(status)
    },
    {
      key: 'serviceAdvisor',
      label: 'Service Advisor',
      render: (_: any, row: WorkOrder) => {
        const advisor = row.serviceAdvisor?.userProfile;
        return advisor ? (
          <span>{advisor.firstName} {advisor.lastName}</span>
        ) : (
          <span style={{ fontSize: 11, color: '#aaa', fontStyle: 'italic' }}>Unknown</span>
        );
      }
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'center' as const,
      render: (_: any, row: WorkOrder) => (
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
    },
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
            <option value="RECEIVED">Received</option>
            <option value="ESTIMATE">Estimate</option>
            <option value="APPROVAL">Approval</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="WAITING_FOR_PARTS">Waiting for Parts</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
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
          <button className="btn btn--ghost" onClick={() => window.location.reload()}>
            <i className='bx bx-refresh'></i>
            Refresh
          </button>
        </div>
      </div>

      <div className="parts-table-container">
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div style={{ color: 'red' }}>{error}</div>
        ) : (
          <Table
            columns={columns}
            data={filteredWorkOrders}
            onRowClick={(order) => handleView(order.id)}
            emptyMessage="No work orders found matching your search criteria."
          />
        )}
      </div>

  <ManageWorkOrderModal open={viewModalOpen} onClose={() => setViewModalOpen(false)} workOrder={selectedWorkOrder} />
    </div>
  );
};

export default WorkOrdersPage; 