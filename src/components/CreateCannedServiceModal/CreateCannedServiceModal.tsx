import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { cannedServiceService } from '../../services/cannedServiceService';
import './CreateCannedServiceModal.scss';

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
  FULL_SYNTHETIC = 'FULL_SYNTHETIC',
  SYNTHETIC_BLEND = 'SYNTHETIC_BLEND',
  CONVENTIONAL = 'CONVENTIONAL',
  HIGH_MILEAGE = 'HIGH_MILEAGE',
  DIESEL = 'DIESEL',
  ELECTRIC = 'ELECTRIC',
  HYBRID = 'HYBRID',
  SUV = 'SUV',
  TRUCK = 'TRUCK',
  PERFORMANCE = 'PERFORMANCE',
  COMMERCIAL = 'COMMERCIAL'
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
  const [categories, setCategories] = useState<string[]>([]);

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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await cannedServiceService.getPackages();
        const uniqueCategories = [...new Set(data.map((s: any) => s.category).filter(Boolean))];
        setCategories(uniqueCategories);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };

    if (isOpen) {
      fetchCategories();
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
    <div className="canned-service-modal__overlay" onClick={handleBackdropClick}>
      <div className="canned-service-modal" onClick={e => e.stopPropagation()}>
        <div className="canned-service-modal__header">
          <div className="canned-service-modal__title-wrapper">
            <h2>Create Canned Service</h2>
            <p className="canned-service-modal__subtitle">
              Configure a new service package for your automotive service offerings
            </p>
          </div>
          <button
            style={{color: '#fff'}}
            className="canned-service-modal__close-icon"
            onClick={onClose}
            type="button"
          >
            X
          </button>
        </div>

        <div className="canned-service-modal__body">
          <form className="canned-service-form" onSubmit={handleSubmit}>
            {error && (
              <div className="canned-service-form__error">
                {error}
              </div>
            )}

            <div className="canned-service-form__grid">
              <div className="canned-service-form__section">
                <h3 className="canned-service-form__section-title">Basic Information</h3>

                <div className="canned-service-form__row canned-service-form__row--two-col">
                  <div className="canned-service-form__group">
                    <label htmlFor="code">
                      Service Code <span className="canned-service-form__required">*</span>
                    </label>
                    <input
                      type="text"
                      id="code"
                      value={formData.code}
                      onChange={(e) => handleInputChange('code', e.target.value)}
                      placeholder="e.g., OIL_CHANGE_PREMIUM"
                      required
                    />
                  </div>

                  <div className="canned-service-form__group">
                    <label htmlFor="name">
                      Service Name <span className="canned-service-form__required">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="e.g., Premium Full Synthetic Oil Change"
                      required
                    />
                  </div>
                </div>

                <div className="canned-service-form__group">
                  <label htmlFor="description">
                    Description <span className="canned-service-form__required">*</span>
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Provide a detailed description of the service..."
                    required
                  />
                </div>

                <div style = {{marginTop: '20px'}} className="canned-service-form__row canned-service-form__row--three-col">
                  <div className="canned-service-form__group">
                    <label htmlFor="category">
                      Category <span className="canned-service-form__required">*</span>
                    </label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div className="canned-service-form__group">
                    <label htmlFor="duration">
                      Duration (minutes) <span className="canned-service-form__required">*</span>
                    </label>
                    <input
                      type="number"
                      id="duration"
                      value={formData.duration || ''}
                      onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 0)}
                      min="1"
                      placeholder="45"
                      required
                    />
                  </div>

                  <div className="canned-service-form__group">
                    <label htmlFor="price">
                      Price (LKR) <span className="canned-service-form__required">*</span>
                    </label>
                    <input
                      type="number"
                      id="price"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      min="0"
                      step="0.01"
                      placeholder="5999.99"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="canned-service-form__section">
                <h3 className="canned-service-form__section-title">Vehicle Information</h3>

                <div className="canned-service-form__row canned-service-form__row--three-col">
                  <div className="canned-service-form__group">
                    <label htmlFor="vehicleType">Vehicle Type</label>
                    <select
                      id="vehicleType"
                      value={formData.vehicleType}
                      onChange={(e) => handleInputChange('vehicleType', e.target.value)}
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

                  <div className="canned-service-form__group">
                    <label htmlFor="minVehicleAge">Min Vehicle Age (years)</label>
                    <input
                      type="number"
                      id="minVehicleAge"
                      value={formData.minVehicleAge || ''}
                      onChange={(e) => handleInputChange('minVehicleAge', e.target.value ? parseInt(e.target.value) : undefined)}
                      min="0"
                      placeholder="0"
                    />
                  </div>

                  <div className="canned-service-form__group">
                    <label htmlFor="maxVehicleMileage">Max Vehicle Mileage</label>
                    <input
                      type="number"
                      id="maxVehicleMileage"
                      value={formData.maxVehicleMileage || ''}
                      onChange={(e) => handleInputChange('maxVehicleMileage', e.target.value ? parseInt(e.target.value) : undefined)}
                      min="0"
                      placeholder="150000"
                    />
                  </div>
                </div>
              </div>

              <div className="canned-service-form__section">
                <h3 className="canned-service-form__section-title">Variant Information</h3>

                <div className="canned-service-form__group">
                  <label htmlFor="variantLabel">Variant Label</label>
                  <select
                    id="variantLabel"
                    value={formData.variantLabel || ''}
                    onChange={(e) => handleInputChange('variantLabel', e.target.value === '' ? undefined : e.target.value as ServiceVariantLabel)}
                  >
                    <option value="">Select Variant (Optional)</option>
                    <option value={ServiceVariantLabel.FULL_SYNTHETIC}>Full Synthetic - Premium synthetic oil</option>
                    <option value={ServiceVariantLabel.SYNTHETIC_BLEND}>Synthetic Blend - Mixed synthetic/conventional</option>
                    <option value={ServiceVariantLabel.CONVENTIONAL}>Conventional - Standard mineral oil</option>
                    <option value={ServiceVariantLabel.HIGH_MILEAGE}>High Mileage - For high mileage vehicles</option>
                    <option value={ServiceVariantLabel.DIESEL}>Diesel - Diesel-specific oil</option>
                    <option value={ServiceVariantLabel.ELECTRIC}>Electric - For electric vehicles</option>
                    <option value={ServiceVariantLabel.HYBRID}>Hybrid - Hybrid vehicle specific</option>
                    <option value={ServiceVariantLabel.SUV}>SUV - SUV-specific service</option>
                    <option value={ServiceVariantLabel.TRUCK}>Truck - Truck-specific service</option>
                    <option value={ServiceVariantLabel.PERFORMANCE}>Performance - Performance vehicle</option>
                    <option value={ServiceVariantLabel.COMMERCIAL}>Commercial - Commercial vehicle</option>
                  </select>
                </div>
              </div>

              <div className="canned-service-form__section">
                <h3 className="canned-service-form__section-title">Service Options</h3>

                <div className="canned-service-form__checkbox-grid">
                  <label className="canned-service-form__checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.isAvailable}
                      onChange={(e) => handleInputChange('isAvailable', e.target.checked)}
                    />
                    Service is available
                  </label>

                  <label className="canned-service-form__checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.hasOptionalParts}
                      onChange={(e) => handleInputChange('hasOptionalParts', e.target.checked)}
                    />
                    Has optional parts
                  </label>

                  <label className="canned-service-form__checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.hasOptionalLabor}
                      onChange={(e) => handleInputChange('hasOptionalLabor', e.target.checked)}
                    />
                    Has optional labor
                  </label>

                  <label className="canned-service-form__checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.isArchived}
                      onChange={(e) => handleInputChange('isArchived', e.target.checked)}
                    />
                    Archive this service
                  </label>
                </div>
              </div>
            </div>

            <div className="canned-service-form__actions">
              <button
                type="button"
                className="canned-service-form__btn canned-service-form__btn--secondary"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="canned-service-form__btn canned-service-form__btn--primary"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create Service'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCannedServiceModal;
