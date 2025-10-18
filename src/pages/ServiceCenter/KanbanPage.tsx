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
  const [createWorkOrderModalOpen, setCreateWorkOrderModalOpen] = useState(false);
  const [availableAppointments, setAvailableAppointments] = useState<any[]>([]);
  const [currentServiceAdvisor, setCurrentServiceAdvisor] = useState<any>(null);
  const [workOrderForm, setWorkOrderForm] = useState({
    customerId: '',
    vehicleId: '',
    appointmentId: '',
    advisorId: '',
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

  // Fetch confirmed appointments without work orders
  const fetchAvailableAppointments = async () => {
    if (!token) {
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/appointments/confirmed-without-work-orders', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch available appointments: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setAvailableAppointments(data.data);
      }
    } catch (err) {
      console.error('Error fetching available appointments:', err);
    }
  };

  const handleCreateWorkOrder = () => {
    setCreateWorkOrderModalOpen(true);
    fetchAvailableAppointments();
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
        cannedServiceIds: appointment.cannedServices?.map(s => s.id) || [],
        quantities: appointment.cannedServices?.map(s => s.quantity) || [],
        prices: appointment.cannedServices?.map(s => s.price) || [],
        serviceNotes: appointment.cannedServices?.map(s => s.notes || '') || []
      }));
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
          advisorId: '',
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
        console.log('Work order created successfully');
      } else {
        throw new Error(result.message || 'Failed to create work order');
      }
    } catch (err) {
      console.error('Error creating work order:', err);
      setWorkOrderError(err instanceof Error ? err.message : 'Failed to create work order');
    } finally {
      setWorkOrderLoading(false);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedWorkOrder(null);
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
          <button className="action-btn primary" onClick={handleCreateWorkOrder}>
            <i className="bx bx-plus"></i>
            Create Work Order
          </button>
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
        <div className="modal-overlay" onClick={() => setCreateWorkOrderModalOpen(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ backgroundColor: 'white', borderRadius: '8px', maxWidth: '800px', width: '90%', maxHeight: '90vh', overflow: 'auto' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>Create Work Order</h3>
              <button onClick={() => setCreateWorkOrderModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', padding: '0', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className='bx bx-x'></i>
              </button>
            </div>
            <div style={{ padding: '24px' }}>
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '500' }}>Link Appointment</h4>
                <div style={{ marginBottom: '16px' }}>
                  <label htmlFor="appointmentSelect" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Select Appointment</label>
                  <select
                    id="appointmentSelect"
                    value={workOrderForm.appointmentId}
                    onChange={(e) => handleAppointmentSelect(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '14px' }}
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
                  <div style={{ marginTop: '16px', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
                    <h5 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '500', color: '#374151' }}>Manual Entry (No Appointment Selected)</h5>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                      <div>
                        <label htmlFor="customerId" style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>Customer ID</label>
                        <input
                          type="text"
                          id="customerId"
                          value={workOrderForm.customerId}
                          onChange={(e) => setWorkOrderForm(prev => ({ ...prev, customerId: e.target.value }))}
                          style={{ width: '100%', padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '13px' }}
                          placeholder="Enter customer ID"
                        />
                      </div>
                      <div>
                        <label htmlFor="vehicleId" style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>Vehicle ID</label>
                        <input
                          type="text"
                          id="vehicleId"
                          value={workOrderForm.vehicleId}
                          onChange={(e) => setWorkOrderForm(prev => ({ ...prev, vehicleId: e.target.value }))}
                          style={{ width: '100%', padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '13px' }}
                          placeholder="Enter vehicle ID"
                        />
                      </div>
                      <div>
                        <label htmlFor="advisorId" style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500' }}>Advisor ID</label>
                        <input
                          type="text"
                          id="advisorId"
                          value={workOrderForm.advisorId || currentServiceAdvisor?.id || ''}
                          onChange={(e) => setWorkOrderForm(prev => ({ ...prev, advisorId: e.target.value }))}
                          style={{ width: '100%', padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '13px' }}
                          placeholder={currentServiceAdvisor?.id ? `Auto-filled: ${currentServiceAdvisor.id}` : "Enter advisor ID"}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '500' }}>Work Order Details</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label htmlFor="jobType" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Job Type</label>
                    <select
                      id="jobType"
                      value={workOrderForm.jobType}
                      onChange={(e) => setWorkOrderForm(prev => ({ ...prev, jobType: e.target.value }))}
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '14px' }}
                    >
                      <option value="REPAIR">Repair</option>
                      <option value="MAINTENANCE">Maintenance</option>
                      <option value="INSPECTION">Inspection</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="priority" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Priority</label>
                    <select
                      id="priority"
                      value={workOrderForm.priority}
                      onChange={(e) => setWorkOrderForm(prev => ({ ...prev, priority: e.target.value }))}
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '14px' }}
                    >
                      <option value="LOW">Low</option>
                      <option value="NORMAL">Normal</option>
                      <option value="HIGH">High</option>
                      <option value="URGENT">Urgent</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label htmlFor="complaint" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Customer Complaint</label>
                  <textarea
                    id="complaint"
                    value={workOrderForm.complaint}
                    onChange={(e) => setWorkOrderForm(prev => ({ ...prev, complaint: e.target.value }))}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '14px', minHeight: '80px', resize: 'vertical' }}
                    placeholder="Describe the customer's complaint..."
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label htmlFor="odometerReading" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Odometer Reading</label>
                    <input
                      type="number"
                      id="odometerReading"
                      value={workOrderForm.odometerReading}
                      onChange={(e) => setWorkOrderForm(prev => ({ ...prev, odometerReading: e.target.value }))}
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '14px' }}
                      placeholder="e.g., 50000"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label htmlFor="internalNotes" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Internal Notes</label>
                    <textarea
                      id="internalNotes"
                      value={workOrderForm.internalNotes}
                      onChange={(e) => setWorkOrderForm(prev => ({ ...prev, internalNotes: e.target.value }))}
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '14px', minHeight: '60px', resize: 'vertical' }}
                      placeholder="Internal notes for technicians..."
                    />
                  </div>

                  <div>
                    <label htmlFor="customerNotes" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Customer Notes</label>
                    <textarea
                      id="customerNotes"
                      value={workOrderForm.customerNotes}
                      onChange={(e) => setWorkOrderForm(prev => ({ ...prev, customerNotes: e.target.value }))}
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '14px', minHeight: '60px', resize: 'vertical' }}
                      placeholder="Notes visible to customer..."
                    />
                  </div>
                </div>

                {workOrderError && (
                  <div style={{ color: '#ef4444', marginTop: '16px', padding: '12px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '4px', fontSize: '14px' }}>
                    {workOrderError}
                  </div>
                )}
              </div>
            </div>
            <div style={{ padding: '16px 24px', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setCreateWorkOrderModalOpen(false)}
                disabled={workOrderLoading}
                style={{ padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: '4px', backgroundColor: 'white', color: '#374151', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button 
                onClick={handleWorkOrderSubmit}
                disabled={workOrderLoading || !workOrderForm.customerId || !workOrderForm.vehicleId}
                style={{ padding: '8px 16px', border: 'none', borderRadius: '4px', backgroundColor: workOrderLoading || !workOrderForm.customerId || !workOrderForm.vehicleId ? '#9ca3af' : '#3b82f6', color: 'white', fontSize: '14px', fontWeight: '500', cursor: workOrderLoading || !workOrderForm.customerId || !workOrderForm.vehicleId ? 'not-allowed' : 'pointer' }}
              >
                {workOrderLoading ? 'Creating...' : 'Create Work Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default KanbanPage;