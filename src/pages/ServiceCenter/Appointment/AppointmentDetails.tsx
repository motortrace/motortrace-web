import React, { useState } from 'react';
import { ArrowLeft, Phone, MessageCircle, Calendar, Clock, MapPin, User, Car, Camera, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import MetricCard from '../../../components/MetricCard/MetricCard';
import './AppointmentDetails.scss';

const AppointmentDetails = () => {
  const [selectedTab, setSelectedTab] = useState('details');
  const [appointmentStatus, setAppointmentStatus] = useState('pending');

  const handleConfirmAppointment = () => setAppointmentStatus('confirmed');
  const handleRejectAppointment = () => setAppointmentStatus('rejected');

  const tabs = [
    { id: 'details', label: 'Vehicle Details' },
    { id: 'services', label: 'Requested Services' },
    { id: 'history', label: 'Service History' },
    { id: 'photos', label: 'Photos' },
    { id: 'notes', label: 'Notes' }
  ];

  const serviceHistory = [
    { date: '2024-05-15', service: 'Oil Change & Filter', mileage: '45,230 miles', cost: '$89.99', shop: 'QuickLube Plus' },
    { date: '2024-03-10', service: 'Brake Pad Replacement', mileage: '44,100 miles', cost: '$249.99', shop: 'Brake Masters' },
    { date: '2024-01-22', service: 'Annual Inspection', mileage: '43,200 miles', cost: '$35.00', shop: 'State Inspection Center' }
  ];

  const requestedServices = [
    { name: 'Oil Change & Filter', description: 'Replace engine oil and oil filter with premium synthetic oil', cost: '$89.99', hours: '0.5' },
    { name: 'Brake Inspection', description: 'Comprehensive brake system inspection including pads, rotors, and fluid', cost: '$45.00', hours: '0.5' },
    { name: 'Front Brake Pad Replacement', description: 'Replace front brake pads with premium quality ceramic pads', cost: '$189.99', hours: '1.5' },
    { name: 'Brake Fluid Flush', description: 'Complete brake fluid replacement and system flush', cost: '$89.99', hours: '1.0' },
    { name: 'Air Filter Replacement', description: 'Replace engine air filter for optimal performance', cost: '$35.00', hours: '0.25' }
  ];

  const totalCost = requestedServices.reduce((sum, service) => sum + parseFloat(service.cost.replace('$', '')), 0);
  const totalHours = requestedServices.reduce((sum, service) => sum + parseFloat(service.hours), 0);

  return (
    <div className="appointment-details-page">
      <div className="metric-cards-row">
        <MetricCard title="License Plate" amount="ABC-1234" change="" changeType="" />
        <MetricCard title="Current Mileage" amount="47,850" change="" changeType="" />
        <MetricCard title="Estimated Price" amount="$275" change="" changeType="" />
        <MetricCard title="Estimated Time" amount="2-3" change="" changeType="" />
      </div>

      <div className="info-cards-row">
        <div className="info-card">
          <div className="card-header">
            <h3 className="card-title">Customer Information</h3>
          </div>
          <div className="card-content">
            <div className="customer-profile">
              <div className="customer-avatar">
                <User className="avatar-icon" />
              </div>
              <div className="customer-info">
                <p className="customer-name">Sarah Johnson</p>
                <p className="customer-type">Regular Customer</p>
              </div>
            </div>
            <div className="contact-info">
              <div className="contact-item">
                <Phone className="contact-icon" />
                <span className="contact-text">(555) 123-4567</span>
              </div>
              <div className="contact-item">
                <MessageCircle className="contact-icon" />
                <span className="contact-text">sarah.johnson@email.com</span>
              </div>
            </div>
            <div className="contact-buttons">
              <button className="call-button">Call Customer</button>
              <button className="message-button">Message</button>
            </div>
          </div>
        </div>

        <div className="info-card">
          <div className="card-header">
            <h3 className="card-title">Appointment Details</h3>
          </div>
          <div className="card-content">
            <div className="appointment-info">
              <div className="info-item">
                <Calendar className="info-icon" />
                <span className="info-text">Tomorrow, July 6th, 2025</span>
              </div>
              <div className="info-item">
                <Clock className="info-icon" />
                <span className="info-text">2:00 PM - 5:00 PM</span>
              </div>
              <div className="info-item">
                <MapPin className="info-icon" />
                <span className="info-text">Bay 3 - Brake Service</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="vehicle-overview-card">
        <div className="card-header">
          <h2 className="vehicle-title">Toyota Camry 2022</h2>
          <span className="service-badge">Brake Service Required</span>
        </div>
        
        <div className="vehicle-image-container">
          <img 
            src="https://www.hdwallpapers.in/download/toyota_camry_hybrid_ws_leather_package_2021_4k_5k_hd_cars-HD.jpg" 
            alt="Toyota Camry 2022" 
            className="vehicle-image"
          />
        </div>

        <div className="tabs-container">
          <div className="tabs-nav">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`tab-button${selectedTab === tab.id ? ' active' : ''}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="tab-content">
          {selectedTab === 'details' && (
            <div className="details-content">
              <div className="details-grid">
                <div className="detail-item">
                  <label className="detail-label">VIN Number</label>
                  <p className="detail-value">1HGCM82633A123456</p>
                </div>
                <div className="detail-item">
                  <label className="detail-label">Current Mileage</label>
                  <p className="detail-value">47,850 miles</p>
                </div>
                <div className="detail-item">
                  <label className="detail-label">License Plate</label>
                  <p className="detail-value">ABC-1234</p>
                </div>
                <div className="detail-item">
                  <label className="detail-label">Year</label>
                  <p className="detail-value">2022</p>
                </div>
              </div>
              <div className="detail-item full-width">
                <label className="detail-label">Requested Service</label>
                <p className="detail-value">Brake inspection and possible pad replacement. Customer reports squeaking noise when braking.</p>
              </div>
              <div className="detail-item full-width">
                <label className="detail-label">Customer Notes</label>
                <p className="detail-value">"The brakes have been making a squeaking sound for the past week, especially when stopping at traffic lights. No grinding noise yet, but want to get it checked before it gets worse."</p>
              </div>
            </div>
          )}

          {selectedTab === 'services' && (
            <div className="services-content">
              {requestedServices.map((service, index) => (
                <div key={index} className="service-item">
                  <h4 className="service-name">{service.name}</h4>
                  <p className="service-description">{service.description}</p>
                  <div className="service-details">
                    <span className="service-cost">{service.cost}</span>
                    <span className="service-hours">{service.hours} hours</span>
                  </div>
                </div>
              ))}
              <div className="total-cost">
                <span className="label">Total Cost:</span>
                <span className="value">{totalCost.toFixed(2)}</span>
              </div>
              <div className="total-hours">
                <span className="label">Total Hours:</span>
                <span className="value">{totalHours.toFixed(2)}</span>
              </div>
            </div>
          )}

          {selectedTab === 'history' && (
            <div className="history-content">
              {serviceHistory.map((record, index) => (
                <div key={index} className="history-record">
                  <div className="record-header">
                    <h4 className="service-name">{record.service}</h4>
                    <span className="service-date">{record.date}</span>
                  </div>
                  <div className="record-details">
                    <div className="record-item">
                      <span className="record-label">Mileage:</span>
                      <span className="record-value">{record.mileage}</span>
                    </div>
                    <div className="record-item">
                      <span className="record-label">Cost:</span>
                      <span className="record-value">{record.cost}</span>
                    </div>
                    <div className="record-item">
                      <span className="record-label">Shop:</span>
                      <span className="record-value">{record.shop}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedTab === 'photos' && (
            <div className="photos-content">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="photo-placeholder">
                  <Camera className="camera-icon" />
                  <p className="photo-text">Photo {i}</p>
                </div>
              ))}
            </div>
          )}

          {selectedTab === 'notes' && (
            <div className="notes-content">
              <div className="warning-note">
                <div className="note-content">
                  <AlertCircle className="warning-icon" />
                  <div className="note-text">
                    <h4 className="note-title">Important Notes</h4>
                    <p className="note-description">
                      Customer mentioned they recently had brake work done at another shop 6 months ago. May need to verify warranty status before proceeding.
                    </p>
                  </div>
                </div>
              </div>
              <div className="info-note">
                <h4 className="note-title">Technician Recommendations</h4>
                <ul className="recommendations-list">
                  <li>Check brake fluid level and condition</li>
                  <li>Inspect brake pads and rotors</li>
                  <li>Test brake performance</li>
                  <li>Document findings with photos</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetails;