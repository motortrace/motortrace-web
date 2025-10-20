import React, { useState, useEffect } from 'react';
import MiniCalendar from '../../components/MiniCalendar/MiniCalendar';
import Notifications from '../../components/Notifications/Notifications';
import { useAuth } from '../../hooks/useAuth';

// Sample assigned appointments data for service advisor
const assignedAppointments: any[] = [];

// MetricCard Component
interface MetricCardProps {
  title: string;
  amount: string;
  bgColor?: string;
  textColor?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  amount,
  bgColor = 'white',
  textColor = '#1e293b'
}) => {
  return (
    <div style={{
      backgroundColor: bgColor,
      padding: '20px',
      borderRadius: '12px',
      border: 'none',
      position: 'relative',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
    }}>
      <h3 style={{
        fontSize: '13px',
        fontWeight: '600',
        color: textColor,
        opacity: 0.8,
        margin: '0 0 12px 0',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      }}>
        {title}
      </h3>

      <div style={{
        fontSize: '32px',
        fontWeight: '700',
        color: textColor,
        marginBottom: '8px'
      }}>
        {amount}
      </div>
    </div>
  );
};

const ServiceAdvisorDashboard = () => {
  const { token } = useAuth();
  const [userProfile, setUserProfile] = useState<{
    name: string;
    email: string;
    profileImageUrl?: string;
  } | null>(null);
  const [userProfileLoading, setUserProfileLoading] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const notificationRef = React.useRef<HTMLDivElement>(null);
  const [dashboardStats, setDashboardStats] = useState<{
    totalWorkOrdersAssigned: number;
    completedWorkOrders: number;
    pendingWorkOrders: number;
    inProgressWorkOrders: number;
    totalRevenue: number;
    unassignedTechniciansList?: Array<{
      id: string;
      employeeId: string;
      name: string;
      profileImage?: string;
      specialization: string;
      lastAssignedDate?: string;
      lastAssignedType?: string;
      lastWorkOrderNumber?: string;
      daysSinceLastAssignment?: number;
    }>;
  } | null>(null);
  const [dashboardStatsLoading, setDashboardStatsLoading] = useState(false);

  // Fetch user profile
  const fetchUserProfile = async () => {
    if (!token) {
      console.log('No token available for user profile fetch');
      return;
    }

    setUserProfileLoading(true);

    try {
      const response = await fetch('http://localhost:3000/auth/me', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user profile: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        setUserProfile({
          name: data.data.name,
          email: data.data.email,
          profileImageUrl: data.data.profileImage
        });
        console.log('User profile loaded:', data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch user profile');
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
    } finally {
      setUserProfileLoading(false);
    }
  };

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!token) return;

    try {
      const response = await fetch('http://localhost:3000/notifications', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.success ? data.data : []);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  // Fetch dashboard statistics
  const fetchDashboardStats = async () => {
    if (!token) return;

    setDashboardStatsLoading(true);
    try {
      const response = await fetch('http://localhost:3000/service-advisors/me/dashboard', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setDashboardStats(data.data);
        }
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setDashboardStatsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUserProfile();
      fetchNotifications();
      fetchDashboardStats();
    }
  }, [token]);

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
                position: 'relative'
              }}
            >
              <i className='bx bx-bell'></i>
              {/* Notification Badge */}
              <div style={{
                position: 'absolute',
                top: '6px',
                right: '6px',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: '#ef4444',
                border: '2px solid white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: '600',
                color: 'white'
              }}>
                {notifications.filter(n => !n.isRead).length || 0}
              </div>
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
                <Notifications notifications={notifications} />
              </div>
            )}
          </div>

          {/* Service Advisor Profile */}
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
              backgroundColor: userProfile?.profileImageUrl ? 'transparent' : '#2563eb',
              backgroundImage: userProfile?.profileImageUrl ? `url(${userProfile.profileImageUrl})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600',
              border: userProfile?.profileImageUrl ? '2px solid #e2e8f0' : 'none'
            }}>
              {!userProfile?.profileImageUrl && (userProfileLoading ? '...' : userProfile ? userProfile.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'SA')}
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
                {userProfileLoading ? 'Loading...' : userProfile?.name || 'Service Advisor'}
              </div>
              <div style={{
                fontSize: '14px',
                color: '#64748b',
                lineHeight: '1.2'
              }}>
                {userProfileLoading ? 'Loading...' : userProfile?.email || 'advisor@motortrace.com'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top 3 Stat Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px',
        marginBottom: '16px'
      }}>
        <MetricCard
          title="Total Work Orders"
          amount={dashboardStatsLoading ? 'Loading...' : dashboardStats?.totalWorkOrdersAssigned?.toString() || '0'}
          bgColor="#dbeafe"
          textColor="#1e40af"
        />
        <MetricCard
          title="In Progress"
          amount={dashboardStatsLoading ? 'Loading...' : dashboardStats?.inProgressWorkOrders?.toString() || '0'}
          bgColor="#fef3c7"
          textColor="#b45309"
        />
        <MetricCard
          title="Completed"
          amount={dashboardStatsLoading ? 'Loading...' : dashboardStats?.completedWorkOrders?.toString() || '0'}
          bgColor="#dcfce7"
          textColor="#15803d"
        />
      </div>

      {/* Calendar and Unassigned Technicians Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px',
        marginBottom: '24px'
      }}>
        {/* Calendar */}
        <div>
          <MiniCalendar appointments={assignedAppointments} />
        </div>

        {/* Unassigned Technicians Table */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          overflow: 'hidden'
        }}>
          {/* Header */}
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
              Unassigned Technicians
            </h3>
          </div>

          {/* Table Content */}
          <div style={{ padding: '16px 20px', maxHeight: '400px', overflowY: 'auto' }}>
            {dashboardStatsLoading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                Loading...
              </div>
            ) : !dashboardStats?.unassignedTechniciansList || dashboardStats.unassignedTechniciansList.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                <i className="bx bx-user-check" style={{ fontSize: '48px', color: '#d1d5db' }}></i>
                <p style={{ marginTop: '16px', fontSize: '14px' }}>All technicians are assigned</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {dashboardStats.unassignedTechniciansList.map((tech) => (
                  <div key={tech.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    backgroundColor: '#f9fafb',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                  >
                    {/* Profile Image */}
                    {tech.profileImage ? (
                      <img
                        src={tech.profileImage}
                        alt={tech.name}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '2px solid #e5e7eb'
                        }}
                      />
                    ) : (
                      <div style={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        backgroundColor: '#e0e7ff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#6366f1'
                      }}>
                        {tech.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                    )}

                    {/* Technician Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#1e293b',
                        marginBottom: '2px'
                      }}>
                        {tech.name}
                      </div>
                      <div style={{
                        fontSize: '12px',
                        color: '#6b7280',
                        marginBottom: '4px'
                      }}>
                        {tech.specialization}
                      </div>
                      {tech.lastAssignedDate && (
                        <div style={{
                          fontSize: '11px',
                          color: '#9ca3af'
                        }}>
                          Last: {tech.lastAssignedType} • {tech.daysSinceLastAssignment} days ago
                        </div>
                      )}
                    </div>

                    {/* Days Badge */}
                    {tech.daysSinceLastAssignment !== undefined && (
                      <div style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        backgroundColor: tech.daysSinceLastAssignment > 7 ? '#fee2e2' : '#fef3c7',
                        color: tech.daysSinceLastAssignment > 7 ? '#991b1b' : '#92400e',
                        fontSize: '11px',
                        fontWeight: '600',
                        whiteSpace: 'nowrap'
                      }}>
                        {tech.daysSinceLastAssignment}d
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
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
