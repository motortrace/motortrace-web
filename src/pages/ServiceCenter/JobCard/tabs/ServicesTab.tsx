// components/JobCard/tabs/ServicesTab.tsx
import React from 'react';
import { ServicePackageComponent } from '../ServicePackageComponent';
import type { ServicePackage } from '../types/jobCard.types';

interface ServicesTabProps {
  services: ServicePackage[];
  setServices: (services: ServicePackage[]) => void;
  calculateGrandTotal: () => number;
}

const ServicesTab: React.FC<ServicesTabProps> = ({ services, setServices, calculateGrandTotal }) => {
  return (
    <div>
      <div className="services-header"><h3 className="services-header__title">Services</h3><div className="services-header__stats"><div className="stat-box"><span className="stat-box__label">Total Charge</span><span className="stat-box__value">{calculateGrandTotal()} LKR</span></div></div></div>
      <div className="job-card__services-list">
        {services.map((service) => (
          <ServicePackageComponent 
            key={service.id} 
            service={service}
            onUpdate={(updatedService) => {
              setServices(services.map(s => s.id === updatedService.id ? updatedService : s));
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ServicesTab;