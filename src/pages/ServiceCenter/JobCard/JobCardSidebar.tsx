// components/JobCard/JobCardSidebar.tsx
import React from 'react';
import JobSummaryCard from './sidebar/JobSummaryCard';
import AuthorizationCard from './sidebar/AuthorizationCard';
import QuickActionsCard from './sidebar/QuickActionsCard';
import type { ServicePackage } from './types/jobCard.types';

interface JobCardSidebarProps {
  calculateAuthorizedLabor: () => number;
  calculateAuthorizedParts: () => number;
  calculateTax: () => number;
  calculateTotal: () => number;
  paymentStatus: 'pending' | 'paid';
  setPaymentStatus: (status: 'pending' | 'paid') => void;
  paymentProof: File | null;
  setPaymentProof: (file: File | null) => void;
  services: ServicePackage[];
  sendAuthorizationRequest: () => void;
}

export const JobCardSidebar: React.FC<JobCardSidebarProps> = ({
  calculateAuthorizedLabor,
  calculateAuthorizedParts,
  calculateTax,
  calculateTotal,
  paymentStatus,
  setPaymentStatus,
  paymentProof,
  setPaymentProof,
  services,
  sendAuthorizationRequest
}) => {
  return (
    <div className="job-card__sidebar">
      <JobSummaryCard
        calculateAuthorizedLabor={calculateAuthorizedLabor}
        calculateAuthorizedParts={calculateAuthorizedParts}
        calculateTax={calculateTax}
        calculateTotal={calculateTotal}
      />
      <AuthorizationCard services={services} sendAuthorizationRequest={sendAuthorizationRequest} />
      <QuickActionsCard />
      {/* Payment status and proof can be handled in JobSummaryCard or a new PaymentCard if needed */}
    </div>
  );
};