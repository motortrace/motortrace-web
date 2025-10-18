import React, { useState, useEffect } from 'react';
import { workOrderService } from '../../../../services/workOrderService';

interface OverviewTabProps {
  workOrder?: any;
}

interface ChatMessage {
  id: string;
  sender: 'customer' | 'advisor';
  message: string;
  timestamp: string;
  senderName: string;
  profileImage: string | null;
}

/**
 * OverviewTab Component
 * Displays work order overview with communication panel and customer/vehicle information
 */
const OverviewTab: React.FC<OverviewTabProps> = ({ workOrder }) => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (workOrder?.id) {
      fetchMessages();
    }
  }, [workOrder?.id]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const messages = await workOrderService.getWorkOrderMessages(workOrder.id);
      const transformedMessages = messages.map((msg: any) => ({
        id: msg.id,
        sender: (msg.senderRole === 'SERVICE_ADVISOR' || msg.senderRole === 'MANAGER') ? 'advisor' : 'customer',
        message: msg.message,
        timestamp: msg.createdAt,
        senderName: msg.sender.name,
        profileImage: msg.sender.profileImage
      }));
      setChatMessages(transformedMessages);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      try {
        await workOrderService.sendWorkOrderMessage({
          workOrderId: workOrder.id,
          message: newMessage,
          messageType: 'TEXT',
          attachments: [] // Add attachments if needed
        });
        setNewMessage('');
        // Refetch messages to include the new one
        fetchMessages();
      } catch (err: any) {
        setError(err.message || 'Failed to send message');
      }
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="tab-content overview-tab">
      <div className="overview-layout">
        {/* Left Panel - Chat */}
        <div className="chat-panel">
          <div className="chat-header">
            <h4><i className="bx bx-message-detail"></i> Communication</h4>
          </div>
          <div className="chat-messages">
            {loading && <div>Loading messages...</div>}
            {error && <div className="error">{error}</div>}
            {chatMessages.map((msg) => (
              <div key={msg.id} className={`chat-message ${msg.sender}-message`}>
                <div className="message-header">
                  {msg.profileImage ? (
                    <img src={msg.profileImage} alt={msg.senderName} className="sender-avatar" />
                  ) : (
                    <div className="sender-avatar">
                      {msg.senderName.split(' ').map(name => name[0]).join('').toUpperCase()}
                    </div>
                  )}
                  <span className="sender-name">{msg.senderName}</span>
                  <span className="message-time">{formatTime(msg.timestamp)}</span>
                </div>
                <div className="message-content">
                  {msg.message}
                </div>
              </div>
            ))}
          </div>
          <div className="chat-input">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              rows={2}
            />
            <button onClick={handleSendMessage} disabled={!newMessage.trim()}>
              <i className="bx bx-send"></i>
            </button>
          </div>
        </div>

        {/* Right Panel - Information */}
        <div className="info-panel">
          {/* Service Advisor Info */}
          <div className="info-section">
            <div className="info-section-header">
              <h4><i className="bx bx-user-voice"></i> Service Advisor</h4>
            </div>
            <div className="info-section-content">
              {workOrder?.serviceAdvisor ? (
                <div className="person-info">
                  <div className="person-avatar">
                    {workOrder.serviceAdvisor.userProfile.firstName[0]}{workOrder.serviceAdvisor.userProfile.lastName[0]}
                  </div>
                  <div className="person-details">
                    <div className="person-name">
                      {workOrder.serviceAdvisor.userProfile.firstName} {workOrder.serviceAdvisor.userProfile.lastName}
                    </div>
                    <div className="person-role">Service Advisor</div>
                    <div className="person-contact">
                      <i className="bx bx-phone"></i> {workOrder.serviceAdvisor.userProfile.phone}
                    </div>
                    <div className="person-department">
                      <i className="bx bx-building"></i> {workOrder.serviceAdvisor.department}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="no-data">No service advisor assigned</div>
              )}
            </div>
          </div>

          {/* Customer Info */}
          <div className="info-section">
            <div className="info-section-header">
              <h4><i className="bx bx-user"></i> Customer</h4>
            </div>
            <div className="info-section-content">
              {workOrder?.customer ? (
                <div className="person-info">
                  <div className="person-avatar">
                    {workOrder.customer.firstName[0]}{workOrder.customer.lastName[0]}
                  </div>
                  <div className="person-details">
                    <div className="person-name">
                      {workOrder.customer.firstName} {workOrder.customer.lastName}
                    </div>
                    <div className="person-role">Customer</div>
                    <div className="person-contact">
                      <i className="bx bx-envelope"></i> {workOrder.customer.email}
                    </div>
                    <div className="person-contact">
                      <i className="bx bx-phone"></i> {workOrder.customer.phone}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="no-data">No customer information</div>
              )}
              
              {/* Customer Complaint */}
              {workOrder?.complaint && (
                <div className="customer-complaint">
                  <div className="complaint-header">
                    <h5><i className="bx bx-message-square-detail"></i> Customer Complaint</h5>
                  </div>
                  <div className="complaint-content">
                    {workOrder.complaint}
                  </div>
                </div>
              )}
              
              {/* Internal Notes */}
              {workOrder?.internalNotes && (
                <div className="internal-notes">
                  <div className="notes-header">
                    <h5><i className="bx bx-note"></i> Internal Notes</h5>
                  </div>
                  <div className="notes-content">
                    {workOrder.internalNotes}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Vehicle Info */}
          <div className="info-section">
            <div className="info-section-header">
              <h4><i className="bx bx-car"></i> Vehicle</h4>
            </div>
            <div className="info-section-content">
              {workOrder?.vehicle ? (
                <div className="vehicle-info">
                  <div className="vehicle-image">
                    <img 
                      src={`https://platform.cstatic-images.com/xxlarge/in/v2/stock_photos/8760bf48-c1a5-42f7-a83b-1cd39e2efbec/57ee2adf-a4a3-4757-8f50-6d85fcf5a351.png`} 
                      alt={`${workOrder.vehicle.year} ${workOrder.vehicle.make} ${workOrder.vehicle.model}`}
                    />
                  </div>
                  <div className="vehicle-details">
                    <div className="vehicle-title">
                      {workOrder.vehicle.year} {workOrder.vehicle.make} {workOrder.vehicle.model}
                    </div>
                    <div className="vehicle-info-item">
                      <i className="bx bx-hash"></i> VIN: {workOrder.vehicle.vin}
                    </div>
                    <div className="vehicle-info-item">
                      <i className="bx bx-barcode"></i> License: {workOrder.vehicle.licensePlate}
                    </div>
                    {workOrder.odometerReading && (
                      <div className="vehicle-info-item">
                        <i className="bx bx-speedometer"></i> Odometer: {workOrder.odometerReading.toLocaleString()} miles
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="no-data">No vehicle information</div>
              )}
            </div>
          </div>

          {/* Assigned Technicians */}
          <div className="info-section">
            <div className="info-section-header">
              <h4><i className="bx bx-wrench"></i> Assigned Technicians</h4>
            </div>
            <div className="info-section-content">
              {workOrder?.inspections && workOrder.inspections.length > 0 ? (
                <div className="technicians-list">
                  {workOrder.inspections.map((inspection: any, index: number) => (
                    <div key={index} className="person-info">
                      <div className="person-avatar">
                        {inspection.inspector?.userProfile?.firstName[0]}{inspection.inspector?.userProfile?.lastName[0]}
                      </div>
                      <div className="person-details">
                        <div className="person-name">
                          {inspection.inspector?.userProfile?.firstName} {inspection.inspector?.userProfile?.lastName}
                        </div>
                        <div className="person-role">Inspector</div>
                        <div className="person-status">
                          <i className="bx bx-check-circle"></i> Inspection Completed
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-data">No technicians assigned</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
