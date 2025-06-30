// components/JobCard/ServicePackageComponent.tsx
import React from 'react';
import { ServicePackageHeader } from './ServicePackageHeader';
import { ServicePackageDetails } from './ServicePackageDetails';
import { ServiceItemsTable } from './ServiceItemsTable';
import { ServicePackageSummary } from './ServicePackageSummary';
import type { ServicePackage } from './types/jobCard.types';

interface ServicePackageComponentProps {
  service: ServicePackage;
  onUpdate: (service: ServicePackage) => void;
}

export const ServicePackageComponent: React.FC<ServicePackageComponentProps> = ({ 
  service, 
  onUpdate 
}) => {
  return (
    <div className="service-package">
      <ServicePackageHeader service={service} />
      <ServicePackageDetails service={service} />
      <ServiceItemsTable service={service} onUpdate={onUpdate} />
      <ServicePackageSummary service={service} />
    </div>
  );
};
