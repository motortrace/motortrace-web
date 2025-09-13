import React, { useState, useEffect } from 'react';
import Table, { type TableColumn } from '../../components/Table/Table';
import './AppointmentsPage.scss';

// Types based on the Prisma schema
interface Appointment {
  id: string;
  customerId: string;
  vehicleId: string;
  requestedAt: Date;
  startTime?: Date;
  endTime?: Date;
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  assignedToId?: string;
  
  // Relations
  customer?: {
    id: string;
    firstName: string;
    lastName: string;
    phone?: string;
    email?: string;
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
    userProfile?: {
      firstName: string;
      lastName: string;
    };
  };
  cannedServices?: Array<{
    id: string;
    cannedService: {
      id: string;
      name: string;
      description?: string;
    };
    quantity: number;
    price: number;
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

  // Sample data - replace with actual API calls
  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const sampleAppointments: Appointment[] = [
        {
          id: '1',
          customerId: 'cust1',
          vehicleId: 'veh1',
          requestedAt: new Date('2024-01-15T09:00:00'),
          startTime: new Date('2024-01-15T09:00:00'),
          endTime: new Date('2024-01-15T10:00:00'),
          status: 'PENDING',
          priority: 'NORMAL',
          notes: 'Regular maintenance',
          createdAt: new Date('2024-01-14T10:00:00'),
          updatedAt: new Date('2024-01-14T10:00:00'),
          customer: {
            id: 'cust1',
            firstName: 'John',
            lastName: 'Smith',
            phone: '+94 77 123 4567',
            email: 'john.smith@email.com'
          },
          vehicle: {
            id: 'veh1',
            make: 'Toyota',
            model: 'Camry',
            year: 2020,
            licensePlate: 'ABC-1234'
          },
          cannedServices: [
            {
              id: '1',
              cannedService: {
                id: 'svc1',
                name: 'Oil Change',
                description: 'Regular oil change service'
              },
              quantity: 1,
              price: 5000,
              notes: 'Synthetic oil'
            }
          ]
        },
        {
          id: '2',
          customerId: 'cust2',
          vehicleId: 'veh2',
          requestedAt: new Date('2024-01-15T14:00:00'),
          startTime: new Date('2024-01-15T14:00:00'),
          endTime: new Date('2024-01-15T15:30:00'),
          status: 'CONFIRMED',
          priority: 'HIGH',
          notes: 'Brake inspection needed',
          createdAt: new Date('2024-01-14T11:00:00'),
          updatedAt: new Date('2024-01-14T11:00:00'),
          assignedToId: 'advisor1',
          customer: {
            id: 'cust2',
            firstName: 'Sarah',
            lastName: 'Johnson',
            phone: '+94 77 234 5678',
            email: 'sarah.johnson@email.com'
          },
          vehicle: {
            id: 'veh2',
            make: 'Honda',
            model: 'Civic',
            year: 2019,
            licensePlate: 'DEF-5678'
          },
          assignedTo: {
            id: 'advisor1',
            userProfile: {
              firstName: 'Mike',
              lastName: 'Wilson'
            }
          },
          cannedServices: [
            {
              id: '2',
              cannedService: {
                id: 'svc2',
                name: 'Brake Inspection',
                description: 'Complete brake system inspection'
              },
              quantity: 1,
              price: 3000
            }
          ]
        },
        {
          id: '3',
          customerId: 'cust3',
          vehicleId: 'veh3',
          requestedAt: new Date('2024-01-16T10:00:00'),
          startTime: new Date('2024-01-16T10:00:00'),
          endTime: new Date('2024-01-16T11:00:00'),
          status: 'IN_PROGRESS',
          priority: 'URGENT',
          notes: 'Engine repair',
          createdAt: new Date('2024-01-15T08:00:00'),
          updatedAt: new Date('2024-01-15T08:00:00'),
          assignedToId: 'advisor2',
          customer: {
            id: 'cust3',
            firstName: 'Mike',
            lastName: 'Davis',
            phone: '+94 77 345 6789',
            email: 'mike.davis@email.com'
          },
          vehicle: {
            id: 'veh3',
            make: 'Ford',
            model: 'Focus',
            year: 2021,
            licensePlate: 'GHI-9012'
          },
          assignedTo: {
            id: 'advisor2',
            userProfile: {
              firstName: 'Sarah',
              lastName: 'Brown'
            }
          },
          cannedServices: [
            {
              id: '3',
              cannedService: {
                id: 'svc3',
                name: 'Engine Diagnostic',
                description: 'Complete engine diagnostic check'
              },
              quantity: 1,
              price: 8000
            }
          ]
        }
      ];
      setAppointments(sampleAppointments);
      setLoading(false);
    }, 1000);
  }, []);

  // Unique filter values
  const uniqueCustomers = [...new Set(appointments.map((a: Appointment) => a.customer?.firstName ? `${a.customer.firstName} ${a.customer.lastName}` : a.customerId))];
  const uniqueVehicles = [...new Set(appointments.map((a: Appointment) => a.vehicle?.make ? `${a.vehicle.year} ${a.vehicle.make} ${a.vehicle.model}` : a.vehicleId))];

  // Filtering logic
  const filteredAppointments = appointments.filter((appointment: Appointment) => {
    const customerName = appointment.customer?.firstName ? `${appointment.customer.firstName} ${appointment.customer.lastName}` : appointment.customerId;
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
      render: (value: any) => <strong>{String(value)}</strong>
    },
    {
      key: 'customer',
      label: 'Customer',
      sortable: true,
      render: (_: any, row: Appointment) => <span>{row.customer?.firstName ? `${row.customer.firstName} ${row.customer.lastName}` : row.customerId}</span>
    },
    {
      key: 'vehicle',
      label: 'Vehicle',
      sortable: true,
      render: (_: any, row: Appointment) => <span>{row.vehicle?.make ? `${row.vehicle.year} ${row.vehicle.make} ${row.vehicle.model}` : row.vehicleId}</span>
    },
    {
      key: 'startTime',
      label: 'Appointment Time',
      sortable: true,
      render: (value: any) => {
        if (!value) return <span style={{ color: '#aaa', fontStyle: 'italic' }}>Not scheduled</span>;
        const date = new Date(value);
        return <span>{date.toLocaleString()}</span>;
      }
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
        const advisor = row.assignedTo?.userProfile;
        return advisor ? (
          <span>{advisor.firstName} {advisor.lastName}</span>
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
          <button className="btn btn--ghost" onClick={() => window.location.reload()}>
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
                <p><strong>Name:</strong> {selectedAppointment.customer?.firstName} {selectedAppointment.customer?.lastName}</p>
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
                <p><strong>Service Advisor:</strong> {selectedAppointment.assignedTo?.userProfile ? 
                  `${selectedAppointment.assignedTo.userProfile.firstName} ${selectedAppointment.assignedTo.userProfile.lastName}` : 
                  'Unassigned'}</p>
                {selectedAppointment.notes && (
                  <p><strong>Notes:</strong> {selectedAppointment.notes}</p>
                )}
              </div>

              {selectedAppointment.cannedServices && selectedAppointment.cannedServices.length > 0 && (
                <div className="detail-section">
                  <h4>Services</h4>
                  {selectedAppointment.cannedServices.map((service, index) => (
                    <div key={index} className="service-item">
                      <p><strong>{service.cannedService.name}</strong></p>
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