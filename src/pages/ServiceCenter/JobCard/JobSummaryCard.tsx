import React, { useState } from 'react';

interface JobSummaryCardProps {
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

const JobSummaryCard: React.FC<JobSummaryCardProps> = ({
  customerImageUrl,
  customerName,
  customerPhone,
  customerEmail,
  vehicleImageUrl,
  model,
  vin,
  mileage,
  personalItems,
  createdBy,
  assignedTech,
  vehicleArrival,
  customerComplaint,
}) => {
  const [openSections, setOpenSections] = useState({
    customer: false,
    vehicle: false,
    job: false,
  });

  const toggleSection = (section: 'customer' | 'vehicle' | 'job') => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <section className="job-summary-section">
      {/* Customer Section */}
      <div className="job-summary-section__block job-summary-section__block--customer">
        <button
          className="job-summary-section__header"
          type="button"
          onClick={() => toggleSection('customer')}
          aria-expanded={openSections.customer}
        >
          <span className="job-summary-section__icon"><i className="bx bx-user"></i></span>
          <span>Customer</span>
          <span className={`job-summary-section__chevron${openSections.customer ? ' open' : ''}`}>
            <i className="bx bx-chevron-down"></i>
          </span>
        </button>
        {openSections.customer && (
          <div className="job-summary-section__info job-summary-section__info--customer">
            <img src={customerImageUrl} alt={customerName} className="job-summary-section__photo" />
            <div className="job-summary-section__details">
              <div className="job-summary-section__row name-row"><span className="label">Name:</span> {customerName}</div>
              <div className="job-summary-section__row"><span className="label">Phone:</span> {customerPhone}</div>
              <div className="job-summary-section__row"><span className="label">Email:</span> {customerEmail}</div>
            </div>
          </div>
        )}
      </div>
      <div className="job-summary-section__divider" />
      {/* Vehicle Section */}
      <div className="job-summary-section__block job-summary-section__block--vehicle">
        <button
          className="job-summary-section__header"
          type="button"
          onClick={() => toggleSection('vehicle')}
          aria-expanded={openSections.vehicle}
        >
          <span className="job-summary-section__icon"><i className="bx bx-car"></i></span>
          <span>Vehicle</span>
          <span className={`job-summary-section__chevron${openSections.vehicle ? ' open' : ''}`}>
            <i className="bx bx-chevron-down"></i>
          </span>
        </button>
        {openSections.vehicle && (
          <div className="job-summary-section__info job-summary-section__info--vehicle">
            <img src={vehicleImageUrl} alt={model} className="job-summary-section__photo job-summary-section__photo--vehicle" />
            <div className="job-summary-section__details">
              <div className="job-summary-section__row"><span className="label">Model:</span> {model}</div>
              <div className="job-summary-section__row"><span className="label">VIN:</span> {vin}</div>
              <div className="job-summary-section__row"><span className="label">Mileage:</span> {mileage}</div>
              <div className="job-summary-section__row"><span className="label">Personal Items:</span> {personalItems}</div>
            </div>
          </div>
        )}
      </div>
      <div className="job-summary-section__divider" />
      {/* Job Details Section */}
      <div className="job-summary-section__block job-summary-section__block--job">
        <button
          className="job-summary-section__header"
          type="button"
          onClick={() => toggleSection('job')}
          aria-expanded={openSections.job}
        >
          <span className="job-summary-section__icon"><i className="bx bx-clipboard"></i></span>
          <span>Job Details</span>
          <span className={`job-summary-section__chevron${openSections.job ? ' open' : ''}`}>
            <i className="bx bx-chevron-down"></i>
          </span>
        </button>
        {openSections.job && (
          <div className="job-summary-section__details">
            <div className="job-summary-section__row"><span className="label">Created By:</span> {createdBy}</div>
            <div className="job-summary-section__row"><span className="label">Assigned Tech:</span> {assignedTech}</div>
            <div className="job-summary-section__row"><span className="label">Arrived:</span> {vehicleArrival}</div>
            <div className="job-summary-section__row"><span className="label">Customer Request:</span> <span className="job-summary-section__complaint">{customerComplaint}</span></div>
          </div>
        )}
      </div>
    </section>
  );
};

export default JobSummaryCard; 