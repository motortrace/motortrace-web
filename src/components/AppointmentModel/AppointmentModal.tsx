import React from 'react';
import './AppointmentModal.scss';

interface Vehicle {
  make: string;
  model: string;
  year: number;
  mileage: number;
  color: string;
  licensePlate: string;
}

interface Customer {
  name: string;
  email: string;
  phone: string;
  address: string;
  isReturning: boolean;
}

interface AppointmentRequest {
  id: string;
  customer: Customer;
  vehicle: Vehicle;
  serviceType: string;
  description: string;
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  preferredDate: string;
  preferredTime: string;
  alternativeDate?: string;
  alternativeTime?: string;
  estimatedDuration: string;
  budgetRange: string;
  images?: string[];
  previousVisits?: number;
  lastServiceDate?: string;
  requestDate: string;
  contactPreference: 'phone' | 'email' | 'text';
}

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: AppointmentRequest | null;
  onAccept: (appointmentId: string) => void;
  onDecline: (appointmentId: string) => void;
  onSchedule: (appointmentId: string) => void;
}

const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  appointment,
  onAccept,
  onDecline,
  onSchedule
}) => {
  if (!isOpen || !appointment) return null;

  const getUrgencyClass = (urgency: string) => {
    switch (urgency) {
      case 'emergency': return 'urgency-emergency';
      case 'high': return 'urgency-high';
      case 'medium': return 'urgency-medium';
      default: return 'urgency-low';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="appointment-modal-overlay" onClick={onClose}>
      <div className="appointment-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Appointment Request Details</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-content">
          {/* Urgency Badge */}
          <div className={`urgency-badge ${getUrgencyClass(appointment.urgency)}`}>
            {appointment.urgency.toUpperCase()} PRIORITY
          </div>

          {/* Customer Information */}
          <section className="section">
            <h3>Customer Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Name:</label>
                <span>{appointment.customer.name}</span>
                {appointment.customer.isReturning && <span className="returning-badge">Returning Customer</span>}
              </div>
              <div className="info-item">
                <label>Phone:</label>
                <span>{appointment.customer.phone}</span>
              </div>
              <div className="info-item">
                <label>Email:</label>
                <span>{appointment.customer.email}</span>
              </div>
              <div className="info-item">
                <label>Address:</label>
                <span>{appointment.customer.address}</span>
              </div>
              <div className="info-item">
                <label>Contact Preference:</label>
                <span className="contact-pref">{appointment.contactPreference.toUpperCase()}</span>
              </div>
              {appointment.previousVisits && (
                <div className="info-item">
                  <label>Previous Visits:</label>
                  <span>{appointment.previousVisits}</span>
                </div>
              )}
            </div>
          </section>

          {/* Vehicle Information */}
          <section className="section">
            <h3>Vehicle Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Vehicle:</label>
                <span>{appointment.vehicle.year} {appointment.vehicle.make} {appointment.vehicle.model}</span>
              </div>
              <div className="info-item">
                <label>Color:</label>
                <span>{appointment.vehicle.color}</span>
              </div>
              <div className="info-item">
                <label>License Plate:</label>
                <span>{appointment.vehicle.licensePlate}</span>
              </div>
              <div className="info-item">
                <label>Mileage:</label>
                <span>{appointment.vehicle.mileage.toLocaleString()} miles</span>
              </div>
              {appointment.lastServiceDate && (
                <div className="info-item">
                  <label>Last Service:</label>
                  <span>{formatDate(appointment.lastServiceDate)}</span>
                </div>
              )}
            </div>
          </section>

          {/* Service Details */}
          <section className="section">
            <h3>Service Request</h3>
            <div className="service-details">
              <div className="info-item">
                <label>Service Type:</label>
                <span className="service-type">{appointment.serviceType}</span>
              </div>
              <div className="info-item">
                <label>Budget Range:</label>
                <span className="budget">{appointment.budgetRange}</span>
              </div>
              <div className="info-item">
                <label>Estimated Duration:</label>
                <span>{appointment.estimatedDuration}</span>
              </div>
              <div className="description-item">
                <label>Description:</label>
                <p>{appointment.description}</p>
              </div>
            </div>
          </section>

          {/* Scheduling Preferences */}
          <section className="section">
            <h3>Scheduling Preferences</h3>
            <div className="scheduling-info">
              <div className="preferred-slot">
                <label>Preferred:</label>
                <span>{formatDate(appointment.preferredDate)} at {formatTime(appointment.preferredTime)}</span>
              </div>
              {appointment.alternativeDate && (
                <div className="alternative-slot">
                  <label>Alternative:</label>
                  <span>{formatDate(appointment.alternativeDate)} at {formatTime(appointment.alternativeTime!)}</span>
                </div>
              )}
            </div>
          </section>

          {/* Images if available */}
          {appointment.images && appointment.images.length > 0 && (
            <section className="section">
              <h3>Uploaded Images</h3>
              <div className="images-grid">
                {appointment.images.map((image, index) => (
                  <img key={index} src={image} alt={`Damage ${index + 1}`} className="damage-image" />
                ))}
              </div>
            </section>
          )}

          {/* Request Metadata */}
          <section className="section request-meta">
            <div className="meta-info">
              <span>Request ID: {appointment.id}</span>
              <span>Submitted: {formatDate(appointment.requestDate)}</span>
            </div>
          </section>
        </div>

        {/* Action Buttons */}
        <div className="modal-footer">
          <button className="btn btn-decline" onClick={() => onDecline(appointment.id)}>
            Decline Request
          </button>
          <button className="btn btn-schedule" onClick={() => onSchedule(appointment.id)}>
            Schedule Later
          </button>
          <button className="btn btn-accept" onClick={() => onAccept(appointment.id)}>
            Accept & Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentModal;