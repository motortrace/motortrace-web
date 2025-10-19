import React, { useState, useMemo } from 'react';
import type { TechnicianWithStatus, WorkOrderLaborItem } from '../../types';
import { getTechnicianDisplayName } from '../../utils/helpers';
import '../../../WorkOrderModal/ManageWorkOrderModal.scss';

interface AssignTechnicianToLaborModalProps {
  open: boolean;
  onClose: () => void;
  laborItem: WorkOrderLaborItem;
  technicians: TechnicianWithStatus[];
  onAssign: (technicianId: string) => Promise<void>;
}

/**
 * Modal for assigning a technician to a single labor item
 */
const AssignTechnicianToLaborModal: React.FC<AssignTechnicianToLaborModalProps> = ({
  open,
  onClose,
  laborItem,
  technicians,
  onAssign,
}) => {
  const [selectedTechnicianId, setSelectedTechnicianId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Get selected technician details
  const selectedTechnician = useMemo(
    () => technicians.find((t) => t.id === selectedTechnicianId),
    [selectedTechnicianId, technicians]
  );

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
      await onAssign(selectedTechnicianId);
      onClose();
      // Reset state
      setSelectedTechnicianId('');
      setSearchQuery('');
      setShowDetails(false);
    } catch (error) {
      console.error('Error assigning technician:', error);
    } finally {
      setIsAssigning(false);
    }
  };

  const handleTechnicianSelect = (technicianId: string) => {
    setSelectedTechnicianId(technicianId);
    setShowDetails(true);
  };

  const handleClose = () => {
    setSelectedTechnicianId('');
    setSearchQuery('');
    setShowDetails(false);
    onClose();
  };

  const formatMinutes = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  if (!open) return null;

  return (
    <div className="manage-workorder-modal__overlay" onClick={handleClose}>
      <div className="manage-workorder-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <div className="modal-header" style={{ padding: '16px 20px' }}>
          <div className="modal-title">
            <h2 style={{ fontSize: '18px', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="bx bx-user-plus"></i> Assign Technician to Labor
            </h2>
          </div>
          <button className="close-btn" onClick={handleClose} title="Close">
            <i className="bx bx-x"></i>
          </button>
        </div>

        <div className="modal-body">
          <div className="main-content" style={{ padding: '20px' }}>
          {/* Labor Item Info */}
          <div style={{
            background: '#f9fafb',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            padding: '12px',
            marginBottom: '18px'
          }}>
            <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>
              Labor Item
            </div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', marginBottom: '6px' }}>
              {laborItem.description}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: '#6b7280' }}>
              {laborItem.estimatedMinutes && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <i className="bx bx-time-five"></i> Est: {formatMinutes(laborItem.estimatedMinutes)}
                </div>
              )}
              <div>
                <span className={`status-badge status-badge--${laborItem.status.toLowerCase().replace('_', '-')}`} style={{ fontSize: '11px' }}>
                  {laborItem.status.replace('_', ' ')}
                </span>
              </div>
            </div>
            {laborItem.notes && (
              <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '6px', fontStyle: 'italic' }}>
                {laborItem.notes}
              </div>
            )}
          </div>

          {!showDetails ? (
            <>
              {/* Search Input */}
              <div style={{ position: 'relative', marginBottom: '16px' }}>
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
                  filteredTechnicians.map((tech) => {
                    const isSelected = selectedTechnicianId === tech.id;
                    
                    return (
                      <div
                        key={tech.id}
                        onClick={() => handleTechnicianSelect(tech.id)}
                        onMouseEnter={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.backgroundColor = '#f9fafb';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) {
                            e.currentTarget.style.backgroundColor = '#fff';
                          }
                        }}
                        style={{
                          padding: '12px',
                          borderBottom: '1px solid #f3f4f6',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          backgroundColor: isSelected ? '#f0f9ff' : '#fff',
                          transition: 'background-color 0.15s'
                        }}
                      >
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          backgroundColor: tech.isBusy ? '#fef3c7' : '#e0e7ff',
                          color: tech.isBusy ? '#92400e' : '#6366f1',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '14px',
                          fontWeight: '600',
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

                        <i className="bx bx-chevron-right" style={{ fontSize: '18px', color: '#d1d5db', flexShrink: 0 }}></i>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          ) : (
            <>
              {/* Selected Technician Details */}
              {selectedTechnician && (
                <div>
                  <button 
                    onClick={() => setShowDetails(false)} 
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: '6px 0',
                      color: '#3b82f6',
                      fontSize: '13px',
                      cursor: 'pointer',
                      marginBottom: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontWeight: '500'
                    }}
                  >
                    <i className="bx bx-chevron-left" style={{ fontSize: '16px' }}></i> Back to list
                  </button>

                  <div style={{
                    background: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    padding: '14px',
                    marginBottom: '14px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        backgroundColor: selectedTechnician.isBusy ? '#fef3c7' : '#e0e7ff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                        fontWeight: '600',
                        color: selectedTechnician.isBusy ? '#92400e' : '#6366f1'
                      }}>
                        {getTechnicianDisplayName(selectedTechnician).charAt(0)}
                      </div>
                      <div>
                        <h3 style={{ margin: '0 0 2px 0', fontSize: '15px', fontWeight: '600', color: '#1f2937' }}>
                          {getTechnicianDisplayName(selectedTechnician)}
                        </h3>
                        {selectedTechnician.specialization && (
                          <p style={{ margin: 0, color: '#6b7280', fontSize: '12px' }}>
                            {selectedTechnician.specialization}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Active Work */}
                    <div>
                      <h4 style={{ 
                        fontSize: '11px', 
                        fontWeight: '600', 
                        color: '#6b7280',
                        marginBottom: '10px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>
                        Current Work Status
                      </h4>
                      {selectedTechnician.activeWork && selectedTechnician.activeWork.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {selectedTechnician.activeWork.map((work, index) => (
                            <div key={index} style={{
                              padding: '10px',
                              backgroundColor: '#ffffff',
                              borderRadius: '4px',
                              border: '1px solid #e5e7eb'
                            }}>
                              <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>
                                Work Order: {work.workOrderNumber || work.workOrderId}
                              </div>
                              {work.laborItem && (
                                <div style={{ fontSize: '12px', color: '#1f2937', marginBottom: '4px', fontWeight: '500' }}>
                                  <i className="bx bx-wrench" style={{ fontSize: '13px' }}></i> {work.laborItem.description}
                                </div>
                              )}
                              {work.part && (
                                <div style={{ fontSize: '12px', color: '#1f2937', marginBottom: '4px', fontWeight: '500' }}>
                                  <i className="bx bx-package" style={{ fontSize: '13px' }}></i> {work.part.description}
                                </div>
                              )}
                              <span style={{
                                fontSize: '10px',
                                padding: '2px 6px',
                                backgroundColor: work.status === 'IN_PROGRESS' ? '#fef3c7' : '#d1fae5',
                                color: work.status === 'IN_PROGRESS' ? '#92400e' : '#065f46',
                                borderRadius: '10px',
                                fontWeight: '600'
                              }}>
                                {work.status.replace('_', ' ')}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div style={{ 
                          padding: '14px', 
                          textAlign: 'center', 
                          color: '#9ca3af',
                          backgroundColor: '#ffffff',
                          borderRadius: '4px',
                          border: '1px solid #e5e7eb'
                        }}>
                          <i className="bx bx-check-circle" style={{ fontSize: '20px', display: 'block', marginBottom: '4px' }}></i>
                          <p style={{ margin: 0, fontSize: '12px' }}>No active work</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Confirmation Message */}
                  <div style={{
                    background: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    borderRadius: '6px',
                    padding: '12px',
                    marginBottom: '14px',
                    display: 'flex',
                    gap: '10px'
                  }}>
                    <i className="bx bx-info-circle" style={{ fontSize: '18px', color: '#3b82f6', flexShrink: 0 }}></i>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: '600', color: '#1e40af', marginBottom: '2px' }}>
                        Labor Assignment
                      </div>
                      <div style={{ fontSize: '11px', color: '#1e40af' }}>
                        This labor item will be assigned to {getTechnicianDisplayName(selectedTechnician)}.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button 
                className="btn btn--secondary" 
                onClick={handleClose} 
                disabled={isAssigning}
                style={{ padding: '8px 16px', fontSize: '13px' }}
              >
                Cancel
              </button>
              <button
                className="btn btn--primary"
                onClick={handleAssign}
                disabled={!selectedTechnicianId || isAssigning || !showDetails}
                style={{ 
                  opacity: (!selectedTechnicianId || isAssigning || !showDetails) ? 0.5 : 1,
                  cursor: (!selectedTechnicianId || isAssigning || !showDetails) ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  fontSize: '13px'
                }}
              >
                {isAssigning ? (
                  <>
                    <i className="bx bx-loader-alt bx-spin" style={{ fontSize: '14px' }}></i> Assigning...
                  </>
                ) : (
                  <>
                    <i className="bx bx-check" style={{ fontSize: '14px' }}></i> Confirm Assignment
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

export default AssignTechnicianToLaborModal;
