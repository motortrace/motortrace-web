import React, { useState, useEffect } from 'react';
import Table, { type TableColumn } from '../../components/Table/Table';
import './AppointmentsPage.scss';
import { useAuth } from '../../hooks/useAuth';

// Types based on the backend API response
interface Appointment {
  id: string;
  customerId: string;
  vehicleId: string;
  requestedAt: string;
  startTime?: string;
  endTime?: string;
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  assignedToId?: string;
  
  // Relations
  customer?: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
  };
  vehicle?: {
    id: string;
    make: string;
    model: string;
    year: number;
    licensePlate?: string;
  };
  assignedTo?: {
    id: string;
    supabaseUserId?: string;
  };
  cannedServices?: Array<{
    id: string;
    code: string;
    name: string;
    duration: number;
    price: number;
    quantity: number;
    notes?: string;
  }>;
}

const getStatusBadge = (status: string) => {
  const badgeClass = {
    'PENDING': 'status-badge status-low-stock',
    'CONFIRMED': 'status-badge status-in-stock',
    'IN_PROGRESS': 'status-badge status-overstock',
    'COMPLETED': 'status-badge status-in-stock',
    'CANCELLED': 'status-badge status-out-of-stock',
    'NO_SHOW': 'status-badge status-out-of-stock',
  }[status] || 'status-badge';
  const statusText = status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  return <span className={badgeClass}>{statusText}</span>;
};

const getPriorityBadge = (priority: string) => {
  const badgeClass = {
    'LOW': 'status-badge status-in-stock',
    'NORMAL': 'status-badge status-overstock',
    'HIGH': 'status-badge status-low-stock',
    'URGENT': 'status-badge status-out-of-stock',
  }[priority] || 'status-badge';
  const priorityText = priority.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  return <span className={badgeClass}>{priorityText}</span>;
};

const AppointmentsPage = () => {
  const { user, token, loading: authLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCustomer, setFilterCustomer] = useState('all');
  const [filterVehicle, setFilterVehicle] = useState('all');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Modal state
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  // Fetch appointments from backend
  const fetchAppointments = async () => {
    if (!token) {
      setError('No access token available');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Fetch unassigned appointments (pending requests)
      const unassignedResponse = await fetch('http://localhost:3000/appointments/unassigned', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!unassignedResponse.ok) {
        throw new Error(`Failed to fetch unassigned appointments: ${unassignedResponse.statusText}`);
      }

      const unassignedData = await unassignedResponse.json();

      // Fetch confirmed appointments
      const confirmedResponse = await fetch('http://localhost:3000/appointments?status=CONFIRMED', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!confirmedResponse.ok) {
        throw new Error(`Failed to fetch confirmed appointments: ${confirmedResponse.statusText}`);
      }

      const confirmedData = await confirmedResponse.json();

      // Combine both datasets
      const allAppointments = [
        ...(unassignedData.success ? unassignedData.data : []),
        ...(confirmedData.success ? confirmedData.data : [])
      ];

      setAppointments(allAppointments);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && token) {
      fetchAppointments();
    }
  }, [token, authLoading]);

  // Unique filter values
  const uniqueCustomers = [...new Set(appointments.map((a: Appointment) => a.customer?.name || a.customerId))];
  const uniqueVehicles = [...new Set(appointments.map((a: Appointment) => a.vehicle?.make ? `${a.vehicle.year} ${a.vehicle.make} ${a.vehicle.model}` : a.vehicleId))];

  // Filtering logic
  const filteredAppointments = appointments.filter((appointment: Appointment) => {
    const customerName = appointment.customer?.name || appointment.customerId;
    const vehicleName = appointment.vehicle?.make ? `${appointment.vehicle.year} ${appointment.vehicle.make} ${appointment.vehicle.model}` : appointment.vehicleId;
    const notes = appointment.notes || '';
    const matchesSearch = notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicleName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || appointment.status === filterStatus;
    const matchesCustomer = filterCustomer === 'all' || customerName === filterCustomer;
    const matchesVehicle = filterVehicle === 'all' || vehicleName === filterVehicle;
    return matchesSearch && matchesStatus && matchesCustomer && matchesVehicle;
  });

  const handleView = (id: string) => {
    const appointment = appointments.find((a: Appointment) => a.id === id) || null;
    setSelectedAppointment(appointment);
    setViewModalOpen(true);
  };

  const handleConfirm = (id: string) => {
    console.log('Confirm appointment', id);
    // TODO: Implement confirm logic
  };

  const handleCancel = (id: string) => {
    console.log('Cancel appointment', id);
    // TODO: Implement cancel logic
  };

  const columns: TableColumn<Appointment>[] = [
    {
      key: 'id',
      label: 'Appointment ID',
      sortable: true,
      render: (value: any) => {
        const fullId = String(value);
        const shortId = fullId.substring(0, 8) + '...';
        return (
          <strong title={fullId} style={{ cursor: 'help' }}>
            {shortId}
          </strong>
        );
      }
    },
    {
      key: 'customer',
      label: 'Customer',
      sortable: true,
      render: (_: any, row: Appointment) => (
        <div>
          <div style={{ fontWeight: '500' }}>
            {row.customer?.name || row.customerId}
          </div>
          {row.customer?.phone && (
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              {row.customer.phone}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'vehicle',
      label: 'Vehicle',
      sortable: true,
      render: (_: any, row: Appointment) => (
        <div>
          <div style={{ fontWeight: '500' }}>
            {row.vehicle ? `${row.vehicle.year} ${row.vehicle.make} ${row.vehicle.model}` : row.vehicleId}
          </div>
          {row.vehicle?.licensePlate && (
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              {row.vehicle.licensePlate}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'startTime',
      label: 'Appointment Time',
      sortable: true,
      render: (value: any) => {
        if (!value) return <span style={{ color: '#aaa', fontStyle: 'italic' }}>Not scheduled</span>;
        const date = new Date(value);
        return (
          <div>
            <div style={{ fontWeight: '500' }}>
              {date.toLocaleDateString()}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              {date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
            </div>
          </div>
        );
      }
    },
    {
      key: 'cannedServices',
      label: 'Services',
      render: (_: any, row: Appointment) => (
        <div>
          {row.cannedServices && row.cannedServices.length > 0 ? (
            <div>
              {row.cannedServices.slice(0, 2).map((service, index) => (
                <div key={index} style={{ fontSize: '12px', marginBottom: '2px' }}>
                  {service.name}
                </div>
              ))}
              {row.cannedServices.length > 2 && (
                <div style={{ fontSize: '11px', color: '#6b7280' }}>
                  +{row.cannedServices.length - 2} more
                </div>
              )}
            </div>
          ) : (
            <span style={{ color: '#6b7280', fontStyle: 'italic', fontSize: '12px' }}>No services</span>
          )}
        </div>
      )
    },
    {
      key: 'priority',
      label: 'Priority',
      sortable: true,
      align: 'center' as const,
      render: (priority: any) => getPriorityBadge(priority)
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      align: 'center' as const,
      render: (status: any) => getStatusBadge(status)
    },
    {
      key: 'assignedTo',
      label: 'Service Advisor',
      render: (_: any, row: Appointment) => {
        return row.assignedTo ? (
          <span>Assigned</span>
        ) : (
          <span style={{ fontSize: 11, color: '#aaa', fontStyle: 'italic' }}>Unassigned</span>
        );
      }
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'center' as const,
      render: (_: any, row: Appointment) => (
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          <button className="btn-icon" title="View" onClick={e => { e.stopPropagation(); handleView(row.id); }}>
            <i className='bx bx-show'></i>
          </button>
          {row.status === 'PENDING' && (
            <>
              <button className="btn-icon" title="Confirm" onClick={e => { e.stopPropagation(); handleConfirm(row.id); }}>
                <i className='bx bx-check'></i>
              </button>
              <button className="btn-icon btn-danger" title="Cancel" onClick={e => { e.stopPropagation(); handleCancel(row.id); }}>
                <i className='bx bx-x'></i>
              </button>
            </>
          )}
        </div>
      )
    },
  ];

  // Separate pending and confirmed appointments
  const pendingAppointments = filteredAppointments.filter(apt => apt.status === 'PENDING');
  const confirmedAppointments = filteredAppointments.filter(apt => apt.status === 'CONFIRMED');

  return (
    <div className="appointments-page">
      <div className="page-header">
        <h2 className="page-title">Appointments</h2>
        <button className="btn btn--primary" style={{ marginLeft: 'auto' }}>
          <i className='bx bx-plus'></i>
          New Appointment
        </button>
      </div>

      <div className="inventory-controls">
        <div className="search-filters">
          <div className="search-box">
            <i className='bx bx-search search-icon'></i>
            <input
              type="text"
              placeholder="Search by customer, vehicle, or notes..."
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
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="NO_SHOW">No Show</option>
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
          <button className="btn btn--ghost" onClick={fetchAppointments}>
            <i className='bx bx-refresh'></i>
            Refresh
          </button>
        </div>
      </div>

      {/* Incoming Appointment Requests */}
      <div className="appointments-section">
        <div className="section-header">
          <h3 className="section-title">Incoming Appointment Requests</h3>
          <span className="count-badge">{pendingAppointments.length}</span>
        </div>
        <div className="parts-table-container">
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div style={{ color: 'red' }}>{error}</div>
          ) : (
            <Table
              columns={columns}
              data={pendingAppointments}
              onRowClick={(appointment) => handleView(appointment.id)}
              emptyMessage="No pending appointment requests found."
            />
          )}
        </div>
      </div>

      {/* Confirmed Appointments */}
      <div className="appointments-section">
        <div className="section-header">
          <h3 className="section-title">Confirmed Appointments</h3>
          <span className="count-badge">{confirmedAppointments.length}</span>
        </div>
        <div className="parts-table-container">
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div style={{ color: 'red' }}>{error}</div>
          ) : (
            <Table
              columns={columns}
              data={confirmedAppointments}
              onRowClick={(appointment) => handleView(appointment.id)}
              emptyMessage="No confirmed appointments found."
            />
          )}
        </div>
      </div>

      {/* View Modal */}
      {viewModalOpen && selectedAppointment && (
        <div className="modal-overlay" onClick={() => setViewModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Appointment Details</h3>
              <button className="btn-icon" onClick={() => setViewModalOpen(false)}>
                <i className='bx bx-x'></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-section">
                <h4>Customer Information</h4>
                <p><strong>Name:</strong> {selectedAppointment.customer?.name || 'N/A'}</p>
                <p><strong>Phone:</strong> {selectedAppointment.customer?.phone || 'N/A'}</p>
                <p><strong>Email:</strong> {selectedAppointment.customer?.email || 'N/A'}</p>
              </div>
              
              <div className="detail-section">
                <h4>Vehicle Information</h4>
                <p><strong>Vehicle:</strong> {selectedAppointment.vehicle?.year} {selectedAppointment.vehicle?.make} {selectedAppointment.vehicle?.model}</p>
                <p><strong>License Plate:</strong> {selectedAppointment.vehicle?.licensePlate || 'N/A'}</p>
              </div>

              <div className="detail-section">
                <h4>Appointment Details</h4>
                <p><strong>Requested At:</strong> {new Date(selectedAppointment.requestedAt).toLocaleString()}</p>
                <p><strong>Scheduled Time:</strong> {selectedAppointment.startTime ? new Date(selectedAppointment.startTime).toLocaleString() : 'Not scheduled'}</p>
                <p><strong>Status:</strong> {getStatusBadge(selectedAppointment.status)}</p>
                <p><strong>Priority:</strong> {getPriorityBadge(selectedAppointment.priority)}</p>
                <p><strong>Service Advisor:</strong> {selectedAppointment.assignedTo ? 'Assigned' : 'Unassigned'}</p>
                {selectedAppointment.notes && (
                  <p><strong>Notes:</strong> {selectedAppointment.notes}</p>
                )}
              </div>

              {selectedAppointment.cannedServices && selectedAppointment.cannedServices.length > 0 && (
                <div className="detail-section">
                  <h4>Services</h4>
                  {selectedAppointment.cannedServices.map((service, index) => (
                    <div key={index} className="service-item">
                      <p><strong>{service.name}</strong></p>
                      <p>Code: {service.code}</p>
                      <p>Duration: {service.duration} minutes</p>
                      <p>Quantity: {service.quantity}</p>
                      <p>Price: LKR {service.price.toFixed(2)}</p>
                      {service.notes && <p>Notes: {service.notes}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn--secondary" onClick={() => setViewModalOpen(false)}>
                Close
              </button>
              {selectedAppointment.status === 'PENDING' && (
                <>
                  <button className="btn btn--success" onClick={() => handleConfirm(selectedAppointment.id)}>
                    Confirm Appointment
                  </button>
                  <button className="btn btn--danger" onClick={() => handleCancel(selectedAppointment.id)}>
                    Cancel Appointment
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsPage;