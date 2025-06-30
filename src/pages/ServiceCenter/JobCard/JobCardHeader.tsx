import React from 'react';

interface JobCardHeaderProps {
  workflowStatus: string;
  setWorkflowStatus: (status: any) => void;
  estimateGenerated: boolean;
  setEstimateGenerated: (value: boolean) => void;
  invoiceGenerated: boolean;
  setInvoiceGenerated: (value: boolean) => void;
}

export const JobCardHeader: React.FC<JobCardHeaderProps> = ({
  workflowStatus,
  setWorkflowStatus,
  estimateGenerated,
  setEstimateGenerated,
  invoiceGenerated,
  setInvoiceGenerated
}) => {
  const statusOptions = [
    { value: 'under-inspection', label: 'Under inspection' },
    { value: 'waiting-for-parts', label: 'Waiting for parts' },
    { value: 'waiting-for-payment', label: 'Waiting for payment' },
    { value: 'completed', label: 'Completed' },
  ];

  return (
    <div className="job-card__header">
      <div className="job-card__header-content">
        <div className="job-card__header-info">
          <div className="job-card__title-section">
            <h1 className="job-card__title">Job Card #10012</h1>
            <select
              className="job-card__status-dropdown"
              value={workflowStatus}
              onChange={e => setWorkflowStatus(e.target.value)}
            >
              {statusOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="job-card__subtitle">
            Created Mar 1, 2024 by John Wilson • Customer: Amber Miller
          </div>
        </div>
        <div className="job-card__header-actions">
          <button className="btn btn--secondary">Print</button>
          <button className="btn btn--secondary">Email</button>
          {!estimateGenerated ? (
            <button
              className="btn btn--primary"
              onClick={() => setEstimateGenerated(true)}
            >
              Generate and send estimate
            </button>
          ) : !invoiceGenerated ? (
            <button
              className="btn btn--primary"
              onClick={() => setInvoiceGenerated(true)}
            >
              Generate and send invoice
            </button>
          ) : (
            <button className="btn btn--primary" disabled>Invoice Sent</button>
          )}
        </div>
      </div>
    </div>
  );
};