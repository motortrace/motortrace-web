// src/pages/WorkOrders/WorkOrdersPage.tsx
import { useState, useEffect } from 'react';
import Table, { type TableColumn } from '../../components/Table/Table';

import type { WorkOrder } from '../../types/WorkOrderTypes/WorkOrder';
import ManageWorkOrderModal from '../../components/WorkOrderModal/ManageWorkOrderModal';
// import ManageWorkOrderModal from '../../components/WorkOrder/ManageWorkOrder/ManageWorkOrderModal';
import CreateWorkOrderModal from '../../components/WorkOrder/CreateWorkOrder/CreateWorkOrderModal';
import EditWorkOrderModal from '../../components/WorkOrder/EditWorkOrder/EditWorkOrderModal';
import { workOrderService } from '../../services/workOrderService';
import { toastService } from '../../services/toastService';
import './WorkOrdersPage.scss';

// Helper function to create frontend-compatible work order object
const mapWorkOrderToFrontend = (workOrder: any): WorkOrder => {
  return {
    ...workOrder,
    title: workOrder.complaint || 'No title',
    // Keep the backend status as-is
    status: workOrder.status, // 'PENDING', 'IN_PROGRESS', etc.
    amount: workOrder.totalAmount || workOrder.estimatedTotal || 0,
    assignedPeople: workOrder.technicianId ? [
      {
        id: workOrder.technicianId,
        name: workOrder.technician?.userProfile?.name || 'Unknown Technician',
        profilePhoto: 'https://randomuser.me/api/portraits/men/32.jpg'
      }
    ] : [],
  };
};

// Update getStatusBadge to handle backend statuses directly
const getStatusBadge = (status: string) => {
  const badgeClass = {
    'PENDING': 'status-badge status-in-stock',
    'IN_PROGRESS': 'status-badge status-low-stock',
    'COMPLETED': 'status-badge status-overstock',
    'CANCELLED': 'status-badge status-overstock',
    'ON_HOLD': 'status-badge status-out-of-stock',
  }[status] || 'status-badge';

  const statusText = {
    'PENDING': 'Opened',
    'IN_PROGRESS': 'In Progress',
    'COMPLETED': 'Completed',
    'CANCELLED': 'Cancelled',
    'ON_HOLD': 'On Hold',
  }[status] || 'Unknown';

  return <span className={badgeClass}>{statusText}</span>;
};

const WorkOrdersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCustomer, setFilterCustomer] = useState('all');
  const [filterVehicle, setFilterVehicle] = useState('all');

  // Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false); 
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(null);

  // State for work orders
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch work orders
  const fetchWorkOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const backendFilters: any = {};
      if (filterStatus !== 'all') {
        backendFilters.status = filterStatus;
      }

      const backendWorkOrders = await workOrderService.getWorkOrders(backendFilters);
      const mappedWorkOrders = backendWorkOrders.map(mapWorkOrderToFrontend);
      setWorkOrders(mappedWorkOrders);
      
      // Success toast for data loading - Use to testing and debugging purposes
      // if (mappedWorkOrders.length > 0) {
      //   toastService.dataLoadSuccess('work orders', mappedWorkOrders.length);
      // }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch work orders';
      setError(errorMessage);
      toastService.workOrderLoadFailed(errorMessage);
      console.error('Error fetching work orders:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchWorkOrders();
  }, [filterStatus]); // Refetch when status filter changes

  // Handle search
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      // If search term is empty, fetch all work orders
      await fetchWorkOrders();
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Include current filters in the search
      const searchFilters: any = {};
      if (filterStatus !== 'all') {
        searchFilters.status = filterStatus;
      }

      console.log('Frontend - Searching with term:', searchTerm, 'and filters:', searchFilters);

      const backendWorkOrders = await workOrderService.searchWorkOrders(searchTerm, searchFilters);

      console.log('Frontend - Search results received:', backendWorkOrders);

      const mappedWorkOrders = backendWorkOrders.map(mapWorkOrderToFrontend);
      setWorkOrders(mappedWorkOrders);
      
      // Show search results toast
      toastService.info(`Found ${mappedWorkOrders.length} work orders matching "${searchTerm}"`, { autoClose: 3000 });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search work orders';
      setError(errorMessage);
      toastService.workOrderSearchFailed(errorMessage);
      console.error('Error searching work orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleWorkOrderCreated = async (workOrder: WorkOrder) => {
    // Show success toast
    toastService.workOrderCreated(workOrder.workOrderNumber);
    
    // Refresh the work orders list
    await fetchWorkOrders();
  };

  // Unique filter values
  const uniqueCustomers = [...new Set(workOrders.map(w => w.customer.name))];
  const uniqueVehicles = [...new Set(workOrders.map(w => `${w.vehicle.make} ${w.vehicle.model}`))];

  // Filtering logic (client-side for customer/vehicle filters)
  const filteredWorkOrders = workOrders.filter(order => {
    const matchesCustomer = filterCustomer === 'all' || order.customer.name === filterCustomer;
    const matchesVehicle = filterVehicle === 'all' || `${order.vehicle.make} ${order.vehicle.model}` === filterVehicle;
    return matchesCustomer && matchesVehicle;
  });

  const handleView = (id: string) => {
    const wo = workOrders.find(w => w.id === id) || null;
    setSelectedWorkOrder(wo);
    setViewModalOpen(true);
  };

  const handleEdit = (id: string) => {
    const wo = workOrders.find(w => w.id === id) || null;
    setSelectedWorkOrder(wo);
    setEditModalOpen(true); // Open edit modal
  };

  const handleWorkOrderUpdated = async (updatedWorkOrder: WorkOrder) => {
    // Show success toast
    toastService.workOrderUpdated(updatedWorkOrder.workOrderNumber);
    
    // Refresh the work orders list
    await fetchWorkOrders();
    setEditModalOpen(false); // Close the edit modal
  };

  const handleDelete = async (id: string) => {
    const workOrder = workOrders.find(w => w.id === id);
    if (!workOrder) return;

    if (window.confirm(`Are you sure you want to delete Work Order #${workOrder.workOrderNumber}?`)) {
      try {
        const response = await workOrderService.deleteWorkOrder(id);
        console.log(response);
        
        // Show success toast
        toastService.workOrderDeleted(workOrder.workOrderNumber);
        
        await fetchWorkOrders(); // Refresh the list
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to delete work order';
        toastService.workOrderDeleteFailed(errorMessage);
        console.error('Error deleting work order:', err);
      }
    }
  };

  // Handle create modal errors
  const handleWorkOrderCreateError = (error: string) => {
    toastService.workOrderCreationFailed(error);
  };

  // Handle edit modal errors
  const handleWorkOrderUpdateError = (error: string) => {
    toastService.workOrderUpdateFailed(error);
  };

  const columns: TableColumn<WorkOrder>[] = [
    {
      key: 'workOrderNumber',
      label: 'Work Order',
      sortable: true,
      render: (value) => <strong>{String(value)}</strong>
    },
    {
      key: 'title',
      label: 'Title',
      sortable: true,
      render: (value) => <span>{String(value)}</span>
    },
    {
      key: 'customer',
      label: 'Customer',
      sortable: true,
      render: (_, row) => <span>{row.customer.name}</span>
    },
    {
      key: 'vehicle',
      label: 'Vehicle',
      sortable: true,
      render: (_, row) => <span>{`${row.vehicle.make} ${row.vehicle.model}`}</span>
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
      render: (status) => getStatusBadge(status as string)
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

  // Show loading state
  if (loading) {
    return (
      <div className="work-orders-page">
        <div className="loading-container">
          <i className='bx bx-loader-circle bx-spin'></i>
          <p>Loading work orders...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="work-orders-page">
        <div className="error-container">
          <i className='bx bx-error-circle'></i>
          <h3>Error Loading Work Orders</h3>
          <p>{error}</p>
          <button className="btn btn--primary" onClick={() => fetchWorkOrders()}>
            <i className='bx bx-refresh'></i>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="work-orders-page">
      <div className="inventory-controls">
        <div className="search-filters">

          <div className="search-box">

            <input
              type="text"
              placeholder="Search by title, customer, vehicle"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              className="search-icon"
              onClick={handleSearch}
              title="Search"

            >
              <i className='bx bx-search'></i>
            </button>

          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Statuses</option>
            <option value="PENDING">Opened</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="ON_HOLD">On Hold</option>
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
        <button className="btn btn--primary" style={{ marginLeft: 'auto' }} onClick={() => setShowCreateModal(true)}>
          <i className='bx bx-plus'></i>
          Create New Work Order
        </button>
      </div>

      <div className="parts-table-container">
        {filteredWorkOrders.length > 0 ? (
          <Table
            columns={columns}
            data={filteredWorkOrders}
            onRowClick={(order) => console.log('View work order details:', order.title)}
            emptyMessage="No work orders found matching your search criteria."
          />
        ) : (
          <div className="empty-state" style={{ alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
            <i className='bx bx-clipboard'></i>
            <h3>No Work Orders Yet</h3>
            <p>Get started by creating your first work order</p>

          </div>
        )}
      </div>

      <CreateWorkOrderModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onWorkOrderCreated={handleWorkOrderCreated}
        onError={handleWorkOrderCreateError}
      />

      {selectedWorkOrder && (
        <EditWorkOrderModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          workOrder={selectedWorkOrder}
          onWorkOrderUpdated={handleWorkOrderUpdated}
          onError={handleWorkOrderUpdateError}
        />
      )}

      {selectedWorkOrder && (
        <ManageWorkOrderModal
          open={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          workOrder={selectedWorkOrder}
        />
      )}
    </div>
  );
};

export default WorkOrdersPage;