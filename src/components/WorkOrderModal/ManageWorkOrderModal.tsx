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

const LaborTab: React.FC<{ workOrderId: string }> = ({ workOrderId }) => {
  const [labor, setLabor] = useState<WorkOrderLabor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  React.useEffect(() => {
    if (!workOrderId) return;
    setLoading(true);
    fetch(`http://localhost:3000/labor/work-order?workOrderId=${workOrderId}`)
      .then(res => res.json())
      .then(apiRes => {
        let laborArr = Array.isArray(apiRes) ? apiRes : (Array.isArray(apiRes.data) ? apiRes.data : []);
        setLabor(laborArr || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch labor records');
        setLoading(false);
      });
  }, [workOrderId]);

  if (loading) return <div className="tab-content labor-tab">Loading labor records...</div>;
  if (error) return <div className="tab-content labor-tab" style={{ color: 'red' }}>{error}</div>;
  if (!labor || labor.length === 0) return <div className="tab-content labor-tab">No labor records found for this work order.</div>;

  // Summary calculations
  const totalEstimatedHours = labor.reduce((sum, l) => sum + (l.laborCatalog?.estimatedHours || 0), 0);
  const totalCost = labor.reduce((sum, l) => sum + (l.subtotal || 0), 0);
  const totalDiscount = labor.reduce((sum, l) => sum + (l.serviceDiscountAmount || 0), 0);
  const technicianIds = new Set(labor.map(l => l.technicianId).filter(Boolean));
  const numTechnicians = technicianIds.size;
  // Total time elapsed (sum of all (endTime - startTime) in hours)
  const totalTimeElapsed = labor.reduce((sum, l) => {
    if (l.startTime && l.endTime) {
      const start = new Date(l.startTime).getTime();
      const end = new Date(l.endTime).getTime();
      if (!isNaN(start) && !isNaN(end) && end > start) {
        return sum + (end - start) / (1000 * 60 * 60);
      }
    }
    return sum;
  }, 0);

  return (
    <div className="tab-content labor-tab">
      <div className="labor-summary-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20, marginBottom: 24, width: '100%' }}>
        <div className="labor-summary-card" style={{ background: '#f9fafb', borderRadius: 12, padding: '18px 24px', minWidth: 0, boxShadow: '0 1px 4px #0001', border: '1px solid #e5e7eb', width: '100%' }}>
          <div style={{ color: '#6b7280', fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Total est. hours</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#1f2937' }}>{totalEstimatedHours.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
        </div>
        <div className="labor-summary-card" style={{ background: '#f9fafb', borderRadius: 12, padding: '18px 24px', minWidth: 0, boxShadow: '0 1px 4px #0001', border: '1px solid #e5e7eb', width: '100%' }}>
          <div style={{ color: '#6b7280', fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Total cost</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#1f2937' }}>LKR {Number(totalCost).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: true }).replace(/^0+(?=\d)/, '')}</div>
        </div>
        <div className="labor-summary-card" style={{ background: '#f9fafb', borderRadius: 12, padding: '18px 24px', minWidth: 0, boxShadow: '0 1px 4px #0001', border: '1px solid #e5e7eb', width: '100%' }}>
          <div style={{ color: '#6b7280', fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Total discount</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#1f2937' }}>LKR {Number(totalDiscount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: true }).replace(/^0+(?=\d)/, '')}</div>
        </div>
        <div className="labor-summary-card" style={{ background: '#f9fafb', borderRadius: 12, padding: '18px 24px', minWidth: 0, boxShadow: '0 1px 4px #0001', border: '1px solid #e5e7eb', width: '100%' }}>
          <div style={{ color: '#6b7280', fontWeight: 600, fontSize: 15, marginBottom: 4 }}># Technicians</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#1f2937' }}>{numTechnicians}</div>
        </div>
        <div className="labor-summary-card" style={{ background: '#f9fafb', borderRadius: 12, padding: '18px 24px', minWidth: 0, boxShadow: '0 1px 4px #0001', border: '1px solid #e5e7eb', width: '100%' }}>
          <div style={{ color: '#6b7280', fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Total time elapsed</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#1f2937' }}>{totalTimeElapsed.toLocaleString(undefined, { minimumFractionDigits: 2 })} h</div>
        </div>
      </div>
      <div className="tab-header">
        <h3>Labor</h3>
      </div>
      <div className="labor-table-container" style={{ overflowX: 'auto', padding: 0 }}>
        <table className="labor-table styled-table" style={{ width: '100%', minWidth: 700, fontSize: 13, borderCollapse: 'collapse', border: '1px solid #e5e7eb', background: '#fff' }}>
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>Name</th>
              <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>Rate</th>
              <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>Hours</th>
              <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>Discount</th>
              <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>Discount Type</th>
              <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>Total</th>
              <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>Category</th>
              <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>Technician</th>
              <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>Start Time</th>
              <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>End Time</th>
              <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}></th>
            </tr>
          </thead>
          <tbody>
            {labor.map(item => {
              // Technician display logic
              const tech = item.technician;
              const userProfile = tech?.userProfile;
              const techAssigned = !!tech && !!userProfile;
              return (
                <tr key={item.id}>
                  <td style={{ padding: '6px 10px', maxWidth: 120, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', border: '1px solid #e5e7eb' }}>{item.laborCatalog?.name || item.description || '-'}</td>
                  <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>LKR {Number(item.rate).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>{Number(item.hours).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>{typeof item.serviceDiscountAmount === 'number' ? `LKR ${Number(item.serviceDiscountAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '-'}</td>
                  <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>{item.serviceDiscountType || '-'}</td>
                  <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb', fontWeight: 600, color: '#2563eb' }}>LKR {Number(item.subtotal).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>{item.laborCatalog?.category || '-'}</td>
                  <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>
                    {techAssigned ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
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
                      <span style={{ background: '#fef2f2', color: '#b91c1c', borderRadius: 8, padding: '2px 8px', fontSize: 12, fontWeight: 500 }}>Technician not assigned</span>
                    )}
                  </td>
                  <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>
                    {item.startTime ? (
                      new Date(item.startTime).toLocaleString()
                    ) : (
                      <span style={{ background: '#fef9c3', color: '#b45309', borderRadius: 8, padding: '2px 8px', fontSize: 12, fontWeight: 500 }}>Not started</span>
                    )}
                  </td>
                  <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>
                    {item.endTime ? (
                      new Date(item.endTime).toLocaleString()
                    ) : (
                      <span style={{ background: '#f3f4f6', color: '#6b7280', borderRadius: 8, padding: '2px 8px', fontSize: 12, fontWeight: 500 }}>Not finished</span>
                    )}
                  </td>
                  <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>
                    <button style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', fontSize: 13, cursor: 'pointer', fontWeight: 500, boxShadow: '0 1px 2px #0001' }}>View</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import NotesTab from '../../pages/ServiceCenter/JobCard/tabs/NotesTab';
import './ManageWorkOrderModal.scss';

// Mock types for demonstration
interface Technician {
  id: string;
  name: string;
  avatar: string;
}

interface ServiceLine {
  id: string;
  name: string;
  description: string;
  price: number;
  qty: number;
  hours: number;
  discount: number;
  tax: number;
  status: string;
  technician: Technician | null;
  type: 'package' | 'service';
  customerAccepted?: boolean | null; // true: accepted, false: declined, null/undefined: pending
}

interface PartItem {
  id:string;
  name: string;
  image: string;
  description: string;
  qty: number;
  price: number;
  supplier: string;
  source: 'ordered' | 'inventory' | 'customer';
}


// --- Inspection Types (based on new models) ---
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
  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'bx-home-circle' },
    { id: 'estimates', label: 'Estimates', icon: 'bx-calculator' },
    { id: 'inspections', label: 'Inspections', icon: 'bx-search-alt' },
    { id: 'services', label: 'Services', icon: 'bx-wrench' },
    { id: 'labor', label: 'Labor', icon: 'bx-user-voice' },
    { id: 'parts', label: 'Parts', icon: 'bx-package' },
    { id: 'invoices', label: 'Invoices', icon: 'bx-receipt' },
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
import { useEffect } from 'react';
import { getWorkOrderEstimates, type Estimate } from '../../utils/workOrdersApi';

const EstimatesTab: React.FC<{ workOrderId: string }> = ({ workOrderId }) => {
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
            if (Array.isArray(est.estimatePartItems)) {
              estimateItems = estimateItems.concat(
                est.estimatePartItems.map((item: any) => ({
                  ...item,
                  type: 'PART',
                  quantity: item.quantity || 1,
                  unitPrice: item.unitPrice || 0,
                  totalPrice: item.subtotal || (item.quantity * (item.unitPrice || 0)),
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

  return (
    <div className="tab-content estimates-tab">
      <div className="tab-header">
        <h3>Estimates</h3>
        <button className="btn btn--primary">Add Estimate</button>
      </div>
      {estimates.length === 0 ? (
        <div>No estimates found for this work order.</div>
      ) : (
        <div className="estimates-list">
          {estimates.map(est => {
            const items = Array.isArray(est.estimateItems) ? est.estimateItems : [];
            return (
              <div className="estimate-card" key={est.id}>
                <div className="estimate-header">
                  <span className="estimate-version">Version {est.version}</span>
                  <span className={`estimate-status ${est.approved ? 'approved' : 'pending'}`}>{est.approved ? 'Approved' : 'Pending'}</span>
                  <span className="estimate-date">Created: {new Date(est.createdAt).toLocaleString()}</span>
                  {est.approved && est.approvedAt && (
                    <span className="estimate-date">Approved: {new Date(est.approvedAt).toLocaleString()}</span>
                  )}
                </div>
                <div className="estimate-breakdown">
                  <div><strong>Total:</strong> LKR {Number(est.totalAmount).toFixed(2)}</div>
                  <div><strong>Labor:</strong> LKR {Number(est.laborAmount ?? 0).toFixed(2)}</div>
                  <div><strong>Parts:</strong> LKR {Number(est.partsAmount ?? 0).toFixed(2)}</div>
                  <div><strong>Tax:</strong> LKR {Number(est.taxAmount ?? 0).toFixed(2)}</div>
                  <div><strong>Discount:</strong> LKR {Number(est.discountAmount ?? 0).toFixed(2)}</div>
                </div>
                <div className="estimate-description">{est.description}</div>
                <div className="estimate-notes">{est.notes}</div>
                {/* Estimate Items: Labor & Parts */}
                <div className="estimate-items">
                  <h4>Labor Items</h4>
                  <ul>
                    {items.filter(i => i.type === 'LABOR').map(item => (
                      <li key={item.id}>
                        {item.description} — {item.quantity}h x LKR {Number(item.unitPrice).toFixed(2)} = LKR {Number(item.totalPrice).toFixed(2)}
                        {item.notes && <span className="item-notes"> ({item.notes})</span>}
                        {typeof item.customerApproved !== 'undefined' && (
                          <span
                            className={`approval-badge ${item.customerApproved === true ? 'approved' : item.customerApproved === false ? 'declined' : 'pending'}`}
                            title={item.customerApproved === true ? 'Approved by customer' : item.customerApproved === false ? 'Declined by customer' : 'Pending customer approval'}
                          >
                            {item.customerApproved === true ? 'Approved' : item.customerApproved === false ? 'Declined' : 'Pending'}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                  <h4>Part Items</h4>
                  <ul>
                    {items.filter(i => i.type === 'PART').map(item => (
                      <li key={item.id}>
                        {item.description} — {item.quantity} x LKR {Number(item.unitPrice).toFixed(2)} = LKR {Number(item.totalPrice).toFixed(2)}
                        {item.notes && <span className="item-notes"> ({item.notes})</span>}
                        {typeof item.customerApproved !== 'undefined' && (
                          <span
                            className={`approval-badge ${item.customerApproved === true ? 'approved' : item.customerApproved === false ? 'declined' : 'pending'}`}
                            title={item.customerApproved === true ? 'Approved by customer' : item.customerApproved === false ? 'Declined by customer' : 'Pending customer approval'}
                          >
                            {item.customerApproved === true ? 'Approved' : item.customerApproved === false ? 'Declined' : 'Pending'}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Sidebar Component
const Sidebar: React.FC = () => {
  const mockWorkOrderStatus = 'Estimation';
  const estimateSent = false;
  // New mock data for demonstration
  const workOrderId = 'WO-2024-001257';
  const createdDate = 'June 30, 2024';
  const businessLocation = 'Downtown Service Center';

  // Timeline mock data
  const timelineEvents = [
    { label: 'Appointment Booked', date: 'June 25, 2024, 10:00 AM' },
    { label: 'Scheduled Date', date: 'July 1, 2024, 9:00 AM' },
    { label: 'Work Order Created', date: 'June 30, 2024, 4:30 PM' },
    { label: 'Inspection Report Sent', date: 'July 1, 2024, 11:00 AM' },
    { label: 'Estimate Sent', date: 'July 1, 2024, 12:00 PM' },
    { label: 'Estimate Finalized', date: 'July 1, 2024, 2:00 PM' },
    { label: 'Invoice Created', date: 'July 1, 2024, 2:30 PM' },
    { label: 'Payment Made', date: 'July 1, 2024, 3:00 PM' },
  ];

  return (
    <div className="modal-sidebar">
      {/* Work Order Info Section */}
      <div className="sidebar-section">
        <div className="sidebar-section-header">
          <h4><i className="bx bx-file"></i> Work Order Info</h4>
        </div>
        <div className="sidebar-section-content">
          <div className="workorder-info">
            <div className="workorder-row">
              <span className="workorder-label">ID:</span>
              <span className="workorder-value">{workOrderId}</span>
            </div>
            <div className="workorder-row">
              <span className="workorder-label">Created:</span>
              <span className="workorder-value">{createdDate}</span>
            </div>
            <div className="workorder-row">
              <span className="workorder-label">Location:</span>
              <span className="workorder-value">{businessLocation}</span>
            </div>
          </div>
          {/* Timeline Section */}
          <div className="workorder-timeline">
            <h5 className="timeline-title"><i className="bx bx-timeline"></i> Timeline</h5>
            <ul className="timeline-list">
              {timelineEvents.map((event, idx) => (
                <li className="timeline-event" key={idx}>
                  <span className="timeline-event-label">{event.label}</span>
                  <span className="timeline-event-date">{event.date}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Status Section */}
      <div className="sidebar-section">
        <div className="sidebar-section-header">
          <h4><i className="bx bx-info-circle"></i> Status</h4>
        </div>
        <div className="sidebar-section-content">
          <div className="status-display">
            <span className={`status-badge status-badge--${mockWorkOrderStatus.toLowerCase().replace(/ /g, '-')}`}>{mockWorkOrderStatus}</span>
          </div>
        </div>
      </div>

      {/* Customer Info */}
      <div className="sidebar-section">
        <div className="sidebar-section-header">
          <h4><i className="bx bx-user"></i> Customer</h4>
        </div>
        <div className="sidebar-section-content">
          <div className="customer-info">
            <div className="customer-avatar">
              <i className="bx bx-user-circle"></i>
            </div>
            <div className="customer-details">
              <div className="customer-name">John Anderson</div>
              <div className="customer-contact">
                <div className="contact-item">
                  <i className="bx bx-phone"></i>
                  <span>(555) 123-4567</span>
                </div>
                <div className="contact-item">
                  <i className="bx bx-envelope"></i>
                  <span>john.anderson@email.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle Info */}
      <div className="sidebar-section">
        <div className="sidebar-section-header">
          <h4><i className="bx bx-car"></i> Vehicle</h4>
        </div>
        <div className="sidebar-section-content">
          <div className="vehicle-info">
            <div className="vehicle-image">
              <img 
                src="https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg?auto=compress&w=200" 
                alt="Vehicle" 
              />
            </div>
            <div className="vehicle-details">
              <div className="vehicle-name">2022 Toyota Camry</div>
              <div className="vehicle-plate">ABC-1234</div>
              <div className="vehicle-specs">
                <div className="spec-item">
                  <span className="spec-label">VIN:</span>
                  <span className="spec-value">1HGCM82633A123456</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Mileage:</span>
                  <span className="spec-value">47,850 miles</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Color:</span>
                  <span className="spec-value">Silver Metallic</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Job Progress */}
      <div className="sidebar-section">
        <div className="sidebar-section-header">
          <h4><i className="bx bx-timer"></i> Progress</h4>
        </div>
        <div className="sidebar-section-content">
          <div className="progress-info">
            <div className="progress-bar-container">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '65%' }}></div>
              </div>
              <span className="progress-text">65% Complete</span>
            </div>
            <div className="timeline-info">
              <div className="timeline-item">
                <span className="timeline-label">Started</span>
                <span className="timeline-value">July 1, 2024</span>
              </div>
              <div className="timeline-item">
                <span className="timeline-label">Est. Completion</span>
                <span className="timeline-value">July 2, 2024</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assignments */}
      <div className="sidebar-section">
        <div className="sidebar-section-header">
          <h4><i className="bx bx-group"></i> Assignments</h4>
        </div>
        <div className="sidebar-section-content">
          <div className="assignment-info">
            <div className="assignment-item">
              <span className="assignment-label">Technician</span>
              <div className="tech-assignment">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Mike Smith" />
                <span>Mike Smith</span>
              </div>
            </div>
            <div className="assignment-item">
              <span className="assignment-label">Created By</span>
              <span className="assignment-value">Amber Miller</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="sidebar-section">
        <div className="sidebar-section-header">
          <h4><i className="bx bx-bolt-circle"></i> Actions</h4>
        </div>
        <div className="sidebar-section-content">
          <div className="quick-actions">
            {!estimateSent ? (
              <button className="action-btn action-btn--primary">
                <i className="bx bx-send"></i>
                Send Estimate
              </button>
            ) : (
              <button className="action-btn action-btn--primary">
                <i className="bx bx-receipt"></i>
                Generate Invoice
              </button>
            )}
            <button className="action-btn action-btn--secondary">
              <i className="bx bx-printer"></i>
              Print Work Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Overview Tab Content
const OverviewTab: React.FC = () => {
  return (
    <div className="tab-content overview-tab">
      <div className="overview-grid">
        <div className="overview-card">
          <div className="overview-card-header">
            <i className="bx bx-message-detail"></i>
            <h4>Customer Complaint</h4>
          </div>
          <div className="overview-card-content">
            <p>"Brakes squeaking when coming to a stop, especially in the morning. Also noticed steering wheel vibrates slightly when braking at high speeds. Please inspect and replace if needed."</p>
          </div>
        </div>

        <div className="overview-card">
          <div className="overview-card-header">
            <i className="bx bx-note"></i>
            <h4>Service Advisor Notes</h4>
          </div>
          <div className="overview-card-content">
            <p>Customer mentioned noise started about 2 weeks ago. No warning lights on dashboard. Last brake service was 18 months ago.</p>
          </div>
        </div>

        <div className="overview-card">
          <div className="overview-card-header">
            <i className="bx bx-info-circle"></i>
            <h4>Work Order Details</h4>
          </div>
          <div className="overview-card-content">
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Work Order #</span>
                <span className="detail-value">WO-2024-001257</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Priority</span>
                <span className="priority-badge priority-badge--medium">Medium</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Vehicle Arrival</span>
                <span className="detail-value">July 1, 2024 at 9:00 AM</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Personal Items</span>
                <span className="detail-value">Umbrella, Sunglasses</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Mock data

const mockParts: PartItem[] = [
  {
    id: 'part-1',
    name: 'Ceramic Brake Pads',
    image: 'https://www.r1concepts.com/media/r1concepts/images/blog/2023/the-best-pad-for-me-ceramic-pads-2.png',
    description: 'Premium ceramic brake pad set',
    qty: 1,
    price: 120.0,
    supplier: 'AutoZone',
    source: 'ordered',
  },
  {
    id: 'part-2',
    name: 'Oil Filter',
    image: 'https://dmaxstore.com/cdn/shop/products/PPE_20LM2_20oil_20filter-1.jpg?v=1744399263',
    description: 'High-efficiency oil filter',
    qty: 1,
    price: 15.0,
    supplier: 'NAPA',
    source: 'inventory',
  },
  {
    id: 'part-3',
    name: 'Wiper Blades',
    image: 'https://cdn11.bigcommerce.com/s-1b7b3/images/stencil/1280x1280/products/112/1086/wiper-blades__28213.1620072052.jpg?c=2',
    description: 'Front windshield wiper blades',
    qty: 1,
    price: 0.0,
    supplier: 'Customer',
    source: 'customer',
  },
];

const sourceColors: Record<PartItem['source'], string> = {
  ordered: '#007bff',
  inventory: '#ff9800',
  customer: '#28a745',
};


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

const ServicesTab: React.FC<{ workOrderId: string }> = ({ workOrderId }) => {
  const [services, setServices] = useState<WorkOrderService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!workOrderId) return;
    setLoading(true);
    fetch(`http://localhost:3000/work-orders/${workOrderId}/services`)
      .then(res => res.json())
      .then(apiRes => {
        // Support both wrapped and unwrapped responses
        let servicesArr = Array.isArray(apiRes) ? apiRes : (Array.isArray(apiRes.data) ? apiRes.data : []);
        setServices(servicesArr || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch services');
        setLoading(false);
      });
  }, [workOrderId]);

  if (loading) return <div className="tab-content services-tab">Loading services...</div>;
  if (error) return <div className="tab-content services-tab" style={{ color: 'red' }}>{error}</div>;
  if (!services || services.length === 0) return <div className="tab-content services-tab">No services found for this work order.</div>;

  return (
    <div className="tab-content services-tab">
      <div className="tab-header">
        <h3>Services</h3>
      </div>
      <div className="services-table-container">
        <table className="services-table styled-table" style={{ width: '100%', minWidth: 700 }}>
          <thead>
            <tr>
              <th>Service Name</th>
              <th>Description</th>
              <th>Unit Price</th>
              <th>Quantity</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {services.map(service => (
              <tr key={service.id}>
                <td>{service.cannedService?.name || '-'}</td>
                <td>{service.description || service.cannedService?.description || '-'}</td>
                <td>LKR {Number(service.unitPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td>{service.quantity}</td>
                <td>LKR {Number(service.subtotal).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Parts Tab Content
const PartsTab: React.FC = () => {
  const [parts, setParts] = useState<PartItem[]>(mockParts);

  const handleSourceChange = (id: string, newSource: PartItem['source']) => {
    setParts(prev => prev.map(part => part.id === id ? { ...part, source: newSource } : part));
  };

  const handleRemove = (id: string) => {
    setParts(prev => prev.filter(part => part.id !== id));
  };

  return (
    <div className="tab-content parts-tab">
      <div className="tab-header">
        <h3>Parts</h3>
        <div className="tab-actions">
          <button className="btn btn--primary">
            <i className="bx bx-plus"></i> Add Part
          </button>
        </div>
      </div>

      {/* Parts Table */}
      <div className="parts-table-container">
        <table className="parts-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Image</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Supplier</th>
              <th>Source</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {parts.map(part => (
              <tr key={part.id} className={part.source === 'customer' ? 'customer-part-row' : ''}>
                <td>{part.name}</td>
                <td>{part.description}</td>
                <td><img src={part.image} alt={part.name} className="part-image-thumb" /></td>
                <td>{part.qty}</td>
                <td>{part.price > 0 ? `LKR ${part.price.toFixed(2)}` : '-'}</td>
                <td>{part.supplier}</td>
                <td>
                  <select
                    className="part-source-dropdown"
                    value={part.source}
                    onChange={e => handleSourceChange(part.id, e.target.value as PartItem['source'])}
                    style={{
                      backgroundColor: sourceColors[part.source],
                      color: '#fff',
                      fontWeight: 500,
                      border: 'none',
                    }}
                  >
                    <option value="ordered">Ordered</option>
                    <option value="inventory">Inventory</option>
                    <option value="customer">Customer Supplied</option>
                  </select>
                </td>
                <td>
                  <button className="btn-icon btn-danger" title="Remove" onClick={() => handleRemove(part.id)}>
                    <i className="bx bx-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

  useEffect(() => {
    if (!workOrderId) return;
    setLoading(true);
    fetch(`http://localhost:3000/inspection-templates/work-orders/inspections?workOrderId=${workOrderId}`)
      .then(res => res.json())
      .then(apiRes => {
        // Support both wrapped and unwrapped responses
        let inspectionsArr = Array.isArray(apiRes) ? apiRes : (Array.isArray(apiRes.data) ? apiRes.data : []);
        setInspections(inspectionsArr || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch inspections');
        setLoading(false);
      });
  }, [workOrderId]);

  if (loading) return <div className="tab-content inspections-tab">Loading inspections...</div>;
  if (error) return <div className="tab-content inspections-tab" style={{ color: 'red' }}>{error}</div>;
  if (!inspections || inspections.length === 0) return <div className="tab-content inspections-tab">No inspections found.</div>;

  // Helper to get technician name
  const getTechnicianName = (inspector: any) => {
    if (!inspector) return '-';
    if (typeof inspector.name === 'string') return inspector.name;
    if (inspector.userProfile && inspector.userProfile.name) return inspector.userProfile.name;
    return '-';
  };

  return (
    <div className="tab-content inspections-tab">
      <div className="tab-header">
        <h3>Inspections</h3>
      </div>
      <div className="inspection-summary-table-container full-width-table">
        <table className="inspection-summary-table styled-table" style={{ width: '100%', minWidth: 900 }}>
          <thead>
            <tr>
              <th>Technician</th>
              <th>Date</th>
              <th>Status</th>
              <th>Template Name</th>
              <th>Template Description</th>
              <th>Template Category</th>
              <th>Notes</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {inspections.map((inspection) => {
              const template: Partial<InspectionTemplate> = inspection.template || {};
              return (
                <tr key={inspection.id}>
                  <td>{getTechnicianName(inspection.inspector)}</td>
                  <td>{inspection.date ? new Date(inspection.date).toLocaleString() : '-'}</td>
                  <td>
                    <span className={`estimate-status ${inspection.isCompleted ? 'approved' : 'pending'}`}>{inspection.isCompleted ? 'Completed' : 'In Progress'}</span>
                  </td>
                  <td>{template?.name || '-'}</td>
                  <td>{template?.description || '-'}</td>
                  <td>{template?.category || '-'}</td>
                  <td>{inspection.notes || '-'}</td>
                  <td>
                    <button className="btn btn--primary btn--sm" style={{ padding: '4px 12px', fontSize: 14 }} onClick={() => alert(`View details for inspection ${inspection.id}`)}>
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Main Modal Component
const ManageWorkOrderModal: React.FC<ManageWorkOrderModalProps> = ({ open, onClose, workOrder }) => {

  const [activeTab, setActiveTab] = useState('overview');
  const [notes, setNotes] = useState('');

  if (!open) return null;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'estimates':
        return <EstimatesTab workOrderId={workOrder?.id || ''} />;
      case 'inspections':
        return <InspectionsTab workOrderId={workOrder?.id || ''} />;
      case 'services':
        return <ServicesTab workOrderId={workOrder?.id || ''} />;
      case 'labor':
        return <LaborTab workOrderId={workOrder?.id || ''} />;
      case 'parts':
        return <PartsTab />;
      case 'invoices':
        return <div className="tab-content">Invoices tab coming soon...</div>;
      case 'notes':
        return <NotesTabContent notes={notes} onNotesChange={setNotes} />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className="manage-workorder-modal__overlay" onClick={onClose}>
      <div className="manage-workorder-modal" onClick={e => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title">
            <h2>Work Order #WO-2024-001257</h2>
            <p className="modal-subtitle">Managing work order for John Anderson's 2022 Toyota Camry</p>
          </div>
          <button className="close-btn" onClick={onClose} title="Close">
            <i className="bx bx-x"></i>
          </button>
        </div>

        {/* Tab Navigation */}
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Modal Body */}
        <div className="modal-body">
          {/* Main Content Area */}
          <div className="main-content">
            {renderTabContent()}
          </div>

          {/* Sidebar */}
          <Sidebar />
        </div>
      </div>
    </div>
  );
};

export default ManageWorkOrderModal;