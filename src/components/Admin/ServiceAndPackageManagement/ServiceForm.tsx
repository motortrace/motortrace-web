import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { Service, ServiceFormData } from '../../../types/ServicesAndPackages';

interface ServiceFormProps {
  service?: Service;
  onClose: () => void;
  onSubmit: (service: Omit<Service, 'id'>) => void;
}

export const ServiceForm: React.FC<ServiceFormProps> = ({ 
  service, 
  onClose, 
  onSubmit 
}) => {
  const [formData, setFormData] = useState<ServiceFormData>({
    name: service?.name || '',
    shortDescription: service?.shortDescription || '',
    detailedDescription: service?.detailedDescription || '',
    price: service?.price?.toString() || '',
    duration: service?.duration || '',
    image: service?.image || '',
    warranty: service?.warranty || '',
    whatsIncluded: service?.whatsIncluded?.join('\n') || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      shortDescription: formData.shortDescription,
      detailedDescription: formData.detailedDescription,
      price: parseFloat(formData.price),
      duration: formData.duration,
      image: formData.image,
      isAvailable: true,
      warranty: formData.warranty,
      whatsIncluded: formData.whatsIncluded.split('\n').filter(item => item.trim())
    });
  };

  return (
    <div className="spm-modal-overlay" onClick={onClose}>
      <div className="spm-modal-content spm-modal-content--large" onClick={e => e.stopPropagation()}>
        <div className="spm-modal__header">
          <h2>{service ? 'Edit Service' : 'Add New Service'}</h2>
          <button className="spm-modal__close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="spm-modal__body">
          <div className="spm-form-group">
            <label>Service Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          <div className="spm-form-group">
            <label>Short Description</label>
            <input
              type="text"
              value={formData.shortDescription}
              onChange={e => setFormData({...formData, shortDescription: e.target.value})}
              required
            />
          </div>
          <div className="spm-form-group">
            <label>Detailed Description</label>
            <textarea
              value={formData.detailedDescription}
              onChange={e => setFormData({...formData, detailedDescription: e.target.value})}
              rows={3}
              required
            />
          </div>
          <div className="spm-form-row">
            <div className="spm-form-group">
              <label>Price (LKR)</label>
              <input
                type="number"
                value={formData.price}
                onChange={e => setFormData({...formData, price: e.target.value})}
                required
              />
            </div>
            <div className="spm-form-group">
              <label>Duration</label>
              <input
                type="text"
                value={formData.duration}
                onChange={e => setFormData({...formData, duration: e.target.value})}
                placeholder="e.g., 45 minutes"
                required
              />
            </div>
          </div>
          <div className="spm-form-group">
            <label>Service Image URL</label>
            <input
              type="url"
              value={formData.image}
              onChange={e => setFormData({...formData, image: e.target.value})}
              required
            />
          </div>
          <div className="spm-form-group">
            <label>Warranty (optional)</label>
            <input
              type="text"
              value={formData.warranty}
              onChange={e => setFormData({...formData, warranty: e.target.value})}
              placeholder="e.g., 7-day shine guarantee"
            />
          </div>
          <div className="spm-form-group">
            <label>What's Included (one per line)</label>
            <textarea
              value={formData.whatsIncluded}
              onChange={e => setFormData({...formData, whatsIncluded: e.target.value})}
              rows={4}
              placeholder="Exterior foam wash&#10;Hand drying&#10;Wheel cleaning"
              required
            />
          </div>
          <div className="spm-form-actions">
            <button type="button" className="spm-btn spm-btn--secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="spm-btn spm-btn--primary">
              {service ? 'Update Service' : 'Add Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};