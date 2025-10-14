import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Appointment {
  id: string;
  customerId: string;
  vehicleId: string;
  requestedAt: Date;
  startTime: Date;
  endTime: Date;
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  notes?: string;
  customer: {
    firstName: string;
    lastName: string;
  };
  vehicle: {
    make: string;
    model: string;
    year: number;
  };
  assignedTo?: {
    name: string;
  };
  cannedServices?: Array<{
    name: string;
  }>;
}

interface MiniCalendarProps {
  appointments?: Appointment[];
  onDateSelect?: (date: Date) => void;
}

const MiniCalendar: React.FC<MiniCalendarProps> = ({ 
  appointments = [], 
  onDateSelect 
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Generate calendar days for current week
  const generateCalendarDays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push({
        day: days[i],
        date: date.getDate(),
        fullDate: new Date(date),
        isSelected: date.toDateString() === selectedDate.toDateString()
      });
    }
    
    return dates;
  };

  // Get appointments for selected date
  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.startTime);
      return appointmentDate.toDateString() === date.toDateString();
    });
  };

  // Format time for display
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const calendarDays = generateCalendarDays();
  const selectedDateAppointments = getAppointmentsForDate(selectedDate);

  const handleDateClick = (fullDate: Date) => {
    setSelectedDate(fullDate);
    onDateSelect?.(fullDate);
  };

  const handlePreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      overflow: 'hidden',
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid #e2e8f0',
        backgroundColor: 'white'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h2 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#1e293b',
            margin: 0
          }}>
            Calendar
          </h2>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{
              fontSize: '12px',
              fontWeight: '500',
              color: '#64748b'
            }}>
              {currentDate.toLocaleDateString('en-US', { month: 'long' })}
            </span>
            <div style={{
              display: 'flex',
              gap: '2px'
            }}>
              <button
                onClick={handlePreviousWeek}
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '4px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#f1f5f9';
                  e.currentTarget.style.borderColor = '#cbd5e1';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              >
                <ChevronLeft size={12} color="#64748b" />
              </button>
              <button
                onClick={handleNextWeek}
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '4px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#f1f5f9';
                  e.currentTarget.style.borderColor = '#cbd5e1';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              >
                <ChevronRight size={12} color="#64748b" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '4px',
          marginBottom: '8px'
        }}>
          {calendarDays.map((day, index) => (
            <div key={index} style={{
              textAlign: 'center',
              fontSize: '10px',
              fontWeight: '500',
              color: '#64748b',
              padding: '4px 0'
            }}>
              {day.day}
            </div>
          ))}
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '4px',
          justifyContent: 'center'
        }}>
          {calendarDays.map((day, index) => (
            <div key={index} style={{
              display: 'flex',
              justifyContent: 'center'
            }}>
              <button
                onClick={() => handleDateClick(day.fullDate)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  backgroundColor: day.isSelected ? '#3b82f6' : 'transparent',
                  color: day.isSelected ? 'white' : '#374151'
                }}
                onMouseOver={(e) => {
                  if (!day.isSelected) {
                    e.currentTarget.style.backgroundColor = '#f1f5f9';
                  }
                }}
                onMouseOut={(e) => {
                  if (!day.isSelected) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                {day.date}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Schedule */}
      <div style={{
        padding: '12px 16px',
        flex: 1,
        overflowY: 'auto'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {selectedDateAppointments.length > 0 ? (
            selectedDateAppointments.map((appointment) => (
              <div key={appointment.id} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px'
              }}>
                {/* Time */}
                <div style={{
                  fontSize: '10px',
                  fontWeight: '500',
                  color: '#64748b',
                  width: '50px',
                  flexShrink: 0,
                  paddingTop: '2px'
                }}>
                  {formatTime(appointment.startTime)}
                </div>

                {/* Appointment Card */}
                <div style={{
                  flex: 1,
                  backgroundColor: '#f8fafc',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  border: '1px solid #e2e8f0'
                }}>
                  <h3 style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#1e293b',
                    margin: '0 0 2px 0'
                  }}>
                    {appointment.customer.firstName} {appointment.customer.lastName}
                  </h3>
                  <p style={{
                    fontSize: '10px',
                    color: '#64748b',
                    margin: 0
                  }}>
                    {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '20px',
              color: '#64748b'
            }}>
              <p style={{
                fontSize: '12px',
                margin: 0
              }}>
                No appointments scheduled
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MiniCalendar;
