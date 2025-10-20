import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../hooks/useAuth';
import type { WorkOrderApproval } from '../../types';
import ConfirmationDialog from '../../../ConfirmationDialog';

interface EstimateCardProps {
  estimate: WorkOrderApproval;
  onViewPdf: () => void;
  onFinalize?: () => void;
  onApprove?: () => void;
  isFinalizing: boolean;
  isApproving: boolean;
  getTypeBadge: (type: string) => React.ReactElement;
  getStatusBadge: (status: string) => React.ReactElement;
  getProfileName: (approvedBy: any) => string;
  getProfileImage: (approvedBy: any) => string | null;
  isProfileAvailable: (approvedBy: any) => boolean;
}

const EstimateCard: React.FC<EstimateCardProps> = ({
  estimate,
  onViewPdf,
  onFinalize,
  onApprove,
  isFinalizing,
  isApproving,
  getTypeBadge,
  getStatusBadge,
  getProfileName,
  getProfileImage,
  isProfileAvailable
}) => {
  return (
    <div 
      className="estimate-card" 
      style={{ 
        background: '#fff', 
        borderRadius: 12, 
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
        border: '1px solid #e5e7eb', 
        overflow: 'hidden',
        transition: 'all 0.2s ease'
      }}
      onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)'}
      onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'}
    >
      {/* Header with badges */}
      <div style={{ 
        padding: '16px 20px', 
        borderBottom: '1px solid #f3f4f6',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {getTypeBadge(estimate.type || 'ESTIMATE')}
        {getStatusBadge(estimate.status)}
      </div>

      {/* Content */}
      <div style={{ padding: '20px' }}>
        {/* Creator Info */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>
            Created By
          </div>
          {isProfileAvailable(estimate.approvedBy) ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {getProfileImage(estimate.approvedBy) ? (
                <img
                  src={getProfileImage(estimate.approvedBy)!}
                  alt={getProfileName(estimate.approvedBy)}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid #f3f4f6'
                  }}
                />
              ) : (
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: 14
                }}>
                  {getProfileName(estimate.approvedBy)?.[0] || '?'}
                </div>
              )}
              <div style={{ fontSize: 14, fontWeight: 600, color: '#1f2937' }}>
                {getProfileName(estimate.approvedBy)}
              </div>
            </div>
          ) : (
            <div style={{ fontSize: 13, color: '#9ca3af', fontStyle: 'italic' }}>
              Not available
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button 
            onClick={onViewPdf}
            style={{
              width: '100%',
              padding: '10px 16px',
              fontSize: 14,
              fontWeight: 500,
              borderRadius: 8,
              background: '#3b82f6',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#2563eb'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#3b82f6'}
          >
            <i className='bx bx-file-blank' style={{ fontSize: 18 }}></i>
            View PDF
          </button>

          {onApprove && (
            <button 
              onClick={onApprove}
              disabled={isApproving}
              style={{
                width: '100%',
                padding: '10px 16px',
                fontSize: 14,
                fontWeight: 500,
                borderRadius: 8,
                background: isApproving ? '#9ca3af' : '#10b981',
                border: 'none',
                color: '#fff',
                cursor: isApproving ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                opacity: isApproving ? 0.7 : 1
              }}
              onMouseEnter={(e) => {
                if (!isApproving) e.currentTarget.style.background = '#059669';
              }}
              onMouseLeave={(e) => {
                if (!isApproving) e.currentTarget.style.background = '#10b981';
              }}
            >
              {isApproving ? (
                <>
                  <i className='bx bx-loader-alt bx-spin' style={{ fontSize: 18 }}></i>
                  Approving...
                </>
              ) : (
                <>
                  <i className='bx bx-check-circle' style={{ fontSize: 18 }}></i>
                  Approve Estimate
                </>
              )}
            </button>
          )}

          {onFinalize && (
            <button 
              onClick={onFinalize}
              disabled={isFinalizing}
              style={{
                width: '100%',
                padding: '10px 16px',
                fontSize: 14,
                fontWeight: 500,
                borderRadius: 8,
                background: isFinalizing ? '#e5e7eb' : '#f8fafc',
                border: '1px solid #d1d5db',
                color: isFinalizing ? '#9ca3af' : '#374151',
                cursor: isFinalizing ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                opacity: isFinalizing ? 0.7 : 1
              }}
              onMouseEnter={(e) => {
                if (!isFinalizing) {
                  e.currentTarget.style.background = '#f3f4f6';
                  e.currentTarget.style.borderColor = '#9ca3af';
                }
              }}
              onMouseLeave={(e) => {
                if (!isFinalizing) {
                  e.currentTarget.style.background = '#f8fafc';
                  e.currentTarget.style.borderColor = '#d1d5db';
                }
              }}
            >
              {isFinalizing ? (
                <>
                  <i className='bx bx-loader-alt bx-spin' style={{ fontSize: 18 }}></i>
                  Finalizing...
                </>
              ) : (
                <>
                  <i className='bx bx-check-double' style={{ fontSize: 18 }}></i>
                  Finalize Estimate
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

interface EstimatesTabProps {
  workOrderId: string;
  isServiceAdvisor: boolean;
}

/**
 * EstimatesTab Component
 * Displays work order estimates/approvals with API integration
 */
const EstimatesTab: React.FC<EstimatesTabProps> = ({
  workOrderId,
  isServiceAdvisor
}) => {
  const { token } = useAuth();
  const [estimates, setEstimates] = useState<WorkOrderApproval[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [creatingEstimate, setCreatingEstimate] = useState(false);
  const [finalizing, setFinalizing] = useState<string | null>(null);

  // Approval confirmation state
  const [showApprovalConfirm, setShowApprovalConfirm] = useState(false);
  const [approvalToApprove, setApprovalToApprove] = useState<WorkOrderApproval | null>(null);
  const [isApproving, setIsApproving] = useState(false);

  // Function to fetch estimates (extracted for reuse)
  const fetchEstimates = async () => {
    if (!workOrderId || !token) {
      if (!token) {
        setError('Authentication required');
        setLoading(false);
      }
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/work-orders/${workOrderId}/approvals`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiRes = await response.json();
      let estimatesArr = Array.isArray(apiRes) ? apiRes : (Array.isArray(apiRes.data) ? apiRes.data : []);
      setEstimates(estimatesArr || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching estimates:', err);
      setError('Failed to fetch estimates');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEstimates();
  }, [workOrderId, token]);

  if (loading) return <div className="tab-content estimates-tab">Loading estimates...</div>;
  if (error) return <div className="tab-content estimates-tab" style={{ color: 'red' }}>{error}</div>;

  // Summary calculations
  const totalEstimates = estimates.length;
  const approvedEstimates = estimates.filter(e => e.status === 'APPROVED').length;
  const pendingEstimates = estimates.filter(e => e.status === 'PENDING').length;

  // Separate estimates and invoices
  const estimateItems = estimates.filter(e => e.type === 'ESTIMATE');
  const invoiceItems = estimates.filter(e => e.type === 'INVOICE');

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      'ESTIMATE': { bg: '#dbeafe', color: '#1e40af', text: 'Estimate' },
      'INVOICE': { bg: '#d1fae5', color: '#065f46', text: 'Invoice' }
    };
    const config = typeConfig[type as keyof typeof typeConfig] || { bg: '#f3f4f6', color: '#374151', text: type };
    return (
      <span style={{
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: '500',
        background: config.bg,
        color: config.color
      }}>
        {config.text}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'PENDING': { bg: '#fef3c7', color: '#92400e', text: 'Pending' },
      'APPROVED': { bg: '#d1fae5', color: '#065f46', text: 'Approved' },
      'REJECTED': { bg: '#fee2e2', color: '#991b1b', text: 'Rejected' },
      'EXPIRED': { bg: '#f3f4f6', color: '#374151', text: 'Expired' }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    return (
      <span style={{
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: '500',
        background: config.bg,
        color: config.color
      }}>
        {config.text}
      </span>
    );
  };

  // Helper functions for profile display
  const getProfileName = (approvedBy: any) => {
    if (!approvedBy) return 'N/A';
    return approvedBy.name || 'N/A';
  };

  const getProfileImage = (approvedBy: any) => {
    if (!approvedBy) return null;
    return approvedBy.profileImage || null;
  };

  const isProfileAvailable = (approvedBy: any) => {
    return approvedBy && approvedBy.name;
  };

  // Function to create a new estimate
  const handleCreateEstimate = async () => {
    if (!token || !workOrderId) return;

    setCreatingEstimate(true);
    try {
      const response = await fetch(`http://localhost:3000/work-orders/${workOrderId}/generate-estimate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
        // No body needed for generate-estimate endpoint
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Refresh the estimates list after successful creation
      await fetchEstimates();
    } catch (err) {
      console.error('Error creating estimate:', err);
      // Error is handled silently - could add error state if needed
    } finally {
      setCreatingEstimate(false);
    }
  };

  // Function to finalize an approved estimate (service advisor action)
  const handleFinalizeEstimate = async (approvalId: string) => {
    if (!token || !approvalId) return;

    setFinalizing(approvalId);
    try {
      const response = await fetch(`http://localhost:3000/work-orders/approvals/${approvalId}/finalize`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const txt = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${txt}`);
      }

      // Refresh the estimates list after finalization
      await fetchEstimates();
    } catch (err) {
      console.error('Error finalizing estimate:', err);
      setError('Failed to finalize estimate');
    } finally {
      setFinalizing(null);
    }
  };

  // Function to approve a pending estimate
  const handleApproveEstimate = async () => {
    if (!approvalToApprove || !token) return;

    setIsApproving(true);
    try {
      const response = await fetch(`http://localhost:3000/work-orders/approvals/${approvalToApprove.id}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          notes: 'Estimate approved manually'
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to approve estimate: ${response.statusText}`);
      }

      // Refresh the estimates list after approval
      await fetchEstimates();
    } catch (err) {
      console.error('Error approving estimate:', err);
      setError('Failed to approve estimate');
    } finally {
      setIsApproving(false);
      setShowApprovalConfirm(false);
      setApprovalToApprove(null);
    }
  };

  // Function to handle approval button click
  const handleApprovalClick = (estimate: WorkOrderApproval) => {
    setApprovalToApprove(estimate);
    setShowApprovalConfirm(true);
  };

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
              onClick={handleCreateEstimate}
              disabled={creatingEstimate}
            >
              <i className="bx bx-plus"></i>
              {creatingEstimate ? 'Creating...' : 'Create Estimate'}
            </button>
            <button className="btn btn--primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <i className="bx bx-file"></i>
              Export Report
            </button>
          </div>
        </div>
      </div>

      <div className="estimates-summary-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20, marginBottom: 24, width: '100%' }}>
        <div className="estimates-summary-card" style={{ background: '#f9fafb', borderRadius: 12, padding: '18px 24px', minWidth: 0, boxShadow: '0 1px 4px #0001', border: '1px solid #e5e7eb', width: '100%' }}>
          <div style={{ color: '#6b7280', fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Total Estimates</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#1f2937' }}>{totalEstimates}</div>
        </div>
        <div className="estimates-summary-card" style={{ background: '#f9fafb', borderRadius: 12, padding: '18px 24px', minWidth: 0, boxShadow: '0 1px 4px #0001', border: '1px solid #e5e7eb', width: '100%' }}>
          <div style={{ color: '#6b7280', fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Approved</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#1f2937' }}>{approvedEstimates}</div>
        </div>
        <div className="estimates-summary-card" style={{ background: '#f9fafb', borderRadius: 12, padding: '18px 24px', minWidth: 0, boxShadow: '0 1px 4px #0001', border: '1px solid #e5e7eb', width: '100%' }}>
          <div style={{ color: '#6b7280', fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Pending</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#1f2937' }}>{pendingEstimates}</div>
        </div>
      </div>

      {estimates.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6b7280' }}>
          <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 16 }}>No estimates or invoices found for this work order.</div>
          <div style={{ fontSize: 48, color: '#d1d5db' }}>
            <i className="bx bx-calculator"></i>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* Estimates Cards */}
          {estimateItems.length > 0 && (
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
                Estimates
              </h3>
              <div className="estimates-cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
                {estimateItems.map((estimate) => (
                  <EstimateCard
                    key={estimate.id}
                    estimate={estimate}
                    onViewPdf={() => estimate.pdfUrl && window.open(estimate.pdfUrl, '_blank')}
                    onApprove={estimate.status === 'PENDING' ? () => handleApprovalClick(estimate) : undefined}
                    onFinalize={isServiceAdvisor && estimate.status === 'APPROVED' && estimate.isFinal === false && estimate.type === 'ESTIMATE' ? () => handleFinalizeEstimate(estimate.id) : undefined}
                    isApproving={isApproving}
                    isFinalizing={finalizing === estimate.id}
                    getTypeBadge={getTypeBadge}
                    getStatusBadge={getStatusBadge}
                    getProfileName={getProfileName}
                    getProfileImage={getProfileImage}
                    isProfileAvailable={isProfileAvailable}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Invoices Table */}
          {invoiceItems.length > 0 && (
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
                Invoices
              </h3>
              <div className="invoices-table-container full-width-table">
                <table className="invoices-table styled-table" style={{ width: '100%', minWidth: 400, fontSize: 13, borderCollapse: 'collapse', border: '1px solid #e5e7eb', background: '#fff' }}>
                  <thead>
                    <tr style={{ background: '#f9fafb' }}>
                      <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>Type</th>
                      <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>Created By</th>
                      <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceItems.map((invoice) => {
                      return (
                        <tr key={invoice.id}>
                          <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb', textAlign: 'center', verticalAlign: 'middle' }}>
                            {getTypeBadge(invoice.type || 'INVOICE')}
                          </td>
                          <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                              {isProfileAvailable(invoice.approvedBy) ? (
                                <>
                                  {getProfileImage(invoice.approvedBy) ? (
                                    <img
                                      src={getProfileImage(invoice.approvedBy)}
                                      alt={getProfileName(invoice.approvedBy)}
                                      style={{
                                        width: 26,
                                        height: 26,
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        border: '1px solid #e5e7eb'
                                      }}
                                    />
                                  ) : (
                                    <div style={{
                                      width: 26,
                                      height: 26,
                                      borderRadius: '50%',
                                      background: '#f3f4f6',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      color: '#6b7280',
                                      fontWeight: 600,
                                      fontSize: 13
                                    }}>
                                      {getProfileName(invoice.approvedBy)?.[0] || '?'}
                                    </div>
                                  )}
                                  <span style={{ fontWeight: 500 }}>{getProfileName(invoice.approvedBy)}</span>
                                </>
                              ) : (
                                <span style={{
                                  fontWeight: 500,
                                  color: '#6b7280',
                                  fontStyle: 'italic'
                                }}>
                                  N/A
                                </span>
                              )}
                            </div>
                          </td>
                          <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb', textAlign: 'center', verticalAlign: 'middle' }}>
                            <button
                              className="pdf-btn"
                              title="View PDF"
                              onClick={() => invoice.pdfUrl && window.open(invoice.pdfUrl, '_blank')}
                              style={{ background: '#dc2626', color: '#fff', border: 'none', borderRadius: 6, padding: '6px', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', transition: 'all 0.2s ease', margin: '0 auto' }}
                            >
                              <i className="bx bx-file"></i>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Approval Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showApprovalConfirm}
        message="Are you sure you want to approve this estimate? This action cannot be undone."
        onConfirm={handleApproveEstimate}
        onCancel={() => {
          setShowApprovalConfirm(false);
          setApprovalToApprove(null);
        }}
      />
    </div>
  );
};

export default EstimatesTab;