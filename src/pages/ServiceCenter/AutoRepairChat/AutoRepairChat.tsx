import React, { useState } from 'react';

// Mock data for clients with work orders
const clients = [
  {
    id: 1,
    name: 'Ayesha Perera',
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    workOrder: 'WO-2024-0847',
    service: 'Engine Diagnostics & Repair',
    vehicleModel: '2018 Honda Civic',
    status: 'In Progress',
    lastMessage: 'How long will the repair take?',
    lastMessageTime: '2 mins ago',
    unreadCount: 2,
    isOnline: true,
    location: 'Colombo Main Branch'
  },
  {
    id: 2,
    name: 'Nimal Silva',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    workOrder: 'WO-2024-0832',
    service: 'Brake System Overhaul',
    vehicleModel: '2020 Toyota Corolla',
    status: 'Completed',
    lastMessage: 'Thank you for the excellent service!',
    lastMessageTime: '1 hour ago',
    unreadCount: 0,
    isOnline: false,
    location: 'Kandy Branch'
  },
  {
    id: 3,
    name: 'Saman Kumara',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    workOrder: 'WO-2024-0798',
    service: 'Transmission Service',
    vehicleModel: '2016 Nissan Sunny',
    status: 'Waiting for Parts',
    lastMessage: 'Any updates on the transmission parts?',
    lastMessageTime: '3 hours ago',
    unreadCount: 1,
    isOnline: true,
    location: 'Galle Branch'
  },
  {
    id: 4,
    name: 'Dilani Fernando',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    workOrder: 'WO-2024-0756',
    service: 'Air Conditioning Repair',
    vehicleModel: '2019 Suzuki Alto',
    status: 'Scheduled',
    lastMessage: 'What time should I bring my car tomorrow?',
    lastMessageTime: '5 hours ago',
    unreadCount: 0,
    isOnline: false,
    location: 'Colombo Main Branch'
  },
  {
    id: 5,
    name: 'Ruwan Jayasuriya',
    avatar: 'https://randomuser.me/api/portraits/men/41.jpg',
    workOrder: 'WO-2024-0723',
    service: 'Electrical System Repair',
    vehicleModel: '2017 Mitsubishi Lancer',
    status: 'In Progress',
    lastMessage: 'Can you send me photos of the damaged wires?',
    lastMessageTime: '1 day ago',
    unreadCount: 3,
    isOnline: true,
    location: 'Colombo Main Branch'
  },
  {
    id: 6,
    name: 'Priya Wickramasinghe',
    avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
    workOrder: 'WO-2024-0689',
    service: 'Oil Change & Filter',
    vehicleModel: '2021 Toyota Aqua',
    status: 'Completed',
    lastMessage: 'Perfect! Car runs smoothly now.',
    lastMessageTime: '2 days ago',
    unreadCount: 0,
    isOnline: false,
    location: 'Kandy Branch'
  }
];

// Mock chat messages
const chatMessages = [
  {
    id: 1,
    sender: 'client',
    message: 'Hi, I wanted to check on my car repair status.',
    timestamp: '10:30 AM',
    isRead: true
  },
  {
    id: 2,
    sender: 'shop',
    message: 'Hello Ayesha! Your Honda Civic is currently being diagnosed. We found the issue with the engine sensor.',
    timestamp: '10:32 AM',
    isRead: true
  },
  {
    id: 3,
    sender: 'client',
    message: 'That\'s great! How long will the repair take?',
    timestamp: '10:35 AM',
    isRead: true
  },
  {
    id: 4,
    sender: 'shop',
    message: 'We have the replacement sensor in stock. The repair should take about 2 hours once we start.',
    timestamp: '10:36 AM',
    isRead: true
  },
  {
    id: 5,
    sender: 'client',
    message: 'Perfect! When can you start working on it?',
    timestamp: '10:38 AM',
    isRead: false
  }
];

function getServiceTypeIcon(service: string) {
  if (service.includes('Engine')) return '🔧';
  if (service.includes('Brake')) return '🛑';
  if (service.includes('Transmission')) return '⚙️';
  if (service.includes('Air Conditioning')) return '❄️';
  if (service.includes('Electrical')) return '⚡';
  if (service.includes('Oil')) return '🛢️';
  return '🔧';
}

function getStatusBadgeProps(status: string) {
  switch (status) {
    case 'In Progress':
      return {
        icon: 'bx-loader-circle',
        label: 'In Progress',
        color: '#f59e0b',
        bg: 'rgba(245, 158, 11, 0.12)',
        aria: 'In Progress',
      };
    case 'Completed':
      return {
        icon: 'bx-check-circle',
        label: 'Completed',
        color: '#10b981',
        bg: 'rgba(16, 185, 129, 0.12)',
        aria: 'Completed',
      };
    case 'Waiting for Parts':
      return {
        icon: 'bx-time-five',
        label: 'Waiting for Parts',
        color: '#ef4444',
        bg: 'rgba(239, 68, 68, 0.12)',
        aria: 'Waiting for Parts',
      };
    case 'Scheduled':
      return {
        icon: 'bx-calendar',
        label: 'Scheduled',
        color: '#3b82f6',
        bg: 'rgba(59, 130, 246, 0.12)',
        aria: 'Scheduled',
      };
    default:
      return {
        icon: 'bx-info-circle',
        label: status,
        color: '#6b7280',
        bg: 'rgba(107, 114, 128, 0.12)',
        aria: status,
      };
  }
}

function formatTime(timeStr: string) {
  return timeStr;
}

const AutoRepairChat = () => {
  const [selectedClient, setSelectedClient] = useState(clients[0]);
  const [messageInput, setMessageInput] = useState('');

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // In a real app, this would send the message
      console.log('Sending message:', messageInput);
      setMessageInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div style={{
      fontFamily: 'Poppins',
      height: '82vh',
      padding: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <div style={{
        display: 'flex',
        height: '100%',
        backgroundColor: 'white',
        borderRadius: '16px',
        border: '2px solid #e5e7eb',
        overflow: 'hidden',
        margin: 24
      }}>
        {/* Client List Panel */}
        <div style={{
          width: '400px',
          borderRight: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#fafbfc'
        }}>
          <div style={{
            padding: '24px',
            borderBottom: '1px solid #e2e8f0',
            backgroundColor: 'white'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <h3 style={{
                margin: 0,
                fontSize: '18px',
                fontWeight: '600',
                color: '#1e293b'
              }}>Active Clients</h3>
              <div style={{
                backgroundColor: '#f1f5f9',
                color: '#475569',
                fontSize: '12px',
                fontWeight: '500',
                padding: '4px 8px',
                borderRadius: '6px',
                border: '1px solid #e2e8f0'
              }}>{clients.length} clients</div>
            </div>
            
            <div style={{
              position: 'relative'
            }}>
              <input 
                type="text" 
                placeholder="Search clients..." 
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 40px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  backgroundColor: 'white',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
              <span style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '16px',
                color: '#9ca3af'
              }}>🔍</span>
            </div>
          </div>

          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '8px'
          }}>
            {clients.map((client) => (
              <div 
                key={client.id}
                style={{
                  padding: '16px',
                  margin: '4px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  backgroundColor: selectedClient.id === client.id ? '#f0f9ff' : 'white',
                  border: selectedClient.id === client.id ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                  transition: 'all 0.2s ease',
                  marginBottom: '8px'
                }}
                onClick={() => setSelectedClient(client)}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <img 
                    src={client.avatar} 
                    alt={client.name}
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid #e2e8f0'
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: '15px',
                      fontWeight: 600,
                      color: '#1e293b',
                      marginBottom: '2px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>{client.name}</div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span style={{
                        fontSize: '13px',
                        color: '#64748b',
                        fontFamily: 'monospace'
                      }}>{client.workOrder}</span>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        backgroundColor: getStatusBadgeProps(client.status).bg,
                        color: getStatusBadgeProps(client.status).color,
                        padding: '2px 10px',
                        borderRadius: '999px',
                        fontWeight: 600,
                        fontSize: '13px',
                        minWidth: 0,
                      }} aria-label={getStatusBadgeProps(client.status).aria}>
                        <i className={`bx ${getStatusBadgeProps(client.status).icon}`} style={{fontSize: '16px'}} aria-hidden="true"></i>
                        <span style={{color: '#222', fontWeight: 700, letterSpacing: 0.1}}>{getStatusBadgeProps(client.status).label}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'white'
        }}>
          <div style={{
            padding: '20px 24px',
            borderBottom: '1px solid #e2e8f0',
            backgroundColor: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
              <img 
                src={selectedClient.avatar} 
                alt={selectedClient.name}
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid #e2e8f0'
                }}
              />
              <div>
                <h4 style={{
                  margin: 0,
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1e293b'
                }}>{selectedClient.name}</h4>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '13px',
                  color: '#64748b',
                  marginTop: '4px'
                }}>
                  <span>{selectedClient.workOrder}</span>
                  <span>•</span>
                  <span>{selectedClient.vehicleModel}</span>
                  <span>•</span>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: getStatusBadgeProps(selectedClient.status).bg,
                    color: getStatusBadgeProps(selectedClient.status).color,
                    padding: '2px 10px',
                    borderRadius: '999px',
                    fontWeight: 600,
                    fontSize: '13px',
                    minWidth: 0,
                  }} aria-label={getStatusBadgeProps(selectedClient.status).aria}>
                    <i className={`bx ${getStatusBadgeProps(selectedClient.status).icon}`} style={{fontSize: '16px'}} aria-hidden="true"></i>
                    <span style={{color: '#222', fontWeight: 700, letterSpacing: 0.1}}>{getStatusBadgeProps(selectedClient.status).label}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div style={{
              display: 'flex',
              gap: '8px'
            }}>
              {['bx-phone', 'bx-envelope', 'bx-clipboard', 'bx-cog'].map((icon, index) => (
                <button key={index} style={{
                  width: '40px',
                  height: '40px',
                  border: '1px solid #e2e8f0',
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}>
                  <i className={`bx ${icon}`} style={{ color: '#1e293b' }}></i>
                </button>
              ))}
            </div>
          </div>

          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px',
            backgroundColor: '#fafbfc',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {chatMessages.map((msg) => (
              <div 
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: msg.sender === 'shop' ? 'flex-end' : 'flex-start'
                }}
              >
                <div style={{
                  maxWidth: '70%',
                  padding: '12px 16px',
                  borderRadius: '16px',
                  backgroundColor: msg.sender === 'shop' ? '#f1f5f9' : 'white',
                  color: msg.sender === 'shop' ? '#1e293b' : '#1e293b',
                  border: msg.sender === 'shop' ? 'none' : '1px solid #e2e8f0',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                }}>
                  <p style={{
                    margin: 0,
                    fontSize: '14px',
                    lineHeight: '1.5'
                  }}>{msg.message}</p>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '8px'
                  }}>
                    <span style={{
                      fontSize: '12px',
                      opacity: 0.7
                    }}>{msg.timestamp}</span>
                    {msg.sender === 'shop' && (
                      <span style={{
                        fontSize: '12px',
                        color: msg.isRead ? '#10b981' : '#94a3b8'
                      }}>
                        {msg.isRead ? '✓✓' : '✓'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            padding: '16px 24px',
            borderTop: '1px solid #e2e8f0',
            backgroundColor: 'white'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: '8px',
              padding: '12px',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              backgroundColor: '#fafbfc'
            }}>
              <button style={{
                width: '36px',
                height: '36px',
                border: 'none',
                backgroundColor: 'transparent',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                📎
              </button>
              <textarea
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  resize: 'none',
                  fontSize: '14px',
                  backgroundColor: 'transparent',
                  minHeight: '20px',
                  maxHeight: '100px',
                  padding: '8px 0',
                  fontFamily: 'inherit'
                }}
                rows={1}
              />
              <button style={{
                width: '36px',
                height: '36px',
                border: 'none',
                backgroundColor: 'transparent',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                😊
              </button>
              <button 
                onClick={handleSendMessage}
                disabled={!messageInput.trim()}
                style={{
                  width: '36px',
                  height: '36px',
                  border: 'none',
                  backgroundColor: messageInput.trim() ? '#3b82f6' : '#e5e7eb',
                  borderRadius: '6px',
                  cursor: messageInput.trim() ? 'pointer' : 'not-allowed',
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease'
                }}
              >
                📤
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoRepairChat;