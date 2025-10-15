import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../hooks/useAuth';
import type { CannedService } from '../../types';

interface AddServiceToWorkOrderModalProps {
  open: boolean;
  onClose: () => void;
  workOrderId: string;
  onServiceAdded: () => void;
}

const AddServiceToWorkOrderModal: React.FC<AddServiceToWorkOrderModalProps> = ({
  open,
  onClose,
  workOrderId,
  onServiceAdded,
}) => {
  const { token } = useAuth();
  const [cannedServices, setCannedServices] = useState<CannedService[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [selectedCannedServiceId, setSelectedCannedServiceId] = useState<string>('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (open) {
      fetchCannedServices();
      resetForm();
    }
  }, [open]);

  const resetForm = () => {
    setSelectedCannedServiceId('');
    setNotes('');
    setError(null);
  };

  const fetchCannedServices = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3000/canned-services', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch canned services');
      }

      const result = await response.json();
      const services = result.success ? result.data : [];
      setCannedServices(Array.isArray(services) ? services : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching canned services:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCannedServiceChange = (serviceId: string) => {
    setSelectedCannedServiceId(serviceId);
  };

  const calculateSubtotal = () => {
    const selectedService = cannedServices.find(s => s.id === selectedCannedServiceId);
    return selectedService ? selectedService.price : 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedCannedServiceId) {
      setError('Please select a canned service');
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedService = cannedServices.find(s => s.id === selectedCannedServiceId);
      if (!selectedService) {
        throw new Error('Selected service not found');
      }

      const payload = {
        workOrderId,
        cannedServiceId: selectedCannedServiceId,
        description: selectedService.name,
        quantity: 1,
        unitPrice: selectedService.price,
        subtotal: selectedService.price,
        status: 'ESTIMATED',
        notes: notes.trim() || null,
        customerApproved: false,
        customerRejected: false,
      };

      const response = await fetch(`http://localhost:3000/work-orders/${workOrderId}/services`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add service');
      }

      onServiceAdded();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error adding service:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="manage-workorder-modal__overlay" onClick={onClose}>
      <div className="manage-workorder-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '450px', maxHeight: '90vh', overflow: 'auto' }}>
        <div className="modal-header">
          <div className="modal-title">
            <h2>Add Service</h2>
            <p>Add a new service to this work order</p>
          </div>
          <button className="close-btn" onClick={onClose} title="Close">
            <i className="bx bx-x"></i>
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
            {error && (
              <div style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '6px',
                padding: '12px',
                marginBottom: '20px',
                color: '#dc2626',
                fontSize: '14px'
              }}>
                <i className="bx bx-error-circle" style={{ marginRight: '8px' }}></i>
                {error}
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Canned Service *
              </label>
              <select
                value={selectedCannedServiceId}
                onChange={(e) => handleCannedServiceChange(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  backgroundColor: '#fff'
                }}
                disabled={isLoading}
                required
              >
                <option value="">Select a canned service...</option>
                {cannedServices.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name} - LKR {service.price}
                  </option>
                ))}
              </select>
            </div>

            {selectedCannedServiceId && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}>
                  Price
                </label>
                <div style={{
                  padding: '10px 12px',
                  backgroundColor: '#f9fafb',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#111827'
                }}>
                  LKR {calculateSubtotal().toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
              </div>
            )}

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional notes (optional)"
                rows={3}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
              <button
                type="button"
                onClick={onClose}
                className="btn btn--secondary"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn--primary"
                disabled={isSubmitting}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                {isSubmitting ? (
                  <>
                    <i className="bx bx-loader-alt bx-spin"></i>
                    Adding...
                  </>
                ) : (
                  <>
                    <i className="bx bx-plus"></i>
                    Add Service
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddServiceToWorkOrderModal;