import React from 'react';
import { Check, Eye, Edit, Trash2 } from 'lucide-react';
import type { Package, Service } from '../../../types/ServicesAndPackages';

interface PackageCardProps {
  package: Package;
  services: Service[];
  onView: (pkg: Package) => void;
  onEdit: (pkg: Package) => void;
  onDelete: (id: string) => void;
}

export const PackageCard: React.FC<PackageCardProps> = ({ 
  package: pkg, 
  services, 
  onView, 
  onEdit, 
  onDelete 
}) => {
  const includedServices = services.filter(service => pkg.serviceIds.includes(service.id));

  return (
    <div className="spm-service-card">
      <div className="spm-service-card__image">
        <img src={pkg.image} alt={pkg.name} />
      </div>
      <div className="spm-service-card__content">
        <h3 className="spm-service-card__name">{pkg.name}</h3>
        <p className="spm-service-card__description">{pkg.description}</p>
        {/* <div className="spm-package-card__services">
          <h4>Included Services:</h4>
          <ul>
            {includedServices.map(service => (
              <li key={service.id}>
                <Check size={14} /> {service.name}
              </li>
            ))}
          </ul>
        </div> */}
        <div className="spm-service-card__meta">
          <span className="spm-service-card__price">LKR {pkg.price.toLocaleString()}</span>
          <span className="spm-package-card__savings">
            Save LKR {includedServices.reduce((acc, s) => acc + s.price, 0) - pkg.price}
          </span>
        </div>
        <div className="spm-service-card__actions" style = {{justifyContent: 'space-around'}}>
          <button className="spm-btn spm-btn--secondary" style = {{ minWidth: '275px' }} onClick={() => onView(pkg)}>
            <Eye size={16} /> View
          </button>
          <button className="spm-btn spm-btn--secondary" style = {{ minWidth: '275px' }} onClick={() => onEdit(pkg)}>
            <Edit size={16} /> Edit
          </button>
          <button className="spm-btn spm-btn--secondary" style = {{ minWidth: '275px' }} onClick={() => onDelete(pkg.id)}>
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};