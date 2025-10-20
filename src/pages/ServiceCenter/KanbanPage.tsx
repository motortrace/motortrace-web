import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import KanbanBoard from '../../components/KanbanBoard/KanbanBoard';
import { ClipboardList, AlertCircle } from 'lucide-react';
import './KanbanPage.scss';
import ManageWorkOrderModal from '../../components/ManageWorkOrderModal';
import { type WorkOrder, getWorkOrders, updateWorkOrderWorkflowStep } from '../../utils/workOrdersApi';
import { useAuth } from '../../hooks/useAuth';

const KanbanPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter] = useState<string>('');
  const [technicianFilter] = useState<string>('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(null);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Work order creation state
  const { token } = useAuth();
  const loggedInUser = JSON.parse(localStorage.getItem('user') || 'null');
  const [createWorkOrderModalOpen, setCreateWorkOrderModalOpen] = useState(false);
  const [availableAppointments, setAvailableAppointments] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [customerVehicles, setCustomerVehicles] = useState<any[]>([]);
  const [currentServiceAdvisor, setCurrentServiceAdvisor] = useState<any>(null);
  const [workOrderForm, setWorkOrderForm] = useState({
    customerId: '',
    vehicleId: '',
    appointmentId: '',
    advisorId: loggedInUser?.id || '',
    status: 'PENDING',
    jobType: 'REPAIR',
    priority: 'NORMAL',
    source: 'APPOINTMENT',
    complaint: '',
    odometerReading: '',
    internalNotes: '',
    customerNotes: '',
    cannedServiceIds: [] as string[],
    quantities: [] as number[],
    prices: [] as number[],
    serviceNotes: [] as string[]
  });
  const [workOrderLoading, setWorkOrderLoading] = useState(false);
  const [workOrderError, setWorkOrderError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // Get the base path from current location (e.g., '/serviceadvisor', '/manager', etc.)
  const getBasePath = () => {
    const pathSegments = window.location.pathname.split('/');
    return `/${pathSegments[1]}`; // Gets the first segment after the root
  };

  // Fetch current service advisor details
  const fetchCurrentServiceAdvisor = async () => {
    if (!token) {
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/auth/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch service advisor details: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setCurrentServiceAdvisor(data.data);
        console.log('Current service advisor:', data.data);
      }
    } catch (err) {
      console.error('Error fetching service advisor details:', err);
    }
  };

  // Fetch work orders from backend
  useEffect(() => {
    const fetchWorkOrders = async () => {
      try {
        setError(null);
        
        // First fetch the current service advisor details
        await fetchCurrentServiceAdvisor();
        
        // Then fetch work orders
        const response = await getWorkOrders();
        let allWorkOrders = response.data || response;
        
        // Filter work orders to show only those assigned to current service advisor
        if (currentServiceAdvisor?.id) {
          allWorkOrders = allWorkOrders.filter((workOrder: WorkOrder) => 
            workOrder.advisorId === currentServiceAdvisor.id
          );
        }
        
        setWorkOrders(allWorkOrders);
      } catch (err) {
        console.error('Failed to fetch work orders:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch work orders');
      }
    };

    fetchWorkOrders();
  }, [currentServiceAdvisor?.id]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleCardMove = async (cardId: string, newWorkflowStep: WorkOrder['workflowStep']) => {
    try {
      // Update the work order workflowStep in the backend
      await updateWorkOrderWorkflowStep(cardId, newWorkflowStep);
      
      // Update local state optimistically
      setWorkOrders(prev =>
        prev.map(item =>
          item.id === cardId
            ? { ...item, workflowStep: newWorkflowStep }
            : item
        )
      );
    } catch (err) {
      console.error('Failed to update work order workflowStep:', err);
      setError(err instanceof Error ? err.message : 'Failed to update work order workflowStep');
    }
  };

  const handleCardClick = (workOrder: WorkOrder) => {
    setSelectedWorkOrder(workOrder);
    setModalOpen(true);
  };

  // Fetch customers
  const fetchCustomers = async () => {
    if (!token) {
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/customers', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch customers: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        setCustomers(data.data);
      }
    } catch (err) {
      console.error('Error fetching customers:', err);
    }
  };

  // Fetch customer vehicles
  const fetchCustomerVehicles = async (customerId: string) => {
    if (!token || !customerId) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/customers/${customerId}/vehicles`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch customer vehicles: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        setCustomerVehicles(data.data);
      }
    } catch (err) {
      console.error('Error fetching customer vehicles:', err);
    }
  };

  // Fetch appointments
  const fetchAvailableAppointments = async () => {
    if (!token) {
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/appointments', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch appointments: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        // Filter for confirmed appointments without work orders if needed
        const filteredAppointments = data.data.filter((appointment: any) =>
          appointment.status === 'CONFIRMED' && !appointment.workOrderId
        );
        setAvailableAppointments(filteredAppointments);
      }
    } catch (err) {
      console.error('Error fetching appointments:', err);
    }
  };

  const handleCreateWorkOrder = () => {
    setCreateWorkOrderModalOpen(true);
    fetchAvailableAppointments();
    fetchCustomers();
    setWorkOrderError('');
  };

  const handleAppointmentSelect = (appointmentId: string) => {
    if (appointmentId === '') {
      // Reset to manual entry
      setWorkOrderForm(prev => ({
        ...prev,
        appointmentId: '',
        customerId: '',
        vehicleId: '',
        advisorId: currentServiceAdvisor?.id || '',
        complaint: '',
        cannedServiceIds: [],
        quantities: [],
        prices: [],
        serviceNotes: []
      }));
      setCustomerVehicles([]);
      return;
    }

    const appointment = availableAppointments.find(apt => apt.id === appointmentId);
    if (appointment) {
      setWorkOrderForm(prev => ({
        ...prev,
        appointmentId: appointment.id,
        customerId: appointment.customerId,
        vehicleId: appointment.vehicleId,
        advisorId: appointment.assignedToId || currentServiceAdvisor?.id || '',
        complaint: appointment.notes || '',
        cannedServiceIds: appointment.cannedServices?.map((s: any) => s.id) || [],
        quantities: appointment.cannedServices?.map((s: any) => s.quantity) || [],
        prices: appointment.cannedServices?.map((s: any) => s.price) || [],
        serviceNotes: appointment.cannedServices?.map((s: any) => s.notes || '') || []
      }));
      // Fetch vehicles for the selected customer
      fetchCustomerVehicles(appointment.customerId);
    }
  };

  const handleCustomerSelect = (customerId: string) => {
    setWorkOrderForm(prev => ({
      ...prev,
      customerId,
      vehicleId: '',
      appointmentId: '' // Reset appointment when customer changes
    }));
    if (customerId) {
      fetchCustomerVehicles(customerId);
    } else {
      setCustomerVehicles([]);
    }
  };

  const handleWorkOrderSubmit = async () => {
    if (!token) {
      setWorkOrderError('No access token available');
      return;
    }

    setWorkOrderLoading(true);
    setWorkOrderError('');

    try {
      const workOrderData = {
        customerId: workOrderForm.customerId,
        vehicleId: workOrderForm.vehicleId,
        appointmentId: workOrderForm.appointmentId === '' ? null : workOrderForm.appointmentId,
        advisorId: workOrderForm.advisorId,
        status: workOrderForm.status,
        jobType: workOrderForm.jobType,
        priority: workOrderForm.priority,
        source: workOrderForm.source,
        complaint: workOrderForm.complaint,
        odometerReading: workOrderForm.odometerReading ? parseInt(workOrderForm.odometerReading) : undefined,
        internalNotes: workOrderForm.internalNotes,
        customerNotes: workOrderForm.customerNotes,
        cannedServiceIds: workOrderForm.cannedServiceIds,
        quantities: workOrderForm.quantities,
        prices: workOrderForm.prices,
        serviceNotes: workOrderForm.serviceNotes
      };

      const response = await fetch('http://localhost:3000/work-orders', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workOrderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to create work order: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.success) {
        // Refresh work orders list
        const fetchWorkOrders = async () => {
          try {
            const response = await getWorkOrders();
            let allWorkOrders = response.data || response;

            // Filter work orders to show only those assigned to current service advisor
            if (currentServiceAdvisor?.id) {
              allWorkOrders = allWorkOrders.filter((workOrder: WorkOrder) =>
                workOrder.advisorId === currentServiceAdvisor.id
              );
            }

            setWorkOrders(allWorkOrders);
          } catch (err) {
            console.error('Failed to refresh work orders:', err);
          }
        };
        fetchWorkOrders();

        // Close modal and reset form
        setCreateWorkOrderModalOpen(false);
        setWorkOrderForm({
          customerId: '',
          vehicleId: '',
          appointmentId: '',
          advisorId: loggedInUser?.id || '',
          status: 'PENDING',
          jobType: 'REPAIR',
          priority: 'NORMAL',
          source: 'APPOINTMENT',
          complaint: '',
          odometerReading: '',
          internalNotes: '',
          customerNotes: '',
          cannedServiceIds: [],
          quantities: [],
          prices: [],
          serviceNotes: []
        });

        // Show success modal and close work order modal
        setModalMessage('Work order created successfully!');
        setShowSuccessModal(true);
        setCreateWorkOrderModalOpen(false); // Close the work order modal
        console.log('Work order created successfully');
      } else {
        throw new Error(result.message || 'Failed to create work order');
      }
    } catch (err) {
      console.error('Error creating work order:', err);
      let errorMessage = 'Failed to create work order';

      if (err instanceof Error) {
        // Handle specific error cases with user-friendly messages
        if (err.message.includes('Unique constraint failed on the fields: (`appointmentId`)')) {
          errorMessage = 'A work order already exists for this appointment. Please select a different appointment or create a manual work order.';
        } else if (err.message.includes('appointmentId')) {
          errorMessage = 'This appointment already has a work order associated with it.';
        } else {
          errorMessage = err.message;
        }
      }

      setWorkOrderError(errorMessage);
      setModalMessage(errorMessage);
      setShowErrorModal(true);
    } finally {
      setWorkOrderLoading(false);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedWorkOrder(null);
  };

  const handleCreateWorkOrderModalClose = () => {
    setCreateWorkOrderModalOpen(false);
    setWorkOrderForm({
      customerId: '',
      vehicleId: '',
      appointmentId: '',
      advisorId: loggedInUser?.id || '',
      status: 'PENDING',
      jobType: 'REPAIR',
      priority: 'NORMAL',
      source: 'APPOINTMENT',
      complaint: '',
      odometerReading: '',
      internalNotes: '',
      customerNotes: '',
      cannedServiceIds: [] as string[],
      quantities: [] as number[],
      prices: [] as number[],
      serviceNotes: [] as string[]
    });
    setWorkOrderError('');
  };

  const handleViewHistory = () => {
    const basePath = getBasePath();
    navigate(`${basePath}/work-order`);
  };

  // Icon/color helpers for work order (optional, can be customized)
  const getTypeIcon = () => <ClipboardList size={16} />;
  const getTypeColor = () => '#3b82f6';
  const getPriorityColor = (priority: WorkOrder['priority']) => {
    switch (priority) {
      case 'HIGH':
        return '#ef4444';
      case 'MEDIUM':
        return '#f59e0b';
      case 'LOW':
        return '#10b981';
      case 'NORMAL':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  // Kanban columns for work order stages (mapped to backend workflowStep)
  const columns: { id: WorkOrder['workflowStep']; title: string; color: string }[] = [
    { id: 'RECEIVED', title: 'Received', color: '#6B7280' },
    { id: 'INSPECTION', title: 'Inspection', color: '#f59e0b' },
    { id: 'ESTIMATE', title: 'Estimate', color: '#10B981' },
    // { id: 'APPROVAL', title: 'Approval', color: '#3B82F6' }, // Hidden
    { id: 'REPAIR', title: 'Repair', color: '#8b5cf6' },
    { id: 'QC', title: 'QC', color: '#059669' },
    { id: 'READY', title: 'Ready', color: '#dc2626' },
    // { id: 'CLOSED', title: 'Closed', color: '#16a34a' }, // Hidden
  ];

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <AlertCircle size={24} />
          <span>{error}</span>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Work Orders</h1>
          <p className="page-subtitle">Manage and track work order progress</p>
        </div>
        <div className="header-actions">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search work orders..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="search-input"
            />
          </div>
          <button className="action-btn secondary" onClick={handleViewHistory}>
            <i className="bx bx-history"></i>
            View History
          </button>
          {window.location.pathname.includes('/serviceadvisor/workflow') && (
            <button className="action-btn primary" onClick={handleCreateWorkOrder}>
              <i className="bx bx-plus"></i>
              Create Work Order
            </button>
          )}
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
        onCardClick={handleCardClick}
      />

      <ManageWorkOrderModal
        open={modalOpen}
        onClose={handleModalClose}
        workOrder={selectedWorkOrder}
      />

      {/* Work Order Creation Modal */}
      {createWorkOrderModalOpen && (
        <div className="work-order-modal__overlay" onClick={handleCreateWorkOrderModalClose}>
          <div className="work-order-modal" onClick={e => e.stopPropagation()}>
            <div className="work-order-modal__header">
              <div className="work-order-modal__title-wrapper">
                <h2>Create Work Order</h2>
                <p className="work-order-modal__subtitle">
                  Configure a new work order for your service center operations
                </p>
              </div>
              <button
                className="work-order-modal__close-icon"
                onClick={handleCreateWorkOrderModalClose}
                type="button"
              >
                ×
              </button>
            </div>

            <div className="work-order-modal__body">
              <form className="work-order-form" onSubmit={(e) => { e.preventDefault(); handleWorkOrderSubmit(); }}>
                {/* {workOrderError && (
                  <div className="work-order-form__error">
                    {workOrderError}
                  </div>
                )} */}

                <div className="work-order-form__grid">
                  <div className="work-order-form__section">
                    <h3 className="work-order-form__section-title">Link Appointment</h3>

                    <div className="work-order-form__group">
                      <label htmlFor="appointmentSelect">
                        Select Appointment
                      </label>
                      <select
                        id="appointmentSelect"
                        value={workOrderForm.appointmentId}
                        onChange={(e) => handleAppointmentSelect(e.target.value)}
                      >
                        <option value="">Select an appointment to link...</option>
                        {availableAppointments.map(appointment => (
                          <option key={appointment.id} value={appointment.id}>
                            {appointment.customer?.name || appointment.customerId} - {appointment.vehicle ? `${appointment.vehicle.year} ${appointment.vehicle.make} ${appointment.vehicle.model}` : appointment.vehicleId}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Manual Entry Fields - Show when no appointment selected */}
                    {!workOrderForm.appointmentId && (
                      <div style={{ marginTop: '24px', padding: '20px', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                        <h4 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: '600', color: '#374151' }}>Manual Entry (No Appointment Selected)</h4>
                        <div className="work-order-form__row work-order-form__row--two-col">
                          <div className="work-order-form__group">
                            <label htmlFor="customerId">
                              Customer <span className="work-order-form__required">*</span>
                            </label>
                            <select
                              id="customerId"
                              value={workOrderForm.customerId}
                              onChange={(e) => handleCustomerSelect(e.target.value)}
                              required
                            >
                              <option value="">Select a customer...</option>
                              {customers.map(customer => (
                                <option key={customer.id} value={customer.id}>
                                  {customer.userProfile?.name || 'Unknown'} - {customer.userProfile?.email || 'No email'}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="work-order-form__group">
                            <label htmlFor="vehicleId">
                              Vehicle <span className="work-order-form__required">*</span>
                            </label>
                            <select
                              id="vehicleId"
                              value={workOrderForm.vehicleId}
                              onChange={(e) => setWorkOrderForm(prev => ({ ...prev, vehicleId: e.target.value }))}
                              disabled={!workOrderForm.customerId}
                              required
                            >
                              <option value="">
                                {workOrderForm.customerId ? 'Select a vehicle...' : 'Please select customer first'}
                              </option>
                              {customerVehicles.map(vehicle => (
                                <option key={vehicle.id} value={vehicle.id}>
                                  {vehicle.year} {vehicle.make} {vehicle.model} - {vehicle.licensePlate}
                                </option>
                              ))}
                            </select>

                            {/* To store and pass the service advisor id */}
                            <input
                              type="hidden"
                              id="advisorId"
                              value={workOrderForm.advisorId || currentServiceAdvisor?.id || ''}
                              disabled
                              placeholder={currentServiceAdvisor?.id ? `Auto-filled: ${currentServiceAdvisor.id}` : "Enter advisor ID"}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="work-order-form__section">
                    <h3 className="work-order-form__section-title">Work Order Details</h3>

                    <div className="work-order-form__row work-order-form__row--two-col">
                      <div className="work-order-form__group">
                        <label htmlFor="jobType">
                          Job Type <span className="work-order-form__required">*</span>
                        </label>
                        <select
                          id="jobType"
                          value={workOrderForm.jobType}
                          onChange={(e) => setWorkOrderForm(prev => ({ ...prev, jobType: e.target.value }))}
                          required
                        >
                          <option value="REPAIR">Repair</option>
                          <option value="MAINTENANCE">Maintenance</option>
                          <option value="INSPECTION">Inspection</option>
                        </select>
                      </div>

                      <div className="work-order-form__group">
                        <label htmlFor="priority">
                          Priority <span className="work-order-form__required">*</span>
                        </label>
                        <select
                          id="priority"
                          value={workOrderForm.priority}
                          onChange={(e) => setWorkOrderForm(prev => ({ ...prev, priority: e.target.value }))}
                          required
                        >
                          <option value="LOW">Low</option>
                          <option value="NORMAL">Normal</option>
                          <option value="HIGH">High</option>
                          <option value="URGENT">Urgent</option>
                        </select>
                      </div>
                    </div>

                    <div className="work-order-form__group">
                      <label htmlFor="complaint">
                        Customer Complaint <span className="work-order-form__required">*</span>
                      </label>
                      <textarea
                        id="complaint"
                        value={workOrderForm.complaint}
                        onChange={(e) => setWorkOrderForm(prev => ({ ...prev, complaint: e.target.value }))}
                        placeholder="Describe the customer's complaint..."
                        required
                        style={{ resize: 'none' }}
                      />
                    </div>

                    <div className="work-order-form__row work-order-form__row--two-col">
                      <div className="work-order-form__group">
                        <label htmlFor="odometerReading">
                          Odometer Reading
                        </label>
                        <input
                          type="number"
                          id="odometerReading"
                          value={workOrderForm.odometerReading}
                          onChange={(e) => setWorkOrderForm(prev => ({ ...prev, odometerReading: e.target.value }))}
                          placeholder="e.g., 50000"
                        />
                      </div>
                    </div>

                    <div className="work-order-form__row work-order-form__row--two-col">
                      <div className="work-order-form__group">
                        <label htmlFor="internalNotes">
                          Internal Notes
                        </label>
                        <textarea
                          id="internalNotes"
                          value={workOrderForm.internalNotes}
                          onChange={(e) => setWorkOrderForm(prev => ({ ...prev, internalNotes: e.target.value }))}
                          placeholder="Internal notes for technicians..."
                          style={{ resize: 'none' }}
                        />
                      </div>

                      <div className="work-order-form__group">
                        <label htmlFor="customerNotes">
                          Customer Notes
                        </label>
                        <textarea
                          id="customerNotes"
                          value={workOrderForm.customerNotes}
                          onChange={(e) => setWorkOrderForm(prev => ({ ...prev, customerNotes: e.target.value }))}
                          placeholder="Notes visible to customer..."
                          style={{ resize: 'none' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="work-order-form__actions">
                  <button
                    type="button"
                    className="work-order-form__btn work-order-form__btn--secondary"
                    onClick={handleCreateWorkOrderModalClose}
                    disabled={workOrderLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="work-order-form__btn work-order-form__btn--primary"
                    disabled={workOrderLoading || !workOrderForm.customerId || !workOrderForm.vehicleId}
                  >
                    {workOrderLoading ? 'Creating...' : 'Create Work Order'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="work-order-modal__overlay" onClick={() => setShowSuccessModal(false)}>
          <div className="work-order-modal" onClick={e => e.stopPropagation()}>
            <div className="work-order-modal__header">
              <div className="work-order-modal__title-wrapper">
                <h2>Success</h2>
              </div>
              <button
                className="work-order-modal__close-icon"
                onClick={() => setShowSuccessModal(false)}
                type="button"
              >
                ×
              </button>
            </div>
            <div className="work-order-modal__body">
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{ fontSize: '48px', color: '#10b981', marginBottom: '16px' }}>✓</div>
                <p style={{ fontSize: '16px', color: '#374151', margin: 0 }}>{modalMessage}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div className="work-order-modal__overlay" onClick={() => setShowErrorModal(false)}>
          <div className="work-order-modal" onClick={e => e.stopPropagation()}>
            <div className="work-order-modal__header">
              <div className="work-order-modal__title-wrapper">
                <h2>Error</h2>
              </div>
              <button
                className="work-order-modal__close-icon"
                onClick={() => setShowErrorModal(false)}
                type="button"
              >
                ×
              </button>
            </div>
            <div className="work-order-modal__body">
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div style={{ fontSize: '48px', color: '#ef4444', marginBottom: '16px' }}>✕</div>
                <p style={{ fontSize: '16px', color: '#374151', margin: 0 }}>{modalMessage}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default KanbanPage;