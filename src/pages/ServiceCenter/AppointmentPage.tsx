import React, { useState } from 'react';
import { Calendar, Views, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './AppointmentPage.scss';

interface AppointmentEvent {
  id: string;
  title: string;
  customer: string;
  phone: string;
  email: string;
  vehicle: string;
  start: Date;
  end: Date;
  services: string[];
  status: 'confirmed' | 'pending';
  priority: 'urgent' | 'normal' | 'moderate';
  notes: string;
  dropOff: boolean;
  technician: string;
}

const localizer = momentLocalizer(moment);

const AppointmentPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState(Views.DAY);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentEvent | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);

  // Sample appointments data
  const [appointments, setAppointments] = useState<AppointmentEvent[]>([
    {
      id: 'APR#10001',
      title: 'Brake Inspection',
      customer: 'John Doe',
      phone: '123-456-7890',
      email: 'john.doe@example.com',
      vehicle: 'Toyota Camry',
      start: new Date(),
      end: new Date(),
      services: ['Brake Inspection'],
      status: 'confirmed',
      priority: 'urgent',
      notes: 'Customer mentioned squeaking brakes',
      dropOff: true,
      technician: 'Jane Smith',
    },
    {
      id: 'APR#10002',
      title: 'Oil Change',
      customer: 'Jane Smith',
      phone: '098-765-4321',
      email: 'jane.smith@example.com',
      vehicle: 'Honda Civic',
      start: new Date(),
      end: new Date(),
      services: ['Oil Change'],
      status: 'confirmed',
      priority: 'normal',
      notes: 'Follow up from previous visit',
      dropOff: false,
      technician: 'John Doe',
    },
    {
      id: 'APR#10003',
      title: 'State Inspection',
      customer: 'Bob Johnson',
      phone: '111-222-3333',
      email: 'bob.johnson@example.com',
      vehicle: 'Ford F-150',
      start: new Date(),
      end: new Date(),
      services: ['State Inspection'],
      status: 'confirmed',
      priority: 'normal',
      notes: 'State inspection due this month',
      dropOff: false,
      technician: 'Jane Smith',
    },
  ]);

  const pendingRequests = [
    {
      id: 'APR#10004',
      title: 'Tire Rotation',
      customer: 'Alice Johnson',
      phone: '444-555-6666',
      email: 'alice.johnson@example.com',
      vehicle: 'Chevrolet Malibu',
      start: new Date(),
      end: new Date(),
      services: ['Tire Rotation'],
      status: 'pending',
      priority: 'normal',
      notes: 'Customer requested tire rotation',
      dropOff: true,
      technician: 'John Doe',
    },
  ];

  // Event style getter for different appointment types
  const eventStyleGetter = (event: AppointmentEvent) => {
    let backgroundColor = '#3174ad';
    let borderColor = '#3174ad';

    if (event.status === 'pending') {
      backgroundColor = '#ff9800';
      borderColor = '#ff9800';
    }

    if (event.priority === 'urgent') {
      backgroundColor = '#d32f2f';
      borderColor = '#d32f2f';
    }

    return {
      style: {
        backgroundColor,
        borderColor,
      },
    };
  };

  const handleSelectEvent = (event: AppointmentEvent) => {
    setSelectedAppointment(event);
  };

  const handleSelectSlot = ({ start, end }: { start: Date, end: Date }) => {
    // Handle creating new appointment
    console.log('Selected slot:', start, end);
  };

  const CustomToolbar = ({ label, onNavigate, onView, view }: {label: string, onNavigate: (nav: 'PREV' | 'NEXT') => void, onView: (view: string) => void, view: string}) => (
    <div className="calendar-toolbar">
      <div className="toolbar-left">
        <button className="nav-btn" onClick={() => onNavigate('PREV')}>‹</button>
        <span className="toolbar-label">{label}</span>
        <button className="nav-btn" onClick={() => onNavigate('NEXT')}>›</button>
      </div>
      <div className="toolbar-right">
        <button className="view-btn" onClick={() => onView(Views.DAY)}>Day</button>
        <button className="view-btn" onClick={() => onView(Views.WEEK)}>Week</button>
        <button className="view-btn" onClick={() => onView(Views.MONTH)}>Month</button>
      </div>
    </div>
  );

  return (
    <div className="appointment-page">
      <div className="calendar-container">
        <Calendar
          localizer={localizer}
          events={appointments}
          startAccessor="start"
          endAccessor="end"
          views={['day', 'week', 'month']}
          defaultView={currentView}
          date={currentDate}
          onNavigate={(date) => setCurrentDate(date)}
          onView={(view) => setCurrentView(view)}
          selectable={true}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          components={{
            toolbar: CustomToolbar,
          }}
          eventPropGetter={eventStyleGetter}
        />
      </div>
      {selectedAppointment && (
        <div className="sidebar">
          <h3>Appointment Details</h3>
          <div className="details-grid">
            <div className="details-section">
              <h4>Customer Information</h4>
              <p>Name: {selectedAppointment.customer}</p>
              <p>Phone: {selectedAppointment.phone}</p>
              <p>Email: {selectedAppointment.email}</p>
            </div>
            <div className="details-section">
              <h4>Vehicle Information</h4>
              <p>Make: {selectedAppointment.vehicle}</p>
            </div>
            <div className="details-section">
              <h4>Appointment Information</h4>
              <p>Status: {selectedAppointment.status}</p>
              <p>Priority: {selectedAppointment.priority}</p>
              <p>Start: {selectedAppointment.start.toLocaleString()}</p>
              <p>End: {selectedAppointment.end.toLocaleString()}</p>
              <p>Drop Off: {selectedAppointment.dropOff ? 'Yes' : 'No'}</p>
              <p>Technician: {selectedAppointment.technician}</p>
            </div>
            <div className="details-section">
              <h4>Services</h4>
              <div className="services-grid">
                {selectedAppointment.services.map((service: string, idx: number) => (
                  <span key={idx} className="service-badge">{service}</span>
                ))}
              </div>
            </div>
          </div>
          {selectedAppointment.notes && (
            <div className="notes-section">
              <h4>Notes</h4>
              <p>{selectedAppointment.notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AppointmentPage;
