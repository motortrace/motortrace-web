import React from 'react';

interface AssignTechnicianModalProps {
  show: boolean;
  onClose: () => void;
  technicians: any[];
  selectedTechnicianId: string;
  setSelectedTechnicianId: (id: string) => void;
  onAssign: () => void;
  getTechnicianDisplayName: (technician: any) => string;
}

/**
 * AssignTechnicianModal Component
 * Modal for selecting and assigning a technician to an inspection
 */
const AssignTechnicianModal: React.FC<AssignTechnicianModalProps> = ({
  show,
  onClose,
  technicians,
  selectedTechnicianId,
  setSelectedTechnicianId,
  onAssign,
  getTechnicianDisplayName,
}) => {
  if (!show) return null;

  return (
    <div className="manage-workorder-modal__overlay" onClick={onClose}>
      <div className="manage-workorder-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title">
            <h2>Assign Technician</h2>
            <p className="modal-subtitle">Select a technician to assign to this inspection</p>
          </div>
          <button className="close-btn" onClick={onClose} title="Close">
            <i className="bx bx-x"></i>
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          <div className="main-content" style={{ padding: '24px' }}>
            {/* Technician Selection */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                Select Technician:
              </label>
              <select 
                value={selectedTechnicianId} 
                onChange={(e) => setSelectedTechnicianId(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '8px 12px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '6px',
                  fontSize: '14px',
                  marginBottom: '20px'
                }}
              >
                <option value="">Select a technician...</option>
                {technicians.map((technician: any) => (
                  <option key={technician.id} value={technician.id}>
                    {getTechnicianDisplayName(technician)} - {technician.specialization || 'General'}
                  </option>
                ))}
              </select>
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
                disabled={!selectedTechnicianId}
                style={{ 
                  opacity: selectedTechnicianId ? 1 : 0.5,
                  cursor: selectedTechnicianId ? 'pointer' : 'not-allowed'
                }}
              >
                Assign Technician
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignTechnicianModal;
