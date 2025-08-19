import React from 'react';
import { Clock, Eye, Edit, Ban, CheckCircle, Trash2 } from 'lucide-react';
import type { Service } from '../../../types/ServicesAndPackages';

interface ServiceCardProps {
  service: Service;
  onView: (service: Service) => void;
  onEdit: (service: Service) => void;
  onToggleAvailability: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onView,
  onEdit,
  onToggleAvailability,
  onDelete
}) => {
  return (
    <div className={`spm-service-card ${!service.isAvailable ? 'spm-service-card--unavailable' : ''}`}>
      <div className="spm-service-card__image">
        <img src={service.image} alt={service.name} />
        {!service.isAvailable && (
          <div className="spm-service-card__unavailable-overlay">
            Temporarily Unavailable
          </div>
        )}
      </div>
      <div className="spm-service-card__content">
        <h3 className="spm-service-card__name">{service.name}</h3>
        <p className="spm-service-card__description">{service.shortDescription}</p>
        <div className="spm-service-card__meta">
          <span className="spm-service-card__price">LKR {service.price.toLocaleString()}</span>
          <span className="spm-service-card__duration">
            <Clock size={14} /> {service.duration}
          </span>
        </div>
        <div className="spm-service-card__actions" style={{ justifyContent: 'space-around' }}>
          <button className="spm-btn spm-btn--secondary" onClick={() => onView(service)}>
            <Eye size={16} /> View
          </button>
          <button className="spm-btn spm-btn--secondary" onClick={() => onEdit(service)}>
            <Edit size={16} /> Edit
          </button>
          <button
            className="spm-btn spm-btn--secondary"
            onClick={() => onToggleAvailability(service.id)}
          >
            {service.isAvailable ? (
              <>
                <Ban size={16} className="icon-left" />
                Make Unavailable
              </>
            ) : (
              <>
                <CheckCircle size={16} className="icon-left" />
                Make Available
              </>
            )}
          </button>
          <button className="spm-btn spm-btn--secondary" onClick={() => onDelete(service.id)}>
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};