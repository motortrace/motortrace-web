import React, { useState, useEffect } from 'react';
import type { WorkOrderInspection, InspectionTemplate } from '../../types';
import { useTechnicians } from '../../hooks/useTechnicians';
import AssignTechnicianModal from '../modals/AssignTechnicianModal';

interface InspectionsTabProps {
  workOrderId: string;
  onOpenAddInspectionModal: (templateId?: string) => void;
  onOpenAssignTechnicianModal: (inspectionId: string) => void;
  isServiceAdvisor: boolean;
}

interface RecommendedInspection {
  id?: string;
  image: string;
  name: string;
  itemCount: number;
  category: string;
}

/**
 * InspectionsTab Component
 * Displays work order inspections with API integration, attachments, and technician assignment
 */
const InspectionsTab: React.FC<InspectionsTabProps> = ({ 
  workOrderId, 
  onOpenAddInspectionModal, 
  onOpenAssignTechnicianModal, 
  isServiceAdvisor 
}) => {
  const [inspections, setInspections] = useState<WorkOrderInspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attachments, setAttachments] = useState<Record<string, any[]>>({}); // inspectionId -> attachments
  const [loadingAttachments, setLoadingAttachments] = useState<Record<string, boolean>>({});
  const [approvals, setApprovals] = useState<any[]>([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedInspectionId, setSelectedInspectionId] = useState<string | null>(null);
  const [selectedTechnicianId, setSelectedTechnicianId] = useState<string>('');
  const [recommendedInspections, setRecommendedInspections] = useState<RecommendedInspection[]>([]);
  const [loadingRecommended, setLoadingRecommended] = useState(true);
  const { technicians, assignTechnicianToLabor, fetchTechnicians } = useTechnicians();

  useEffect(() => {
    if (!workOrderId) return;
    setLoading(true);
    setLoadingRecommended(true);

    // Fetch existing inspections
    fetch(`http://localhost:3000/inspection-templates/work-orders/inspections?workOrderId=${workOrderId}`)
      .then(res => res.json())
      .then(apiRes => {
        let inspectionsArr = Array.isArray(apiRes) ? apiRes : (Array.isArray(apiRes.data) ? apiRes.data : []);
        setInspections(inspectionsArr || []);
        setLoading(false);
        // Fetch attachments for each inspection
        inspectionsArr.forEach((inspection: any) => {
          setLoadingAttachments(prev => ({ ...prev, [inspection.id]: true }));
          fetch(`http://localhost:3000/inspection-templates/inspections/${inspection.id}/attachments`)
            .then(res => res.json())
            .then(data => {
              setAttachments(prev => ({ ...prev, [inspection.id]: data.data || [] }));
              setLoadingAttachments(prev => ({ ...prev, [inspection.id]: false }));
            })
            .catch(() => {
              setAttachments(prev => ({ ...prev, [inspection.id]: [] }));
              setLoadingAttachments(prev => ({ ...prev, [inspection.id]: false }));
            });
        });
      })
      .catch(() => {
        setError('Failed to fetch inspections');
        setLoading(false);
      });

    // Fetch recommended inspections
    fetch(`http://localhost:3000/canned-services/work-orders/${workOrderId}/inspection-templates`)
      .then(res => res.json())
      .then(apiRes => {
        if (apiRes.success) {
          setRecommendedInspections(apiRes.data || []);
        } else {
          setRecommendedInspections([]);
        }
        setLoadingRecommended(false);
      })
      .catch(() => {
        setRecommendedInspections([]);
        setLoadingRecommended(false);
      });

    // Fetch approvals
    fetch(`http://localhost:3000/work-orders/${workOrderId}/approvals`)
      .then(res => res.json())
      .then(data => {
        setApprovals(data.data || []);
      })
      .catch(() => {
        setApprovals([]);
      });
  }, [workOrderId]);

  if (loading) return <div className="tab-content inspections-tab">Loading inspections...</div>;
  if (error) return <div className="tab-content inspections-tab" style={{ color: 'red' }}>{error}</div>;

  // Helper to get technician name and image
  const getTechnicianName = (inspector: any) => {
    if (!inspector) return 'Not Assigned';
    if (typeof inspector.name === 'string') return inspector.name;
    if (inspector.userProfile && inspector.userProfile.name) return inspector.userProfile.name;
    return 'Not Assigned';
  };
  
  const getTechnicianImage = (inspector: any) => {
    if (!inspector) return null;
    if (inspector.userProfile && inspector.userProfile.profileImage) return inspector.userProfile.profileImage;
    return null;
  };
  
  const isTechnicianAssigned = (inspector: any) => {
    if (!inspector) return false;
    if (typeof inspector.name === 'string' && inspector.name !== 'Not Assigned') return true;
    if (inspector.userProfile && inspector.userProfile.name) return true;
    return false;
  };

  // Filter recommended inspections to exclude those already added
  const filteredRecommendedInspections = recommendedInspections.filter(recommended => 
    !inspections.some(existing => existing.template?.id === recommended.id)
  );

  // Summary cards
  const totalInspections = inspections.length;
  const completedInspections = inspections.filter(i => i.isCompleted).length;
  const pendingApproval = approvals.find(a => a.status === 'PENDING');

  return (
    <div className="tab-content inspections-tab">
      {/* Header with search and action buttons */}
      <div className="inspections-header" style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
        <div className="search-container" style={{ width: '100%' }}>
          <input
            type="text"
            placeholder="Search inspections..."
            className="search-input"
            style={{
              width: '100%',
              padding: '8px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              outline: 'none',
              transition: 'border-color 0.2s ease'
            }}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
          />
        </div>
        <div className="status-and-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
          <div className="status-info" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Status:</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span className="status-badge" style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '500', background: '#f3f4f6', color: '#374151' }}>All</span>
              <span className="status-badge" style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '500', background: '#fef3c7', color: '#92400e' }}>In Progress</span>
              <span className="status-badge" style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '500', background: '#d1fae5', color: '#065f46' }}>Completed</span>
            </div>
          </div>
          <div className="action-buttons" style={{ display: 'flex', gap: '12px' }}>
            <button 
              className="btn btn--secondary" 
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              onClick={() => onOpenAddInspectionModal()}
            >
              <i className="bx bx-plus"></i>
              Add Inspection
            </button>
            <button className="btn btn--primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <i className="bx bx-file"></i>
              View Full Report
            </button>
          </div>
        </div>
      </div>

      <div className="inspections-summary-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20, marginBottom: 24, width: '100%' }}>
        <div className="inspections-summary-card" style={{ background: '#f9fafb', borderRadius: 12, padding: '18px 24px', minWidth: 0, boxShadow: '0 1px 4px #0001', border: '1px solid #e5e7eb', width: '100%' }}>
          <div style={{ color: '#6b7280', fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Total Inspections</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#1f2937' }}>{totalInspections}</div>
        </div>
        <div className="inspections-summary-card" style={{ background: '#f9fafb', borderRadius: 12, padding: '18px 24px', minWidth: 0, boxShadow: '0 1px 4px #0001', border: '1px solid #e5e7eb', width: '100%' }}>
          <div style={{ color: '#6b7280', fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Completed</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#1f2937' }}>{completedInspections}</div>
        </div>
      </div>

      {/* Recommended Inspections Section */}
      <div className="recommended-inspections-section" style={{ marginBottom: 32 }}>
        <h3 style={{ fontSize: 18, fontWeight: 600, color: '#1f2937', marginBottom: 16 }}>Recommended Inspections</h3>
        {loadingRecommended ? (
          <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>Loading recommended inspections...</div>
        ) : filteredRecommendedInspections.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>No recommended inspections available.</div>
        ) : (
          <div className="recommended-inspections-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {filteredRecommendedInspections.map((inspection, index) => (
              <div key={index} className="recommended-inspection-card" style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 4px #0001', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                <div style={{ height: 120, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={inspection.image} alt={inspection.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: 16 }}>
                  <h4 style={{ fontSize: 16, fontWeight: 600, color: '#1f2937', marginBottom: 4 }}>{inspection.name}</h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ fontSize: 14, color: '#6b7280' }}>{inspection.category}</span>
                    <span style={{ fontSize: 14, color: '#6b7280' }}>{inspection.itemCount} items</span>
                  </div>
                  <button 
                    className="btn btn--primary" 
                    style={{ width: '100%', padding: '8px 16px', fontSize: 14 }}
                    onClick={() => onOpenAddInspectionModal(inspection.id)}
                  >
                    Add Inspection
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Existing Inspections Section */}
      <div className="existing-inspections-section">
        <h3 style={{ fontSize: 18, fontWeight: 600, color: '#1f2937', marginBottom: 16 }}>Existing Inspections</h3>

        {inspections.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6b7280' }}>
            <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 16 }}>No inspections found for this work order.</div>
            <div style={{ fontSize: 48, color: '#d1d5db' }}>
              <i className="bx bx-sear -alt"></i>
            </div>
          </div>
        ) : (
          <div className="inspection-summary-table-container full-width-table">
            <table className="inspection-summary-table styled-table" style={{ width: '100%', minWidth: 900, fontSize: 13, borderCollapse: 'collapse', border: '1px solid #e5e7eb', background: '#fff' }}>
              <thead>
                <tr style={{ background: '#f9fafb' }}>
                  <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>Technician</th>
                  <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>Date</th>
                  <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>Status</th>
                  <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>Template Name</th>
                  <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>Template Category</th>
                  <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}></th>
                </tr>
              </thead>
              <tbody>
                {inspections.map((inspection) => {
                  const template: Partial<InspectionTemplate> = inspection.template || {};
                  return (
                    <React.Fragment key={inspection.id}>
                      <tr>
                        <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                            {isTechnicianAssigned(inspection.inspector) ? (
                              <>
                            {getTechnicianImage(inspection.inspector) ? (
                              <img src={getTechnicianImage(inspection.inspector)} alt={getTechnicianName(inspection.inspector)} style={{ width: 26, height: 26, borderRadius: '50%', objectFit: 'cover', border: '1px solid #e5e7eb' }} />
                            ) : (
                              <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', fontWeight: 600, fontSize: 13 }}>
                                {getTechnicianName(inspection.inspector)?.[0] || '?'}
                              </div>
                            )}
                            <span style={{ fontWeight: 500 }}>{getTechnicianName(inspection.inspector)}</span>
                              </>
                            ) : (
                              <span style={{ 
                                fontWeight: 500, 
                                color: '#6b7280',
                                fontStyle: 'italic'
                              }}>
                                Not Assigned
                              </span>
                            )}
                          </div>
                        </td>
                        <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>{inspection.date ? new Date(inspection.date).toLocaleString() : '-'}</td>
                        <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb', textAlign: 'center', verticalAlign: 'middle' }}>
                            {isTechnicianAssigned(inspection.inspector) ? (
                          <span className={`estimate-status ${inspection.isCompleted ? 'approved' : 'pending'}`}>{inspection.isCompleted ? 'Completed' : 'In Progress'}</span>
                            ) : (
                              <span style={{
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                fontWeight: '500',
                                background: '#374151',
                                color: '#ffffff'
                              }}>
                                Not Assigned
                              </span>
                            )}
                        </td>
                        <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>{template?.name || '-'}</td>
                        <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>{template?.category || '-'}</td>
                        <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb', textAlign: 'center', verticalAlign: 'middle' }}>
                          <div className="inspection-actions" style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }}>
                            <button 
                              className="view-btn"
                              title="View Inspection"
                              onClick={() => {
                                if (pendingApproval && pendingApproval.inspectionPdfUrl) {
                                  window.open(pendingApproval.inspectionPdfUrl, '_blank');
                                } else {
                                  alert('No inspection PDF available');
                                }
                              }}
                            >
                              <i className="bx bx-box"></i>
                            </button>
                              {!isServiceAdvisor && (
                                <button 
                                  className="assign-btn"
                                  title="Assign Technician"
                                  onClick={() => {
                                    setSelectedInspectionId(inspection.id);
                                    setShowAssignModal(true);
                                  }}
                                  style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: 6, padding: '6px', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', transition: 'all 0.2s ease' }}
                                >
                                  <i className="bx bx-user-plus"></i>
                                </button>
                              )}
                          </div>
                        </td>
                      </tr>
                      {/* Attachments section for this inspection */}
                      <tr>
                        <td colSpan={6} style={{ padding: '12px 10px', border: '1px solid #e5e7eb', background: '#f9fafb' }}>
                          <div style={{ marginTop: 8 }}>
                            <div style={{ fontWeight: 600, color: '#374151', marginBottom: 8 }}>Attachments</div>
                            {loadingAttachments[inspection.id] ? (
                              <div>Loading attachments...</div>
                            ) : (attachments[inspection.id] && attachments[inspection.id].length > 0 ? (
                              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                                {attachments[inspection.id].map(att => (
                                  <div key={att.id} style={{ width: 100, textAlign: 'center', background: '#fff', borderRadius: 8, boxShadow: '0 1px 4px #0001', border: '1px solid #e5e7eb', padding: 8 }}>
                                    <div style={{ width: 80, height: 80, margin: '0 auto 6px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6', borderRadius: 6, overflow: 'hidden' }}>
                                      <img src={att.fileUrl} alt={att.fileName || 'Attachment'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 2 }}>{att.fileName || 'Image'}</div>
                                    <div style={{ fontSize: 11, color: '#9ca3af' }}>{att.uploadedAt ? new Date(att.uploadedAt).toLocaleString() : ''}</div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div style={{ color: '#9ca3af', fontSize: 13 }}>No attachments found.</div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Assign Technician Modal */}
      <AssignTechnicianModal
        show={showAssignModal}
        onClose={() => {
          setShowAssignModal(false);
          setSelectedTechnicianId('');
        }}
        technicians={technicians}
        selectedTechnicianId={selectedTechnicianId}
        setSelectedTechnicianId={setSelectedTechnicianId}
        onAssign={async () => {
          if (!selectedTechnicianId || !selectedInspectionId) return;
          try {
            const response = await fetch(`http://localhost:3000/inspection-templates/inspections/${selectedInspectionId}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ inspectorId: selectedTechnicianId }),
            });
            if (response.ok) {
              setShowAssignModal(false);
              setSelectedTechnicianId('');
            } else {
              alert('Failed to assign technician');
            }
          } catch (error) {
            alert('Error assigning technician');
          }
        }}
        getTechnicianDisplayName={(technician) => technician.userProfile?.name || 'Unnamed Technician'}
      />
    </div>
  );
};

export default InspectionsTab;
