import React from 'react';
import './IncomingRequestPanel.scss';

interface Service {
  name: string;
}

interface PendingRequest {
  id: string;
  customer: string;
  phone: string;
  vehicle: string;
  requestedDate: string;
  requestedTime: string;
  services: string[];
  priority: 'normal' | 'urgent' | 'moderate';
  createdAt: string;
}

interface IncomingRequestPanelProps {
  requests: PendingRequest[];
  onApprove: (requestId: string) => void;
  onReschedule: (requestId: string) => void;
}

const IncomingRequestPanel: React.FC<IncomingRequestPanelProps> = ({
  requests,
  onApprove,
  onReschedule
}) => {
  const formatTime = (timeStr: string): string => {
    const time = new Date(`2000-01-01T${timeStr}`);
    return time.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: true 
    });
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="incoming-request-panel">
      <div className="panel-header">
        <h3>Pending Requests</h3>
        <span className="request-count">{requests.length}</span>
      </div>
      
      <div className="requests-list">
        {requests.map((request) => (
          <div key={request.id} className={`request-item priority-${request.priority}`}>
            <div className="request-header">
              <div className="customer-info">
                <span className="customer-name">{request.customer}</span>
                <span className="request-time">{request.createdAt}</span>
              </div>
              <div className={`priority-indicator ${request.priority}`}>
                {request.priority}
              </div>
            </div>
            
            <div className="request-details">
              <div className="detail-item">
                <span className="icon">🚗</span>
                <span className="text">{request.vehicle}</span>
              </div>
              <div className="detail-item">
                <span className="icon">📅</span>
                <span className="text">
                  {formatDate(request.requestedDate)} at {formatTime(request.requestedTime)}
                </span>
              </div>
              <div className="detail-item">
                <span className="icon">📞</span>
                <span className="text">{request.phone}</span>
              </div>
            </div>
            
            <div className="services-section">
              <div className="services-list">
                {request.services.map((service, idx) => (
                  <span key={idx} className="service-tag">{service}</span>
                ))}
              </div>
            </div>
            
            <div className="request-actions">
              <button 
                className="action-btn approve"
                onClick={() => onApprove(request.id)}
              >
                Approve
              </button>
              <button 
                className="action-btn reschedule"
                onClick={() => onReschedule(request.id)}
              >
                Reschedule
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="priority-legend">
        <h4>Priority Levels</h4>
        <div className="legend-items">
          <div className="legend-item">
            <div className="priority-dot urgent"></div>
            <span>Urgent</span>
          </div>
          <div className="legend-item">
            <div className="priority-dot moderate"></div>
            <span>Moderate</span>
          </div>
          <div className="legend-item">
            <div className="priority-dot normal"></div>
            <span>Normal</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomingRequestPanel;