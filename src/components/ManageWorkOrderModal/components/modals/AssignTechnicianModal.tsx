import React, { useState, useMemo } from 'react';
import type { TechnicianWithStatus } from '../../types';

interface AssignTechnicianModalProps {
  show: boolean;
  onClose: () => void;
  technicians: TechnicianWithStatus[];
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
  const [searchQuery, setSearchQuery] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);

  // Filter technicians based on search query
  const filteredTechnicians = useMemo(() => {
    if (!searchQuery) return technicians;
    
    const query = searchQuery.toLowerCase();
    return technicians.filter((tech) => {
      const name = getTechnicianDisplayName(tech).toLowerCase();
      const employeeId = tech.employeeId?.toLowerCase() || '';
      const specialization = tech.specialization?.toLowerCase() || '';
      return name.includes(query) || employeeId.includes(query) || specialization.includes(query);
    });
  }, [technicians, searchQuery]);

  const handleAssign = async () => {
    if (!selectedTechnicianId) return;

    setIsAssigning(true);
    try {
      await onAssign();
      onClose();
      // Reset state
      setSelectedTechnicianId('');
      setSearchQuery('');
    } catch (error) {
      console.error('Error assigning technician:', error);
    } finally {
      setIsAssigning(false);
    }
  };

  const handleClose = () => {
    setSelectedTechnicianId('');
    setSearchQuery('');
    onClose();
  };

  if (!show) return null;

  return (
    <div className="manage-workorder-modal__overlay" onClick={handleClose}>
      <div className="manage-workorder-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title">
            <h2 style={{ fontSize: '18px', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="bx bx-user-check"></i> Assign Technician to Inspection
            </h2>
            <p className="modal-subtitle" style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>
              Select a technician to assign to this inspection
            </p>
          </div>
          <button className="close-btn" onClick={handleClose} title="Close">
            <i className="bx bx-x"></i>
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          <div className="main-content" style={{ padding: '20px' }}>
            {/* Search Input */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ position: 'relative' }}>
                <i className="bx bx-search" style={{
                  position: 'absolute',
                  left: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '16px',
                  color: '#9ca3af'
                }}></i>
                <input
                  type="text"
                  placeholder="Search technicians by name, ID, or specialization..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px 8px 36px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
            </div>

            {/* Technicians List */}
            <div style={{ 
              maxHeight: '320px',
              overflowY: 'auto',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              marginBottom: '16px'
            }}>
              {filteredTechnicians.length === 0 ? (
                <div style={{ padding: '32px', textAlign: 'center', color: '#9ca3af' }}>
                  <i className="bx bx-user-x" style={{ fontSize: '32px', display: 'block', marginBottom: '8px' }}></i>
                  <p style={{ margin: 0, fontSize: '13px' }}>No technicians found</p>
                </div>
              ) : (
                filteredTechnicians.map((tech) => (
                  <div
                    key={tech.id}
                    onClick={() => setSelectedTechnicianId(tech.id)}
                    style={{
                      padding: '12px',
                      borderBottom: '1px solid #f3f4f6',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      backgroundColor: selectedTechnicianId === tech.id ? '#f0f9ff' : '#fff',
                      transition: 'background-color 0.15s'
                    }}
                    onMouseEnter={(e) => {
                      if (selectedTechnicianId !== tech.id) {
                        e.currentTarget.style.backgroundColor = '#f9fafb';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedTechnicianId !== tech.id) {
                        e.currentTarget.style.backgroundColor = '#fff';
                      }
                    }}
                  >
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: tech.isBusy ? '#fef3c7' : '#e0e7ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: '600',
                      color: tech.isBusy ? '#92400e' : '#6366f1',
                      flexShrink: 0
                    }}>
                      {getTechnicianDisplayName(tech).charAt(0)}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: '#1f2937' }}>
                          {getTechnicianDisplayName(tech)}
                        </span>
                        <span style={{
                          fontSize: '10px',
                          padding: '2px 6px',
                          backgroundColor: tech.isBusy ? '#fef3c7' : '#d1fae5',
                          color: tech.isBusy ? '#92400e' : '#065f46',
                          borderRadius: '10px',
                          fontWeight: '600',
                          textTransform: 'uppercase'
                        }}>
                          {tech.isBusy ? 'BUSY' : 'AVAILABLE'}
                        </span>
                      </div>
                      {tech.specialization && (
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                          {tech.specialization}
                        </div>
                      )}
                      {tech.employeeId && (
                        <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>
                          ID: {tech.employeeId}
                        </div>
                      )}
                    </div>

                    {selectedTechnicianId === tech.id && (
                      <i className="bx bx-check" style={{ fontSize: '18px', color: '#10b981', flexShrink: 0 }}></i>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button 
                className="btn btn--secondary"
                onClick={handleClose}
                disabled={isAssigning}
              >
                Cancel
              </button>
              <button 
                className="btn btn--primary"
                onClick={handleAssign}
                disabled={!selectedTechnicianId || isAssigning}
                style={{ 
                  opacity: (!selectedTechnicianId || isAssigning) ? 0.5 : 1,
                  cursor: (!selectedTechnicianId || isAssigning) ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {isAssigning ? (
                  <>
                    <i className="bx bx-loader-alt bx-spin" style={{ fontSize: '14px' }}></i> Assigning...
                  </>
                ) : (
                  <>
                    <i className="bx bx-check" style={{ fontSize: '14px' }}></i> Assign Technician
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignTechnicianModal;
