import React from 'react';

interface AddInspectionModalProps {
  show: boolean;
  onClose: () => void;
  inspectionTemplates: any[];
  selectedTemplateId: string;
  setSelectedTemplateId: (id: string) => void;
  inspectionNotes: string;
  setInspectionNotes: (notes: string) => void;
  onAssign: () => void;
}

/**
 * AddInspectionModal Component
 * Modal for selecting and assigning an inspection template to a work order
 */
const AddInspectionModal: React.FC<AddInspectionModalProps> = ({
  show,
  onClose,
  inspectionTemplates,
  selectedTemplateId,
  setSelectedTemplateId,
  inspectionNotes,
  setInspectionNotes,
  onAssign,
}) => {
  if (!show) return null;

  const selectedTemplate = inspectionTemplates && Array.isArray(inspectionTemplates) 
    ? inspectionTemplates.find(t => t.id === selectedTemplateId) 
    : null;

  return (
    <div className="manage-workorder-modal__overlay" onClick={onClose}>
      <div className="manage-workorder-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        {/* Modal Header */}
        <div className="modal-header" style={{ padding: '16px 20px' }}>
          <div className="modal-title">
            <h2 style={{ fontSize: '18px', margin: '0 0 4px 0' }}>Add Inspection</h2>
            <p className="modal-subtitle" style={{ fontSize: '12px' }}>Select an inspection template to assign to this work order</p>
          </div>
          <button className="close-btn" onClick={onClose} title="Close">
            <i className="bx bx-x"></i>
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          <div className="main-content" style={{ padding: '20px' }}>
            {/* Template Selection */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#374151', fontSize: '13px' }}>
                Inspection Template <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                value={selectedTemplateId}
                onChange={(e) => setSelectedTemplateId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '13px',
                  backgroundColor: 'white',
                  fontFamily: 'inherit'
                }}
              >
                <option value="">Select an inspection template...</option>
                {inspectionTemplates && Array.isArray(inspectionTemplates) && inspectionTemplates.map((template: any) => (
                  <option key={template.id} value={template.id}>
                    {template.name} - {template.category || 'General'}
                  </option>
                ))}
              </select>
              <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#6b7280' }}>
                Choose the inspection template to assign to this work order
              </p>
            </div>

            {/* Notes */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#374151', fontSize: '13px' }}>
                Inspection Notes
              </label>
              <textarea
                value={inspectionNotes}
                onChange={(e) => setInspectionNotes(e.target.value)}
                placeholder="Add any notes for this inspection..."
                rows={3}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '13px',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
              <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#6b7280' }}>
                Optional notes that will be associated with this inspection
              </p>
            </div>

            {/* Template Summary */}
            {selectedTemplate && (
              <div style={{
                background: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                padding: '12px',
                marginBottom: '18px'
              }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', fontWeight: '600', color: '#374151' }}>
                  Template Details
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6b7280' }}>Name:</span>
                    <span style={{ fontWeight: '600', color: '#1f2937' }}>{selectedTemplate.name}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6b7280' }}>Category:</span>
                    <span style={{ fontWeight: '600', color: '#1f2937' }}>{selectedTemplate.category || 'General'}</span>
                  </div>
                  {selectedTemplate.description && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ color: '#6b7280' }}>Description:</span>
                      <span style={{ fontWeight: '600', color: '#1f2937', fontSize: '11px' }}>{selectedTemplate.description}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                className="btn btn--secondary"
                onClick={onClose}
                style={{ padding: '8px 16px', fontSize: '13px' }}
              >
                Cancel
              </button>
              <button
                className="btn btn--primary"
                onClick={onAssign}
                disabled={!selectedTemplateId}
                style={{
                  opacity: selectedTemplateId ? 1 : 0.5,
                  cursor: selectedTemplateId ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  fontSize: '13px'
                }}
              >
                <i className="bx bx-plus" style={{ fontSize: '14px' }}></i>
                Add Inspection
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddInspectionModal;
