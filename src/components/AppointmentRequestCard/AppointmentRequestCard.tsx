import React from 'react';

// Mock data for demonstration
const mockRequest = {
  id: "REQ-2024-001",
  customer: "John Smith",
  phone: "+1 (555) 123-4567",
  vehicle: "2020 Honda Civic",
  licensePlate: "ABC-123",
  services: ["Oil Change", "Brake Inspection", "Tire Rotation"],
  requestedTime: "Dec 15, 2:00 PM",
  priority: "moderate",
  estimatedCost: 149.99
};

// Simple SVG icons
const ViewIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const AcceptIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 6L9 17l-5-5"/>
  </svg>
);

const AppointmentRequestCard = () => {
  // Type for priority
  type Priority = 'urgent' | 'moderate' | 'normal';

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'urgent':
        return '#fef2f2';
      case 'moderate':
        return '#fffbeb';
      default:
        return '#f0fdf4';
    }
  };

  const getPriorityTextColor = (priority: Priority) => {
    switch (priority) {
      case 'urgent':
        return '#dc2626';
      case 'moderate':
        return '#d97706';
      default:
        return '#16a34a';
    }
  };

  const getPriorityLabel = (priority: Priority) => {
    switch (priority) {
      case 'urgent':
        return 'Urgent';
      case 'moderate':
        return 'Moderate';
      default:
        return 'Normal';
    }
  };

  const cardStyle = {
    width: '300px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.2s ease',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    overflow: 'hidden'
  };

  const cardHoverStyle = {
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    transform: 'translateY(-2px)'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    borderBottom: '1px solid #f1f5f9',
    backgroundColor: '#fafafa'
  };

  const requestIdStyle = {
    fontSize: '11px',
    fontWeight: '600',
    color: '#6b7280',
    backgroundColor: '#f3f4f6',
    padding: '2px 6px',
    borderRadius: '4px'
  };

  const priorityBadgeStyle: React.CSSProperties = {
    fontSize: '10px',
    fontWeight: 600,
    padding: '2px 8px',
    borderRadius: '12px',
    textTransform: 'uppercase' as const,
    backgroundColor: getPriorityColor(mockRequest.priority as Priority),
    color: getPriorityTextColor(mockRequest.priority as Priority),
    border: `1px solid ${getPriorityTextColor(mockRequest.priority as Priority)}20`
  };

  const contentStyle = {
    padding: '16px'
  };

  const customerInfoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '12px'
  };

  const avatarStyle = {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    fontSize: '14px'
  };

  const customerNameStyle = {
    margin: '0 0 2px 0',
    fontSize: '14px',
    fontWeight: '600',
    color: '#111827'
  };

  const customerPhoneStyle = {
    margin: '0',
    fontSize: '11px',
    color: '#6b7280'
  };

  const vehicleStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 10px',
    backgroundColor: '#f8fafc',
    borderRadius: '6px',
    marginBottom: '12px',
    border: '1px solid #e2e8f0'
  };

  const vehicleTextStyle = {
    fontSize: '12px',
    fontWeight: '600',
    color: '#374151'
  };

  const licensePlateStyle = {
    fontSize: '11px',
    fontFamily: 'monospace',
    fontWeight: '600',
    color: '#6b7280',
    backgroundColor: '#ffffff',
    padding: '2px 6px',
    borderRadius: '4px',
    border: '1px solid #d1d5db'
  };

  const servicesStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '4px',
    marginBottom: '12px'
  };

  const serviceTagStyle = {
    backgroundColor: '#dbeafe',
    color: '#1e40af',
    padding: '2px 6px',
    borderRadius: '8px',
    fontSize: '10px',
    fontWeight: '500'
  };

  const detailsStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
    fontSize: '12px'
  };

  const timeStyle = {
    color: '#6b7280',
    fontWeight: '500'
  };

  const costStyle = {
    color: '#059669',
    fontWeight: '700',
    fontSize: '13px'
  };

  const actionsStyle = {
    display: 'flex',
    gap: '6px',
    justifyContent: 'flex-end'
  };

  const buttonBaseStyle = {
    width: '32px',
    height: '32px',
    border: 'none',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  };

  const viewButtonStyle = {
    ...buttonBaseStyle,
    backgroundColor: '#f3f4f6',
    color: '#6b7280'
  };

  const acceptButtonStyle = {
    ...buttonBaseStyle,
    backgroundColor: '#059669',
    color: 'white'
  };

  const [isHovered, setIsHovered] = React.useState(false);

  // Helper for button hover
  const handleViewButtonMouseOver = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = '#e5e7eb';
    e.currentTarget.style.color = '#374151';
  };
  const handleViewButtonMouseOut = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = '#f3f4f6';
    e.currentTarget.style.color = '#6b7280';
  };
  const handleAcceptButtonMouseOver = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = '#047857';
    e.currentTarget.style.transform = 'translateY(-1px)';
  };
  const handleAcceptButtonMouseOut = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = '#059669';
    e.currentTarget.style.transform = 'translateY(0)';
  };

  return (
    <div 
      style={{...cardStyle, ...(isHovered ? cardHoverStyle : {})}}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={headerStyle}>
        <span style={requestIdStyle}>{mockRequest.id}</span>
        <span style={priorityBadgeStyle}>
          {getPriorityLabel(mockRequest.priority as Priority)}
        </span>
      </div>

      <div style={contentStyle}>
        <div style={customerInfoStyle}>
          <div style={avatarStyle}>
            {mockRequest.customer.charAt(0).toUpperCase()}
          </div>
          <div style={{flex: 1}}>
            <h4 style={customerNameStyle}>{mockRequest.customer}</h4>
            <p style={customerPhoneStyle}>{mockRequest.phone}</p>
          </div>
        </div>

        <div style={vehicleStyle}>
          <span style={vehicleTextStyle}>{mockRequest.vehicle}</span>
          <span style={licensePlateStyle}>{mockRequest.licensePlate}</span>
        </div>

        <div style={servicesStyle}>
          {mockRequest.services.slice(0, 2).map((service, index) => (
            <span key={index} style={serviceTagStyle}>
              {service}
            </span>
          ))}
          {mockRequest.services.length > 2 && (
            <span style={{...serviceTagStyle, backgroundColor: '#f3f4f6', color: '#6b7280'}}>
              +{mockRequest.services.length - 2}
            </span>
          )}
        </div>

        <div style={detailsStyle}>
          <span style={timeStyle}>{mockRequest.requestedTime}</span>
          <span style={costStyle}>
            Rs. {mockRequest.estimatedCost?.toFixed(2)}
          </span>
        </div>

        <div style={actionsStyle}>
          <button 
            style={viewButtonStyle}
            onMouseOver={handleViewButtonMouseOver}
            onMouseOut={handleViewButtonMouseOut}
            title="View Details"
          >
            <i className="bx bx-show" style={{fontSize: '20px'}}></i>
          </button>
          <button 
            style={acceptButtonStyle}
            onMouseOver={handleAcceptButtonMouseOver}
            onMouseOut={handleAcceptButtonMouseOut}
            title="Accept Request"
          >
            <i className="bx bx-check" style={{fontSize: '20px'}}></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentRequestCard;