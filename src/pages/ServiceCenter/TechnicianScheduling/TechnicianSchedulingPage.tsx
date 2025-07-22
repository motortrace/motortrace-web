import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import interactionPlugin from '@fullcalendar/interaction';
import DashboardHeader from '../../../layouts/DashboardHeader/DashboardHeader';
import MetricCard from '../../../components/MetricCard/MetricCard';
import type { JobCard as OriginalJobCard, JobService as OriginalJobService, Technician, Service } from '../../../types/JobCard';
import './TechnicianSchedulingPage.scss';
import AppointmentDetailsModal from '../../../components/AppointmentDetailsModal';

type JobService = Omit<OriginalJobService, 'status'> & { status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled' };
type JobCard = Omit<OriginalJobCard, 'jobServices'> & { jobServices: JobService[] };

const TechnicianSchedulingPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedTechnician, setSelectedTechnician] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
  const calendarRef = useRef<FullCalendar>(null);
  const [jobCards, setJobCards] = useState<JobCard[]>([]);
  const [calendarKey, setCalendarKey] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  // Reset calendar when component mounts and handle view changes
  useEffect(() => {
    if (calendarRef.current) {
      calendarRef.current.getApi().changeView(viewMode === 'day' ? 'resourceTimelineDay' : 'resourceTimelineWeek');
    }
    
    return () => {
      if (calendarRef.current) {
        const calendarEl = (calendarRef.current as any).el as HTMLElement;
        if (calendarEl) {
          calendarEl.innerHTML = ''; // Clear calendar content
        }
      }
    };
  }, [viewMode]);

  // Sample technicians data
  const [technicians] = useState<Technician[]>([
    {
      id: 'tech1',
      name: 'Mike Johnson',
      skills: ['engine', 'electrical', 'diagnostics'],
      workingHours: { start: '08:00', end: '17:00' },
      dailyCapacity: 3,
      color: '#3b82f6',
      isActive: true,
    },
    {
      id: 'tech2',
      name: 'Sarah Lee',
      skills: ['brakes', 'suspension', 'alignment'],
      workingHours: { start: '09:00', end: '18:00' },
      dailyCapacity: 4,
      color: '#10b981',
      isActive: true,
    },
    {
      id: 'tech3',
      name: 'John Smith',
      skills: ['engine', 'transmission', 'diagnostics'],
      workingHours: { start: '08:00', end: '17:00' },
      dailyCapacity: 2,
      color: '#f59e0b',
      isActive: true,
    },
    {
      id: 'tech4',
      name: 'Alex Chen',
      skills: ['electrical', 'ac', 'diagnostics'],
      workingHours: { start: '09:00', end: '18:00' },
      dailyCapacity: 3,
      color: '#8b5cf6',
      isActive: true,
    },
  ]);

  // Sample appointments data
  const [appointments] = useState<Service[]>([
    { id: 's1', name: 'Oil Change', category: 'Maintenance', estimatedDuration: 30, requiredSkill: 'engine' },
    { id: 's2', name: 'Brake Service', category: 'Brakes', estimatedDuration: 120, requiredSkill: 'brakes' },
    { id: 's3', name: 'Wheel Alignment', category: 'Suspension', estimatedDuration: 60, requiredSkill: 'alignment' },
    { id: 's4', name: 'Engine Diagnostics', category: 'Diagnostics', estimatedDuration: 45, requiredSkill: 'diagnostics' },
    { id: 's5', name: 'AC Service', category: 'AC', estimatedDuration: 90, requiredSkill: 'ac' },
    { id: 's6', name: 'Transmission Service', category: 'Transmission', estimatedDuration: 180, requiredSkill: 'transmission' },
  ]);

  // Initialize job cards with assigned appointments
  useEffect(() => {
    const today = new Date();
    const initialJobCards: JobCard[] = [
      {
        id: 'APR#1001',
        customer: 'Jack Martin',
        vehicle: '2020 Toyota Camry',
        status: 'completed',
        createdAt: today,
        updatedAt: today,
        jobServices: [
          {
            id: 'js1',
            jobCardId: 'APR#1001',
            serviceId: 's1',
            serviceName: 'Oil Change',
            estimatedDuration: 30,
            requiredSkill: 'engine',
            technicianId: 'tech1',
            scheduledStart: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0, 0),
            scheduledEnd: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 30, 0),
            status: 'completed',
            taskType: 'service',
          },
        ] as JobService[],
      },
      {
        id: 'APR#1002',
        customer: 'Sarah Wilson',
        vehicle: '2019 Honda Civic',
        status: 'in_progress',
        createdAt: today,
        updatedAt: today,
        jobServices: [
          {
            id: 'js2',
            jobCardId: 'APR#1002',
            serviceId: 's2',
            serviceName: 'Brake Service',
            estimatedDuration: 120,
            requiredSkill: 'brakes',
            technicianId: 'tech2',
            scheduledStart: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0, 0),
            scheduledEnd: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0, 0),
            status: 'assigned',
            taskType: 'service',
          },
        ] as JobService[],
      },
      {
        id: 'APR#1003',
        customer: 'Michael Davis',
        vehicle: '2021 Ford F-150',
        status: 'approved',
        createdAt: today,
        updatedAt: today,
        jobServices: [
          {
            id: 'js3',
            jobCardId: 'APR#1003',
            serviceId: 's4',
            serviceName: 'Engine Diagnostics',
            estimatedDuration: 45,
            requiredSkill: 'diagnostics',
            technicianId: 'tech1',
            scheduledStart: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 13, 0, 0),
            scheduledEnd: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 13, 45, 0),
            status: 'assigned',
            taskType: 'inspection',
          },
        ] as JobService[],
      },
      {
        id: 'APR#1004',
        customer: 'Emma Thompson',
        vehicle: '2018 BMW X3',
        status: 'cancelled',
        createdAt: today,
        updatedAt: today,
        jobServices: [
          {
            id: 'js4',
            jobCardId: 'APR#1004',
            serviceId: 's5',
            serviceName: 'AC Service',
            estimatedDuration: 90,
            requiredSkill: 'ac',
            technicianId: 'tech4',
            scheduledStart: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 0, 0),
            scheduledEnd: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 15, 30, 0),
            status: 'cancelled',
            taskType: 'service',
          },
        ] as JobService[],
      },
      {
        id: 'APR#1005',
        customer: 'Robert Johnson',
        vehicle: '2020 Mercedes C-Class',
        status: 'approved',
        createdAt: today,
        updatedAt: today,
        jobServices: [
          {
            id: 'js5',
            jobCardId: 'APR#1005',
            serviceId: 's3',
            serviceName: 'Wheel Alignment',
            estimatedDuration: 60,
            requiredSkill: 'alignment',
            technicianId: 'tech2',
            scheduledStart: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 13, 30, 0),
            scheduledEnd: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 30, 0),
            status: 'assigned',
            taskType: 'service',
          },
        ] as JobService[],
      },
      {
        id: 'APR#1006',
        customer: 'Lisa Anderson',
        vehicle: '2022 Tesla Model 3',
        status: 'approved',
        createdAt: today,
        updatedAt: today,
        jobServices: [
          {
            id: 'js6',
            jobCardId: 'APR#1006',
            serviceId: 's6',
            serviceName: 'Transmission Service',
            estimatedDuration: 180,
            requiredSkill: 'transmission',
            technicianId: 'tech3',
            scheduledStart: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 8, 30, 0),
            scheduledEnd: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 30, 0),
            status: 'assigned',
            taskType: 'service',
          },
        ] as JobService[],
      },
      {
        id: 'APR#1007',
        customer: 'David Miller',
        vehicle: '2019 Audi A4',
        status: 'approved',
        createdAt: today,
        updatedAt: today,
        jobServices: [
          {
            id: 'js7',
            jobCardId: 'APR#1007',
            serviceId: 'app1',
            serviceName: 'Customer Consultation',
            estimatedDuration: 60,
            requiredSkill: 'diagnostics',
            technicianId: 'tech1',
            scheduledStart: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 0, 0),
            scheduledEnd: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0, 0),
            status: 'assigned',
            taskType: 'appointment',
          },
        ] as JobService[],
      },
      {
        id: 'APR#1008',
        customer: 'Jennifer Brown',
        vehicle: '2021 Hyundai Elantra',
        status: 'approved',
        createdAt: today,
        updatedAt: today,
        jobServices: [
          {
            id: 'js8',
            jobCardId: 'APR#1008',
            serviceId: 'app2',
            serviceName: 'Vehicle Assessment',
            estimatedDuration: 45,
            requiredSkill: 'diagnostics',
            technicianId: 'tech2',
            scheduledStart: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 15, 0, 0),
            scheduledEnd: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 15, 45, 0),
            status: 'assigned',
            taskType: 'appointment',
          },
        ] as JobService[],
      },
    ];
    setJobCards(initialJobCards);
    setCalendarKey(prev => prev + 1); // Force calendar remount
  }, []);

  // Get job card by appointment
  const getJobCardByAppointment = (appointmentId: string) => {
    return jobCards.find(jobCard => 
      jobCard.jobServices.some(appointment => appointment.id === appointmentId)
    );
  };

  // Get status color based on appointment status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10b981';  // Green
      case 'cancelled': return '#ef4444';  // Red
      case 'assigned': return '#3b82f6';   // Blue
      case 'pending': return '#f59e0b';    // Orange
      case 'in_progress': return '#8b5cf6'; // Purple
      default: return '#6b7280';           // Gray
    }
  };

  // Get all job appointments
  const allJobAppointments = useMemo(() => {
    return jobCards.flatMap(jobCard => jobCard.jobServices);
  }, [jobCards]);

  // Get assigned job appointments for today
  const todayAssignedAppointments = useMemo(() => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);
    
    return allJobAppointments.filter(appointment => 
      appointment.technicianId !== null && 
      appointment.scheduledStart && 
      appointment.scheduledStart >= todayStart &&
      appointment.scheduledStart < todayEnd
    );
  }, [allJobAppointments]);

  // Convert technicians to FullCalendar resources
  const calendarResources = useMemo(() => {
    return technicians.map(tech => ({
      id: tech.id,
      title: tech.name,
      eventColor: tech.color,
      extendedProps: {
        skills: tech.skills,
        workingHours: tech.workingHours,
        dailyCapacity: tech.dailyCapacity,
        isActive: tech.isActive
      }
    }));
  }, [technicians]);

  // Convert job appointments to FullCalendar events
  const calendarEvents = useMemo(() => {
    return todayAssignedAppointments
      .filter(appointment => appointment.scheduledStart && appointment.scheduledEnd && appointment.technicianId)
      .map(appointment => {
        const jobCard = getJobCardByAppointment(appointment.id);
        const technician = technicians.find(t => t.id === appointment.technicianId);
        
        return {
          id: appointment.id,
          resourceId: appointment.technicianId!,
          title: `${jobCard?.id} - ${jobCard?.customer}`,
          start: appointment.scheduledStart!,
          end: appointment.scheduledEnd!,
          extendedProps: {
            appointment,
            jobCard,
            technician
          },
          backgroundColor: getStatusColor(appointment.status),
          borderColor: getStatusColor(appointment.status),
          textColor: '#ffffff',
          classNames: [`status-${appointment.status}`]
        };
      });
  }, [todayAssignedAppointments, technicians]);

  // Handle task assignment via drag and drop
  const handleEventReceive = (info: any) => {
    const appointmentId = info.event.id;
    const technicianId = info.event.getResources()[0].id;
    const startTime = info.event.start;
    
    // Update the job appointment with new technician and time
    setJobCards(prevJobCards => 
      prevJobCards.map(jobCard => {
        const updatedAppointments = jobCard.jobServices.map(appointment => {
          if (appointment.id === appointmentId) {
            const endTime = new Date(startTime.getTime() + appointment.estimatedDuration * 60000);
            return {
              ...appointment,
              technicianId,
              scheduledStart: startTime,
              scheduledEnd: endTime,
              status: 'assigned' as const
            };
          }
          return appointment;
        });
        return { ...jobCard, jobServices: updatedAppointments };
      })
    );
  };

  // Handle task reassignment via drag and drop
  const handleEventDrop = (info: any) => {
    const appointmentId = info.event.id;
    const newTechnicianId = info.event.getResources()[0].id;
    const newStartTime = info.event.start;
    const newEndTime = info.event.end;

    // Update the appointment assignment
    setJobCards(prevJobCards => 
      prevJobCards.map(jobCard => {
        const updatedAppointments = jobCard.jobServices.map(appointment => {
          if (appointment.id === appointmentId) {
            return {
              ...appointment,
              technicianId: newTechnicianId,
              scheduledStart: newStartTime,
              scheduledEnd: newEndTime
            };
          }
          return appointment;
        });
        return { ...jobCard, jobServices: updatedAppointments };
      })
    );
  };

  // Handle task resize
  const handleEventResize = (info: any) => {
    const appointmentId = info.event.id;
    const newStartTime = info.event.start;
    const newEndTime = info.event.end;

    // Update the appointment duration
    setJobCards(prevJobCards => 
      prevJobCards.map(jobCard => {
        const updatedAppointments = jobCard.jobServices.map(appointment => {
          if (appointment.id === appointmentId) {
            return {
              ...appointment,
              scheduledStart: newStartTime,
              scheduledEnd: newEndTime
            };
          }
          return appointment;
        });
        return { ...jobCard, jobServices: updatedAppointments };
      })
    );
  };



  // Handle date navigation
  const handleDatesSet = (dateInfo: any) => {
    setCurrentDate(dateInfo.view.currentStart);
  };

  // Handle navigation to job card
  const handleNavigateToJobCard = () => {
    navigate('/servicecenter/jobcard');
  };

  // Handle event click to open modal
  const handleEventClick = (info: any) => {
    setSelectedEvent(info.event.extendedProps);
    setModalOpen(true);
  };

  // Custom toolbar component
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
            className="today-btn" 
            onClick={() => {
              calendar?.today();
              setCurrentDate(new Date());
            }}
          >
            Today
          </button>
        </div>
        <div className="toolbar-right">
          <div className="view-switcher">
            <button 
              className={`view-btn ${viewMode === 'day' ? 'active' : ''}`} 
              onClick={() => {
                calendar?.changeView('resourceTimelineDay');
                setViewMode('day');
              }}
            >
              Day
            </button>
            <button 
              className={`view-btn ${viewMode === 'week' ? 'active' : ''}`} 
              onClick={() => {
                calendar?.changeView('resourceTimelineWeek');
                setViewMode('week');
              }}
            >
              Week
            </button>
          </div>

        </div>
      </div>
    );
  };

  // Sync calendar with current date
  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.gotoDate(currentDate);
    }
  }, [currentDate]);

  return (
    <div className="technician-scheduling-page">

      {/* Modal for event details */}
      <AppointmentDetailsModal open={modalOpen} onClose={() => setModalOpen(false)} appointment={selectedEvent} />
      {/* Metrics */}
      <div className="metric-cards-row">
        <MetricCard
          title="Active Technicians"
          amount={technicians.length.toString()}
          change="0%"
          changeType="positive"
        />
        <MetricCard
          title="Scheduled Today"
          amount={todayAssignedAppointments.length.toString()}
          change="12%"
          changeType="positive"
        />

        <MetricCard
          title="Completed Today"
          amount={todayAssignedAppointments.filter(a => a.status === 'completed').length.toString()}
          change="8%"
          changeType="positive"
        />
      </div>

      <div className="technician-scheduling-content">
        {/* Calendar View */}
        <div className="calendar-view">
          <CustomToolbar />
          <div className="calendar-container">
            <FullCalendar
              key={`calendar-${calendarKey}`}
              ref={calendarRef}
              plugins={[resourceTimelinePlugin, interactionPlugin]}
              headerToolbar={false}
              initialView="resourceTimelineDay"
              initialDate={currentDate}
              resources={calendarResources}
              events={calendarEvents}
              editable={true}
              droppable={true}
              selectable={true}
              eventReceive={handleEventReceive}
              eventDrop={handleEventDrop}
              eventResize={handleEventResize}
              datesSet={handleDatesSet}
              height="600px"
              slotMinTime="09:00:00"
              slotMaxTime="17:00:00"
              slotDuration="00:30:00"
              resourceAreaHeaderContent="Technicians"
              resourceAreaWidth="200px"
              resourceOrder="title"
              nowIndicator={true}
              scrollTime="09:00:00"
              eventOverlap={false}
              slotEventOverlap={false}
              eventDisplay="block"
              eventClick={handleEventClick}
            />
          </div>
        </div>
      </div>

      {/* Technician Dashboard */}
      <div className="technician-dashboard">
        <h2 className="technician-dashboard__title">Technician Overview</h2>
        <div className="technician-dashboard__grid">
          {technicians.map(technician => {
            const technicianAppointments = todayAssignedAppointments.filter(
              appointment => appointment.technicianId === technician.id
            );
            const totalHours = technicianAppointments.reduce(
              (sum, appointment) => sum + appointment.estimatedDuration, 0
            );
            const loadPercentage = Math.min((totalHours / (technician.dailyCapacity * 60)) * 100, 100);
            const completedAppointments = technicianAppointments.filter(a => a.status === 'completed').length;
            const inProgressAppointments = technicianAppointments.filter(a => a.status === 'assigned').length;
            
            return (
              <div key={technician.id} className="technician-card">
                <div className="technician-card__header">
                  <div className="technician-card__info">
                    <div 
                      className="technician-card__avatar"
                      style={{ backgroundColor: technician.color }}
                    >
                      {technician.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="technician-card__details">
                      <h4>{technician.name}</h4>
                      <p>{technician.workingHours.start} - {technician.workingHours.end}</p>
                    </div>
                  </div>
                  <div className={`technician-card__status ${
                    loadPercentage > 80 ? 'busy' : 
                    technician.isActive ? 'active' : 'offline'
                  }`}>
                    {loadPercentage > 80 ? 'Busy' : 
                     technician.isActive ? 'Active' : 'Offline'}
                  </div>
                </div>
                
                <div className="technician-card__content">
                  <div className="technician-card__metrics">
                    <div className="technician-card__metric">
                      <div className="metric-value">{technicianAppointments.length}</div>
                      <div className="metric-label">Assigned</div>
                    </div>
                    <div className="technician-card__metric">
                      <div className="metric-value">{completedAppointments}</div>
                      <div className="metric-label">Completed</div>
                    </div>
                    <div className="technician-card__metric">
                      <div className="metric-value">{inProgressAppointments}</div>
                      <div className="metric-label">In Progress</div>
                    </div>
                  </div>
                  
                  <div className="technician-card__progress">
                    <div className="progress-header">
                      <span className="progress-label">Daily Load</span>
                      <span className="progress-value">{Math.round(loadPercentage)}%</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ 
                          width: `${loadPercentage}%`,
                          backgroundColor: loadPercentage > 80 ? 'var(--color-warning)' : 
                                          loadPercentage > 60 ? 'var(--color-primary)' : 'var(--color-success)'
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="technician-card__skills">
                    {technician.skills.map(skill => (
                      <span key={skill} className="skill-tag">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TechnicianSchedulingPage;