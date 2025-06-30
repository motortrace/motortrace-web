import React from 'react';
import type { ServicePackage } from './types/jobCard.types';

interface ServicePackageSummaryProps {
  service: ServicePackage;
}

export const ServicePackageSummary: React.FC<ServicePackageSummaryProps> = ({ service }) => {
  const serviceTotal = service.lineItems.reduce((acc, item) => acc + item.amount, 0);
  const totalDiscount = service.lineItems.reduce((acc, item) => acc + item.discount, 0);
  const netTotal = service.lineItems.reduce((acc, item) => acc + item.netAmount, 0);

  return (
    <div className="service-package__summary">
      <div className="summary-list">
        <div className="summary-list__item">
          <span className="summary-list__label">Service Total</span>
          <span className="summary-list__value">${serviceTotal.toFixed(2)}</span>
        </div>
        <div className="summary-list__item">
          <span className="summary-list__label">Total Discount</span>
          <span className="summary-list__value">-${totalDiscount.toFixed(2)}</span>
        </div>
        <div className="summary-list__total">
          <span className="summary-list__label">Net Total</span>
          <span className="summary-list__value">${netTotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}; 