import React, { useState, useEffect } from 'react';
import type { DigitalInspection, InspectionTemplate, InspectionItem } from '../../types/Inspection';
import './InspectionModal.scss';

interface InspectionModalProps {
  inspection: DigitalInspection | null;
  templates: InspectionTemplate[];
  onClose: () => void;
  onSave: (inspection: DigitalInspection) => void;
}

const InspectionModal: React.FC<InspectionModalProps> = ({
  inspection,
  templates,
  onClose,
  onSave
}) => {
  const [currentInspection, setCurrentInspection] = useState<DigitalInspection | null>(inspection);
  const [selectedTemplate, setSelectedTemplate] = useState<InspectionTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState(inspection?.notes || '');

  useEffect(() => {
    if (inspection) {
      setCurrentInspection(inspection);
      setNotes(inspection.notes || '');
      const template = templates.find(t => t.id === inspection.templateId);
      setSelectedTemplate(template || null);
    } else {
      setCurrentInspection(null);
      setNotes('');
      setSelectedTemplate(null);
    }
  }, [inspection, templates]);

  const handleStatusChange = (itemId: string, newStatus: InspectionItem['status']) => {
    if (!currentInspection) return;

    const updatedItems = currentInspection.items.map(item => 
      item.id === itemId ? { ...item, status: newStatus, completedAt: newStatus !== 'pending' ? new Date().toISOString() : undefined } : item
    );

    const passedItems = updatedItems.filter(item => item.status === 'pass').length;
    const failedItems = updatedItems.filter(item => item.status === 'fail').length;
    const warningItems = updatedItems.filter(item => item.status === 'warning').length;
    const naItems = updatedItems.filter(item => item.status === 'na').length;

    let overallStatus: DigitalInspection['overallStatus'] = 'pending';
    if (failedItems > 0) {
      overallStatus = 'fail';
    } else if (warningItems > 0) {
      overallStatus = 'warning';
    } else if (passedItems === updatedItems.length) {
      overallStatus = 'pass';
    }

    const inspectionStatus = updatedItems.every(item => item.status !== 'pending') ? 'completed' : 'in-progress';

    setCurrentInspection({
      ...currentInspection,
      items: updatedItems,
      status: inspectionStatus,
      overallStatus,
      passedItems,
      failedItems,
      warningItems,
      naItems,
      updatedAt: new Date().toISOString()
    });
  };

  const handleItemNotesChange = (itemId: string, notes: string) => {
    if (!currentInspection) return;

    const updatedItems = currentInspection.items.map(item => 
      item.id === itemId ? { ...item, notes } : item
    );

    setCurrentInspection({
      ...currentInspection,
      items: updatedItems,
      updatedAt: new Date().toISOString()
    });
  };

  const handleTemplateSelect = (template: InspectionTemplate) => {
    if (!currentInspection) return;

    const newInspection: DigitalInspection = {
      ...currentInspection,
      templateId: template.id,
      templateName: template.name,
      items: template.items.map(item => ({
        ...item,
        status: 'pending' as const,
        technician: currentInspection.technician
      })),
      totalItems: template.items.length,
      passedItems: 0,
      failedItems: 0,
      warningItems: 0,
      naItems: 0,
      status: 'draft',
      overallStatus: 'pending',
      updatedAt: new Date().toISOString()
    };

    setCurrentInspection(newInspection);
    setSelectedTemplate(template);
  };

  const handleSave = () => {
    if (!currentInspection) return;

    const inspectionToSave = {
      ...currentInspection,
      notes
    };

    onSave(inspectionToSave);
  };

  const getStatusIcon = (status: InspectionItem['status']) => {
    switch (status) {
      case 'pass': return '✓';
      case 'fail': return '✗';
      case 'warning': return '⚠';
      case 'na': return '—';
      default: return '⏳';
    }
  };

  const getStatusClass = (status: InspectionItem['status']) => {
    switch (status) {
      case 'pass': return 'status-pass';
      case 'fail': return 'status-fail';
      case 'warning': return 'status-warning';
      case 'na': return 'status-na';
      default: return 'status-pending';
    }
  };

  const getPriorityClass = (priority: InspectionItem['priority']) => {
    switch (priority) {
      case 'critical': return 'priority-critical';
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
    }
  };

  const getProgressPercentage = () => {
    if (!currentInspection) return 0;
    const completedItems = currentInspection.passedItems + currentInspection.failedItems + currentInspection.warningItems + currentInspection.naItems;
    return Math.round((completedItems / currentInspection.totalItems) * 100);
  };

  if (!currentInspection) {
    return (
      <div className="inspection-modal-overlay" onClick={onClose}>
        <div className="inspection-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Create New Inspection</h2>
            <button className="close-btn" onClick={onClose}>
              <i className='bx bx-x'></i>
            </button>
          </div>
          <div className="modal-content">
            <p>Please select a work order to create an inspection for.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="inspection-modal-overlay" onClick={onClose}>
      <div className="inspection-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="header-content">
            <h2>Digital Inspection</h2>
            <div className="inspection-info">
              <span className="work-order">{currentInspection.workOrderId}</span>
              <span className="template-name">{currentInspection.templateName}</span>
            </div>
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
          <div className="inspection-overview">
            <div className="overview-grid">
              <div className="overview-item">
                <label>Customer</label>
                <span>{currentInspection.customerName}</span>
              </div>
              <div className="overview-item">
                <label>Vehicle</label>
                <span>{currentInspection.vehicleInfo}</span>
              </div>
              <div className="overview-item">
                <label>License Plate</label>
                <span>{currentInspection.licensePlate}</span>
              </div>
              <div className="overview-item">
                <label>Technician</label>
                <span>{currentInspection.technician}</span>
              </div>
              <div className="overview-item">
                <label>Started</label>
                <span>{new Date(currentInspection.startedAt).toLocaleString()}</span>
              </div>
              <div className="overview-item">
                <label>Status</label>
                <span className={`status-badge status-${currentInspection.status}`}>
                  {currentInspection.status}
                </span>
              </div>
            </div>

            <div className="progress-section">
              <div className="progress-header">
                <h3>Progress</h3>
                <span className="progress-percentage">{getProgressPercentage()}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${getProgressPercentage()}%` }}
                ></div>
              </div>
              <div className="progress-stats">
                <div className="stat-item">
                  <span className="stat-label">Passed</span>
                  <span className="stat-value passed">{currentInspection.passedItems}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Failed</span>
                  <span className="stat-value failed">{currentInspection.failedItems}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Warning</span>
                  <span className="stat-value warning">{currentInspection.warningItems}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">N/A</span>
                  <span className="stat-value na">{currentInspection.naItems}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="template-selector">
            <label>Inspection Template</label>
            <select 
              value={currentInspection.templateId}
              onChange={(e) => {
                const template = templates.find(t => t.id === e.target.value);
                if (template) handleTemplateSelect(template);
              }}
              disabled={!isEditing}
            >
              {templates.map(template => (
                <option key={template.id} value={template.id}>
                  {template.name} ({template.category})
                </option>
              ))}
            </select>
          </div>

          <div className="checklist-section">
            <h3>Inspection Checklist</h3>
            <div className="checklist-items">
              {currentInspection.items.map((item) => (
                <div key={item.id} className={`checklist-item ${getStatusClass(item.status)}`}>
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
                    </div>
                    <div className="item-status">
                      <div className="status-buttons">
                        <button
                          className={`status-btn status-pass${item.status === 'pass' ? ' active' : ''}`}
                          onClick={() => handleStatusChange(item.id, 'pass')}
                          title="Pass"
                        >
                          <i className='bx bx-check'></i>
                        </button>
                        <button
                          className={`status-btn status-warning${item.status === 'warning' ? ' active' : ''}`}
                          onClick={() => handleStatusChange(item.id, 'warning')}
                          title="Warning"
                        >
                          <i className='bx bx-error'></i>
                        </button>
                        <button
                          className={`status-btn status-fail${item.status === 'fail' ? ' active' : ''}`}
                          onClick={() => handleStatusChange(item.id, 'fail')}
                          title="Fail"
                        >
                          <i className='bx bx-x'></i>
                        </button>
                        <button
                          className={`status-btn status-na${item.status === 'na' ? ' active' : ''}`}
                          onClick={() => handleStatusChange(item.id, 'na')}
                          title="Not Applicable"
                        >
                          <i className='bx bx-minus'></i>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {item.notes && (
                    <div className="item-notes">
                      <strong>Notes:</strong> {item.notes}
                    </div>
                  )}
                  
                  {isEditing && (
                    <div className="item-notes-input">
                      <textarea
                        placeholder="Add notes for this item..."
                        value={item.notes || ''}
                        onChange={(e) => handleItemNotesChange(item.id, e.target.value)}
                      />
                    </div>
                  )}
                  
                  {item.completedAt && (
                    <div className="item-completion">
                      <small>Completed: {new Date(item.completedAt).toLocaleString()}</small>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="notes-section">
            <label>General Notes</label>
            <textarea
              placeholder="Add general notes about this inspection..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={!isEditing}
            />
          </div>
        </div>

        <div className="modal-footer">
          <div className="footer-actions">
            <button className="btn btn--secondary" onClick={onClose}>
              Cancel
            </button>
            {isEditing && (
              <button className="btn btn--primary" onClick={handleSave}>
                Save Changes
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InspectionModal; 