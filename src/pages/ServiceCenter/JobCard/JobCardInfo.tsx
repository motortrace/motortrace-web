// components/JobCard/JobCardInfo.tsx
import React from 'react';
import { CustomerInfoCard } from './CustomerInfoCard';
import VehicleInfoCard from './VehicleInfoCard';
import JobDetailsCard from './JobDetailsCard';

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
      <CustomerInfoCard />
      <VehicleInfoCard
        vehicleImageUrl={props.vehicleImageUrl}
        model={props.model}
        vin={props.vin}
        mileage={props.mileage}
        personalItems={props.personalItems}
      />
      <JobDetailsCard
        createdBy={props.createdBy}
        assignedTech={props.assignedTech}
        vehicleArrival={props.vehicleArrival}
        customerComplaint={props.customerComplaint}
      />
    </div>
  );
};