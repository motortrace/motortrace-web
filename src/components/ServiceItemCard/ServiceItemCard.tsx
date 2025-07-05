import React from 'react';
import { Clock, User, Car, FileText } from 'lucide-react';
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

// Helper for pastel border color
const getTypePastelBorder = (type: ServiceItem['type']) => {
  switch (type) {
    case 'service': return '#dbeafe'; // blue-100
    case 'inspection': return '#d1fae5'; // green-100
    case 'appointment': return '#ede9fe'; // purple-100
    default: return '#f3f4f6';
  }
};

// Helper for lighter priority badge background
const getPriorityPastel = (priority: ServiceItem['priority']) => {
  switch (priority) {
    case 'high': return '#fee2e2'; // light red
    case 'medium': return '#fef9c3'; // light yellow
    case 'low': return '#d1fae5'; // light green
    default: return '#f3f4f6';
  }
};

// Helper for strong/dark text color for badge
const getPriorityTextColor = (priority: ServiceItem['priority']) => {
  switch (priority) {
    case 'high': return '#b91c1c'; // dark red
    case 'medium': return '#b45309'; // dark yellow
    case 'low': return '#047857'; // dark green
    default: return '#334155';
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
      className="technician-avatar"
      style={{ backgroundColor: colors[colorIndex], color: 'white' }}
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

  return (
    <div 
      className="service-item-card"
      draggable
      onDragStart={handleDragStart}
      style={{ borderColor: getTypePastelBorder(serviceItem.type) }}
    >
      {/* Card Header */}
      <div className="card-header">
        <div className="type-icon" style={{ color: getTypeColor(serviceItem.type) }}>
          {getTypeIcon(serviceItem.type)}
        </div>
        <div className="priority-badge" style={{ backgroundColor: getPriorityPastel(serviceItem.priority), color: getPriorityTextColor(serviceItem.priority) }}>
          {serviceItem.priority.toUpperCase()}
        </div>
      </div>

      {/* Card Title */}
      <div className="card-title">
        {serviceItem.title}
      </div>

      {/* Card Details */}
      <div className="card-details">
        <div className="detail-row">
          <Clock size={14} />
          <span>{formatDuration(serviceItem.estimatedDuration)}</span>
          <span className="separator">•</span>
          {getTechnicianAvatar(serviceItem.assignedTechnician, serviceItem.technicianPhoto)}
          <span>{serviceItem.assignedTechnician}</span>
        </div>
        
        <div className="detail-row">
          <Car size={14} />
          <span>{serviceItem.vehicle}</span>
        </div>
        
        <div className="detail-row">
          <FileText size={14} />
          <span>{serviceItem.workOrderNumber}</span>
        </div>
      </div>
    </div>
  );
};

export default ServiceItemCard; 