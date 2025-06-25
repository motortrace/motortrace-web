// AppointmentModal.tsx
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import type { PendingRequest } from '../../types/PendingRequest';
import './AppointmentModal.scss';

interface ServiceItem {
  name: string;
  charge: number;
  estimatedDuration: number;
  assignedTechnician: string | null;
}

interface Technician {
  id: string;
  name: string;
  currentJobs: number;
  skillLevel: 'Junior' | 'Senior' | 'Expert';
  availability: 'Available' | 'Busy' | 'Off';
}

interface TimeSlotConflict {
  hasConflict: boolean;
  conflictDetails?: string;
}

interface AppointmentModalProps {
  isOpen: boolean;
  request: PendingRequest | null;
  onClose: () => void;
  onConfirm: (updatedRequest: Omit<PendingRequest, 'services'> & {
    services: ServiceItem[];
    estimatedPrice: number;
    images: string[];
    errorCodes: string[];
    customerNotes: string;
    estimatedDuration: number;
  }) => void;
}

const AppointmentModal: React.FC<AppointmentModalProps> = ({ isOpen, request, onClose, onConfirm }) => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [errorCodes] = useState<string[]>(['P0300', 'P0171']);
  const [newService, setNewService] = useState<string>('');
  const [customerNotes, setCustomerNotes] = useState<string>('');
  const [showHistory, setShowHistory] = useState(false);

  // Mock data for technicians
  const technicians: Technician[] = [
    { id: 'tech1', name: 'Alex Kumar', currentJobs: 3, skillLevel: 'Expert', availability: 'Available' },
    { id: 'tech2', name: 'Nisha Patel', currentJobs: 2, skillLevel: 'Senior', availability: 'Available' },
    { id: 'tech3', name: 'Ravi Singh', currentJobs: 1, skillLevel: 'Junior', availability: 'Available' },
    { id: 'tech4', name: 'Maria Santos', currentJobs: 4, skillLevel: 'Senior', availability: 'Busy' },
  ];

  // Mock time slot conflict check
  const checkTimeSlotConflict = (date: string, time: string): TimeSlotConflict => {
    const conflictChance = Math.random();
    if (conflictChance > 0.7) {
      return {
        hasConflict: true,
        conflictDetails: `${technicians[0].name} already has 1 job scheduled for this time slot`
      };
    }
    return { hasConflict: false };
  };

  const [timeSlotConflict, setTimeSlotConflict] = useState<TimeSlotConflict>({ hasConflict: false });

  useEffect(() => {
    if (request) {
      const initialServices = request.services.map(serviceName => ({
        name: serviceName,
        charge: 50 + Math.floor(Math.random() * 100),
        estimatedDuration: 30 + Math.floor(Math.random() * 60),
        assignedTechnician: null
      }));
      setServices(initialServices);
      setImages([]);
      setCustomerNotes(request.notes || "");
      
      const conflict = checkTimeSlotConflict(request.requestedDate, request.requestedTime);
      setTimeSlotConflict(conflict);
    }
  }, [request]);

  if (!request) return null;

  const addService = () => {
    if (newService.trim()) {
      const newServiceItem: ServiceItem = {
        name: newService.trim(),
        charge: 25 + Math.floor(Math.random() * 75),
        estimatedDuration: 20 + Math.floor(Math.random() * 40),
        assignedTechnician: null
      };
      setServices([...services, newServiceItem]);
      setNewService('');
    }
  };

  const removeService = (indexToRemove: number) => {
    setServices(services.filter((_, index) => index !== indexToRemove));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const urls = Array.from(files).map(file => URL.createObjectURL(file));
    setImages(prev => [...prev, ...urls]);
  };

  const handleTechAssignment = (serviceIndex: number, techId: string | null) => {
    const updatedServices = [...services];
    updatedServices[serviceIndex].assignedTechnician = techId;
    setServices(updatedServices);
  };

  // Calculate totals
  const estimatedPrice = services.reduce((total, service) => total + service.charge, 0);
  const estimatedDuration = services.reduce((total, service) => total + service.estimatedDuration, 0);

  const isReadyToConfirm = services.every(service => service.assignedTechnician !== null);

  const handleConfirm = () => {
    if (!isReadyToConfirm) {
      alert('Please assign technicians to all services before confirming.');
      return;
    }
    
    onConfirm({
      ...request,
      services,
      estimatedPrice,
      images,
      errorCodes,
      customerNotes,
      estimatedDuration,
    });
    onClose();
  };

  // Hardcoded data for demonstration
  const vehicleHistory = [
    { date: '2023-11-20', service: 'Brake Pad Replacement', cost: 150.00, mileage: 68500 },
    { date: '2023-05-10', service: 'Oil Change', cost: 65.00, mileage: 64200 },
    { date: '2023-01-15', service: 'Tire Rotation', cost: 35.00, mileage: 61200 },
    { date: '2022-11-30', service: 'Battery Replacement', cost: 120.00, mileage: 59800 },
  ];

  const visibleHistory = showHistory ? vehicleHistory : vehicleHistory.slice(0, 2);

  const vehicleInfo = {
    mileage: 72000,
    lastServiceDate: '2023-11-20',
    lastServiceMileage: 68500
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Appointment Details"
      className="appointment-modal"
      overlayClassName="modal-overlay"
      appElement={document.getElementById('root') || undefined}
    >
      <h2>
        Appointment Details - {request.id}
        <button className="close-btn" onClick={onClose}>×</button>
      </h2>
      
      <div className="modal-content">
        <div className="modal-layout">
          {/* Left Panel */}
          <div className="left-panel">
            <div className="modal-section">
              <h3>Customer Details</h3>
              <div className="customer-info">
                <img 
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(request.customer)}&background=random`} 
                  alt={request.customer}
                  className="customer-avatar"
                />
                <div>
                  <p><strong>Name:</strong> {request.customer}</p>
                  <p><strong>Phone:</strong> {request.phone}</p>
                  <button 
                    className="view-profile-btn"
                    onClick={() => alert(`Navigating to ${request.customer}'s profile`)}
                  >
                    View Profile
                  </button>
                </div>
              </div>
            </div>

            <div className="modal-section">
              <h3>Vehicle Details</h3>
              <div className="vehicle-details">
                <div className="vehicle-image-container">
                  <img 
                    src="https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80" 
                    alt={request.vehicle} 
                    className="vehicle-image"
                  />
                </div>
                <p><strong>Vehicle:</strong> {request.vehicle}</p>
                <p><strong>Odometer:</strong> {vehicleInfo.mileage.toLocaleString()} km</p>
                <p><strong>Last Service:</strong> {vehicleInfo.lastServiceDate} ({vehicleInfo.lastServiceMileage.toLocaleString()} km)</p>
                <p><strong>Requested At:</strong> {request.requestedDate} {request.requestedTime}</p>
                {timeSlotConflict.hasConflict && (
                  <div className="conflict-warning">
                    ⚠️ {timeSlotConflict.conflictDetails}
                  </div>
                )}
              </div>
            </div>

            <div className="modal-section">
              <h3>Customer Notes</h3>
              <textarea
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                placeholder="Customer comments, urgency notes, specific issues..."
                rows={3}
                className="notes-textarea"
              />
            </div>

            <div className="modal-section">
              <div className="section-header">
                <h3>Vehicle Service History</h3>
                <button 
                  className="view-all-btn"
                  onClick={() => setShowHistory(!showHistory)}
                >
                  {showHistory ? 'Show Less' : 'View All'}
                </button>
              </div>
              <table className="history-table">
                <thead>
                  <tr><th>Date</th><th>Service</th><th>Cost</th><th>Mileage</th></tr>
                </thead>
                <tbody>
                  {visibleHistory.map((item, i) => (
                    <tr key={i}>
                      <td>{item.date}</td>
                      <td>{item.service}</td>
                      <td>${item.cost.toFixed(2)}</td>
                      <td>{item.mileage.toLocaleString()} km</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Panel */}
          <div className="right-panel">
            <div className="modal-section">
              <h3>Services Required</h3>
              <table className="services-table">
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Duration</th>
                    <th>Charge</th>
                    <th>Technician</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((service, index) => (
                    <tr key={index}>
                      <td>{service.name}</td>
                      <td>{service.estimatedDuration} min</td>
                      <td>${service.charge.toFixed(2)}</td>
                      <td>
                        <select
                          value={service.assignedTechnician || ''}
                          onChange={(e) => handleTechAssignment(index, e.target.value || null)}
                          className="technician-select"
                        >
                          <option value="">Select Technician</option>
                          {technicians.map(tech => (
                            <option 
                              key={tech.id} 
                              value={tech.id}
                              disabled={tech.availability === 'Busy'}
                            >
                              {tech.name} ({tech.skillLevel}) - {tech.availability}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <button className="remove-btn" onClick={() => removeService(index)}>Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="add-row">
                <input
                  type="text"
                  value={newService}
                  placeholder="Add a new service..."
                  onChange={e => setNewService(e.target.value)}
                />
                <button onClick={addService}>Add Service</button>
              </div>
              <div className="totals-summary">
                <div className="total-item">
                  <strong>Estimated Duration:</strong> {Math.floor(estimatedDuration / 60)}h {estimatedDuration % 60}m
                </div>
                <div className="total-item">
                  <strong>Estimated Cost:</strong> ${estimatedPrice.toFixed(2)}
                </div>
              </div>
            </div>

            <div className="modal-section">
              <h3>OBD Error Codes</h3>
              <ul className="error-list">
                {errorCodes.map((e,i) => <li key={i}>{e}</li>)}
              </ul>
            </div>

            <div className="modal-section">
              <h3>Images & Documentation</h3>
              <input type="file" multiple accept="image/*" onChange={handleImageUpload} />
              <div className="image-grid">
                {images.map((src,i) => <img key={i} src={src} alt={`upload-${i}`} />)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="modal-actions">
        <button 
          className={`confirm-btn ${isReadyToConfirm ? 'ready' : 'not-ready'}`} 
          onClick={handleConfirm}
        >
          {isReadyToConfirm ? 'Confirm Appointment' : 'Assign Technicians First'}
        </button>
        <button className="cancel-btn" onClick={onClose}>Cancel</button>
      </div>
    </Modal>
  );
};

export default AppointmentModal;