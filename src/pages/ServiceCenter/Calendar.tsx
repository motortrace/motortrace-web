import React, { useState } from 'react';
import DashboardHeader from '../../layouts/DashboardHeader/DashboardHeader';
import './Calendar.scss';
import WalkInAppointmentModal from '../../components/WalkInAppointmentModel/WalkInAppointmentModel';
import ViewRequestModal from '../../components/WalkInAppointmentModel/ViewRequestModal';

interface IncomingRequest {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  vehicleInfo: string;
  licensePlate: string;
  servicesRequested: string[];
  estimatedCharge: number;
  preferredDate: string;
  preferredTime: string;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  notes?: string;
}

interface Appointment {
  id: string;
  customerName: string;
  customerPhone: string;
  vehicleInfo: string;
  licensePlate: string;
  services: string[];
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  assignedTechnician: string;
  bay: string;
  totalCharge: number;
  depositPaid: number;
  notes?: string;
  createdAt: string;
}

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showWalkInModal, setShowWalkInModal] = useState(false);
  const [viewRequest, setViewRequest] = useState<IncomingRequest | null>(null);

  // Sample incoming requests data
  const [incomingRequests] = useState<IncomingRequest[]>([
    {
      id: 'req-001',
      customerName: 'Sarah Johnson',
      customerPhone: '(555) 123-4567',
      customerEmail: 'sarah.johnson@email.com',
      vehicleInfo: '2020 Toyota Camry',
      licensePlate: 'ABC-1234',
      servicesRequested: ['Oil Change', 'Brake Inspection', 'Tire Rotation'],
      estimatedCharge: 189.99,
      preferredDate: '2024-07-02',
      preferredTime: '10:00',
      urgency: 'medium',
      status: 'pending',
      createdAt: '2024-06-30T14:30:00Z',
      notes: 'Customer prefers morning appointment'
    },
    {
      id: 'req-002',
      customerName: 'Benjamin Clarke',
      customerPhone: '(555) 234-5678',
      customerEmail: 'benjamin.clarke@email.com',
      vehicleInfo: '2021 Ford F-150 Lariat',
      licensePlate: 'XYZ-5678',
      servicesRequested: ['Engine Diagnostic', 'AC System Check'],
      estimatedCharge: 245.00,
      preferredDate: '2024-07-01',
      preferredTime: '14:00',
      urgency: 'high',
      status: 'pending',
      createdAt: '2024-06-30T16:15:00Z',
      notes: 'Check engine light is on'
    },
    {
      id: 'req-003',
      customerName: 'Olivia Martinez',
      customerPhone: '(555) 345-6789',
      customerEmail: 'olivia.martinez@email.com',
      vehicleInfo: '2019 Honda CR-V',
      licensePlate: 'DEF-9012',
      servicesRequested: ['Brake Pad Replacement', 'Brake Fluid Flush'],
      estimatedCharge: 320.50,
      preferredDate: '2024-07-03',
      preferredTime: '09:00',
      urgency: 'urgent',
      status: 'pending',
      createdAt: '2024-06-30T18:45:00Z',
      notes: 'Brakes making grinding noise'
    },
    {
      id: 'req-004',
      customerName: 'Liam Garcia',
      customerPhone: '(555) 456-7890',
      customerEmail: 'liam.garcia@email.com',
      vehicleInfo: '2017 Chevrolet Malibu',
      licensePlate: 'GHI-3456',
      servicesRequested: ['Full Vehicle Inspection', 'Oil Change'],
      estimatedCharge: 125.00,
      preferredDate: '2024-07-02',
      preferredTime: '15:00',
      urgency: 'low',
      status: 'pending',
      createdAt: '2024-06-30T20:20:00Z'
    }
  ]);

  // Sample appointments data
  const [appointments] = useState<Appointment[]>([
    {
      id: 'apt-001',
      customerName: 'Emma Wilson',
      customerPhone: '(555) 567-8901',
      vehicleInfo: '2018 Nissan Rogue',
      licensePlate: 'MNO-2345',
      services: ['Oil Change', 'Filter Replacement'],
      startTime: '09:00',
      endTime: '10:00',
      duration: 60,
      status: 'scheduled',
      assignedTechnician: 'Mike Johnson',
      bay: 'Bay 1',
      totalCharge: 89.99,
      depositPaid: 20.00,
      createdAt: '2024-06-29T10:00:00Z'
    },
    {
      id: 'apt-002',
      customerName: 'David Brown',
      customerPhone: '(555) 678-9012',
      vehicleInfo: '2020 Honda Civic',
      licensePlate: 'PQR-6789',
      services: ['Brake Inspection', 'Tire Rotation'],
      startTime: '10:30',
      endTime: '11:30',
      duration: 60,
      status: 'scheduled',
      assignedTechnician: 'Sarah Lee',
      bay: 'Bay 2',
      totalCharge: 145.00,
      depositPaid: 50.00,
      createdAt: '2024-06-29T11:30:00Z'
    },
    {
      id: 'apt-003',
      customerName: 'Sophia Rodriguez',
      customerPhone: '(555) 789-0123',
      vehicleInfo: '2022 Hyundai Palisade',
      licensePlate: 'STU-0123',
      services: ['Engine Diagnostic', 'AC System Check'],
      startTime: '13:00',
      endTime: '14:30',
      duration: 90,
      status: 'scheduled',
      assignedTechnician: 'Mike Johnson',
      bay: 'Bay 1',
      totalCharge: 245.00,
      depositPaid: 100.00,
      notes: 'Check engine light on',
      createdAt: '2024-06-29T14:00:00Z'
    },
    {
      id: 'apt-004',
      customerName: 'Lisa Anderson',
      customerPhone: '(555) 890-1234',
      vehicleInfo: '2019 Toyota Highlander',
      licensePlate: 'VWX-4567',
      services: ['Transmission Service', 'Fluid Check'],
      startTime: '15:00',
      endTime: '17:00',
      duration: 120,
      status: 'scheduled',
      assignedTechnician: 'Sarah Lee',
      bay: 'Bay 2',
      totalCharge: 320.00,
      depositPaid: 150.00,
      createdAt: '2024-06-29T15:30:00Z'
    }
  ]);

  // Calendar functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isToday = (day: number) => {
    const today = new Date();
    return today.getDate() === day && 
           today.getMonth() === currentMonth.getMonth() && 
           today.getFullYear() === currentMonth.getFullYear();
  };

  const isSelectedDate = (day: number) => {
    return selectedDate.getDate() === day && 
           selectedDate.getMonth() === currentMonth.getMonth() && 
           selectedDate.getFullYear() === currentMonth.getFullYear();
  };

  const handleDateClick = (day: number) => {
    setSelectedDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const getUrgencyColor = (urgency: IncomingRequest['urgency']) => {
    switch (urgency) {
      case 'urgent': return '#ef4444';
      case 'high': return '#f59e0b';
      case 'medium': return '#3b82f6';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'scheduled': return '#3b82f6';
      case 'in-progress': return '#f59e0b';
      case 'completed': return '#10b981';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const formatTime = (time: string) => {
    return time;
  };

  const formatCurrency = (amount: number) => {
    return `LKR ${amount.toFixed(2)}`;
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayClass = `calendar-day ${isToday(day) ? 'today' : ''} ${isSelectedDate(day) ? 'selected' : ''}`;
      days.push(
        <div 
          key={day} 
          className={dayClass}
          onClick={() => handleDateClick(day)}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  const handleApproveRequest = (requestId: string) => {
    console.log('Approve request:', requestId);
  };

  const handleRejectRequest = (requestId: string) => {
    console.log('Reject request:', requestId);
  };

  const handleScheduleAppointment = (requestId: string) => {
    console.log('Schedule appointment for request:', requestId);
  };

  return (
    <div className="calendar-page">

      <div className="calendar-container">
        {/* Left Panel - Calendar and Incoming Requests */}
        <div className="calendar-left-panel">
          {/* Calendar */}
          <div className="calendar-section">
            <div className="calendar-header">
              <button className="calendar-nav-btn" onClick={handlePrevMonth}>
                <i className='bx bx-chevron-left'></i>
              </button>
              <h2 className="calendar-title">
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              <button className="calendar-nav-btn" onClick={handleNextMonth}>
                <i className='bx bx-chevron-right'></i>
              </button>
            </div>

            <div className="calendar-grid">
              <div className="calendar-weekdays">
                <div>Sun</div>
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
              </div>
              <div className="calendar-days">
                {renderCalendar()}
              </div>
            </div>
          </div>

          {/* Incoming Requests */}
          <div className="requests-section">
            <div className="section-header">
              <h3 className="section-title">
                <i className='bx bx-time'></i>
                Incoming Requests
              </h3>
              <span className="request-count">{incomingRequests.length}</span>
            </div>
            
            <div className="requests-list">
              {incomingRequests.map(request => (
                <div key={request.id} className="request-card">
                  <div className="request-header">
                    <div className="customer-info">
                      <div className="customer-name">{request.customerName}</div>
                      <div className="customer-contact">
                        <i className='bx bx-phone'></i>
                        {request.customerPhone}
                      </div>
                    </div>
                    <div 
                      className="urgency-badge"
                      style={{ backgroundColor: getUrgencyColor(request.urgency) }}
                    >
                      {request.urgency}
                    </div>
                  </div>

                  <div className="vehicle-info">
                    <i className='bx bx-car'></i>
                    {request.vehicleInfo} • {request.licensePlate}
                  </div>

                  <div className="services-requested">
                    <div className="services-label">Services:</div>
                    <div className="services-list">
                      {request.servicesRequested.map((service, index) => (
                        <span key={index} className="service-tag">{service}</span>
                      ))}
                    </div>
                  </div>

                  <div className="request-details">
                    <div className="detail-row">
                      <span className="detail-label">Estimated:</span>
                      <span className="detail-value">{formatCurrency(request.estimatedCharge)}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Preferred:</span>
                      <span className="detail-value">
                        {new Date(request.preferredDate).toLocaleDateString()} at {request.preferredTime}
                      </span>
                    </div>
                  </div>

                  {request.notes && (
                    <div className="request-notes">
                      <i className='bx bx-note'></i>
                      {request.notes}
                    </div>
                  )}

                  <div className="request-actions">
                    <button 
                      className="btn btn--success"
                      onClick={() => setViewRequest(request)}
                    >
                      <i className='bx bx-show'></i>
                      View
                    </button>
                    <button 
                      className="btn btn--secondary"
                      onClick={() => handleApproveRequest(request.id)}
                    >
                      <i className='bx bx-check'></i>
                      Approve
                    </button>
                    <button 
                      className="btn btn--danger"
                      onClick={() => handleRejectRequest(request.id)}
                    >
                      <i className='bx bx-x'></i>
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Daily Schedule */}
        <div className="schedule-panel">
          <div className="schedule-header">
            <h2 className="schedule-title">
              <i className='bx bx-calendar-check'></i>
              Appointments - {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h2>
            <div className="schedule-actions">
              <button className="btn btn--primary" onClick={() => setShowWalkInModal(true)}>
                <i className='bx bx-plus'></i>
                New Appointment
              </button>
            </div>
          </div>

          <div className="schedule-timeline">
            {Array.from({ length: 12 }, (_, i) => i + 8).map(hour => {
              const hourAppointments = appointments.filter(appointment => {
                const startHour = parseInt(appointment.startTime.split(':')[0]);
                const endHour = parseInt(appointment.endTime.split(':')[0]);
                return startHour <= hour && endHour > hour;
              });

              return (
                <div key={hour} className="timeline-hour">
                  <div className="hour-label">{hour}:00</div>
                  <div className="hour-content">
                    {hourAppointments.length > 0 ? (
                      <div className="hour-appointments">
                        {hourAppointments.map(appointment => (
                          <div 
                            key={appointment.id} 
                            className="appointment-slot"
                            style={{ borderColor: getStatusColor(appointment.status) }}
                          >
                            <div className="appointment-header">
                              <div className="appointment-time">
                                <i className='bx bx-time'></i>
                                {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                              </div>
                              <div className="appointment-status">
                                <span 
                                  className="status-badge"
                                  style={{ backgroundColor: getStatusColor(appointment.status) }}
                                >
                                  {appointment.status}
                                </span>
                              </div>
                            </div>

                            <div className="appointment-customer">
                              <div className="customer-name">{appointment.customerName}</div>
                              <div className="customer-phone">
                                <i className='bx bx-phone'></i>
                                {appointment.customerPhone}
                              </div>
                            </div>

                            <div className="appointment-vehicle">
                              <i className='bx bx-car'></i>
                              {appointment.vehicleInfo} • {appointment.licensePlate}
                            </div>

                            <div className="appointment-services">
                              <div className="services-label">Services:</div>
                              <div className="services-list">
                                {appointment.services.map((service, index) => (
                                  <span key={index} className="service-tag">{service}</span>
                                ))}
                              </div>
                            </div>

                            <div className="appointment-assignment">
                              <div className="technician-info">
                                <i className='bx bx-user'></i>
                                <span className="technician-name">{appointment.assignedTechnician}</span>
                              </div>
                              <div className="bay-info">
                                <i className='bx bx-building'></i>
                                <span className="bay-name">{appointment.bay}</span>
                              </div>
                            </div>

                            <div className="appointment-financial">
                              <div className="financial-row">
                                <span className="financial-label">Total:</span>
                                <span className="financial-value">{formatCurrency(appointment.totalCharge)}</span>
                              </div>
                              <div className="financial-row">
                                <span className="financial-label">Deposit:</span>
                                <span className="financial-value">{formatCurrency(appointment.depositPaid)}</span>
                              </div>
                            </div>

                            {appointment.notes && (
                              <div className="appointment-notes">
                                <i className='bx bx-note'></i>
                                {appointment.notes}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="empty-hour">
                        <i className='bx bx-calendar-x'></i>
                        <span>No appointments scheduled</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {showWalkInModal && (
        <WalkInAppointmentModal
          onClose={() => setShowWalkInModal(false)}
          onSave={(data) => {
            setShowWalkInModal(false);
            // handle the saved data here
            console.log('Saved appointment:', data);
          }}
        />
      )}
      {viewRequest && (
        <ViewRequestModal
          request={viewRequest}
          onClose={() => setViewRequest(null)}
        />
      )}
    </div>
  );
};

export default Calendar; 