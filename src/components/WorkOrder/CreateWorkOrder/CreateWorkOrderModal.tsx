// src/components/WorkOrder/CreateWorkOrder/CreateWorkOrderModal.tsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import type { CreateWorkOrderRequest } from '../../../types/WorkOrderTypes/WorkOrder';
import type { Customer, Vehicle } from '../../../types/CustomerTypes/Customer'
import type { CannedService } from '../../../types/WorkOrderTypes/WorkOrder';
import { WorkOrderStatus, JobType, JobPriority, JobSource, WarrantyStatus } from '../../../types/WorkOrderTypes/enums';
import { customerService } from '../../../services/customerService';
import { workOrderService } from '../../../services/workOrderService';
import { cannedServiceService } from '../../../services/cannedServiceService';
import { toastService } from '../../../services/toastService';
import './CreateWorkOrderModal.scss';

interface CreateWorkOrderModalProps {
  open: boolean;
  onClose: () => void;
  onWorkOrderCreated?: (workOrder: any) => void;
  onError?: (error: string) => void;
}

interface SelectedService {
  serviceId: string;
  quantity: number;
  price: number;
  notes: string;
}

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

const CreateWorkOrderModal: React.FC<CreateWorkOrderModalProps> = ({
  open,
  onClose,
  onWorkOrderCreated,
  onError
}) => {

  const [formData, setFormData] = useState<CreateWorkOrderRequest>({
    customerId: '',
    vehicleId: '',
    status: WorkOrderStatus.PENDING,
    jobType: JobType.REPAIR,
    priority: JobPriority.NORMAL,
    source: JobSource.WALK_IN,
    warrantyStatus: WarrantyStatus.NONE,
    complaint: '',
    odometerReading: 0,
    estimatedTotal: 0,
    estimateNotes: '',
    internalNotes: '',
    customerNotes: '',
    cannedServiceIds: [],
    quantities: [],
    prices: [],
    serviceNotes: []
  });

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [cannedServices, setCannedServices] = useState<CannedService[]>([]);
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from backend
  useEffect(() => {
    if (open) {
      fetchCustomers();
      fetchCannedServices();
      setError(null);
    }
  }, [open]);

  const fetchCustomers = async () => {
    try {
      const customersData = await customerService.getCustomers();
      setCustomers(customersData);

      // Success toast for data loading - Use this for testing to verify is customers are fetched
      // if (customersData.length > 0) {
      //   toastService.dataLoadSuccess('customers', customersData.length);
      // }
    } catch (err) {
      const errorMessage = 'Failed to load customers. Please try again.';
      console.error('Failed to fetch customers:', err);
      setError(errorMessage);
      toastService.dataLoadFailed('customers', errorMessage);
      setCustomers([]);
    }
  };

  const fetchCannedServices = async () => {
    try {
      // const servicesData = await cannedServiceService.getCannedServices();
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
      setCannedServices([]);
    }
  };

  // Update vehicles when customer changes
  useEffect(() => {
    if (formData.customerId) {
      fetchCustomerVehicles(formData.customerId);
    } else {
      setVehicles([]);
    }
  }, [formData.customerId]);

  const fetchCustomerVehicles = async (customerId: string) => {
    try {
      const vehiclesData = await customerService.getCustomerVehicles(customerId);
      setVehicles(vehiclesData);

      // Success toast for data loading
      if (vehiclesData.length > 0) {
        // Use this for testing and debugging
        // toastService.dataLoadSuccess('vehicles', vehiclesData.length);
      } else {
        toastService.info('No vehicles found for this customer. Please add a vehicle first.', { autoClose: 3000 });
      }
    } catch (err) {
      const errorMessage = 'Failed to load vehicles. Please try again.';
      console.error('Failed to fetch vehicles:', err);
      setError(errorMessage);
      toastService.dataLoadFailed('vehicles', errorMessage);
      setVehicles([]);
    }
  };

  const handleInputChange = (field: keyof CreateWorkOrderRequest, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddService = () => {
    setSelectedServices(prev => [...prev, {
      serviceId: '',
      quantity: 1,
      price: 0,
      notes: ''
    }]);

    // toastService.info('New service line added. Please select a service.');
  };

  const handleServiceChange = (index: number, field: string, value: any) => {
    setSelectedServices(prev => prev.map((service, i) => {
      if (i === index) {
        const updated = { ...service, [field]: value };

        // Auto-fill price when service is selected
        if (field === 'serviceId' && value) {
          const cannedService = cannedServices.find(s => s.id === value);
          if (cannedService) {
            updated.price = cannedService.price;
            // toastService.info(`Price auto-filled: LKR ${cannedService.price}`, { autoClose: 2000 });
          }
        }

        return updated;
      }
      return service;
    }));
  };

  const handleRemoveService = (index: number) => {
    const removedService = selectedServices[index];
    const serviceName = cannedServices.find(s => s.id === removedService.serviceId)?.name || 'Service';

    setSelectedServices(prev => prev.filter((_, i) => i !== index));
    // toastService.info(`${serviceName} removed from work order`, { autoClose: 2000 });
  };

  const validateForm = (): boolean => {
    // Check required fields
    if (!formData.customerId) {
      toastService.validationError('Please select a customer');
      return false;
    }

    if (!formData.vehicleId) {
      toastService.validationError('Please select a vehicle');
      return false;
    }

    if (!formData.complaint?.trim()) {
      toastService.validationError('Customer complaint cannot be empty');
      return false;
    }

    // Validate services
    const incompleteServices = selectedServices.some(service => !service.serviceId);
    if (incompleteServices) {
      toastService.validationError('Please complete all service selections or remove incomplete services');
      return false;
    }

    // Check for duplicate services
    const serviceIds = selectedServices.map(s => s.serviceId).filter(Boolean);
    const uniqueServiceIds = new Set(serviceIds);
    if (serviceIds.length !== uniqueServiceIds.size) {
      toastService.validationError('Duplicate services detected. Each service should only be added once.');
      return false;
    }

    // Validate quantities and prices
    const invalidServices = selectedServices.some(service =>
      service.serviceId && (service.quantity <= 0 || service.price < 0)
    );
    if (invalidServices) {
      toastService.validationError('All services must have valid quantities (> 0) and prices (>= 0)');
      return false;
    }

    return true;
  };

  const calculateEstimatedTotal = (): number => {
    return selectedServices.reduce((total, service) => {
      if (service.serviceId) {
        return total + (service.quantity * service.price);
      }
      return total;
    }, 0);
  };

  // Update estimated total when services change
  useEffect(() => {
    const calculatedTotal = calculateEstimatedTotal();
    if (calculatedTotal !== formData.estimatedTotal) {
      setFormData(prev => ({
        ...prev,
        estimatedTotal: calculatedTotal
      }));
    }
  }, [selectedServices]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Show loading toast
      toastService.info('Creating work order...', { autoClose: false });

      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }

      // Prepare form data with selected services
      const submitData: CreateWorkOrderRequest = {
        ...formData,
        cannedServiceIds: selectedServices.map(s => s.serviceId).filter(Boolean),
        quantities: selectedServices.map(s => s.quantity),
        prices: selectedServices.map(s => s.price),
        serviceNotes: selectedServices.map(s => s.notes)
      };

      // Direct API call to create work order
      const response = await fetch(`${API_BASE_URL}/work-orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(submitData)
      });

      const responseData = await response.json();
      console.log('Create work order response:', responseData);

      if (!response.ok) {
        throw new Error(responseData.error || responseData.message || 'Failed to create work order');
      }

      // Close loading toast
      toast.dismiss();

      if (responseData.success && onWorkOrderCreated) {
        onWorkOrderCreated(responseData.data);
      }

      onClose();
      resetForm();
    } catch (err) {
      // Close loading toast
      toast.dismiss();

      const errorMessage = err instanceof Error ? err.message : 'Failed to create work order';
      setError(errorMessage);

      // Call the error handler if provided, otherwise use toast service
      if (onError) {
        onError(errorMessage);
      } else {
        toastService.workOrderCreationFailed(errorMessage);
      }

      console.error('Error creating work order:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      customerId: '',
      vehicleId: '',
      status: WorkOrderStatus.PENDING,
      jobType: JobType.REPAIR,
      priority: JobPriority.NORMAL,
      source: JobSource.WALK_IN,
      warrantyStatus: WarrantyStatus.NONE,
      complaint: '',
      odometerReading: 0,
      estimatedTotal: 0,
      estimateNotes: '',
      internalNotes: '',
      customerNotes: '',
      cannedServiceIds: [],
      quantities: [],
      prices: [],
      serviceNotes: []
    });
    setSelectedServices([]);
    setError(null);
  };

  const hasUnsavedChanges = (): boolean => {
    return (
      formData.customerId !== '' ||
      formData.vehicleId !== '' ||
      formData.complaint !== '' ||
      (formData.odometerReading || 0) > 0 ||
      (formData.estimatedTotal || 0) > 0 ||
      formData.estimateNotes !== '' ||
      formData.internalNotes !== '' ||
      formData.customerNotes !== '' ||
      selectedServices.length > 0
    );
  };

  const handleClose = () => {
    if (hasUnsavedChanges()) {
      if (window.confirm('You have unsaved changes. Are you sure you want to close without saving?')) {
        resetForm();
        onClose();
      }
    } else {
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="cwo-modal-overlay" onClick={handleClose}>
      <div className="cwo-modal-container" onClick={e => e.stopPropagation()}>
        <div className="cwo-modal-header">
          <div className="cwo-header-content">
            <h2 className="cwo-modal-title">Create New Work Order</h2>
            <button className="cwo-close-button" onClick={handleClose} type="button">
              <i className="bx bx-x"></i>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="cwo-modal-body">
          {error && (
            <div className="cwo-error-alert">
              <i className="bx bx-error cwo-error-icon"></i>
              <span className="cwo-error-text">{error}</span>
            </div>
          )}

          <div className="cwo-form-grid">
            {/* Customer Selection */}
            <div className="cwo-form-field">
              <label className="cwo-field-label">
                Customer <span className="cwo-required">*</span>
              </label>
              <select
                className="cwo-field-select"
                value={formData.customerId}
                onChange={(e) => handleInputChange('customerId', e.target.value)}
                required
              >
                <option value="">Select Customer</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} - {customer.phone}
                  </option>
                ))}
              </select>
            </div>

            {/* Vehicle Selection */}
            <div className="cwo-form-field">
              <label className="cwo-field-label">
                Vehicle <span className="cwo-required">*</span>
              </label>
              <select
                className="cwo-field-select"
                value={formData.vehicleId}
                onChange={(e) => handleInputChange('vehicleId', e.target.value)}
                required
                disabled={!formData.customerId}
              >
                <option value="">Select Vehicle</option>
                {vehicles.map(vehicle => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.year} {vehicle.make} {vehicle.model} - {vehicle.licensePlate}
                  </option>
                ))}
              </select>
            </div>

            {/* Job Type */}
            <div className="cwo-form-field">
              <label className="cwo-field-label">Job Type</label>
              <select
                className="cwo-field-select"
                value={formData.jobType}
                onChange={(e) => handleInputChange('jobType', e.target.value as JobType)}
              >
                {Object.values(JobType).map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div className="cwo-form-field">
              <label className="cwo-field-label">Priority</label>
              <select
                className="cwo-field-select"
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value as JobPriority)}
              >
                {Object.values(JobPriority).map(priority => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </select>
            </div>

            {/* Source */}
            <div className="cwo-form-field">
              <label className="cwo-field-label">Source</label>
              <select
                className="cwo-field-select"
                value={formData.source}
                onChange={(e) => handleInputChange('source', e.target.value as JobSource)}
              >
                {Object.values(JobSource).map(source => (
                  <option key={source} value={source}>{source.replace('_', ' ')}</option>
                ))}
              </select>
            </div>

            {/* Warranty Status */}
            <div className="cwo-form-field">
              <label className="cwo-field-label">Warranty Status</label>
              <select
                className="cwo-field-select"
                value={formData.warrantyStatus}
                onChange={(e) => handleInputChange('warrantyStatus', e.target.value as WarrantyStatus)}
              >
                {Object.values(WarrantyStatus).map(status => (
                  <option key={status} value={status}>{status.replace('_', ' ')}</option>
                ))}
              </select>
            </div>

            {/* Odometer Reading */}
            <div className="cwo-form-field">
              <label className="cwo-field-label">Odometer Reading</label>
              <input
                type="number"
                className="cwo-field-input"
                value={formData.odometerReading || ''}
                onChange={(e) => handleInputChange('odometerReading', parseInt(e.target.value) || 0)}
                placeholder="Enter mileage"
              />
            </div>

            {/* Estimated Total - Now auto-calculated */}
            <div className="cwo-form-field">
              <label className="cwo-field-label" style={{ display: 'flex', gap: '1rem' }}>
                Estimated Total
                <small className="cwo-field-hint">Auto-calculated from services</small>
              </label>
              <input
                type="number"
                step="0.01"
                className="cwo-field-input"
                value={formData.estimatedTotal || ''}
                onChange={(e) => handleInputChange('estimatedTotal', parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                title="Auto-calculated from services, but can be overridden"
              />
            </div>
          </div>

          {/* Customer Complaint */}
          <div className="cwo-form-field cwo-field-full" style={{ marginBottom: '2rem' }}>
            <label className="cwo-field-label">
              Customer Complaint <span className="cwo-required">*</span>
            </label>
            <textarea
              className="cwo-field-textarea"
              value={formData.complaint || ''}
              onChange={(e) => handleInputChange('complaint', e.target.value)}
              placeholder="Describe the customer's complaint or concern..."
              rows={3}
              required
            />
          </div>

          {/* Services Section */}
          <div className="cwo-services-section">
            <div className="cwo-section-header">
              <h3 className="cwo-section-title">Services</h3>
              <button type="button" className="cwo-button cwo-btn-add" onClick={handleAddService}>
                <i className="bx bx-plus"></i> Add Service
              </button>
            </div>

            {selectedServices.map((service, index) => (
              <div key={index} className="cwo-service-item">
                <div className="cwo-service-field">
                  <label className="cwo-service-label">Service</label>
                  <select
                    value={service.serviceId}
                    onChange={(e) => handleServiceChange(index, 'serviceId', e.target.value)}
                    className="cwo-field-select"
                  >
                    <option value="">Select Service</option>
                    {cannedServices.map(cannedService => (
                      <option key={cannedService.id} value={cannedService.id}>
                        {cannedService.name} - LKR {cannedService.price}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="cwo-service-field">
                  <label className="cwo-service-label">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={service.quantity}
                    onChange={(e) => handleServiceChange(index, 'quantity', parseInt(e.target.value) || 1)}
                    className="cwo-field-input"
                    placeholder="Qty"
                  />
                </div>
                <div className="cwo-service-field">
                  <label className="cwo-service-label">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={service.price}
                    onChange={(e) => handleServiceChange(index, 'price', parseFloat(e.target.value) || 0)}
                    className="cwo-field-input"
                    placeholder="Price"
                  />
                </div>
                <div className="cwo-service-field">
                  <label className="cwo-service-label">Notes</label>
                  <input
                    type="text"
                    value={service.notes}
                    onChange={(e) => handleServiceChange(index, 'notes', e.target.value)}
                    className="cwo-field-input"
                    placeholder="Service notes"
                  />
                </div>
                <button
                  type="button"
                  className="cwo-remove-service"
                  onClick={() => handleRemoveService(index)}
                  title="Remove service"
                >
                  <i className="bx bx-trash"></i>
                </button>
              </div>
            ))}

            {selectedServices.length > 0 && (
              <div className="cwo-services-summary">
                <div className="cwo-summary-item" style={{ marginBottom: '0.5rem' }}>
                  <strong>Total Services: {selectedServices.filter(s => s.serviceId).length}</strong>
                </div>
                <div className="cwo-summary-item">
                  <strong>Calculated Total: LKR {calculateEstimatedTotal().toFixed(2)}</strong>
                </div>
              </div>
            )}
          </div>

          {/* Notes Section */}
          <div className="cwo-notes-section">
            <h3 className="cwo-section-title">Notes</h3>
            <div className="cwo-notes-grid">
              <div className="cwo-form-field">
                <label className="cwo-field-label">Internal Notes</label>
                <textarea
                  className="cwo-field-textarea"
                  value={formData.internalNotes || ''}
                  onChange={(e) => handleInputChange('internalNotes', e.target.value)}
                  placeholder="Internal notes for technicians..."
                  rows={3}
                />
              </div>

              <div className="cwo-form-field">
                <label className="cwo-field-label">Customer Notes</label>
                <textarea
                  className="cwo-field-textarea"
                  value={formData.customerNotes || ''}
                  onChange={(e) => handleInputChange('customerNotes', e.target.value)}
                  placeholder="Notes visible to customer..."
                  rows={3}
                />
              </div>

              <div className="cwo-form-field">
                <label className="cwo-field-label">Estimate Notes</label>
                <textarea
                  className="cwo-field-textarea"
                  value={formData.estimateNotes || ''}
                  onChange={(e) => handleInputChange('estimateNotes', e.target.value)}
                  placeholder="Notes for the estimate..."
                  rows={3}
                />
              </div>
            </div>
          </div>

          <div className="cwo-modal-footer">
            <button type="button" className="cwo-button cwo-btn-secondary" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="cwo-button cwo-btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <i className="bx bx-loader-alt bx-spin cwo-button-spinner"></i>
                  Creating...
                </>
              ) : (
                <>
                  <i className="bx bx-plus"></i>
                  Create Work Order
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateWorkOrderModal;