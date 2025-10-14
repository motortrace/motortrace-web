import React, { useState, useRef, useEffect } from 'react';
import DailyCustomersLineChart from '../../components/DailyCustomersLineChart/DailyCustomersLineChart';
import MiniCalendar from '../../components/MiniCalendar/MiniCalendar';
import Notifications from '../../components/Notifications/Notifications';

// MetricCard Component
interface MetricCardProps {
  title: string;
  amount: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  amount
}) => {
  return (
    <div style={{
      backgroundColor: 'white',
      padding: '16px',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      position: 'relative'
    }}>
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

const Dashboard = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);
  // Fake data for daily customers
  const dailyCustomersData = [
    { date: '2024-01-15', customers: 15 },
    { date: '2024-01-16', customers: 22 },
    { date: '2024-01-17', customers: 18 },
    { date: '2024-01-18', customers: 28 },
    { date: '2024-01-19', customers: 24 },
    { date: '2024-01-20', customers: 31 },
    { date: '2024-01-21', customers: 19 }
  ];

  // Sample appointment data for September 13, 2025
  const sampleAppointments = [
    {
      id: '1',
      customerId: 'cust1',
      vehicleId: 'veh1',
      requestedAt: new Date(),
      startTime: new Date(2025, 8, 13, 9, 0), // Sep 13, 2025 at 9:00 AM
      endTime: new Date(2025, 8, 13, 10, 0), // Sep 13, 2025 at 10:00 AM
      status: 'CONFIRMED' as const,
      priority: 'NORMAL' as const,
      notes: 'Regular maintenance',
      customer: {
        firstName: 'John',
        lastName: 'Smith'
      },
      vehicle: {
        make: 'Toyota',
        model: 'Camry',
        year: 2020
      },
      assignedTo: {
        name: 'Mike Johnson'
      },
      cannedServices: [
        { name: 'Oil Change' },
        { name: 'Filter Replacement' }
      ]
    },
    {
      id: '2',
      customerId: 'cust2',
      vehicleId: 'veh2',
      requestedAt: new Date(),
      startTime: new Date(2025, 8, 13, 14, 0), // Sep 13, 2025 at 2:00 PM
      endTime: new Date(2025, 8, 13, 15, 30), // Sep 13, 2025 at 3:30 PM
      status: 'PENDING' as const,
      priority: 'HIGH' as const,
      notes: 'Brake inspection',
      customer: {
        firstName: 'Sarah',
        lastName: 'Johnson'
      },
      vehicle: {
        make: 'Honda',
        model: 'Civic',
        year: 2019
      },
      cannedServices: [
        { name: 'Brake Inspection' },
        { name: 'Brake Pad Replacement' }
      ]
    },
    {
      id: '3',
      customerId: 'cust3',
      vehicleId: 'veh3',
      requestedAt: new Date(),
      startTime: new Date(2025, 8, 13, 11, 0), // Sep 13, 2025 at 11:00 AM
      endTime: new Date(2025, 8, 13, 12, 0), // Sep 13, 2025 at 12:00 PM
      status: 'IN_PROGRESS' as const,
      priority: 'URGENT' as const,
      notes: 'Engine repair',
      customer: {
        firstName: 'Mike',
        lastName: 'Davis'
      },
      vehicle: {
        make: 'Ford',
        model: 'Focus',
        year: 2021
      },
      assignedTo: {
        name: 'Sarah Wilson'
      },
      cannedServices: [
        { name: 'Engine Diagnostic' },
        { name: 'Engine Repair' }
      ]
    },
    {
      id: '4',
      customerId: 'cust4',
      vehicleId: 'veh4',
      requestedAt: new Date(),
      startTime: new Date(2025, 8, 13, 16, 0), // Sep 13, 2025 at 4:00 PM
      endTime: new Date(2025, 8, 13, 17, 0), // Sep 13, 2025 at 5:00 PM
      status: 'CONFIRMED' as const,
      priority: 'NORMAL' as const,
      notes: 'Tire rotation',
      customer: {
        firstName: 'Lisa',
        lastName: 'Anderson'
      },
      vehicle: {
        make: 'Nissan',
        model: 'Altima',
        year: 2018
      },
      assignedTo: {
        name: 'David Brown'
      },
      cannedServices: [
        { name: 'Tire Rotation' },
        { name: 'Wheel Alignment' }
      ]
    },
    {
      id: '5',
      customerId: 'cust5',
      vehicleId: 'veh5',
      requestedAt: new Date(),
      startTime: new Date(2025, 8, 13, 8, 0), // Sep 13, 2025 at 8:00 AM
      endTime: new Date(2025, 8, 13, 8, 45), // Sep 13, 2025 at 8:45 AM
      status: 'PENDING' as const,
      priority: 'LOW' as const,
      notes: 'AC check',
      customer: {
        firstName: 'Robert',
        lastName: 'Wilson'
      },
      vehicle: {
        make: 'Chevrolet',
        model: 'Malibu',
        year: 2020
      },
      cannedServices: [
        { name: 'AC System Check' },
        { name: 'Refrigerant Top-up' }
      ]
    }
  ];

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      // backgroundColor: '#f8fafc',
      minHeight: '100vh',
      padding: '16px'
    }}>
      {/* Add Boxicons CSS */}
      <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet' />
      
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
            Manager Dashboard
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
          {/* Notification Button */}
          <div style={{ position: 'relative', height: '56px' }} ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                backgroundColor: 'white',
                color: '#64748b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                position: 'relative',
                transition: 'all 0.2s',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f8fafc';
                e.currentTarget.style.borderColor = '#cbd5e1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.borderColor = '#e2e8f0';
              }}
            >
              <i className='bx bx-bell'></i>
              {/* Notification Badge */}
              <div style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#ef4444',
                border: '2px solid white'
              }} />
            </button>
            
            {/* Notification Dropdown */}
            {showNotifications && (
              <div style={{
                position: 'absolute',
                top: '66px',
                right: '0',
                width: '400px',
                height: '500px',
                zIndex: 1000,
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                borderRadius: '12px'
              }}>
                <Notifications />
              </div>
            )}
          </div>
          
          {/* Manager Profile */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            height: '56px'
          }}>
            {/* Profile Image */}
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              MS
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
                Michael Smith
              </div>
              <div style={{
                fontSize: '14px',
                color: '#64748b',
                lineHeight: '1.2'
              }}>
                michael.smith@motortrace.com
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
              title="Revenue"
              amount="30,000 LKR"
            />
            <MetricCard
              title="Daily Sales"
              amount="10,000 LKR"
            />
            <MetricCard
              title="Average Appointment Time"
              amount="3 hrs"
            />
          </div>
          
          {/* Daily Customers Chart */}
          <DailyCustomersLineChart data={dailyCustomersData} />
        </div>

        {/* Right Section - Calendar */}
        <div style={{
          height: '100%'
        }}>
          <MiniCalendar appointments={sampleAppointments} />
        </div>
      </div>

      {/* Currently Working Technicians Section */}
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
            Currently Working Technicians
          </h3>
        </div>

        {/* Technicians Table */}
        <div style={{ padding: '16px 20px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
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
            <div>Technician</div>
            <div>Specialization</div>
            <div>Work Order</div>
            <div>Work Type</div>
            <div>Actions</div>
          </div>

          {/* Sample Technician Data */}
          {[
            {
              id: 1,
              name: 'John Smith',
              specialization: 'Engine Specialist',
              workOrderNumber: 'WO-2024-001',
              workType: 'Labor',
              avatar: '/src/assets/images/user.png'
            },
            {
              id: 2,
              name: 'Sarah Johnson',
              specialization: 'Brake Systems',
              workOrderNumber: 'WO-2024-002',
              workType: 'Inspection',
              avatar: '/src/assets/images/user.png'
            },
            {
              id: 3,
              name: 'Mike Wilson',
              specialization: 'Electrical',
              workOrderNumber: 'WO-2024-003',
              workType: 'Labor',
              avatar: '/src/assets/images/user.png'
            }
          ].map((technician) => {
            // Define colors for different specializations
            const getSpecializationColor = (specialization: string) => {
              switch (specialization) {
                case 'Engine Specialist':
                  return { color: '#7c3aed', backgroundColor: '#ede9fe' }; // Purple
                case 'Brake Systems':
                  return { color: '#ea580c', backgroundColor: '#fed7aa' }; // Orange
                case 'Electrical':
                  return { color: '#0891b2', backgroundColor: '#cffafe' }; // Cyan
                case 'Transmission':
                  return { color: '#be185d', backgroundColor: '#fce7f3' }; // Pink
                case 'Suspension':
                  return { color: '#65a30d', backgroundColor: '#ecfccb' }; // Lime
                case 'AC Systems':
                  return { color: '#7c2d12', backgroundColor: '#fed7aa' }; // Brown
                case 'Diagnostics':
                  return { color: '#1e40af', backgroundColor: '#dbeafe' }; // Blue
                case 'Body Work':
                  return { color: '#be123c', backgroundColor: '#fce7f3' }; // Rose
                case 'Exhaust':
                  return { color: '#9333ea', backgroundColor: '#f3e8ff' }; // Violet
                case 'Fuel System':
                  return { color: '#0d9488', backgroundColor: '#ccfbf1' }; // Teal
                default:
                  return { color: '#6b7280', backgroundColor: '#f3f4f6' }; // Gray
              }
            };

            const specColors = getSpecializationColor(technician.specialization);

            return (
            <div key={technician.id} style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
              gap: '16px',
              alignItems: 'center',
              padding: '16px 0',
              borderBottom: '1px solid #f1f5f9'
            }}>
              {/* Technician Name with Avatar */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#e2e8f0',
                  backgroundImage: `url(${technician.avatar})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  border: '2px solid #f1f5f9'
                }} />
                <div>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#1e293b',
                    marginBottom: '2px'
                  }}>
                    {technician.name}
                  </div>
                </div>
              </div>

              {/* Specialization */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start'
              }}>
                <span style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: specColors.color,
                  backgroundColor: specColors.backgroundColor,
                  padding: '4px 8px',
                  borderRadius: '12px',
                  textAlign: 'center',
                  width: 'fit-content'
                }}>
                  {technician.specialization}
                </span>
              </div>

              {/* Work Order Number */}
              <div style={{
                fontSize: '13px',
                color: '#475569',
                fontWeight: '500'
              }}>
                {technician.workOrderNumber}
              </div>

              {/* Work Type */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start'
              }}>
                <span style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: technician.workType === 'Labor' ? '#059669' : '#dc2626',
                  backgroundColor: technician.workType === 'Labor' ? '#d1fae5' : '#fee2e2',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  textAlign: 'center',
                  width: 'fit-content'
                }}>
                  {technician.workType}
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
                onClick={() => console.log('View technician:', technician.id)}
                >
                  <i className='bx bx-show'></i>
                </button>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;