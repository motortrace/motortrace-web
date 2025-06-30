import React from 'react';
import type { ServicePackage } from './types/jobCard.types';

interface ServicePackageHeaderProps {
  service: ServicePackage;
}

export const ServicePackageHeader: React.FC<ServicePackageHeaderProps> = ({ service }) => (
  <div className="service-package__header">
    <div className="service-package__header-main">
      <h3 className="service-package__name">{service.name}</h3>
      {service.authorized ? (
        <span className="badge badge--approved">Authorized</span>
      ) : (
        <span className="badge badge--pending">Not Authorized</span>
      )}
    </div>
    <div className="service-package__header-actions">
      <button className="btn btn--text">⚙️</button>
    </div>
  </div>
); 