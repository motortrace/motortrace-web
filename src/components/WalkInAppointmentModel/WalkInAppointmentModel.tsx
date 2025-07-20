import React, { useState, useEffect } from 'react';

export interface WalkInAppointmentModalProps {
  existingWorkOrder?: {
    id: string;
    vehicleInfo: any;
    customerInfo: any;
  };
  onClose: () => void;
  onSave: (appointmentData: any) => void;
}

const defaultAppointment = {
  // Customer Information
  customerInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    isExistingCustomer: false,
    customerId: '',
  },
  // Vehicle Information
  vehicleInfo: {
    year: '',
    make: '',
    model: '',
    trim: '',
    vin: '',
    licensePlate: '',
    color: '',
    mileage: 0,
    engineType: '',
    transmission: '',
    driveType: '',
    fuelType: '',
  },
  // Work Order Information
  workOrderInfo: {
    hasExistingWorkOrder: false,
    existingWorkOrderId: '',
    priority: 'medium',
    estimatedCompletionTime: '',
    appointmentDate: '',
    appointmentTime: '',
  },
  // Service Information
  serviceInfo: {
    primaryConcern: '',
    symptoms: '',
    whenIssueStarted: '',
    serviceType: '',
    requestedServices: [],
    customerNotes: '',
    diagnosticCodes: [],
    obd2Codes: '',
    previousRepairs: '',
  },
  // Technical Information
  technicalInfo: {
    assignedTechnician: '',
    inspectionNotes: '',
    visualInspection: '',
    fluidLevels: {
      oil: '',
      coolant: '',
      brake: '',
      transmission: '',
      powerSteering: '',
      windshield: '',
    },
    tireCondition: {
      frontLeft: '',
      frontRight: '',
      rearLeft: '',
      rearRight: '',
    },
    batteryCondition: '',
    beltsAndHoses: '',
  },
  // Media and Documentation
  mediaInfo: {
    photos: [],
    videos: [],
    documents: [],
    voiceNotes: '',
  },
  // Additional Information
  additionalInfo: {
    hasInsurance: false,
    insuranceProvider: '',
    claimNumber: '',
    deductible: 0,
    isWarrantyWork: false,
    warrantyProvider: '',
    customerWaiting: true,
    alternativeContact: '',
    specialInstructions: '',
    partsNeeded: [],
    estimatedCost: 0,
  }
};

const serviceTypes = [
  'Diagnostic',
  'Oil Change',
  'Brake Service',
  'Transmission Service',
  'Engine Repair',
  'Suspension',
  'Electrical',
  'AC/Heating',
  'Tire Service',
  'General Maintenance',
  'State Inspection',
  'Other'
];

// Add types for the form state

type FluidLevels = {
  oil: string;
  coolant: string;
  brake: string;
  transmission: string;
  powerSteering: string;
  windshield: string;
};

type TireCondition = {
  frontLeft: string;
  frontRight: string;
  rearLeft: string;
  rearRight: string;
};

type AppointmentForm = typeof defaultAppointment;

type SectionKey = keyof AppointmentForm;

type NestedSectionKey = keyof (AppointmentForm[keyof AppointmentForm]);

const WalkInAppointmentModal: React.FC<WalkInAppointmentModalProps> = ({ 
  existingWorkOrder, 
  onClose, 
  onSave 
}) => {
  const [form, setForm] = useState(defaultAppointment);
  const [activeTab, setActiveTab] = useState('customer');
  const [isEditing, setIsEditing] = useState(true);

  useEffect(() => {
    if (existingWorkOrder) {
      setForm(prev => ({
        ...prev,
        customerInfo: existingWorkOrder.customerInfo || prev.customerInfo,
        vehicleInfo: existingWorkOrder.vehicleInfo || prev.vehicleInfo,
        workOrderInfo: {
          ...prev.workOrderInfo,
          hasExistingWorkOrder: true,
          existingWorkOrderId: existingWorkOrder.id,
        }
      }));
    }
  }, [existingWorkOrder]);

  const handleInputChange = (section: SectionKey, field: string, value: any) => {
    setForm(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleNestedInputChange = (section: SectionKey, subsection: string, field: string, value: any) => {
    setForm(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...((prev[section] as any)[subsection]),
          [field]: value
        }
      }
    }));
  };

  const handleArrayInputChange = (section: SectionKey, field: string, index: number, value: any) => {
    setForm(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: (prev[section] as any)[field].map((item: any, i: number) => i === index ? value : item)
      }
    }));
  };

  const addArrayItem = (section: SectionKey, field: string, newItem: any) => {
    setForm(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: [...(prev[section] as any)[field], newItem]
      }
    }));
  };

  const removeArrayItem = (section: SectionKey, field: string, index: number) => {
    setForm(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: (prev[section] as any)[field].filter((_: any, i: number) => i !== index)
      }
    }));
  };

  const handleFileUpload = (section: SectionKey, field: string, files: FileList) => {
    const fileArray = Array.from(files);
    setForm(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: [...(prev[section] as any)[field], ...fileArray]
      }
    }));
  };

  const handleSave = () => {
    if (!form.customerInfo.firstName || !form.customerInfo.lastName || !form.vehicleInfo.year) {
      alert('Please fill in required fields');
      return;
    }
    onSave(form);
  };

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
    padding: '20px'
  };

  const modalContentStyle = {
    background: 'white',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '1000px',
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
    background: '#f8fafc'
  };

  const tabsStyle = {
    display: 'flex',
    borderBottom: '1px solid #e2e8f0',
    overflowX: 'auto' as const,
    padding: '0 32px'
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
    transition: 'all 0.2s ease'
  });

  const contentStyle = {
    flex: 1,
    overflowY: 'auto' as const,
    padding: '32px'
  };

  const formGroupStyle = {
    marginBottom: '20px'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '8px'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e2e8f0',
    borderRadius: '8px',
    fontSize: '14px',
    background: 'white',
    color: '#374151',
    transition: 'all 0.2s ease',
    boxSizing: 'border-box' as const
  };

  const formRowStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '20px'
  };

  const buttonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'all 0.2s ease',
    border: 'none',
    cursor: 'pointer'
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    background: '#343438',
    color: 'white'
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
    transition: 'all 0.2s ease'
  };

  const checkboxLabelStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    color: '#374151'
  };

  const infoBoxStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    background: '#f0f9ff',
    border: '1px solid #bae6fd',
    borderRadius: '8px',
    color: '#0369a1',
    fontSize: '14px',
    marginBottom: '20px'
  };

  const fileUploadAreaStyle = {
    border: '2px dashed #cbd5e1',
    borderRadius: '8px',
    padding: '24px',
    textAlign: 'center' as const,
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  };

  const fileUploadLabelStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    color: '#64748b'
  };

  return (
    <div style={modalStyle} onClick={onClose}>
      <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
        <div style={headerStyle}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b', margin: '0 0 8px 0' }}>
              Walk-In Appointment
            </h2>
            <p style={{ fontSize: '14px', color: '#64748b', margin: '0' }}>
              Create a comprehensive appointment record for walk-in customer
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button style={primaryButtonStyle} onClick={handleSave}>
              <i className="bx bx-save" style={{ fontSize: 18 }}></i> Save Appointment
            </button>
            <button style={closeButtonStyle} onClick={onClose}>
              <i className="bx bx-x" style={{ fontSize: 20 }}></i>
            </button>
          </div>
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
              <h3 style={{ marginBottom: '24px', color: '#1e293b' }}>Customer Information</h3>
              <div style={formRowStyle}>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>First Name *</label>
                  <input
                    style={inputStyle}
                    type="text"
                    value={form.customerInfo.firstName}
                    onChange={e => handleInputChange('customerInfo', 'firstName', e.target.value)}
                    placeholder="Enter first name"
                    required
                  />
                </div>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Last Name *</label>
                  <input
                    style={inputStyle}
                    type="text"
                    value={form.customerInfo.lastName}
                    onChange={e => handleInputChange('customerInfo', 'lastName', e.target.value)}
                    placeholder="Enter last name"
                    required
                  />
                </div>
              </div>
              <div style={formRowStyle}>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Email</label>
                  <input
                    style={inputStyle}
                    type="email"
                    value={form.customerInfo.email}
                    onChange={e => handleInputChange('customerInfo', 'email', e.target.value)}
                    placeholder="customer@email.com"
                  />
                </div>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Phone *</label>
                  <input
                    style={inputStyle}
                    type="tel"
                    value={form.customerInfo.phone}
                    onChange={e => handleInputChange('customerInfo', 'phone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    required
                  />
                </div>
              </div>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Address</label>
                <input
                  style={inputStyle}
                  type="text"
                  value={form.customerInfo.address}
                  onChange={e => handleInputChange('customerInfo', 'address', e.target.value)}
                  placeholder="Street address"
                />
              </div>
              <div style={formRowStyle}>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>City</label>
                  <input
                    style={inputStyle}
                    type="text"
                    value={form.customerInfo.city}
                    onChange={e => handleInputChange('customerInfo', 'city', e.target.value)}
                    placeholder="City"
                  />
                </div>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>State</label>
                  <input
                    style={inputStyle}
                    type="text"
                    value={form.customerInfo.state}
                    onChange={e => handleInputChange('customerInfo', 'state', e.target.value)}
                    placeholder="State"
                  />
                </div>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>ZIP Code</label>
                  <input
                    style={inputStyle}
                    type="text"
                    value={form.customerInfo.zipCode}
                    onChange={e => handleInputChange('customerInfo', 'zipCode', e.target.value)}
                    placeholder="12345"
                  />
                </div>
              </div>
              <div style={formGroupStyle}>
                <label style={checkboxLabelStyle}>
                  <input
                    type="checkbox"
                    checked={form.customerInfo.isExistingCustomer}
                    onChange={e => handleInputChange('customerInfo', 'isExistingCustomer', e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: '#3b82f6' }}
                  />
                  Existing Customer
                </label>
              </div>
              {form.customerInfo.isExistingCustomer && (
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Customer ID</label>
                  <input
                    style={inputStyle}
                    type="text"
                    value={form.customerInfo.customerId}
                    onChange={e => handleInputChange('customerInfo', 'customerId', e.target.value)}
                    placeholder="Enter customer ID"
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === 'vehicle' && (
            <div>
              <h3 style={{ marginBottom: '24px', color: '#1e293b' }}>Vehicle Information</h3>
              <div style={formRowStyle}>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Year *</label>
                  <input
                    style={inputStyle}
                    type="number"
                    value={form.vehicleInfo.year}
                    onChange={e => handleInputChange('vehicleInfo', 'year', e.target.value)}
                    placeholder="2020"
                    min="1900"
                    max="2030"
                    required
                  />
                </div>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Make *</label>
                  <input
                    style={inputStyle}
                    type="text"
                    value={form.vehicleInfo.make}
                    onChange={e => handleInputChange('vehicleInfo', 'make', e.target.value)}
                    placeholder="Toyota"
                    required
                  />
                </div>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Model *</label>
                  <input
                    style={inputStyle}
                    type="text"
                    value={form.vehicleInfo.model}
                    onChange={e => handleInputChange('vehicleInfo', 'model', e.target.value)}
                    placeholder="Camry"
                    required
                  />
                </div>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Trim</label>
                  <input
                    style={inputStyle}
                    type="text"
                    value={form.vehicleInfo.trim}
                    onChange={e => handleInputChange('vehicleInfo', 'trim', e.target.value)}
                    placeholder="LE, SE, XLE"
                  />
                </div>
              </div>
              <div style={formRowStyle}>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>VIN</label>
                  <input
                    style={inputStyle}
                    type="text"
                    value={form.vehicleInfo.vin}
                    onChange={e => handleInputChange('vehicleInfo', 'vin', e.target.value)}
                    placeholder="1HGBH41JXMN109186"
                    maxLength={17}
                  />
                </div>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>License Plate</label>
                  <input
                    style={inputStyle}
                    type="text"
                    value={form.vehicleInfo.licensePlate}
                    onChange={e => handleInputChange('vehicleInfo', 'licensePlate', e.target.value)}
                    placeholder="ABC-1234"
                  />
                </div>
              </div>
              <div style={formRowStyle}>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Color</label>
                  <input
                    style={inputStyle}
                    type="text"
                    value={form.vehicleInfo.color}
                    onChange={e => handleInputChange('vehicleInfo', 'color', e.target.value)}
                    placeholder="Red"
                  />
                </div>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Mileage</label>
                  <input
                    style={inputStyle}
                    type="number"
                    value={form.vehicleInfo.mileage}
                    onChange={e => handleInputChange('vehicleInfo', 'mileage', parseInt(e.target.value))}
                    placeholder="50000"
                    min="0"
                  />
                </div>
              </div>
              <div style={formRowStyle}>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Engine Type</label>
                  <input
                    style={inputStyle}
                    type="text"
                    value={form.vehicleInfo.engineType}
                    onChange={e => handleInputChange('vehicleInfo', 'engineType', e.target.value)}
                    placeholder="2.5L I4"
                  />
                </div>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Transmission</label>
                  <select
                    style={inputStyle}
                    value={form.vehicleInfo.transmission}
                    onChange={e => handleInputChange('vehicleInfo', 'transmission', e.target.value)}
                  >
                    <option value="">Select transmission</option>
                    <option value="Manual">Manual</option>
                    <option value="Automatic">Automatic</option>
                    <option value="CVT">CVT</option>
                  </select>
                </div>
              </div>
              <div style={formRowStyle}>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Drive Type</label>
                  <select
                    style={inputStyle}
                    value={form.vehicleInfo.driveType}
                    onChange={e => handleInputChange('vehicleInfo', 'driveType', e.target.value)}
                  >
                    <option value="">Select drive type</option>
                    <option value="FWD">Front Wheel Drive</option>
                    <option value="RWD">Rear Wheel Drive</option>
                    <option value="AWD">All Wheel Drive</option>
                    <option value="4WD">Four Wheel Drive</option>
                  </select>
                </div>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Fuel Type</label>
                  <select
                    style={inputStyle}
                    value={form.vehicleInfo.fuelType}
                    onChange={e => handleInputChange('vehicleInfo', 'fuelType', e.target.value)}
                  >
                    <option value="">Select fuel type</option>
                    <option value="Gasoline">Gasoline</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Electric">Electric</option>
                    <option value="Flex Fuel">Flex Fuel</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'workorder' && (
            <div>
              <h3 style={{ marginBottom: '24px', color: '#1e293b' }}>Work Order Information</h3>
              <div style={formGroupStyle}>
                <label style={checkboxLabelStyle}>
                  <input
                    type="checkbox"
                    checked={form.workOrderInfo.hasExistingWorkOrder}
                    onChange={e => handleInputChange('workOrderInfo', 'hasExistingWorkOrder', e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: '#3b82f6' }}
                  />
                  Link to Existing Work Order
                </label>
              </div>
              
              {form.workOrderInfo.hasExistingWorkOrder ? (
                <div>
                  <div style={formGroupStyle}>
                    <label style={labelStyle}>Existing Work Order ID</label>
                    <input
                      style={inputStyle}
                      type="text"
                      value={form.workOrderInfo.existingWorkOrderId}
                      onChange={e => handleInputChange('workOrderInfo', 'existingWorkOrderId', e.target.value)}
                      placeholder="WO-2024-001"
                    />
                  </div>
                  <div style={infoBoxStyle}>
                    <span>ℹ️</span>
                    <p>This appointment will be linked to the existing work order. Vehicle and customer information will be pulled from the existing record.</p>
                  </div>
                </div>
              ) : (
                <div style={infoBoxStyle}>
                  <span>➕</span>
                  <p>A new work order will be created for this appointment with all the information provided.</p>
                </div>
              )}

              <div style={formRowStyle}>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Priority</label>
                  <select
                    style={inputStyle}
                    value={form.workOrderInfo.priority}
                    onChange={e => handleInputChange('workOrderInfo', 'priority', e.target.value)}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Estimated Completion</label>
                  <input
                    style={inputStyle}
                    type="datetime-local"
                    value={form.workOrderInfo.estimatedCompletionTime}
                    onChange={e => handleInputChange('workOrderInfo', 'estimatedCompletionTime', e.target.value)}
                  />
                </div>
              </div>
              
              <div style={formRowStyle}>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Appointment Date</label>
                  <input
                    style={inputStyle}
                    type="date"
                    value={form.workOrderInfo.appointmentDate}
                    onChange={e => handleInputChange('workOrderInfo', 'appointmentDate', e.target.value)}
                  />
                </div>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Appointment Time</label>
                  <input
                    style={inputStyle}
                    type="time"
                    value={form.workOrderInfo.appointmentTime}
                    onChange={e => handleInputChange('workOrderInfo', 'appointmentTime', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'service' && (
            <div>
              <h3 style={{ marginBottom: '24px', color: '#1e293b' }}>Service Details</h3>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Primary Concern *</label>
                <textarea
                  style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                  value={form.serviceInfo.primaryConcern}
                  onChange={e => handleInputChange('serviceInfo', 'primaryConcern', e.target.value)}
                  placeholder="Describe the main issue the customer is experiencing..."
                  rows={3}
                  required
                />
              </div>
              
              <div style={formGroupStyle}>
                <label style={labelStyle}>Symptoms</label>
                <textarea
                  style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                  value={form.serviceInfo.symptoms}
                  onChange={e => handleInputChange('serviceInfo', 'symptoms', e.target.value)}
                  placeholder="List all symptoms: noises, vibrations, warning lights, etc."
                  rows={3}
                />
              </div>

              <div style={formRowStyle}>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>When Issue Started</label>
                  <input
                    style={inputStyle}
                    type="text"
                    value={form.serviceInfo.whenIssueStarted}
                    onChange={e => handleInputChange('serviceInfo', 'whenIssueStarted', e.target.value)}
                    placeholder="Yesterday, last week, gradually over time..."
                  />
                </div>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Service Type</label>
                  <select
                    style={inputStyle}
                    value={form.serviceInfo.serviceType}
                    onChange={e => handleInputChange('serviceInfo', 'serviceType', e.target.value)}
                  >
                    <option value="">Select service type</option>
                    {serviceTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>OBD2 Diagnostic Codes</label>
                <textarea
                  style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }}
                  value={form.serviceInfo.obd2Codes}
                  onChange={e => handleInputChange('serviceInfo', 'obd2Codes', e.target.value)}
                  placeholder="Enter OBD2 codes (P0XXX, B0XXX, U0XXX, etc.) separated by commas"
                  rows={2}
                />
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>Previous Repairs</label>
                <textarea
                  style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                  value={form.serviceInfo.previousRepairs}
                  onChange={e => handleInputChange('serviceInfo', 'previousRepairs', e.target.value)}
                  placeholder="List any recent repairs or maintenance performed..."
                  rows={3}
                />
              </div>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Requested Services</label>
                <div>
                  {form.serviceInfo.requestedServices.map((service: string, idx: number) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                      <input
                        style={{ ...inputStyle, flex: 1 }}
                        type="text"
                        value={service}
                        onChange={e => handleArrayInputChange('serviceInfo', 'requestedServices', idx, e.target.value)}
                        placeholder="Service name"
                      />
                      <button
                        type="button"
                        style={{ marginLeft: 8, ...buttonStyle, background: '#f87171', color: 'white', padding: '8px 12px' }}
                        onClick={() => removeArrayItem('serviceInfo', 'requestedServices', idx)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    style={{ ...buttonStyle, background: '#e0e7ef', color: '#3b82f6', marginTop: 8 }}
                    onClick={() => addArrayItem('serviceInfo', 'requestedServices', '')}
                  >
                    + Add Service
                  </button>
                </div>
              </div>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Customer Notes</label>
                <textarea
                  style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }}
                  value={form.serviceInfo.customerNotes}
                  onChange={e => handleInputChange('serviceInfo', 'customerNotes', e.target.value)}
                  placeholder="Any additional notes from the customer"
                  rows={2}
                />
              </div>
            </div>
          )}

          {activeTab === 'technical' && (
            <div>
              <h3 style={{ marginBottom: '24px', color: '#1e293b' }}>Technical Information</h3>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Assigned Technician</label>
                <input
                  style={inputStyle}
                  type="text"
                  value={form.technicalInfo.assignedTechnician}
                  onChange={e => handleInputChange('technicalInfo', 'assignedTechnician', e.target.value)}
                  placeholder="Technician name"
                />
              </div>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Inspection Notes</label>
                <textarea
                  style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }}
                  value={form.technicalInfo.inspectionNotes}
                  onChange={e => handleInputChange('technicalInfo', 'inspectionNotes', e.target.value)}
                  placeholder="Inspection notes"
                  rows={2}
                />
              </div>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Visual Inspection</label>
                <textarea
                  style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }}
                  value={form.technicalInfo.visualInspection}
                  onChange={e => handleInputChange('technicalInfo', 'visualInspection', e.target.value)}
                  placeholder="Visual inspection details"
                  rows={2}
                />
              </div>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Fluid Levels</label>
                <div style={formRowStyle}>
                  {Object.keys(form.technicalInfo.fluidLevels).map((fluid) => (
                    <div key={fluid} style={formGroupStyle}>
                      <label style={labelStyle}>{fluid.charAt(0).toUpperCase() + fluid.slice(1)}</label>
                      <input
                        style={inputStyle}
                        type="text"
                        value={form.technicalInfo.fluidLevels[fluid as keyof FluidLevels]}
                        onChange={e => handleNestedInputChange('technicalInfo', 'fluidLevels', fluid, e.target.value)}
                        placeholder="Level/Condition"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Tire Condition</label>
                <div style={formRowStyle}>
                  {Object.keys(form.technicalInfo.tireCondition).map((tire) => (
                    <div key={tire} style={formGroupStyle}>
                      <label style={labelStyle}>{tire.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</label>
                      <input
                        style={inputStyle}
                        type="text"
                        value={form.technicalInfo.tireCondition[tire as keyof TireCondition]}
                        onChange={e => handleNestedInputChange('technicalInfo', 'tireCondition', tire, e.target.value)}
                        placeholder="Condition"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div style={formRowStyle}>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Battery Condition</label>
                  <input
                    style={inputStyle}
                    type="text"
                    value={form.technicalInfo.batteryCondition}
                    onChange={e => handleInputChange('technicalInfo', 'batteryCondition', e.target.value)}
                    placeholder="Battery condition"
                  />
                </div>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Belts & Hoses</label>
                  <input
                    style={inputStyle}
                    type="text"
                    value={form.technicalInfo.beltsAndHoses}
                    onChange={e => handleInputChange('technicalInfo', 'beltsAndHoses', e.target.value)}
                    placeholder="Belts and hoses condition"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'media' && (
            <div>
              <h3 style={{ marginBottom: '24px', color: '#1e293b' }}>Media & Documentation</h3>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Photos</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={e => e.target.files && handleFileUpload('mediaInfo', 'photos', e.target.files)}
                />
                <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {form.mediaInfo.photos.map((file: File, idx: number) => (
                    <div key={idx} style={{ border: '1px solid #e2e8f0', borderRadius: 4, padding: 4 }}>
                      <span style={{ fontSize: 12 }}>{file.name}</span>
                      <button
                        type="button"
                        style={{ marginLeft: 8, ...buttonStyle, background: '#f87171', color: 'white', padding: '4px 8px' }}
                        onClick={() => removeArrayItem('mediaInfo', 'photos', idx)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Videos</label>
                <input
                  type="file"
                  multiple
                  accept="video/*"
                  onChange={e => e.target.files && handleFileUpload('mediaInfo', 'videos', e.target.files)}
                />
                <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {form.mediaInfo.videos.map((file: File, idx: number) => (
                    <div key={idx} style={{ border: '1px solid #e2e8f0', borderRadius: 4, padding: 4 }}>
                      <span style={{ fontSize: 12 }}>{file.name}</span>
                      <button
                        type="button"
                        style={{ marginLeft: 8, ...buttonStyle, background: '#f87171', color: 'white', padding: '4px 8px' }}
                        onClick={() => removeArrayItem('mediaInfo', 'videos', idx)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Documents</label>
                <input
                  type="file"
                  multiple
                  accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={e => e.target.files && handleFileUpload('mediaInfo', 'documents', e.target.files)}
                />
                <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {form.mediaInfo.documents.map((file: File, idx: number) => (
                    <div key={idx} style={{ border: '1px solid #e2e8f0', borderRadius: 4, padding: 4 }}>
                      <span style={{ fontSize: 12 }}>{file.name}</span>
                      <button
                        type="button"
                        style={{ marginLeft: 8, ...buttonStyle, background: '#f87171', color: 'white', padding: '4px 8px' }}
                        onClick={() => removeArrayItem('mediaInfo', 'documents', idx)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Voice Notes</label>
                <textarea
                  style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }}
                  value={form.mediaInfo.voiceNotes}
                  onChange={e => handleInputChange('mediaInfo', 'voiceNotes', e.target.value)}
                  placeholder="Paste a link to a voice note or add notes here"
                  rows={2}
                />
              </div>
            </div>
          )}

          {activeTab === 'additional' && (
            <div>
              <h3 style={{ marginBottom: '24px', color: '#1e293b' }}>Additional Information</h3>
              <div style={formGroupStyle}>
                <label style={checkboxLabelStyle}>
                  <input
                    type="checkbox"
                    checked={form.additionalInfo.hasInsurance}
                    onChange={e => handleInputChange('additionalInfo', 'hasInsurance', e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: '#3b82f6' }}
                  />
                  Has Insurance
                </label>
              </div>
              {form.additionalInfo.hasInsurance && (
                <>
                  <div style={formGroupStyle}>
                    <label style={labelStyle}>Insurance Provider</label>
                    <input
                      style={inputStyle}
                      type="text"
                      value={form.additionalInfo.insuranceProvider}
                      onChange={e => handleInputChange('additionalInfo', 'insuranceProvider', e.target.value)}
                      placeholder="Insurance company"
                    />
                  </div>
                  <div style={formGroupStyle}>
                    <label style={labelStyle}>Claim Number</label>
                    <input
                      style={inputStyle}
                      type="text"
                      value={form.additionalInfo.claimNumber}
                      onChange={e => handleInputChange('additionalInfo', 'claimNumber', e.target.value)}
                      placeholder="Claim number"
                    />
                  </div>
                  <div style={formGroupStyle}>
                    <label style={labelStyle}>Deductible</label>
                    <input
                      style={inputStyle}
                      type="number"
                      value={form.additionalInfo.deductible}
                      onChange={e => handleInputChange('additionalInfo', 'deductible', parseFloat(e.target.value))}
                      placeholder="Deductible amount"
                      min="0"
                    />
                  </div>
                </>
              )}
              <div style={formGroupStyle}>
                <label style={checkboxLabelStyle}>
                  <input
                    type="checkbox"
                    checked={form.additionalInfo.isWarrantyWork}
                    onChange={e => handleInputChange('additionalInfo', 'isWarrantyWork', e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: '#3b82f6' }}
                  />
                  Warranty Work
                </label>
              </div>
              {form.additionalInfo.isWarrantyWork && (
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Warranty Provider</label>
                  <input
                    style={inputStyle}
                    type="text"
                    value={form.additionalInfo.warrantyProvider}
                    onChange={e => handleInputChange('additionalInfo', 'warrantyProvider', e.target.value)}
                    placeholder="Warranty company"
                  />
                </div>
              )}
              <div style={formGroupStyle}>
                <label style={checkboxLabelStyle}>
                  <input
                    type="checkbox"
                    checked={form.additionalInfo.customerWaiting}
                    onChange={e => handleInputChange('additionalInfo', 'customerWaiting', e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: '#3b82f6' }}
                  />
                  Customer Waiting
                </label>
              </div>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Alternative Contact</label>
                <input
                  style={inputStyle}
                  type="text"
                  value={form.additionalInfo.alternativeContact}
                  onChange={e => handleInputChange('additionalInfo', 'alternativeContact', e.target.value)}
                  placeholder="Alternative contact"
                />
              </div>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Special Instructions</label>
                <textarea
                  style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }}
                  value={form.additionalInfo.specialInstructions}
                  onChange={e => handleInputChange('additionalInfo', 'specialInstructions', e.target.value)}
                  placeholder="Any special instructions"
                  rows={2}
                />
              </div>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Parts Needed</label>
                <div>
                  {form.additionalInfo.partsNeeded.map((part: string, idx: number) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                      <input
                        style={{ ...inputStyle, flex: 1 }}
                        type="text"
                        value={part}
                        onChange={e => handleArrayInputChange('additionalInfo', 'partsNeeded', idx, e.target.value)}
                        placeholder="Part name"
                      />
                      <button
                        type="button"
                        style={{ marginLeft: 8, ...buttonStyle, background: '#f87171', color: 'white', padding: '8px 12px' }}
                        onClick={() => removeArrayItem('additionalInfo', 'partsNeeded', idx)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    style={{ ...buttonStyle, background: '#e0e7ef', color: '#3b82f6', marginTop: 8 }}
                    onClick={() => addArrayItem('additionalInfo', 'partsNeeded', '')}
                  >
                    + Add Part
                  </button>
                </div>
              </div>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Estimated Cost</label>
                <input
                  style={inputStyle}
                  type="number"
                  value={form.additionalInfo.estimatedCost}
                  onChange={e => handleInputChange('additionalInfo', 'estimatedCost', parseFloat(e.target.value))}
                  placeholder="Estimated cost"
                  min="0"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalkInAppointmentModal;