import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getWorkOrderInspectionsByWorkOrder } from '../../utils/workOrderInspectionsApi';
import type { WorkOrderInspection, InspectionChecklistItem } from '../../types/WorkOrderInspection';
import './InspectionDetailPage.scss';

const getStatusBadge = (status: 'GREEN' | 'YELLOW' | 'RED') => {
  const badgeClass = {
    'GREEN': 'status-badge status-green',
    'YELLOW': 'status-badge status-yellow',
    'RED': 'status-badge status-red',
  }[status];
  
  const statusText = {
    'GREEN': 'Good',
    'YELLOW': 'Needs Attention',
    'RED': 'Critical Issue',
  }[status];
  
  return <span className={badgeClass}>{statusText}</span>;
};

const InspectionDetailPage = () => {
  const { workOrderId } = useParams<{ workOrderId: string }>();
  const navigate = useNavigate();
  const [inspection, setInspection] = useState<WorkOrderInspection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!workOrderId) {
      setError('Work Order ID is required');
      setLoading(false);
      return;
    }

    setLoading(true);
    getWorkOrderInspectionsByWorkOrder(workOrderId)
      .then((response) => {
        const data = response.success ? response.data : response;
        if (Array.isArray(data) && data.length > 0) {
          setInspection(data[0]); // Get the first inspection
        } else {
          setError('No inspection found for this work order');
        }
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to fetch inspection details');
        setLoading(false);
      });
  }, [workOrderId]);

  const handleBack = () => {
    navigate('/servicecenter/inspection-records');
  };

  if (loading) {
    return (
      <div className="inspection-detail-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading inspection details...</p>
        </div>
      </div>
    );
  }

  if (error || !inspection) {
    return (
      <div className="inspection-detail-page">
        <div className="error-container">
          <div className="error-icon">
            <i className="bx bx-error-circle"></i>
          </div>
          <h3>Error Loading Inspection</h3>
          <p>{error}</p>
          <button className="retry-btn" onClick={handleBack}>
            <i className="bx bx-arrow-back"></i>
            Back to Records
          </button>
        </div>
      </div>
    );
  }

  const sortedChecklistItems = inspection.checklistItems?.sort((a, b) => {
    const aOrder = a.templateItem?.sortOrder || 0;
    const bOrder = b.templateItem?.sortOrder || 0;
    return aOrder - bOrder;
  }) || [];

  const itemsByCategory = sortedChecklistItems.reduce((acc, item) => {
    const category = item.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, InspectionChecklistItem[]>);

  return (
    <div className="inspection-detail-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Inspection Details</h1>
          <p className="page-subtitle">Work Order: {inspection.workOrderNumber}</p>
        </div>
        <button className="back-btn" onClick={handleBack}>
          <i className="bx bx-arrow-back"></i>
          Back to Records
        </button>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card-item">
          <div className="card-icon green">
            <i className="bx bx-check-circle"></i>
          </div>
          <div className="card-content">
            <div className="card-number">{sortedChecklistItems.filter(item => item.status === 'GREEN').length}</div>
            <div className="card-label">Items Passed</div>
          </div>
        </div>
        
        <div className="summary-card-item">
          <div className="card-icon yellow">
            <i className="bx bx-error-circle"></i>
          </div>
          <div className="card-content">
            <div className="card-number">{sortedChecklistItems.filter(item => item.status === 'YELLOW').length}</div>
            <div className="card-label">Need Attention</div>
          </div>
        </div>
        
        <div className="summary-card-item">
          <div className="card-icon red">
            <i className="bx bx-x-circle"></i>
          </div>
          <div className="card-content">
            <div className="card-number">{sortedChecklistItems.filter(item => item.status === 'RED').length}</div>
            <div className="card-label">Critical Issues</div>
          </div>
        </div>
        
        <div className="summary-card-item">
          <div className="card-icon follow-up">
            <i className="bx bx-alarm-exclamation"></i>
          </div>
          <div className="card-content">
            <div className="card-number">{sortedChecklistItems.filter(item => item.requiresFollowUp).length}</div>
            <div className="card-label">Follow-up Required</div>
          </div>
        </div>
      </div>

      {/* Inspector Profile Card */}
      <div className="inspector-profile-card">
        <div className="profile-header">
          <div className="profile-photo">
            {inspection.inspector?.userProfile?.profilePhoto ? (
              <img 
                src={inspection.inspector.userProfile.profilePhoto} 
                alt={inspection.inspector.userProfile.name || 'Inspector'} 
                className="profile-image"
              />
            ) : (
              <div className="profile-placeholder">
                <i className="bx bx-user"></i>
              </div>
            )}
          </div>
          <div className="profile-info">
            <h3 className="inspector-name">{inspection.inspector?.userProfile?.name || 'Unknown Inspector'}</h3>
            <p className="template-name">{inspection.template?.name || 'No Template'}</p>
            <div className="inspection-number">
              <span className="number-label">Inspection #</span>
              <span className="number-value">{inspection.id}</span>
            </div>
          </div>
        </div>
      </div>


      {/* Checklist Items */}
      <div className="checklist-section">
        <h2>Inspection Checklist</h2>
        
        {Object.entries(itemsByCategory).map(([category, items]) => (
          <div key={category} className="category-group">
            <h3 className="category-title">{category}</h3>
            <div className="checklist-items">
              {items.map((item) => (
                <div key={item.id} className="checklist-item">
                  <div className="item-header">
                    <div className="item-info">
                      <h4 className="item-name">{item.item}</h4>
                      {item.templateItem?.description && (
                        <p className="item-description">{item.templateItem.description}</p>
                      )}
                    </div>
                    <div className="item-status">
                      {getStatusBadge(item.status)}
                      {item.requiresFollowUp && (
                        <span className="follow-up-badge">
                          <i className="bx bx-exclamation-triangle"></i>
                          Follow-up Required
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Status Buttons */}
                  <div className="status-buttons">
                    <button 
                      className={`status-btn green ${item.status === 'GREEN' ? 'active' : ''}`}
                      onClick={() => {/* Handle status change */}}
                      title="Good"
                    >
                      <i className="bx bx-check-circle"></i>
                    </button>
                    <button 
                      className={`status-btn yellow ${item.status === 'YELLOW' ? 'active' : ''}`}
                      onClick={() => {/* Handle status change */}}
                      title="Needs Attention"
                    >
                      <i className="bx bx-error-circle"></i>
                    </button>
                    <button 
                      className={`status-btn red ${item.status === 'RED' ? 'active' : ''}`}
                      onClick={() => {/* Handle status change */}}
                      title="Critical Issue"
                    >
                      <i className="bx bx-x-circle"></i>
                    </button>
                  </div>

                  {item.notes && (
                    <div className="item-notes">
                      <label>Notes:</label>
                      <p>{item.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>


      {/* Attachments */}
      {inspection.attachments && inspection.attachments.length > 0 && (
        <div className="attachments-section">
          <h2>Attachments</h2>
          <div className="attachments-grid">
            {inspection.attachments.map((attachment) => (
              <div key={attachment.id} className="attachment-item">
                <div className="attachment-preview">
                  {attachment.fileType?.startsWith('image/') ? (
                    <img 
                      src={attachment.fileUrl} 
                      alt={attachment.description || attachment.fileName || 'Inspection attachment'} 
                      className="attachment-image"
                    />
                  ) : (
                    <div className="attachment-icon">
                      <i className="bx bx-file"></i>
                    </div>
                  )}
                </div>
                <div className="attachment-info">
                  <h4 className="attachment-name">
                    {attachment.fileName || 'Attachment'}
                  </h4>
                  {attachment.description && (
                    <p className="attachment-description">{attachment.description}</p>
                  )}
                  <div className="attachment-meta">
                    <span className="attachment-date">
                      {new Date(attachment.uploadedAt).toLocaleDateString()}
                    </span>
                    {attachment.fileSize && (
                      <span className="attachment-size">
                        {(attachment.fileSize / 1024).toFixed(1)} KB
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InspectionDetailPage;
