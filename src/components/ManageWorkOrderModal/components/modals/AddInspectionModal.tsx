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
  if (!show) return null;  return (
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
              <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600', color: '#374151', fontSize: '13px' }}>
                Inspection Template <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                maxHeight: '410px',
                overflowY: 'auto',
                padding: '4px'
              }}>
                {inspectionTemplates && Array.isArray(inspectionTemplates) && inspectionTemplates.map((template: any) => (
                  <div
                    key={template.id}
                    onClick={() => setSelectedTemplateId(template.id)}
                    style={{
                      border: selectedTemplateId === template.id ? '2px solid #3b82f6' : '1px solid #d1d5db',
                      borderRadius: '12px',
                      padding: '16px',
                      cursor: 'pointer',
                      backgroundColor: selectedTemplateId === template.id ? '#eff6ff' : '#ffffff',
                      transition: 'all 0.2s ease',
                      boxShadow: selectedTemplateId === template.id ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : '0 2px 4px rgba(0, 0, 0, 0.05)',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px'
                    }}
                    onMouseEnter={(e) => {
                      if (selectedTemplateId !== template.id) {
                        e.currentTarget.style.borderColor = '#9ca3af';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedTemplateId !== template.id) {
                        e.currentTarget.style.borderColor = '#d1d5db';
                        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }
                    }}
                  >
                    {/* Selection Indicator */}
                    {selectedTemplateId === template.id && (
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: '#3b82f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                      }}>
                        <i className="bx bx-check" style={{ color: 'white', fontSize: '14px' }}></i>
                      </div>
                    )}

                    {/* Template Image */}
                    <div style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      backgroundColor: '#f3f4f6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {template.imageUrl ? (
                        <img
                          src={template.imageUrl}
                          alt={template.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      ) : (
                        <i className="bx bx-file" style={{ fontSize: '24px', color: '#9ca3af' }}></i>
                      )}
                    </div>

                    {/* Template Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <h4 style={{
                          margin: '0',
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#1f2937',
                          lineHeight: '1.3'
                        }}>
                          {template.name}
                        </h4>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '2px 8px',
                          backgroundColor: '#dbeafe',
                          color: '#1e40af',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: '500'
                        }}>
                          {template.category || 'General'}
                        </span>
                      </div>

                      {template.description && (
                        <p style={{
                          margin: '0 0 8px 0',
                          fontSize: '13px',
                          color: '#6b7280',
                          lineHeight: '1.4',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}>
                          {template.description}
                        </p>
                      )}

                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <i className="bx bx-list-check" style={{ fontSize: '14px', color: '#6b7280' }}></i>
                          <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>
                            {template.templateItems?.length || 0} items
                          </span>
                        </div>
                        {template.isActive && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <div style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              backgroundColor: '#10b981'
                            }}></div>
                            <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>
                              Active
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p style={{ margin: '8px 0 0 0', fontSize: '11px', color: '#6b7280' }}>
                Click on an inspection template to select it
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
