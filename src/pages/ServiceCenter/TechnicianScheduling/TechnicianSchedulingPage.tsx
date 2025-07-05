import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Play } from 'lucide-react';
import FullCalendar from '@fullcalendar/react';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import interactionPlugin from '@fullcalendar/interaction';
import DashboardHeader from '../../../layouts/DashboardHeader/DashboardHeader';
import MetricCard from '../../../components/MetricCard/MetricCard';
import type { JobCard, JobService, Technician, Service } from '../../../types/JobCard';
import './TechnicianSchedulingPage.scss';

const TechnicianSchedulingPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedTechnician, setSelectedTechnician] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
  const calendarRef = useRef<FullCalendar>(null);
  const [jobCards, setJobCards] = useState<JobCard[]>([]);
  const [calendarKey, setCalendarKey] = useState(0);

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

  // Sample services data
  const [services] = useState<Service[]>([
    { id: 's1', name: 'Oil Change', category: 'Maintenance', estimatedDuration: 30, requiredSkill: 'engine' },
    { id: 's2', name: 'Brake Service', category: 'Brakes', estimatedDuration: 120, requiredSkill: 'brakes' },
    { id: 's3', name: 'Wheel Alignment', category: 'Suspension', estimatedDuration: 60, requiredSkill: 'alignment' },
    { id: 's4', name: 'Engine Diagnostics', category: 'Diagnostics', estimatedDuration: 45, requiredSkill: 'diagnostics' },
    { id: 's5', name: 'AC Service', category: 'AC', estimatedDuration: 90, requiredSkill: 'ac' },
    { id: 's6', name: 'Transmission Service', category: 'Transmission', estimatedDuration: 180, requiredSkill: 'transmission' },
  ]);

  // Initialize job cards with assigned tasks
  useEffect(() => {
    const today = new Date();
    const initialJobCards: JobCard[] = [
      {
        id: 'JC001',
        customer: 'John Doe',
        vehicle: '2020 Toyota Camry',
        status: 'in_progress',
        createdAt: today,
        updatedAt: today,
        jobServices: [
          {
            id: 'js1',
            jobCardId: 'JC001',
            serviceId: 's1',
            serviceName: 'Oil Change',
            estimatedDuration: 30,
            requiredSkill: 'engine',
            technicianId: 'tech1',
            scheduledStart: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0, 0),
            scheduledEnd: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 30, 0),
            status: 'assigned',
            taskType: 'service',
          },
          {
            id: 'js2',
            jobCardId: 'JC001',
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
        ],
      },
      {
        id: 'JC002',
        customer: 'Jane Smith',
        vehicle: '2019 Honda Civic',
        status: 'approved',
        createdAt: today,
        updatedAt: today,
        jobServices: [
          {
            id: 'js3',
            jobCardId: 'JC002',
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
          {
            id: 'js4',
            jobCardId: 'JC002',
            serviceId: 's5',
            serviceName: 'AC Service',
            estimatedDuration: 90,
            requiredSkill: 'ac',
            technicianId: 'tech4',
            scheduledStart: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 0, 0),
            scheduledEnd: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 15, 30, 0),
            status: 'assigned',
            taskType: 'service',
          },
        ],
      },
      {
        id: 'JC003',
        customer: 'Bob Wilson',
        vehicle: '2021 Ford F-150',
        status: 'approved',
        createdAt: today,
        updatedAt: today,
        jobServices: [
          {
            id: 'js5',
            jobCardId: 'JC003',
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
          {
            id: 'js6',
            jobCardId: 'JC003',
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
        ],
      },
      {
        id: 'JC004',
        customer: 'Alice Brown',
        vehicle: '2018 BMW X3',
        status: 'approved',
        createdAt: today,
        updatedAt: today,
        jobServices: [
          {
            id: 'js7',
            jobCardId: 'JC004',
            serviceId: 's1',
            serviceName: 'Oil Change',
            estimatedDuration: 30,
            requiredSkill: 'engine',
            technicianId: null,
            scheduledStart: null,
            scheduledEnd: null,
            status: 'pending',
            taskType: 'service',
          },
          {
            id: 'js8',
            jobCardId: 'JC004',
            serviceId: 's2',
            serviceName: 'Brake Service',
            estimatedDuration: 120,
            requiredSkill: 'brakes',
            technicianId: null,
            scheduledStart: null,
            scheduledEnd: null,
            status: 'pending',
            taskType: 'service',
          },
        ],
      },
      {
        id: 'JC005',
        customer: 'David Miller',
        vehicle: '2022 Tesla Model 3',
        status: 'approved',
        createdAt: today,
        updatedAt: today,
        jobServices: [
          {
            id: 'js9',
            jobCardId: 'JC005',
            serviceId: 's4',
            serviceName: 'Engine Diagnostics',
            estimatedDuration: 45,
            requiredSkill: 'diagnostics',
            technicianId: 'tech3',
            scheduledStart: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 0, 0),
            scheduledEnd: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 45, 0),
            status: 'assigned',
            taskType: 'inspection',
          },
        ],
      },
      {
        id: 'JC006',
        customer: 'Emma Davis',
        vehicle: '2020 Mercedes C-Class',
        status: 'approved',
        createdAt: today,
        updatedAt: today,
        jobServices: [
          {
            id: 'js10',
            jobCardId: 'JC006',
            serviceId: 's5',
            serviceName: 'AC Service',
            estimatedDuration: 90,
            requiredSkill: 'ac',
            technicianId: 'tech4',
            scheduledStart: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 16, 0, 0),
            scheduledEnd: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 17, 30, 0),
            status: 'assigned',
            taskType: 'service',
          },
          {
            id: 'js11',
            jobCardId: 'JC006',
            serviceId: 's1',
            serviceName: 'Oil Change',
            estimatedDuration: 30,
            requiredSkill: 'engine',
            technicianId: 'tech1',
            scheduledStart: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 16, 30, 0),
            scheduledEnd: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 17, 0, 0),
            status: 'assigned',
            taskType: 'service',
          },
        ],
      },
      {
        id: 'JC007',
        customer: 'Maria Garcia',
        vehicle: '2021 Audi A4',
        status: 'approved',
        createdAt: today,
        updatedAt: today,
        jobServices: [
          {
            id: 'js12',
            jobCardId: 'JC007',
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
          {
            id: 'js13',
            jobCardId: 'JC007',
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
        ],
      },
    ];
    setJobCards(initialJobCards);
    setCalendarKey(prev => prev + 1); // Force calendar remount
  }, []);

  // Get job card by service
  const getJobCardByService = (serviceId: string) => {
    return jobCards.find(jobCard => 
      jobCard.jobServices.some(service => service.id === serviceId)
    );
  };

  // Get task type color
  const getTaskTypeColor = (taskType: 'appointment' | 'service' | 'inspection') => {
    switch (taskType) {
      case 'appointment': return '#8b5cf6'; // Purple
      case 'service': return '#3b82f6';     // Blue
      case 'inspection': return '#10b981';  // Green
      default: return '#6b7280';
    }
  };

  // Get all job services
  const allJobServices = useMemo(() => {
    return jobCards.flatMap(jobCard => jobCard.jobServices);
  }, [jobCards]);



  // Get assigned job services for today
  const todayAssignedServices = useMemo(() => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);
    
    return allJobServices.filter(service => 
      service.technicianId !== null && 
      service.scheduledStart && 
      service.scheduledStart >= todayStart &&
      service.scheduledStart < todayEnd
    );
  }, [allJobServices]);

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

  // Convert job services to FullCalendar events
  const calendarEvents = useMemo(() => {
    return todayAssignedServices
      .filter(service => service.scheduledStart && service.scheduledEnd && service.technicianId)
      .map(service => {
        const jobCard = getJobCardByService(service.id);
        const technician = technicians.find(t => t.id === service.technicianId);
        
        return {
          id: service.id,
          resourceId: service.technicianId!,
          title: `${service.serviceName} - ${jobCard?.customer}`,
          start: service.scheduledStart!,
          end: service.scheduledEnd!,
          extendedProps: {
            service,
            jobCard,
            technician
          },
          backgroundColor: getTaskTypeColor(service.taskType),
          borderColor: getTaskTypeColor(service.taskType),
          textColor: '#ffffff',
          classNames: [`task-type-${service.taskType}`]
        };
      });
  }, [todayAssignedServices, technicians]);

  // Handle task assignment via drag and drop
  const handleEventReceive = (info: any) => {
    const serviceId = info.event.id;
    const technicianId = info.event.getResources()[0].id;
    const startTime = info.event.start;
    
    // Update the job service with new technician and time
    setJobCards(prevJobCards => 
      prevJobCards.map(jobCard => {
        const updatedServices = jobCard.jobServices.map(service => {
          if (service.id === serviceId) {
            const endTime = new Date(startTime.getTime() + service.estimatedDuration * 60000);
            return {
              ...service,
              technicianId,
              scheduledStart: startTime,
              scheduledEnd: endTime,
              status: 'assigned' as const
            };
          }
          return service;
        });
        return { ...jobCard, jobServices: updatedServices };
      })
    );
  };

  // Handle task reassignment via drag and drop
  const handleEventDrop = (info: any) => {
    const serviceId = info.event.id;
    const newTechnicianId = info.event.getResources()[0].id;
    const newStartTime = info.event.start;
    const newEndTime = info.event.end;

    // Update the service assignment
    setJobCards(prevJobCards => 
      prevJobCards.map(jobCard => {
        const updatedServices = jobCard.jobServices.map(service => {
          if (service.id === serviceId) {
            return {
              ...service,
              technicianId: newTechnicianId,
              scheduledStart: newStartTime,
              scheduledEnd: newEndTime
            };
          }
          return service;
        });
        return { ...jobCard, jobServices: updatedServices };
      })
    );
  };

  // Handle task resize
  const handleEventResize = (info: any) => {
    const serviceId = info.event.id;
    const newStartTime = info.event.start;
    const newEndTime = info.event.end;

    // Update the service duration
    setJobCards(prevJobCards => 
      prevJobCards.map(jobCard => {
        const updatedServices = jobCard.jobServices.map(service => {
          if (service.id === serviceId) {
            return {
              ...service,
              scheduledStart: newStartTime,
              scheduledEnd: newEndTime
            };
          }
          return service;
        });
        return { ...jobCard, jobServices: updatedServices };
      })
    );
  };

  // Auto-schedule function
  const handleAutoSchedule = () => {
    console.log('Auto-scheduling unassigned services...');
    // Implement auto-scheduling logic here
  };

  // Handle date navigation
  const handleDatesSet = (dateInfo: any) => {
    setCurrentDate(dateInfo.view.currentStart);
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
          <button className="auto-schedule-btn" onClick={handleAutoSchedule}>
            <Play size={16} />
            Auto Schedule
          </button>
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
          amount={todayAssignedServices.length.toString()}
          change="12%"
          changeType="positive"
        />

        <MetricCard
          title="Completed Today"
          amount={todayAssignedServices.filter(s => s.status === 'completed').length.toString()}
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
              slotMinTime="07:00:00"
              slotMaxTime="20:00:00"
              slotDuration="00:30:00"
              resourceAreaHeaderContent="Technicians"
              resourceAreaWidth="200px"
              resourceOrder="title"
              nowIndicator={true}
              scrollTime="08:00:00"
              eventOverlap={false}
              slotEventOverlap={false}
              eventDisplay="block"
            />
          </div>
        </div>
      </div>

      {/* Technician Dashboard */}
      <div className="technician-dashboard">
        <h2 className="technician-dashboard__title">Technician Overview</h2>
        <div className="technician-dashboard__grid">
          {technicians.map(technician => {
            const technicianServices = todayAssignedServices.filter(
              service => service.technicianId === technician.id
            );
            const totalHours = technicianServices.reduce(
              (sum, service) => sum + service.estimatedDuration, 0
            );
            const loadPercentage = Math.min((totalHours / (technician.dailyCapacity * 60)) * 100, 100);
            const completedServices = technicianServices.filter(s => s.status === 'completed').length;
            const inProgressServices = technicianServices.filter(s => s.status === 'assigned').length;
            
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
                      <div className="metric-value">{technicianServices.length}</div>
                      <div className="metric-label">Assigned</div>
                    </div>
                    <div className="technician-card__metric">
                      <div className="metric-value">{completedServices}</div>
                      <div className="metric-label">Completed</div>
                    </div>
                    <div className="technician-card__metric">
                      <div className="metric-value">{inProgressServices}</div>
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