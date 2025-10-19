import React from 'react';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'warning' | 'success' | 'error';
  isRead: boolean;
}

interface NotificationsProps {
  notifications?: Notification[];
}

const Notifications: React.FC<NotificationsProps> = ({ 
  notifications = [] 
}) => {
  // Sample notification data
  const sampleNotifications: Notification[] = [
    {
      id: '1',
      title: 'New Appointment',
      message: 'John Smith scheduled an appointment for tomorrow at 9:00 AM',
      time: '2 hours ago',
      type: 'info',
      isRead: false
    },
    {
      id: '2',
      title: 'Low Stock Alert',
      message: 'Brake pads inventory is running low (5 items remaining)',
      time: '4 hours ago',
      type: 'warning',
      isRead: false
    },
    {
      id: '3',
      title: 'Payment Received',
      message: 'Payment of LKR 15,000 received from Sarah Johnson',
      time: '6 hours ago',
      type: 'success',
      isRead: true
    },
    {
      id: '4',
      title: 'Appointment Cancelled',
      message: 'Mike Davis cancelled his appointment for today',
      time: '1 day ago',
      type: 'error',
      isRead: true
    },
    {
      id: '5',
      title: 'Service Completed',
      message: 'Oil change service completed for Lisa Anderson',
      time: '2 days ago',
      type: 'success',
      isRead: true
    }
  ];

  const displayNotifications = notifications.length > 0 ? notifications : sampleNotifications;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'info':
        return 'bx bx-info-circle';
      case 'warning':
        return 'bx bx-error';
      case 'success':
        return 'bx bx-check-circle';
      case 'error':
        return 'bx bx-x-circle';
      default:
        return 'bx bx-info-circle';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'info':
        return '#3b82f6';
      case 'warning':
        return '#f59e0b';
      case 'success':
        return '#10b981';
      case 'error':
        return '#ef4444';
      default:
        return '#3b82f6';
    }
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
        padding: '20px 24px',
        borderBottom: '1px solid #e2e8f0',
        backgroundColor: '#f8fafc'
      }}>
        <h2 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#1e293b',
          margin: 0
        }}>
          Notifications
        </h2>
      </div>

      {/* Notifications List */}
      <div style={{
        padding: '20px 24px',
        flex: 1,
        overflowY: 'auto',
        minHeight: 0
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {displayNotifications.map((notification) => (
            <div key={notification.id} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '12px',
              backgroundColor: notification.isRead ? 'transparent' : '#f8fafc',
              borderRadius: '8px',
              border: notification.isRead ? 'none' : '1px solid #e2e8f0',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#f1f5f9';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = notification.isRead ? 'transparent' : '#f8fafc';
            }}
            >
              {/* Icon */}
              <div style={{
                fontSize: '16px',
                marginTop: '2px',
                color: getNotificationColor(notification.type)
              }}>
                <i className={getNotificationIcon(notification.type)}></i>
              </div>

              {/* Content */}
              <div style={{
                flex: 1,
                minWidth: 0
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '4px'
                }}>
                  <h3 style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#1e293b',
                    margin: 0
                  }}>
                    {notification.title}
                  </h3>
                  <span style={{
                    fontSize: '12px',
                    color: '#64748b',
                    fontWeight: '500'
                  }}>
                    {notification.time}
                  </span>
                </div>
                <p style={{
                  fontSize: '12px',
                  color: '#64748b',
                  margin: 0,
                  lineHeight: '1.4'
                }}>
                  {notification.message}
                </p>
              </div>

              {/* Unread Indicator */}
              {!notification.isRead && (
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: getNotificationColor(notification.type),
                  marginTop: '6px',
                  flexShrink: 0
                }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
