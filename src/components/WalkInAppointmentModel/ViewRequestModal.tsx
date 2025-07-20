import React, { useState } from 'react';
import 'boxicons/css/boxicons.min.css';

const tabs = [
  { id: 'customer', label: 'Customer', icon: 'bx bx-user' },
  { id: 'vehicle', label: 'Vehicle', icon: 'bx bx-car' },
  { id: 'workorder', label: 'Work Order', icon: 'bx bx-clipboard' },
  { id: 'service', label: 'Service Details', icon: 'bx bx-wrench' },
  { id: 'technical', label: 'Technical', icon: 'bx bx-cog' },
  { id: 'media', label: 'Media', icon: 'bx bx-camera' },
  { id: 'additional', label: 'Additional', icon: 'bx bx-info-circle' }
];

const modalStyle = {
  position: 'fixed' as const,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  padding: '20px',
};

const modalContentStyle = {
  background: 'white',
  borderRadius: '16px',
  width: '100%',
  maxWidth: '900px',
  maxHeight: '90vh',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column' as const,
  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  padding: '24px 32px',
  borderBottom: '1px solid #e2e8f0',
  background: '#f8fafc',
};

const tabsStyle = {
  display: 'flex',
  borderBottom: '1px solid #e2e8f0',
  overflowX: 'auto' as const,
  padding: '0 32px',
};

const tabStyle = (isActive: boolean) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '12px 16px',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: isActive ? '#3b82f6' : '#64748b',
  borderBottom: isActive ? '2px solid #3b82f6' : '2px solid transparent',
  fontSize: '14px',
  fontWeight: '600',
  whiteSpace: 'nowrap' as const,
  transition: 'all 0.2s ease',
});

const contentStyle = {
  flex: 1,
  overflowY: 'auto' as const,
  padding: '32px',
};

const sectionStyle = {
  marginBottom: '20px',
};

const labelStyle = {
  display: 'block',
  fontSize: '14px',
  fontWeight: '600',
  color: '#374151',
  marginBottom: '4px',
};

const valueStyle = {
  fontSize: '15px',
  color: '#1e293b',
  marginBottom: '12px',
  fontWeight: 500,
};

const closeButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '40px',
  height: '40px',
  border: 'none',
  background: '#f1f5f9',
  color: '#64748b',
  borderRadius: '8px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
};

const ViewRequestModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('customer');

  return (
    <div style={modalStyle} onClick={onClose}>
      <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
        <div style={headerStyle}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b', margin: '0 0 8px 0' }}>
              View Request (Sample Data)
            </h2>
            <p style={{ fontSize: '14px', color: '#64748b', margin: '0' }}>
              Review all details for this incoming request
            </p>
          </div>
          <button style={closeButtonStyle} onClick={onClose}>
            <i className="bx bx-x" style={{ fontSize: 20 }}></i>
          </button>
        </div>
        <div style={tabsStyle}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              style={tabStyle(activeTab === tab.id)}
              onClick={() => setActiveTab(tab.id)}
            >
              <i className={tab.icon} style={{ fontSize: 18 }}></i>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
        <div style={contentStyle}>
          {activeTab === 'customer' && (
            <div>
              <div style={sectionStyle}>
                <span style={labelStyle}>First Name</span>
                <span style={valueStyle}>Sarah</span>
              </div>
              <div style={sectionStyle}>
                <span style={labelStyle}>Last Name</span>
                <span style={valueStyle}>Johnson</span>
              </div>
              <div style={sectionStyle}>
                <span style={labelStyle}>Email</span>
                <span style={valueStyle}>sarah.johnson@email.com</span>
              </div>
              <div style={sectionStyle}>
                <span style={labelStyle}>Phone</span>
                <span style={valueStyle}>(555) 123-4567</span>
              </div>
              <div style={sectionStyle}>
                <span style={labelStyle}>Address</span>
                <span style={valueStyle}>123 Main St, Springfield</span>
              </div>
              <div style={sectionStyle}>
                <span style={labelStyle}>City</span>
                <span style={valueStyle}>Springfield</span>
              </div>
              <div style={sectionStyle}>
                <span style={labelStyle}>State</span>
                <span style={valueStyle}>IL</span>
              </div>
              <div style={sectionStyle}>
                <span style={labelStyle}>ZIP Code</span>
                <span style={valueStyle}>62704</span>
              </div>
            </div>
          )}
          {activeTab === 'vehicle' && (
            <div>
              <div style={sectionStyle}>
                <span style={labelStyle}>Year</span>
                <span style={valueStyle}>2020</span>
              </div>
              <div style={sectionStyle}>
                <span style={labelStyle}>Make</span>
                <span style={valueStyle}>Toyota</span>
              </div>
              <div style={sectionStyle}>
                <span style={labelStyle}>Model</span>
                <span style={valueStyle}>Camry</span>
              </div>
              <div style={sectionStyle}>
                <span style={labelStyle}>Trim</span>
                <span style={valueStyle}>SE</span>
              </div>
              <div style={sectionStyle}>
                <span style={labelStyle}>VIN</span>
                <span style={valueStyle}>1HGBH41JXMN109186</span>
              </div>
              <div style={sectionStyle}>
                <span style={labelStyle}>License Plate</span>
                <span style={valueStyle}>ABC-1234</span>
              </div>
              <div style={sectionStyle}>
                <span style={labelStyle}>Color</span>
                <span style={valueStyle}>Red</span>
              </div>
              <div style={sectionStyle}>
                <span style={labelStyle}>Mileage</span>
                <span style={valueStyle}>45,000</span>
              </div>
              <div style={sectionStyle}>
                <span style={labelStyle}>Engine Type</span>
                <span style={valueStyle}>2.5L I4</span>
              </div>
              <div style={sectionStyle}>
                <span style={labelStyle}>Transmission</span>
                <span style={valueStyle}>Automatic</span>
              </div>
              <div style={sectionStyle}>
                <span style={labelStyle}>Drive Type</span>
                <span style={valueStyle}>FWD</span>
              </div>
              <div style={sectionStyle}>
                <span style={labelStyle}>Fuel Type</span>
                <span style={valueStyle}>Gasoline</span>
              </div>
            </div>
          )}
          {activeTab === 'workorder' && (
            <div>
              <div style={sectionStyle}>
                <span style={labelStyle}>Work Order Linked</span>
                <span style={valueStyle}>No</span>
              </div>
              <div style={sectionStyle}>
                <span style={labelStyle}>Priority</span>
                <span style={valueStyle}>Medium</span>
              </div>
              <div style={sectionStyle}>
                <span style={labelStyle}>Estimated Completion</span>
                <span style={valueStyle}>2024-07-02 16:00</span>
              </div>
              <div style={sectionStyle}>
                <span style={labelStyle}>Appointment Date</span>
                <span style={valueStyle}>2024-07-02</span>
              </div>
              <div style={sectionStyle}>
                <span style={labelStyle}>Appointment Time</span>
                <span style={valueStyle}>10:00</span>
              </div>
            </div>
          )}
          {activeTab === 'service' && (
            <div>
              <div style={sectionStyle}>
                <span style={labelStyle}>Primary Concern</span>
                <span style={valueStyle}>Brake noise when stopping</span>
              </div>
              <div style={sectionStyle}>
                <span style={labelStyle}>Symptoms</span>
                <span style={valueStyle}>Squealing, vibration</span>
              </div>
              <div style={sectionStyle}>
                <span style={labelStyle}>When Issue Started</span>
                <span style={valueStyle}>Last week</span>
              </div>
              <div style={sectionStyle}>
                <span style={labelStyle}>Service Type</span>
                <span style={valueStyle}>Brake Service</span>
              </div>
              <div style={sectionStyle}>
                <span style={labelStyle}>Requested Services</span>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  <li style={valueStyle}>Brake Pad Replacement</li>
                  <li style={valueStyle}>Brake Fluid Flush</li>
                </ul>
              </div>
              <div style={sectionStyle}>
                <span style={labelStyle}>OBD2 Diagnostic Codes</span>
                <span style={valueStyle}>P0420, P0301</span>
              </div>
              <div style={sectionStyle}>
                <span style={labelStyle}>Previous Repairs</span>
                <span style={valueStyle}>Replaced rotors 6 months ago</span>
              </div>
              <div style={sectionStyle}>
                <span style={labelStyle}>Customer Notes</span>
                <span style={valueStyle}>Prefers early morning drop-off</span>
              </div>
            </div>
          )}
          {activeTab === 'technical' && (
            <div>
              <div style={sectionStyle}>
                <span style={labelStyle}>Assigned Technician</span>
                <span style={valueStyle}>Mike Johnson</span>
              </div>
              <div style={sectionStyle}>
                <span style={labelStyle}>Inspection Notes</span>
                <span style={valueStyle}>Brake pads worn, needs replacement</span>
              </div>
              <div style={sectionStyle}>
                <span style={labelStyle}>Visual Inspection</span>
                <span style={valueStyle}>Brake dust visible, rotors scored</span>
              </div>
              <div style={sectionStyle}>
                <span style={labelStyle}>Fluid Levels</span>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  <li style={valueStyle}>Oil: Good</li>
                  <li style={valueStyle}>Coolant: Low</li>
                  <li style={valueStyle}>Brake: Low</li>
                  <li style={valueStyle}>Transmission: Good</li>
                  <li style={valueStyle}>Power Steering: Good</li>
                  <li style={valueStyle}>Windshield: Good</li>
                </ul>
              </div>
              <div style={sectionStyle}>
                <span style={labelStyle}>Tire Condition</span>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  <li style={valueStyle}>Front Left: Good</li>
                  <li style={valueStyle}>Front Right: Good</li>
                  <li style={valueStyle}>Rear Left: Worn</li>
                  <li style={valueStyle}>Rear Right: Worn</li>
                </ul>
              </div>
              <div style={sectionStyle}>
                <span style={labelStyle}>Battery Condition</span>
                <span style={valueStyle}>Good</span>
              </div>
              <div style={sectionStyle}>
                <span style={labelStyle}>Belts & Hoses</span>
                <span style={valueStyle}>No visible cracks</span>
              </div>
            </div>
          )}
          {activeTab === 'media' && (
            <div>
              <div style={sectionStyle}>
                <span style={labelStyle}>Photos</span>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  <li style={valueStyle}>photo1.jpg</li>
                  <li style={valueStyle}>photo2.jpg</li>
                </ul>
              </div>
              <div style={sectionStyle}>
                <span style={labelStyle}>Videos</span>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  <li style={valueStyle}>video1.mp4</li>
                </ul>
              </div>
              <div style={sectionStyle}>
                <span style={labelStyle}>Documents</span>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  <li style={valueStyle}>invoice.pdf</li>
                </ul>
              </div>
              <div style={sectionStyle}>
                <span style={labelStyle}>Voice Notes</span>
                <span style={valueStyle}>No voice notes</span>
              </div>
            </div>
          )}
          {activeTab === 'additional' && (
            <div>
              <div style={sectionStyle}>
                <span style={labelStyle}>Has Insurance</span>
                <span style={valueStyle}>Yes</span>
              </div>
              <div style={sectionStyle}>
                <span style={labelStyle}>Insurance Provider</span>
                <span style={valueStyle}>State Farm</span>
              </div>
              <div style={sectionStyle}>
                <span style={labelStyle}>Claim Number</span>
                <span style={valueStyle}>CLM-2024-001</span>
              </div>
              <div style={sectionStyle}>
                <span style={labelStyle}>Deductible</span>
                <span style={valueStyle}>LKR 10,000</span>
              </div>
              <div style={sectionStyle}>
                <span style={labelStyle}>Warranty Work</span>
                <span style={valueStyle}>No</span>
              </div>
              <div style={sectionStyle}>
                <span style={labelStyle}>Customer Waiting</span>
                <span style={valueStyle}>No</span>
              </div>
              <div style={sectionStyle}>
                <span style={labelStyle}>Alternative Contact</span>
                <span style={valueStyle}>N/A</span>
              </div>
              <div style={sectionStyle}>
                <span style={labelStyle}>Special Instructions</span>
                <span style={valueStyle}>None</span>
              </div>
              <div style={sectionStyle}>
                <span style={labelStyle}>Parts Needed</span>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  <li style={valueStyle}>Brake Pads</li>
                  <li style={valueStyle}>Brake Fluid</li>
                </ul>
              </div>
              <div style={sectionStyle}>
                <span style={labelStyle}>Estimated Cost</span>
                <span style={valueStyle}>LKR 32,000</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewRequestModal; 