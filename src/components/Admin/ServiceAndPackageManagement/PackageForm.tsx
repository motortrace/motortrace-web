import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { Package, PackageFormData, Service } from '../../../types/ServicesAndPackages';

interface PackageFormProps {
  package?: Package;
  services: Service[];
  onClose: () => void;
  onSubmit: (pkg: Omit<Package, 'id'>) => void;
}

export const PackageForm: React.FC<PackageFormProps> = ({ 
  package: pkg, 
  services, 
  onClose, 
  onSubmit 
}) => {
  const [formData, setFormData] = useState<PackageFormData>({
    name: pkg?.name || '',
    description: pkg?.description || '',
    price: pkg?.price?.toString() || '',
    serviceIds: pkg?.serviceIds || [],
    image: pkg?.image || ''
  });

  const handleServiceToggle = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      serviceIds: prev.serviceIds.includes(serviceId)
        ? prev.serviceIds.filter(id => id !== serviceId)
        : [...prev.serviceIds, serviceId]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      serviceIds: formData.serviceIds,
      image: formData.image
    });
  };

  return (
    <div className="spm-modal-overlay" onClick={onClose}>
      <div className="spm-modal-content spm-modal-content--large" onClick={e => e.stopPropagation()}>
        <div className="spm-modal__header">
          <h2>{pkg ? 'Edit Package' : 'Add New Package'}</h2>
          <button className="spm-modal__close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="spm-modal__body">
          <div className="spm-form-group">
            <label>Package Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          <div className="spm-form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              rows={2}
              required
            />
          </div>
          <div className="spm-form-row">
            <div className="spm-form-group">
              <label>Package Price (LKR)</label>
              <input
                type="number"
                value={formData.price}
                onChange={e => setFormData({...formData, price: e.target.value})}
                required
              />
            </div>
            <div className="spm-form-group">
              <label>Package Image URL</label>
              <input
                type="url"
                value={formData.image}
                onChange={e => setFormData({...formData, image: e.target.value})}
                required
              />
            </div>
          </div>
          <div className="spm-form-group">
            <label>Select Services to Include</label>
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
                      <span className="spm-service-checkbox__price">LKR {service.price.toLocaleString()}</span>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="spm-form-actions">
            <button type="button" className="spm-btn spm-btn--secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="spm-btn spm-btn--primary">
              {pkg ? 'Update Package' : 'Add Package'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};