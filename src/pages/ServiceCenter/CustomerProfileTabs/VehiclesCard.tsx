import React from 'react';
import VehicleCard from './VehicleCard';

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

interface VehiclesCardProps {
  vehicles: Vehicle[];
}

const VehiclesCard: React.FC<VehiclesCardProps> = ({ vehicles }) => {
  return (
    <div className="card vehicles-card">
      <div className="card-header">
        <h3>
          <i className="bx bx-car"></i>
          Customer Vehicles
        </h3>
        <span className="vehicle-count">
          {vehicles.length} Vehicle{vehicles.length !== 1 ? 's' : ''}
        </span>
      </div>
      <div className="card-body">
        {vehicles.length > 0 ? (
          <div className="vehicles-grid">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <i className="bx bx-car"></i>
            <p>No vehicles registered</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehiclesCard;
