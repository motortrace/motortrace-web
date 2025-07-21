import React from 'react';
import './AppointmentDetailsModal.scss';

type AppointmentDetailsModalProps = {
  open: boolean;
  onClose: () => void;
  appointment: any; // Should be typed more strictly if possible
};

const AppointmentDetailsModal: React.FC<AppointmentDetailsModalProps> = ({ open, onClose, appointment }) => {
  if (!open || !appointment) return null;
  const { appointment: appt, jobCard } = appointment;
  return (
    <div className="event-modal-overlay" onClick={onClose}>
      <div className="event-modal" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>&times;</button>
        <h2>Appointment Details</h2>
        <div className="event-modal-section">
          <strong>Date & Time:</strong> {appt.scheduledStart ? new Date(appt.scheduledStart).toLocaleString() : '-'}
        </div>
        <div className="event-modal-section">
          <strong>Customer Name:</strong> {jobCard?.customer || '-'}
        </div>
        <div className="event-modal-section">
          <strong>Vehicle:</strong> {jobCard?.vehicle || '-'}
        </div>
        <div className="event-modal-section">
          <strong>Source:</strong> {jobCard?.source || 'Walk-in'}
        </div>
        <div className="event-modal-section">
          <strong>Tagged Services:</strong>
          <div className="tagged-services">
            {jobCard?.jobServices?.map((svc: any) => (
              <span key={svc.id} className="service-chip">{svc.serviceName}</span>
            ))}
          </div>
        </div>
        <div className="event-modal-section">
          <strong>Problem Description:</strong>
          <div>{jobCard?.problemDescription || 'No description provided.'}</div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetailsModal; 