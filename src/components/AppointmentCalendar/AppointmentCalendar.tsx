// components/AppointmentCalendar/AppointmentCalendar.tsx
import React, { useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import './AppointmentCalendar.scss';

export interface Appointment {
  id: string;
  title: string;
  customer: string;
  phone: string;
  email: string;
  vehicle: string;
  start: Date;
  end: Date;
  services: string[];
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  priority: 'urgent' | 'moderate' | 'normal';
  notes?: string;
  dropOff: boolean;
  technician: string;
  // Extended fields for modal
  source?: string;
  year?: number;
  license?: string;
  mileage?: number;
  duration?: string;
  bay?: string;
  pickupDate?: Date;
  preferredContact?: string;
  reminder?: string;
  createdOn?: Date;
  bookedBy?: string;
}

interface AppointmentCalendarProps {
  appointments: Appointment[];
  currentDate: Date;
  onDateChange: (date: Date) => void;
  currentView: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay';
  onViewChange: (view: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay') => void;
  onSelectEvent: (event: Appointment) => void;
  onSelectSlot?: (slotInfo: { start: Date; end: Date }) => void;
}

const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({
  appointments,
  currentDate,
  onDateChange,
  currentView,
  onViewChange,
  onSelectEvent,
  onSelectSlot,
}) => {
  const calendarRef = useRef<FullCalendar>(null);

  // Convert appointments to FullCalendar events
  const events = appointments.map(appointment => ({
    id: appointment.id,
    title: `${appointment.customer} - ${appointment.title}`,
    start: appointment.start,
    end: appointment.end,
    extendedProps: appointment,
    classNames: [
      `status-${appointment.status}`
    ],
    backgroundColor: '#F0EFF2',
    borderColor: '#343438',
    textColor: '#343438'
  }));

  const handleEventClick = (clickInfo: any) => {
    onSelectEvent(clickInfo.event.extendedProps);
  };

  const handleDateSelect = (selectInfo: any) => {
    if (onSelectSlot) {
      onSelectSlot({
        start: selectInfo.start,
        end: selectInfo.end
      });
    }
  };

  const handleDatesSet = (dateInfo: any) => {
    onDateChange(dateInfo.start);
  };

  const handleViewChange = (viewInfo: any) => {
    onViewChange(viewInfo.view.type);
  };

  const CustomToolbar = () => {
    const calendar = calendarRef.current?.getApi();
    
    return (
      <div className="calendar-toolbar">
        <div className="toolbar-left">
          <button 
            className="nav-btn" 
            onClick={() => calendar?.prev()}
          >
            ‹
          </button>
          <h2 className="calendar-title">{calendar?.view.title}</h2>
          <button 
            className="nav-btn" 
            onClick={() => calendar?.next()}
          >
            ›
          </button>
          <button 
            className="today-btn custom-today-btn" 
            style={{ background: '#343438', color: '#fff' }}
            onClick={() => calendar?.today()}
          >
            Today
          </button>
        </div>
        <div className="toolbar-right">
          <div className="view-switcher">
            <button 
              className={`view-btn ${currentView === 'timeGridDay' ? 'active' : ''}`} 
              onClick={() => calendar?.changeView('timeGridDay')}
            >
              Day
            </button>
            <button 
              className={`view-btn ${currentView === 'timeGridWeek' ? 'active' : ''}`} 
              onClick={() => calendar?.changeView('timeGridWeek')}
            >
              Week
            </button>
            <button 
              className={`view-btn ${currentView === 'dayGridMonth' ? 'active' : ''}`} 
              onClick={() => calendar?.changeView('dayGridMonth')}
            >
              Month
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="appointment-calendar">
      <CustomToolbar />
      <div className="calendar-container">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={false} // We use custom toolbar
          initialView={'timeGridWeek'}
          initialDate={currentDate}
          events={events}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          eventClick={handleEventClick}
          select={handleDateSelect}
          datesSet={handleDatesSet}
          viewDidMount={handleViewChange}
          height="600px"
          slotMinTime="08:00:00"
          slotMaxTime="18:00:00"
          slotDuration="00:30:00"
          slotLabelInterval="01:00:00"
          allDaySlot={false}
          nowIndicator={true}
          eventOverlap={true}
          slotEventOverlap={false}
          eventMaxStack={3}
          dayMaxEventRows={4}
          moreLinkClick="popover"
          eventDisplay="block"
          displayEventTime={true}
          eventTimeFormat={{
            hour: 'numeric',
            minute: '2-digit',
            omitZeroMinute: false,
            meridiem: 'short'
          }}
        />
      </div>
    </div>
  );
};

export default AppointmentCalendar;