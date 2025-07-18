import React, { useState, useEffect } from 'react';
import { getServiceTypes } from '../../utils/serviceTypesApi';
import './AddServiceModal.scss';

export interface AddServiceModalProps {
  service?: {
    id?: string;
    name: string;
    description?: string;
    serviceTypeId?: number;
    price: number;
    unit: string;
    duration?: number;
    discount?: number;
    isActive: boolean;
  };
  onClose: () => void;
  onSave: (service: any) => void;
}

const defaultService = {
  name: '',
  description: '',
  serviceTypeId: '',
  price: '',
  unit: '',
  duration: '',
  discount: '',
  isActive: true,
};

const AddServiceModal: React.FC<AddServiceModalProps> = ({ service, onClose, onSave }) => {
  const [form, setForm] = useState<any>(defaultService);
  const [serviceTypes, setServiceTypes] = useState<{ id: number; name: string }[]>([]);
  const [isEditing, setIsEditing] = useState(!service);
  const [error, setError] = useState('');

  useEffect(() => {
    setForm(service ? {
      ...defaultService,
      ...service,
      serviceTypeId: service.serviceTypeId ? String(service.serviceTypeId) : '',
      price: service.price !== undefined ? String(service.price) : '',
      duration: service.duration !== undefined ? String(service.duration) : '',
      discount: service.discount !== undefined ? String(service.discount) : '',
    } : defaultService);
    setIsEditing(!service);
  }, [service]);

  useEffect(() => {
    getServiceTypes()
      .then(setServiceTypes)
      .catch(() => setError('Failed to load service types'));
  }, []);

  const handleInputChange = (field: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setError('');
    if (!form.name.trim()) {
      setError('Name is required');
      return;
    }
    if (!form.serviceTypeId) {
      setError('Service type is required');
      return;
    }
    if (!form.price || isNaN(Number(form.price))) {
      setError('Price is required and must be a number');
      return;
    }
    if (!form.unit.trim()) {
      setError('Unit is required');
      return;
    }
    // Prepare payload for backend
    const payload = {
      name: form.name,
      description: form.description,
      serviceTypeId: Number(form.serviceTypeId),
      price: Number(form.price),
      unit: form.unit,
      duration: form.duration ? Number(form.duration) : null,
      discount: form.discount ? Number(form.discount) : 0,
      isActive: !!form.isActive,
    };
    onSave(payload);
  };

  return (
    <div className="add-service-modal-overlay" onClick={onClose}>
      <div className="add-service-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="header-content">
            <h2>{service ? 'Edit Service' : 'Add New Service'}</h2>
            <p>Enter all details for the auto repair service</p>
          </div>
          <div className="header-actions">
            <button className={`btn ${isEditing ? 'btn--secondary' : 'btn--primary'}`} onClick={() => setIsEditing(!isEditing)}>
              <i className={`bx ${isEditing ? 'bx-save' : 'bx-edit'}`}></i>
              {isEditing ? 'Save' : 'Edit'}
            </button>
            <button className="close-btn" onClick={onClose}>
              <i className='bx bx-x'></i>
            </button>
          </div>
        </div>
        <div className="modal-content">
          <div className="form-group">
            <label>Service Name *</label>
            <input type="text" value={form.name} onChange={e => handleInputChange('name', e.target.value)} disabled={!isEditing} placeholder="Enter service name" />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea value={form.description} onChange={e => handleInputChange('description', e.target.value)} disabled={!isEditing} placeholder="Enter service description" rows={3} />
          </div>
          <div className="form-group">
            <label>Service Type *</label>
            <select value={form.serviceTypeId} onChange={e => handleInputChange('serviceTypeId', e.target.value)} disabled={!isEditing} required>
              <option value="">Select type</option>
              {serviceTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Price (LKR) *</label>
            <input type="number" min="0" value={form.price} onChange={e => handleInputChange('price', e.target.value)} disabled={!isEditing} placeholder="e.g. 1000" />
          </div>
          <div className="form-group">
            <label>Unit *</label>
            <input type="text" value={form.unit} onChange={e => handleInputChange('unit', e.target.value)} disabled={!isEditing} placeholder="e.g. hour, service" />
          </div>
          <div className="form-group">
            <label>Duration (hours)</label>
            <input type="number" min="0" step="0.1" value={form.duration} onChange={e => handleInputChange('duration', e.target.value)} disabled={!isEditing} placeholder="e.g. 1.5" />
          </div>
          <div className="form-group">
            <label>Discount</label>
            <input type="number" min="0" value={form.discount} onChange={e => handleInputChange('discount', e.target.value)} disabled={!isEditing} placeholder="e.g. 0" />
          </div>
          <div className="form-group">
            <label className="checkbox-label">
              <input type="checkbox" checked={form.isActive} onChange={e => handleInputChange('isActive', e.target.checked)} disabled={!isEditing} />
              Active Service
            </label>
          </div>
          {error && <div className="form-error">{error}</div>}
          <div className="modal-footer">
            <div className="footer-actions">
              <button className="btn btn--secondary" onClick={onClose}>Cancel</button>
              {isEditing && (
                <button className="btn btn--primary" onClick={handleSave} disabled={!form.name}>Save Service</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddServiceModal; 