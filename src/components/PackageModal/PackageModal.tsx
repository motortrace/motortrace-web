import React, { useState, useEffect } from 'react';
import './PackageModal.scss';

interface ServiceItem {
  id: string;
  name: string;
  description: string;
  category: string;
  laborHours: number;
  laborCharge: number;
  isActive: boolean;
}

interface PackageModalProps {
  packageData: any | null;
  individualServices: ServiceItem[];
  onClose: () => void;
  onSave: (pkg: any) => void;
}

const defaultDiscount = { type: 'percent', value: 0 };

const PackageModal: React.FC<PackageModalProps> = ({
  packageData,
  individualServices,
  onClose,
  onSave
}) => {
  const [currentPackage, setCurrentPackage] = useState<any | null>(packageData);
  const [isEditing, setIsEditing] = useState(!packageData);
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>(packageData?.serviceIds || []);
  const [discount, setDiscount] = useState<{ type: 'percent' | 'fixed'; value: number }>(packageData?.discount || defaultDiscount);
  const [customTotal, setCustomTotal] = useState<number | null>(packageData?.customTotal || null);
  const [serviceToAdd, setServiceToAdd] = useState<string>('');

  useEffect(() => {
    if (packageData) {
      setCurrentPackage(packageData);
      setSelectedServiceIds(packageData.serviceIds || []);
      setDiscount(packageData.discount || defaultDiscount);
      setCustomTotal(packageData.customTotal || null);
    } else {
      setCurrentPackage({
        id: `package-${Date.now()}`,
        name: '',
        description: '',
        category: 'custom',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'Current User',
      });
      setSelectedServiceIds([]);
      setDiscount(defaultDiscount);
      setCustomTotal(null);
    }
  }, [packageData]);

  const handleInputChange = (field: string, value: any) => {
    setCurrentPackage({
      ...currentPackage,
      [field]: value,
      updatedAt: new Date().toISOString()
    });
  };

  const handleAddService = () => {
    if (serviceToAdd && !selectedServiceIds.includes(serviceToAdd)) {
      setSelectedServiceIds(prev => [...prev, serviceToAdd]);
      setServiceToAdd('');
    }
  };

  const handleRemoveService = (serviceId: string) => {
    setSelectedServiceIds(prev => prev.filter(id => id !== serviceId));
  };

  const selectedServices = individualServices.filter(s => selectedServiceIds.includes(s.id));
  const subtotal = selectedServices.reduce((sum, s) => sum + s.laborCharge, 0);
  const discountAmount = discount.type === 'percent' ? (subtotal * discount.value) / 100 : discount.value;
  const calculatedTotal = Math.max(0, subtotal - discountAmount);
  const displayTotal = customTotal !== null ? customTotal : calculatedTotal;

  const handleSave = () => {
    if (!currentPackage || !currentPackage.name || selectedServiceIds.length === 0) return;
    
    onSave({
      ...currentPackage,
      serviceIds: selectedServiceIds,
      discount,
      subtotal,
      total: calculatedTotal,
      customTotal: customTotal !== null ? customTotal : undefined,
    });
  };

  const handleToggleEdit = () => {
    if (isEditing) {
      handleSave();
    } else {
      setIsEditing(true);
    }
  };

  return (
    <div className="package-modal-overlay" onClick={onClose}>
      <div className="package-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="header-content">
            <h2>{packageData ? 'Edit Package' : 'Create Package'}</h2>
            <p>Configure service package and included services</p>
          </div>
          <div className="header-actions">
            {packageData && (
              <button 
                className={`btn ${isEditing ? 'btn--success' : 'btn--primary'}`} 
                onClick={handleToggleEdit}
                disabled={isEditing && (!currentPackage?.name || selectedServiceIds.length === 0)}
              >
                <i className={`bx ${isEditing ? 'bx-save' : 'bx-edit'}`}></i>
                {isEditing ? 'Save' : 'Edit'}
              </button>
            )}
            <button className="close-btn" onClick={onClose}>
              <i className='bx bx-x'></i>
            </button>
          </div>
        </div>

        <div className="modal-content">
          <div className="package-details">
            <div className="form-group">
              <label>Package Name *</label>
              <input 
                type="text" 
                value={currentPackage?.name || ''} 
                onChange={e => handleInputChange('name', e.target.value)} 
                disabled={!isEditing} 
                placeholder="Enter package name" 
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea 
                value={currentPackage?.description || ''} 
                onChange={e => handleInputChange('description', e.target.value)} 
                disabled={!isEditing} 
                placeholder="Enter package description" 
                rows={3} 
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <input 
                  type="text" 
                  value={currentPackage?.category || ''} 
                  onChange={e => handleInputChange('category', e.target.value)} 
                  disabled={!isEditing} 
                  placeholder="e.g., Maintenance, Brakes, Custom" 
                />
              </div>
              <div className="form-group">
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={currentPackage?.isActive ?? true} 
                    onChange={e => handleInputChange('isActive', e.target.checked)} 
                    disabled={!isEditing} 
                  />
                  Active Package
                </label>
              </div>
            </div>
          </div>

          <div className="package-services-section">
            <div className="section-header">
              <h3>Package Services</h3>
              <div className="service-count">
                {selectedServices.length} service{selectedServices.length !== 1 ? 's' : ''} selected
              </div>
            </div>

            {isEditing && (
              <div className="service-selector">
                <div className="selector-row">
                  <div className="select-wrapper">
                    <select
                      value={serviceToAdd}
                      onChange={e => setServiceToAdd(e.target.value)}
                      className="service-select"
                    >
                      <option value="">Select a service to add...</option>
                      {individualServices
                        .filter(s => !selectedServiceIds.includes(s.id) && s.isActive)
                        .map(service => (
                          <option key={service.id} value={service.id}>
                            {service.name} - ${service.laborCharge.toFixed(2)} ({service.laborHours}h)
                          </option>
                        ))}
                    </select>
                  </div>
                  <button
                    className="btn btn--primary add-service-btn"
                    onClick={handleAddService}
                    disabled={!serviceToAdd}
                  >
                    <i className="bx bx-plus"></i>
                    Add Service
                  </button>
                </div>
              </div>
            )}

            <div className="services-table-container">
              {selectedServices.length === 0 ? (
                <div className="empty-services">
                  <i className="bx bx-package"></i>
                  <p>No services selected for this package</p>
                  {isEditing && <p className="empty-hint">Use the selector above to add services</p>}
                </div>
              ) : (
                <table className="services-table">
                  <thead>
                    <tr>
                      <th>Service Name</th>
                      <th>Category</th>
                      <th>Labor Hours</th>
                      <th>Labor Charge</th>
                      {isEditing && <th>Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedServices.map(service => (
                      <tr key={service.id}>
                        <td>
                          <div className="service-name">
                            {service.name}
                            {service.description && (
                              <div className="service-description">{service.description}</div>
                            )}
                          </div>
                        </td>
                        <td>
                          <span className="service-category">{service.category}</span>
                        </td>
                        <td>{service.laborHours}</td>
                        <td>${service.laborCharge.toFixed(2)}</td>
                        {isEditing && (
                          <td>
                            <button
                              className="btn-icon btn-icon--danger"
                              onClick={() => handleRemoveService(service.id)}
                              title="Remove Service"
                            >
                              <i className='bx bx-trash'></i>
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {selectedServices.length > 0 && (
              <div className="package-summary">
                <div className="summary-row">
                  <span className="summary-label">Subtotal:</span>
                  <span className="summary-value">${subtotal.toFixed(2)}</span>
                </div>

                <div className="summary-row discount-row">
                  <div className="discount-controls">
                    <span className="summary-label">Discount:</span>
                    {isEditing && (
                      <div className="discount-inputs">
                        <select 
                          value={discount.type} 
                          onChange={e => setDiscount(d => ({ ...d, type: e.target.value as 'percent' | 'fixed' }))}
                          className="discount-type"
                        >
                          <option value="percent">%</option>
                          <option value="fixed">$</option>
                        </select>
                        <input
                          type="number"
                          value={discount.value}
                          min={0}
                          max={discount.type === 'percent' ? 100 : subtotal}
                          step={discount.type === 'percent' ? 1 : 0.01}
                          onChange={e => setDiscount(d => ({ ...d, value: Number(e.target.value) }))}
                          className="discount-value"
                        />
                      </div>
                    )}
                  </div>
                  <span className="summary-value">
                    {!isEditing && `${discount.type === 'percent' ? discount.value + '%' : '$' + discount.value.toFixed(2)}`}
                    {isEditing && `-$${discountAmount.toFixed(2)}`}
                  </span>
                </div>

                <div className="summary-row total-row">
                  <span className="summary-label total-label">Total:</span>
                  <div className="total-value">
                    {isEditing ? (
                      <input
                        type="number"
                        value={displayTotal}
                        min={0}
                        step={0.01}
                        onChange={e => setCustomTotal(Number(e.target.value))}
                        className="custom-total-input"
                        placeholder="Custom total"
                      />
                    ) : (
                      <span className="total-amount">${displayTotal.toFixed(2)}</span>
                    )}
                  </div>
                </div>

                {customTotal !== null && customTotal !== calculatedTotal && (
                  <div className="summary-note">
                    <i className="bx bx-info-circle"></i>
                    Custom total applied (calculated: ${calculatedTotal.toFixed(2)})
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <div className="footer-actions">
            <button className="btn btn--secondary" onClick={onClose}>
              Cancel
            </button>
            {isEditing && (
              <button 
                className="btn btn--primary" 
                onClick={handleSave} 
                disabled={!currentPackage?.name || selectedServiceIds.length === 0}
              >
                <i className="bx bx-save"></i>
                Save Package
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageModal;