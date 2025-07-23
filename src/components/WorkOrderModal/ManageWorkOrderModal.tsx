import React, { useState } from 'react';
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

interface PartItem {
  id:string;
  name: string;
  image: string;
  description: string;
  qty: number;
  price: number;
  supplier: string;
  source: 'ordered' | 'inventory' | 'customer';
}

// Inspection-related types based on InspectionModal
interface InspectionChecklistItem {
    id: string;
    title: string;
    description?: string;
    priority: 'critical' | 'high' | 'medium' | 'low';
    required: boolean;
    status: 'pass' | 'fail' | 'warning' | 'na' | 'pending';
    notes?: string;
    completedAt?: string;
}

interface InspectionTemplate {
    id: string;
    name: string;
    items: InspectionChecklistItem[];
}

interface ManageWorkOrderModalProps {
  open: boolean;
  onClose: () => void;
  workOrder?: any;
}

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
const Sidebar: React.FC = () => {
  const mockWorkOrderStatus = 'Estimation';
  const estimateSent = false;
  // New mock data for demonstration
  const workOrderId = 'WO-2024-001257';
  const createdDate = 'June 30, 2024';
  const businessLocation = 'Downtown Service Center';

  // Timeline mock data
  const timelineEvents = [
    { label: 'Appointment Booked', date: 'June 25, 2024, 10:00 AM' },
    { label: 'Scheduled Date', date: 'July 1, 2024, 9:00 AM' },
    { label: 'Work Order Created', date: 'June 30, 2024, 4:30 PM' },
    { label: 'Inspection Report Sent', date: 'July 1, 2024, 11:00 AM' },
    { label: 'Estimate Sent', date: 'July 1, 2024, 12:00 PM' },
    { label: 'Estimate Finalized', date: 'July 1, 2024, 2:00 PM' },
    { label: 'Invoice Created', date: 'July 1, 2024, 2:30 PM' },
    { label: 'Payment Made', date: 'July 1, 2024, 3:00 PM' },
  ];

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
              <span className="workorder-label">ID:</span>
              <span className="workorder-value">{workOrderId}</span>
            </div>
            <div className="workorder-row">
              <span className="workorder-label">Created:</span>
              <span className="workorder-value">{createdDate}</span>
            </div>
            <div className="workorder-row">
              <span className="workorder-label">Location:</span>
              <span className="workorder-value">{businessLocation}</span>
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
            <span className={`status-badge status-badge--${mockWorkOrderStatus.toLowerCase().replace(/ /g, '-')}`}>{mockWorkOrderStatus}</span>
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
              <div className="customer-name">John Anderson</div>
              <div className="customer-contact">
                <div className="contact-item">
                  <i className="bx bx-phone"></i>
                  <span>(555) 123-4567</span>
                </div>
                <div className="contact-item">
                  <i className="bx bx-envelope"></i>
                  <span>john.anderson@email.com</span>
                </div>
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
              <div className="vehicle-name">2022 Toyota Camry</div>
              <div className="vehicle-plate">ABC-1234</div>
              <div className="vehicle-specs">
                <div className="spec-item">
                  <span className="spec-label">VIN:</span>
                  <span className="spec-value">1HGCM82633A123456</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Mileage:</span>
                  <span className="spec-value">47,850 miles</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Color:</span>
                  <span className="spec-value">Silver Metallic</span>
                </div>
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
                <div className="progress-fill" style={{ width: '65%' }}></div>
              </div>
              <span className="progress-text">65% Complete</span>
            </div>
            <div className="timeline-info">
              <div className="timeline-item">
                <span className="timeline-label">Started</span>
                <span className="timeline-value">July 1, 2024</span>
              </div>
              <div className="timeline-item">
                <span className="timeline-label">Est. Completion</span>
                <span className="timeline-value">July 2, 2024</span>
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
            <div className="assignment-item">
              <span className="assignment-label">Technician</span>
              <div className="tech-assignment">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Mike Smith" />
                <span>Mike Smith</span>
              </div>
            </div>
            <div className="assignment-item">
              <span className="assignment-label">Created By</span>
              <span className="assignment-value">Amber Miller</span>
            </div>
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
const OverviewTab: React.FC = () => {
  return (
    <div className="tab-content overview-tab">
      <div className="overview-grid">
        <div className="overview-card">
          <div className="overview-card-header">
            <i className="bx bx-message-detail"></i>
            <h4>Customer Complaint</h4>
          </div>
          <div className="overview-card-content">
            <p>"Brakes squeaking when coming to a stop, especially in the morning. Also noticed steering wheel vibrates slightly when braking at high speeds. Please inspect and replace if needed."</p>
          </div>
        </div>

        <div className="overview-card">
          <div className="overview-card-header">
            <i className="bx bx-note"></i>
            <h4>Service Advisor Notes</h4>
          </div>
          <div className="overview-card-content">
            <p>Customer mentioned noise started about 2 weeks ago. No warning lights on dashboard. Last brake service was 18 months ago.</p>
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
                <span className="detail-label">Work Order #</span>
                <span className="detail-value">WO-2024-001257</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Priority</span>
                <span className="priority-badge priority-badge--medium">Medium</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Vehicle Arrival</span>
                <span className="detail-value">July 1, 2024 at 9:00 AM</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Personal Items</span>
                <span className="detail-value">Umbrella, Sunglasses</span>
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

const sourceColors: Record<PartItem['source'], string> = {
  ordered: '#007bff',
  inventory: '#ff9800',
  customer: '#28a745',
};

// Services Tab Content
const ServicesTab: React.FC = () => {
  const subtotal = mockServices.reduce((sum, s) => sum + s.price * s.qty, 0);
  const totalDiscount = mockServices.reduce((sum, s) => sum + s.discount, 0);
  const totalTax = mockServices.reduce((sum, s) => sum + s.tax, 0);
  const total = subtotal - totalDiscount + totalTax;

  const packages = mockServices.filter(s => s.type === 'package');
  const services = mockServices.filter(s => s.type === 'service');

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
            {packages.map(pkg => (
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
            ))}
            {/* List all services as single rows */}
            {services.map(service => (
              <tr key={service.id} className="service-in-package-row">
                <td className="service-name">{service.name}</td>
                <td>{service.description}</td>
                <td>LKR {service.price.toFixed(2)}</td>
                <td>{service.qty} / {service.hours}h</td>
                <td>LKR {service.discount.toFixed(2)}</td>
                <td>LKR {service.tax.toFixed(2)}</td>
                <td>
                  <span className={`status-badge--custom status-badge--${service.customerAccepted === false ? 'declined' : (service.status.toLowerCase().replace(/ /g, '-') || 'default')}`}> 
                    {service.customerAccepted === false ? 'Declined' : service.status}
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
          <span>-LKR {totalDiscount.toFixed(2)}</span>
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
const PartsTab: React.FC = () => {
  const [parts, setParts] = useState<PartItem[]>(mockParts);

  const handleSourceChange = (id: string, newSource: PartItem['source']) => {
    setParts(prev => prev.map(part => part.id === id ? { ...part, source: newSource } : part));
  };

  const handleRemove = (id: string) => {
    setParts(prev => prev.filter(part => part.id !== id));
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
            {parts.map(part => (
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
const NotesTabContent: React.FC<{ notes: string; onNotesChange: (notes: string) => void }> = ({ 
  notes, 
  onNotesChange 
}) => {
  return (
    <div className="tab-content notes-tab">
      <div className="tab-header">
        <h3>Notes</h3>
      </div>
      <NotesTab notes={notes} onNotesChange={onNotesChange} />
    </div>
  );
};

// Dummy data for inspections (new structure)
const mockInspectionTemplates: InspectionTemplate[] = [
  {
    id: 'insp-1',
    name: 'Standard Brake Inspection',
    items: [
      { id: 'item-1-1', title: 'Check Front Brake Pad Thickness', description: 'Measure pad thickness and compare to manufacturer specifications.', priority: 'critical', required: true, status: 'pass', notes: 'Pads at 8mm, well above minimum.', completedAt: '2024-07-01T10:30:00Z' },
      { id: 'item-1-2', title: 'Check Rear Brake Pad Thickness', description: 'Measure pad thickness and compare to manufacturer specifications.', priority: 'critical', required: true, status: 'warning', notes: 'Pads at 4mm, nearing replacement recommendation.', completedAt: '2024-07-01T10:32:00Z' },
      { id: 'item-1-3', title: 'Inspect Rotors for Scoring or Warping', description: 'Visually and mechanically check rotor surfaces for damage.', priority: 'high', required: true, status: 'fail', notes: 'Front rotors show significant scoring. Recommend replacement.', completedAt: '2024-07-01T10:35:00Z' },
      { id: 'item-1-4', title: 'Inspect Brake Fluid Level and Condition', priority: 'medium', required: true, status: 'pass', completedAt: '2024-07-01T10:36:00Z' },
      { id: 'item-1-5', title: 'Check for Brake Fluid Leaks', description: 'Inspect lines, calipers, and master cylinder for any signs of leakage.', priority: 'high', required: true, status: 'pending' },
    ],
  },
  {
    id: 'insp-2',
    name: 'Comprehensive Fluid Check',
    items: [
      { id: 'item-2-1', title: 'Engine Oil Level and Condition', priority: 'high', required: true, status: 'pass', completedAt: '2024-07-01T11:05:00Z' },
      { id: 'item-2-2', title: 'Coolant Level and Condition', priority: 'medium', required: true, status: 'na' },
      { id: 'item-2-3', title: 'Transmission Fluid Level', priority: 'low', required: false, status: 'pending' },
    ],
  },
];

// Inspections Tab Content (New Structure)
const InspectionsTab: React.FC = () => {
    const [inspections, setInspections] = useState<InspectionTemplate[]>(mockInspectionTemplates);

    const handleStatusChange = (templateId: string, itemId: string, newStatus: InspectionChecklistItem['status']) => {
        setInspections(prevInspections =>
            prevInspections.map(template => {
                if (template.id === templateId) {
                    return {
                        ...template,
                        items: template.items.map(item =>
                            item.id === itemId
                                ? { ...item, status: newStatus, completedAt: new Date().toISOString() }
                                : item
                        ),
                    };
                }
                return template;
            })
        );
    };

    const getStatusClass = (status: InspectionChecklistItem['status']) => `status-${status}`;
    const getPriorityClass = (priority: InspectionChecklistItem['priority']) => `priority-${priority}`;

    return (
        <div className="tab-content inspections-tab">
            <div className="tab-header">
                <h3>Inspections</h3>
                <div className="tab-actions">
                    <button className="btn btn--primary">
                        <i className="bx bx-plus"></i> Add Inspection
                    </button>
                </div>
            </div>

            {inspections.map(template => (
                <div key={template.id} className="checklist-section">
                    <h3>{template.name}</h3>
                    <div className="checklist-items">
                        {template.items.map(item => (
                            <div key={item.id} className={`checklist-item ${getStatusClass(item.status)}`}>
                                <div className="item-header">
                                    <div className="item-info">
                                        <h4 className="item-title">
                                            {item.title}
                                            {item.required && <span className="required-badge">Required</span>}
                                            <span className={`priority-badge ${getPriorityClass(item.priority)}`}>
                                                {item.priority}
                                            </span>
                                        </h4>
                                        {item.description && (
                                            <p className="item-description">{item.description}</p>
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
            ))}
        </div>
    );
};

// Main Modal Component
const ManageWorkOrderModal: React.FC<ManageWorkOrderModalProps> = ({ open, onClose, workOrder }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [notes, setNotes] = useState('');

  if (!open) return null;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'services':
        return <ServicesTab />;
      case 'parts':
        return <PartsTab />;
      case 'inspections':
        return <InspectionsTab />;
      case 'notes':
        return <NotesTabContent notes={notes} onNotesChange={setNotes} />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className="manage-workorder-modal__overlay" onClick={onClose}>
      <div className="manage-workorder-modal" onClick={e => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title">
            <h2>Work Order #WO-2024-001257</h2>
            <p className="modal-subtitle">Managing work order for John Anderson's 2022 Toyota Camry</p>
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

          {/* Sidebar */}
          <Sidebar />
        </div>
      </div>
    </div>
  );
};

export default ManageWorkOrderModal;