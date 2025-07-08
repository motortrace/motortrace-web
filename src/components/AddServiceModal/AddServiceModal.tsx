import React, { useState, useEffect } from 'react';
import './AddServiceModal.scss';

export interface AddServiceModalProps {
  service?: {
    id?: string;
    name: string;
    description: string;
    category: string;
    laborHours: number;
    laborCharge: number;
    tax: number;
    isActive: boolean;
  };
  onClose: () => void;
  onSave: (service: any) => void;
}

const defaultService = {
  name: '',
  description: '',
  category: '',
  laborHours: 0,
  laborCharge: 0,
  tax: 0,
  isActive: true,
};

const AddServiceModal: React.FC<AddServiceModalProps> = ({ service, onClose, onSave }) => {
  const [form, setForm] = useState(service || defaultService);
  const [isEditing, setIsEditing] = useState(!service);

  useEffect(() => {
    setForm(service || defaultService);
    setIsEditing(!service);
  }, [service]);

  const handleInputChange = (field: string, value: any) => {
    setForm({ ...form, [field]: value });
  };

  const handleSave = () => {
    if (!form.name) return;
    onSave(form);
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
          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <input type="text" value={form.category} onChange={e => handleInputChange('category', e.target.value)} disabled={!isEditing} placeholder="e.g., Maintenance, Brakes, Tires" />
            </div>
            <div className="form-group">
              <label>Labor Hours</label>
              <input type="number" value={form.laborHours} onChange={e => handleInputChange('laborHours', parseFloat(e.target.value))} disabled={!isEditing} min="0" step="0.1" />
            </div>
            <div className="form-group">
              <label>Labor Charge ($)</label>
              <input type="number" value={form.laborCharge} onChange={e => handleInputChange('laborCharge', parseFloat(e.target.value))} disabled={!isEditing} min="0" step="0.01" />
            </div>
            <div className="form-group">
              <label>Tax (%)</label>
              <input type="number" value={form.tax} onChange={e => handleInputChange('tax', parseFloat(e.target.value))} disabled={!isEditing} min="0" step="0.01" />
            </div>
          </div>
          <div className="form-group">
            <label className="checkbox-label">
              <input type="checkbox" checked={form.isActive} onChange={e => handleInputChange('isActive', e.target.checked)} disabled={!isEditing} />
              Active Service
            </label>
          </div>
        </div>
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
  );
};

export default AddServiceModal; 