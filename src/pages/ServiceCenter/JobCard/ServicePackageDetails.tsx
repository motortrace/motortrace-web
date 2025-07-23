import React from 'react';
import type { ServicePackage } from './types/jobCard.types';

interface ServicePackageDetailsProps {
  service: ServicePackage;
}

export const ServicePackageDetails: React.FC<ServicePackageDetailsProps> = ({ service }) => (
  <div className="service-package__details">
    <p className="service-package__note">
      <strong>Note:</strong> {service.note || 'No notes for this service.'}
    </p>
    <div className="service-package__add-ons">
      <button className="btn btn--primary">Add Service Item</button>
    </div>
  </div>
); 