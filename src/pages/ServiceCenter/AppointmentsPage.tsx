import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Table, { type TableColumn } from '../../components/Table/Table';
import './AppointmentsPage.scss';
import { useAuth } from '../../hooks/useAuth';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

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
    profileImage?: string;
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
    userProfile?: {
      id: string;
      name: string;
      phone: string;
      profileImage?: string;
      role: string;
    };
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

interface ServiceAdvisor {
  id: string;
  userProfileId: string;
  employeeId: string;
  department: string;
  createdAt: string;
  updatedAt: string;
  userProfile: {
    id: string;
    name: string;
    phone: string;
    profileImage?: string;
    role: string;
  };
  workOrdersCount: number;
  appointmentsCount: number;
  estimatesCount: number;
}

const getPriorityBadge = (priority: string) => {
  const priorityText = priority.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'LOW':
        return {
          backgroundColor: '#10b981',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '11px',
          fontWeight: '500',
          display: 'inline-block'
        };
      case 'NORMAL':
        return {
          backgroundColor: '#3b82f6',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '11px',
          fontWeight: '500',
          display: 'inline-block'
        };
      case 'HIGH':
        return {
          backgroundColor: '#f59e0b',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '11px',
          fontWeight: '500',
          display: 'inline-block'
        };
      case 'URGENT':
        return {
          backgroundColor: '#ef4444',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '11px',
          fontWeight: '500',
          display: 'inline-block'
        };
      default:
        return {
          backgroundColor: '#6b7280',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '12px',
          fontSize: '11px',
          fontWeight: '500',
          display: 'inline-block'
        };
    }
  };

  return <span style={getPriorityStyle(priority)}>{priorityText}</span>;
};

const AppointmentsPage = () => {
  const { token, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const localizer = momentLocalizer(moment);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCustomer, setFilterCustomer] = useState('all');
  const [filterVehicle, setFilterVehicle] = useState('all');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [serviceAdvisors, setServiceAdvisors] = useState<ServiceAdvisor[]>([]);
  const [serviceAdvisorsLoading, setServiceAdvisorsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'calendar'>('calendar');

  // Modal state
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmingAppointment, setConfirmingAppointment] = useState<Appointment | null>(null);
  
  // Confirmation form state
  const [confirmationForm, setConfirmationForm] = useState({
    priority: 'NORMAL' as 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT',
    notes: '',
    assignedToId: ''
  });
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [confirmError, setConfirmError] = useState('');

  // Fetch service advisors from backend
  const fetchServiceAdvisors = async () => {
    if (!token) {
      console.log('No token available for service advisors fetch');
      return;
    }

    setServiceAdvisorsLoading(true);
    console.log('Fetching service advisors...');

    try {
      const response = await fetch('http://localhost:3000/service-advisors', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Service advisors response status:', response.status);
      console.log('Service advisors response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Service advisors error response:', errorText);
        throw new Error(`Failed to fetch service advisors: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Service advisors data:', data);
      
      if (data.success) {
        setServiceAdvisors(data.data);
        console.log('Service advisors set successfully:', data.data.length, 'advisors');
      } else {
        console.error('Service advisors API returned success: false');
      }
    } catch (err) {
      console.error('Error fetching service advisors:', err);
    } finally {
      setServiceAdvisorsLoading(false);
    }
  };

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
      fetchServiceAdvisors();
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

  const handleConfirm = (id: string) => {
    const appointment = appointments.find((a: Appointment) => a.id === id);
    if (appointment) {
      setConfirmingAppointment(appointment);
      setConfirmationForm({
        priority: appointment.priority,
        notes: appointment.notes || '',
        assignedToId: appointment.assignedToId || ''
      });
      setConfirmModalOpen(true);
      setConfirmError('');
    }
  };

  const handleConfirmSubmit = async () => {
    if (!confirmingAppointment || !token) {
      setConfirmError('Missing appointment or authentication token');
      return;
    }

    setConfirmLoading(true);
    setConfirmError('');

    try {
      const updateData: any = {
        status: 'CONFIRMED',
        priority: confirmationForm.priority,
        notes: confirmationForm.notes
      };

      // Add optional fields if provided
      if (confirmationForm.assignedToId) {
        updateData.assignedToId = confirmationForm.assignedToId;
      }

      const response = await fetch(`http://localhost:3000/appointments/${confirmingAppointment.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to confirm appointment: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.success) {
        // Update the appointment in the local state
        setAppointments(prev => 
          prev.map(apt => 
            apt.id === confirmingAppointment.id 
              ? { ...apt, ...result.data }
              : apt
          )
        );
        
        // Close modals and reset form
        setConfirmModalOpen(false);
        setConfirmingAppointment(null);
        setConfirmationForm({
          priority: 'NORMAL',
          notes: '',
          assignedToId: ''
        });
      } else {
        throw new Error(result.message || 'Failed to confirm appointment');
      }
    } catch (err) {
      console.error('Error confirming appointment:', err);
      setConfirmError(err instanceof Error ? err.message : 'Failed to confirm appointment');
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!token) {
      setError('No access token available');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const updateData = {
        status: 'CANCELLED'
      };

      const response = await fetch(`http://localhost:3000/appointments/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to cancel appointment: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.success) {
        // Update the appointment in the local state
        setAppointments(prev => 
          prev.map(apt => 
            apt.id === id 
              ? { ...apt, ...result.data }
              : apt
          )
        );
        
        // Close any open modals
        setConfirmModalOpen(false);
        
        console.log('Appointment cancelled successfully');
      } else {
        throw new Error(result.message || 'Failed to cancel appointment');
      }
    } catch (err) {
      console.error('Error cancelling appointment:', err);
      setError(err instanceof Error ? err.message : 'Failed to cancel appointment');
    } finally {
      setLoading(false);
    }
  };

  // Columns for incoming appointment requests (simplified)
  const incomingColumns: TableColumn<Appointment>[] = [
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {row.customer?.profileImage ? (
            <img 
              src={row.customer.profileImage} 
              alt={row.customer.name}
              style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '50%', 
                objectFit: 'cover' 
              }}
            />
          ) : (
            <div style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: '50%', 
              backgroundColor: '#e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: '500',
              color: '#6b7280'
            }}>
              {(row.customer?.name || row.customerId || 'C').charAt(0).toUpperCase()}
            </div>
          )}
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
      key: 'actions',
      label: 'Actions',
      align: 'center' as const,
      render: (_: any, row: Appointment) => (
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          <button className="btn-icon" title="View" onClick={e => { e.stopPropagation(); navigate(`/serviceadvisor/appointment-detail/${row.id}`); }}>
            <i className='bx bx-show'></i>
          </button>
          <button className="btn-icon" title="Confirm" onClick={e => { e.stopPropagation(); handleConfirm(row.id); }}>
            <i className='bx bx-check'></i>
          </button>
          <button className="btn-icon btn-danger" title="Cancel" onClick={e => { e.stopPropagation(); handleCancel(row.id); }}>
            <i className='bx bx-x'></i>
          </button>
        </div>
      )
    },
  ];

  // Columns for confirmed appointments (full details)
  const confirmedColumns: TableColumn<Appointment>[] = [
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {row.customer?.profileImage ? (
            <img 
              src={row.customer.profileImage} 
              alt={row.customer.name}
              style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '50%', 
                objectFit: 'cover' 
              }}
            />
          ) : (
            <div style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: '50%', 
              backgroundColor: '#e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: '500',
              color: '#6b7280'
            }}>
              {(row.customer?.name || row.customerId || 'C').charAt(0).toUpperCase()}
            </div>
          )}
          <div style={{ fontWeight: '500' }}>
            {row.customer?.name || row.customerId}
          </div>
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
    // {
    //   key: 'cannedServices',
    //   label: 'Services',
    //   render: (_: any, row: Appointment) => (
    //     <div>
    //       {row.cannedServices && row.cannedServices.length > 0 ? (
    //         <div>
    //           {row.cannedServices.slice(0, 2).map((service, index) => (
    //             <div key={index} style={{ fontSize: '12px', marginBottom: '2px' }}>
    //               {service.name}
    //             </div>
    //           ))}
    //           {row.cannedServices.length > 2 && (
    //             <div style={{ fontSize: '11px', color: '#6b7280' }}>
    //               +{row.cannedServices.length - 2} more
    //             </div>
    //           )}
    //         </div>
    //       ) : (
    //         <span style={{ color: '#6b7280', fontStyle: 'italic', fontSize: '12px' }}>No services</span>
    //       )}
    //     </div>
    //   )
    // },
    {
      key: 'priority',
      label: 'Priority',
      sortable: true,
      align: 'center' as const,
      render: (priority: any) => getPriorityBadge(priority)
    },
    {
      key: 'assignedTo',
      label: 'Service Advisor',
      render: (_: any, row: Appointment) => {
        if (!row.assignedToId) {
          return (
            <span style={{ fontSize: 11, color: '#aaa', fontStyle: 'italic' }}>Unassigned</span>
          );
        }
        
        // Find the service advisor by assignedToId
        const serviceAdvisor = serviceAdvisors.find(advisor => advisor.id === row.assignedToId);
        
        if (!serviceAdvisor) {
          return (
            <span style={{ fontSize: 11, color: '#aaa', fontStyle: 'italic' }}>Unassigned</span>
          );
        }
        
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {serviceAdvisor.userProfile.profileImage ? (
              <img 
                src={serviceAdvisor.userProfile.profileImage} 
                alt={serviceAdvisor.userProfile.name}
                style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '50%', 
                  objectFit: 'cover' 
                }}
              />
            ) : (
              <div style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '50%', 
                backgroundColor: '#e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: '500',
                color: '#6b7280'
              }}>
                {serviceAdvisor.userProfile.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div style={{ fontWeight: '500' }}>
              {serviceAdvisor.userProfile.name}
            </div>
          </div>
        );
      }
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'center' as const,
      render: (_: any, row: Appointment) => (
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          <button className="btn-icon" title="View" onClick={e => { e.stopPropagation(); navigate(`/serviceadvisor/appointment-detail/${row.id}`); }}>
            <i className='bx bx-show'></i>
          </button>
        </div>
      )
    },
  ];

  // Separate pending and confirmed appointments
  const pendingAppointments = filteredAppointments.filter(apt => apt.status === 'PENDING');
  const confirmedAppointments = filteredAppointments.filter(apt => apt.status === 'CONFIRMED');

  // Map calendar appointments to BigCalendar events
  const calendarEvents = appointments
    .filter(apt => apt.startTime) // Only show appointments with scheduled times
    .map(apt => ({
      id: apt.id,
      title: `${apt.customer?.name || apt.customerId} – ${apt.vehicle ? `${apt.vehicle.make} ${apt.vehicle.model}` : apt.vehicleId}`,
      start: new Date(apt.startTime!),
      end: new Date(apt.startTime!), // Assuming no end time, or add duration if available
      resource: apt,
    }));

  const handleEventClick = (event: any) => {
    // Calendar event clicked - no modal to show
    console.log('Calendar event clicked:', event);
  };

  const eventStyleGetter = (event: any) => {
    let backgroundColor = '#3b82f6'; // default blue
    let borderColor = '#2563eb';
    
    switch (event.resource.status) {
      case 'PENDING':
        backgroundColor = '#2A7399';
        borderColor = '#1e5f7a';
        break;
      case 'CONFIRMED':
        backgroundColor = '#1DB5D5';
        borderColor = '#1794ad';
        break;
      case 'IN_PROGRESS':
        backgroundColor = '#FECC1B';
        borderColor = '#d4a816';
        break;
      case 'COMPLETED':
        backgroundColor = '#ED7861';
        borderColor = '#c55f4e';
        break;
      case 'CANCELLED':
        backgroundColor = '#E95988';
        borderColor = '#c1476f';
        break;
      case 'NO_SHOW':
        backgroundColor = '#6b7280'; // gray for no show
        borderColor = '#4b5563';
        break;
      default:
        backgroundColor = '#3b82f6'; // blue
        borderColor = '#2563eb';
    }

    return {
      style: {
        backgroundColor,
        borderColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    };
  };

  return (
    <div className="appointments-page">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Appointments</h1>
          <p className="page-subtitle">Manage and confirm appointment requests</p>
        </div>
        <div className="header-actions">
          <div className="view-toggle">
            <button 
              className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
            >
              <i className='bx bx-table'></i> Table
            </button>
            <button 
              className={`view-btn ${viewMode === 'calendar' ? 'active' : ''}`}
              onClick={() => setViewMode('calendar')}
            >
              <i className='bx bx-calendar'></i> Calendar
            </button>
          </div>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by customer, vehicle, or notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="status-filter">
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
          </div>
          <div className="customer-filter">
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
          </div>
          <div className="vehicle-filter">
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
        </div>
      </div>

      {viewMode === 'table' ? (
        <>
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
                  columns={incomingColumns}
                  data={pendingAppointments.map(apt => ({ ...apt, uniqueKey: `pending-${apt.id}` }))}
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
                  columns={confirmedColumns}
                  data={confirmedAppointments.map(apt => ({ ...apt, uniqueKey: `confirmed-${apt.id}` }))}
                  emptyMessage="No confirmed appointments found."
                />
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="calendar-section">
          <div className="section-header">
            <h3 className="section-title">Appointment Calendar</h3>
          </div>
          <div className="calendar-container">
            {loading ? (
              <div>Loading calendar...</div>
            ) : (
              <Calendar
                localizer={localizer}
                events={calendarEvents}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 600 }}
                onSelectEvent={handleEventClick}
                views={['month', 'week', 'day']}
                defaultView="month"
                eventPropGetter={eventStyleGetter}
              />
            )}
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmModalOpen && confirmingAppointment && (
        <div className="modal-overlay" onClick={() => setConfirmModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirm Appointment</h3>
              <button className="btn-icon" onClick={() => setConfirmModalOpen(false)}>
                <i className='bx bx-x'></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-section">
                <h4>Appointment Details</h4>
                <p><strong>Customer:</strong> {confirmingAppointment.customer?.name || confirmingAppointment.customerId}</p>
                <p><strong>Vehicle:</strong> {confirmingAppointment.vehicle ? `${confirmingAppointment.vehicle.year} ${confirmingAppointment.vehicle.make} ${confirmingAppointment.vehicle.model}` : confirmingAppointment.vehicleId}</p>
                <p><strong>Requested At:</strong> {new Date(confirmingAppointment.requestedAt).toLocaleString()}</p>
              </div>

              <div className="form-section">
                <h4>Confirm Appointment</h4>
                
                <div className="form-group">
                  <label htmlFor="serviceAdvisor">Service Advisor</label>
                  <select
                    id="serviceAdvisor"
                    value={confirmationForm.assignedToId}
                    onChange={(e) => setConfirmationForm(prev => ({ ...prev, assignedToId: e.target.value }))}
                    className="form-select"
                    disabled={serviceAdvisorsLoading}
                  >
                    <option value="">Select Service Advisor</option>
                    {serviceAdvisors.map(advisor => (
                      <option key={advisor.id} value={advisor.id}>
                        {advisor.userProfile.name} ({advisor.employeeId})
                      </option>
                    ))}
                  </select>
                  {serviceAdvisorsLoading && (
                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                      Loading service advisors...
                    </div>
                  )}
                  {!serviceAdvisorsLoading && serviceAdvisors.length === 0 && (
                    <div style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px' }}>
                      No service advisors found. Click "Refresh Service Advisors" to retry.
                    </div>
                  )}
                  {!serviceAdvisorsLoading && serviceAdvisors.length > 0 && (
                    <div style={{ fontSize: '12px', color: '#10b981', marginTop: '4px' }}>
                      {serviceAdvisors.length} service advisor(s) loaded
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="priority">Priority</label>
                  <select
                    id="priority"
                    value={confirmationForm.priority}
                    onChange={(e) => setConfirmationForm(prev => ({ ...prev, priority: e.target.value as 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT' }))}
                    className="form-select"
                  >
                    <option value="LOW">Low</option>
                    <option value="NORMAL">Normal</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="notes">Notes</label>
                  <textarea
                    id="notes"
                    value={confirmationForm.notes}
                    onChange={(e) => setConfirmationForm(prev => ({ ...prev, notes: e.target.value }))}
                    className="form-textarea"
                    rows={3}
                    placeholder="Add any additional notes..."
                  />
                </div>

                {confirmError && (
                  <div className="error-message" style={{ color: 'red', marginTop: '10px' }}>
                    {confirmError}
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn--secondary" 
                onClick={() => setConfirmModalOpen(false)}
                disabled={confirmLoading}
              >
                Cancel
              </button>
              <button 
                className="btn btn--success" 
                onClick={handleConfirmSubmit}
                disabled={confirmLoading}
              >
                {confirmLoading ? 'Confirming...' : 'Confirm Appointment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsPage;