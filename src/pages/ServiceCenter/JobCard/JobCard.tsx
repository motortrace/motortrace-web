import React, { useState } from 'react';
import './JobCard.scss';
import { JobCardHeader } from './JobCardHeader';
import { JobCardInfo } from './JobCardInfo';
import { JobCardTabs } from './JobCardTabs';
import { initialServices, partItems, customerComplaint, vehicleImageUrl, customerImageUrl, vehicleArrival, personalItems } from './data/initialData';
import type { ServicePackage, PartItem } from './types/jobCard.types';
import { useJobCardCalculations } from './hooks/useJobCardCalculations';

const JobCard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'services' | 'parts' | 'inspections' | 'notes'>('services');
  const [workflowStatus, setWorkflowStatus] = useState<'under-inspection' | 'waiting-for-parts' | 'waiting-for-payment' | 'completed'>('under-inspection');
  const [estimateGenerated, setEstimateGenerated] = useState(false);
  const [invoiceGenerated, setInvoiceGenerated] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'paid'>('pending');
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [services, setServices] = useState<ServicePackage[]>(initialServices);
  const [notes, setNotes] = useState('');

  // Use calculation hook
  const {
    calculateAuthorizedLabor,
    calculateAuthorizedParts,
    calculateTax,
    calculateTotal,
    calculateGrandTotal
  } = useJobCardCalculations(services);

  // Handler for sending authorization request
  const sendAuthorizationRequest = () => {
    // Implement actual logic as needed
    alert('Authorization request sent!');
  };

  return (
    <div className="job-card">
      <JobCardHeader
        workflowStatus={workflowStatus}
        setWorkflowStatus={setWorkflowStatus}
        estimateGenerated={estimateGenerated}
        setEstimateGenerated={setEstimateGenerated}
        invoiceGenerated={invoiceGenerated}
        setInvoiceGenerated={setInvoiceGenerated}
      />
      <div className="job-card__body">
        <div className="job-card__main">
          <div className="job-card__content">
            <JobCardInfo
              customerImageUrl={customerImageUrl}
              customerName="Amber Miller"
              customerPhone="(555) 123-4567"
              customerEmail="amber.miller@email.com"
              vehicleImageUrl={vehicleImageUrl}
              model="2020 Audi A4 Premium"
              vin="WAUENAF40LN123456"
              mileage="45,250 miles"
              personalItems={personalItems}
              createdBy="John Wilson"
              assignedTech="Chuck Ivanes"
              vehicleArrival={vehicleArrival}
              customerComplaint={customerComplaint}
            />
            <JobCardTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              services={services}
              setServices={setServices}
              partItems={partItems}
              notes={notes}
              setNotes={setNotes}
              calculateGrandTotal={calculateGrandTotal}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;