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

const AutoRepairCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2023, 7, 1)); // August 2023
  const [selectedEvent, setSelectedEvent] = useState<BookingEvent | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot>({ time: '15min', label: '15 min' });

  const timeSlots: TimeSlot[] = [
    { time: '15min', label: '15 min' },
    { time: '30min', label: '30 min' },
    { time: '45min', label: '45 min' },
    { time: '1hour', label: '1 hour' },
    { time: '2hour', label: '2 hour' }
  ];

  const sampleEvents: BookingEvent[] = [
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
      startTime: '12:00 AM',
      endTime: '12:15 AM',
      customers: [
        { id: '3', name: 'Tom Rodriguez', email: 'tom.rodriguez@gmail.com', phone: '(555) 0789', role: 'customer' },
        { id: '4', name: 'Alex Chen', email: 'alex.chen@gmail.com', phone: '(555) 0321', role: 'technician' },
        { id: '5', name: 'Maria Garcia', email: 'maria.garcia@gmail.com', phone: '(555) 0654', role: 'customer' },
        { id: '6', name: 'John Smith', email: 'john.smith@gmail.com', phone: '(555) 0987', role: 'customer' }
      ],
      vehicle: '2018 Ford F-150',
      serviceType: 'Transmission',
      status: 'scheduled',
      isAllDay: true,
      notes: 'Major transmission rebuild required'
    }
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
    return sampleEvents.filter(event => 
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
      const events = getEventsForDate(day);
      days.push(
        <div key={day} className="calendar-day current-month">
          <span className="day-number">{day}</span>
          <div className="events-container">
            {events.map(event => (
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

        <div className="booking-link">
          <span className="link-icon">🔗</span>
          <a href="https://autorepair.booking.com/xyz123" target="_blank" rel="noopener noreferrer">
            https://autorepair.booking.com/xyz123
          </a>
          <button className="copy-btn">📋</button>
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
          <button className="add-people-btn">
            <span className="plus-icon">+</span>
            Add people
          </button>
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
              + Create booking type
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
    </div>
  );
};

export default AutoRepairCalendar;