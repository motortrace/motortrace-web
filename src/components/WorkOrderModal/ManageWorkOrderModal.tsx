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
}

interface PartItem {
  id: string;
  name: string;
  image: string;
  description: string;
  qty: number;
  price: number;
  supplier: string;
}

interface ManageWorkOrderModalProps {
  open: boolean;
  onClose: () => void;
  workOrder?: any; // Accept workOrder, type as any for now (can refine later)
}

// Accordion Info Component
const AccordionInfoSection: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('customer');

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? '' : section);
  };

  return (
    <div className="accordion-info-section">
      {/* Customer Information Accordion */}
      <div className="accordion-item">
        <div 
          className={`accordion-header ${activeSection === 'customer' ? 'active' : ''}`}
          onClick={() => toggleSection('customer')}
        >
          <div className="accordion-header-content">
            <div className="accordion-icon customer-icon">
              <i className="bx bx-user"></i>
            </div>
            <div className="accordion-title">
              <h4>Customer Information</h4>
              <span className="accordion-subtitle">John Anderson • Gold Member</span>
            </div>
          </div>
          <div className="accordion-toggle">
            <i className={`bx ${activeSection === 'customer' ? 'bx-chevron-up' : 'bx-chevron-down'}`}></i>
          </div>
        </div>
        <div className={`accordion-content ${activeSection === 'customer' ? 'expanded' : ''}`}>
          <div className="accordion-content-inner">
            <div className="info-grid">
              <div className="info-item">
                <div className="info-item-header">
                  <i className="bx bx-user-circle"></i>
                  <span className="info-label">Full Name</span>
                </div>
                <span className="info-value">John Anderson</span>
              </div>
              <div className="info-item">
                <div className="info-item-header">
                  <i className="bx bx-phone"></i>
                  <span className="info-label">Phone</span>
                </div>
                <span className="info-value">(555) 123-4567</span>
              </div>
              <div className="info-item">
                <div className="info-item-header">
                  <i className="bx bx-envelope"></i>
                  <span className="info-label">Email</span>
                </div>
                <span className="info-value">john.anderson@email.com</span>
              </div>
              <div className="info-item">
                <div className="info-item-header">
                  <i className="bx bx-map"></i>
                  <span className="info-label">Address</span>
                </div>
                <span className="info-value">123 Main St, Anytown, ST 12345</span>
              </div>
              <div className="info-item">
                <div className="info-item-header">
                  <i className="bx bx-calendar"></i>
                  <span className="info-label">Customer Since</span>
                </div>
                <span className="info-value">March 2020</span>
              </div>
              <div className="info-item">
                <div className="info-item-header">
                  <i className="bx bx-crown"></i>
                  <span className="info-label">Loyalty Status</span>
                </div>
                <span className="status-badge status-badge--gold">Gold Member</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicle Information Accordion */}
      <div className="accordion-item">
        <div 
          className={`accordion-header ${activeSection === 'vehicle' ? 'active' : ''}`}
          onClick={() => toggleSection('vehicle')}
        >
          <div className="accordion-header-content">
            <div className="accordion-icon vehicle-icon">
              <i className="bx bx-car"></i>
            </div>
            <div className="accordion-title">
              <h4>Vehicle Information</h4>
              <span className="accordion-subtitle">2022 Toyota Camry • ABC-1234</span>
            </div>
          </div>
          <div className="accordion-toggle">
            <i className={`bx ${activeSection === 'vehicle' ? 'bx-chevron-up' : 'bx-chevron-down'}`}></i>
          </div>
        </div>
        <div className={`accordion-content ${activeSection === 'vehicle' ? 'expanded' : ''}`}>
          <div className="accordion-content-inner">
            <div className="vehicle-header">
              <div className="vehicle-image-container">
                <img 
                  src="https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg?auto=compress&w=400" 
                  alt="Vehicle" 
                  className="vehicle-image"
                />
              </div>
              <div className="vehicle-quick-info">
                <h5>2022 Toyota Camry</h5>
                <p className="vehicle-details">Silver Metallic • 47,850 miles</p>
                <div className="vehicle-badges">
                  <span className="vehicle-badge">Regular Service</span>
                  <span className="vehicle-badge">No Recalls</span>
                </div>
              </div>
            </div>
            <div className="info-grid">
              <div className="info-item">
                <div className="info-item-header">
                  <i className="bx bx-car"></i>
                  <span className="info-label">Make/Model</span>
                </div>
                <span className="info-value">2022 Toyota Camry</span>
              </div>
              <div className="info-item">
                <div className="info-item-header">
                  <i className="bx bx-barcode"></i>
                  <span className="info-label">VIN</span>
                </div>
                <span className="info-value">1HGCM82633A123456</span>
              </div>
              <div className="info-item">
                <div className="info-item-header">
                  <i className="bx bx-id-card"></i>
                  <span className="info-label">License Plate</span>
                </div>
                <span className="info-value">ABC-1234</span>
              </div>
              <div className="info-item">
                <div className="info-item-header">
                  <i className="bx bx-tachometer"></i>
                  <span className="info-label">Mileage</span>
                </div>
                <span className="info-value">47,850 miles</span>
              </div>
              <div className="info-item">
                <div className="info-item-header">
                  <i className="bx bx-palette"></i>
                  <span className="info-label">Color</span>
                </div>
                <span className="info-value">Silver Metallic</span>
              </div>
              <div className="info-item">
                <div className="info-item-header">
                  <i className="bx bx-package"></i>
                  <span className="info-label">Personal Items</span>
                </div>
                <span className="info-value">Umbrella, Sunglasses</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Job Details Accordion */}
      <div className="accordion-item">
        <div 
          className={`accordion-header ${activeSection === 'job' ? 'active' : ''}`}
          onClick={() => toggleSection('job')}
        >
          <div className="accordion-header-content">
            <div className="accordion-icon job-icon">
              <i className="bx bx-clipboard"></i>
            </div>
            <div className="accordion-title">
              <h4>Job Details</h4>
              <span className="accordion-subtitle">WO-2024-001257 • Medium Priority</span>
            </div>
          </div>
          <div className="accordion-toggle">
            <i className={`bx ${activeSection === 'job' ? 'bx-chevron-up' : 'bx-chevron-down'}`}></i>
          </div>
        </div>
        <div className={`accordion-content ${activeSection === 'job' ? 'expanded' : ''}`}>
          <div className="accordion-content-inner">
            <div className="job-header">
              <div className="job-status-overview">
                <div className="job-progress">
                  <div className="job-progress-bar">
                    <div className="job-progress-fill" style={{ width: '65%' }}></div>
                  </div>
                  <span className="job-progress-text">65% Complete</span>
                </div>
                <div className="job-timeline">
                  <div className="timeline-item">
                    <span className="timeline-label">Started:</span>
                    <span className="timeline-value">July 1, 2024 at 9:00 AM</span>
                  </div>
                  <div className="timeline-item">
                    <span className="timeline-label">Est. Completion:</span>
                    <span className="timeline-value">July 2, 2024 at 3:00 PM</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="info-grid">
              <div className="info-item">
                <div className="info-item-header">
                  <i className="bx bx-hash"></i>
                  <span className="info-label">Work Order #</span>
                </div>
                <span className="info-value">WO-2024-001257</span>
              </div>
              <div className="info-item">
                <div className="info-item-header">
                  <i className="bx bx-user-plus"></i>
                  <span className="info-label">Created By</span>
                </div>
                <span className="info-value">Amber Miller</span>
              </div>
              <div className="info-item">
                <div className="info-item-header">
                  <i className="bx bx-wrench"></i>
                  <span className="info-label">Assigned Tech</span>
                </div>
                <span className="info-value">Mike Smith</span>
              </div>
              <div className="info-item">
                <div className="info-item-header">
                  <i className="bx bx-time"></i>
                  <span className="info-label">Vehicle Arrival</span>
                </div>
                <span className="info-value">July 1, 2024 at 9:00 AM</span>
              </div>
              <div className="info-item">
                <div className="info-item-header">
                  <i className="bx bx-flag"></i>
                  <span className="info-label">Priority</span>
                </div>
                <span className="priority-badge priority-badge--medium">Medium</span>
              </div>
              <div className="info-item">
                <div className="info-item-header">
                  <i className="bx bx-calendar-check"></i>
                  <span className="info-label">Est. Completion</span>
                </div>
                <span className="info-value">July 2, 2024 at 3:00 PM</span>
              </div>
            </div>
            <div className="job-details-sections">
              <div className="job-section">
                <div className="job-section-header">
                  <i className="bx bx-message-detail"></i>
                  <span className="job-section-title">Customer Complaint</span>
                </div>
                <div className="job-section-content">
                  <p>"Brakes squeaking when coming to a stop, especially in the morning. Also noticed steering wheel vibrates slightly when braking at high speeds. Please inspect and replace if needed."</p>
                </div>
              </div>
              <div className="job-section">
                <div className="job-section-header">
                  <i className="bx bx-note"></i>
                  <span className="job-section-title">Service Advisor Notes</span>
                </div>
                <div className="job-section-content">
                  <p>Customer mentioned noise started about 2 weeks ago. No warning lights on dashboard. Last brake service was 18 months ago.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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
  },
  {
    id: 'part-2',
    name: 'Oil Filter',
    image: 'https://dmaxstore.com/cdn/shop/products/PPE_20LM2_20oil_20filter-1.jpg?v=1744399263',
    description: 'High-efficiency oil filter',
    qty: 1,
    price: 15.0,
    supplier: 'NAPA',
  },
];

const ManageWorkOrderModal: React.FC<ManageWorkOrderModalProps> = ({ open, onClose, workOrder }) => {
  const [notes, setNotes] = useState('');

  if (!open) return null;

  // Calculate totals
  const subtotal = mockServices.reduce((sum, s) => sum + s.price * s.qty, 0);
  const totalDiscount = mockServices.reduce((sum, s) => sum + s.discount, 0);
  const totalTax = mockServices.reduce((sum, s) => sum + s.tax, 0);
  const total = subtotal - totalDiscount + totalTax;

  return (
    <div className="manage-workorder-modal__overlay" onClick={onClose}>
      <div className="manage-workorder-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Manage Work Order</h2>
          <button className="close-btn" onClick={onClose} title="Close">
            <i className="bx bx-x"></i>
          </button>
        </div>
        <div className="modal-content">
          <div className="modal-section modal-section--info">
            <AccordionInfoSection />
          </div>

          <div className="modal-section modal-section--services">
            <div className="section-header">
              <h3>Services & Packages</h3>
              <div className="section-actions">
                <button className="btn btn--primary"><i className="bx bx-plus"></i> Add Service</button>
                <button className="btn btn--secondary"><i className="bx bx-package"></i> Add Package</button>
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
                    <th>Technician</th>
                    <th>Type</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockServices.map(service => (
                    <tr key={service.id}>
                      <td>{service.name}</td>
                      <td>{service.description}</td>
                      <td>LKR {service.price.toFixed(2)}</td>
                      <td>{service.qty} / {service.hours}h</td>
                      <td>LKR {service.discount.toFixed(2)}</td>
                      <td>LKR {service.tax.toFixed(2)}</td>
                      <td>{service.status}</td>
                      <td>
                        {service.technician && (
                          <span className="tech-avatar">
                            <img src={service.technician.avatar} alt={service.technician.name} />
                            <span>{service.technician.name}</span>
                          </span>
                        )}
                      </td>
                      <td>{service.type === 'package' ? 'Package' : 'Service'}</td>
                      <td>
                        <button className="btn-icon" title="Edit"><i className="bx bx-edit"></i></button>
                        <button className="btn-icon btn-danger" title="Remove"><i className="bx bx-trash"></i></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="services-bill-summary">
              <div className="bill-row"><span>Subtotal:</span><span>LKR {subtotal.toFixed(2)}</span></div>
              <div className="bill-row"><span>Total Discount:</span><span>-LKR {totalDiscount.toFixed(2)}</span></div>
              <div className="bill-row"><span>Total Tax:</span><span>LKR {totalTax.toFixed(2)}</span></div>
              <div className="bill-row bill-row--total"><span>Total:</span><span>LKR {total.toFixed(2)}</span></div>
            </div>
          </div>

          <div className="modal-section modal-section--parts">
            <div className="section-header">
              <h3>Parts</h3>
              <div className="section-actions">
                <button className="btn btn--primary"><i className="bx bx-plus"></i> Add Part</button>
              </div>
            </div>
            <div className="parts-cards-container">
              {mockParts.map(part => (
                <div className="part-card" key={part.id}>
                  <img src={part.image} alt={part.name} className="part-image" />
                  <div className="part-info">
                    <div className="part-name">{part.name}</div>
                    <div className="part-desc">{part.description}</div>
                    <div className="part-supplier">Supplier: {part.supplier}</div>
                    <div className="part-qty">Qty: {part.qty}</div>
                    <div className="part-price">LKR {part.price.toFixed(2)}</div>
                  </div>
                  <div className="part-actions">
                    <button className="btn-icon" title="Edit"><i className="bx bx-edit"></i></button>
                    <button className="btn-icon btn-danger" title="Remove"><i className="bx bx-trash"></i></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="modal-section modal-section--links">
            <div className="section-header">
              <h3>Linked Items</h3>
            </div>
            <div className="linked-items-row">
              <div className="linked-item">
                <span className="linked-label">Digital Inspection</span>
                <button className="btn btn--secondary">Link Inspection</button>
              </div>
              <div className="linked-item">
                <span className="linked-label">Appointment Details</span>
                <button className="btn btn--secondary">Link Appointment</button>
              </div>
            </div>
          </div>

          <div className="modal-section modal-section--notes">
            <div className="section-header">
              <h3>Notes</h3>
            </div>
            <NotesTab notes={notes} onNotesChange={setNotes} />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn--secondary">Generate Estimate</button>
          <button className="btn btn--primary">Generate Invoice</button>
        </div>
      </div>
    </div>
  );
};

export default ManageWorkOrderModal;