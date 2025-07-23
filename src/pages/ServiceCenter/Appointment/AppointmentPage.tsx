// AutoRepairCalendar.tsx
import React, { useState } from 'react';
import './AppointmentPage.scss';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'technician';
}

interface BookingEvent {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  customers: Customer[];
  vehicle: string;
  serviceType: string;
  isAllDay?: boolean;
  notes?: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
}

interface TimeSlot {
  time: string;
  label: string;
}

interface NewAppointment {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  vehicle: string;
  serviceType: string;
  technicianId: string;
  notes: string;
}

const AutoRepairCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2023, 7, 1)); // August 2023
  const [selectedEvent, setSelectedEvent] = useState<BookingEvent | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot>({ time: '15min', label: '15 min' });
  const [events, setEvents] = useState<BookingEvent[]>([
    {
      id: '1',
      title: 'Oil Change Service',
      date: new Date(2023, 7, 3),
      startTime: '09:00 AM',
      endTime: '10:00 AM',
      customers: [
        { id: '1', name: 'Mike Johnson', email: 'mike.j@gmail.com', phone: '(555) 0123', role: 'customer' }
      ],
      vehicle: '2020 Honda Civic',
      serviceType: 'Oil Change',
      status: 'scheduled',
      notes: 'Customer requested full synthetic oil'
    },
    {
      id: '2',
      title: 'Brake Inspection',
      date: new Date(2023, 7, 5),
      startTime: '10:00 AM',
      endTime: '11:30 AM',
      customers: [
        { id: '2', name: 'Sarah Wilson', email: 'sarah.wilson@gmail.com', phone: '(555) 0456', role: 'customer' }
      ],
      vehicle: '2019 Toyota Camry',
      serviceType: 'Brake Service',
      status: 'scheduled'
    },
    {
      id: '3',
      title: 'Transmission Repair',
      date: new Date(2023, 7, 16),
      startTime: '12:00 PM',
      endTime: '03:00 PM',
      customers: [
        { id: '3', name: 'Tom Rodriguez', email: 'tom.rodriguez@gmail.com', phone: '(555) 0789', role: 'customer' },
        { id: '4', name: 'Alex Chen', email: 'alex.chen@gmail.com', phone: '(555) 0321', role: 'technician' }
      ],
      vehicle: '2018 Ford F-150',
      serviceType: 'Transmission',
      status: 'scheduled',
      notes: 'Major transmission rebuild required'
    }
  ]);

  const [newAppointment, setNewAppointment] = useState<NewAppointment>({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    vehicle: '',
    serviceType: '',
    technicianId: '',
    notes: ''
  });

  const timeSlots: TimeSlot[] = [
    { time: '15min', label: '15 min' },
    { time: '30min', label: '30 min' },
    { time: '45min', label: '45 min' },
    { time: '1hour', label: '1 hour' },
    { time: '2hour', label: '2 hour' }
  ];

  // Hard-coded technicians
  const technicians = [
    { id: '1', name: 'Alex Chen' },
    { id: '2', name: 'Maria Garcia' },
    { id: '3', name: 'John Smith' },
    { id: '4', name: 'Lisa Parker' }
  ];

  const serviceTypes = [
    'Oil Change',
    'Brake Service',
    'Transmission',
    'Engine Repair',
    'Tire Service',
    'General Inspection',
    'AC Service'
  ];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getEventsForDate = (day: number) => {
    return events.filter(event => 
      event.date.getDate() === day && 
      event.date.getMonth() === currentDate.getMonth() &&
      event.date.getFullYear() === currentDate.getFullYear()
    );
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const handleInputChange = (field: keyof NewAppointment, value: string) => {
    setNewAppointment(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedTechnician = technicians.find(tech => tech.id === newAppointment.technicianId);
    
    const newEvent: BookingEvent = {
      id: (events.length + 1).toString(),
      title: newAppointment.title,
      date: new Date(newAppointment.date),
      startTime: newAppointment.startTime,
      endTime: newAppointment.endTime,
      customers: [
        {
          id: (Date.now()).toString(),
          name: newAppointment.customerName,
          email: newAppointment.customerEmail,
          phone: newAppointment.customerPhone,
          role: 'customer'
        },
        ...(selectedTechnician ? [{
          id: selectedTechnician.id,
          name: selectedTechnician.name,
          email: `${selectedTechnician.name.toLowerCase().replace(' ', '.')}@autorepair.com`,
          phone: '(555) 0000',
          role: 'technician' as const
        }] : [])
      ],
      vehicle: newAppointment.vehicle,
      serviceType: newAppointment.serviceType,
      status: 'scheduled',
      notes: newAppointment.notes
    };

    setEvents(prev => [...prev, newEvent]);
    setShowBookingModal(false);
    setNewAppointment({
      title: '',
        date: '',
      startTime: '',
      endTime: '',
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      vehicle: '',
      serviceType: '',
      technicianId: '',
      notes: ''
    });
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 0);
      const prevDay = prevMonth.getDate() - firstDay + i + 1;
      days.push(
        <div key={`prev-${i}`} className="calendar-day prev-month">
          <span className="day-number">{prevDay}</span>
        </div>
      );
    }

    // Add days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = getEventsForDate(day);
      days.push(
        <div key={day} className="calendar-day current-month">
          <span className="day-number">{day}</span>
          <div className="events-container">
            {dayEvents.map(event => (
              <div 
                key={event.id} 
                className={`event-item ${event.status}`}
                onClick={() => setSelectedEvent(event)}
              >
                <span className="event-time">{event.startTime}</span>
                <span className="event-title">{event.title}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return days;
  };

  const renderBookingModal = () => {
    if (!showBookingModal) return null;

    return (
      <div className="modal-overlay" onClick={() => setShowBookingModal(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Create New Appointment</h2>
            <button className="close-btn" onClick={() => setShowBookingModal(false)}>
              ×
            </button>
          </div>
          
          <form onSubmit={handleSubmitAppointment} className="appointment-form">
            <div className="form-row">
              <div className="form-group">
                <label>Appointment Title</label>
                <input
                  type="text"
                  value={newAppointment.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={newAppointment.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Start Time</label>
                <input
                  type="time"
                  value={newAppointment.startTime}
                  onChange={(e) => handleInputChange('startTime', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>End Time</label>
                <input
                  type="time"
                  value={newAppointment.endTime}
                  onChange={(e) => handleInputChange('endTime', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Customer Name</label>
                <input
                  type="text"
                  value={newAppointment.customerName}
                  onChange={(e) => handleInputChange('customerName', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Customer Email</label>
                <input
                  type="email"
                  value={newAppointment.customerEmail}
                  onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Customer Phone</label>
                <input
                  type="tel"
                  value={newAppointment.customerPhone}
                  onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Vehicle</label>
                <input
                  type="text"
                  placeholder="e.g., 2020 Honda Civic"
                  value={newAppointment.vehicle}
                  onChange={(e) => handleInputChange('vehicle', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Service Type</label>
                <select
                  value={newAppointment.serviceType}
                  onChange={(e) => handleInputChange('serviceType', e.target.value)}
                  required
                >
                  <option value="">Select Service</option>
                  {serviceTypes.map(service => (
                    <option key={service} value={service}>{service}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Assign Technician</label>
                <select
                  value={newAppointment.technicianId}
                  onChange={(e) => handleInputChange('technicianId', e.target.value)}
                  required
                >
                  <option value="">Select Technician</option>
                  {technicians.map(tech => (
                    <option key={tech.id} value={tech.id}>{tech.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group full-width">
                <label>Notes (Optional)</label>
                <textarea
                  value={newAppointment.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Any additional notes or special requirements..."
                  rows={3}
                />
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" onClick={() => setShowBookingModal(false)} className="cancel-btn">
                Cancel
              </button>
              <button type="submit" className="submit-btn">
                Create Appointment
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const renderEventDetails = () => {
    if (!selectedEvent) return null;

    return (
      <div className="event-details-panel">
        <div className="panel-header">
          <h2>{selectedEvent.title}</h2>
          <button className="close-btn" onClick={() => setSelectedEvent(null)}>
            ×
          </button>
        </div>

        <div className="time-slots">
          {timeSlots.map(slot => (
            <button
              key={slot.time}
              className={`time-slot ${selectedTimeSlot.time === slot.time ? 'active' : ''}`}
              onClick={() => setSelectedTimeSlot(slot)}
            >
              {slot.label}
            </button>
          ))}
        </div>

        <div className="appointment-time">
          <div className="time-display">
            <span className="start-time">{selectedEvent.startTime}</span>
            <span className="arrow">→</span>
            <span className="end-time">{selectedEvent.endTime}</span>
          </div>
          <div className="appointment-date">
            {formatDate(selectedEvent.date)}
          </div>
          {selectedEvent.isAllDay && (
            <div className="all-day-badge">All day event</div>
          )}
        </div>

        <div className="service-info">
          <div className="info-row">
            <span className="label">Vehicle:</span>
            <span className="value">{selectedEvent.vehicle}</span>
          </div>
          <div className="info-row">
            <span className="label">Service:</span>
            <span className="value">{selectedEvent.serviceType}</span>
          </div>
          <div className="info-row">
            <span className="label">Status:</span>
            <span className={`status-badge ${selectedEvent.status}`}>
              {selectedEvent.status.charAt(0).toUpperCase() + selectedEvent.status.slice(1)}
            </span>
          </div>
        </div>

        <div className="attendees-section">
          {selectedEvent.customers.map(customer => (
            <div key={customer.id} className="attendee-item">
              <div className="avatar">
                {customer.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="attendee-info">
                <div className="attendee-name">{customer.name}</div>
                <div className="attendee-email">{customer.email}</div>
              </div>
              <div className={`role-badge ${customer.role}`}>
                {customer.role === 'technician' ? 'Technician' : 'Customer'}
              </div>
            </div>
          ))}
        </div>

        <div className="notes-section">
          <div className="section-header">
            <label>Add note</label>
            <div className="toggle-switch">
              <input type="checkbox" id="notes-toggle" />
              <label htmlFor="notes-toggle"></label>
            </div>
          </div>
          <textarea 
            placeholder="Service notes..."
            defaultValue={selectedEvent.notes}
            className="notes-textarea"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="auto-repair-calendar">
      <div className="calendar-section">
        <div className="calendar-header">
          <div className="nav-controls">
            <button className="nav-btn" onClick={() => navigateMonth('prev')}>
              ‹
            </button>
            <h1 className="month-year">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h1>
            <button className="nav-btn" onClick={() => navigateMonth('next')}>
              ›
            </button>
          </div>
          <div className="header-actions">
            <button className="create-booking-btn" onClick={() => setShowBookingModal(true)}>
              + Create Appointment
            </button>
            <button className="filter-btn">🔽</button>
            <button className="calendar-view-btn">📅</button>
          </div>
        </div>

        <div className="calendar-grid">
          <div className="weekday-headers">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <div key={day} className="weekday-header">{day}</div>
            ))}
          </div>
          <div className="calendar-days">
            {renderCalendarDays()}
          </div>
        </div>
      </div>

      {selectedEvent && renderEventDetails()}
      {renderBookingModal()}
    </div>
  );
};

export default AutoRepairCalendar;