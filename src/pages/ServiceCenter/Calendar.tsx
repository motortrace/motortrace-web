import React, { useState } from 'react';

interface Appointment {
  id: string;
  title: string;
  start: Date;
  end: Date;
  technician: string;
  customer: string;
  vehicle?: string;
  service?: string;
  priority?: 'urgent' | 'moderate' | 'normal';
  status?: 'scheduled' | 'in-progress' | 'completed';
}

interface Technician {
  id: string;
  name: string;
  specialty: string;
  status: 'available' | 'busy' | 'break' | 'offline';
}

// AppointmentDetailModal component
interface AppointmentDetailModalProps {
  open: boolean;
  onClose: () => void;
  appointment: {
    date: string;
    time: string;
    customer: string;
    vehicle: string;
    source: string;
    services: string[];
    description: string;
  };
}

const modalOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(0,0,0,0.25)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000
};

const modalStyle: React.CSSProperties = {
  background: 'white',
  borderRadius: '12px',
  padding: '32px 24px',
  minWidth: 340,
  maxWidth: 420,
  boxShadow: '0 4px 32px rgba(0,0,0,0.18)',
  display: 'flex',
  flexDirection: 'column',
  gap: 18,
  position: 'relative'
};

const tagStyle: React.CSSProperties = {
  display: 'inline-block',
  background: '#f3f4f6',
  color: '#2563eb',
  borderRadius: '16px',
  padding: '4px 12px',
  fontSize: 13,
  fontWeight: 500,
  marginRight: 8,
  marginBottom: 6
};

const AppointmentDetailModal: React.FC<AppointmentDetailModalProps> = ({ open, onClose, appointment }) => {
  if (!open) return null;
  return (
    <div style={modalOverlayStyle}>
      <div style={modalStyle}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 12,
            right: 16,
            background: 'none',
            border: 'none',
            fontSize: 22,
            color: '#6b7280',
            cursor: 'pointer',
            fontWeight: 700
          }}
          aria-label="Close"
        >
          ×
        </button>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: '#1f2937' }}>Appointment Details</h2>
        <div style={{ fontSize: 15, color: '#374151', marginBottom: 4 }}>
          <strong>Date & Time:</strong> {appointment.date} {appointment.time}
        </div>
        <div style={{ fontSize: 15, color: '#374151', marginBottom: 4 }}>
          <strong>Customer:</strong> {appointment.customer}
        </div>
        <div style={{ fontSize: 15, color: '#374151', marginBottom: 4 }}>
          <strong>Vehicle:</strong> {appointment.vehicle}
        </div>
        <div style={{ fontSize: 15, color: '#374151', marginBottom: 4 }}>
          <strong>Source:</strong> {appointment.source}
        </div>
        <div style={{ fontSize: 15, color: '#374151', marginBottom: 4 }}>
          <strong>Services:</strong>
          <div style={{ marginTop: 6 }}>
            {appointment.services.map((service, idx) => (
              <span key={service + idx} style={tagStyle}>{service}</span>
            ))}
          </div>
        </div>
        <div style={{ fontSize: 15, color: '#374151', marginBottom: 4 }}>
          <strong>Problem Description:</strong>
          <div style={{ marginTop: 4, color: '#6b7280', fontSize: 14 }}>{appointment.description}</div>
        </div>
      </div>
    </div>
  );
};

const AutoCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 6, 22)); // July 22, 2025
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAppointment, setModalAppointment] = useState<any | null>(null);

  const technicians: Technician[] = [
    { id: '1', name: 'Jack Martin', specialty: 'Engine Specialist', status: 'available' },
    { id: '2', name: 'Sarah Connor', specialty: 'Brake Expert', status: 'busy' },
    { id: '3', name: 'Mike Johnson', specialty: 'Electrical', status: 'available' },
    { id: '4', name: 'Bruce Wayne', specialty: 'Transmission', status: 'break' },
    { id: '5', name: 'Clark Kent', specialty: 'General Repair', status: 'available' }
  ];

  const appointments: Appointment[] = [
    {
      id: '1',
      title: 'Oil Change Service',
      start: new Date(2025, 6, 22, 9, 0),
      end: new Date(2025, 6, 22, 9, 30),
      technician: 'Jack Martin',
      customer: 'John Doe',
      vehicle: '2018 Honda Civic EX',
      service: 'Oil Change',
      priority: 'normal',
      status: 'scheduled'
    },
    {
      id: '2',
      title: 'Brake Inspection',
      start: new Date(2025, 6, 22, 10, 0),
      end: new Date(2025, 6, 22, 11, 30),
      technician: 'Sarah Connor',
      customer: 'Jane Smith',
      vehicle: '2020 Toyota Camry',
      service: 'Brake Service',
      priority: 'urgent',
      status: 'in-progress'
    },
    {
      id: '3',
      title: 'Battery Replacement',
      start: new Date(2025, 6, 22, 11, 0),
      end: new Date(2025, 6, 22, 12, 0),
      technician: 'Mike Johnson',
      customer: 'Bob Wilson',
      vehicle: '2019 Ford F-150',
      service: 'Battery Service',
      priority: 'moderate',
      status: 'scheduled'
    },
    {
      id: '4',
      title: 'Transmission Check',
      start: new Date(2025, 6, 22, 14, 0),
      end: new Date(2025, 6, 22, 16, 0),
      technician: 'Bruce Wayne',
      customer: 'Alice Johnson',
      vehicle: '2017 BMW X3',
      service: 'Transmission Service',
      priority: 'normal',
      status: 'scheduled'
    },
    {
      id: '5',
      title: 'Engine Diagnostic',
      start: new Date(2025, 6, 22, 13, 0),
      end: new Date(2025, 6, 22, 15, 0),
      technician: 'Clark Kent',
      customer: 'David Brown',
      vehicle: '2021 Chevrolet Silverado',
      service: 'Engine Check',
      priority: 'urgent',
      status: 'scheduled'
    }
  ];

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return '#3b82f6';
      case 'in-progress': return '#f59e0b';
      case 'completed': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getPriorityBorder = (priority: string) => {
    return priority === 'urgent' ? '#ef4444' : 'transparent';
  };

  const timeSlots = [];
  for (let hour = 8; hour <= 18; hour++) {
    timeSlots.push({
      hour,
      display: hour <= 12 ? `${hour}:00 AM` : `${hour - 12}:00 PM`
    });
  }

  if (timeSlots[4]) timeSlots[4].display = '12:00 PM';

  return (
    <div style={{ 
      width: '100%', 
      minHeight: '100vh', 
      background: '#f8fafc', 
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Calendar Grid */}
      <div style={{ 
        background: 'white',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        overflowX: 'auto'
      }}>
        <h2 style={{ 
          margin: '0 0 20px 0', 
          fontSize: '18px', 
          fontWeight: 'bold',
          color: '#1f2937'
        }}>
          📅 Daily Schedule - Tuesday, July 22, 2025
        </h2>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '100px repeat(5, 1fr)', 
          gap: '1px',
          backgroundColor: '#e5e7eb',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          overflow: 'hidden',
          minWidth: '800px'
        }}>
          {/* Header Row */}
          <div style={{ 
            backgroundColor: '#f9fafb', 
            padding: '12px 8px', 
            fontWeight: 'bold',
            fontSize: '14px',
            color: '#374151'
          }}>
            Time
          </div>
          {technicians.map(tech => (
            <div key={tech.id} style={{ 
              backgroundColor: '#f9fafb', 
              padding: '12px 8px', 
              fontWeight: 'bold',
              fontSize: '14px',
              color: '#374151',
              textAlign: 'center'
            }}>
              {tech.name}
            </div>
          ))}

          {/* Time Slots */}
          {timeSlots.map(slot => (
            <React.Fragment key={slot.hour}>
              {/* Time Column */}
              <div style={{ 
                backgroundColor: 'white',
                padding: '20px 8px',
                fontSize: '12px',
                color: '#6b7280',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center'
              }}>
                {slot.display}
              </div>
              
              {/* Technician Columns */}
              {technicians.map(tech => {
                const appointment = appointments.find(apt => 
                  apt.technician === tech.name && 
                  apt.start.getHours() === slot.hour
                );

                return (
                  <div key={`${tech.id}-${slot.hour}`} style={{ 
                    backgroundColor: 'white',
                    padding: '4px',
                    minHeight: '60px',
                    position: 'relative'
                  }}>
                    {appointment && (
                      <div 
                        style={{
                          backgroundColor: getStatusColor(appointment.status || 'scheduled'),
                          color: 'white',
                          padding: '6px 8px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: '600',
                          height: '100%',
                          border: `2px solid ${getPriorityBorder(appointment.priority || 'normal')}`,
                          cursor: 'pointer',
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                        onClick={() => {
                          setModalAppointment({
                            date: 'Tuesday, July 22, 2025',
                            time: `${formatTime(appointment.start)} - ${formatTime(appointment.end)}`,
                            customer: appointment.customer,
                            vehicle: appointment.vehicle,
                            source: 'Online Booking', // Replace with real data if available
                            services: ['Brakes', 'Transmission', 'Brake fluid change', 'Wheel alignment'], // Replace with real data if available
                            description: 'Problem description goes here.' // Replace with real data if available
                          });
                          setModalOpen(true);
                        }}
                      >
                        <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>
                          {appointment.title}
                        </div>
                        <div style={{ fontSize: '10px', opacity: 0.9 }}>
                          {appointment.customer}
                        </div>
                        <div style={{ fontSize: '9px', opacity: 0.8 }}>
                          {appointment.vehicle}
                        </div>
                        {appointment.priority === 'urgent' && (
                          <div style={{ 
                            position: 'absolute',
                            top: '2px',
                            right: '2px',
                            fontSize: '10px'
                          }}>
                            🚨
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>

        {/* Legend */}
        <div style={{ 
          marginTop: '20px',
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap',
          fontSize: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#3b82f6', borderRadius: '2px' }}></div>
            Scheduled
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#f59e0b', borderRadius: '2px' }}></div>
            In Progress
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#10b981', borderRadius: '2px' }}></div>
            Completed
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '12px', height: '12px', border: '2px solid #ef4444', borderRadius: '2px' }}></div>
            Urgent Priority
          </div>
        </div>
      </div>
      {/* Modal Integration */}
      <AppointmentDetailModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        appointment={modalAppointment || {
          date: '',
          time: '',
          customer: '',
          vehicle: '',
          source: '',
          services: [],
          description: ''
        }}
      />
    </div>
  );
};

export default AutoCalendar;
export { AppointmentDetailModal };