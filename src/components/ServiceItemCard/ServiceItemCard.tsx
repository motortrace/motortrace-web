import React from 'react';
import { Clock, User, Car, FileText, AlertCircle, CheckCircle2, Circle } from 'lucide-react';
import './ServiceItemCard.scss';

interface ServiceItem {
  id: string;
  type: 'service' | 'inspection' | 'appointment';
  title: string;
  workOrderId: string;
  workOrderNumber: string;
  customer: string;
  vehicle: string;
  estimatedDuration: number;
  assignedTechnician: string;
  technicianPhoto?: string;
  priority: 'high' | 'medium' | 'low';
  status: 'created' | 'to-do' | 'in-progress' | 'done' | 'not-done';
  description?: string;
  notes?: string;
}

interface ServiceItemCardProps {
  serviceItem: ServiceItem;
  onMove: (cardId: string, newStatus: ServiceItem['status']) => void;
  getTypeIcon: (type: ServiceItem['type']) => React.ReactNode;
  getTypeColor: (type: ServiceItem['type']) => string;
  getPriorityColor: (priority: ServiceItem['priority']) => string;
}

// Helper for type badge colors
const getTypeBadgeStyle = (type: ServiceItem['type']) => {
  switch (type) {
    case 'service': 
      return { backgroundColor: '#eff6ff', color: '#1d4ed8', borderColor: '#dbeafe' };
    case 'inspection': 
      return { backgroundColor: '#f0fdf4', color: '#15803d', borderColor: '#d1fae5' };
    case 'appointment': 
      return { backgroundColor: '#faf5ff', color: '#7c3aed', borderColor: '#ede9fe' };
    default: 
      return { backgroundColor: '#f8fafc', color: '#475569', borderColor: '#e2e8f0' };
  }
};

// Helper for priority indicators
const getPriorityIndicator = (priority: ServiceItem['priority']) => {
  switch (priority) {
    case 'high': 
      return { 
        icon: <AlertCircle size={12} />, 
        color: '#dc2626',
        backgroundColor: '#fef2f2',
        borderColor: '#fecaca'
      };
    case 'medium': 
      return { 
        icon: <Circle size={12} />, 
        color: '#d97706',
        backgroundColor: '#fffbeb',
        borderColor: '#fed7aa'
      };
    case 'low': 
      return { 
        icon: <CheckCircle2 size={12} />, 
        color: '#059669',
        backgroundColor: '#f0fdf4',
        borderColor: '#bbf7d0'
      };
    default: 
      return { 
        icon: <Circle size={12} />, 
        color: '#64748b',
        backgroundColor: '#f8fafc',
        borderColor: '#e2e8f0'
      };
  }
};

// Helper for status indicator
const getStatusIndicator = (status: ServiceItem['status']) => {
  switch (status) {
    case 'done': return { color: '#059669', label: 'Completed' };
    case 'in-progress': return { color: '#dc2626', label: 'In Progress' };
    case 'to-do': return { color: '#d97706', label: 'Pending' };
    case 'created': return { color: '#64748b', label: 'Created' };
    case 'not-done': return { color: '#6b7280', label: 'Not Done' };
    default: return { color: '#64748b', label: 'Unknown' };
  }
};

const getTechnicianAvatar = (name: string, photo?: string) => {
  if (photo) {
    return <img className="technician-avatar" src={photo} alt={name} />;
  }
  // fallback to initials
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
  const colorIndex = name.length % colors.length;
  return (
    <div 
      className="technician-avatar technician-avatar--initials"
      style={{ backgroundColor: colors[colorIndex] }}
    >
      {initials}
    </div>
  );
};

const ServiceItemCard: React.FC<ServiceItemCardProps> = ({
  serviceItem,
  onMove,
  getTypeIcon,
  getTypeColor,
  getPriorityColor
}) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', serviceItem.id);
  };

  const formatDuration = (hours: number) => {
    if (hours < 1) {
      return `${Math.round(hours * 60)}m`;
    }
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return minutes > 0 ? `${wholeHours}h ${minutes}m` : `${wholeHours}h`;
  };

  const typeBadgeStyle = getTypeBadgeStyle(serviceItem.type);
  const priorityIndicator = getPriorityIndicator(serviceItem.priority);
  const statusIndicator = getStatusIndicator(serviceItem.status);

  return (
    <div 
      className="service-item-card"
      draggable
      onDragStart={handleDragStart}
    >
      {/* Status indicator bar */}
      <div 
        className="status-indicator"
        style={{ backgroundColor: statusIndicator.color }}
      />

      {/* Card Header */}
      <div className="card-header">
        <div className="header-left">
          <div 
            className="type-badge"
            style={typeBadgeStyle}
          >
            <span className="type-icon">
              {getTypeIcon(serviceItem.type)}
            </span>
            <span className="type-label">
              {serviceItem.type.charAt(0).toUpperCase() + serviceItem.type.slice(1)}
            </span>
          </div>
          <span className="work-order-number">#{serviceItem.workOrderNumber}</span>
        </div>
        

      </div>

      {/* Card Title */}
      <div className="card-title">
        {serviceItem.title}
      </div>

      {/* Card Content */}
      <div className="card-content">
        <div className="content-row">
          <div className="content-item">
            <User size={14} />
            <span className="content-label">Customer</span>
            <span className="content-value">{serviceItem.customer}</span>
          </div>
        </div>
        
        <div className="content-row">
          <div className="content-item">
            <Car size={14} />
            <span className="content-label">Vehicle</span>
            <span className="content-value">{serviceItem.vehicle}</span>
          </div>
        </div>
        
        <div className="content-row">
          <div className="content-item">
            <Clock size={14} />
            <span className="content-label">Duration</span>
            <span className="content-value">{formatDuration(serviceItem.estimatedDuration)}</span>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="card-footer">
        <div className="technician-info">
          {getTechnicianAvatar(serviceItem.assignedTechnician, serviceItem.technicianPhoto)}
          <div className="technician-details">
            <span className="technician-name">{serviceItem.assignedTechnician}</span>
          </div>
        </div>
        
        {/* <div className="status-badge" style={{ color: statusIndicator.color }}>
          {statusIndicator.label}
        </div> */}
      </div>
    </div>
  );
};

export default ServiceItemCard;