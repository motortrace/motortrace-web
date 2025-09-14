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
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | null; // Labor status tracking
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
    // Only show Services tab for manager/admin roles, not for service advisors
    ...(isServiceAdvisor ? [] : [{ id: 'services', label: 'Services', icon: 'bx-wrench' }]),
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


const ServicesAndLaborTab: React.FC<{ workOrderId: string }> = ({ workOrderId }) => {
  const [labor, setLabor] = useState<WorkOrderLabor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Assign technician modal state
  const [showAssignTechnicianModal, setShowAssignTechnicianModal] = useState(false);
  const [selectedLaborId, setSelectedLaborId] = useState<string>('');
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [selectedTechnicianId, setSelectedTechnicianId] = useState<string>('');
  const [assigningTechnician, setAssigningTechnician] = useState(false);
  
  // Edit labor modal state
  const [showEditLaborModal, setShowEditLaborModal] = useState(false);
  const [selectedLaborItem, setSelectedLaborItem] = useState<WorkOrderLabor | null>(null);
  const [editSubtotal, setEditSubtotal] = useState<string>('');
  const [editStatus, setEditStatus] = useState<string>('');
  const [editEndTime, setEditEndTime] = useState<string>('');
  const [updatingLabor, setUpdatingLabor] = useState(false);
  
  // WorkOrderServices data state
  const [workOrderServices, setWorkOrderServices] = useState<any[]>([]);
  
  const { token } = useAuth();

  useEffect(() => {
    if (!workOrderId) return;
    setLoading(true);
    
    // Fetch only labor data
    fetch(`http://localhost:3000/labor/work-order?workOrderId=${workOrderId}`)
      .then(res => res.json())
      .then(laborRes => {
      // Process labor data
      let laborArr = Array.isArray(laborRes) ? laborRes : (Array.isArray(laborRes.data) ? laborRes.data : []);
      setLabor(laborArr || []);
      setLoading(false);
    })
    .catch(() => {
        setError('Failed to fetch labor data');
      setLoading(false);
    });
  }, [workOrderId]);

  // Fetch WorkOrderServices data
  useEffect(() => {
    if (!workOrderId) return;
    
    const fetchWorkOrderServices = async () => {
      try {
        const response = await fetch(`http://localhost:3000/work-orders/${workOrderId}/services`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (!response.ok) {
          console.warn(`Failed to fetch work order services:`, response.status);
          return;
        }
        
        const data = await response.json();
        console.log('WorkOrderServices data:', data);
        
        // Handle different response structures
        const servicesData = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : []);
        setWorkOrderServices(servicesData);
      } catch (error) {
        console.error('Error fetching work order services:', error);
      }
    };
    
    fetchWorkOrderServices();
  }, [workOrderId, token]);

  // Fetch technicians for assignment
  const fetchTechnicians = async () => {
    try {
      const response = await fetch('http://localhost:3000/technicians', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch technicians');
      }
      const data = await response.json();
      console.log('Technicians data:', data);
      setTechnicians(Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : []));
    } catch (error) {
      console.error('Error fetching technicians:', error);
      setError('Failed to fetch technicians');
    }
  };

  // Handle opening assign technician modal
  const handleOpenAssignTechnicianModal = (laborId: string) => {
    setSelectedLaborId(laborId);
    setSelectedTechnicianId('');
    setShowAssignTechnicianModal(true);
    fetchTechnicians();
  };

  // Handle assigning technician to labor
  const handleAssignTechnician = async () => {
    if (!selectedTechnicianId || !selectedLaborId) return;
    
    setAssigningTechnician(true);
    try {
      const response = await fetch(`http://localhost:3000/work-orders/labor/${selectedLaborId}/assign-technician`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          technicianId: selectedTechnicianId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to assign technician');
      }

      // Refresh labor data
      const laborResponse = await fetch(`http://localhost:3000/labor/work-order?workOrderId=${workOrderId}`);
      if (laborResponse.ok) {
        const laborData = await laborResponse.json();
        setLabor(Array.isArray(laborData) ? laborData : (Array.isArray(laborData.data) ? laborData.data : []));
      }

      setShowAssignTechnicianModal(false);
      setSelectedLaborId('');
      setSelectedTechnicianId('');
    } catch (error) {
      console.error('Error assigning technician:', error);
      setError('Failed to assign technician');
    } finally {
      setAssigningTechnician(false);
    }
  };

  // Helper function to get technician display name
  const getTechnicianDisplayName = (technician: any) => {
    if (!technician) return 'Unknown';
    if (technician.userProfile?.firstName && technician.userProfile?.lastName) {
      return `${technician.userProfile.firstName} ${technician.userProfile.lastName}`;
    }
    if (technician.userProfile?.name) {
      return technician.userProfile.name;
    }
    if (technician.name) {
      return technician.name;
    }
    if (technician.firstName && technician.lastName) {
      return `${technician.firstName} ${technician.lastName}`;
    }
    return 'Unknown Technician';
  };

  // Handle opening edit labor modal
  const handleOpenEditLaborModal = (laborItem: WorkOrderLabor) => {
    setSelectedLaborItem(laborItem);
    setEditSubtotal(laborItem.subtotal.toString());
    setEditStatus(laborItem.status || '');
    setEditEndTime(laborItem.endTime ? new Date(laborItem.endTime).toISOString().slice(0, 16) : '');
    setShowEditLaborModal(true);
  };

  // Handle updating labor item
  const handleUpdateLabor = async () => {
    if (!selectedLaborItem || !editSubtotal) return;
    
    setUpdatingLabor(true);
    try {
      const payload: any = {
        subtotal: parseFloat(editSubtotal)
      };
      
      // Add optional fields if they have values
      if (editStatus) {
        payload.status = editStatus;
      }
      if (editEndTime) {
        payload.endTime = new Date(editEndTime).toISOString();
      }

      const response = await fetch(`http://localhost:3000/work-orders/labor/${selectedLaborItem.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update labor item');
      }

      // Refresh labor data
      const laborResponse = await fetch(`http://localhost:3000/labor/work-order?workOrderId=${workOrderId}`);
      if (laborResponse.ok) {
        const laborData = await laborResponse.json();
        setLabor(Array.isArray(laborData) ? laborData : (Array.isArray(laborData.data) ? laborData.data : []));
      }

      // Update WorkOrderService subtotal
      await updateWorkOrderServiceSubtotal(selectedLaborItem.cannedServiceId);

      setShowEditLaborModal(false);
      setSelectedLaborItem(null);
      setEditSubtotal('');
      setEditStatus('');
      setEditEndTime('');
    } catch (error) {
      console.error('Error updating labor item:', error);
      setError('Failed to update labor item');
    } finally {
      setUpdatingLabor(false);
    }
  };

  // Update WorkOrderService subtotal based on labor items
  const updateWorkOrderServiceSubtotal = async (cannedServiceId: string | null | undefined) => {
    if (!cannedServiceId) return;
    
    try {
      // Find the WorkOrderService for this canned service
      const workOrderService = workOrderServices.find(service => service.cannedServiceId === cannedServiceId);
      if (!workOrderService) return;

      // Calculate new subtotal from all labor items for this service
      const serviceLaborItems = labor.filter(item => item.cannedServiceId === cannedServiceId);
      const newSubtotal = serviceLaborItems.reduce((sum, item) => sum + item.subtotal, 0);

      // Update the WorkOrderService
      const response = await fetch(`http://localhost:3000/work-orders/services/${workOrderService.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subtotal: newSubtotal
        }),
      });

      if (response.ok) {
        // Refresh WorkOrderServices data
        const servicesResponse = await fetch(`http://localhost:3000/work-orders/${workOrderId}/services`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (servicesResponse.ok) {
          const servicesData = await servicesResponse.json();
          const servicesDataArray = Array.isArray(servicesData) ? servicesData : (Array.isArray(servicesData.data) ? servicesData.data : []);
          setWorkOrderServices(servicesDataArray);
        }
      }
    } catch (error) {
      console.error('Error updating WorkOrderService subtotal:', error);
    }
  };

  if (loading) return <div className="tab-content services-labor-tab">Loading services and labor...</div>;
  if (error) return <div className="tab-content services-labor-tab" style={{ color: 'red' }}>{error}</div>;

  // Use WorkOrderServices as the primary data source
  const services = workOrderServices.map(workOrderService => {
    // Find labor items that belong to this service
    const linkedLabor = labor.filter(laborItem => 
      laborItem.cannedServiceId === workOrderService.cannedServiceId
    );
    
    // Compare WorkOrderService values with CannedService values
    const cannedService = workOrderService.cannedService;
    const workOrderSubtotal = workOrderService.subtotal || 0;
    const workOrderDiscount = workOrderService.discount || 0;
    const workOrderTax = workOrderService.tax || 0;
    
    // Get expected values from CannedService
    const expectedSubtotal = cannedService?.price || 0;
    const expectedDiscount = 0; // CannedService typically doesn't have discount
    const expectedTax = 0; // CannedService typically doesn't have tax
    
    // Check if any pricing values differ from CannedService (with small tolerance for floating point)
    const subtotalDiff = Math.abs(workOrderSubtotal - expectedSubtotal) > 0.01;
    const discountDiff = Math.abs(workOrderDiscount - expectedDiscount) > 0.01;
    const taxDiff = Math.abs(workOrderTax - expectedTax) > 0.01;
    
    const isCustomPricing = subtotalDiff || discountDiff || taxDiff;
    
    return {
      id: workOrderService.id,
      cannedServiceId: workOrderService.cannedServiceId,
      cannedService: workOrderService.cannedService,
      description: workOrderService.cannedService?.name || workOrderService.description || 'Service',
      quantity: workOrderService.quantity || 1,
      unitPrice: workOrderService.unitPrice || workOrderService.cannedService?.price || 0,
      subtotal: workOrderSubtotal,
      discount: workOrderDiscount,
      tax: workOrderTax,
      status: workOrderService.status || 'active',
      notes: workOrderService.notes || workOrderService.cannedService?.description || '',
      createdAt: workOrderService.createdAt,
      updatedAt: workOrderService.updatedAt,
      linkedLabor: linkedLabor, // Store linked labor for display
      isCustomPricing: isCustomPricing // Flag for pricing validation
    };
  });

  // Summary calculations for services
  const totalServiceCount = services.length;
  const totalServiceCost = services.reduce((sum, s) => sum + (s.subtotal || 0), 0);
  const totalDiscount = services.reduce((sum, s) => sum + (s.discount || 0), 0);
  const totalTax = services.reduce((sum, s) => sum + (s.tax || 0), 0);

  // Summary calculations for labor
  const totalEstimatedHours = labor.reduce((sum, l) => sum + (l.laborCatalog?.estimatedHours || 0), 0);
  const totalLaborCost = labor.reduce((sum, l) => sum + (l.subtotal || 0), 0);
  const technicianIds = new Set(labor.map(l => l.technicianId).filter(Boolean));
  const numTechnicians = technicianIds.size;


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
                  <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>Subtotal</th>
                  <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>Discount</th>
                  <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>Tax</th>
                  <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>Pricing Status</th>
                  <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map(service => {
                  const linkedLabor = service.linkedLabor || [];
                  return (
                    <React.Fragment key={service.id}>
                      <tr>
                      <td style={{ padding: '6px 10px', maxWidth: 120, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', border: '1px solid #e5e7eb' }}>
                          {service.description}
                      </td>
                      <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>
                          {service.description}
                      </td>
                      <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb', fontWeight: 600, color: '#2563eb' }}>
                        LKR {Number(service.subtotal).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb', textAlign: 'center' }}>
                        LKR {Number(service.discount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb', textAlign: 'center' }}>
                        LKR {Number(service.tax).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb', textAlign: 'center' }}>
                        {service.isCustomPricing ? (
                          <span style={{ background: '#fef2f2', color: '#dc2626', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '500' }}>
                            <i className="bx bx-error" style={{ marginRight: '4px' }}></i>
                            CUSTOM PRICING
                          </span>
                        ) : (
                          <span style={{ background: '#d1fae5', color: '#065f46', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '500' }}>
                            <i className="bx bx-check" style={{ marginRight: '4px' }}></i>
                            STANDARD
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
                      {/* Show labor items for this service */}
                      {linkedLabor.length > 0 && (
                        <tr>
                          <td colSpan={7} style={{ background: '#f6f8fa', padding: 0, border: '1px solid #e5e7eb' }}>
                            <div style={{ padding: '16px 20px' }}>
                              <div style={{ fontWeight: 600, color: '#2563eb', marginBottom: 12, fontSize: 14 }}>
                                <i className="bx bx-wrench" style={{ marginRight: '6px' }}></i>
                                Labor Items ({linkedLabor.length})
                              </div>
                              <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                                <table style={{ width: '100%', fontSize: 13, background: '#fff', borderCollapse: 'collapse' }}>
                                  <thead>
                                    <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e5e7eb' }}>
                                      <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: '600', color: '#374151', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', width: '20%' }}>Description</th>
                                      <th style={{ textAlign: 'center', padding: '12px 16px', fontWeight: '600', color: '#374151', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', width: '8%' }}>Hours</th>
                                      <th style={{ textAlign: 'center', padding: '12px 16px', fontWeight: '600', color: '#374151', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', width: '12%' }}>Subtotal</th>
                                      <th style={{ textAlign: 'center', padding: '12px 16px', fontWeight: '600', color: '#374151', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', width: '10%' }}>Start Time</th>
                                      <th style={{ textAlign: 'center', padding: '12px 16px', fontWeight: '600', color: '#374151', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', width: '10%' }}>End Time</th>
                                      <th style={{ textAlign: 'center', padding: '12px 16px', fontWeight: '600', color: '#374151', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', width: '10%' }}>Status</th>
                                      <th style={{ textAlign: 'center', padding: '12px 16px', fontWeight: '600', color: '#374151', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', width: '15%' }}>Technician</th>
                                      <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: '600', color: '#374151', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', width: '10%' }}>Notes</th>
                                      <th style={{ textAlign: 'center', padding: '12px 16px', fontWeight: '600', color: '#374151', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', width: '5%' }}>Actions</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {linkedLabor.map((laborItem: WorkOrderLabor, index: number) => (
                                      <tr key={laborItem.id} style={{ borderBottom: index < linkedLabor.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                                        <td style={{ padding: '12px 16px', fontWeight: '500', color: '#1f2937' }}>{laborItem.description}</td>
                                        <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight: '500', color: '#6b7280' }}>{laborItem.hours}</td>
                                        <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight: '600', color: '#2563eb' }}>LKR {Number(laborItem.subtotal).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                        <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight: '500', color: '#6b7280', fontSize: '12px' }}>
                                          {laborItem.startTime ? new Date(laborItem.startTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '-'}
                                        </td>
                                        <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight: '500', color: '#6b7280', fontSize: '12px' }}>
                                          {laborItem.endTime ? new Date(laborItem.endTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '-'}
                                        </td>
                                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                          {laborItem.status === 'PENDING' && (
                                            <span style={{ background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '500' }}>
                                              PENDING
                                            </span>
                                          )}
                                          {laborItem.status === 'IN_PROGRESS' && (
                                            <span style={{ background: '#dbeafe', color: '#1e40af', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '500' }}>
                                              IN PROGRESS
                                            </span>
                                          )}
                                          {laborItem.status === 'COMPLETED' && (
                                            <span style={{ background: '#d1fae5', color: '#065f46', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '500' }}>
                                              COMPLETED
                                            </span>
                                          )}
                                          {!laborItem.status && (
                                            <span style={{ background: '#f3f4f6', color: '#6b7280', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: '500' }}>
                                              -
                                            </span>
                                          )}
                                        </td>
                                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                          {laborItem.technician?.userProfile?.name ? (
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                                              {laborItem.technician.userProfile.profileImage ? (
                                                <img 
                                                  src={laborItem.technician.userProfile.profileImage} 
                                                  alt={laborItem.technician.userProfile.name} 
                                                  style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover', border: '1px solid #e5e7eb' }} 
                                                />
                                              ) : (
                                                <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', fontWeight: '600', fontSize: 12 }}>
                                                  {laborItem.technician.userProfile.name[0]}
                                                </div>
                                              )}
                                              <span style={{ fontWeight: '500', color: '#374151', fontSize: '12px' }}>{laborItem.technician.userProfile.name}</span>
                                            </div>
                                          ) : (
                                            <span style={{ color: '#9ca3af', fontStyle: 'italic', fontSize: '12px' }}>Unassigned</span>
                                          )}
                                        </td>
                                        <td style={{ padding: '12px 16px', color: '#6b7280', fontSize: '12px' }}>{laborItem.notes || '-'}</td>
                                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', justifyContent: 'center' }}>
                                            <button 
                                              className="assign-technician-btn"
                                              title="Assign Technician"
                                              onClick={() => handleOpenAssignTechnicianModal(laborItem.id)}
                                              style={{ 
                                                background: '#10b981', 
                                                color: '#fff', 
                                                border: 'none', 
                                                borderRadius: '6px', 
                                                padding: '8px', 
                                                fontSize: '14px', 
                                                cursor: 'pointer', 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'center', 
                                                width: '32px', 
                                                height: '32px', 
                                                transition: 'all 0.2s ease'
                                              }}
                                              onMouseEnter={(e) => {
                                                e.currentTarget.style.background = '#059669';
                                                e.currentTarget.style.transform = 'scale(1.05)';
                                              }}
                                              onMouseLeave={(e) => {
                                                e.currentTarget.style.background = '#10b981';
                                                e.currentTarget.style.transform = 'scale(1)';
                                              }}
                                            >
                                              <i className="bx bx-user-plus"></i>
                                            </button>
                                            <button 
                                              className="edit-labor-btn"
                                              title="Edit Labor"
                                              onClick={() => handleOpenEditLaborModal(laborItem)}
                                              style={{ 
                                                background: '#3b82f6', 
                                                color: '#fff', 
                                                border: 'none', 
                                                borderRadius: '6px', 
                                                padding: '8px', 
                                                fontSize: '14px', 
                                                cursor: 'pointer', 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'center', 
                                                width: '32px', 
                                                height: '32px', 
                                                transition: 'all 0.2s ease'
                                              }}
                                              onMouseEnter={(e) => {
                                                e.currentTarget.style.background = '#2563eb';
                                                e.currentTarget.style.transform = 'scale(1.05)';
                                              }}
                                              onMouseLeave={(e) => {
                                                e.currentTarget.style.background = '#3b82f6';
                                                e.currentTarget.style.transform = 'scale(1)';
                                              }}
                                            >
                                              <i className="bx bx-edit"></i>
                                            </button>
                                          </div>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
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

      {/* Assign Technician Modal */}
      {showAssignTechnicianModal && (
        <div className="manage-workorder-modal__overlay" onClick={() => setShowAssignTechnicianModal(false)}>
          <div className="manage-workorder-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="modal-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #e5e7eb' }}>
              <h3 style={{ margin: 0, color: '#374151', fontSize: '18px', fontWeight: '600' }}>
                <i className="bx bx-user-plus" style={{ marginRight: '8px', color: '#10b981' }}></i>
                Assign Technician
              </h3>
              <button 
                onClick={() => setShowAssignTechnicianModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#6b7280' }}
              >
                <i className="bx bx-x"></i>
              </button>
            </div>
            
            <div className="modal-body">
              <div className="main-content" style={{ padding: '24px' }}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                    Select Technician
                  </label>
                  <select
                    value={selectedTechnicianId}
                    onChange={(e) => setSelectedTechnicianId(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      background: '#fff',
                      color: '#374151'
                    }}
                  >
                    <option value="">Select a technician...</option>
                    {technicians.map((technician) => (
                      <option key={technician.id} value={technician.id}>
                        {getTechnicianDisplayName(technician)}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => setShowAssignTechnicianModal(false)}
                    style={{
                      padding: '10px 20px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      background: '#fff',
                      color: '#374151',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAssignTechnician}
                    disabled={!selectedTechnicianId || assigningTechnician}
                    style={{
                      padding: '10px 20px',
                      border: 'none',
                      borderRadius: '6px',
                      background: !selectedTechnicianId || assigningTechnician ? '#9ca3af' : '#10b981',
                      color: '#fff',
                      cursor: !selectedTechnicianId || assigningTechnician ? 'not-allowed' : 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    {assigningTechnician ? (
                      <>
                        <i className="bx bx-loader-alt bx-spin"></i>
                        Assigning...
                      </>
                    ) : (
                      <>
                        <i className="bx bx-check"></i>
                        Assign Technician
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Labor Modal */}
      {showEditLaborModal && selectedLaborItem && (
        <div className="manage-workorder-modal__overlay" onClick={() => setShowEditLaborModal(false)}>
          <div className="manage-workorder-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="modal-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #e5e7eb' }}>
              <h3 style={{ margin: 0, color: '#374151', fontSize: '18px', fontWeight: '600' }}>
                <i className="bx bx-edit" style={{ marginRight: '8px', color: '#3b82f6' }}></i>
                Edit Labor Item
              </h3>
              <button 
                onClick={() => setShowEditLaborModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#6b7280' }}
              >
                <i className="bx bx-x"></i>
              </button>
            </div>
            
            <div className="modal-body">
              <div className="main-content" style={{ padding: '24px' }}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                    Labor Description
                  </label>
                  <div style={{ padding: '12px', background: '#f9fafb', borderRadius: '6px', color: '#6b7280', fontSize: '14px' }}>
                    {selectedLaborItem.description}
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                    Subtotal (LKR) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editSubtotal}
                    onChange={(e) => setEditSubtotal(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      background: '#fff',
                      color: '#374151'
                    }}
                    placeholder="Enter subtotal amount"
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                    Status (Optional)
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      background: '#fff',
                      color: '#374151'
                    }}
                  >
                    <option value="">Select status...</option>
                    <option value="PENDING">Pending</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                    End Time (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={editEndTime}
                    onChange={(e) => setEditEndTime(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      background: '#fff',
                      color: '#374151'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => setShowEditLaborModal(false)}
                    style={{
                      padding: '10px 20px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      background: '#fff',
                      color: '#374151',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateLabor}
                    disabled={!editSubtotal || updatingLabor}
                    style={{
                      padding: '10px 20px',
                      border: 'none',
                      borderRadius: '6px',
                      background: !editSubtotal || updatingLabor ? '#9ca3af' : '#3b82f6',
                      color: '#fff',
                      cursor: !editSubtotal || updatingLabor ? 'not-allowed' : 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    {updatingLabor ? (
                      <>
                        <i className="bx bx-loader-alt bx-spin"></i>
                        Updating...
                      </>
                    ) : (
                      <>
                        <i className="bx bx-save"></i>
                        Update Labor
                      </>
                    )}
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


const InspectionsTab: React.FC<{ 
  workOrderId: string; 
  onOpenAddInspectionModal: () => void;
  onOpenAssignTechnicianModal: (inspectionId: string) => void;
  isServiceAdvisor: boolean;
}> = ({ workOrderId, onOpenAddInspectionModal, onOpenAssignTechnicianModal, isServiceAdvisor }) => {
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
            <button 
              className="btn btn--secondary" 
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              onClick={onOpenAddInspectionModal}
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
                          onClick={() => alert(`View details for inspection ${inspection.id}`)}
                        >
                          <i className="bx bx-box"></i>
                        </button>
                          {!isServiceAdvisor && (
                            <button 
                              className="assign-btn"
                              title="Assign Technician"
                              onClick={() => onOpenAssignTechnicianModal(inspection.id)}
                              style={{ background: '#10b981', color: '#fff', border: 'none', borderRadius: 6, padding: '6px', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', transition: 'all 0.2s ease' }}
                            >
                              <i className="bx bx-user-plus"></i>
                            </button>
                          )}
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
  const [showAddInspectionModal, setShowAddInspectionModal] = useState(false);
  const [inspectionTemplates, setInspectionTemplates] = useState<any[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [inspectionNotes, setInspectionNotes] = useState('');
  const [showAssignTechnicianModal, setShowAssignTechnicianModal] = useState(false);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [selectedInspectionId, setSelectedInspectionId] = useState('');
  const [selectedTechnicianId, setSelectedTechnicianId] = useState('');

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

    console.log('=== ADD CANNED SERVICE DEBUG ===');
    console.log('Estimate ID:', selectedEstimateId);
    console.log('Canned Service ID:', cannedServiceId);
    console.log('Token available:', !!token);

    const payload = {
      cannedServiceId: cannedServiceId
    };

    console.log('Payload being sent:', payload);
    console.log('URL:', `http://localhost:3000/estimates/${selectedEstimateId}/add-canned-service`);

    try {
      const response = await fetch(`http://localhost:3000/estimates/${selectedEstimateId}/add-canned-service`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to add canned service: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Success response:', result);
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

  // Fetch Inspection Templates Function
  const fetchInspectionTemplates = async () => {
    if (!token) return;
    
    try {
      const response = await fetch('http://localhost:3000/inspection-templates/templates?page=1&limit=100&isActive=true', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch inspection templates: ${response.statusText}`);
      }

      const data = await response.json();
      setInspectionTemplates(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error('Error fetching inspection templates:', error);
    }
  };

  // Fetch Technicians Function
  const fetchTechnicians = async () => {
    if (!token) return;
    
    try {
      const response = await fetch('http://localhost:3000/technicians', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch technicians: ${response.statusText}`);
      }

      const data = await response.json();
      const techniciansArray = Array.isArray(data) ? data : data.data || [];
      console.log('=== FETCHED TECHNICIANS DEBUG ===');
      console.log('Technicians data:', techniciansArray);
      if (techniciansArray.length > 0) {
        console.log('First technician structure:', techniciansArray[0]);
      }
      setTechnicians(techniciansArray);
    } catch (error) {
      console.error('Error fetching technicians:', error);
    }
  };

  // Assign Inspector Function
  const handleAssignInspector = async () => {
    if (!selectedInspectionId || !selectedTechnicianId || !token) {
      console.error('Missing inspection ID, technician ID, or token');
      return;
    }

    console.log('=== ASSIGN INSPECTOR DEBUG ===');
    console.log('Inspection ID:', selectedInspectionId);
    console.log('Technician ID:', selectedTechnicianId);
    console.log('Token available:', !!token);

    const payload = {
      inspectorId: selectedTechnicianId
    };

    console.log('Payload being sent:', payload);
    console.log('URL:', `http://localhost:3000/inspection-templates/inspections/${selectedInspectionId}`);

    try {
      const response = await fetch(`http://localhost:3000/inspection-templates/inspections/${selectedInspectionId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to assign inspector: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Success response:', result);
      console.log('Inspector assigned successfully');
      // Close modal and refresh page
      setShowAssignTechnicianModal(false);
      setSelectedInspectionId('');
      setSelectedTechnicianId('');
      window.location.reload();
      
    } catch (error) {
      console.error('Error assigning inspector:', error);
    }
  };

  // Assign Inspection Template Function
  const handleAssignInspectionTemplate = async () => {
    if (!selectedTemplateId || !workOrder?.id || !token) {
      console.error('Missing template ID, work order ID, or token');
      return;
    }

    console.log('=== ASSIGN INSPECTION TEMPLATE DEBUG ===');
    console.log('Work Order ID:', workOrder.id);
    console.log('Selected Template ID:', selectedTemplateId);
    console.log('Inspection Notes:', inspectionNotes);
    console.log('Token available:', !!token);

    const payload = {
      workOrderId: workOrder.id,
      templateId: selectedTemplateId,
      notes: inspectionNotes
    };

    console.log('Payload being sent:', payload);
    console.log('URL:', 'http://localhost:3000/inspection-templates/work-orders/assign-template');

    try {
      const response = await fetch('http://localhost:3000/inspection-templates/work-orders/assign-template', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to assign inspection template: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Success response:', result);
      console.log('Inspection template assigned successfully');
      // Close modal and refresh page
      setShowAddInspectionModal(false);
      setSelectedTemplateId('');
      setInspectionNotes('');
      window.location.reload();
      
    } catch (error) {
      console.error('Error assigning inspection template:', error);
    }
  };

  // Open Canned Services Modal
  const openCannedServicesModal = () => {
    setShowCannedServicesModal(true);
    fetchCannedServices();
    fetchEstimates();
  };

  // Open Add Inspection Modal
  const openAddInspectionModal = () => {
    setShowAddInspectionModal(true);
    fetchInspectionTemplates();
  };

  // Open Assign Technician Modal
  const openAssignTechnicianModal = (inspectionId: string) => {
    setSelectedInspectionId(inspectionId);
    setShowAssignTechnicianModal(true);
    fetchTechnicians();
  };

  // Helper function to get technician display name
  const getTechnicianDisplayName = (technician: any) => {
    if (!technician) return 'Unknown';
    
    // Try different possible name fields
    if (technician.userProfile?.firstName && technician.userProfile?.lastName) {
      return `${technician.userProfile.firstName} ${technician.userProfile.lastName}`;
    }
    if (technician.userProfile?.name) {
      return technician.userProfile.name;
    }
    if (technician.name) {
      return technician.name;
    }
    if (technician.firstName && technician.lastName) {
      return `${technician.firstName} ${technician.lastName}`;
    }
    
    return 'Unknown Technician';
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
        return <InspectionsTab workOrderId={workOrder?.id || ''} onOpenAddInspectionModal={openAddInspectionModal} onOpenAssignTechnicianModal={openAssignTechnicianModal} isServiceAdvisor={isServiceAdvisor} />;
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

      {/* Add Inspection Modal */}
      {showAddInspectionModal && (
        <div className="manage-workorder-modal__overlay" onClick={() => setShowAddInspectionModal(false)}>
          <div className="manage-workorder-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px' }}>
            {/* Modal Header */}
            <div className="modal-header">
              <div className="modal-title">
                <h2>Add Inspection Template</h2>
                <p className="modal-subtitle">Select an inspection template to assign to this work order</p>
              </div>
              <button className="close-btn" onClick={() => setShowAddInspectionModal(false)} title="Close">
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
                    onClick={() => setShowAddInspectionModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="btn btn--primary"
                    onClick={handleAssignInspectionTemplate}
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
      )}

      {/* Assign Technician Modal */}
      {showAssignTechnicianModal && (
        <div className="manage-workorder-modal__overlay" onClick={() => setShowAssignTechnicianModal(false)}>
          <div className="manage-workorder-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            {/* Modal Header */}
            <div className="modal-header">
              <div className="modal-title">
                <h2>Assign Technician</h2>
                <p className="modal-subtitle">Select a technician to assign to this inspection</p>
              </div>
              <button className="close-btn" onClick={() => setShowAssignTechnicianModal(false)} title="Close">
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
                    onClick={() => setShowAssignTechnicianModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="btn btn--primary"
                    onClick={handleAssignInspector}
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
      )}
    </div>
  );
};

export default ManageWorkOrderModal;