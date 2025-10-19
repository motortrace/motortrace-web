// src/components/Admin/ServiceAndPackageManagement/ViewModal.tsx
import React from 'react';
import { X, Clock, Check } from 'lucide-react';
import type { Service, Package } from '../../../types/ServicesAndPackages';
import "./ViewModal.scss"

interface ViewModalProps {
  service?: Service;
  package?: Package;
  services: Service[];
  onClose: () => void;
}

// Update ViewModal.tsx with proper null checks
export const ViewModal: React.FC<ViewModalProps> = ({ 
  service, 
  package: pkg, 
  services, 
  onClose 
}) => {
  if (!service && !pkg) return null;

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Safe way to get included services
  const getIncludedServices = () => {
    if (!pkg || !pkg.serviceIds) return [];
    return services.filter(s => pkg.serviceIds.includes(s.id));
  };

  const includedServices = getIncludedServices();

  return (
    <div className="spm-modal-overlay" onClick={onClose}>
      <div className="spm-modal-content spm-modal-content--large" onClick={e => e.stopPropagation()}>
        <div className="spm-modal__header">
          <h2>{service?.name || pkg?.name}</h2>
          <button className="spm-modal__close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className="spm-modal__body">
          {service && (
            <div className="spm-service-details">
              <div className="spm-service-details__info">
                <div className="spm-service-details__info-item">
                  <strong>Code:</strong> {service.code}
                </div>
                <div className="spm-service-details__info-item">
                  <strong>Name:</strong> {service.name}
                </div>
                {service.description && (
                  <div className="spm-service-details__info-item">
                    <strong>Description:</strong> {service.description}
                  </div>
                )}
                <div className="spm-service-details__info-item">
                  <strong>Estimated Hours:</strong> {service.estimatedHours}h
                </div>
                <div className="spm-service-details__info-item">
                  <strong>Hourly Rate:</strong> LKR {service.hourlyRate.toLocaleString()}/h
                </div>
                <div className="spm-service-details__info-item">
                  <strong>Total Price:</strong> LKR {(service.estimatedHours * service.hourlyRate).toLocaleString()}
                </div>
                {service.category && (
                  <div className="spm-service-details__info-item">
                    <strong>Category:</strong> {service.category}
                  </div>
                )}
                <div className="spm-service-details__info-item">
                  <strong>Status:</strong> 
                  <span className={`spm-status ${service.isActive ? 'available' : 'unavailable'}`}>
                    {service.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          )}
          
          {pkg && (
            <div className="spm-package-details">
              <div className="spm-package-details__info">
                <div className="spm-package-details__info-item">
                  <strong>Code:</strong> {pkg.code || 'N/A'}
                </div>
                <div className="spm-package-details__info-item">
                  <strong>Name:</strong> {pkg.name || 'N/A'}
                </div>
                {pkg.description && (
                  <div className="spm-package-details__info-item">
                    <strong>Description:</strong> {pkg.description}
                  </div>
                )}
                <div className="spm-package-details__info-item">
                  <strong>Duration:</strong> {pkg.duration ? formatDuration(pkg.duration) : 'N/A'}
                </div>
                <div className="spm-package-details__info-item">
                  <strong>Price:</strong> LKR {pkg.price ? pkg.price.toLocaleString() : 'N/A'}
                </div>
                <div className="spm-package-details__info-item">
                  <strong>Status:</strong> 
                  <span className={`spm-status ${pkg.isAvailable ? 'available' : 'unavailable'}`}>
                    {pkg.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              </div>
              
              <div className="spm-package-details__services">
                <h3>Included Services:</h3>
                {includedServices.length > 0 ? (
                  includedServices.map(service => (
                    <div key={service.id} className="spm-package-details__service-item">
                      <div className="spm-service-item__header">
                        <h4>{service.name}</h4>
                        <span className="spm-service-item__price">
                          LKR {(service.estimatedHours * service.hourlyRate).toLocaleString()}
                        </span>
                      </div>
                      {service.description && (
                        <p className="spm-service-item__description">{service.description}</p>
                      )}
                      <div className="spm-service-item__meta">
                        <span className="spm-service-item__duration">
                          <Clock size={14} /> {service.estimatedHours}h
                        </span>
                        <span className="spm-service-item__rate">
                          LKR {service.hourlyRate.toLocaleString()}/h
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No services included in this package.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};