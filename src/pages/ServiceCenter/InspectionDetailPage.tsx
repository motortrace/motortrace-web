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
        <button className="back-btn" onClick={handleBack}>
          <i className="bx bx-arrow-back"></i>
          Back to Records
        </button>
        <div className="header-content">
          <h1 className="page-title">Inspection Details</h1>
          <p className="page-subtitle">Work Order: {inspection.workOrderNumber}</p>
        </div>
      </div>

      {/* Inspection Overview */}
      <div className="inspection-overview">
        <div className="overview-card">
          <div className="card-header">
            <h3>Inspection Overview</h3>
            <div className={`status-indicator ${inspection.isCompleted ? 'completed' : 'in-progress'}`}>
              {inspection.isCompleted ? 'Completed' : 'In Progress'}
            </div>
          </div>
          <div className="overview-grid">
            <div className="overview-item">
              <label>Template</label>
              <span>{inspection.template?.name || 'No Template'}</span>
            </div>
            <div className="overview-item">
              <label>Inspector</label>
              <span>{inspection.inspector?.userProfile?.name || 'Unknown'}</span>
            </div>
            <div className="overview-item">
              <label>Date</label>
              <span>{new Date(inspection.date).toLocaleDateString()}</span>
            </div>
            <div className="overview-item">
              <label>Items Checked</label>
              <span>{inspection.checklistItems?.length || 0}</span>
            </div>
          </div>
          {inspection.notes && (
            <div className="inspection-notes">
              <label>Notes</label>
              <p>{inspection.notes}</p>
            </div>
          )}
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

      {/* Summary */}
      <div className="inspection-summary">
        <div className="summary-card">
          <h3>Inspection Summary</h3>
          <div className="summary-stats">
            <div className="stat-item">
              <span className="stat-number green">{sortedChecklistItems.filter(item => item.status === 'GREEN').length}</span>
              <span className="stat-label">Good</span>
            </div>
            <div className="stat-item">
              <span className="stat-number yellow">{sortedChecklistItems.filter(item => item.status === 'YELLOW').length}</span>
              <span className="stat-label">Needs Attention</span>
            </div>
            <div className="stat-item">
              <span className="stat-number red">{sortedChecklistItems.filter(item => item.status === 'RED').length}</span>
              <span className="stat-label">Critical Issues</span>
            </div>
            <div className="stat-item">
              <span className="stat-number follow-up">{sortedChecklistItems.filter(item => item.requiresFollowUp).length}</span>
              <span className="stat-label">Follow-up Required</span>
            </div>
          </div>
        </div>
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
