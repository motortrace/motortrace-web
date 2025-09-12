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
            <button className="btn btn--secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <i className="bx bx-plus"></i>
              Add Canned Service
            </button>
            <button className="btn btn--secondary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <i className="bx bx-wrench"></i>
              Add Labor
            </button>
            <button className="btn btn--primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
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
        <div>No estimates found for this work order.</div>
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

  // Summary calculations for services
  const totalServiceCount = services.length;
  const totalServiceQty = services.reduce((sum, s) => sum + (s.quantity || 0), 0);
  const totalServiceCost = services.reduce((sum, s) => sum + (s.subtotal || 0), 0);
  // const totalUnitPrice = services.reduce((sum, s) => sum + (s.unitPrice || 0), 0);
  // If you want to add more metrics, add here

  return (
    <div className="tab-content services-tab">
      <div className="services-summary-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20, marginBottom: 24, width: '100%' }}>
        <div className="services-summary-card" style={{ background: '#f9fafb', borderRadius: 12, padding: '18px 24px', minWidth: 0, boxShadow: '0 1px 4px #0001', border: '1px solid #e5e7eb', width: '100%' }}>
          <div style={{ color: '#6b7280', fontWeight: 600, fontSize: 15, marginBottom: 4 }}># Services</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#1f2937' }}>{totalServiceCount}</div>
        </div>
        <div className="services-summary-card" style={{ background: '#f9fafb', borderRadius: 12, padding: '18px 24px', minWidth: 0, boxShadow: '0 1px 4px #0001', border: '1px solid #e5e7eb', width: '100%' }}>
          <div style={{ color: '#6b7280', fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Total Qty</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#1f2937' }}>{totalServiceQty}</div>
        </div>
        {/* <div className="services-summary-card" style={{ background: '#f9fafb', borderRadius: 12, padding: '18px 24px', minWidth: 0, boxShadow: '0 1px 4px #0001', border: '1px solid #e5e7eb', width: '100%' }}>
          <div style={{ color: '#6b7280', fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Total Unit Price</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#1f2937' }}>LKR {Number(totalUnitPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: true }).replace(/^0+(?=\d)/, '')}</div>
        </div> */}
        <div className="services-summary-card" style={{ background: '#f9fafb', borderRadius: 12, padding: '18px 24px', minWidth: 0, boxShadow: '0 1px 4px #0001', border: '1px solid #e5e7eb', width: '100%' }}>
          <div style={{ color: '#6b7280', fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Total Cost</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#1f2937' }}>LKR {Number(totalServiceCost).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: true }).replace(/^0+(?=\d)/, '')}</div>
        </div>
      </div>
      <div className="tab-header">
        <h3>Services</h3>
      </div>
      <div className="services-table-container" style={{ overflowX: 'auto', padding: 0 }}>
        <table className="services-table styled-table" style={{ width: '100%', minWidth: 700, fontSize: 13, borderCollapse: 'collapse', border: '1px solid #e5e7eb', background: '#fff' }}>
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>Service Name</th>
              <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>Description</th>
              <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>Unit Price</th>
              <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>Quantity</th>
              <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>Subtotal</th>
              <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}></th>
            </tr>
          </thead>
          <tbody>
            {services.map(service => (
              <tr key={service.id}>
                <td style={{ padding: '6px 10px', maxWidth: 120, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', border: '1px solid #e5e7eb' }}>{service.cannedService?.name || '-'}</td>
                <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>{service.description || service.cannedService?.description || '-'}</td>
                <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>LKR {Number(service.unitPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>{service.quantity}</td>
                <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb', fontWeight: 600, color: '#2563eb' }}>LKR {Number(service.subtotal).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>
                  <button style={{ background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', fontSize: 13, cursor: 'pointer', fontWeight: 500, boxShadow: '0 1px 2px #0001' }}>View</button>
                </td>
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
  if (!inspections || inspections.length === 0) return <div className="tab-content inspections-tab">No inspections found.</div>;

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
        return <OverviewTab workOrder={workOrder} />;
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
          <button className="close-btn" onClick={onClose} title="Close">
            <i className="bx bx-x"></i>
          </button>
        </div>

        {/* Tab Navigation */}
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Modal Body */}
        <div className="modal-body">
          {/* Main Content Area */}
          <div className="main-content" style={{ overflowY: 'auto', maxHeight: 'calc(95vh - 120px)' }}>
            {renderTabContent()}
          </div>

          {/* Sidebar */}
          {/* <Sidebar /> */}
        </div>
      </div>
    </div>
  );
};

export default ManageWorkOrderModal;