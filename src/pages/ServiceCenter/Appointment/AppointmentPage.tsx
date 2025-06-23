import React, { useState, useMemo } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import MetricCard from '../../../components/MetricCard/MetricCard';
import './AppointmentPage.scss';


const localizer = momentLocalizer(moment);

const AppointmentPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState(Views.DAY);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);

  // Sample appointments data
  const [appointments, setAppointments] = useState([
    {
      id: 'APR#10001',
      title: 'Jack Martin - Oil Change, Brake Service',
      customer: 'Jack Martin',
      phone: '(469) 629-6615',
      email: 'jack.martin@email.com',
      vehicle: '2018 Honda Civic EX',
      start: new Date(2025, 5, 23, 10, 0), // Today, 10:00 AM
      end: new Date(2025, 5, 23, 11, 0),   // Today, 11:00 AM
      services: ['Oil Change', 'Brake Service'],
      status: 'confirmed',
      priority: 'urgent',
      notes: 'Customer mentioned squeaking brakes',
      dropOff: true,
      technician: 'Mike Johnson'
    },
    {
      id: 'APR#10002',
      title: 'Sarah Connor - Transmission Service',
      customer: 'Sarah Connor',
      phone: '(555) 123-4567',
      email: 'sarah.connor@email.com',
      vehicle: '2020 Toyota Camry',
      start: new Date(2025, 5, 23, 13, 0),
      end: new Date(2025, 5, 23, 15, 0),
      services: ['Transmission Service', 'Brake Fluid Change'],
      status: 'pending',
      priority: 'normal',
      notes: 'Follow up from previous visit',
      dropOff: false,
      technician: 'John Smith'
    },
    {
      id: 'APR#10003',
      title: 'John Doe - Annual Inspection',
      customer: 'John Doe',
      phone: '(555) 987-6543',
      email: 'john.doe@email.com',
      vehicle: '2019 Ford F-150',
      start: new Date(2025, 5, 23, 16, 0),
      end: new Date(2025, 5, 23, 17, 0),
      services: ['Annual Inspection'],
      status: 'confirmed',
      priority: 'normal',
      notes: 'State inspection due this month',
      dropOff: false,
      technician: 'Mike Johnson'
    }
  ]);

  const pendingRequests = [
    {
      id: 'REQ#001',
      customer: 'Emma Watson',
      phone: '(555) 444-5555',
      vehicle: '2021 BMW X3',
      requestedDate: '2025-06-24',
      requestedTime: '09:00',
      services: ['Oil Change', 'Tire Rotation'],
      priority: 'normal',
      createdAt: '2 hours ago',
      amount: '$180'
    },
    {
      id: 'REQ#002',
      customer: 'Robert Smith',
      phone: '(555) 333-2222',
      vehicle: '2019 Mercedes C-Class',
      requestedDate: '2025-06-23',
      requestedTime: '14:00',
      services: ['Brake Inspection', 'AC Service'],
      priority: 'urgent',
      createdAt: '30 minutes ago',
      amount: '$220'
    },
    {
      id: 'REQ#003',
      customer: 'Lisa Johnson',
      phone: '(555) 777-8888',
      vehicle: '2022 Audi Q5',
      requestedDate: '2025-06-25',
      requestedTime: '11:00',
      services: ['Transmission Service'],
      priority: 'normal',
      createdAt: '1 hour ago',
      amount: '$350'
    }
  ];

  // Event style getter for different appointment types
  const eventStyleGetter = (event) => {
    let backgroundColor = '#6366f1';
    let borderColor = '#6366f1';
    
    switch (event.priority) {
      case 'urgent':
        backgroundColor = '#ef4444';
        borderColor = '#dc2626';
        break;
      case 'moderate':
        backgroundColor = '#f59e0b';
        borderColor = '#d97706';
        break;
      default:
        backgroundColor = '#6366f1';
        borderColor = '#4f46e5';
    }

    return {
      style: {
        backgroundColor,
        borderColor,
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontSize: '11px',
        fontWeight: '500'
      }
    };
  };

  const handleSelectEvent = (event) => {
    setSelectedAppointment(event);
  };

  const handleSelectSlot = ({ start, end }) => {
    console.log('Selected slot:', start, end);
  };

  const handleNavigate = (direction) => {
    const unit = currentView === Views.DAY ? 'day' : currentView === Views.WEEK ? 'week' : 'month';
    const newDate = direction === 'prev' 
      ? moment(currentDate).subtract(1, unit).toDate()
      : moment(currentDate).add(1, unit).toDate();
    setCurrentDate(newDate);
  };

  return (
    <div className="appointment-page">
      {/* Header */}
      {/* <div className="page-header">
        <div className="header-content">
          <h1>Appointments</h1>
          <p>Manage your service appointments</p>
        </div>
        <button className="add-appointment-btn">
          + Add appointment
        </button>
      </div> */}

      {/* Stats Cards Row */}
      <div className="stats-grid">
        <MetricCard
          title="Total Appointments"
          amount="24"
          change="12%"
          changeType="positive"
        />
        <MetricCard
          title="Today's Schedule"
          amount="8"
          change="3"
          changeType="positive"
        />
        <MetricCard
          title="Pending Requests"
          amount="6"
          change="2"
          changeType="negative"
        />
        <MetricCard
          title="Completed Today"
          amount="5"
          change="1"
          changeType="positive"
        />
      </div>

      {/* Main Content - Calendar and Sidebar */}
      <div className="appointment-content">
        {/* Calendar Container */}
        <div className="calendar-container">
          {/* Custom Calendar Header */}
          <div className="calendar-toolbar">
            <div className="toolbar-left">
              <button 
                className="nav-btn" 
                onClick={() => handleNavigate('prev')}
              >
                ‹
              </button>
              <h3 className="calendar-title">
                {moment(currentDate).format(
                  currentView === Views.DAY 
                    ? 'MMMM DD, YYYY' 
                    : currentView === Views.WEEK 
                      ? 'MMMM YYYY' 
                      : 'MMMM YYYY'
                )}
              </h3>
              <button 
                className="nav-btn" 
                onClick={() => handleNavigate('next')}
              >
                ›
              </button>
            </div>
            
            <div className="toolbar-right">
              <div className="view-switcher">
                {[
                  { view: Views.DAY, label: 'Day' },
                  { view: Views.WEEK, label: 'Week' },
                  { view: Views.MONTH, label: 'Month' }
                ].map(({ view, label }) => (
                  <button
                    key={view}
                    onClick={() => setCurrentView(view)}
                    className={`view-btn ${currentView === view ? 'active' : ''}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Calendar */}
          <div className="calendar-wrapper">
            <Calendar
              localizer={localizer}
              events={appointments}
              startAccessor="start"
              endAccessor="end"
              onSelectEvent={handleSelectEvent}
              onSelectSlot={handleSelectSlot}
              selectable
              views={[Views.MONTH, Views.WEEK, Views.DAY]}
              view={currentView}
              onView={setCurrentView}
              date={currentDate}
              onNavigate={setCurrentDate}
              eventPropGetter={eventStyleGetter}
              components={{ toolbar: () => null }}
              min={new Date(0, 0, 0, 8, 0, 0)}
              max={new Date(0, 0, 0, 18, 0, 0)}
              step={30}
              timeslots={2}
            />
          </div>
        </div>

        {/* Sidebar */}
        {showSidebar && (
          <div className="appointment-sidebar">
            {/* Sidebar Header */}
            <div className="sidebar-header">
              <h3>Pending requests</h3>
              <span className="request-count">
                {pendingRequests.length}
              </span>
            </div>

            {/* Request List */}
            <div className="pending-requests">
              {pendingRequests.map((request) => (
                <div 
                  key={request.id} 
                  className={`request-card priority-${request.priority}`}
                >
                  {/* Request Header */}
                  <div className="request-header">
                    <div>
                      <div className="customer-name">
                        {request.customer}
                      </div>
                      <div className="request-time">
                        {request.createdAt}
                      </div>
                    </div>
                    <div className="request-amount">
                      {request.amount}
                    </div>
                  </div>

                  {/* Request Details */}
                  <div className="request-details">
                    <div className="detail-row">
                      <span className="icon">🚗</span>
                      {request.vehicle}
                    </div>
                    <div className="detail-row">
                      <span className="icon">📅</span>
                      {moment(request.requestedDate).format('MMM DD')} at {request.requestedTime}
                    </div>
                    <div className="detail-row">
                      <span className="icon">📞</span>
                      {request.phone}
                    </div>
                  </div>

                  {/* Services */}
                  <div className="services-list">
                    {request.services.map((service, idx) => (
                      <span key={idx} className="service-tag">
                        {service}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="request-actions">
                    <button className="approve-btn">
                      Approve
                    </button>
                    <button className="reschedule-btn">
                      Reschedule
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Priority Legend */}
            <div className="priority-legend">
              <h4>Priority Levels</h4>
              <div className="legend-items">
                <div className="legend-item">
                  <div className="priority-dot urgent"></div>
                  Urgent
                </div>
                <div className="legend-item">
                  <div className="priority-dot moderate"></div>
                  Moderate
                </div>
                <div className="legend-item">
                  <div className="priority-dot normal"></div>
                  Normal
                </div>
              </div>
            </div>

            {/* See All Button */}
            <button className="see-all-btn">
              See all →
            </button>
          </div>
        )}
      </div>

      {/* Appointment Modal */}
      {selectedAppointment && (
        <div className="modal-overlay" onClick={() => setSelectedAppointment(null)}>
          <div className="appointment-modal" onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="modal-header">
              <h3>
                {selectedAppointment.id}: {selectedAppointment.customer}
              </h3>
              <button 
                className="close-btn" 
                onClick={() => setSelectedAppointment(null)}
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="modal-content">
              <div className="appointment-info">
                {/* Customer Information */}
                <div className="info-section">
                  <h4>Customer Information</h4>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="label">Name</span>
                      <span className="value">{selectedAppointment.customer}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Phone</span>
                      <span className="value">{selectedAppointment.phone}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Email</span>
                      <span className="value">{selectedAppointment.email}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Vehicle</span>
                      <span className="value">{selectedAppointment.vehicle}</span>
                    </div>
                  </div>
                </div>

                {/* Appointment Details */}
                <div className="info-section">
                  <h4>Appointment Details</h4>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="label">Date & Time</span>
                      <span className="value">
                        {moment(selectedAppointment.start).format('MMMM DD, YYYY [at] HH:mm')}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="label">Duration</span>
                      <span className="value">
                        {moment(selectedAppointment.end).diff(selectedAppointment.start, 'hours')} hour(s)
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="label">Technician</span>
                      <span className="value">{selectedAppointment.technician}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Priority</span>
                      <span className={`priority-badge ${selectedAppointment.priority}`}>
                        {selectedAppointment.priority}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Services */}
                <div className="info-section">
                  <h4>Services</h4>
                  <div className="services-grid">
                    {selectedAppointment.services.map((service, idx) => (
                      <span key={idx} className="service-badge">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                {selectedAppointment.notes && (
                  <div className="info-section">
                    <h4>Notes</h4>
                    <p className="notes">{selectedAppointment.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="modal-actions">
              <button className="action-btn confirm">Mark Complete</button>
              <button className="action-btn reschedule">Reschedule</button>
              <button className="action-btn cancel">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentPage;