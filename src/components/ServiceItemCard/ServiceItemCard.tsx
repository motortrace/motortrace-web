import React from 'react';
import { Clock, User, Car } from 'lucide-react';
import './ServiceItemCard.scss';
import { type WorkOrder } from '../../utils/workOrdersApi';

interface ServiceItemCardProps {
  serviceItem: WorkOrder;
  onMove: (cardId: string, newStatus: WorkOrder['status']) => void;
  getTypeIcon: () => React.ReactNode;
  getTypeColor: () => string;
  getPriorityColor: (priority: WorkOrder['priority']) => string;
  onClick?: () => void;
}

const getPriorityIndicator = (priority: WorkOrder['priority']) => {
  switch (priority) {
    case 'HIGH':
      return {
        color: '#dc2626',
        backgroundColor: '#fef2f2',
        borderColor: '#fecaca'
      };
    case 'MEDIUM':
      return {
        color: '#d97706',
        backgroundColor: '#fffbeb',
        borderColor: '#fed7aa'
      };
    case 'LOW':
      return {
        color: '#059669',
        backgroundColor: '#f0fdf4',
        borderColor: '#bbf7d0'
      };
    case 'NORMAL':
      return {
        color: '#64748b',
        backgroundColor: '#f8fafc',
        borderColor: '#e2e8f0'
      };
    default:
      return {
        color: '#64748b',
        backgroundColor: '#f8fafc',
        borderColor: '#e2e8f0'
      };
  }
};

const getVehicleImage = (vehicle: WorkOrder['vehicle']) => {
  if (vehicle?.imageUrl) {
    return vehicle.imageUrl;
  }
  return 'https://cdn.pixabay.com/photo/2012/05/29/00/43/car-49278_1280.jpg';
};

const ServiceItemCard: React.FC<ServiceItemCardProps> = ({
  serviceItem,
  onMove,
  getTypeIcon,
  getTypeColor,
  getPriorityColor,
  onClick
}) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', serviceItem.id);
  };

  const priorityIndicator = getPriorityIndicator(serviceItem.priority);

  return (
    <div
      className="service-item-card"
      draggable
      onDragStart={handleDragStart}
      onClick={onClick} // Add this line
    >
      {/* Status indicator bar (optional, can be colored by status) */}
      <div
        className="status-indicator"
        style={{ backgroundColor: getPriorityColor(serviceItem.priority) }}
      />

      {/* Vehicle Image */}
      <div className="vehicle-image-wrapper">
        <img
          src={getVehicleImage(serviceItem.vehicle)}
          alt={serviceItem.vehicle ? `${serviceItem.vehicle.year} ${serviceItem.vehicle.make} ${serviceItem.vehicle.model}` : 'Vehicle'}
          className="vehicle-image"
        />
      </div>

      {/* Card Header */}
      <div className="card-header">
        <div className="header-left">
          <span className="work-order-number">#{serviceItem.workOrderNumber}</span>
        </div>
      </div>

      {/* Card Title (Customer + Vehicle) */}
      <div className="card-title">
        {serviceItem.customer ? `${serviceItem.customer.firstName} ${serviceItem.customer.lastName}` : 'Unknown Customer'} - {serviceItem.vehicle ? `${serviceItem.vehicle.year} ${serviceItem.vehicle.make} ${serviceItem.vehicle.model}` : 'Unknown Vehicle'}
      </div>

      {/* Card Content */}
      <div className="card-content">
        <div className="content-row">
          <div className="content-item">
            <User size={14} />
            <span className="content-label">Customer</span>
            <span className="content-value">{serviceItem.customer ? `${serviceItem.customer.firstName} ${serviceItem.customer.lastName}` : 'Unknown'}</span>
          </div>
        </div>
        <div className="content-row">
          <div className="content-item">
            <Car size={14} />
            <span className="content-label">Vehicle</span>
            <span className="content-value">{serviceItem.vehicle ? `${serviceItem.vehicle.year} ${serviceItem.vehicle.make} ${serviceItem.vehicle.model}` : 'Unknown'}</span>
          </div>
        </div>
        {serviceItem.complaint && (
          <div className="content-row">
            <div className="content-item">
              <Clock size={14} />
              <span className="content-label">Issue</span>
              <span className="content-value">{serviceItem.complaint}</span>
            </div>
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="card-footer">
        <div className="technician-info">
          <div className="technician-avatar technician-avatar--initials" style={{ backgroundColor: '#3b82f6' }}>
            {serviceItem.serviceAdvisor?.userProfile ? 
              `${serviceItem.serviceAdvisor.userProfile.firstName[0]}${serviceItem.serviceAdvisor.userProfile.lastName[0]}`.toUpperCase() :
              'SA'
            }
          </div>
          <div className="technician-details">
            <span className="technician-name">
              {serviceItem.serviceAdvisor?.userProfile ? 
                `${serviceItem.serviceAdvisor.userProfile.firstName} ${serviceItem.serviceAdvisor.userProfile.lastName}` : 
                'Unassigned'
              }
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceItemCard;