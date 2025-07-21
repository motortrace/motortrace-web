import React from 'react';
import { Clock, User, Car } from 'lucide-react';
import './ServiceItemCard.scss';

interface WorkOrder {
  id: string;
  workOrderNumber: string;
  customer: string;
  vehicle: string;
  assignedTechnician: string;
  status: 'created' | 'inspection' | 'estimation' | 'in-progress' | 'waiting-for-parts' | 'invoice';
  description?: string;
  priority: 'high' | 'medium' | 'low';
}

interface ServiceItemCardProps {
  serviceItem: WorkOrder;
  onMove: (cardId: string, newStatus: WorkOrder['status']) => void;
  getTypeIcon: () => React.ReactNode;
  getTypeColor: () => string;
  getPriorityColor: (priority: WorkOrder['priority']) => string;
}

const getPriorityIndicator = (priority: WorkOrder['priority']) => {
  switch (priority) {
    case 'high':
      return {
        color: '#dc2626',
        backgroundColor: '#fef2f2',
        borderColor: '#fecaca'
      };
    case 'medium':
      return {
        color: '#d97706',
        backgroundColor: '#fffbeb',
        borderColor: '#fed7aa'
      };
    case 'low':
      return {
        color: '#059669',
        backgroundColor: '#f0fdf4',
        borderColor: '#bbf7d0'
      };
    default:
      return {
        color: '#64748b',
        backgroundColor: '#f8fafc',
        borderColor: '#e2e8f0'
      };
  }
};

const getVehicleImage = (vehicle: string) => {
  // Simple mapping for demo; in real app, use a better mapping or a vehicle image API
  const lower = vehicle.toLowerCase();
  if (lower.includes('camry')) return 'https://platform.cstatic-images.com/xxlarge/in/v2/stock_photos/8760bf48-c1a5-42f7-a83b-1cd39e2efbec/57ee2adf-a4a3-4757-8f50-6d85fcf5a351.png';
  if (lower.includes('cr-v')) return 'https://di-uploads-pod11.dealerinspire.com/hondaofkirkland/uploads/2019/08/2019-Honda-CR-V-LX-2WD-1.png';
  if (lower.includes('f-150')) return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZGOHHY8IeOYnZJ1iILcd8v-8kzs8hZ0QIVg&s';
  if (lower.includes('altima')) return 'https://di-shared-assets.dealerinspire.com/legacy/rackspace/ldm-images/2021-Nissan-Altima-hero.png';
  if (lower.includes('x5')) return 'https://larte-design.com/storage/app/media/models/bmw/x5m-competition-front-site-carbon-gray-donington.webp';
  if (lower.includes('a4')) return 'https://images.dealer.com/ddc/vehicles/2025/Audi/A4/Sedan/color/Navarra%20Blue%20Metallic-2D2D-10,33,127-320-en_US.jpg';
  // Default placeholder
  return 'https://cdn.pixabay.com/photo/2012/05/29/00/43/car-49278_1280.jpg';
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

  const priorityIndicator = getPriorityIndicator(serviceItem.priority);

  return (
    <div
      className="service-item-card"
      draggable
      onDragStart={handleDragStart}
    >
      {/* Status indicator bar (optional, can be colored by status) */}
      <div
        className="status-indicator"
        style={{ backgroundColor: getPriorityColor(serviceItem.priority) }}
      />

      {/* Vehicle Image */}
      <div className="vehicle-image-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '8px 0' }}>
        <img
          src={getVehicleImage(serviceItem.vehicle)}
          alt={serviceItem.vehicle}
          className="vehicle-image"
          style={{ width: 200, height: 200, objectFit: 'contain', borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
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
        {serviceItem.customer} - {serviceItem.vehicle}
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
      </div>

      {/* Card Footer */}
      <div className="card-footer">
        <div className="technician-info">
          <div className="technician-avatar technician-avatar--initials" style={{ backgroundColor: '#3b82f6' }}>
            {serviceItem.assignedTechnician.split(' ').map(n => n[0]).join('').toUpperCase()}
          </div>
          <div className="technician-details">
            <span className="technician-name">{serviceItem.assignedTechnician}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceItemCard;