import React, { useState } from 'react';

interface AddPartFormData {
  partNumber: string;
  name: string;
  description: string;
  brand: string;
  category: string;
  quantity: number;
  minStockLevel: number;
  unitPrice: number;
  supplier: string;
  location: string;
  lastRestocked: string;
}

type AddPartFormErrors = Partial<Record<keyof AddPartFormData, string>>;

interface AddPartModalProps {
  onClose: () => void;
  onSubmit: (partData: AddPartFormData) => void;
}

const AddPartModal: React.FC<AddPartModalProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState<AddPartFormData>({
    partNumber: '',
    name: '',
    description: '',
    brand: '',
    category: '',
    quantity: 0,
    minStockLevel: 1,
    unitPrice: 0,
    supplier: '',
    location: '',
    lastRestocked: new Date().toISOString().split('T')[0]
  });

  const [errors, setErrors] = useState<AddPartFormErrors>({});

  const categories = [
    'Brakes',
    'Engine',
    'Tires',
    'Electrical',
    'Transmission',
    'Suspension',
    'Body',
    'Fluids',
    'Filters',
    'Belts & Hoses',
    'Exhaust',
    'Cooling',
    'Fuel System',
    'Ignition',
    'Other'
  ];

  const suppliers = [
    'AutoZone',
    'NAPA Auto Parts',
    'Advance Auto Parts',
    'O\'Reilly Auto Parts',
    'Tire Rack',
    'Interstate Batteries',
    'Bosch',
    'ACDelco',
    'Motorcraft',
    'Genuine Parts',
    'Other'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'number' ? parseFloat(value) || 0 : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Clear error when user starts typing
    if (errors[name as keyof AddPartFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: AddPartFormErrors = {};

    if (!formData.partNumber.trim()) {
      newErrors.partNumber = 'Part number is required';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Part name is required';
    }

    if (!formData.brand.trim()) {
      newErrors.brand = 'Brand is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (formData.quantity < 0) {
      newErrors.quantity = 'Quantity cannot be negative';
    }

    if (formData.minStockLevel < 0) {
      newErrors.minStockLevel = 'Minimum stock level cannot be negative';
    }

    if (formData.unitPrice <= 0) {
      newErrors.unitPrice = 'Unit price must be greater than 0';
    }

    if (!formData.supplier.trim()) {
      newErrors.supplier = 'Supplier is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content add-part-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Part</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="add-part-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="partNumber">Part Number *</label>
              <input
                type="text"
                id="partNumber"
                name="partNumber"
                value={formData.partNumber}
                onChange={handleInputChange}
                className={errors.partNumber ? 'error' : ''}
                placeholder="e.g., BRK-001"
              />
              {errors.partNumber && <span className="error-message">{errors.partNumber}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="name">Part Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={errors.name ? 'error' : ''}
                placeholder="e.g., Brake Pads"
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="brand">Brand *</label>
              <input
                type="text"
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                className={errors.brand ? 'error' : ''}
                placeholder="e.g., Wagner"
              />
              {errors.brand && <span className="error-message">{errors.brand}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={errors.category ? 'error' : ''}
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <span className="error-message">{errors.category}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="quantity">Current Quantity *</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                className={errors.quantity ? 'error' : ''}
                min="0"
              />
              {errors.quantity && <span className="error-message">{errors.quantity}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="minStockLevel">Minimum Stock Level *</label>
              <input
                type="number"
                id="minStockLevel"
                name="minStockLevel"
                value={formData.minStockLevel}
                onChange={handleInputChange}
                className={errors.minStockLevel ? 'error' : ''}
                min="0"
              />
              {errors.minStockLevel && <span className="error-message">{errors.minStockLevel}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="unitPrice">Unit Price ($) *</label>
              <input
                type="number"
                id="unitPrice"
                name="unitPrice"
                value={formData.unitPrice}
                onChange={handleInputChange}
                className={errors.unitPrice ? 'error' : ''}
                min="0"
                step="0.01"
              />
              {errors.unitPrice && <span className="error-message">{errors.unitPrice}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="supplier">Supplier *</label>
              <select
                id="supplier"
                name="supplier"
                value={formData.supplier}
                onChange={handleInputChange}
                className={errors.supplier ? 'error' : ''}
              >
                <option value="">Select Supplier</option>
                {suppliers.map(supplier => (
                  <option key={supplier} value={supplier}>{supplier}</option>
                ))}
              </select>
              {errors.supplier && <span className="error-message">{errors.supplier}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="location">Storage Location *</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className={errors.location ? 'error' : ''}
                placeholder="e.g., A1-B3"
              />
              {errors.location && <span className="error-message">{errors.location}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="lastRestocked">Last Restocked</label>
              <input
                type="date"
                id="lastRestocked"
                name="lastRestocked"
                value={formData.lastRestocked}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-group full-width">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              placeholder="Enter part description..."
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Part
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPartModal;