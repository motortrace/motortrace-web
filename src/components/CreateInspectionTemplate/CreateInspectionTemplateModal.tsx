// CreateInspectionTemplateModal.tsx
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { inspectionTemplatesService } from '../../services/inspectionTemplatesService';
import './CreateInspectionTemplateModal.scss';

interface CreateInspectionTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface TemplateItemFormData {
  name: string;
  description?: string;
  category: string;
  isRequired: boolean;
  allowsNotes: boolean;
  sortOrder: number;
}

interface InspectionTemplateFormData {
  name: string;
  description: string;
  category: string;
  isActive: boolean;
  sortOrder: number;
  templateItems: TemplateItemFormData[];
}

const CreateInspectionTemplateModal: React.FC<CreateInspectionTemplateModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<InspectionTemplateFormData>({
    name: '',
    description: '',
    category: '',
    isActive: true,
    sortOrder: 0,
    templateItems: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [showItemForm, setShowItemForm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [currentItem, setCurrentItem] = useState<TemplateItemFormData>({
    name: '',
    description: '',
    category: '',
    isRequired: true,
    allowsNotes: true,
    sortOrder: 0,
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        description: '',
        category: '',
        isActive: true,
        sortOrder: 0,
        templateItems: [],
      });
      setError('');
      setShowItemForm(false);
      setShowSuccessModal(false);
      setSuccessMessage('');
      setCurrentItem({
        name: '',
        description: '',
        category: formData.category || '',
        isRequired: true,
        allowsNotes: true,
        sortOrder: 0,
      });
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // This would typically come from a categories service
        const commonCategories = [
          'Electrical',
          'Mechanical',
          'Brakes',
          'Suspension',
          'Engine',
          'Transmission',
          'Interior',
          'Exterior',
          'Safety',
          'General'
        ];
        setCategories(commonCategories);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };

    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const handleInputChange = (field: keyof InspectionTemplateFormData, value: any) => {
    setFormData(prev => {
      const updated = {
        ...prev,
        [field]: value,
      };

      // If category changes, update currentItem category as well
      if (field === 'category') {
        setCurrentItem(prevItem => ({
          ...prevItem,
          category: value,
        }));
      }

      return updated;
    });
  };

  const handleItemInputChange = (field: keyof TemplateItemFormData, value: any) => {
    setCurrentItem(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const addTemplateItem = () => {
    if (!currentItem.name.trim() || !currentItem.category.trim()) {
      setError('Item name and category are required');
      return;
    }

    const newItem = {
      ...currentItem,
      sortOrder: formData.templateItems.length,
    };

    setFormData(prev => ({
      ...prev,
      templateItems: [...prev.templateItems, newItem],
    }));

    setCurrentItem({
      name: '',
      description: '',
      category: '',
      isRequired: true,
      allowsNotes: true,
      sortOrder: formData.templateItems.length + 1,
    });
    setShowItemForm(false);
    setError('');
  };

  const removeTemplateItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      templateItems: prev.templateItems.filter((_, i) => i !== index),
    }));
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const items = [...formData.templateItems];
    if (direction === 'up' && index > 0) {
      [items[index], items[index - 1]] = [items[index - 1], items[index]];
    } else if (direction === 'down' && index < items.length - 1) {
      [items[index], items[index + 1]] = [items[index + 1], items[index]];
    }
    
    // Update sort orders
    const updatedItems = items.map((item, idx) => ({
      ...item,
      sortOrder: idx,
    }));

    setFormData(prev => ({
      ...prev,
      templateItems: updatedItems,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      if (!formData.name.trim()) {
        throw new Error('Template name is required');
      }
      if (!formData.description.trim()) {
        throw new Error('Template description is required');
      }
      if (!formData.category.trim()) {
        throw new Error('Category is required');
      }
      if (formData.templateItems.length === 0) {
        throw new Error('At least one template item is required');
      }

      const submitData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category.trim(),
        sortOrder: formData.sortOrder,
        templateItems: formData.templateItems.map(item => ({
          name: item.name.trim(),
          description: item.description?.trim(),
          category: item.category.trim(),
          isRequired: item.isRequired,
          allowsNotes: item.allowsNotes,
          sortOrder: item.sortOrder,
        })),
      };

      // Note: isActive is not included in creation request as per backend validation

      const result = await inspectionTemplatesService.createInspectionTemplate(submitData);

      if (!result.success) {
        throw new Error(result.error || 'Failed to create inspection template');
      }

      setSuccessMessage('Inspection template created successfully!');
      setShowSuccessModal(true);
      onSuccess();
    } 
    catch (err: any) {
      setError(err.message || 'Failed to create inspection template');
    } 
    finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="inspection-template-modal__overlay" onClick={handleBackdropClick}>
        <div className="inspection-template-modal" onClick={e => e.stopPropagation()}>
        <div className="inspection-template-modal__header">
          <div className="inspection-template-modal__title-wrapper">
            <h2>Create Inspection Template</h2>
            <p className="inspection-template-modal__subtitle">
              Configure a new inspection template with customizable checklist items
            </p>
          </div>
          <button
            style={{color: '#fff'}}
            className="inspection-template-modal__close-icon"
            onClick={onClose}
            type="button"
          >
            X
          </button>
        </div>

        <div className="inspection-template-modal__body">
          <form className="inspection-template-form" onSubmit={handleSubmit}>
            {error && (
              <div className="inspection-template-form__error">
                {error}
              </div>
            )}

            <div className="inspection-template-form__grid">
              <div className="inspection-template-form__section">
                <h3 className="inspection-template-form__section-title">Basic Information</h3>

                <div className="inspection-template-form__row inspection-template-form__row--two-col">
                  <div className="inspection-template-form__group">
                    <label htmlFor="name">
                      Template Name <span className="inspection-template-form__required">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="e.g., Electrical System Inspection"
                    />
                  </div>

                  <div className="inspection-template-form__group">
                    <label htmlFor="category">
                      Category <span className="inspection-template-form__required">*</span>
                    </label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="inspection-template-form__group">
                  <label htmlFor="description">
                    Description <span className="inspection-template-form__required">*</span>
                  </label>
                  <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Provide a detailed description of what this inspection template covers..."
                />
                </div>

                <div style={{marginTop: '20px'}} className="inspection-template-form__row inspection-template-form__row--two-col">
                  <div className="inspection-template-form__group">
                    <label htmlFor="sortOrder">Sort Order</label>
                    <input
                      type="number"
                      id="sortOrder"
                      value={formData.sortOrder}
                      onChange={(e) => handleInputChange('sortOrder', parseInt(e.target.value) || 0)}
                      min="0"
                      placeholder="0"
                    />
                  </div>

                  <div className="inspection-template-form__checkbox-grid" style={{marginTop: '16px', gridTemplateColumns: '1fr'}}>
                    <label className="inspection-template-form__checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => handleInputChange('isActive', e.target.checked)}
                      />
                      Template is active
                    </label>
                  </div>
                </div>
              </div>

              <div className="inspection-template-form__section">
                <div className="inspection-template-form__section-header">
                  <h3 className="inspection-template-form__section-title">Checklist Items</h3>
                  <button
                    type="button"
                    className="inspection-template-form__add-item-btn"
                    onClick={() => setShowItemForm(true)}
                  >
                    + Add Item
                  </button>
                </div>

                {showItemForm && (
                  <div className="inspection-template-form__item-form">
                    <h4 className="inspection-template-form__item-form-title">Add New Checklist Item</h4>
                    
                    <div className="inspection-template-form__row inspection-template-form__row--two-col">
                      <div className="inspection-template-form__group">
                        <label htmlFor="itemName">
                          Item Name <span className="inspection-template-form__required">*</span>
                        </label>
                        <input
                          type="text"
                          id="itemName"
                          value={currentItem.name}
                          onChange={(e) => handleItemInputChange('name', e.target.value)}
                          placeholder="e.g., Battery Condition"
                        />
                      </div>

                      <div className="inspection-template-form__group">
                        <label htmlFor="itemCategory">
                          Item Category <span className="inspection-template-form__required">*</span>
                        </label>
                        <input
                          type="text"
                          id="itemCategory"
                          value={currentItem.category}
                          onChange={(e) => handleItemInputChange('category', e.target.value)}
                          placeholder="e.g., Electrical"
                        />
                      </div>
                    </div>

                    <div className="inspection-template-form__group">
                      <label htmlFor="itemDescription">Item Description</label>
                      <textarea
                        id="itemDescription"
                        value={currentItem.description}
                        onChange={(e) => handleItemInputChange('description', e.target.value)}
                        placeholder="Describe what to check for this item..."
                      />
                    </div>

                    <div className="inspection-template-form__checkbox-grid" style={{marginTop: '16px'}}>
                      <label className="inspection-template-form__checkbox-label">
                        <input
                          type="checkbox"
                          checked={currentItem.isRequired}
                          onChange={(e) => handleItemInputChange('isRequired', e.target.checked)}
                        />
                        Required item
                      </label>

                      <label className="inspection-template-form__checkbox-label">
                        <input
                          type="checkbox"
                          checked={currentItem.allowsNotes}
                          onChange={(e) => handleItemInputChange('allowsNotes', e.target.checked)}
                        />
                        Allow notes
                      </label>
                    </div>

                    <div className="inspection-template-form__item-actions">
                      <button
                        type="button"
                        className="inspection-template-form__btn inspection-template-form__btn--secondary"
                        onClick={() => setShowItemForm(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="inspection-template-form__btn inspection-template-form__btn--primary"
                        onClick={addTemplateItem}
                      >
                        Add Item
                      </button>
                    </div>
                  </div>
                )}

                {formData.templateItems.length > 0 ? (
                  <div className="inspection-template-form__items-list">
                    {formData.templateItems.map((item, index) => (
                      <div key={index} className="inspection-template-form__item-card">
                        <div className="inspection-template-form__item-content">
                          <div className="inspection-template-form__item-header">
                            <h4 className="inspection-template-form__item-name">{item.name}</h4>
                            <span className="inspection-template-form__item-category">{item.category}</span>
                          </div>
                          {item.description && (
                            <p className="inspection-template-form__item-description">{item.description}</p>
                          )}
                          <div className="inspection-template-form__item-meta">
                            <span className={`inspection-template-form__item-tag ${item.isRequired ? 'required' : 'optional'}`}>
                              {item.isRequired ? 'Required' : 'Optional'}
                            </span>
                            <span className={`inspection-template-form__item-tag ${item.allowsNotes ? 'notes-allowed' : 'no-notes'}`}>
                              {item.allowsNotes ? 'Notes Allowed' : 'No Notes'}
                            </span>
                            <span className="inspection-template-form__item-order">
                              Order: {item.sortOrder}
                            </span>
                          </div>
                        </div>
                        <div className="inspection-template-form__item-actions">
                          <button
                            type="button"
                            className="inspection-template-form__item-btn inspection-template-form__item-btn--move"
                            onClick={() => moveItem(index, 'up')}
                            disabled={index === 0}
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            className="inspection-template-form__item-btn inspection-template-form__item-btn--move"
                            onClick={() => moveItem(index, 'down')}
                            disabled={index === formData.templateItems.length - 1}
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            className="inspection-template-form__item-btn inspection-template-form__item-btn--delete"
                            onClick={() => removeTemplateItem(index)}
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="inspection-template-form__empty-state">
                    <p>No checklist items added yet. Click "Add Item" to create your first inspection item.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="inspection-template-form__actions">
              <button
                type="button"
                className="inspection-template-form__btn inspection-template-form__btn--secondary"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inspection-template-form__btn inspection-template-form__btn--primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create Template'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    {showSuccessModal && (
      <div className="inspection-template-modal__overlay" onClick={handleSuccessModalClose}>
        <div className="inspection-template-modal inspection-template-modal--success" onClick={e => e.stopPropagation()}>
          <div className="inspection-template-modal__header">
            <div className="inspection-template-modal__title-wrapper">
              <h2>Success!</h2>
            </div>
            <button
              style={{color: '#fff'}}
              className="inspection-template-modal__close-icon"
              onClick={handleSuccessModalClose}
              type="button"
            >
              X
            </button>
          </div>
          <div className="inspection-template-modal__body">
            <div className="inspection-template-modal__success-content">
              <div className="inspection-template-modal__success-icon">✓</div>
              <p className="inspection-template-modal__success-message">{successMessage}</p>
              <button
                className="inspection-template-form__btn inspection-template-form__btn--primary"
                onClick={handleSuccessModalClose}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default CreateInspectionTemplateModal;