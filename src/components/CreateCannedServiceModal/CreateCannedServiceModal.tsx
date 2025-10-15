import React, { useState, useEffect } from 'react';
import { cannedServiceService } from '../../services/cannedServiceService';

interface CreateCannedServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface LaborOperation {
  laborCatalogId: string;
  sequence: number;
  notes?: string;
}

enum ServiceVariantLabel {
  FULL_SYNTHETIC = 'FULL_SYNTHETIC',    // Premium synthetic oil
  SYNTHETIC_BLEND = 'SYNTHETIC_BLEND',   // Mixed synthetic/conventional oil
  CONVENTIONAL = 'CONVENTIONAL',      // Standard mineral oil
  HIGH_MILEAGE = 'HIGH_MILEAGE',      // Oil formulated for high mileage vehicles
  DIESEL = 'DIESEL',            // Diesel-specific oil
  ELECTRIC = 'ELECTRIC',          // For electric vehicles
  HYBRID = 'HYBRID',            // Hybrid vehicle specific
  SUV = 'SUV',               // SUV-specific service variant
  TRUCK = 'TRUCK',             // Truck-specific service variant
  PERFORMANCE = 'PERFORMANCE',       // Performance vehicle variant
  COMMERCIAL = 'COMMERCIAL'        // Commercial vehicle variant
}

interface CannedServiceFormData {
  code: string;
  name: string;
  description: string;
  duration: number;
  price: string;
  isAvailable: boolean;
  variantLabel?: ServiceVariantLabel;
  vehicleType?: string;
  hasOptionalParts: boolean;
  hasOptionalLabor: boolean;
  category: string;
  minVehicleAge?: number;
  maxVehicleMileage?: number;
  isArchived: boolean;
  laborOperations: LaborOperation[];
}

const CreateCannedServiceModal: React.FC<CreateCannedServiceModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<CannedServiceFormData>({
    code: '',
    name: '',
    description: '',
    duration: 0,
    price: '',
    isAvailable: true,
    variantLabel: undefined,
    vehicleType: '',
    hasOptionalParts: false,
    hasOptionalLabor: false,
    category: '',
    minVehicleAge: undefined,
    maxVehicleMileage: undefined,
    isArchived: false,
    laborOperations: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        code: '',
        name: '',
        description: '',
        duration: 0,
        price: '',
        isAvailable: true,
        variantLabel: undefined,
        vehicleType: '',
        hasOptionalParts: false,
        hasOptionalLabor: false,
        category: '',
        minVehicleAge: undefined,
        maxVehicleMileage: undefined,
        isArchived: false,
        laborOperations: [],
      });
      setError('');
    }
  }, [isOpen]);

  const handleInputChange = (field: keyof CannedServiceFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Validate required fields
      if (!formData.code.trim()) {
        throw new Error('Service code is required');
      }
      if (!formData.name.trim()) {
        throw new Error('Service name is required');
      }
      if (!formData.description.trim()) {
        throw new Error('Service description is required');
      }
      if (formData.duration <= 0) {
        throw new Error('Duration must be greater than 0');
      }
      if (!formData.price || parseFloat(formData.price) <= 0) {
        throw new Error('Valid price is required');
      }
      if (!formData.category.trim()) {
        throw new Error('Category is required');
      }

      // Prepare data for API
      const submitData = {
        code: formData.code.trim(),
        name: formData.name.trim(),
        description: formData.description.trim(),
        duration: formData.duration,
        price: parseFloat(formData.price),
        isAvailable: formData.isAvailable,
        variantLabel: formData.variantLabel || undefined,
        vehicleType: formData.vehicleType || undefined,
        hasOptionalParts: formData.hasOptionalParts,
        hasOptionalLabor: formData.hasOptionalLabor,
        category: formData.category.trim(),
        minVehicleAge: formData.minVehicleAge || undefined,
        maxVehicleMileage: formData.maxVehicleMileage || undefined,
        isArchived: formData.isArchived,
        laborOperations: formData.laborOperations,
      };

      await cannedServiceService.createPackage(submitData);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create canned service');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleBackdropClick} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ backgroundColor: 'white', borderRadius: '8px', maxWidth: '800px', width: '90%', maxHeight: '90vh', overflow: 'auto' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ margin: 0, fontSize: '24px', fontWeight: '600' }}>Create Canned Service</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', padding: '0', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className='bx bx-x'></i>
          </button>
        </div>
        <div style={{ padding: '24px' }}>
          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{ color: '#ef4444', marginBottom: '16px', padding: '12px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '4px', fontSize: '14px' }}>
                {error}
              </div>
            )}

            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '500' }}>Basic Information</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label htmlFor="code" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Service Code *</label>
                  <input
                    type="text"
                    id="code"
                    value={formData.code}
                    onChange={(e) => handleInputChange('code', e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '14px' }}
                    placeholder="e.g., OIL_CHANGE_PREMIUM"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="name" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Service Name *</label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '14px' }}
                    placeholder="e.g., Premium Full Synthetic Oil Change"
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label htmlFor="description" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Description *</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '14px', minHeight: '80px', resize: 'vertical' }}
                  placeholder="Describe the service..."
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label htmlFor="category" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Category *</label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '14px' }}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Repair">Repair</option>
                    <option value="Inspection">Inspection</option>
                    <option value="Diagnostic">Diagnostic</option>
                    <option value="Customization">Customization</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="duration" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Duration (minutes) *</label>
                  <input
                    type="number"
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 0)}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '14px' }}
                    min="1"
                    placeholder="45"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="price" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Price (LKR) *</label>
                  <input
                    type="number"
                    id="price"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '14px' }}
                    min="0"
                    step="0.01"
                    placeholder="129.99"
                    required
                  />
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '500' }}>Vehicle Information</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div>
                  <label htmlFor="vehicleType" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Vehicle Type</label>
                  <select
                    id="vehicleType"
                    value={formData.vehicleType}
                    onChange={(e) => handleInputChange('vehicleType', e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '14px' }}
                  >
                    <option value="">Any Vehicle Type</option>
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Truck">Truck</option>
                    <option value="Van">Van</option>
                    <option value="Hatchback">Hatchback</option>
                    <option value="Coupe">Coupe</option>
                    <option value="Convertible">Convertible</option>
                    <option value="Wagon">Wagon</option>
                    <option value="Motorcycle">Motorcycle</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="minVehicleAge" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Min Vehicle Age (years)</label>
                  <input
                    type="number"
                    id="minVehicleAge"
                    value={formData.minVehicleAge || ''}
                    onChange={(e) => handleInputChange('minVehicleAge', e.target.value ? parseInt(e.target.value) : undefined)}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '14px' }}
                    min="0"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label htmlFor="maxVehicleMileage" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Max Vehicle Mileage</label>
                  <input
                    type="number"
                    id="maxVehicleMileage"
                    value={formData.maxVehicleMileage || ''}
                    onChange={(e) => handleInputChange('maxVehicleMileage', e.target.value ? parseInt(e.target.value) : undefined)}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '14px' }}
                    min="0"
                    placeholder="150000"
                  />
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '500' }}>Service Options</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                  <input
                    type="checkbox"
                    checked={formData.isAvailable}
                    onChange={(e) => handleInputChange('isAvailable', e.target.checked)}
                    style={{ width: '16px', height: '16px' }}
                  />
                  Service is available
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                  <input
                    type="checkbox"
                    checked={formData.hasOptionalParts}
                    onChange={(e) => handleInputChange('hasOptionalParts', e.target.checked)}
                    style={{ width: '16px', height: '16px' }}
                  />
                  Has optional parts
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                  <input
                    type="checkbox"
                    checked={formData.hasOptionalLabor}
                    onChange={(e) => handleInputChange('hasOptionalLabor', e.target.checked)}
                    style={{ width: '16px', height: '16px' }}
                  />
                  Has optional labor
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                  <input
                    type="checkbox"
                    checked={formData.isArchived}
                    onChange={(e) => handleInputChange('isArchived', e.target.checked)}
                    style={{ width: '16px', height: '16px' }}
                  />
                  Archive this service
                </label>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: '500' }}>Variant Information</h4>
              <div style={{ marginBottom: '16px' }}>
                <label htmlFor="variantLabel" style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Variant Label</label>
                <select
                  id="variantLabel"
                  value={formData.variantLabel || ''}
                  onChange={(e) => handleInputChange('variantLabel', e.target.value === '' ? undefined : e.target.value as ServiceVariantLabel)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '14px' }}
                >
                  <option value="">Select Variant Label (Optional)</option>
                  <option value={ServiceVariantLabel.FULL_SYNTHETIC}>FULL_SYNTHETIC - Premium synthetic oil</option>
                  <option value={ServiceVariantLabel.SYNTHETIC_BLEND}>SYNTHETIC_BLEND - Mixed synthetic/conventional oil</option>
                  <option value={ServiceVariantLabel.CONVENTIONAL}>CONVENTIONAL - Standard mineral oil</option>
                  <option value={ServiceVariantLabel.HIGH_MILEAGE}>HIGH_MILEAGE - Oil formulated for high mileage vehicles</option>
                  <option value={ServiceVariantLabel.DIESEL}>DIESEL - Diesel-specific oil</option>
                  <option value={ServiceVariantLabel.ELECTRIC}>ELECTRIC - For electric vehicles</option>
                  <option value={ServiceVariantLabel.HYBRID}>HYBRID - Hybrid vehicle specific</option>
                  <option value={ServiceVariantLabel.SUV}>SUV - SUV-specific service variant</option>
                  <option value={ServiceVariantLabel.TRUCK}>TRUCK - Truck-specific service variant</option>
                  <option value={ServiceVariantLabel.PERFORMANCE}>PERFORMANCE - Performance vehicle variant</option>
                  <option value={ServiceVariantLabel.COMMERCIAL}>COMMERCIAL - Commercial vehicle variant</option>
                </select>
              </div>
            </div>
          </form>
        </div>
        <div style={{ padding: '16px 24px', borderTop: '1px solid #e5e7eb', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            style={{ padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: '4px', backgroundColor: 'white', color: '#374151', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            style={{ padding: '8px 16px', border: 'none', borderRadius: '4px', backgroundColor: isSubmitting ? '#9ca3af' : '#3b82f6', color: 'white', fontSize: '14px', fontWeight: '500', cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
          >
            {isSubmitting ? 'Creating...' : 'Create Service'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCannedServiceModal;