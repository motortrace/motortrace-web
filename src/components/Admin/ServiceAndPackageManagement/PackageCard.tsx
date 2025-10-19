// src/components/Admin/ServiceAndPackageManagement/PackageCard.tsx
import React from 'react';
import { Check, Eye, Edit, Trash2, Ban, CheckCircle } from 'lucide-react';
import type { Package, Service } from '../../../types/ServicesAndPackages';
import "./ServiceCard.scss"

interface PackageCardProps {
  package: Package;
  services: Service[];
  onView: (pkg: Package) => void;
  onEdit: (pkg: Package) => void;
  onToggleAvailability: (id: string) => void;
  onDelete: (id: string) => void;
}

export const PackageCard: React.FC<PackageCardProps> = ({
  package: pkg,
  services,
  onView,
  onEdit,
  onToggleAvailability,
  onDelete
}) => {
  // Add null check
  if (!pkg) return null;

  const includedServices = services.filter(service => pkg.serviceIds?.includes(service.id));
  const totalIndividualPrice = includedServices.reduce((acc, service) =>
    acc + (service.estimatedHours * service.hourlyRate), 0
  );
  const savings = totalIndividualPrice - (pkg.price || 0);

  return (
    <div className="spm-service-card">
      <div className="spm-service-card__content">
        <div className="spm-service-card__header">
          <span className="spm-service-card__code">{pkg.code}</span>
          <span className={`spm-service-card__status ${pkg.isAvailable ? 'available' : 'unavailable'}`}>
            {pkg.isAvailable ? 'Available' : 'Unavailable'}
          </span>
        </div>

        <div className="spm-service-card__header" style={{marginBottom: '0.5rem'}}>
          <h3 className="spm-service-card__name">{pkg.name}</h3>
          {savings > 0 && (
            <span className="spm-package-card__savings" style={{background: "#ffffff", color: '#22c55e', border: '2px solid rgba(0, 0, 0, 0.1)'}}>
              <span className="savings-label">Save</span>
              <span className="savings-amount">LKR {savings.toLocaleString()}</span>
            </span>
          )}
        </div>
        

        {pkg.description && (
          <p className="spm-service-card__description">{pkg.description}</p>
        )}

        <div className="spm-package-card__services">
          <h4>Included Services</h4>
          <ul>
            {includedServices.map(service => (
              <li key={service.id}>
                <Check size={14} />
                <span>{service.name}</span>
                <span className="service-hours">{service.estimatedHours}h</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="spm-service-card__meta">
          <span className="spm-service-card__price">
            <span className="currency">LKR</span>
            {pkg.price.toLocaleString()}
          </span>
          
          <span className="spm-service-card__duration">
            {Math.floor(pkg.duration / 60)}h {pkg.duration % 60}m
          </span>
        </div>

        <div className="spm-service-card__actions" style={{ justifyContent: 'space-around' }}>
          <button className="spm-btn spm-btn--secondary" style={{ minWidth: '282.5px' }} onClick={() => onView(pkg)}>
            <Eye size={16} /> View
          </button>
          <button className="spm-btn spm-btn--secondary" style={{ minWidth: '282.5px' }} onClick={() => onEdit(pkg)}>
            <Edit size={16} /> Edit
          </button>
          <button
            className="spm-btn spm-btn--secondary"
            style={{ minWidth: '282.5px' }}
            onClick={() => onToggleAvailability(pkg.id)}
          >
            {pkg.isAvailable ? <Ban size={16} /> : <CheckCircle size={16} />}
            {pkg.isAvailable ? ' Disable' : ' Enable'}
          </button>
          <button className="spm-btn spm-btn--secondary" style={{ minWidth: '282.5px' }} onClick={() => onDelete(pkg.id)}>
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};