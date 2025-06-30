import React from 'react';

interface VehicleInfoCardProps {
  vehicleImageUrl: string;
  model: string;
  vin: string;
  mileage: string;
  personalItems: string;
}

const VehicleInfoCard: React.FC<VehicleInfoCardProps> = ({ vehicleImageUrl, model, vin, mileage, personalItems }) => (
  <div className="info-card">
    <h3 className="info-card__title">Vehicle</h3>
    <div className="info-card__body">
      <div className="info-card__item info-card__item--image">
        <img src={vehicleImageUrl} alt={model} className="vehicle-image" />
      </div>
      <div className="info-card__item">
        <span className="info-card__label">Model</span>
        <span className="info-card__value">{model}</span>
      </div>
      <div className="info-card__item">
        <span className="info-card__label">VIN</span>
        <span className="info-card__value">{vin}</span>
      </div>
      <div className="info-card__item">
        <span className="info-card__label">Mileage</span>
        <span className="info-card__value">{mileage}</span>
      </div>
      <div className="info-card__item info-card__item--full-width">
        <span className="info-card__label">Personal Items</span>
        <p className="info-card__text">{personalItems}</p>
      </div>
    </div>
  </div>
);

export default VehicleInfoCard;
