// src/components/Admin/ServiceAndPackageManagement/ServiceForm.tsx
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Service, CreateServiceRequest, UpdateServiceRequest } from '../../../types/ServicesAndPackages';
import './ServiceForm.scss';

interface ServiceFormProps {
  service?: Service;
  onClose: () => void;
  onSubmit: (data: CreateServiceRequest | UpdateServiceRequest) => void;
  loading?: boolean;
}

export const ServiceForm: React.FC<ServiceFormProps> = ({ service, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    estimatedHours: 0,
    hourlyRate: 0,
    category: '',
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (service) {
      setFormData({
        code: service.code || '',
        name: service.name || '',
        description: service.description || '',
        estimatedHours: service.estimatedHours || 0,
        hourlyRate: service.hourlyRate || 0,
        category: service.category || '',
        isActive: service.isActive !== undefined ? service.isActive : true,
      });
    }
  }, [service]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.code.trim()) newErrors.code = 'Code is required';
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (formData.estimatedHours <= 0) newErrors.estimatedHours = 'Estimated hours must be greater than 0';
    if (formData.hourlyRate <= 0) newErrors.hourlyRate = 'Hourly rate must be greater than 0';

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
      estimatedHours: formData.estimatedHours,
      hourlyRate: formData.hourlyRate,
      category: formData.category.trim() || undefined,
      isActive: formData.isActive,
    };

    if (service) {
      // For update
      const updateData: UpdateServiceRequest = {};
      if (submitData.code !== service.code) updateData.code = submitData.code;
      if (submitData.name !== service.name) updateData.name = submitData.name;
      if (submitData.description !== service.description) updateData.description = submitData.description;
      if (submitData.estimatedHours !== service.estimatedHours) updateData.estimatedHours = submitData.estimatedHours;
      if (submitData.hourlyRate !== service.hourlyRate) updateData.hourlyRate = submitData.hourlyRate;
      if (submitData.category !== service.category) updateData.category = submitData.category;
      if (submitData.isActive !== service.isActive) updateData.isActive = submitData.isActive;
      
      onSubmit(updateData);
    } else {
      // For create
      onSubmit(submitData as CreateServiceRequest);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  return (
    <div className="spm-modal-overlay">
      <div className="spm-modal-content">
        <div className="spm-modal-header">
          <h2>{service ? 'Edit Service' : 'Create New Service'}</h2>
          <button className="spm-modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="spm-service-form">
          <div className="spm-form-group">
            <label htmlFor="code">
              Service Code *
              {errors.code && <span className="spm-error-message">{errors.code}</span>}
            </label>
            <input
              type="text"
              id="code"
              name="code"
              value={formData.code}
              onChange={handleInputChange}
              className={errors.code ? 'spm-error' : ''}
              placeholder="Eg: OIL_CHANGE"
            />
          </div>

          <div className="spm-form-group">
            <label htmlFor="name">
              Service Name *
              {errors.name && <span className="spm-error-message">{errors.name}</span>}
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={errors.name ? 'spm-error' : ''}
              placeholder="Eg: Oil Change Service"
            />
          </div>

          <div className="spm-form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              placeholder="Describe the service..."
            />
          </div>

          <div className="spm-form-row">
            <div className="spm-form-group">
              <label htmlFor="estimatedHours">
                Estimated Hours *
                {errors.estimatedHours && <span className="spm-error-message">{errors.estimatedHours}</span>}
              </label>
              <input
                type="number"
                id="estimatedHours"
                name="estimatedHours"
                value={formData.estimatedHours}
                onChange={handleInputChange}
                className={errors.estimatedHours ? 'spm-error' : ''}
                min="0.1"
                step="0.1"
              />
            </div>

            <div className="spm-form-group">
              <label htmlFor="hourlyRate">
                Hourly Rate (LKR) *
                {errors.hourlyRate && <span className="spm-error-message">{errors.hourlyRate}</span>}
              </label>
              <input
                type="number"
                id="hourlyRate"
                name="hourlyRate"
                value={formData.hourlyRate}
                onChange={handleInputChange}
                className={errors.hourlyRate ? 'spm-error' : ''}
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="spm-form-group">
            <label htmlFor="category">Category</label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              placeholder="Eg: Maintenance, Repair, etc."
            />
          </div>

          <div className="spm-form-group">
            <div className="spm-toggle-container">
              <div className="spm-toggle-label">
                <span className="spm-toggle-title">Service Status</span>
                <span className="spm-toggle-subtitle">Control whether this service is active</span>
              </div>
              <div className="spm-toggle-status">
                <div className={`spm-status-indicator ${formData.isActive ? 'spm-status-available' : 'spm-status-unavailable'}`}></div>
                <span className={`spm-status-text ${formData.isActive ? 'spm-status-available' : 'spm-status-unavailable'}`}>
                  {formData.isActive ? 'Active' : 'Inactive'}
                </span>
                <button
                  type="button"
                  className={`spm-toggle-switch ${formData.isActive ? 'spm-toggle-active' : ''}`}
                  onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
                >
                  <div className="spm-toggle-slider"></div>
                </button>
              </div>
            </div>
          </div>

          <div className="spm-form-actions">
            <button type="button" onClick={onClose} className="spm-btn-secondary">
              Cancel
            </button>
            <button type="submit" className="spm-btn-primary">
              {service ? 'Update Service' : 'Create Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};