import React from 'react';
import { X, Clock, Shield, Check } from 'lucide-react';
import type { Service, Package } from '../../../types/ServicesAndPackages';

interface ViewModalProps {
  service?: Service;
  package?: Package;
  services: Service[];
  onClose: () => void;
}

export const ViewModal: React.FC<ViewModalProps> = ({ 
  service, 
  package: pkg, 
  services, 
  onClose 
}) => {
  if (!service && !pkg) return null;

  return (
    <div className="spm-modal-overlay" onClick={onClose}>
      <div className="spm-modal-content" onClick={e => e.stopPropagation()}>
        <div className="spm-modal__header">
          <h2>{service?.name || pkg?.name}</h2>
          <button className="spm-modal__close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="spm-modal__body">
          {service && (
            <>
              <img src={service.image} alt={service.name} className="spm-modal__image" />
              <div className="spm-service-details">
                <p className="spm-service-details__description">{service.detailedDescription}</p>
                <div className="spm-service-details__info">
                  <div className="spm-service-details__info-item">
                    <Clock size={16} />
                    <span>Duration: {service.duration}</span>
                  </div>
                  {service.warranty && (
                    <div className="spm-service-details__info-item">
                      <Shield size={16} />
                      <span>Warranty: {service.warranty}</span>
                    </div>
                  )}
                  <div className="spm-service-details__price">LKR {service.price.toLocaleString()}</div>
                </div>
                <div className="spm-service-details__included">
                  <h3>What's Included:</h3>
                  <ul>
                    {service.whatsIncluded.map((item, index) => (
                      <li key={index}>
                        <Check size={14} /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}
          {pkg && (
            <>
              <img src={pkg.image} alt={pkg.name} className="spm-modal__image" />
              <div className="spm-package-details">
                <p className="spm-package-details__description">{pkg.description}</p>
                <div className="spm-service-details__price">LKR {pkg.price.toLocaleString()}</div>
                <div className="spm-package-details__services">
                  <h3>Included Services:</h3>
                  {services.filter(s => pkg.serviceIds.includes(s.id)).map(service => (
                    <div key={service.id} className="spm-package-details__service-item">
                      <h4>{service.name}</h4>
                      <p>{service.shortDescription}</p>
                      <span className="spm-package-details__individual-price">
                        LKR {service.price.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
