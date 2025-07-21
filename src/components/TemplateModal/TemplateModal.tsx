import React, { useState, useEffect } from 'react';
import type { InspectionTemplate, InspectionItem } from '../../types/Inspection';
import './TemplateModal.scss';

interface TemplateModalProps {
  template: InspectionTemplate | null;
  onClose: () => void;
  onSave: (template: InspectionTemplate) => void;
}

const TemplateModal: React.FC<TemplateModalProps> = ({
  template,
  onClose,
  onSave
}) => {
  const [currentTemplate, setCurrentTemplate] = useState<InspectionTemplate | null>(template);
  const [isEditing, setIsEditing] = useState(false);
  const [newItem, setNewItem] = useState<Partial<InspectionItem>>({
    title: '',
    description: '',
    category: '',
    required: true,
    priority: 'medium'
  });

  useEffect(() => {
    if (template) {
      setCurrentTemplate(template);
    } else {
      setCurrentTemplate({
        id: `template-${Date.now()}`,
        name: '',
        description: '',
        category: 'custom',
        items: [],
        estimatedDuration: 30,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'Current User'
      });
    }
  }, [template]);

  const handleInputChange = (field: keyof InspectionTemplate, value: any) => {
    if (!currentTemplate) return;
    setCurrentTemplate({
      ...currentTemplate,
      [field]: value,
      updatedAt: new Date().toISOString()
    });
  };

  const handleNewItemChange = (field: keyof InspectionItem, value: any) => {
    setNewItem({
      ...newItem,
      [field]: value
    });
  };

  const handleAddItem = () => {
    if (!currentTemplate || !newItem.title) return;

    const item: InspectionItem = {
      id: `item-${Date.now()}`,
      title: newItem.title,
      description: newItem.description || '',
      category: newItem.category || 'general',
      status: 'pending',
      required: newItem.required || true,
      priority: newItem.priority || 'medium'
    };

    setCurrentTemplate({
      ...currentTemplate,
      items: [...currentTemplate.items, item],
      updatedAt: new Date().toISOString()
    });

    setNewItem({
      title: '',
      description: '',
      category: '',
      required: true,
      priority: 'medium'
    });
  };

  const handleRemoveItem = (itemId: string) => {
    if (!currentTemplate) return;

    setCurrentTemplate({
      ...currentTemplate,
      items: currentTemplate.items.filter(item => item.id !== itemId),
      updatedAt: new Date().toISOString()
    });
  };

  const handleMoveItem = (itemId: string, direction: 'up' | 'down') => {
    if (!currentTemplate) return;

    const items = [...currentTemplate.items];
    const index = items.findIndex(item => item.id === itemId);
    
    if (direction === 'up' && index > 0) {
      [items[index], items[index - 1]] = [items[index - 1], items[index]];
    } else if (direction === 'down' && index < items.length - 1) {
      [items[index], items[index + 1]] = [items[index + 1], items[index]];
    }

    setCurrentTemplate({
      ...currentTemplate,
      items,
      updatedAt: new Date().toISOString()
    });
  };

  const handleSave = () => {
    if (!currentTemplate || !currentTemplate.name) return;
    onSave(currentTemplate);
  };

  const getPriorityClass = (priority: InspectionItem['priority']) => {
    switch (priority) {
      case 'critical': return 'priority-critical';
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
    }
  };

  if (!currentTemplate) {
    return null;
  }

  return (
    <div className="template-modal-overlay" onClick={onClose}>
      <div className="template-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="header-content">
            <h2>{template ? 'Edit Template' : 'Create Template'}</h2>
            <p>Configure inspection template and checklist items</p>
          </div>
          <div className="header-actions">
            <button 
              className={`btn ${isEditing ? 'btn--secondary' : 'btn--primary'}`}
              onClick={() => setIsEditing(!isEditing)}
            >
              <i className={`bx ${isEditing ? 'bx-save' : 'bx-edit'}`}></i>
              {isEditing ? 'Save' : 'Edit'}
            </button>
            <button className="close-btn" onClick={onClose}>
              <i className='bx bx-x'></i>
            </button>
          </div>
        </div>

        <div className="modal-content">
          <div className="template-details">
            <div className="form-group">
              <label>Template Name *</label>
              <input
                type="text"
                value={currentTemplate.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                disabled={!isEditing}
                placeholder="Enter template name"
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={currentTemplate.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                disabled={!isEditing}
                placeholder="Enter template description"
                rows={3}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select
                  value={currentTemplate.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  disabled={!isEditing}
                >
                  <option value="safety">Safety</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="diagnostic">Diagnostic</option>
                  <option value="pre-delivery">Pre-Delivery</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <div className="form-group">
                <label>Estimated Duration (minutes)</label>
                <input
                  type="number"
                  value={currentTemplate.estimatedDuration}
                  onChange={(e) => handleInputChange('estimatedDuration', parseInt(e.target.value))}
                  disabled={!isEditing}
                  min="5"
                  max="480"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={currentTemplate.isActive}
                  onChange={(e) => handleInputChange('isActive', e.target.checked)}
                  disabled={!isEditing}
                />
                Active Template
              </label>
            </div>
          </div>

          <div className="checklist-items-section">
            <div className="section-header">
              <h3>Checklist Items ({currentTemplate.items.length})</h3>
              {isEditing && (
                <button className="btn btn--secondary" onClick={() => setIsEditing(true)}>
                  <i className='bx bx-plus'></i>
                  Add Item
                </button>
              )}
            </div>

            {isEditing && (
              <div className="add-item-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Item Title *</label>
                    <input
                      type="text"
                      value={newItem.title}
                      onChange={(e) => handleNewItemChange('title', e.target.value)}
                      placeholder="Enter item title"
                    />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <input
                      type="text"
                      value={newItem.category}
                      onChange={(e) => handleNewItemChange('category', e.target.value)}
                      placeholder="e.g., brakes, engine, interior"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={newItem.description}
                    onChange={(e) => handleNewItemChange('description', e.target.value)}
                    placeholder="Enter item description"
                    rows={2}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Priority</label>
                    <select
                      value={newItem.priority}
                      onChange={(e) => handleNewItemChange('priority', e.target.value)}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={newItem.required}
                        onChange={(e) => handleNewItemChange('required', e.target.checked)}
                      />
                      Required Item
                    </label>
                  </div>
                </div>

                <button 
                  className="btn btn--primary"
                  onClick={handleAddItem}
                  disabled={!newItem.title}
                >
                  Add Item
                </button>
              </div>
            )}

            <div className="checklist-items">
              {currentTemplate.items.length === 0 ? (
                <div className="empty-state">
                  <i className='bx bx-clipboard'></i>
                  <p>No checklist items yet. Add items to create a complete inspection template.</p>
                </div>
              ) : (
                currentTemplate.items.map((item, index) => (
                  <div key={item.id} className="checklist-item">
                    <div className="item-content">
                      <div className="item-header">
                        <div className="item-info">
                          <h4 className="item-title">
                            {item.title}
                            {item.required && <span className="required-badge">Required</span>}
                            <span className={`priority-badge ${getPriorityClass(item.priority)}`}>
                              {item.priority}
                            </span>
                          </h4>
                          {item.description && (
                            <p className="item-description">{item.description}</p>
                          )}
                          <span className="item-category">{item.category}</span>
                        </div>
                        {isEditing && (
                          <div className="item-actions">
                            <button
                              className="btn-icon"
                              onClick={() => handleMoveItem(item.id, 'up')}
                              disabled={index === 0}
                              title="Move Up"
                            >
                              <i className='bx bx-up-arrow-alt'></i>
                            </button>
                            <button
                              className="btn-icon"
                              onClick={() => handleMoveItem(item.id, 'down')}
                              disabled={index === currentTemplate.items.length - 1}
                              title="Move Down"
                            >
                              <i className='bx bx-down-arrow-alt'></i>
                            </button>
                            <button
                              className="btn-icon btn-icon--danger"
                              onClick={() => handleRemoveItem(item.id)}
                              title="Remove Item"
                            >
                              <i className='bx bx-trash'></i>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
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
                disabled={!currentTemplate.name}
              >
                Save Template
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateModal; 