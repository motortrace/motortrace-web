// components/JobCard/JobCardInfo.tsx
import React from 'react';
import JobSummaryCard from './JobSummaryCard';

interface JobCardInfoProps {
  customerImageUrl: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  vehicleImageUrl: string;
  model: string;
  vin: string;
  mileage: string;
  personalItems: string;
  createdBy: string;
  assignedTech: string;
  vehicleArrival: string;
  customerComplaint: string;
}

export const JobCardInfo: React.FC<JobCardInfoProps> = (props) => {
  return (
    <div className="job-card__info-section">
      <JobSummaryCard {...props} />
    </div>
  );
};