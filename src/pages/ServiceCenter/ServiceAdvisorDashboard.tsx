import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import MiniCalendar from '../../components/MiniCalendar/MiniCalendar';

// Work Order Status data
const workOrderData = [
  { name: 'Estimate', value: 12, color: '#3B82F6' },
  { name: 'Approval', value: 8, color: '#F97316' },
  { name: 'In Progress', value: 15, color: '#8B5CF6' },
  { name: 'Waiting for Parts', value: 6, color: '#EAB308' },
  { name: 'Completed', value: 19, color: '#10B981' }
];

const totalWorkOrders = workOrderData.reduce((sum, item) => sum + item.value, 0);

// Sample assigned appointments data for service advisor
const assignedAppointments = [
  {
    id: '1',
    startTime: '2024-09-13T09:00:00Z',
    endTime: '2024-09-13T10:00:00Z',
    customer: {
      firstName: 'John',
      lastName: 'Doe'
    }
  },
  {
    id: '2',
    startTime: '2024-09-13T14:00:00Z',
    endTime: '2024-09-13T15:30:00Z',
    customer: {
      firstName: 'Jane',
      lastName: 'Smith'
    }
  },
  {
    id: '3',
    startTime: '2024-09-13T16:00:00Z',
    endTime: '2024-09-13T17:00:00Z',
    customer: {
      firstName: 'Mike',
      lastName: 'Wilson'
    }
  }
];

// Metric Card Component
interface MetricCardProps {
  title: string;
  amount: string;
  icon?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, amount, icon }) => {
  return (
    <div style={{
      backgroundColor: 'white',
      padding: '16px',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      position: 'relative'
    }}>
      {icon && (
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          fontSize: '20px',
          color: '#64748b'
        }}>
          <i className={icon}></i>
        </div>
      )}
      <h3 style={{
        fontSize: '12px',
        fontWeight: '500',
        color: '#64748b',
        margin: '0 0 8px 0'
      }}>
        {title}
      </h3>
      <div style={{
        fontSize: '22px',
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: '8px'
      }}>
        {amount}
      </div>
    </div>
  );
};

// Work Order Status Gauge Component
const WorkOrderStatusGauge: React.FC = () => {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      padding: '20px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
    }}>
      <h3 style={{
        fontSize: '16px',
        fontWeight: '600',
        color: '#1e293b',
        margin: '0 0 20px 0',
        textAlign: 'center'
      }}>
        Work Order Status
      </h3>
      
      <div style={{ 
        display: 'flex', 
        alignItems: 'flex-start', 
        gap: '20px',
        height: '200px'
      }}>
        {/* Gauge Chart */}
        <div style={{ 
          flex: '1', 
          position: 'relative',
          height: '180px'
        }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={workOrderData}
                cx="50%"
                cy="60%"
                startAngle={180}
                endAngle={0}
                innerRadius={70}
                outerRadius={100}
                paddingAngle={1}
                dataKey="value"
              >
                {workOrderData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          
          {/* Center number positioned BELOW the arc - moved UP closer */}
          <div style={{
            position: 'absolute',
            top: '75%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#1e293b',
              lineHeight: '1'
            }}>
              {totalWorkOrders}
            </div>
            <div style={{
              fontSize: '12px',
              color: '#64748b',
              fontWeight: '500',
              marginTop: '4px'
            }}>
              Total Orders
            </div>
          </div>
        </div>
        
        {/* Legend positioned to the RIGHT */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          justifyContent: 'center',
          minWidth: '180px'
        }}>
          {workOrderData.map((item, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '13px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <div style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: item.color
                }} />
                <span style={{ color: '#475569', fontWeight: '500' }}>
                  {item.name}
                </span>
              </div>
              <span style={{ color: '#1e293b', fontWeight: '600' }}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ServiceAdvisorDashboard = () => {
  return (
    <div style={{
      padding: '16px',
    //   backgroundColor: '#f8fafc',
      minHeight: '100vh'
    }}>
      {/* Page Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          flex: 1
        }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '600',
            color: '#1e293b',
            margin: '0 0 0.25rem 0'
          }}>
            Service Advisor Dashboard
          </h1>
          <p style={{
            color: '#64748b',
            fontSize: '16px',
            margin: 0
          }}>
            Welcome back! Here's your overview for today.
          </p>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          {/* Service Advisor Profile */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            {/* Profile Image */}
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '18px',
              fontWeight: '600'
            }}>
              JD
            </div>
            
            {/* Profile Info */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '2px'
            }}>
              <div style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#1e293b',
                lineHeight: '1.2'
              }}>
                John Doe
              </div>
              <div style={{
                fontSize: '14px',
                color: '#64748b',
                lineHeight: '1.2'
              }}>
                john.doe@motortrace.com
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout - Two Sections */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
        alignItems: 'start'
      }}>
        {/* Left Section */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {/* Top 3 Metric Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px'
          }}>
            <MetricCard
              title="Today's Appointments"
              amount="8"
              icon="bx bx-calendar-check"
            />
            <MetricCard
              title="Pending Confirmations"
              amount="3"
              icon="bx bx-time-five"
            />
            <MetricCard
              title="Customer Satisfaction"
              amount="4.8/5"
              icon="bx bx-star"
            />
          </div>
          
          {/* Work Order Status Gauge */}
          <WorkOrderStatusGauge />
        </div>

        {/* Right Section - Calendar */}
        <div style={{
          height: '100%'
        }}>
          <MiniCalendar appointments={assignedAppointments} />
        </div>
      </div>

      {/* Service Advisor Specific Section */}
      <div style={{
        marginTop: '24px',
        backgroundColor: 'white',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        overflow: 'hidden'
      }}>
        {/* Section Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #e2e8f0',
          backgroundColor: 'white'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#1e293b',
            margin: 0
          }}>
            My Appointments Today
          </h3>
        </div>

        {/* Appointments List */}
        <div style={{ padding: '16px 20px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr auto',
            gap: '16px',
            alignItems: 'center',
            padding: '12px 0',
            borderBottom: '1px solid #f1f5f9',
            fontSize: '12px',
            fontWeight: '600',
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            <div>Customer</div>
            <div>Vehicle</div>
            <div>Service</div>
            <div>Actions</div>
          </div>

          {/* Sample Appointment Data */}
          {[
            {
              id: 1,
              customer: 'John Smith',
              vehicle: '2020 Toyota Camry',
              service: 'Oil Change',
              time: '9:00 AM',
              status: 'Confirmed'
            },
            {
              id: 2,
              customer: 'Sarah Johnson',
              vehicle: '2019 Honda Civic',
              service: 'Brake Inspection',
              time: '11:30 AM',
              status: 'Pending'
            },
            {
              id: 3,
              customer: 'Mike Wilson',
              vehicle: '2021 Ford F-150',
              service: 'Engine Diagnostic',
              time: '2:00 PM',
              status: 'Confirmed'
            }
          ].map((appointment) => (
            <div key={appointment.id} style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr auto',
              gap: '16px',
              alignItems: 'center',
              padding: '16px 0',
              borderBottom: '1px solid #f1f5f9'
            }}>
              {/* Customer */}
              <div>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1e293b',
                  marginBottom: '2px'
                }}>
                  {appointment.customer}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#64748b'
                }}>
                  {appointment.time}
                </div>
              </div>

              {/* Vehicle */}
              <div style={{
                fontSize: '13px',
                color: '#475569',
                fontWeight: '500'
              }}>
                {appointment.vehicle}
              </div>

              {/* Service */}
              <div>
                <div style={{
                  fontSize: '13px',
                  color: '#475569',
                  fontWeight: '500',
                  marginBottom: '2px'
                }}>
                  {appointment.service}
                </div>
                <span style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  color: appointment.status === 'Confirmed' ? '#059669' : '#ea580c',
                  backgroundColor: appointment.status === 'Confirmed' ? '#d1fae5' : '#fed7aa',
                  padding: '2px 6px',
                  borderRadius: '8px'
                }}>
                  {appointment.status}
                </span>
              </div>

              {/* Action Button */}
              <div>
                <button style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: 'white',
                  color: '#64748b',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                  fontSize: '16px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                  e.currentTarget.style.borderColor = '#cbd5e1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
                onClick={() => console.log('View appointment:', appointment.id)}
                >
                  <i className='bx bx-show'></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceAdvisorDashboard;
