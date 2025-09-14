// --- Labor Tab Content (API-based, styled table, new structure) ---
interface LaborCatalog {
  id: string;
  code: string;
  name: string;
  description?: string;
  estimatedHours: number;
  hourlyRate: number;
  category?: string;
}


interface UserProfile {
  id: string;
  name: string;
  profileImage?: string | null;
  phone?: string;
}

interface TechnicianProfile {
  id: string;
  userProfileId?: string;
  employeeId?: string;
  specialization?: string;
  certifications?: string[];
  userProfile?: UserProfile | null;
}

interface WorkOrderLabor {
  id: string;
  workOrderId: string;
  laborCatalog?: LaborCatalog | null;
  laborCatalogId?: string | null;
  description: string;
  hours: number;
  rate: number;
  technician?: TechnicianProfile | null;
  technicianId?: string | null;
  subtotal: number;
  startTime?: string | null;
  endTime?: string | null;
  notes?: string | null;
  cannedServiceId?: string | null;
  serviceDiscountAmount?: number | null;
  serviceDiscountType?: string | null;
  createdAt: string;
  updatedAt: string;
}

import React, { useState, useEffect } from 'react';
import NotesTab from '../../pages/ServiceCenter/JobCard/tabs/NotesTab';
import { useAuth } from '../../hooks/useAuth';
import './ManageWorkOrderModal.scss';

// Mock types for demonstration
interface InspectionTemplateItem {
  id: string;
  name: string;
  description?: string;
  category?: string;
  sortOrder?: number;
  isRequired: boolean;
  allowsNotes: boolean;
}

interface InspectionTemplate {
  id: string;
  name: string;
  description?: string;
  category?: string;
  sortOrder?: number;
  templateItems: InspectionTemplateItem[];
}

type ChecklistStatus = 'GREEN' | 'YELLOW' | 'RED';

interface InspectionChecklistItem {
  id: string;
  inspectionId: string;
  templateItemId?: string;
  category?: string;
  item: string;
  status: ChecklistStatus;
  notes?: string;
  requiresFollowUp: boolean;
  createdAt: string;
}

interface TireInspection {
  id: string;
  inspectionId: string;
  position: string;
  brand?: string;
  model?: string;
  size?: string;
  psi?: number;
  treadDepth?: number;
  damageNotes?: string;
  createdAt: string;
}

interface WorkOrderInspectionAttachment {
  id: string;
  inspectionId: string;
  fileUrl: string;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  description?: string;
  uploadedAt: string;
}

interface WorkOrderInspection {
  id: string;
  workOrderId: string;
  inspector: { id: string; name: string };
  template?: InspectionTemplate;
  templateId?: string;
  date: string;
  notes?: string;
  isCompleted: boolean;
  checklistItems: InspectionChecklistItem[];
  tireChecks: TireInspection[];
  attachments: WorkOrderInspectionAttachment[];
}

interface ManageWorkOrderModalProps {
  open: boolean;
  onClose: () => void;
  workOrder?: any;
}

// Tab Navigation Component
const TabNavigation: React.FC<{ activeTab: string; onTabChange: (tab: string) => void }> = ({ 
  activeTab, 
  onTabChange 
}) => {
  // Get user role from localStorage
  const getUserRole = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user?.role || 'serviceadvisor';
    } catch {
      return 'serviceadvisor';
    }
  };

  const userRole = getUserRole();
  const isServiceAdvisor = userRole === 'serviceadvisor' || userRole === 'service_advisor' || userRole === 'advisor';

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'bx-home-circle' },
    { id: 'estimates', label: 'Estimates', icon: 'bx-calculator' },
    { id: 'inspections', label: 'Inspections', icon: 'bx-search-alt' },
    // Only show Services & Labor tab for manager/admin roles, not for service advisors
    ...(isServiceAdvisor ? [] : [{ id: 'services', label: 'Services & Labor', icon: 'bx-wrench' }]),
    { id: 'notes', label: 'Notes', icon: 'bx-note' },
  ];

  return (
    <div className="tab-navigation">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          <i className={`bx ${tab.icon}`}></i>
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
};
// Estimates Tab Content
import { getWorkOrderEstimates, type Estimate } from '../../utils/workOrdersApi';

const EstimatesTab: React.FC<{ 
  workOrderId: string; 
  onGenerateEstimate: () => void;
  onOpenCannedServicesModal: () => void;
  estimatesList: any[];
}> = ({ workOrderId, onGenerateEstimate, onOpenCannedServicesModal, estimatesList }) => {
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!workOrderId) return;
    setLoading(true);
    getWorkOrderEstimates(workOrderId)
      .then((data) => {
        // Support both { data: [...] } and [...] response shapes
        let estimatesArr: any[] = Array.isArray(data) ? data : data.data || [];
        // Patch each estimate to have a unified estimateItems array for rendering
        estimatesArr = estimatesArr.map((est: any) => {
          let estimateItems: any[] = [];
          if (Array.isArray(est.estimateItems)) {
            estimateItems = est.estimateItems;
          } else {
            // Merge labor and part items if present
            if (Array.isArray(est.estimateLaborItems)) {
              estimateItems = estimateItems.concat(
                est.estimateLaborItems.map((item: any) => ({
                  ...item,
                  type: 'LABOR',
                  quantity: item.hours || 1,
                  unitPrice: item.rate || item.hourlyRate || 0,
                  totalPrice: item.subtotal || (item.hours * (item.rate || item.hourlyRate || 0)),
                }))
              );
            }
          }
          return { ...est, estimateItems };
        });
        setEstimates(estimatesArr);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch estimates');
        setLoading(false);
      });
  }, [workOrderId]);

  if (loading) return <div className="tab-content estimates-tab">Loading estimates...</div>;
  if (error) return <div className="tab-content estimates-tab" style={{ color: 'red' }}>{error}</div>;

  // Summary calculations for estimates
  // const totalEstimates = estimates.length;
  const totalEstimateAmount = estimates.reduce((sum, est) => sum + (Number(est.totalAmount) || 0), 0);
  const totalLaborAmount = estimates.reduce((sum, est) => sum + (Number(est.laborAmount) || 0), 0);
  const totalPartsAmount = estimates.reduce((sum, est) => sum + (Number(est.partsAmount) || 0), 0);
  const totalTaxAmount = estimates.reduce((sum, est) => sum + (Number(est.taxAmount) || 0), 0);
  const totalDiscountAmount = estimates.reduce((sum, est) => sum + (Number(est.discountAmount) || 0), 0);

  return (
    <div className="tab-content estimates-tab">
      {/* Header with search and action buttons */}
      <div className="estimates-header" style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
        <div className="search-container" style={{ width: '100%' }}>
          <input
            type="text"
            placeholder="Search estimates..."
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
              <span className="status-badge" style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '500', background: '#fef3c7', color: '#92400e' }}>Pending</span>
              <span className="status-badge" style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '500', background: '#d1fae5', color: '#065f46' }}>Approved</span>
            </div>
          </div>
          <div className="action-buttons" style={{ display: 'flex', gap: '12px' }}>
            <button 
              className="btn btn--secondary" 
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              onClick={onOpenCannedServicesModal}
            >
              <i className="bx bx-plus"></i>
              Add Canned Service
            </button>
            <button className="btn btn--secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <i className="bx bx-wrench"></i>
              Add Labor
            </button>
            <button 
              className="btn btn--primary" 
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              onClick={onGenerateEstimate}
            >
              <i className="bx bx-file-blank"></i>
              Generate Estimate
            </button>
            <button className="btn btn--secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <i className="bx bx-file"></i>
              View Full Report
            </button>
          </div>
        </div>
      </div>

      <div className="estimates-summary-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20, marginBottom: 24, width: '100%' }}>
        {/* <div className="estimates-summary-card" style={{ background: '#f9fafb', borderRadius: 12, padding: '18px 24px', minWidth: 0, boxShadow: '0 1px 4px #0001', border: '1px solid #e5e7eb', width: '100%' }}>
          <div style={{ color: '#6b7280', fontWeight: 600, fontSize: 15, marginBottom: 4 }}># Estimates</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#1f2937' }}>{totalEstimates}</div>
        </div> */}
        <div className="estimates-summary-card" style={{ background: '#f9fafb', borderRadius: 12, padding: '18px 24px', minWidth: 0, boxShadow: '0 1px 4px #0001', border: '1px solid #e5e7eb', width: '100%' }}>
          <div style={{ color: '#6b7280', fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Total Amount</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#1f2937' }}>LKR {Number(totalEstimateAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: true }).replace(/^0+(?=\d)/, '')}</div>
        </div>
        <div className="estimates-summary-card" style={{ background: '#f9fafb', borderRadius: 12, padding: '18px 24px', minWidth: 0, boxShadow: '0 1px 4px #0001', border: '1px solid #e5e7eb', width: '100%' }}>
          <div style={{ color: '#6b7280', fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Total Labor</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#1f2937' }}>LKR {Number(totalLaborAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: true }).replace(/^0+(?=\d)/, '')}</div>
        </div>
        <div className="estimates-summary-card" style={{ background: '#f9fafb', borderRadius: 12, padding: '18px 24px', minWidth: 0, boxShadow: '0 1px 4px #0001', border: '1px solid #e5e7eb', width: '100%' }}>
          <div style={{ color: '#6b7280', fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Total Parts</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#1f2937' }}>LKR {Number(totalPartsAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: true }).replace(/^0+(?=\d)/, '')}</div>
        </div>
        <div className="estimates-summary-card" style={{ background: '#f9fafb', borderRadius: 12, padding: '18px 24px', minWidth: 0, boxShadow: '0 1px 4px #0001', border: '1px solid #e5e7eb', width: '100%' }}>
          <div style={{ color: '#6b7280', fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Total Tax</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#1f2937' }}>LKR {Number(totalTaxAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: true }).replace(/^0+(?=\d)/, '')}</div>
        </div>
        <div className="estimates-summary-card" style={{ background: '#f9fafb', borderRadius: 12, padding: '18px 24px', minWidth: 0, boxShadow: '0 1px 4px #0001', border: '1px solid #e5e7eb', width: '100%' }}>
          <div style={{ color: '#6b7280', fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Total Discount</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#1f2937' }}>LKR {Number(totalDiscountAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: true }).replace(/^0+(?=\d)/, '')}</div>
        </div>
      </div>
      {estimates.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6b7280' }}>
          <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 16 }}>No estimates found for this work order.</div>
          <div style={{ fontSize: 48, color: '#d1d5db' }}>
            <i className="bx bx-package"></i>
          </div>
        </div>
      ) : (
        <div className="estimates-table-container" style={{ overflowX: 'auto', padding: 0 }}>
          <table className="estimates-table styled-table" style={{ width: '100%', minWidth: 900, fontSize: 13, borderCollapse: 'collapse', border: '1px solid #e5e7eb', background: '#fff' }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>Version</th>
                <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>Status</th>
                <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>Created</th>
                <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>Total</th>
                <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>Description</th>
                <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>Notes</th>
                <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}></th>
              </tr>
            </thead>
            <tbody>
              {estimates.map(est => (
                <React.Fragment key={est.id}>
                  <tr>
                    <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>{est.version}</td>
                    <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb', textAlign: 'center', verticalAlign: 'middle' }}>
                      <span className={`estimate-status ${est.approved ? 'approved' : 'pending'}`}>{est.approved ? 'Approved' : 'Pending'}</span>
                    </td>
                    <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>{new Date(est.createdAt).toLocaleString()}</td>
                    <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb', fontWeight: 600, color: '#2563eb' }}>LKR {Number(est.totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb', maxWidth: 120, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{est.description || '-'}</td>
                    <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb', maxWidth: 120, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{est.notes || '-'}</td>
                    <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb', textAlign: 'center', verticalAlign: 'middle' }}>
                      <div className="estimate-actions" style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }}>
                        <button 
                          className="view-btn"
                          title="View Estimate"
                        >
                          <i className="bx bx-box"></i>
                        </button>
                        <button 
                          className={`send-btn ${est.approved ? 'approved' : 'pending'}`}
                          disabled={!est.approved}
                          title={est.approved ? "Send to Customer" : "Estimate must be approved to send"}
                        >
                          <i className="bx bx-send"></i>
                          Send
                        </button>
                      </div>
                    </td>
                  </tr>
                  {/* Show estimate labor items if present */}
                  {Array.isArray(est.estimateItems) && est.estimateItems.filter((item: any) => item.type === 'LABOR').length > 0 && (
                    <tr>
                      <td colSpan={7} style={{ background: '#f6f8fa', padding: 0, border: '1px solid #e5e7eb' }}>
                        <div style={{ padding: '12px 18px' }}>
                          <div style={{ fontWeight: 600, color: '#2563eb', marginBottom: 6 }}>Labor Items</div>
                          <table style={{ width: '100%', fontSize: 13, background: '#f6f8fa' }}>
                            <thead>
                              <tr>
                                <th style={{ textAlign: 'left', padding: '4px 8px' }}>Description</th>
                                <th style={{ textAlign: 'left', padding: '4px 8px' }}>Hours</th>
                                <th style={{ textAlign: 'left', padding: '4px 8px' }}>Rate</th>
                                <th style={{ textAlign: 'left', padding: '4px 8px' }}>Subtotal</th>
                                <th style={{ textAlign: 'left', padding: '4px 8px' }}>Notes</th>
                              </tr>
                            </thead>
                            <tbody>
                              {est.estimateItems.filter((item: any) => item.type === 'LABOR').map((item: any) => (
                                <tr key={item.id}>
                                  <td style={{ padding: '4px 8px' }}>{item.description}</td>
                                  <td style={{ padding: '4px 8px' }}>{item.hours}</td>
                                  <td style={{ padding: '4px 8px' }}>LKR {Number(item.rate ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                  <td style={{ padding: '4px 8px' }}>LKR {Number(item.subtotal ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                  <td style={{ padding: '4px 8px' }}>{item.notes || '-'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// // Sidebar Component
// const Sidebar: React.FC = () => {
//   const mockWorkOrderStatus = 'Estimation';
//   const estimateSent = false;
//   // New mock data for demonstration
//   const workOrderId = 'WO-2024-001257';
//   const createdDate = 'June 30, 2024';
//   const businessLocation = 'Downtown Service Center';

//   // Timeline mock data
//   const timelineEvents = [
//     { label: 'Appointment Booked', date: 'June 25, 2024, 10:00 AM' },
//     { label: 'Scheduled Date', date: 'July 1, 2024, 9:00 AM' },
//     { label: 'Work Order Created', date: 'June 30, 2024, 4:30 PM' },
//     { label: 'Inspection Report Sent', date: 'July 1, 2024, 11:00 AM' },
//     { label: 'Estimate Sent', date: 'July 1, 2024, 12:00 PM' },
//     { label: 'Estimate Finalized', date: 'July 1, 2024, 2:00 PM' },
//     { label: 'Invoice Created', date: 'July 1, 2024, 2:30 PM' },
//     { label: 'Payment Made', date: 'July 1, 2024, 3:00 PM' },
//   ];

//   return (
//     <div className="modal-sidebar">
//       {/* Work Order Info Section */}
//       <div className="sidebar-section">
//         <div className="sidebar-section-header">
//           <h4><i className="bx bx-file"></i> Work Order Info</h4>
//         </div>
//         <div className="sidebar-section-content">
//           <div className="workorder-info">
//             <div className="workorder-row">
//               <span className="workorder-label">ID:</span>
//               <span className="workorder-value">{workOrderId}</span>
//             </div>
//             <div className="workorder-row">
//               <span className="workorder-label">Created:</span>
//               <span className="workorder-value">{createdDate}</span>
//             </div>
//             <div className="workorder-row">
//               <span className="workorder-label">Location:</span>
//               <span className="workorder-value">{businessLocation}</span>
//             </div>
//           </div>
//           {/* Timeline Section */}
//           <div className="workorder-timeline">
//             <h5 className="timeline-title"><i className="bx bx-timeline"></i> Timeline</h5>
//             <ul className="timeline-list">
//               {timelineEvents.map((event, idx) => (
//                 <li className="timeline-event" key={idx}>
//                   <span className="timeline-event-label">{event.label}</span>
//                   <span className="timeline-event-date">{event.date}</span>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       </div>

//       {/* Status Section */}
//       <div className="sidebar-section">
//         <div className="sidebar-section-header">
//           <h4><i className="bx bx-info-circle"></i> Status</h4>
//         </div>
//         <div className="sidebar-section-content">
//           <div className="status-display">
//             <span className={`status-badge status-badge--${mockWorkOrderStatus.toLowerCase().replace(/ /g, '-')}`}>{mockWorkOrderStatus}</span>
//           </div>
//         </div>
//       </div>

//       {/* Customer Info */}
//       <div className="sidebar-section">
//         <div className="sidebar-section-header">
//           <h4><i className="bx bx-user"></i> Customer</h4>
//         </div>
//         <div className="sidebar-section-content">
//           <div className="customer-info">
//             <div className="customer-avatar">
//               <i className="bx bx-user-circle"></i>
//             </div>
//             <div className="customer-details">
//               <div className="customer-name">John Anderson</div>
//               <div className="customer-contact">
//                 <div className="contact-item">
//                   <i className="bx bx-phone"></i>
//                   <span>(555) 123-4567</span>
//                 </div>
//                 <div className="contact-item">
//                   <i className="bx bx-envelope"></i>
//                   <span>john.anderson@email.com</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Vehicle Info */}
//       <div className="sidebar-section">
//         <div className="sidebar-section-header">
//           <h4><i className="bx bx-car"></i> Vehicle</h4>
//         </div>
//         <div className="sidebar-section-content">
//           <div className="vehicle-info">
//             <div className="vehicle-image">
//               <img 
//                 src="https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg?auto=compress&w=200" 
//                 alt="Vehicle" 
//               />
//             </div>
//             <div className="vehicle-details">
//               <div className="vehicle-name">2022 Toyota Camry</div>
//               <div className="vehicle-plate">ABC-1234</div>
//               <div className="vehicle-specs">
//                 <div className="spec-item">
//                   <span className="spec-label">VIN:</span>
//                   <span className="spec-value">1HGCM82633A123456</span>
//                 </div>
//                 <div className="spec-item">
//                   <span className="spec-label">Mileage:</span>
//                   <span className="spec-value">47,850 miles</span>
//                 </div>
//                 <div className="spec-item">
//                   <span className="spec-label">Color:</span>
//                   <span className="spec-value">Silver Metallic</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Job Progress */}
//       <div className="sidebar-section">
//         <div className="sidebar-section-header">
//           <h4><i className="bx bx-timer"></i> Progress</h4>
//         </div>
//         <div className="sidebar-section-content">
//           <div className="progress-info">
//             <div className="progress-bar-container">
//               <div className="progress-bar">
//                 <div className="progress-fill" style={{ width: '65%' }}></div>
//               </div>
//               <span className="progress-text">65% Complete</span>
//             </div>
//             <div className="timeline-info">
//               <div className="timeline-item">
//                 <span className="timeline-label">Started</span>
//                 <span className="timeline-value">July 1, 2024</span>
//               </div>
//               <div className="timeline-item">
//                 <span className="timeline-label">Est. Completion</span>
//                 <span className="timeline-value">July 2, 2024</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Assignments */}
//       <div className="sidebar-section">
//         <div className="sidebar-section-header">
//           <h4><i className="bx bx-group"></i> Assignments</h4>
//         </div>
//         <div className="sidebar-section-content">
//           <div className="assignment-info">
//             <div className="assignment-item">
//               <span className="assignment-label">Technician</span>
//               <div className="tech-assignment">
//                 <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Mike Smith" />
//                 <span>Mike Smith</span>
//               </div>
//             </div>
//             <div className="assignment-item">
//               <span className="assignment-label">Created By</span>
//               <span className="assignment-value">Amber Miller</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Quick Actions */}
//       <div className="sidebar-section">
//         <div className="sidebar-section-header">
//           <h4><i className="bx bx-bolt-circle"></i> Actions</h4>
//         </div>
//         <div className="sidebar-section-content">
//           <div className="quick-actions">
//             {!estimateSent ? (
//               <button className="action-btn action-btn--primary">
//                 <i className="bx bx-send"></i>
//                 Send Estimate
//               </button>
//             ) : (
//               <button className="action-btn action-btn--primary">
//                 <i className="bx bx-receipt"></i>
//                 Generate Invoice
//               </button>
//             )}
//             <button className="action-btn action-btn--secondary">
//               <i className="bx bx-printer"></i>
//               Print Work Order
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// Overview Tab Content
const OverviewTab: React.FC<{ workOrder?: any }> = ({ workOrder }) => {
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: 'customer',
      message: 'Hi, I dropped off my car this morning. Can you give me an update on the brake inspection?',
      timestamp: '2024-07-01T10:30:00Z',
      senderName: 'John Anderson'
    },
    {
      id: 2,
      sender: 'advisor',
      message: 'Hello John! We\'ve completed the initial inspection. We found that your brake pads are worn and need replacement. I\'ll send you an estimate shortly.',
      timestamp: '2024-07-01T11:15:00Z',
      senderName: 'Mike Johnson'
    },
    {
      id: 3,
      sender: 'customer',
      message: 'Thanks for the quick update! How long will the repair take?',
      timestamp: '2024-07-01T11:20:00Z',
      senderName: 'John Anderson'
    },
    {
      id: 4,
      sender: 'advisor',
      message: 'The brake pad replacement should take about 2-3 hours. We have the parts in stock, so we can complete it today if you approve the estimate.',
      timestamp: '2024-07-01T11:25:00Z',
      senderName: 'Mike Johnson'
    }
  ]);

  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: chatMessages.length + 1,
        sender: 'advisor',
        message: newMessage,
        timestamp: new Date().toISOString(),
        senderName: workOrder?.serviceAdvisor?.userProfile ? 
          `${workOrder.serviceAdvisor.userProfile.firstName} ${workOrder.serviceAdvisor.userProfile.lastName}` : 
          'Service Advisor'
      };
      setChatMessages([...chatMessages, message]);
      setNewMessage('');
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="tab-content overview-tab">
      <div className="overview-layout">
        {/* Left Panel - Chat */}
        <div className="chat-panel">
          <div className="chat-header">
            <h4><i className="bx bx-message-detail"></i> Communication</h4>
          </div>
          <div className="chat-messages">
            {chatMessages.map((msg) => (
              <div key={msg.id} className={`chat-message ${msg.sender}`}>
                <div className="message-header">
                  <span className="sender-name">{msg.senderName}</span>
                  <span className="message-time">{formatTime(msg.timestamp)}</span>
                </div>
                <div className="message-content">
                  {msg.message}
                </div>
              </div>
            ))}
          </div>
          <div className="chat-input">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              rows={2}
            />
            <button onClick={handleSendMessage} disabled={!newMessage.trim()}>
              <i className="bx bx-send"></i>
            </button>
          </div>
        </div>

        {/* Right Panel - Information */}
        <div className="info-panel">
          {/* Service Advisor Info */}
          <div className="info-section">
            <div className="info-section-header">
              <h4><i className="bx bx-user-voice"></i> Service Advisor</h4>
            </div>
            <div className="info-section-content">
              {workOrder?.serviceAdvisor ? (
                <div className="person-info">
                  <div className="person-avatar">
                    {workOrder.serviceAdvisor.userProfile.firstName[0]}{workOrder.serviceAdvisor.userProfile.lastName[0]}
                  </div>
                  <div className="person-details">
                    <div className="person-name">
                      {workOrder.serviceAdvisor.userProfile.firstName} {workOrder.serviceAdvisor.userProfile.lastName}
                    </div>
                    <div className="person-role">Service Advisor</div>
                    <div className="person-contact">
                      <i className="bx bx-phone"></i> {workOrder.serviceAdvisor.userProfile.phone}
                    </div>
                    <div className="person-department">
                      <i className="bx bx-building"></i> {workOrder.serviceAdvisor.department}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="no-data">No service advisor assigned</div>
              )}
            </div>
          </div>

          {/* Customer Info */}
          <div className="info-section">
            <div className="info-section-header">
              <h4><i className="bx bx-user"></i> Customer</h4>
            </div>
            <div className="info-section-content">
              {workOrder?.customer ? (
                <div className="person-info">
                  <div className="person-avatar">
                    {workOrder.customer.firstName[0]}{workOrder.customer.lastName[0]}
                  </div>
                  <div className="person-details">
                    <div className="person-name">
                      {workOrder.customer.firstName} {workOrder.customer.lastName}
                    </div>
                    <div className="person-role">Customer</div>
                    <div className="person-contact">
                      <i className="bx bx-envelope"></i> {workOrder.customer.email}
                    </div>
                    <div className="person-contact">
                      <i className="bx bx-phone"></i> {workOrder.customer.phone}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="no-data">No customer information</div>
              )}
              
              {/* Customer Complaint */}
              {workOrder?.complaint && (
                <div className="customer-complaint">
                  <div className="complaint-header">
                    <h5><i className="bx bx-message-square-detail"></i> Customer Complaint</h5>
                  </div>
                  <div className="complaint-content">
                    {workOrder.complaint}
                  </div>
                </div>
              )}
              
              {/* Internal Notes */}
              {workOrder?.internalNotes && (
                <div className="internal-notes">
                  <div className="notes-header">
                    <h5><i className="bx bx-note"></i> Internal Notes</h5>
                  </div>
                  <div className="notes-content">
                    {workOrder.internalNotes}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Vehicle Info */}
          <div className="info-section">
            <div className="info-section-header">
              <h4><i className="bx bx-car"></i> Vehicle</h4>
            </div>
            <div className="info-section-content">
              {workOrder?.vehicle ? (
                <div className="vehicle-info">
                  <div className="vehicle-image">
                    <img 
                      src={`https://platform.cstatic-images.com/xxlarge/in/v2/stock_photos/8760bf48-c1a5-42f7-a83b-1cd39e2efbec/57ee2adf-a4a3-4757-8f50-6d85fcf5a351.png`} 
                      alt={`${workOrder.vehicle.year} ${workOrder.vehicle.make} ${workOrder.vehicle.model}`}
                    />
                  </div>
                  <div className="vehicle-details">
                    <div className="vehicle-title">
                      {workOrder.vehicle.year} {workOrder.vehicle.make} {workOrder.vehicle.model}
                    </div>
                    <div className="vehicle-info-item">
                      <i className="bx bx-hash"></i> VIN: {workOrder.vehicle.vin}
                    </div>
                    <div className="vehicle-info-item">
                      <i className="bx bx-barcode"></i> License: {workOrder.vehicle.licensePlate}
                    </div>
                    {workOrder.odometerReading && (
                      <div className="vehicle-info-item">
                        <i className="bx bx-speedometer"></i> Odometer: {workOrder.odometerReading.toLocaleString()} miles
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="no-data">No vehicle information</div>
              )}
            </div>
          </div>

          {/* Assigned Technicians */}
          <div className="info-section">
            <div className="info-section-header">
              <h4><i className="bx bx-wrench"></i> Assigned Technicians</h4>
            </div>
            <div className="info-section-content">
              {workOrder?.inspections && workOrder.inspections.length > 0 ? (
                <div className="technicians-list">
                  {workOrder.inspections.map((inspection: any, index: number) => (
                    <div key={index} className="person-info">
                      <div className="person-avatar">
                        {inspection.inspector?.userProfile?.firstName[0]}{inspection.inspector?.userProfile?.lastName[0]}
                      </div>
                      <div className="person-details">
                        <div className="person-name">
                          {inspection.inspector?.userProfile?.firstName} {inspection.inspector?.userProfile?.lastName}
                        </div>
                        <div className="person-role">Inspector</div>
                        <div className="person-status">
                          <i className="bx bx-check-circle"></i> Inspection Completed
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-data">No technicians assigned</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Mock data


// --- Services Tab Content (API-based, flat table, new structure) ---

interface CannedService {
  id: string;
  code: string;
  name: string;
  description?: string;
  duration: number;
  price: number;
}

interface WorkOrderService {
  id: string;
  workOrderId: string;
  cannedService: CannedService;
  cannedServiceId: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const ServicesAndLaborTab: React.FC<{ workOrderId: string }> = ({ workOrderId }) => {
  const [services, setServices] = useState<WorkOrderService[]>([]);
  const [labor, setLabor] = useState<WorkOrderLabor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!workOrderId) return;
    setLoading(true);
    
    // Fetch both services and labor data
    Promise.all([
      fetch(`http://localhost:3000/work-orders/${workOrderId}/services`).then(res => res.json()),
      fetch(`http://localhost:3000/labor/work-order?workOrderId=${workOrderId}`).then(res => res.json())
    ])
    .then(([servicesRes, laborRes]) => {
      // Process services data
      let servicesArr = Array.isArray(servicesRes) ? servicesRes : (Array.isArray(servicesRes.data) ? servicesRes.data : []);
      setServices(servicesArr || []);
      
      // Process labor data
      let laborArr = Array.isArray(laborRes) ? laborRes : (Array.isArray(laborRes.data) ? laborRes.data : []);
      setLabor(laborArr || []);
      
      setLoading(false);
    })
    .catch(() => {
      setError('Failed to fetch services and labor data');
      setLoading(false);
    });
  }, [workOrderId]);

  if (loading) return <div className="tab-content services-labor-tab">Loading services and labor...</div>;
  if (error) return <div className="tab-content services-labor-tab" style={{ color: 'red' }}>{error}</div>;

  // Summary calculations for services
  const totalServiceCount = services.length;
  const totalServiceCost = services.reduce((sum, s) => sum + (s.subtotal || 0), 0);

  // Summary calculations for labor
  const totalEstimatedHours = labor.reduce((sum, l) => sum + (l.laborCatalog?.estimatedHours || 0), 0);
  const totalLaborCost = labor.reduce((sum, l) => sum + (l.subtotal || 0), 0);
  const technicianIds = new Set(labor.map(l => l.technicianId).filter(Boolean));
  const numTechnicians = technicianIds.size;

  // Helper function to check if labor is linked to a service
  const isLaborLinkedToService = (laborItem: WorkOrderLabor) => {
    return services.some(service => 
      service.cannedService?.id === laborItem.cannedServiceId
    );
  };

  return (
    <div className="tab-content services-labor-tab">
      {/* Combined Summary Cards */}
      <div className="combined-summary-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20, marginBottom: 24, width: '100%' }}>
        {/* Services Summary */}
        <div className="summary-card" style={{ background: '#f9fafb', borderRadius: 12, padding: '18px 24px', minWidth: 0, boxShadow: '0 1px 4px #0001', border: '1px solid #e5e7eb', width: '100%' }}>
          <div style={{ color: '#6b7280', fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Services</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#1f2937' }}>{totalServiceCount}</div>
        </div>
        <div className="summary-card" style={{ background: '#f9fafb', borderRadius: 12, padding: '18px 24px', minWidth: 0, boxShadow: '0 1px 4px #0001', border: '1px solid #e5e7eb', width: '100%' }}>
          <div style={{ color: '#6b7280', fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Service Cost</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#1f2937' }}>LKR {Number(totalServiceCost).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
        </div>
        
        {/* Labor Summary */}
        <div className="summary-card" style={{ background: '#f9fafb', borderRadius: 12, padding: '18px 24px', minWidth: 0, boxShadow: '0 1px 4px #0001', border: '1px solid #e5e7eb', width: '100%' }}>
          <div style={{ color: '#6b7280', fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Labor Hours</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#1f2937' }}>{totalEstimatedHours.toFixed(2)}</div>
        </div>
        <div className="summary-card" style={{ background: '#f9fafb', borderRadius: 12, padding: '18px 24px', minWidth: 0, boxShadow: '0 1px 4px #0001', border: '1px solid #e5e7eb', width: '100%' }}>
          <div style={{ color: '#6b7280', fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Labor Cost</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#1f2937' }}>LKR {Number(totalLaborCost).toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
        </div>
        <div className="summary-card" style={{ background: '#f9fafb', borderRadius: 12, padding: '18px 24px', minWidth: 0, boxShadow: '0 1px 4px #0001', border: '1px solid #e5e7eb', width: '100%' }}>
          <div style={{ color: '#6b7280', fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Technicians</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#1f2937' }}>{numTechnicians}</div>
        </div>
      </div>

      {/* Services Section */}
      <div className="services-section" style={{ marginBottom: '32px' }}>
        <div className="section-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, color: '#374151', fontSize: '18px', fontWeight: '600' }}>
            <i className="bx bx-wrench" style={{ marginRight: '8px' }}></i>
            Canned Services
          </h3>
          <button className="btn btn--primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <i className="bx bx-plus"></i>
            Add Service
          </button>
        </div>
        
        {services.length > 0 ? (
          <div className="services-table-container" style={{ overflowX: 'auto', padding: 0 }}>
            <table className="services-table styled-table" style={{ width: '100%', minWidth: 700, fontSize: 13, borderCollapse: 'collapse', border: '1px solid #e5e7eb', background: '#fff' }}>
              <thead>
                <tr style={{ background: '#f9fafb' }}>
                  <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>Service Name</th>
                  <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>Description</th>
                  <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>Unit Price</th>
                  <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>Quantity</th>
                  <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>Subtotal</th>
                  <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>Linked Labor</th>
                  <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map(service => {
                  const linkedLabor = labor.filter(l => 
                    l.cannedServiceId === service.cannedService?.id
                  );
                  return (
                    <tr key={service.id}>
                      <td style={{ padding: '6px 10px', maxWidth: 120, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', border: '1px solid #e5e7eb' }}>
                        {service.cannedService?.name || '-'}
                      </td>
                      <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>
                        {service.description || service.cannedService?.description || '-'}
                      </td>
                      <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>
                        LKR {Number(service.unitPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>
                        {service.quantity}
                      </td>
                      <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb', fontWeight: 600, color: '#2563eb' }}>
                        LKR {Number(service.subtotal).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb', textAlign: 'center' }}>
                        {linkedLabor.length > 0 ? (
                          <span style={{ background: '#d1fae5', color: '#065f46', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '500' }}>
                            {linkedLabor.length} linked
                          </span>
                        ) : (
                          <span style={{ background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '500' }}>
                            No labor
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb', textAlign: 'center', verticalAlign: 'middle' }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }}>
                          <button 
                            className="view-btn"
                            title="View Service"
                            style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '6px', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', transition: 'all 0.2s ease' }}
                          >
                            <i className="bx bx-box"></i>
                          </button>
                          <button 
                            className="assign-btn"
                            title="Assign Technician"
                            style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: 6, padding: '6px', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', transition: 'all 0.2s ease' }}
                          >
                            <i className="bx bx-user-plus"></i>
                          </button>
                          <button 
                            className="delete-btn"
                            title="Delete Service"
                            style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, padding: '6px', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', transition: 'all 0.2s ease' }}
                          >
                            <i className="bx bx-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <i className="bx bx-wrench" style={{ fontSize: '48px', marginBottom: '16px', display: 'block' }}></i>
            <p style={{ margin: 0, fontSize: '16px' }}>No services added to this work order</p>
          </div>
        )}
      </div>

      {/* Labor Section */}
      <div className="labor-section">
        <div className="section-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, color: '#374151', fontSize: '18px', fontWeight: '600' }}>
            <i className="bx bx-user-voice" style={{ marginRight: '8px' }}></i>
            Labor
          </h3>
          <button className="btn btn--primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <i className="bx bx-plus"></i>
            Add Labor
          </button>
        </div>
        
        {labor.length > 0 ? (
          <div className="labor-table-container" style={{ overflowX: 'auto', padding: 0 }}>
            <table className="labor-table styled-table" style={{ width: '100%', minWidth: 700, fontSize: 13, borderCollapse: 'collapse', border: '1px solid #e5e7eb', background: '#fff' }}>
              <thead>
                <tr style={{ background: '#f9fafb' }}>
                  <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>Name</th>
                  <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>Rate</th>
                  <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>Hours</th>
                  <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>Total</th>
                  <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>Technician</th>
                  <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>Linked to Service</th>
                  <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {labor.map(item => {
                  const tech = item.technician;
                  const userProfile = tech?.userProfile;
                  const techAssigned = !!tech && !!userProfile;
                  const isLinked = isLaborLinkedToService(item);
                  
                  return (
                    <tr key={item.id}>
                      <td style={{ padding: '6px 10px', maxWidth: 120, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', border: '1px solid #e5e7eb' }}>
                        {item.laborCatalog?.name || item.description || '-'}
                      </td>
                      <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>
                        LKR {Number(item.rate).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>
                        {Number(item.hours).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb', fontWeight: 600, color: '#2563eb' }}>
                        LKR {Number(item.subtotal).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb', textAlign: 'center', verticalAlign: 'middle' }}>
                        {techAssigned ? (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
                            {userProfile.profileImage ? (
                              <img src={userProfile.profileImage} alt={userProfile.name} style={{ width: 26, height: 26, borderRadius: '50%', objectFit: 'cover', border: '1px solid #e5e7eb' }} />
                            ) : (
                              <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', fontWeight: 600, fontSize: 13 }}>
                                {userProfile.name?.[0] || '?'}
                              </div>
                            )}
                            <span style={{ fontWeight: 500 }}>{userProfile.name}</span>
                          </div>
                        ) : (
                          <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>Unassigned</span>
                        )}
                      </td>
                      <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb', textAlign: 'center' }}>
                        {isLinked ? (
                          <span style={{ background: '#d1fae5', color: '#065f46', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '500' }}>
                            <i className="bx bx-link" style={{ marginRight: '4px' }}></i>
                            Linked
                          </span>
                        ) : (
                          <span style={{ background: '#fef2f2', color: '#dc2626', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '500' }}>
                            <i className="bx bx-unlink" style={{ marginRight: '4px' }}></i>
                            Unlinked
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb', textAlign: 'center', verticalAlign: 'middle' }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }}>
                          <button 
                            className="view-btn"
                            title="View Labor"
                            style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '6px', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', transition: 'all 0.2s ease' }}
                          >
                            <i className="bx bx-box"></i>
                          </button>
                          <button 
                            className="assign-btn"
                            title="Assign Technician"
                            style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: 6, padding: '6px', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', transition: 'all 0.2s ease' }}
                          >
                            <i className="bx bx-user-plus"></i>
                          </button>
                          <button 
                            className="delete-btn"
                            title="Delete Labor"
                            style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, padding: '6px', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', transition: 'all 0.2s ease' }}
                          >
                            <i className="bx bx-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <i className="bx bx-user-voice" style={{ fontSize: '48px', marginBottom: '16px', display: 'block' }}></i>
            <p style={{ margin: 0, fontSize: '16px' }}>No labor records for this work order</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Notes Tab Content
const NotesTabContent: React.FC<{ notes: string; onNotesChange: (notes: string) => void }> = ({ 
  notes, 
  onNotesChange 
}) => {
  return (
    <div className="tab-content notes-tab">
      <div className="tab-header">
        <h3>Notes</h3>
      </div>
      <NotesTab notes={notes} onNotesChange={onNotesChange} />
    </div>
  );
};




// --- Inspections Tab (API-based, new structure) ---


const InspectionsTab: React.FC<{ workOrderId: string }> = ({ workOrderId }) => {
  const [inspections, setInspections] = useState<WorkOrderInspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attachments, setAttachments] = useState<Record<string, any[]>>({}); // inspectionId -> attachments
  const [loadingAttachments, setLoadingAttachments] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!workOrderId) return;
    setLoading(true);
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
  }, [workOrderId]);

  if (loading) return <div className="tab-content inspections-tab">Loading inspections...</div>;
  if (error) return <div className="tab-content inspections-tab" style={{ color: 'red' }}>{error}</div>;

  // Helper to get technician name and image
  const getTechnicianName = (inspector: any) => {
    if (!inspector) return '-';
    if (typeof inspector.name === 'string') return inspector.name;
    if (inspector.userProfile && inspector.userProfile.name) return inspector.userProfile.name;
    return '-';
  };
  const getTechnicianImage = (inspector: any) => {
    if (!inspector) return null;
    if (inspector.userProfile && inspector.userProfile.profileImage) return inspector.userProfile.profileImage;
    return null;
  };

  // Summary cards
  const totalInspections = inspections.length;
  const completedInspections = inspections.filter(i => i.isCompleted).length;

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
            <button className="btn btn--secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
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

      {inspections.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6b7280' }}>
          <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 16 }}>No inspections found for this work order.</div>
          <div style={{ fontSize: 48, color: '#d1d5db' }}>
            <i className="bx bx-search-alt"></i>
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
                          {getTechnicianImage(inspection.inspector) ? (
                            <img src={getTechnicianImage(inspection.inspector)} alt={getTechnicianName(inspection.inspector)} style={{ width: 26, height: 26, borderRadius: '50%', objectFit: 'cover', border: '1px solid #e5e7eb' }} />
                          ) : (
                            <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', fontWeight: 600, fontSize: 13 }}>
                              {getTechnicianName(inspection.inspector)?.[0] || '?'}
                            </div>
                          )}
                          <span style={{ fontWeight: 500 }}>{getTechnicianName(inspection.inspector)}</span>
                        </div>
                      </td>
                      <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>{inspection.date ? new Date(inspection.date).toLocaleString() : '-'}</td>
                      <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb', textAlign: 'center', verticalAlign: 'middle' }}>
                        <span className={`estimate-status ${inspection.isCompleted ? 'approved' : 'pending'}`}>{inspection.isCompleted ? 'Completed' : 'In Progress'}</span>
                      </td>
                      <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>{template?.name || '-'}</td>
                      <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>{template?.category || '-'}</td>
                      <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb', textAlign: 'center', verticalAlign: 'middle' }}>
                        <div className="inspection-actions" style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center' }}>
                          <button 
                            className="view-btn"
                            title="View Inspection"
                            onClick={() => alert(`View details for inspection ${inspection.id}`)}
                          >
                            <i className="bx bx-box"></i>
                          </button>
                          <button 
                            className={`send-btn ${inspection.isCompleted ? 'approved' : 'pending'}`}
                            disabled={!inspection.isCompleted}
                            title={inspection.isCompleted ? "Send Report" : "Inspection must be completed to send"}
                          >
                            <i className="bx bx-send"></i>
                            Send
                          </button>
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
  );
};

// Main Modal Component
const ManageWorkOrderModal: React.FC<ManageWorkOrderModalProps> = ({ open, onClose, workOrder }) => {

  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [notes, setNotes] = useState('');
  const [isGeneratingEstimate, setIsGeneratingEstimate] = useState(false);
  const [showCannedServicesModal, setShowCannedServicesModal] = useState(false);
  const [cannedServices, setCannedServices] = useState<any[]>([]);
  const [selectedEstimateId, setSelectedEstimateId] = useState('');
  const [estimatesList, setEstimatesList] = useState<any[]>([]);
  const [showPublishEstimateModal, setShowPublishEstimateModal] = useState(false);
  const [selectedPublishEstimateId, setSelectedPublishEstimateId] = useState('');

  // Fetch estimates when component mounts or workOrder changes
  useEffect(() => {
    if (workOrder?.id && token) {
      fetchEstimates();
    }
  }, [workOrder?.id, token]);

  // Generate Estimate Function
  const handleGenerateEstimate = async () => {
    console.log('=== GENERATE ESTIMATE FUNCTION STARTED ===');
    console.log('Work Order:', workOrder);
    console.log('Token available:', !!token);
    
    if (!workOrder?.id || !token) {
      console.error('Missing workOrder ID or token');
      console.error('Work Order ID:', workOrder?.id);
      console.error('Token:', token);
      return;
    }

    console.log('Setting loading state...');
    setIsGeneratingEstimate(true);
    
    try {
      console.log('Creating estimate data...');
      const estimateData = {
        workOrderId: workOrder.id,
        description: "Initial estimate for vehicle service",
        totalAmount: 0.00,
        laborAmount: 0.00,
        partsAmount: 0.00,
        taxAmount: 0.00,
        discountAmount: 0.00,
        notes: "Initial estimate - will add services",
        createdById: workOrder.advisorId || "sa_93405c38-b518-4a55-a0a2-d724f329d392" // Use advisor ID or fallback
      };

      console.log('Estimate data:', estimateData);
      console.log('Making API request to create estimate...');

      const response = await fetch('http://localhost:3000/estimates', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(estimateData),
      });

      console.log('Estimate creation response status:', response.status);
      console.log('Estimate creation response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Estimate creation failed:', response.statusText);
        console.error('Error response:', errorText);
        throw new Error(`Failed to create estimate: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Estimate created successfully:', result);
      
      // Update work order status to ESTIMATE
      console.log('Attempting to update work order status to ESTIMATE...');
      console.log('Work Order ID:', workOrder.id);
      console.log('Token available:', !!token);
      
      try {
        const updateResponse = await fetch(`http://localhost:3000/work-orders/${workOrder.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'ESTIMATE'
          }),
        });

        console.log('Update response status:', updateResponse.status);
        console.log('Update response ok:', updateResponse.ok);

        if (!updateResponse.ok) {
          const errorText = await updateResponse.text();
          console.error('Failed to update work order status:', updateResponse.statusText);
          console.error('Error response:', errorText);
        } else {
          const successData = await updateResponse.json();
          console.log('Work order status updated to ESTIMATE successfully:', successData);
        }
      } catch (updateError) {
        console.error('Error updating work order status:', updateError);
        console.error('Error details:', updateError instanceof Error ? updateError.message : 'Unknown error');
      }
      
      // Refresh the page to show the new estimate
      window.location.reload();
      
    } catch (error) {
      console.error('Error creating estimate:', error);
      // Refresh the page even on error to ensure consistency
      window.location.reload();
    } finally {
      setIsGeneratingEstimate(false);
    }
  };

  // Fetch Canned Services Function
  const fetchCannedServices = async () => {
    if (!token) return;
    
    try {
      const response = await fetch('http://localhost:3000/canned-services', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch canned services: ${response.statusText}`);
      }

      const data = await response.json();
      setCannedServices(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error('Error fetching canned services:', error);
    }
  };

  // Add Canned Service to Estimate Function
  const handleAddCannedServiceToEstimate = async (cannedServiceId: string) => {
    if (!selectedEstimateId || !token) {
      console.error('Missing estimate ID or token');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/estimates/${selectedEstimateId}/add-canned-service`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cannedServiceId: cannedServiceId
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to add canned service: ${response.statusText}`);
      }

      console.log('Canned service added successfully');
      // Close modal and refresh page
      setShowCannedServicesModal(false);
      window.location.reload();
      
    } catch (error) {
      console.error('Error adding canned service:', error);
    }
  };

  // Fetch Estimates Function
  const fetchEstimates = async () => {
    if (!workOrder?.id || !token) return;
    
    try {
      const response = await fetch(`http://localhost:3000/estimates/?workOrderId=${workOrder.id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch estimates: ${response.statusText}`);
      }

      const data = await response.json();
      setEstimatesList(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error('Error fetching estimates:', error);
    }
  };

  // Open Canned Services Modal
  const openCannedServicesModal = () => {
    setShowCannedServicesModal(true);
    fetchCannedServices();
    fetchEstimates();
  };

  // Open Publish Estimate Modal
  const openPublishEstimateModal = () => {
    setShowPublishEstimateModal(true);
    fetchEstimates();
  };

  // Publish Estimate Function
  const handlePublishEstimate = async () => {
    if (!selectedPublishEstimateId || !token) {
      console.error('Missing estimate ID or token');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/estimates/${selectedPublishEstimateId}/toggle-visibility`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isVisible: true
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to publish estimate: ${response.statusText}`);
      }

      console.log('Estimate published successfully');
      // Close modal and refresh page
      setShowPublishEstimateModal(false);
      window.location.reload();
      
    } catch (error) {
      console.error('Error publishing estimate:', error);
    }
  };

  // Get user role from localStorage
  const getUserRole = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user?.role || 'serviceadvisor';
    } catch {
      return 'serviceadvisor';
    }
  };

  const userRole = getUserRole();
  const isServiceAdvisor = userRole === 'serviceadvisor' || userRole === 'service_advisor' || userRole === 'advisor';

  // If service advisor tries to access services tab, redirect to overview
  if (isServiceAdvisor && activeTab === 'services') {
    setActiveTab('overview');
  }

  if (!open) return null;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab workOrder={workOrder} />;
      case 'estimates':
        return <EstimatesTab 
          workOrderId={workOrder?.id || ''} 
          onGenerateEstimate={handleGenerateEstimate}
          onOpenCannedServicesModal={openCannedServicesModal}
          estimatesList={estimatesList}
        />;
      case 'inspections':
        return <InspectionsTab workOrderId={workOrder?.id || ''} />;
      case 'services':
        // Only show services tab content for manager/admin roles
        if (isServiceAdvisor) {
          return <OverviewTab workOrder={workOrder} />;
        }
        return <ServicesAndLaborTab workOrderId={workOrder?.id || ''} />;
      case 'notes':
        return <NotesTabContent notes={notes} onNotesChange={setNotes} />;
      default:
        return <OverviewTab workOrder={workOrder} />;
    }
  };

  return (
    <div className="manage-workorder-modal__overlay" onClick={onClose}>
      <div className="manage-workorder-modal" onClick={e => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title">
            <h2>Manage Work Order</h2>
            <p className="modal-subtitle">Managing work order for {workOrder?.customer ? `${workOrder.customer.firstName} ${workOrder.customer.lastName}'s ${workOrder.vehicle ? `${workOrder.vehicle.year} ${workOrder.vehicle.make} ${workOrder.vehicle.model}` : 'vehicle'}` : 'customer'}</p>
            <div className="work-order-badges">
              <span className={`priority-badge priority-badge--${workOrder?.priority?.toLowerCase() || 'normal'}`}>
                <i className="bx bx-flag"></i> {workOrder?.priority || 'Normal'}
              </span>
              <span className={`status-badge status-badge--${workOrder?.status?.toLowerCase().replace('_', '-') || 'received'}`}>
                <i className="bx bx-check-circle"></i> {workOrder?.status?.replace('_', ' ') || 'Received'}
              </span>
              <span className="job-type-badge">
                <i className="bx bx-wrench"></i> {workOrder?.jobType || 'N/A'}
              </span>
            </div>
          </div>
          <div className="modal-header-actions">
            <button className="btn btn--secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <i className="bx bx-file-blank"></i>
              Publish Inspection Report
            </button>
            <button 
              className="btn btn--primary" 
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              onClick={openPublishEstimateModal}
            >
              <i className="bx bx-calculator"></i>
              Publish Estimate
            </button>
            {/* Only show invoice buttons for manager/admin roles, not for service advisors */}
            {!isServiceAdvisor && (
              <>
                <button className="btn btn--secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <i className="bx bx-receipt"></i>
                  Generate Invoice
                </button>
                <button className="btn btn--primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <i className="bx bx-send"></i>
                  Publish Invoice
                </button>
              </>
            )}
            <button className="close-btn" onClick={onClose} title="Close">
              <i className="bx bx-x"></i>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Modal Body */}
        <div className="modal-body">
          {/* Main Content Area */}
          <div className="main-content" style={{ overflowY: 'auto', maxHeight: 'calc(95vh - 180px)' }}>
            {renderTabContent()}
          </div>

          {/* Sidebar */}
          {/* <Sidebar /> */}
        </div>
      </div>

      {/* Canned Services Modal */}
      {showCannedServicesModal && (
        <div className="manage-workorder-modal__overlay" onClick={() => setShowCannedServicesModal(false)}>
          <div className="manage-workorder-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px' }}>
            {/* Modal Header */}
            <div className="modal-header">
              <div className="modal-title">
                <h2>Add Canned Service to Estimate</h2>
                <p className="modal-subtitle">Select a canned service to add to the estimate</p>
              </div>
              <button className="close-btn" onClick={() => setShowCannedServicesModal(false)} title="Close">
                <i className="bx bx-x"></i>
              </button>
            </div>

            {/* Modal Body */}
            <div className="modal-body">
              <div className="main-content" style={{ padding: '24px' }}>
                {/* Estimate Selection */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                    Select Estimate:
                  </label>
                  <select 
                    value={selectedEstimateId} 
                    onChange={(e) => setSelectedEstimateId(e.target.value)}
                    style={{ 
                      width: '100%', 
                      padding: '8px 12px', 
                      border: '1px solid #d1d5db', 
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="">Select an estimate...</option>
                    {estimatesList.map((estimate: any) => (
                      <option key={estimate.id} value={estimate.id}>
                        Estimate v{estimate.version || 1}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Canned Services List */}
                <div>
                  <h3 style={{ marginBottom: '16px', fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
                    Available Canned Services
                  </h3>
                  <div style={{ display: 'grid', gap: '12px', maxHeight: '400px', overflowY: 'auto' }}>
                    {cannedServices.map((service: any) => (
                      <div 
                        key={service.id}
                        style={{
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          padding: '16px',
                          background: '#fff',
                          cursor: selectedEstimateId ? 'pointer' : 'not-allowed',
                          opacity: selectedEstimateId ? 1 : 0.5,
                          transition: 'all 0.2s ease'
                        }}
                        onClick={() => selectedEstimateId && handleAddCannedServiceToEstimate(service.id)}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div style={{ flex: 1 }}>
                            <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                              {service.name}
                            </h4>
                            <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#6b7280' }}>
                              {service.description}
                            </p>
                            <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#9ca3af' }}>
                              <span>Code: {service.code}</span>
                              <span>Price: ${service.price || '0.00'}</span>
                              <span>Duration: {service.estimatedDuration || 'N/A'}</span>
                            </div>
                          </div>
                          <button 
                            className="btn btn--primary"
                            disabled={!selectedEstimateId}
                            style={{ 
                              padding: '8px 16px',
                              fontSize: '14px',
                              opacity: selectedEstimateId ? 1 : 0.5,
                              cursor: selectedEstimateId ? 'pointer' : 'not-allowed'
                            }}
                          >
                            Add to Estimate
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Publish Estimate Modal */}
      {showPublishEstimateModal && (
        <div className="manage-workorder-modal__overlay" onClick={() => setShowPublishEstimateModal(false)}>
          <div className="manage-workorder-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            {/* Modal Header */}
            <div className="modal-header">
              <div className="modal-title">
                <h2>Publish Estimate</h2>
                <p className="modal-subtitle">Select an estimate to publish</p>
              </div>
              <button className="close-btn" onClick={() => setShowPublishEstimateModal(false)} title="Close">
                <i className="bx bx-x"></i>
              </button>
            </div>

            {/* Modal Body */}
            <div className="modal-body">
              <div className="main-content" style={{ padding: '24px' }}>
                {/* Estimate Selection */}
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                    Select Estimate to Publish:
                  </label>
                  <select 
                    value={selectedPublishEstimateId} 
                    onChange={(e) => setSelectedPublishEstimateId(e.target.value)}
                    style={{ 
                      width: '100%', 
                      padding: '8px 12px', 
                      border: '1px solid #d1d5db', 
                      borderRadius: '6px',
                      fontSize: '14px',
                      marginBottom: '20px'
                    }}
                  >
                    <option value="">Select an estimate...</option>
                    {estimatesList.map((estimate: any) => (
                      <option key={estimate.id} value={estimate.id}>
                        Estimate v{estimate.version || 1}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button 
                    className="btn btn--secondary"
                    onClick={() => setShowPublishEstimateModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="btn btn--primary"
                    onClick={handlePublishEstimate}
                    disabled={!selectedPublishEstimateId}
                    style={{ 
                      opacity: selectedPublishEstimateId ? 1 : 0.5,
                      cursor: selectedPublishEstimateId ? 'pointer' : 'not-allowed'
                    }}
                  >
                    Publish Estimate
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageWorkOrderModal;