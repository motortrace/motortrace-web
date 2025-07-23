import React from 'react';

interface JobDetailsCardProps {
  createdBy: string;
  assignedTech: string;
  vehicleArrival: string;
  customerComplaint: string;
}

const JobDetailsCard: React.FC<JobDetailsCardProps> = ({ createdBy, assignedTech, vehicleArrival, customerComplaint }) => (
  <div className="info-card">
    <h3 className="info-card__title">Job Details</h3>
    <div className="info-card__body">
      <div className="info-card__item">
        <span className="info-card__label">Created By</span>
        <span className="info-card__value">{createdBy}</span>
      </div>
      <div className="info-card__item">
        <span className="info-card__label">Assigned Tech</span>
        <span className="info-card__value">{assignedTech}</span>
      </div>
      <div className="info-card__item">
        <span className="info-card__label">Arrived</span>
        <span className="info-card__value">{vehicleArrival}</span>
      </div>
      <div className="info-card__item info-card__item--full-width">
        <span className="info-card__label">Customer Request</span>
        <p className="info-card__text">{customerComplaint}</p>
      </div>
    </div>
  </div>
);

export default JobDetailsCard;
