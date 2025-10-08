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

  return (
    <div className="manage-workorder-modal__overlay" onClick={onClose}>
      <div className="manage-workorder-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px' }}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title">
            <h2>Add Inspection Template</h2>
            <p className="modal-subtitle">Select an inspection template to assign to this work order</p>
          </div>
          <button className="close-btn" onClick={onClose} title="Close">
            <i className="bx bx-x"></i>
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          <div className="main-content" style={{ padding: '24px' }}>
            {/* Template Selection */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                Select Inspection Template:
              </label>
              <select 
                value={selectedTemplateId} 
                onChange={(e) => setSelectedTemplateId(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '8px 12px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '6px',
                  fontSize: '14px',
                  marginBottom: '20px'
                }}
              >
                <option value="">Select an inspection template...</option>
                {inspectionTemplates.map((template: any) => (
                  <option key={template.id} value={template.id}>
                    {template.name} - {template.category || 'General'}
                  </option>
                ))}
              </select>
            </div>

            {/* Notes Section */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                Notes (Optional):
              </label>
              <textarea
                value={inspectionNotes}
                onChange={(e) => setInspectionNotes(e.target.value)}
                placeholder="Add any notes for this inspection..."
                rows={4}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button 
                className="btn btn--secondary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button 
                className="btn btn--primary"
                onClick={onAssign}
                disabled={!selectedTemplateId}
                style={{ 
                  opacity: selectedTemplateId ? 1 : 0.5,
                  cursor: selectedTemplateId ? 'pointer' : 'not-allowed'
                }}
              >
                Assign Template
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddInspectionModal;
