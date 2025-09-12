// src/components/WorkOrder/EditWorkOrder/EditWorkOrderModal.tsx
import React, { useState, useEffect } from 'react';
import type { WorkOrder, UpdateWorkOrderRequest, CannedService } from '../../../types/WorkOrderTypes/WorkOrder';
import { WorkOrderStatus, JobType, JobPriority, WarrantyStatus, WorkflowStep } from '../../../types/WorkOrderTypes/enums';
import { workOrderService } from '../../../services/workOrderService';
import { cannedServiceService } from '../../../services/cannedServiceService';
import { toastService } from '../../../services/toastService';
import './EditWorkOrderModal.scss';

interface EditWorkOrderModalProps {
  open: boolean;
  onClose: () => void;
  workOrder: WorkOrder;
  onWorkOrderUpdated?: (workOrder: WorkOrder) => void;
  onError?: (error: string) => void;
}

interface EditableService {
  id?: string;
  serviceId: string;
  quantity: number;
  price: number;
  notes: string;
  isNew?: boolean;
}

const EditWorkOrderModal: React.FC<EditWorkOrderModalProps> = ({
  open,
  onClose,
  workOrder,
  onWorkOrderUpdated,
  onError
}) => {
  const [formData, setFormData] = useState<UpdateWorkOrderRequest>({});
  const [cannedServices, setCannedServices] = useState<CannedService[]>([]);
  const [editableServices, setEditableServices] = useState<EditableService[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialFormData, setInitialFormData] = useState<UpdateWorkOrderRequest>({});

  // Initialize form data and services when modal opens
  useEffect(() => {
    if (open && workOrder) {
      initializeFormData();
      fetchCannedServices();
      initializeServices();
    }
  }, [open, workOrder]);

  const initializeFormData = () => {
    const initialData = {
      status: workOrder.status,
      jobType: workOrder.jobType,
      priority: workOrder.priority,
      complaint: workOrder.complaint || '',
      odometerReading: workOrder.odometerReading || 0,
      warrantyStatus: workOrder.warrantyStatus,
      estimatedTotal: workOrder.estimatedTotal || 0,
      estimateNotes: workOrder.estimateNotes || '',
      internalNotes: workOrder.internalNotes || '',
      customerNotes: workOrder.customerNotes || '',
      workflowStep: workOrder.workflowStep,
    };
    
    setFormData(initialData);
    setInitialFormData(initialData);
  };

  const initializeServices = () => {
    const services = workOrder.services?.map(service => ({
      id: service.id,
      serviceId: service.cannedServiceId,
      quantity: service.quantity,
      price: service.unitPrice,
      notes: service.notes || '',
      isNew: false
    })) || [];
    
    setEditableServices(services);
  };

  const fetchCannedServices = async () => {
    try {
      const servicesData = await cannedServiceService.getPackages();
      setCannedServices(servicesData);
      
      // Success toast for data loading - Use this for testing and debugging
      // if (servicesData.length > 0) {
      //   toastService.dataLoadSuccess('services', servicesData.length);
      // }
    } catch (err) {
      const errorMessage = 'Failed to load services. Please try again.';
      console.error('Failed to fetch canned services:', err);
      setError(errorMessage);
      toastService.dataLoadFailed('services', errorMessage);
    }
  };

  const handleInputChange = (field: keyof UpdateWorkOrderRequest, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Show status change toast immediately for better UX
    if (field === 'status' && value !== initialFormData.status) {
      toastService.info(`Status will be updated to: ${value.replace('_', ' ')}`, { autoClose: 2000 });
    }
  };

  const handleAddService = () => {
    setEditableServices(prev => [...prev, {
      serviceId: '',
      quantity: 1,
      price: 0,
      notes: '',
      isNew: true
    }]);
    
    toastService.info('New service line added. Please select a service.');
  };

  const handleServiceChange = (index: number, field: string, value: any) => {
    setEditableServices(prev => prev.map((service, i) => {
      if (i === index) {
        const updated = { ...service, [field]: value };

        // Auto-fill price when service is selected
        if (field === 'serviceId' && value) {
          const cannedService = cannedServices.find(s => s.id === value);
          if (cannedService) {
            updated.price = cannedService.price;
            toastService.info(`Price auto-filled: LKR ${cannedService.price}`, { autoClose: 2000 });
          }
        }

        return updated;
      }
      return service;
    }));
  };

  const handleRemoveService = (index: number) => {
    const removedService = editableServices[index];
    const serviceName = cannedServices.find(s => s.id === removedService.serviceId)?.name || 'Service';
    
    setEditableServices(prev => prev.filter((_, i) => i !== index));
    toastService.info(`${serviceName} removed from work order`, { autoClose: 2000 });
  };

  const validateForm = (): boolean => {
    if (!formData.complaint?.trim()) {
      toastService.validationError('Customer complaint cannot be empty');
      return false;
    }

    // Validate services
    const incompleteServices = editableServices.some(service => service.isNew && !service.serviceId);
    if (incompleteServices) {
      toastService.validationError('Please complete all new service selections or remove incomplete services');
      return false;
    }

    return true;
  };

  const hasChanges = (): boolean => {
    // Check if form data has changes
    const formHasChanges = Object.keys(formData).some(key => {
      const currentValue = formData[key as keyof UpdateWorkOrderRequest];
      const initialValue = initialFormData[key as keyof UpdateWorkOrderRequest];
      return currentValue !== initialValue;
    });

    // Check if services have changes
    const originalServices = workOrder.services || [];
    const servicesHaveChanges = 
      editableServices.length !== originalServices.length ||
      editableServices.some(service => service.isNew) ||
      editableServices.some((service, index) => {
        const original = originalServices[index];
        if (!original) return true;
        return (
          service.serviceId !== original.cannedServiceId ||
          service.quantity !== original.quantity ||
          service.price !== original.unitPrice ||
          service.notes !== (original.notes || '')
        );
      });

    return formHasChanges || servicesHaveChanges;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!hasChanges()) {
      toastService.info('No changes detected to save');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Show loading toast
      // toastService.info('Updating work order...', { autoClose: 1000, hideProgressBar: false });

      // Update the work order
      const updatedWorkOrder = await workOrderService.updateWorkOrder(workOrder.id, formData);

      // Handle services separately if needed
      // Note: This would require additional API endpoints for managing work order services
      // For now, we'll just update the main work order data

      if (onWorkOrderUpdated) {
        onWorkOrderUpdated(updatedWorkOrder);
      }

      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update work order';
      setError(errorMessage);
      
      // Call the error handler if provided, otherwise use toast service
      if (onError) {
        onError(errorMessage);
      } else {
        toastService.workOrderUpdateFailed(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status: WorkOrderStatus) => {
    const statusClasses = {
      [WorkOrderStatus.PENDING]: 'ewo-status-pending',
      [WorkOrderStatus.IN_PROGRESS]: 'ewo-status-progress',
      [WorkOrderStatus.COMPLETED]: 'ewo-status-completed',
      [WorkOrderStatus.CANCELLED]: 'ewo-status-cancelled',
      [WorkOrderStatus.ON_HOLD]: 'ewo-status-hold',
    };
    return statusClasses[status] || 'ewo-status-default';
  };

  const handleClose = () => {
    if (hasChanges()) {
      if (window.confirm('You have unsaved changes. Are you sure you want to close without saving?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="ewo-modal-overlay" onClick={handleClose}>
      <div className="ewo-modal-container" onClick={e => e.stopPropagation()}>
        <div className="ewo-modal-header">
          <div className="ewo-header-content">
            <div className="ewo-title-section">
              <h2 className="ewo-modal-title">Edit Work Order</h2>
              <div className="ewo-work-order-info">
                <span className="ewo-work-order-number">#{workOrder.workOrderNumber}</span>
                <span className={`ewo-status-badge ${getStatusClass(workOrder.status)}`}>
                  {workOrder.status.replace('_', ' ')}
                </span>
              </div>
            </div>
            <button className="ewo-close-button" onClick={handleClose} type="button">
              <i className="bx bx-x"></i>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="ewo-modal-body">
          {error && (
            <div className="ewo-error-alert">
              <i className="bx bx-error ewo-error-icon"></i>
              <span className="ewo-error-text">{error}</span>
            </div>
          )}

          {/* Read-only Customer and Vehicle Info */}
          <div className="ewo-readonly-section">
            <h3 className="ewo-section-title">Customer & Vehicle Information</h3>
            <div className="ewo-readonly-grid">
              <div className="ewo-readonly-field">
                <label className="ewo-readonly-label">Customer</label>
                <div className="ewo-readonly-value">
                  <i className="bx bx-user"></i>
                  <span>{workOrder.customer.name}</span>
                  {workOrder.customer.phone && (
                    <span className="ewo-readonly-secondary"> - {workOrder.customer.phone}</span>
                  )}
                </div>
              </div>

              <div className="ewo-readonly-field">
                <label className="ewo-readonly-label">Vehicle</label>
                <div className="ewo-readonly-value">
                  <i className="bx bx-car"></i>
                  <span>
                    {workOrder.vehicle.year} {workOrder.vehicle.make} {workOrder.vehicle.model}
                  </span>
                  {workOrder.vehicle.licensePlate && (
                    <span className="ewo-readonly-secondary"> - {workOrder.vehicle.licensePlate}</span>
                  )}
                </div>
              </div>

              <div className="ewo-readonly-field">
                <label className="ewo-readonly-label">Created</label>
                <div className="ewo-readonly-value">
                  <i className="bx bx-calendar"></i>
                  <span>{new Date(workOrder.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="ewo-readonly-field">
                <label className="ewo-readonly-label">Total Amount</label>
                <div className="ewo-readonly-value">
                  <i className="bx bx-dollar"></i>
                  <span>LKR {workOrder.totalAmount?.toFixed(2) || '0.00'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Editable Fields */}
          <div className="ewo-form-section">
            <h3 className="ewo-section-title">Work Order Details</h3>
            <div className="ewo-form-grid">
              {/* Status */}
              <div className="ewo-form-field">
                <label className="ewo-field-label">
                  Status <span className="ewo-required">*</span>
                </label>
                <select
                  className="ewo-field-select"
                  value={formData.status || ''}
                  onChange={(e) => handleInputChange('status', e.target.value as WorkOrderStatus)}
                  required
                >
                  {Object.values(WorkOrderStatus).map(status => (
                    <option key={status} value={status}>
                      {status.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              {/* Job Type */}
              <div className="ewo-form-field">
                <label className="ewo-field-label">Job Type</label>
                <select
                  className="ewo-field-select"
                  value={formData.jobType || ''}
                  onChange={(e) => handleInputChange('jobType', e.target.value as JobType)}
                >
                  {Object.values(JobType).map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              <div className="ewo-form-field">
                <label className="ewo-field-label">Priority</label>
                <select
                  className="ewo-field-select"
                  value={formData.priority || ''}
                  onChange={(e) => handleInputChange('priority', e.target.value as JobPriority)}
                >
                  {Object.values(JobPriority).map(priority => (
                    <option key={priority} value={priority}>{priority}</option>
                  ))}
                </select>
              </div>

              {/* Workflow Step */}
              <div className="ewo-form-field">
                <label className="ewo-field-label">Workflow Step</label>
                <select
                  className="ewo-field-select"
                  value={formData.workflowStep || ''}
                  onChange={(e) => handleInputChange('workflowStep', e.target.value as WorkflowStep)}
                >
                  {Object.values(WorkflowStep).map(step => (
                    <option key={step} value={step}>{step.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>

              {/* Warranty Status */}
              <div className="ewo-form-field">
                <label className="ewo-field-label">Warranty Status</label>
                <select
                  className="ewo-field-select"
                  value={formData.warrantyStatus || ''}
                  onChange={(e) => handleInputChange('warrantyStatus', e.target.value as WarrantyStatus)}
                >
                  {Object.values(WarrantyStatus).map(status => (
                    <option key={status} value={status}>{status.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>

              {/* Odometer Reading */}
              <div className="ewo-form-field">
                <label className="ewo-field-label">Odometer Reading</label>
                <input
                  type="number"
                  className="ewo-field-input"
                  value={formData.odometerReading || ''}
                  onChange={(e) => handleInputChange('odometerReading', parseInt(e.target.value) || 0)}
                  placeholder="Enter mileage"
                />
              </div>

              {/* Estimated Total */}
              <div className="ewo-form-field">
                <label className="ewo-field-label">Estimated Total</label>
                <input
                  type="number"
                  step="0.01"
                  className="ewo-field-input"
                  value={formData.estimatedTotal || ''}
                  onChange={(e) => handleInputChange('estimatedTotal', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Customer Complaint */}
            <div className="ewo-form-field ewo-field-full">
              <label className="ewo-field-label">Customer Complaint</label>
              <textarea
                className="ewo-field-textarea"
                value={formData.complaint || ''}
                onChange={(e) => handleInputChange('complaint', e.target.value)}
                placeholder="Describe the customer's complaint or concern..."
                rows={3}
              />
            </div>
          </div>

          {/* Services Section */}
          <div className="ewo-services-section">
            <div className="ewo-section-header">
              <h3 className="ewo-section-title">Services</h3>
              <button type="button" className="ewo-button ewo-btn-add" onClick={handleAddService}>
                <i className="bx bx-plus"></i> Add Service
              </button>
            </div>

            {editableServices.map((service, index) => (
              <div key={index} className={`ewo-service-item ${service.isNew ? 'ewo-service-new' : ''}`}>
                <div className="ewo-service-field">
                  <label className="ewo-service-label">Service</label>
                  <select
                    value={service.serviceId}
                    onChange={(e) => handleServiceChange(index, 'serviceId', e.target.value)}
                    className="ewo-field-select"
                  >
                    <option value="">Select Service</option>
                    {cannedServices.map(cannedService => (
                      <option key={cannedService.id} value={cannedService.id}>
                        {cannedService.name} - LKR {cannedService.price}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="ewo-service-field">
                  <label className="ewo-service-label">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={service.quantity}
                    onChange={(e) => handleServiceChange(index, 'quantity', parseInt(e.target.value) || 1)}
                    className="ewo-field-input"
                    placeholder="Qty"
                  />
                </div>
                <div className="ewo-service-field">
                  <label className="ewo-service-label">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={service.price}
                    onChange={(e) => handleServiceChange(index, 'price', parseFloat(e.target.value) || 0)}
                    className="ewo-field-input"
                    placeholder="Price"
                  />
                </div>
                <div className="ewo-service-field">
                  <label className="ewo-service-label">Notes</label>
                  <input
                    type="text"
                    value={service.notes}
                    onChange={(e) => handleServiceChange(index, 'notes', e.target.value)}
                    className="ewo-field-input"
                    placeholder="Service notes"
                  />
                </div>
                <button
                  type="button"
                  className="ewo-remove-service"
                  onClick={() => handleRemoveService(index)}
                >
                  <i className="bx bx-trash"></i>
                </button>
              </div>
            ))}
          </div>

          {/* Notes Section */}
          <div className="ewo-notes-section">
            <h3 className="ewo-section-title">Notes</h3>
            <div className="ewo-notes-grid">
              <div className="ewo-form-field">
                <label className="ewo-field-label">Internal Notes</label>
                <textarea
                  className="ewo-field-textarea"
                  value={formData.internalNotes || ''}
                  onChange={(e) => handleInputChange('internalNotes', e.target.value)}
                  placeholder="Internal notes for technicians..."
                  rows={3}
                />
              </div>

              <div className="ewo-form-field">
                <label className="ewo-field-label">Customer Notes</label>
                <textarea
                  className="ewo-field-textarea"
                  value={formData.customerNotes || ''}
                  onChange={(e) => handleInputChange('customerNotes', e.target.value)}
                  placeholder="Notes visible to customer..."
                  rows={3}
                />
              </div>

              <div className="ewo-form-field">
                <label className="ewo-field-label">Estimate Notes</label>
                <textarea
                  className="ewo-field-textarea"
                  value={formData.estimateNotes || ''}
                  onChange={(e) => handleInputChange('estimateNotes', e.target.value)}
                  placeholder="Notes for the estimate..."
                  rows={3}
                />
              </div>
            </div>
          </div>

          <div className="ewo-modal-footer">
            <button type="button" className="ewo-button ewo-btn-secondary" onClick={handleClose}>
              Cancel
            </button>
            <button 
              type="submit" 
              className="ewo-button ewo-btn-primary" 
              disabled={loading || !hasChanges()}
              title={!hasChanges() ? 'No changes to save' : ''}
            >
              {loading ? (
                <>
                  <i className="bx bx-loader-alt bx-spin ewo-button-spinner"></i>
                  Updating...
                </>
              ) : (
                <>
                  <i className="bx bx-save"></i>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditWorkOrderModal;