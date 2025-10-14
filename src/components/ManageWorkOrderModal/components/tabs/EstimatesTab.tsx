import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../hooks/useAuth';
import type { WorkOrderApproval } from '../../types';

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

  const getUnavailableBadge = (text: string = 'Not Available') => (
    <span style={{
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: '500',
      background: '#f3f4f6',
      color: '#6b7280'
    }}>
      {text}
    </span>
  );

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
          <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 16 }}>No estimates found for this work order.</div>
          <div style={{ fontSize: 48, color: '#d1d5db' }}>
            <i className="bx bx-calculator"></i>
          </div>
        </div>
      ) : (
      <div className="estimates-table-container full-width-table">
        <table className="estimates-table styled-table" style={{ width: '100%', minWidth: 600, fontSize: 13, borderCollapse: 'collapse', border: '1px solid #e5e7eb', background: '#fff' }}>
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>Approved At</th>
              <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>Method</th>
              <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>Created By</th>
              <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>Status</th>
              <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {estimates.map((estimate) => {
              return (
                <tr key={estimate.id}>
                  <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb', textAlign: 'center', verticalAlign: 'middle' }}>
                    {estimate.approvedAt ? new Date(estimate.approvedAt).toLocaleDateString() : getUnavailableBadge('Not Approved')}
                  </td>
                  <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb', textAlign: 'center', verticalAlign: 'middle' }}>
                    {estimate.method ? estimate.method : getUnavailableBadge('No Method')}
                  </td>
                  <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      {isProfileAvailable(estimate.approvedBy) ? (
                        <>
                          {getProfileImage(estimate.approvedBy) ? (
                            <img
                              src={getProfileImage(estimate.approvedBy)}
                              alt={getProfileName(estimate.approvedBy)}
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
                              {getProfileName(estimate.approvedBy)?.[0] || '?'}
                            </div>
                          )}
                          <span style={{ fontWeight: 500 }}>{getProfileName(estimate.approvedBy)}</span>
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
                    {getStatusBadge(estimate.status)}
                  </td>
                  <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb', textAlign: 'center', verticalAlign: 'middle' }}>
                    <button
                      className="pdf-btn"
                      title="View PDF"
                      onClick={() => estimate.pdfUrl && window.open(estimate.pdfUrl, '_blank')}
                      style={{ background: '#dc2626', color: '#fff', border: 'none', borderRadius: 6, padding: '6px', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', transition: 'all 0.2s ease' }}
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
      )}
    </div>
  );
};

export default EstimatesTab;