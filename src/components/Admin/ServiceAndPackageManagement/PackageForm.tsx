// src/components/Admin/ServiceAndPackageManagement/PackageForm.tsx
import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { Package, CreatePackageRequest, UpdatePackageRequest, Service } from '../../../types/ServicesAndPackages';

interface PackageFormProps {
  package?: Package;
  services: Service[];
  onClose: () => void;
  onSubmit: (pkg: CreatePackageRequest | UpdatePackageRequest) => void;
}

export const PackageForm: React.FC<PackageFormProps> = ({ 
  package: pkg, 
  services, 
  onClose, 
  onSubmit 
}) => {
  const [formData, setFormData] = useState({
    code: pkg?.code || '',
    name: pkg?.name || '',
    description: pkg?.description || '',
    duration: pkg?.duration || 0,
    price: pkg?.price || 0,
    isAvailable: pkg?.isAvailable !== undefined ? pkg.isAvailable : true,
    serviceIds: pkg?.serviceIds || [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleServiceToggle = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      serviceIds: prev.serviceIds.includes(serviceId)
        ? prev.serviceIds.filter(id => id !== serviceId)
        : [...prev.serviceIds, serviceId]
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.code.trim()) newErrors.code = 'Code is required';
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (formData.duration <= 0) newErrors.duration = 'Duration must be greater than 0';
    if (formData.price < 0) newErrors.price = 'Price cannot be negative';
    if (formData.serviceIds.length === 0) newErrors.serviceIds = 'At least one service is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const submitData = {
      code: formData.code.trim(),
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      duration: formData.duration,
      price: formData.price,
      isAvailable: formData.isAvailable,
      serviceIds: formData.serviceIds,
    };

    onSubmit(submitData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  return (
    <div className="spm-modal-overlay spm-modal-overlay--large" onClick={onClose}>
      <div className="spm-modal-content spm-modal-content--large" onClick={e => e.stopPropagation()}>
        <div className="spm-modal-header">
          <h2>{pkg ? 'Edit Package' : 'Add New Package'}</h2>
          <button className="spm-modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="spm-service-form">
          <div className="spm-form-group">
            <label htmlFor="code">
              Package Code *
              {errors.code && <span className="spm-error-message">{errors.code}</span>}
            </label>
            <input
              type="text"
              id="code"
              name="code"
              value={formData.code}
              onChange={handleInputChange}
              className={errors.code ? 'spm-error' : ''}
              placeholder="Eg: COMPLETE_CARE"
            />
          </div>

          <div className="spm-form-group">
            <label htmlFor="name">
              Package Name *
              {errors.name && <span className="spm-error-message">{errors.name}</span>}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={errors.name ? 'spm-error' : ''}
              placeholder="Eg: Complete Care Package"
            />
          </div>

          <div className="spm-form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={2}
              placeholder="Describe the package..."
            />
          </div>

          <div className="spm-form-row">
            <div className="spm-form-group">
              <label htmlFor="duration">
                Duration (minutes) *
                {errors.duration && <span className="spm-error-message">{errors.duration}</span>}
              </label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                className={errors.duration ? 'spm-error' : ''}
                min="1"
                step="1"
              />
            </div>

            <div className="spm-form-group">
              <label htmlFor="price">
                Price (LKR) *
                {errors.price && <span className="spm-error-message">{errors.price}</span>}
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className={errors.price ? 'spm-error' : ''}
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="spm-form-group">
            <div className="spm-toggle-container">
              <div className="spm-toggle-label">
                <span className="spm-toggle-title">Package Availability</span>
                <span className="spm-toggle-subtitle">Control whether this package can be booked</span>
              </div>
              <div className="spm-toggle-status">
                <div className={`spm-status-indicator ${formData.isAvailable ? 'spm-status-available' : 'spm-status-unavailable'}`}></div>
                <span className={`spm-status-text ${formData.isAvailable ? 'spm-status-available' : 'spm-status-unavailable'}`}>
                  {formData.isAvailable ? 'Available' : 'Unavailable'}
                </span>
                <button
                  type="button"
                  className={`spm-toggle-switch ${formData.isAvailable ? 'spm-toggle-active' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, isAvailable: !prev.isAvailable }))}
                >
                  <div className="spm-toggle-slider"></div>
                </button>
              </div>
            </div>
          </div>

          <div className="spm-form-group">
            <label>
              Select Services to Include *
              {errors.serviceIds && <span className="spm-error-message">{errors.serviceIds}</span>}
            </label>
            <div className="spm-service-selection">
              {services.map(service => (
                <div key={service.id} className="spm-service-checkbox">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.serviceIds.includes(service.id)}
                      onChange={() => handleServiceToggle(service.id)}
                    />
                    <span className="spm-service-checkbox__checkmark"></span>
                    <div className="spm-service-checkbox__info">
                      <span className="spm-service-checkbox__name">{service.name}</span>
                      <span className="spm-service-checkbox__price">
                        {service.estimatedHours}h @ LKR {service.hourlyRate.toLocaleString()}/h
                      </span>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="spm-form-actions">
            <button type="button" className="spm-btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="spm-btn-primary">
              {pkg ? 'Update Package' : 'Create Package'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};