import React from 'react';

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

interface VehicleCardProps {
  vehicle: Vehicle;
}

const getVehiclePlaceholderImage = (make: string) => {
  const makeImages: { [key: string]: string } = {
    'toyota': 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400',
    'honda': 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=400',
    'ford': 'https://images.unsplash.com/photo-1586909199047-bb1a0e51974e?w=400',
    'chevrolet': 'https://images.unsplash.com/photo-1617886903355-9354bb57751f?w=400',
    'bmw': 'https://images.unsplash.com/photo-1617886322207-f59d9d95e3a1?w=400',
    'mercedes': 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400',
    'audi': 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400',
    'nissan': 'https://images.unsplash.com/photo-1623869675781-80aa31012ca4?w=400',
    'volkswagen': 'https://images.unsplash.com/photo-1622353219448-46a009f0d44f?w=400',
  };
  
  return makeImages[make.toLowerCase()] || 'https://images.unsplash.com/photo-1494905998402-395d579af36f?w=400';
};

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
  return (
    <div className="vehicle-card">
      <div className="vehicle-image">
        <img 
          src={vehicle.imageUrl || getVehiclePlaceholderImage(vehicle.make)} 
          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1494905998402-395d579af36f?w=400';
          }}
        />
        <div className="vehicle-overlay">
          <button className="btn-view-details">
            <i className="bx bx-show"></i>
            View Details
          </button>
        </div>
      </div>
      <div className="vehicle-info">
        <div className="vehicle-header">
          <h4 className="vehicle-name">{vehicle.year} {vehicle.make} {vehicle.model}</h4>
          {vehicle.color && (
            <span className="vehicle-color">
              <span className="color-dot" style={{ backgroundColor: vehicle.color.toLowerCase() }}></span>
              {vehicle.color}
            </span>
          )}
        </div>
        
        {/* Primary Vehicle Stats */}
        <div className="vehicle-stats">
          {vehicle.mileage && (
            <div className="stat-badge">
              <i className="bx bx-tachometer"></i>
              <span>{vehicle.mileage.toLocaleString()} mi</span>
            </div>
          )}
          {vehicle.fuelType && (
            <div className="stat-badge">
              <i className="bx bxs-gas-pump"></i>
              <span>{vehicle.fuelType}</span>
            </div>
          )}
          {vehicle.transmission && (
            <div className="stat-badge">
              <i className="bx bx-cog"></i>
              <span>{vehicle.transmission}</span>
            </div>
          )}
        </div>

        <div className="vehicle-details">
          <div className="detail-item">
            <i className="bx bx-credit-card"></i>
            <div>
              <span className="detail-label">License Plate</span>
              <span className="detail-value">{vehicle.licensePlate}</span>
            </div>
          </div>
          {vehicle.vin && (
            <div className="detail-item">
              <i className="bx bx-barcode"></i>
              <div>
                <span className="detail-label">VIN</span>
                <span className="detail-value">{vehicle.vin}</span>
              </div>
            </div>
          )}
          {vehicle.lastServiceDate && (
            <div className="detail-item">
              <i className="bx bx-wrench"></i>
              <div>
                <span className="detail-label">Last Service</span>
                <span className="detail-value">{vehicle.lastServiceDate}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
