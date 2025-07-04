import React, { useState } from 'react';
import KanbanBoard from '../../components/KanbanBoard/KanbanBoard';
import type { WorkOrder } from '../../types/WorkOrder';
import { FileText, Calendar, Search, Users, Clock, Star, Bookmark } from 'lucide-react';
import './KanbanPage.scss';

interface JobCardFormData {
  title: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  vehicleMake: string;
  vehicleModel: string;
  licenseNumber: string;
  engineNumber: string;
  recordedMileage: string;
  itemsInCar: string;
  customerProblem: string;
}

const KanbanPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [showJobCardModal, setShowJobCardModal] = useState(false);
  const [jobCardOption, setJobCardOption] = useState<'new' | 'existing' | null>(null);
  const [appointmentNumber, setAppointmentNumber] = useState('');
  const [assignedFilter, setAssignedFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  const [showBookmarked, setShowBookmarked] = useState(false);
  const [jobCardForm, setJobCardForm] = useState<JobCardFormData>({
    title: '',
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    vehicleMake: '',
    vehicleModel: '',
    licenseNumber: '',
    engineNumber: '',
    recordedMileage: '',
    itemsInCar: '',
    customerProblem: ''
  });

  // Sample data 
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([
    {
      id: 'EST-1037',
      title: 'ABS System Inspect and 6 more',
      customer: 'Zoe Stewart',
      vehicle: '2020 Toyota Tacoma TRD Sport',
      year: 2020,
      estimateNumber: 'EST-1037',
      amount: 1095.84,
      hours: { left: 0, billed: 0 },
      tags: ['Follow Up'],
      image: 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg',
      status: 'opened'
    },
    {
      id: 'RO-1002',
      title: 'Premium Oil Change - Full Synthetic and...',
      customer: 'Benjamin Clarke',
      vehicle: '2021 Ford F-150 Lariat',
      year: 2021,
      estimateNumber: 'RO-1002',
      amount: 147.80,
      hours: { left: 0.4, billed: 0.4 },
      tags: ['New Client', 'Friends & Family'],
      image: 'https://images.pexels.com/photos/14038622/pexels-photo-14038622.jpeg',
      status: 'in-progress'
    },
    {
      id: 'RO-1003',
      title: 'Engine Air Filter Element R&R and 2 more',
      customer: 'Subaru Crosstrek Wilderness',
      vehicle: '2024 Subaru Crosstrek Wilderness',
      year: 2024,
      estimateNumber: 'RO-1003',
      amount: 322.09,
      hours: { left: 0.75, billed: 0.92 },
      tags: ['Buy 2 Get 1'],
      image: 'https://images.pexels.com/photos/810357/pexels-photo-810357.jpeg',
      status: 'on-hold'
    },
    {
      id: 'INV-1005',
      title: 'Spark Plugs R&R',
      customer: 'Bella Evans',
      vehicle: '2015 Toyota 4Runner Trail',
      year: 2015,
      estimateNumber: 'INV-1005',
      amount: 419.24,
      hours: { left: 0, billed: 2 },
      tags: ['Same Day Pick Up'],
      image: 'https://images.pexels.com/photos/977003/pexels-photo-977003.jpeg',
      status: 'completed'
    },
    {
      id: 'RO-1013',
      title: 'Premium Oil Change - Full Synthetic',
      customer: 'Base',
      vehicle: '2023 Lexus NX350 Base',
      year: 2023,
      estimateNumber: 'RO-1013',
      amount: 0,
      hours: { left: 0, billed: 0 },
      tags: ['Waiting on Approval', 'New Client'],
      image: 'https://images.pexels.com/photos/1007410/pexels-photo-1007410.jpeg',
      status: 'opened'
    },
    {
      id: 'INV-1004',
      title: 'Clutch Assembly R&R and 2 more',
      customer: '',
      vehicle: '',
      year: 0,
      estimateNumber: 'INV-1004',
      amount: 0,
      hours: { left: 0, billed: 0 },
      tags: [],
      image: 'https://images.pexels.com/photos/1035108/pexels-photo-1035108.jpeg',
      status: 'completed'
    },
    {
      id: 'RO-1014',
      title: 'Check Engine Light Diagnosis',
      customer: 'Olivia Martinez',
      vehicle: '2019 Honda CR-V',
      year: 2019,
      estimateNumber: 'RO-1014',
      amount: 85.00,
      hours: { left: 1, billed: 0 },
      tags: ['Diagnostics'],
      image: 'https://images.pexels.com/photos/4488636/pexels-photo-4488636.jpeg',
      status: 'in-progress',
      assignedPeople: [{ id: 'tech1', name: 'Mike Johnson', profilePhoto: 'https://i.pravatar.cc/' }]
    },
    {
      id: 'RO-1015',
      title: 'Brake Pad Replacement',
      customer: 'Liam Garcia',
      vehicle: '2017 Chevrolet Malibu',
      year: 2017,
      estimateNumber: 'RO-1015',
      amount: 350.50,
      hours: { left: 2.5, billed: 1 },
      tags: ['Brakes', 'Maintenance'],
      image: 'https://images.pexels.com/photos/8986161/pexels-photo-8986161.jpeg',
      status: 'in-progress',
      assignedPeople: [{ id: 'tech2', name: 'Sarah Lee', profilePhoto: 'https://i.pravatar.cc/' }]
    },
    {
      id: 'EST-1038',
      title: 'Full Vehicle Inspection',
      customer: 'Sophia Rodriguez',
      vehicle: '2022 Hyundai Palisade',
      year: 2022,
      estimateNumber: 'EST-1038',
      amount: 150.00,
      hours: { left: 2, billed: 0 },
      tags: ['Inspection', 'New Client'],
      image: 'https://images.pexels.com/photos/16383245/pexels-photo-16383245.jpeg',
      status: 'opened',
      assignedPeople: [{ id: 'tech3', name: 'John Smith', profilePhoto: 'https://i.pravatar.cc/' }, { id: 'tech2', name: 'Sarah Lee', profilePhoto: 'https://i.pravatar.cc/' }]
    }
  ]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (filters: string[]) => {
    setSelectedFilters(filters);
  };

  const handleCreateJobCard = () => {
    setShowJobCardModal(true);
  };

  const handleCloseModal = () => {
    setShowJobCardModal(false);
    setJobCardOption(null);
    setAppointmentNumber('');
    setJobCardForm({
      title: '',
      customerName: '',
      customerPhone: '',
      customerEmail: '',
      vehicleMake: '',
      vehicleModel: '',
      licenseNumber: '',
      engineNumber: '',
      recordedMileage: '',
      itemsInCar: '',
      customerProblem: ''
    });
  };

  const handleOptionSelect = (option: 'new' | 'existing') => {
    setJobCardOption(option);
  };

  const handleFormChange = (field: keyof JobCardFormData, value: string) => {
    setJobCardForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreateNewJobCard = () => {
    // Here you would typically make an API call to create the job card
    console.log('Creating new job card:', jobCardForm);
    // After successful creation, you would navigate to the new job card page
    // or update the state to show the new card
    handleCloseModal();
  };

  const handleCreateFromAppointment = () => {
    // Here you would typically make an API call to create job card from appointment
    console.log('Creating job card from appointment:', appointmentNumber);
    // After successful creation, you would navigate to the new job card page
    handleCloseModal();
  };

  const handleCardMove = (cardId: string, newStatus: WorkOrder['status']) => {
    setWorkOrders(prev => 
      prev.map(order => 
        order.id === cardId 
          ? { ...order, status: newStatus }
          : order
      )
    );
  };

  return (
    <>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title">

        </div>
        <div className="page-controls">
          <div className="search-and-filters">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="filter-buttons">
              <button 
                className={`filter-button ${assignedFilter ? 'active' : ''}`}
                onClick={() => setAssignedFilter(assignedFilter ? '' : 'assigned')}
              >
                <Users size={16} />
                <span>Assigned to</span>
              </button>
              
              <button 
                className={`filter-button ${dateFilter ? 'active' : ''}`}
                onClick={() => setDateFilter(dateFilter ? '' : 'date')}
              >
                <Clock size={16} />
                <span>Date</span>
              </button>
              
              <button 
                className={`filter-button ${priorityFilter ? 'active' : ''}`}
                onClick={() => setPriorityFilter(priorityFilter ? '' : 'priority')}
              >
                <Star size={16} />
                <span>Priority</span>
              </button>
              
              <button 
                className={`filter-button ${showBookmarked ? 'active' : ''}`}
                onClick={() => setShowBookmarked(!showBookmarked)}
              >
                <Bookmark size={16} />
                <span>Bookmarked</span>
              </button>
            </div>
          </div>
          <button className="create-job-card-button" onClick={handleCreateJobCard}>
            + Create a Job Card
          </button>
        </div>
      </div>

      {/* Main Kanban Content */}
      <KanbanBoard 
        workOrders={workOrders}
        onCardMove={handleCardMove}
        searchTerm={searchTerm}
        selectedFilters={selectedFilters}
      />

      {/* Job Card Modal */}
      {showJobCardModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Create a Job Card</h2>
              <button className="close-button" onClick={handleCloseModal}>
                ×
              </button>
            </div>

            {!jobCardOption && (
              <div className="modal-body">
                <div className="option-selection">
                  <h3>Choose an option:</h3>
                  <div className="option-buttons">
                    <button 
                      className="option-button"
                      onClick={() => handleOptionSelect('new')}
                    >
                      <div className="option-icon">
                        <FileText size={24} />
                      </div>
                      <div className="option-text">
                        <h4>Create a New Job Card</h4>
                        <p>Start fresh with a completely new job card</p>
                      </div>
                    </button>
                    <button 
                      className="option-button"
                      onClick={() => handleOptionSelect('existing')}
                    >
                      <div className="option-icon">
                        <Calendar size={24} />
                      </div>
                      <div className="option-text">
                        <h4>Create from Existing Appointment</h4>
                        <p>Use information from an existing appointment</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {jobCardOption === 'new' && (
              <div className="modal-body">
                <div className="job-card-form">
                  <h3>New Job Card Details</h3>
                  <form>
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input
                          type="text"
                          id="title"
                          value={jobCardForm.title}
                          onChange={(e) => handleFormChange('title', e.target.value)}
                          placeholder="Enter job title"
                        />
                        <small>Job number will be created automatically</small>
                      </div>
                    </div>

                    <div className="form-section">
                      <h4>Customer Information</h4>
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="customerName">Customer Name *</label>
                          <input
                            type="text"
                            id="customerName"
                            value={jobCardForm.customerName}
                            onChange={(e) => handleFormChange('customerName', e.target.value)}
                            placeholder="Enter customer name"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="customerPhone">Phone *</label>
                          <input
                            type="tel"
                            id="customerPhone"
                            value={jobCardForm.customerPhone}
                            onChange={(e) => handleFormChange('customerPhone', e.target.value)}
                            placeholder="Enter phone number"
                            required
                          />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="customerEmail">Email *</label>
                          <input
                            type="email"
                            id="customerEmail"
                            value={jobCardForm.customerEmail}
                            onChange={(e) => handleFormChange('customerEmail', e.target.value)}
                            placeholder="Enter email address"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-section">
                      <h4>Vehicle Information</h4>
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="vehicleMake">Vehicle Make *</label>
                          <input
                            type="text"
                            id="vehicleMake"
                            value={jobCardForm.vehicleMake}
                            onChange={(e) => handleFormChange('vehicleMake', e.target.value)}
                            placeholder="e.g., Toyota"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="vehicleModel">Vehicle Model *</label>
                          <input
                            type="text"
                            id="vehicleModel"
                            value={jobCardForm.vehicleModel}
                            onChange={(e) => handleFormChange('vehicleModel', e.target.value)}
                            placeholder="e.g., Camry"
                            required
                          />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="licenseNumber">License Number *</label>
                          <input
                            type="text"
                            id="licenseNumber"
                            value={jobCardForm.licenseNumber}
                            onChange={(e) => handleFormChange('licenseNumber', e.target.value)}
                            placeholder="Enter license plate number"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="engineNumber">Engine Number</label>
                          <input
                            type="text"
                            id="engineNumber"
                            value={jobCardForm.engineNumber}
                            onChange={(e) => handleFormChange('engineNumber', e.target.value)}
                            placeholder="Enter engine number"
                          />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="recordedMileage">Recorded Mileage</label>
                          <input
                            type="text"
                            id="recordedMileage"
                            value={jobCardForm.recordedMileage}
                            onChange={(e) => handleFormChange('recordedMileage', e.target.value)}
                            placeholder="Enter current mileage"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-section">
                      <h4>Additional Information</h4>
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="itemsInCar">Items in Car</label>
                          <textarea
                            id="itemsInCar"
                            value={jobCardForm.itemsInCar}
                            onChange={(e) => handleFormChange('itemsInCar', e.target.value)}
                            placeholder="List any items left in the vehicle"
                            rows={3}
                          />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="customerProblem">Customer Problem *</label>
                          <textarea
                            id="customerProblem"
                            value={jobCardForm.customerProblem}
                            onChange={(e) => handleFormChange('customerProblem', e.target.value)}
                            placeholder="Describe the customer's problem or requested service"
                            rows={4}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button className="cancel-button" onClick={handleCloseModal}>
                    Cancel
                  </button>
                  <button className="create-button" onClick={handleCreateNewJobCard}>
                    Create Job Card
                  </button>
                </div>
              </div>
            )}

            {jobCardOption === 'existing' && (
              <div className="modal-body">
                <div className="appointment-form">
                  <h3>Create from Existing Appointment</h3>
                  <div className="form-group">
                    <label htmlFor="appointmentNumber">Appointment Number *</label>
                    <input
                      type="text"
                      id="appointmentNumber"
                      value={appointmentNumber}
                      onChange={(e) => setAppointmentNumber(e.target.value)}
                      placeholder="Enter appointment number"
                      required
                    />
                    <small>Previous appointment information will be used</small>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="cancel-button" onClick={handleCloseModal}>
                    Cancel
                  </button>
                  <button 
                    className="create-button" 
                    onClick={handleCreateFromAppointment}
                    disabled={!appointmentNumber.trim()}
                  >
                    Create Job Card
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default KanbanPage;