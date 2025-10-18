import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './AppointmentDetailPage.scss';
import { useAuth } from '../../hooks/useAuth';

// Appointment interface based on the API response
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
    imageUrl?: string;
  };
  assignedTo?: {
    id: string;
    employeeId: string;
    name: string;
    phone: string;
    profileImage?: string;
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

interface AdvisorAvailability {
  advisorId: string;
  employeeId: string;
  name: string;
  phone: string;
  profileImage?: string;
  isAvailable: boolean;
  currentAppointment: {
    id: string;
    startTime: string;
    endTime?: string;
    customerName: string;
    vehicleInfo: string;
  } | null;
  lastAssignedAt: string;
  lastAppointmentStatus: string;
  hasNeverBeenAssigned: boolean;
}

interface ServiceHistoryItem {
  workOrderId: string;
  workOrderNumber: string;
  vehicle: {
    id: string;
    make: string;
    model: string;
    year: number;
    licensePlate: string;
  };
  completedAt: string;
  services: Array<{
    id: string;
    name: string;
    code: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }>;
  inspections: Array<{
    id: string;
    templateName: string;
    inspector: string;
    date: string;
  }>;
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

const AppointmentDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Assignment form state
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedAdvisorId, setSelectedAdvisorId] = useState('');
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignError, setAssignError] = useState('');

  // Cancellation state
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelError, setCancelError] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Service history state
  const [serviceHistory, setServiceHistory] = useState<ServiceHistoryItem[]>([]);
  const [serviceHistoryLoading, setServiceHistoryLoading] = useState(false);
  const [serviceHistoryError, setServiceHistoryError] = useState('');

  // Advisor availability state
  const [advisorAvailability, setAdvisorAvailability] = useState<AdvisorAvailability[]>([]);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilityError, setAvailabilityError] = useState('');

  // Fetch service history
  const fetchServiceHistory = async (customerId: string) => {
    if (!token) {
      console.log('No token available for service history fetch');
      return;
    }

    setServiceHistoryLoading(true);
    setServiceHistoryError('');

    try {
      const response = await fetch(`http://localhost:3000/customers/${customerId}/service-history`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch service history: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        setServiceHistory(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch service history');
      }
    } catch (err) {
      console.error('Error fetching service history:', err);
      setServiceHistoryError(err instanceof Error ? err.message : 'Failed to fetch service history');
    } finally {
      setServiceHistoryLoading(false);
    }
  };

  // Fetch advisor availability
  const fetchAdvisorAvailability = async () => {
    if (!appointment?.startTime) {
      setAvailabilityError('Appointment must have a scheduled time to check advisor availability');
      return;
    }

    setAvailabilityLoading(true);
    setAvailabilityError('');
    try {
      const dateTime = new Date(appointment.startTime).toISOString();
      const response = await fetch(`http://localhost:3000/appointments/advisors/availability?dateTime=${encodeURIComponent(dateTime)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to fetch advisor availability');
      const data = await response.json();
      if (data.success) {
        setAdvisorAvailability(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch advisor availability');
      }
    } catch (error) {
      setAvailabilityError(error instanceof Error ? error.message : 'Failed to fetch advisor availability');
    } finally {
      setAvailabilityLoading(false);
    }
  };

  // Fetch appointment details
  const fetchAppointment = async () => {
    if (!id || !token) {
      setError('Missing appointment ID or authentication token');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:3000/appointments/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch appointment: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        setAppointment(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch appointment');
      }
    } catch (err) {
      console.error('Error fetching appointment:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch appointment');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAppointment();
    }
  }, [id, token]);

  // Fetch service history when appointment is loaded
  useEffect(() => {
    if (appointment?.customerId && token) {
      fetchServiceHistory(appointment.customerId);
    }
  }, [appointment?.customerId, token]);

  // Fetch advisor availability when assign modal opens
  useEffect(() => {
    if (assignModalOpen && appointment?.startTime && token) {
      fetchAdvisorAvailability();
    }
  }, [assignModalOpen, appointment?.startTime, token]);

  // Handle appointment assignment
  const handleAssign = async () => {
    if (!appointment || !token || !selectedAdvisorId) {
      setAssignError('Missing appointment, token, or service advisor selection');
      return;
    }

    setAssignLoading(true);
    setAssignError('');

    try {
      const response = await fetch(`http://localhost:3000/appointments/${appointment.id}/assign`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assignedToId: selectedAdvisorId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to assign appointment: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success) {
        // Update the appointment in local state
        setAppointment(prev => prev ? { ...prev, ...result.data } : null);
        setAssignModalOpen(false);
        setSelectedAdvisorId('');
        console.log('Appointment assigned successfully');
      } else {
        throw new Error(result.message || 'Failed to assign appointment');
      }
    } catch (err) {
      console.error('Error assigning appointment:', err);
      setAssignError(err instanceof Error ? err.message : 'Failed to assign appointment');
    } finally {
      setAssignLoading(false);
    }
  };

  // Handle appointment cancellation
  const handleCancel = async () => {
    if (!appointment || !token) {
      setCancelError('Missing appointment or authentication token');
      return;
    }

    setCancelLoading(true);
    setCancelError('');

    try {
      const response = await fetch(`http://localhost:3000/appointments/${appointment.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'CANCELLED'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to cancel appointment: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success) {
        // Update the appointment in local state
        setAppointment(prev => prev ? { ...prev, ...result.data } : null);
        setShowCancelModal(false);
        console.log('Appointment cancelled successfully');
      } else {
        throw new Error(result.message || 'Failed to cancel appointment');
      }
    } catch (err) {
      console.error('Error cancelling appointment:', err);
      setCancelError(err instanceof Error ? err.message : 'Failed to cancel appointment');
    } finally {
      setCancelLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="appointment-detail-page">
        <div className="loading">Loading appointment details...</div>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="appointment-detail-page">
        <div className="error">
          <h2>Error</h2>
          <p>{error || 'Appointment not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="appointment-detail-page">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Appointment Details</h1>
          <p className="page-subtitle">Appointment ID: {appointment.id}</p>
        </div>
        <div className="header-actions">
          {(appointment.status === 'PENDING' || appointment.status === 'CONFIRMED') && (
            <>
              <button
                className="btn btn--primary"
                onClick={() => setAssignModalOpen(true)}
                disabled={assignLoading}
              >
                <i className='bx bx-user-plus'></i> Assign Advisor
              </button>
              <button
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.color = '';
                }}
                className="btn btn--danger"
                onClick={() => setShowCancelModal(true)}
                disabled={cancelLoading}
              >
                <i className='bx bx-x'></i> {cancelLoading ? 'Cancelling...' : 'Cancel Appointment'}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="appointment-content">
        <div className="appointment-card">
          <div className="card-header">
            <h3>Appointment Information</h3>
            <div className="status-badges">
              {getStatusBadge(appointment.status)}
              {getPriorityBadge(appointment.priority)}
            </div>
          </div>

          <div className="card-body">
            <div className="info-grid">
              <div className="info-section">
                <h4>Customer Information</h4>
                <div className="customer-info">
                  {appointment.customer?.profileImage ? (
                    <img
                      src={appointment.customer.profileImage}
                      alt={appointment.customer.name}
                      className="customer-avatar"
                    />
                  ) : (
                    <div className="customer-avatar-placeholder">
                      {(appointment.customer?.name || appointment.customerId || 'C').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="customer-details">
                    <p><strong>Name:</strong> {appointment.customer?.name || appointment.customerId}</p>
                    {appointment.customer?.phone && <p><strong>Phone:</strong> {appointment.customer.phone}</p>}
                    {appointment.customer?.email && <p><strong>Email:</strong> {appointment.customer.email}</p>}
                  </div>
                </div>
              </div>

              <div className="info-section">
                <h4>Assignment Information</h4>
                {appointment.assignedTo ? (
                  <div className="customer-info">
                    {appointment.assignedTo.profileImage ? (
                      <img
                        src={appointment.assignedTo.profileImage}
                        alt={appointment.assignedTo.name}
                        className="advisor-avatar"
                      />
                    ) : (
                      <div className="advisor-avatar-placeholder">
                        {appointment.assignedTo.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="customer-info-details">
                      <p><strong>Service Advisor:</strong> {appointment.assignedTo.name}</p>
                      <p><strong>Employee ID:</strong> {appointment.assignedTo.employeeId}</p>
                      {appointment.assignedTo.phone && <p><strong>Phone:</strong> {appointment.assignedTo.phone}</p>}
                    </div>
                  </div>
                ) : (
                  <div className="assignment-empty-state">
                    <div className="empty-state-icon">
                      <i className='bx bx-user-plus'></i>
                    </div>
                    <div className="empty-state-content">
                      <h5>No Service Advisor Assigned</h5>
                      <p>This appointment hasn't been assigned to a service advisor yet.</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="info-section">
                <h4>Vehicle Information</h4>
                <div className="vehicle-info">
                  {appointment.vehicle?.imageUrl ? (
                    <img
                      src={appointment.vehicle.imageUrl}
                      alt={`${appointment.vehicle.make} ${appointment.vehicle.model}`}
                      className="vehicle-image"
                    />
                  ) : (
                    <div className="vehicle-image-placeholder">
                      <i className='bx bx-car'></i>
                    </div>
                  )}
                  <div className="vehicle-details">
                    {appointment.vehicle ? (
                      <>
                        <p><strong>Make:</strong> {appointment.vehicle.make}</p>
                        <p><strong>Model:</strong> {appointment.vehicle.model}</p>
                        <p><strong>Year:</strong> {appointment.vehicle.year}</p>
                        {appointment.vehicle.licensePlate && <p><strong>License Plate:</strong> {appointment.vehicle.licensePlate}</p>}
                      </>
                    ) : (
                      <p><strong>Vehicle ID:</strong> {appointment.vehicleId}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="info-section">
                <h4>
                  Date and Time Information
                </h4>
                <div className="appointment-details-content">
                  <div className="detail-item">
                    <div className="detail-label">
                      <i className='bx bx-time'></i>
                      Requested At
                    </div>
                    <div className="detail-value">
                      {new Date(appointment.requestedAt).toLocaleString()}
                    </div>
                  </div>

                  <div className="detail-item">
                    <div className="detail-label">
                      <i className='bx bx-calendar-check'></i>
                      Scheduled Time
                    </div>
                    <div className="detail-value">
                      {appointment.startTime ? new Date(appointment.startTime).toLocaleString() : 'Not scheduled'}
                    </div>
                  </div>

                  <div className="detail-item">
                    <div className="detail-label">
                      <i className='bx bx-flag'></i>
                      Priority
                    </div>
                    <div className="detail-value">
                      {getPriorityBadge(appointment.priority)}
                    </div>
                  </div>

                  {appointment.notes && (
                    <div className="detail-item detail-item--full">
                      <div className="detail-label">
                        <i className='bx bx-note'></i>
                        Notes
                      </div>
                      <div className="detail-value detail-value--notes">
                        {appointment.notes}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {appointment.cannedServices && appointment.cannedServices.length > 0 && (
              <div className="services-section">
                <h4>Requested Services</h4>
                <div className="services-list">
                  {appointment.cannedServices.map((service, index) => (
                    <div key={service.id || index} className="service-card">
                      <div className="service-card-header">
                        <h5>{service.name}</h5>
                        <a
                          href={`http://localhost:5173/manager/service/${service.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="service-view-btn"
                        >
                          <i className='bx bx-show'></i> View
                        </a>
                      </div>
                      <div className="service-card-body">
                        <p><strong>Duration:</strong> {service.duration} minutes</p>
                        {service.notes && <p><strong>Notes:</strong> {service.notes}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Service History Section */}
            <div className="service-history-section">
              <h4>
                Service History
              </h4>
              {serviceHistoryLoading ? (
                <div className="loading-history">Loading service history...</div>
              ) : serviceHistoryError ? (
                <div className="error-history">{serviceHistoryError}</div>
              ) : serviceHistory.length > 0 ? (
                <div className="history-list">
                  {serviceHistory.map((item, index) => (
                    <div key={item.workOrderId || index} className="history-item">
                      <div className="history-header">
                        <h5>{item.workOrderNumber}</h5>
                        <span className="completion-date">
                          {new Date(item.completedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="history-body">
                        <div className="vehicle-summary">
                          <p><strong>Vehicle:</strong> {item.vehicle.year} {item.vehicle.make} {item.vehicle.model}</p>
                          <p><strong>License Plate:</strong> {item.vehicle.licensePlate}</p>
                        </div>

                        {item.services.length > 0 && (
                          <div className="services-summary">
                            <h6>Services Performed:</h6>
                            <ul>
                              {item.services.map((service, serviceIndex) => (
                                <li key={service.id || serviceIndex}>
                                  {service.name} ({service.code}) - Qty: {service.quantity}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {item.inspections.length > 0 && (
                          <div className="inspections-summary">
                            <h6>Inspections:</h6>
                            <ul>
                              {item.inspections.map((inspection, inspectionIndex) => (
                                <li key={inspection.id || inspectionIndex}>
                                  {inspection.templateName} - {inspection.inspector} ({new Date(inspection.date).toLocaleDateString()})
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="service-history-empty-state">
                  <div className="empty-state-icon">
                    <i className='bx bx-history'></i>
                  </div>
                  <div className="empty-state-content">
                    <h5>No Service History Available</h5>
                    <p>This customer doesn't have any previous service records in our system.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Assignment Modal */}
      {assignModalOpen && (
        <div className="assign-modal-overlay" onClick={() => setAssignModalOpen(false)}>
          <div className="assign-modal-content" onClick={e => e.stopPropagation()}>
            <div className="assign-modal-header">
              <h3>Assign Service Advisor</h3>
              <button className="btn-icon" onClick={() => setAssignModalOpen(false)}>
                <i className='bx bx-x'></i>
              </button>
            </div>
            <div className="assign-modal-body">
              {!appointment?.startTime ? (
                <div className="no-schedule-message">
                  <p>Appointment must be scheduled to check advisor availability.</p>
                  <p>Please schedule the appointment first before assigning an advisor.</p>
                </div>
              ) : availabilityLoading ? (
                <div className="loading-advisors">
                  <p>Loading advisor availability...</p>
                </div>
              ) : availabilityError ? (
                <div className="error-message">
                  {availabilityError}
                </div>
              ) : advisorAvailability.length > 0 ? (
                <div className="advisors-grid">
                  <h4>Select a Service Advisor</h4>
                  <div className="advisors-cards">
                    {advisorAvailability.map(advisor => (
                      <div
                        key={advisor.advisorId}
                        className={`advisor-card ${selectedAdvisorId === advisor.advisorId ? 'selected' : ''} ${advisor.isAvailable ? 'available' : 'busy'}`}
                        onClick={() => setSelectedAdvisorId(advisor.advisorId)}
                      >
                        <div className="advisor-card-header">
                          {advisor.profileImage ? (
                            <img
                              src={advisor.profileImage}
                              alt={advisor.name}
                              className="advisor-avatar"
                            />
                          ) : (
                            <div className="advisor-avatar-placeholder">
                              {advisor.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="advisor-info">
                            <h5>{advisor.name}</h5>
                            <p className="employee-id">{advisor.employeeId}</p>
                          </div>
                          <div className="availability-indicator">
                            <span className={`status-badge ${advisor.isAvailable ? 'available' : 'busy'}`}>
                              {advisor.isAvailable ? 'Available' : 'Busy'}
                            </span>
                          </div>
                        </div>

                        <div className="advisor-card-body">
                          {advisor.currentAppointment && (
                            <div className="current-appointment">
                              <p><strong>Current:</strong> {advisor.currentAppointment.customerName}</p>
                              <p><strong>Vehicle:</strong> {advisor.currentAppointment.vehicleInfo}</p>
                              <p><strong>Time:</strong> {new Date(advisor.currentAppointment.startTime).toLocaleString()}</p>
                            </div>
                          )}

                          {!advisor.hasNeverBeenAssigned && (
                            <div className="last-assignment">
                              <p><strong>Last Assignment:</strong> {new Date(advisor.lastAssignedAt).toLocaleDateString()}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="no-advisors">
                  <p>No advisors available at this time.</p>
                </div>
              )}

              {assignError && (
                <div className="error-message" style={{ color: 'red', marginTop: '10px' }}>
                  {assignError}
                </div>
              )}
            </div>
            <div className="assign-modal-footer">
              <button
                className="btn btn--secondary"
                onClick={() => setAssignModalOpen(false)}
                disabled={assignLoading}
              >
                Cancel
              </button>
              <button
                className="btn btn--primary"
                onClick={handleAssign}
                disabled={assignLoading || !selectedAdvisorId}
              >
                {assignLoading ? 'Assigning...' : 'Assign Advisor'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="cancel-modal-overlay" onClick={() => setShowCancelModal(false)}>
          <div className="cancel-modal-content" onClick={e => e.stopPropagation()}>
            <div className="cancel-modal-header">
              <div className="cancel-modal-icon">
                <i className='bx bx-x-circle'></i>
              </div>
              <h3>Cancel</h3>
              
            </div>
            <div className="cancel-modal-body">

              <p className="modal-description">Are you sure you want to cancel this appointment? <br></br> This action cannot be undone.</p>

              {appointment?.customer?.name && (
                <div className="appointment-summary">
                  <p><strong >Customer:</strong> {appointment.customer.name}</p>
                  {appointment.vehicle && (
                    <p><strong style={{marginRight: '44px'}}>Vehicle:</strong> {appointment.vehicle.year} {appointment.vehicle.make} {appointment.vehicle.model}</p>
                  )}
                  {appointment.startTime && (
                    <p><strong>Scheduled:</strong> {new Date(appointment.startTime).toLocaleString()}</p>
                  )}
                </div>
              )}

              
            </div>
            <div className="cancel-modal-footer">
              <button
                className="btn btn--secondary"
                onClick={() => setShowCancelModal(false)}
                disabled={cancelLoading}
              >
                Keep Appointment
              </button>
              <button
                className="btn btn--danger"
                onClick={handleCancel}
                disabled={cancelLoading}
              >
                {cancelLoading ? 'Cancelling...' : 'Cancel Appointment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {cancelError && (
        <div className="error-banner">
          <p>{cancelError}</p>
        </div>
      )}
    </div>
  );
};

export default AppointmentDetailPage;