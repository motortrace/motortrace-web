import React, { useState } from 'react';
import { CustomerInfoCard } from '../../pages/ServiceCenter/JobCard/CustomerInfoCard';
import VehicleInfoCard from '../../pages/ServiceCenter/JobCard/VehicleInfoCard';
import JobDetailsCard from '../../pages/ServiceCenter/JobCard/JobDetailsCard';
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
  // Add more props as needed
}

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
    image: 'https://images.pexels.com/photos/159238/car-vehicle-technology-drive-159238.jpeg?auto=compress&w=100&h=100',
    description: 'Premium ceramic brake pad set',
    qty: 1,
    price: 120.0,
    supplier: 'AutoZone',
  },
  {
    id: 'part-2',
    name: 'Oil Filter',
    image: 'https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg?auto=compress&w=100&h=100',
    description: 'High-efficiency oil filter',
    qty: 1,
    price: 15.0,
    supplier: 'NAPA',
  },
];

const ManageWorkOrderModal: React.FC<ManageWorkOrderModalProps> = ({ open, onClose }) => {
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
            <div className="info-columns">
              <CustomerInfoCard />
              <VehicleInfoCard 
                vehicleImageUrl="https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg?auto=compress&w=400"
                model="2022 Toyota Camry"
                vin="1HGCM82633A123456"
                mileage="47,850"
                personalItems="Umbrella, Sunglasses"
              />
              <JobDetailsCard 
                createdBy="Amber Miller"
                assignedTech="Mike Smith"
                vehicleArrival="2024-07-01 09:00"
                customerComplaint="Brakes squeaking, please inspect and replace if needed."
              />
            </div>
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
                      <td>${service.price.toFixed(2)}</td>
                      <td>{service.qty} / {service.hours}h</td>
                      <td>${service.discount.toFixed(2)}</td>
                      <td>${service.tax.toFixed(2)}</td>
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
              <div className="bill-row"><span>Subtotal:</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="bill-row"><span>Total Discount:</span><span>-${totalDiscount.toFixed(2)}</span></div>
              <div className="bill-row"><span>Total Tax:</span><span>${totalTax.toFixed(2)}</span></div>
              <div className="bill-row bill-row--total"><span>Total:</span><span>${total.toFixed(2)}</span></div>
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
                    <div className="part-price">${part.price.toFixed(2)}</div>
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