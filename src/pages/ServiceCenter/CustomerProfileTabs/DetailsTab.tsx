import React from 'react';
import ContactInfoCard from './ContactInfoCard';
import VehiclesCard from './VehiclesCard';

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  color?: string;
  vin?: string;
  mileage?: number;
  fuelType?: string;
  transmission?: string;
  imageUrl?: string;
  lastServiceDate?: string;
}

interface CustomerDetails {
  id: string;
  email: string;
  phone: string;
  joinedDate?: string;
  vehicles?: Vehicle[];
}

interface DetailsTabProps {
  customer: CustomerDetails;
}

const DetailsTab: React.FC<DetailsTabProps> = ({ customer }) => {
  return (
    <div className="tab-content">
      <ContactInfoCard customer={customer} />
      <VehiclesCard vehicles={customer.vehicles || []} />
    </div>
  );
};

export default DetailsTab;
