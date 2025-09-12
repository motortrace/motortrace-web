import React, { useState, useEffect } from 'react';

import NotesTab from '../../pages/ServiceCenter/JobCard/tabs/NotesTab';
import './ManageWorkOrderModal.scss';

// Mock types for demonstration
interface Technician {
  id: string;
  name: string;
  avatar: string;
}

interface ServiceLine {
  id: string;
  name: string;
  description: string;
  price: number;
  qty: number;
  hours: number;
  discount: number;
  tax: number;
  status: string;
  technician: Technician | null;
  type: 'package' | 'service';
  customerAccepted?: boolean | null; // true: accepted, false: declined, null/undefined: pending
}

type PartSource = "ordered" | "inventory" | "customer";

interface PartItem {
  id: string;
  name: string;
  image: string;
  description: string;
  qty: number;
  price: number;
  supplier: string;
  source: PartSource;
}

interface InspectionsTabProps {
  workOrder: any;
  inspectionTemplates: InspectionTemplate[];
  loading: boolean;
  onRefresh: () => void;
}

// Inspection-related types based on InspectionModal
interface InspectionTemplate {
  id: string;
  name: string;
  description?: string;
  category?: string;
  items: InspectionChecklistItem[];
}

interface InspectionChecklistItem {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  required: boolean;
  status: 'pending' | 'pass' | 'warning' | 'fail' | 'na';
  notes: string;
  completedAt?: string;
  category?: string;
  sortOrder?: number;
  allowsNotes?: boolean;
}

interface ManageWorkOrderModalProps {
  open: boolean;
  onClose: () => void;
  workOrder?: any;
}

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/';

// Tab Navigation Component
const TabNavigation: React.FC<{ activeTab: string; onTabChange: (tab: string) => void }> = ({
  activeTab,
  onTabChange
}) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'bx-home-circle' },
    { id: 'services', label: 'Services & Packages', icon: 'bx-wrench' },
    { id: 'parts', label: 'Parts', icon: 'bx-package' },
    { id: 'inspections', label: 'Inspections', icon: 'bx-search-alt' },
    { id: 'notes', label: 'Notes', icon: 'bx-note' },
  ];

  return (
    <div className="tab-navigation">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          <i className={`bx ${tab.icon}`}></i>
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

// Sidebar Component
const Sidebar: React.FC<{ workOrder: any }> = ({ workOrder }) => {
  if (!workOrder) return null;

  const workOrderStatus = workOrder.status || 'Estimation';
  const estimateSent = false;
  // New mock data for demonstration
  const workOrderId = workOrder.workOrderNumber || 'WO-2024-001257';
  const createdDate = workOrder.createdAt ? new Date(workOrder.createdAt).toLocaleDateString() : 'June 30, 2024';
  const businessLocation = 'Downtown Service Center';

  // Timeline mock data
  const timelineEvents = [
    // { label: 'Appointment Booked', date: 'June 25, 2024, 10:00 AM' },
    // { label: 'Scheduled Date', date: 'July 1, 2024, 9:00 AM' },
    // { label: 'Work Order Created', date: 'June 30, 2024, 4:30 PM' },
    // { label: 'Inspection Report Sent', date: 'July 1, 2024, 11:00 AM' },
    // { label: 'Estimate Sent', date: 'July 1, 2024, 12:00 PM' },
    // { label: 'Estimate Finalized', date: 'July 1, 2024, 2:00 PM' },
    // { label: 'Invoice Created', date: 'July 1, 2024, 2:30 PM' },
    // { label: 'Payment Made', date: 'July 1, 2024, 3:00 PM' },
    { label: 'Work Order Created', date: createdDate },
    { label: 'Status Updated', date: `${new Date().toLocaleDateString()}, ${workOrderStatus}` },
  ];

  // Calculate progress percentage based on status
  const getProgressPercentage = () => {
    switch (workOrder.status) {
      case 'PENDING': return 12.5;
      case 'IN_PROGRESS': return 50;
      case 'COMPLETED': return 100;
      case 'ON_HOLD': return 25;
      case 'CANCELLED': return 0;
      default: return 10;
    }
  };

  const progressPercentage = getProgressPercentage();

  return (
    <div className="modal-sidebar">
      {/* Work Order Info Section */}
      <div className="sidebar-section">
        <div className="sidebar-section-header">
          <h4><i className="bx bx-file"></i> Work Order Info</h4>
        </div>
        <div className="sidebar-section-content">
          <div className="workorder-info">
            <div className="workorder-row">
              <span className="workorder-label" style={{ marginRight: '0.5rem' }}>ID:</span>
              <span className="workorder-value">{workOrderId}</span>
            </div>
            <div className="workorder-row">
              <span className="workorder-label" style={{ marginRight: '0.5rem' }}>Created:</span>
              <span className="workorder-value">{createdDate}</span>
            </div>
          </div>
          {/* Timeline Section */}
          <div className="workorder-timeline">
            <h5 className="timeline-title"><i className="bx bx-timeline"></i> Timeline</h5>
            <ul className="timeline-list">
              {timelineEvents.map((event, idx) => (
                <li className="timeline-event" key={idx}>
                  <span className="timeline-event-label">{event.label}</span>
                  <span className="timeline-event-date">{event.date}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Status Section */}
      <div className="sidebar-section">
        <div className="sidebar-section-header">
          <h4><i className="bx bx-info-circle"></i> Status</h4>
        </div>
        <div className="sidebar-section-content">
          <div className="status-display">
            <span className={`status-badge status-badge--${workOrderStatus.toLowerCase().replace(/ /g, '-')}`}>{workOrderStatus}</span>
          </div>
        </div>
      </div>

      {/* Customer Info */}
      <div className="sidebar-section">
        <div className="sidebar-section-header">
          <h4><i className="bx bx-user"></i> Customer</h4>
        </div>
        <div className="sidebar-section-content">
          <div className="customer-info">
            <div className="customer-avatar">
              <i className="bx bx-user-circle"></i>
            </div>
            <div className="customer-details">
              <div className="customer-name">
                {workOrder.customer?.name || 'Unknown Customer'}
              </div>
              <div className="customer-contact">
                {workOrder.customer?.phone && (
                  <div className="contact-item">
                    <i className="bx bx-phone"></i>
                    <span>{workOrder.customer.phone}</span>
                  </div>
                )}
                {workOrder.customer?.email && (
                  <div className="contact-item">
                    <i className="bx bx-envelope"></i>
                    <span>{workOrder.customer.email}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle Info */}
      <div className="sidebar-section">
        <div className="sidebar-section-header">
          <h4><i className="bx bx-car"></i> Vehicle</h4>
        </div>
        <div className="sidebar-section-content">
          <div className="vehicle-info">
            <div className="vehicle-image">
              <img
                src="https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg?auto=compress&w=200"
                alt="Vehicle"
              />
            </div>
            <div className="vehicle-details">
              <div className="vehicle-name">
                {workOrder.vehicle?.make || ''} {workOrder.vehicle?.model || ''} {workOrder.vehicle?.year || ''}
              </div>
              {workOrder.vehicle?.licensePlate && (
                <div className="vehicle-plate">{workOrder.vehicle.licensePlate}</div>
              )}
              <div className="vehicle-specs">
                {workOrder.vehicle?.vin && (
                  <div className="spec-item">
                    <span className="spec-label">VIN:</span>
                    <span className="spec-value">{workOrder.vehicle.vin}</span>
                  </div>
                )}
                {workOrder.odometerReading && (
                  <div className="spec-item">
                    <span className="spec-label">Mileage:</span>
                    <span className="spec-value">{workOrder.odometerReading.toLocaleString()} km</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Job Progress */}
      <div className="sidebar-section">
        <div className="sidebar-section-header">
          <h4><i className="bx bx-timer"></i> Progress</h4>
        </div>
        <div className="sidebar-section-content">
          <div className="progress-info">
            <div className="progress-bar-container">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
              </div>
              <span className="progress-text">{progressPercentage}% Complete</span>
            </div>
            <div className="timeline-info">
              <div className="timeline-item">
                <span className="timeline-label">Created</span>
                <span className="timeline-value">{createdDate}</span>
              </div>
              <div className="timeline-item">
                <span className="timeline-label">Status</span>
                <span className="timeline-value">{workOrderStatus}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Assignments */}
      <div className="sidebar-section">
        <div className="sidebar-section-header">
          <h4><i className="bx bx-group"></i> Assignments</h4>
        </div>
        <div className="sidebar-section-content">
          <div className="assignment-info">
            {workOrder.assignedPeople && workOrder.assignedPeople.length > 0 ? (
              workOrder.assignedPeople.map((person: any) => (
                <div className="assignment-item" key={person.id}>
                  <span className="assignment-label">Technician</span>
                  <div className="tech-assignment">
                    <img src={person.profilePhoto} alt={person.name} />
                    <span>{person.name}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="assignment-item">
                <span className="assignment-label">Technician</span>
                <span className="assignment-value">Unassigned</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="sidebar-section">
        <div className="sidebar-section-header">
          <h4><i className="bx bx-bolt-circle"></i> Actions</h4>
        </div>
        <div className="sidebar-section-content">
          <div className="quick-actions">
            {!estimateSent ? (
              <button className="action-btn action-btn--primary">
                <i className="bx bx-send"></i>
                Send Estimate
              </button>
            ) : (
              <button className="action-btn action-btn--primary">
                <i className="bx bx-receipt"></i>
                Generate Invoice
              </button>
            )}
            <button className="action-btn action-btn--secondary">
              <i className="bx bx-printer"></i>
              Print Work Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Overview Tab Content
const OverviewTab: React.FC<{ workOrder: any }> = ({ workOrder }) => {
  if (!workOrder) return null;

  return (
    <div className="tab-content overview-tab">
      <div className="overview-grid">
        <div className="overview-card">
          <div className="overview-card-header">
            <i className="bx bx-message-detail"></i>
            <h4>Customer Complaint</h4>
          </div>
          <div className="overview-card-content">
            <p>{workOrder.complaint || "No complaint recorded"}</p>
          </div>
        </div>

        <div className="overview-card">
          <div className="overview-card-header">
            <i className="bx bx-note"></i>
            <h4>Service Advisor Notes</h4>
          </div>
          <div className="overview-card-content">
            <p>{workOrder.internalNotes || "No internal notes recorded"}</p>
          </div>
        </div>

        <div className="overview-card">
          <div className="overview-card-header">
            <i className="bx bx-info-circle"></i>
            <h4>Work Order Details</h4>
          </div>
          <div className="overview-card-content">
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Work Order Number</span>
                <span className="detail-value">{workOrder.workOrderNumber}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Priority</span>
                <span className={`priority-badge priority-badge--${workOrder.priority?.toLowerCase() || 'medium'}`}>
                  {workOrder.priority || 'Medium'}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Job Type</span>
                <span className="detail-value">{workOrder.jobType || 'Repair'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Estimated Total</span>
                <span className="detail-value">LKR {workOrder.estimatedTotal || '0.00'}</span>
              </div>
            </div>
          </div>
        </div>

      </div>


    </div>
  );
};

// Mock data
const mockServices: ServiceLine[] = [
  {
    id: 'svc-1',
    name: 'Brake Pad Replacement',
    description: 'Replace front brake pads with premium ceramic pads',
    price: 189.99,
    qty: 1,
    hours: 1.5,
    discount: 10,
    tax: 15,
    status: 'In Progress',
    technician: { id: 'tech-1', name: 'Mike Smith', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
    type: 'service',
    customerAccepted: true, // accepted
  },
  {
    id: 'pkg-1',
    name: 'Oil Change Package',
    description: 'Full synthetic oil change + filter',
    price: 89.99,
    qty: 1,
    hours: 0.5,
    discount: 0,
    tax: 8,
    status: 'Completed',
    technician: { id: 'tech-2', name: 'Sara Lee', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
    type: 'package',
    customerAccepted: false, // declined
  },
];

const mockParts: PartItem[] = [
  {
    id: 'part-1',
    name: 'Ceramic Brake Pads',
    image: 'https://www.r1concepts.com/media/r1concepts/images/blog/2023/the-best-pad-for-me-ceramic-pads-2.png',
    description: 'Premium ceramic brake pad set',
    qty: 1,
    price: 120.0,
    supplier: 'AutoZone',
    source: 'ordered',
  },
  {
    id: 'part-2',
    name: 'Oil Filter',
    image: 'https://dmaxstore.com/cdn/shop/products/PPE_20LM2_20oil_20filter-1.jpg?v=1744399263',
    description: 'High-efficiency oil filter',
    qty: 1,
    price: 15.0,
    supplier: 'NAPA',
    source: 'inventory',
  },
  {
    id: 'part-3',
    name: 'Wiper Blades',
    image: 'https://cdn11.bigcommerce.com/s-1b7b3/images/stencil/1280x1280/products/112/1086/wiper-blades__28213.1620072052.jpg?c=2',
    description: 'Front windshield wiper blades',
    qty: 1,
    price: 0.0,
    supplier: 'Customer',
    source: 'customer',
  },
];

// Services Tab Content
const ServicesTab: React.FC<{ workOrder: any }> = ({ workOrder }) => {
  if (!workOrder) return null;

  // const subtotal = mockServices.reduce((sum, s) => sum + s.price * s.qty, 0);
  // const totalDiscount = mockServices.reduce((sum, s) => sum + s.discount, 0);
  // const totalTax = mockServices.reduce((sum, s) => sum + s.tax, 0);
  // const total = subtotal - totalDiscount + totalTax;

  const packages = mockServices.filter(s => s.type === 'package');
  // const services = mockServices.filter(s => s.type === 'service');

  const services = workOrder.services?.map((service: any) => ({
    id: service.id,
    name: service.cannedService?.name || 'Unknown Service',
    description: service.cannedService?.description || service.notes || '',
    price: service.unitPrice || 0,
    qty: service.quantity || 1,
    hours: service.cannedService?.duration || 0.5,
    discount: 0, // This would need to come from the actual data
    tax: 0, // This would need to come from the actual data
    status: 'Pending', // This would need to come from the actual data
    technician: null, // This would need to come from the actual data
    type: 'service',
    customerAccepted: null, // This would need to come from the actual data
  })) || [];

  const subtotal = services.reduce((sum: number, s: any) => sum + s.price * s.qty, 0);
  const totalDiscount = services.reduce((sum: number, s: any) => sum + s.discount, 0);
  const totalTax = services.reduce((sum: number, s: any) => sum + s.tax, 0);
  const total = subtotal - totalDiscount + totalTax;


  return (
    <div className="tab-content services-tab">
      <div className="tab-header">
        <h3>Services & Packages</h3>
        <div className="tab-actions">
          <button className="btn btn--primary">
            <i className="bx bx-plus"></i> Add Service
          </button>
          <button className="btn btn--secondary">
            <i className="bx bx-package"></i> Add Package
          </button>
        </div>
      </div>

      <div className="services-table-container">
        <table className="services-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Qty/Hours</th>
              <th>Discount</th>
              <th>Tax</th>
              <th>Status</th>
              <th>Type</th>
              <th>Customer Response</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* List all packages as single rows */}
            {/* {packages.map(pkg => (
              <tr key={pkg.id} className="package-header-row">
                <td className="service-name">{pkg.name}</td>
                <td>{pkg.description}</td>
                <td>LKR {pkg.price.toFixed(2)}</td>
                <td>{pkg.qty} / {pkg.hours}h</td>
                <td>LKR {pkg.discount.toFixed(2)}</td>
                <td>LKR {pkg.tax.toFixed(2)}</td>
                <td>
                  <span className={`status-badge--custom status-badge--${pkg.customerAccepted === false ? 'declined' : (pkg.status.toLowerCase().replace(/ /g, '-') || 'default')}`}>
                    {pkg.customerAccepted === false ? 'Declined' : pkg.status}
                  </span>
                </td>
                <td>
                  <span className="type-badge type-badge--package">Package</span>
                </td>
                <td>
                  {pkg.customerAccepted === true && (
                    <span className="customer-accepted-badge">
                      <i className="bx bx-check-circle"></i> Accepted
                    </span>
                  )}
                  {pkg.customerAccepted === false && (
                    <span className="customer-declined-badge">
                      <i className="bx bx-x-circle"></i> Declined
                    </span>
                  )}
                  {(pkg.customerAccepted === undefined || pkg.customerAccepted === null) && (
                    <span className="customer-pending-badge">
                      <i className="bx bx-time"></i> Pending
                    </span>
                  )}
                </td>
                <td className="action-cell">
                  <button className="btn-icon btn-danger" title="Remove">
                    <i className="bx bx-trash"></i>
                  </button>
                </td>
              </tr>
            ))} */}
            {/* List all services as single rows */}
            {services.map((service: any) => (
              <tr key={service.id} className="service-in-package-row">
                <td className="service-name">{service.name}</td>
                <td style={{ textAlign: 'justify' }}>{service.description}</td>
                <td>LKR {service.price}</td>
                <td>{service.qty} / {service.hours}h</td>
                <td>LKR {service.discount.toFixed(2)}</td>
                <td>LKR {service.tax.toFixed(2)}</td>
                <td>
                  <span className={`status-badge--custom status-badge--${service.status.toLowerCase().replace(/ /g, '-')}`}>
                    {service.status}
                  </span>
                </td>
                <td>
                  <span className="type-badge type-badge--service">Service</span>
                </td>
                <td>
                  {service.customerAccepted === true && (
                    <span className="customer-accepted-badge">
                      <i className="bx bx-check-circle"></i> Accepted
                    </span>
                  )}
                  {service.customerAccepted === false && (
                    <span className="customer-declined-badge">
                      <i className="bx bx-x-circle"></i> Declined
                    </span>
                  )}
                  {(service.customerAccepted === undefined || service.customerAccepted === null) && (
                    <span className="customer-pending-badge">
                      <i className="bx bx-time"></i> Pending
                    </span>
                  )}
                </td>
                <td className="action-cell">
                  <button className="btn-icon btn-danger" title="Remove">
                    <i className="bx bx-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="services-summary">
        <div className="summary-row">
          <span>Subtotal:</span>
          <span>LKR {subtotal.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Total Discount:</span>
          <span>LKR {totalDiscount.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Total Tax:</span>
          <span>LKR {totalTax.toFixed(2)}</span>
        </div>
        <div className="summary-row summary-row--total">
          <span>Total:</span>
          <span>LKR {total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

// Parts Tab Content
const PartsTab: React.FC<{ workOrder: any }> = ({ workOrder }) => {
  if (!workOrder) return null;

  const parts = workOrder.partsUsed?.map((part: any) => ({
    id: part.id,
    name: part.part?.name || 'Unknown Part',
    image: 'https://via.placeholder.com/50',
    description: part.part?.description || '',
    qty: part.quantity || 1,
    price: part.unitPrice || 0,
    supplier: 'Supplier', // This would need to come from the actual data
    source: 'inventory' as const, // This would need to come from the actual data
  })) || [];

  // const [parts, setParts] = useState<PartItem[]>(mockParts);

  const [partsState, setParts] = useState(parts);

  const handleSourceChange = (id: string, newSource: PartItem['source']) => {
    setParts((prev: any) => prev.map((part: any) => part.id === id ? { ...part, source: newSource } : part));
  };

  const handleRemove = (id: string) => {
    setParts((prev: any) => prev.filter((part: any) => part.id !== id));
  };

  const sourceColors: Record<PartSource, string> = {
    ordered: '#007bff',
    inventory: '#ff9800',
    customer: '#28a745',
  };


  return (
    <div className="tab-content parts-tab">
      <div className="tab-header">
        <h3>Parts</h3>
        <div className="tab-actions">
          <button className="btn btn--primary">
            <i className="bx bx-plus"></i> Add Part
          </button>
        </div>
      </div>

      {/* Parts Table */}
      <div className="parts-table-container">
        <table className="parts-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Image</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Supplier</th>
              <th>Source</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {partsState.map((part: PartItem) => (
              <tr key={part.id} className={part.source === 'customer' ? 'customer-part-row' : ''}>
                <td>{part.name}</td>
                <td>{part.description}</td>
                <td><img src={part.image} alt={part.name} className="part-image-thumb" /></td>
                <td>{part.qty}</td>
                <td>{part.price > 0 ? `LKR ${part.price.toFixed(2)}` : '-'}</td>
                <td>{part.supplier}</td>
                <td>
                  <select
                    className="part-source-dropdown"
                    value={part.source}
                    onChange={e => handleSourceChange(part.id, e.target.value as PartItem['source'])}
                    style={{
                      backgroundColor: sourceColors[part.source],
                      color: '#fff',
                      fontWeight: 500,
                      border: 'none',
                    }}
                  >
                    <option value="ordered">Ordered</option>
                    <option value="inventory">Inventory</option>
                    <option value="customer">Customer Supplied</option>
                  </select>
                </td>
                <td>
                  <button className="btn-icon btn-danger" title="Remove" onClick={() => handleRemove(part.id)}>
                    <i className="bx bx-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Notes Tab Content
const NotesTabContent: React.FC<{ notes: string; onNotesChange: (notes: string) => void; workOrder: any }> = ({
  notes,
  onNotesChange,
  workOrder
}) => {
  return (
    <div className="tab-content notes-tab">
      <div className="tab-header">
        <h3>Notes</h3>
      </div>
      <NotesTab notes={workOrder.internalNotes || notes} onNotesChange={onNotesChange} />
    </div>
  );
};

// Inspections Tab Content (New Structure)
const InspectionsTab: React.FC<InspectionsTabProps> = ({
  workOrder,
  inspectionTemplates,
  loading,
  onRefresh
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [assigning, setAssigning] = useState(false);
  const [availableTemplates, setAvailableTemplates] = useState<any[]>([]);
  const [selectedTemplateDetails, setSelectedTemplateDetails] = useState<InspectionTemplate | null>(null);
  const [loadingTemplate, setLoadingTemplate] = useState(false);

  useEffect(() => {
    fetchAvailableTemplates();
  }, []);

  const fetchAvailableTemplates = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/inspection-templates/templates/available`);
      const result = await response.json();
      console.log("Available Inspection Templates: ", result.data);

      if (result.success && result.data) {
        setAvailableTemplates(result.data);
      }
    } catch (error) {
      console.error('Error fetching available templates:', error);
    }
  };

  // Fetch template details when selected
  const fetchTemplateDetails = async (templateId: string) => {
    if (!templateId) {
      setSelectedTemplateDetails(null);
      return;
    }

    // Find the template in availableTemplates first (since we already have the data)
    const foundTemplate = availableTemplates.find(t => t.id === templateId);
    if (foundTemplate) {
      // Transform the available template data to match InspectionTemplate interface
      const template: InspectionTemplate = {
        id: foundTemplate.id,
        name: foundTemplate.name,
        description: foundTemplate.description,
        category: foundTemplate.category,
        items: foundTemplate.templateItems?.map((item: any) => ({
          id: item.id,
          title: item.name, // API uses 'name', component expects 'title'
          description: item.description || '',
          priority: 'medium' as const, // Default priority since API doesn't provide this
          required: item.isRequired || false,
          status: 'pending' as const,
          notes: '',
          completedAt: undefined,
          category: item.category,
          sortOrder: item.sortOrder,
          allowsNotes: item.allowsNotes
        })) || []
      };
      setSelectedTemplateDetails(template);
      return;
    }

    // Fallback to API call if not found in available templates
    setLoadingTemplate(true);
    try {
      const response = await fetch(`${API_BASE_URL}/inspection-templates/templates/${templateId}`);
      const result = await response.json();

      if (result.success && result.data) {
        // Transform API response to match InspectionTemplate interface
        const template: InspectionTemplate = {
          id: result.data.id,
          name: result.data.name,
          description: result.data.description,
          category: result.data.category,
          items: result.data.templateItems?.map((item: any) => ({
            id: item.id,
            title: item.name,
            description: item.description || '',
            priority: 'medium' as const,
            required: item.isRequired || false,
            status: 'pending' as const,
            notes: '',
            completedAt: undefined,
            category: item.category,
            sortOrder: item.sortOrder,
            allowsNotes: item.allowsNotes
          })) || []
        };
        setSelectedTemplateDetails(template);
      }
    } catch (error) {
      console.error('Error fetching template details:', error);
      setSelectedTemplateDetails(null);
    } finally {
      setLoadingTemplate(false);
    }
  };

  // Handle template selection change
  const handleTemplateChange = async (templateId: string) => {
    setSelectedTemplate(templateId);
    await fetchTemplateDetails(templateId);
  };

  const handleAssignTemplate = async () => {
    if (!selectedTemplate || !workOrder?.id) return;

    setAssigning(true);
    try {
      const response = await fetch(`${API_BASE_URL}/work-orders/assign-template`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workOrderId: workOrder.id,
          templateId: selectedTemplate,
          inspectorId: workOrder.technicianId || '',
          notes: `Inspection assigned to work order ${workOrder.workOrderNumber}`
        })
      });

      const result = await response.json();

      if (result.success) {
        alert('Template assigned successfully!');
        onRefresh();
        setSelectedTemplate('');
        setSelectedTemplateDetails(null);
      } else {
        alert(`Failed to assign template: ${result.error}`);
      }
    } catch (error) {
      console.error('Error assigning template:', error);
      alert('Failed to assign template');
    } finally {
      setAssigning(false);
    }
  };

  const handleStatusChange = async (templateId: string, itemId: string, newStatus: InspectionChecklistItem['status']) => {
    try {
      const statusMap = {
        'pass': 'GREEN',
        'warning': 'YELLOW',
        'fail': 'RED',
        'na': 'GREEN',
        'pending': 'GREEN'
      };

      const response = await fetch(`${API_BASE_URL}/inspection-templates/checklist-items/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: statusMap[newStatus],
          notes: `Status changed to ${newStatus}`
        })
      });

      const result = await response.json();

      if (result.success) {
        onRefresh();
      } else {
        console.error('Failed to update checklist item:', result.error);
      }
    } catch (error) {
      console.error('Error updating checklist item:', error);
    }
  };

  const getStatusClass = (status: InspectionChecklistItem['status']) => `status-${status}`;
  const getPriorityClass = (priority: InspectionChecklistItem['priority']) => `priority-${priority}`;
  const getCategoryClass = (category: string) => `category-${category.toLowerCase()}`;

  if (loading) {
    return (
      <div className="tab-content inspections-tab">
        <div className="tab-header">
          <h3>Inspections</h3>
          <div className="tab-actions">
            <button className="btn btn--primary" disabled>
              <i className="bx bx-plus"></i> Add Inspection
            </button>
          </div>
        </div>
        <div className="loading-state">
          <i className="bx bx-loader-circle bx-spin"></i>
          <p>Loading inspections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-content inspections-tab">
      <div className="tab-header">
        <h3>Inspections</h3>
        <div className="tab-actions">
          <select
            value={selectedTemplate}
            onChange={(e) => handleTemplateChange(e.target.value)}
            className="template-select"
            disabled={assigning}
          >
            <option value="">Select Template</option>
            {availableTemplates.map(template => (
              <option key={template.id} value={template.id}>
                {template.name} ({template.category})
              </option>
            ))}
          </select>
          <button
            className="btn btn--primary"
            onClick={handleAssignTemplate}
            disabled={!selectedTemplate || assigning}
          >
            {assigning ? (
              <>
                <i className="bx bx-loader-circle bx-spin"></i> Assigning...
              </>
            ) : (
              <>
                <i className="bx bx-plus"></i> Assign Template
              </>
            )}
          </button>
          <button className="btn btn--secondary" onClick={onRefresh}>
            <i className="bx bx-refresh"></i> Refresh
          </button>
        </div>
      </div>

      {/* Preview selected template */}
      {loadingTemplate && (
        <div className="loading-state">
          <i className="bx bx-loader-circle bx-spin"></i>
          <p>Loading template...</p>
        </div>
      )}

      {selectedTemplateDetails && !loadingTemplate && (
        <div className="template-preview">
          <div className="template-preview-header">
            <h4>Template Preview: {selectedTemplateDetails.name}</h4>
            <div className="template-meta">
              <span className={`category-badge ${getCategoryClass(selectedTemplateDetails.category || '')}`}>
                {selectedTemplateDetails.category}
              </span>
              <span className="item-count-badge">
                {selectedTemplateDetails.items.length} items
              </span>
            </div>
          </div>
          
          {selectedTemplateDetails.description && (
            <p className="template-description">{selectedTemplateDetails.description}</p>
          )}

          <div className="checklist-section preview">
            {/* <div className="checklist-header">
              <h3>{selectedTemplateDetails.name}</h3>
              <span className="inspection-status">
                Preview - {selectedTemplateDetails.items.length} items
              </span>
            </div> */}
            <div className="checklist-items">
              {selectedTemplateDetails.items
                .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
                .map(item => (
                <div key={item.id} className="checklist-item preview-item">
                  <div className="item-header">
                    <div className="item-info">
                      <h4 className="item-title">
                        {item.title}
                        {item.required && <span className="required-badge">Required</span>}
                        <span className={`priority-badge priority-${item.priority}`}>
                          {item.priority}
                        </span>
                        {item.category && (
                          <span className={`category-badge ${getCategoryClass(item.category)}`}>
                            {item.category}
                          </span>
                        )}
                      </h4>
                      {item.description && (
                        <p className="item-description">{item.description}</p>
                      )}
                      {item.allowsNotes && (
                        <small className="notes-indicator">
                          <i className="bx bx-note"></i> Notes allowed
                        </small>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {inspectionTemplates.length === 0 && !selectedTemplateDetails ? (
        <div className="empty-state" style={{ height: 'auto', alignItems: 'center' }}>
          <i className="bx bx-search-alt"></i>
          <h4>No Inspections Assigned</h4>
          <p>Assign an inspection template to get started with quality checks for this work order.</p>
          {availableTemplates.length > 0 && (
            <div className="available-templates-hint">
              <p><strong>{availableTemplates.length} templates available:</strong></p>
              <div className="template-categories">
                {Array.from(new Set(availableTemplates.map(t => t.category))).map(category => (
                  <span key={category} className={`category-badge ${getCategoryClass(category)}`}>
                    {category} ({availableTemplates.filter(t => t.category === category).length})
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        inspectionTemplates.map(template => (
          <div key={template.id} className="checklist-section">
            <div className="checklist-header">
              <div className="template-info">
                <h3>{template.name}</h3>
                {template.description && (
                  <p className="template-description">{template.description}</p>
                )}
                {template.category && (
                  <span className={`category-badge ${getCategoryClass(template.category)}`}>
                    {template.category}
                  </span>
                )}
              </div>
              <span className="inspection-status">
                {template.items.filter(item => item.status !== 'pending').length} / {template.items.length} completed
              </span>
            </div>
            <div className="checklist-items">
              {template.items
                .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
                .map(item => (
                <div key={item.id} className={`checklist-item ${getStatusClass(item.status)}`}>
                  <div className="item-header">
                    <div className="item-info">
                      <h4 className="item-title">
                        {item.title}
                        {item.required && <span className="required-badge">Required</span>}
                        <span className={`priority-badge ${getPriorityClass(item.priority)}`}>
                          {item.priority}
                        </span>
                        {item.category && (
                          <span className={`category-badge ${getCategoryClass(item.category)}`}>
                            {item.category}
                          </span>
                        )}
                      </h4>
                      {item.description && (
                        <p className="item-description">{item.description}</p>
                      )}
                      {item.allowsNotes && (
                        <small className="notes-indicator">
                          <i className="bx bx-note"></i> Notes allowed
                        </small>
                      )}
                    </div>
                    <div className="item-status">
                      <div className="status-buttons">
                        <button
                          className={`status-btn status-pass ${item.status === 'pass' ? 'active' : ''}`}
                          onClick={() => handleStatusChange(template.id, item.id, 'pass')}
                          title="Pass"
                        >
                          <i className='bx bx-check'></i>
                        </button>
                        <button
                          className={`status-btn status-warning ${item.status === 'warning' ? 'active' : ''}`}
                          onClick={() => handleStatusChange(template.id, item.id, 'warning')}
                          title="Warning"
                        >
                          <i className='bx bx-error'></i>
                        </button>
                        <button
                          className={`status-btn status-fail ${item.status === 'fail' ? 'active' : ''}`}
                          onClick={() => handleStatusChange(template.id, item.id, 'fail')}
                          title="Fail"
                        >
                          <i className='bx bx-x'></i>
                        </button>
                        <button
                          className={`status-btn status-na ${item.status === 'na' ? 'active' : ''}`}
                          onClick={() => handleStatusChange(template.id, item.id, 'na')}
                          title="Not Applicable"
                        >
                          <i className='bx bx-minus'></i>
                        </button>
                      </div>
                    </div>
                  </div>
                  {item.notes && (
                    <div className="item-notes">
                      <strong>Notes:</strong> {item.notes}
                    </div>
                  )}
                  {item.completedAt && (
                    <div className="item-completion">
                      <small>Completed: {new Date(item.completedAt).toLocaleString()}</small>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

// Main Modal Component
const ManageWorkOrderModal: React.FC<ManageWorkOrderModalProps> = ({ open, onClose, workOrder }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [notes, setNotes] = useState('');
  const [inspectionTemplates, setInspectionTemplates] = useState<InspectionTemplate[]>([]);
  const [loadingInspections, setLoadingInspections] = useState(false);

  const fetchWorkOrderInspections = async () => {
    if (!workOrder?.id) return;

    setLoadingInspections(true);
    try {
      const response = await fetch(`${API_BASE_URL}/inspection-templates/work-orders/${workOrder.id}/inspections`);
      const result = await response.json();

      if (result.success && result.data) {
        // Transform API response to match the InspectionTemplate interface
        const templates = result.data.map((inspection: any) => ({
          id: inspection.id,
          name: inspection.template?.name || 'Custom Inspection',
          items: inspection.checklistItems?.map((item: any) => ({
            id: item.id,
            title: item.item,
            description: item.templateItem?.description || '',
            priority: 'medium' as const,
            required: item.templateItem?.isRequired || false,
            status: mapChecklistStatus(item.status),
            notes: item.notes || '',
            completedAt: item.createdAt
          })) || []
        }));
        setInspectionTemplates(templates);
      } else {
        setInspectionTemplates([]);
      }
    } catch (error) {
      console.error('Error fetching inspections:', error);
      setInspectionTemplates([]);
    } finally {
      setLoadingInspections(false);
    }
  };

  const mapChecklistStatus = (status: string): InspectionChecklistItem['status'] => {
    switch (status) {
      case 'GREEN': return 'pass';
      case 'YELLOW': return 'warning';
      case 'RED': return 'fail';
      default: return 'pending';
    }
  };

  if (!open) return null;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab workOrder={workOrder} />;
      case 'services':
        return <ServicesTab workOrder={workOrder} />;
      case 'parts':
        return <PartsTab workOrder={workOrder} />;
      case 'inspections':
        return <InspectionsTab
          workOrder={workOrder}
          inspectionTemplates={inspectionTemplates}
          loading={loadingInspections}
          onRefresh={fetchWorkOrderInspections}
        />;
      case 'notes':
        return <NotesTabContent notes={notes} onNotesChange={setNotes} workOrder={workOrder} />;
      default:
        return <OverviewTab workOrder={workOrder} />;
    }
  };

  return (
    <div className="manage-workorder-modal__overlay" onClick={onClose}>
      <div className="manage-workorder-modal" onClick={e => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title">
            <h2>Work Order #{workOrder.workOrderNumber}</h2>
            <p className="modal-subtitle">Managing work order for {workOrder.customer.name}'s {workOrder.vehicle?.make || ''} {workOrder.vehicle?.model || ''} {workOrder.vehicle?.year || ''}</p>
          </div>
          <button className="close-btn" onClick={onClose} title="Close">
            <i className="bx bx-x"></i>
          </button>
        </div>

        {/* Tab Navigation */}
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Modal Body */}
        <div className="modal-body">
          {/* Main Content Area */}
          <div className="main-content">
            {renderTabContent()}
          </div>

          {/* Sidebar - Only shown in Overview tab */}
          {activeTab === 'overview' && <Sidebar workOrder={workOrder} />}
        </div>
      </div>
    </div>
  );
};

export default ManageWorkOrderModal;