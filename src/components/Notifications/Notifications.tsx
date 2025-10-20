import React from 'react';

interface ApiNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  priority: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  actionText?: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'warning' | 'success' | 'error';
  isRead: boolean;
}

interface NotificationsProps {
  notifications?: ApiNotification[];
}

const Notifications: React.FC<NotificationsProps> = ({ 
  notifications = [] 
}) => {
  // Transform API notifications to component format
  const transformNotifications = (apiNotifications: ApiNotification[]): Notification[] => {
    return apiNotifications.map(notification => ({
      id: notification.id,
      title: notification.title,
      message: notification.message,
      time: formatTime(notification.createdAt),
      type: mapNotificationType(notification.type, notification.priority),
      isRead: notification.isRead
    }));
  };

  const formatTime = (createdAt: string): string => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffMs = now.getTime() - created.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  const mapNotificationType = (type: string, priority: string): 'info' | 'warning' | 'success' | 'error' => {
    // Map based on type first, then priority
    if (type.includes('CREATED') || type.includes('COMPLETED')) {
      return 'success';
    } else if (type.includes('CANCELLED') || type.includes('ERROR')) {
      return 'error';
    } else if (priority === 'HIGH' || priority === 'URGENT') {
      return 'warning';
    } else {
      return 'info';
    }
  };

  const displayNotifications = notifications.length > 0 ? transformNotifications(notifications) : [];

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
          {displayNotifications.length > 0 ? (
            displayNotifications.map((notification) => (
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
            ))
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px 20px',
              textAlign: 'center',
              color: '#64748b'
            }}>
              <i className='bx bx-bell-off' style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}></i>
              <div style={{ fontSize: '16px', fontWeight: '500', marginBottom: '4px' }}>
                No notifications
              </div>
              <div style={{ fontSize: '14px' }}>
                You're all caught up!
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
