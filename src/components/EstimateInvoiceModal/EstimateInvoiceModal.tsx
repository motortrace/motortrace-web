import React from 'react';
import './EstimateInvoiceModal.scss';

// Customer info type for this modal only
interface CustomerInfo {
  imageUrl: string;
  name: string;
  type: string;
  company?: string;
  phone: string;
  email: string;
  address?: string;
  registeredAt?: string;
  tags?: string[];
}

// Vehicle info interface
interface VehicleInfo {
  imageUrl: string;
  year: number;
  make: string;
  model: string;
  trim?: string;
  vin: string;
  licensePlate: string;
  mileage: string;
  color: string;
  engine?: string;
  transmission?: string;
  personalItems?: string;
}

interface Technician {
  id: string;
  name: string;
  avatar: string;
}

interface ServiceLine {
  id: string;
  name: string;
  description: string;
  qty: number;
  hours?: number;
  rate: number;
  discount: number;
  tax: number;
  lineTotal: number;
  technician?: Technician;
  type: 'service' | 'package';
}

interface PartLine {
  id: string;
  name: string;
  description: string;
  qty: number;
  unitPrice: number;
  lineTotal: number;
  supplier: string;
  partNumber?: string;
  warranty?: string;
}

interface InspectionLine {
  id: string;
  name: string;
  result: string;
  charge: number;
  notes?: string;
}

interface AppointmentLine {
  id: string;
  date: string;
  time: string;
  service: string;
  charge: number;
  status: string;
}

interface EstimateInvoiceModalProps {
  open: boolean;
  onClose: () => void;
  // Add more props as needed
}

const mockCustomer: CustomerInfo = {
  imageUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
  name: 'Amber Miller',
  type: 'VIP',
  company: 'Amber Logistics LLC',
  phone: '(555) 123-4567',
  email: 'amber.miller@email.com',
  address: '123 Main St, Springfield, IL 62704',
  registeredAt: '2021-03-15',
  tags: ['loyalty', 'fleet', 'VIP'],
};

const mockVehicle: VehicleInfo = {
  imageUrl: 'https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg?auto=compress&w=400',
  year: 2022,
  make: 'Toyota',
  model: 'Camry',
  trim: 'LE',
  vin: '1HGCM82633A123456',
  licensePlate: 'ABC-1234',
  mileage: '47,850',
  color: 'Silver',
  engine: '2.5L I4',
  transmission: 'CVT',
  personalItems: 'Umbrella, Sunglasses, Phone Charger',
};

const mockServices: ServiceLine[] = [
  {
    id: 'svc-1',
    name: 'Brake Pad Replacement',
    description: 'Replace front brake pads with premium ceramic pads',
    qty: 1,
    hours: 1.5,
    rate: 189.99,
    discount: 10,
    tax: 15,
    lineTotal: 194.99,
    technician: { id: 'tech-1', name: 'Mike Smith', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
    type: 'service',
  },
  {
    id: 'pkg-1',
    name: 'Oil Change Package',
    description: 'Full synthetic oil change + filter',
    qty: 1,
    hours: 0.5,
    rate: 89.99,
    discount: 0,
    tax: 8,
    lineTotal: 97.99,
    technician: { id: 'tech-2', name: 'Sara Lee', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
    type: 'package',
  },
];

const mockParts: PartLine[] = [
  {
    id: 'part-1',
    name: 'Ceramic Brake Pads',
    description: 'Premium ceramic brake pad set',
    qty: 1,
    unitPrice: 120.0,
    lineTotal: 120.0,
    supplier: 'AutoZone',
    partNumber: 'BRK-PAD-001',
    warranty: '12 months',
  },
  {
    id: 'part-2',
    name: 'Oil Filter',
    description: 'High-efficiency oil filter',
    qty: 1,
    unitPrice: 15.0,
    lineTotal: 15.0,
    supplier: 'NAPA',
    partNumber: 'OF-4521',
    warranty: '6 months',
  },
];

const mockInspections: InspectionLine[] = [
  { id: 'insp-1', name: 'Brake Inspection', result: 'Passed', charge: 0, notes: 'All components within specifications' },
  { id: 'insp-2', name: 'Multi-Point Inspection', result: 'See Report', charge: 25, notes: 'Detailed report attached' },
];

const mockAppointments: AppointmentLine[] = [
  { id: 'appt-1', date: '2024-07-01', time: '09:00', service: 'Brake Service', charge: 0, status: 'Completed' },
  { id: 'appt-2', date: '2024-07-15', time: '14:00', service: 'Follow-up Inspection', charge: 0, status: 'Scheduled' },
];

const shopInfo = {
  name: 'MotorTrace Auto Repair',
  logo: '/public/vite.svg',
  address: '456 Repair Ave, Springfield, IL 62704',
  phone: '(555) 987-6543',
  email: 'info@motortrace.com',
  website: 'www.motortrace.com',
  license: 'ASE-123456',
};

const docType = 'Invoice'; // or 'Estimate'
const docNumber = 'INV-2024-001';
const docStatus = 'Paid';
const docDate = '2024-07-01';
const dueDate = '2024-07-15';
const workOrderNumber = 'WO-2024-001';

const subtotal = mockServices.reduce((sum, s) => sum + s.lineTotal, 0) + mockParts.reduce((sum, p) => sum + p.lineTotal, 0);
const totalDiscount = mockServices.reduce((sum, s) => sum + s.discount, 0);
const totalTax = mockServices.reduce((sum, s) => sum + s.tax, 0);
const inspectionsTotal = mockInspections.reduce((sum, i) => sum + i.charge, 0);
const appointmentsTotal = mockAppointments.reduce((sum, a) => sum + a.charge, 0);
const grandTotal = subtotal + totalTax + inspectionsTotal + appointmentsTotal - totalDiscount;
const payments = 500; // mock
const balanceDue = grandTotal - payments;

const EstimateInvoiceModal: React.FC<EstimateInvoiceModalProps> = ({ open, onClose }) => {
  if (!open) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // PDF download logic here
    console.log('Download PDF');
  };

  const handleEmail = () => {
    // Email logic here
    console.log('Email invoice');
  };

  const handleMarkAsPaid = () => {
    // Mark as paid logic here
    console.log('Mark as paid');
  };

  return (
    <div className="estimate-invoice-modal__overlay" onClick={onClose}>
      <div className="estimate-invoice-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="header-left">
            <div className="shop-info">
              <div className="shop-logo-container">
                <img src={shopInfo.logo} alt="Shop Logo" className="shop-logo" />
              </div>
              <div className="shop-details">
                <h1 className="shop-name">{shopInfo.name}</h1>
                <div className="shop-contact">
                  <div className="contact-line">{shopInfo.address}</div>
                  <div className="contact-line">
                    <span>Phone: {shopInfo.phone}</span>
                    <span className="separator">|</span>
                    <span>Email: {shopInfo.email}</span>
                  </div>
                  <div className="contact-line">
                    <span>Website: {shopInfo.website}</span>
                    <span className="separator">|</span>
                    <span>License: {shopInfo.license}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="header-right">
            <div className="doc-info">
              <div className="doc-type">{docType}</div>
              <div className="doc-number">{docNumber}</div>
              <div className="doc-meta">
                <div className="doc-date-row">
                  <span className="label">Date:</span>
                  <span className="value">{docDate}</span>
                </div>
                <div className="doc-date-row">
                  <span className="label">Due Date:</span>
                  <span className="value">{dueDate}</span>
                </div>
                <div className="doc-date-row">
                  <span className="label">Work Order:</span>
                  <span className="value">{workOrderNumber}</span>
                </div>
              </div>
              <div className={`doc-status doc-status--${docStatus.toLowerCase()}`}>
                {docStatus}
              </div>
            </div>
          </div>
          
          <button className="close-btn" onClick={onClose} title="Close">
            <i className="bx bx-x"></i>
          </button>
        </div>

        <div className="modal-content">
          <div className="invoice-header-info">
            <div className="bill-to">
              <div className="section-title">
                <h3>Bill To</h3>
              </div>
              <div className="info-list">
                <div><strong>{mockCustomer.name}</strong></div>
                {mockCustomer.company && <div>{mockCustomer.company}</div>}
                <div>{mockCustomer.address}</div>
                <div>{mockCustomer.phone}</div>
                <div>{mockCustomer.email}</div>
                {mockCustomer.tags && mockCustomer.tags.length > 0 && (
                  <div className="customer-tags">
                    {mockCustomer.tags.map(tag => (
                      <span className="tag" key={tag}>{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="vehicle-to">
              <div className="section-title">
                <h3>Vehicle</h3>
              </div>
              <div className="info-list">
                <div><strong>{mockVehicle.year} {mockVehicle.make} {mockVehicle.model} {mockVehicle.trim}</strong></div>
                <div>VIN: {mockVehicle.vin}</div>
                <div>License: {mockVehicle.licensePlate}</div>
                <div>Mileage: {mockVehicle.mileage} miles</div>
                <div>Color: {mockVehicle.color}</div>
                {mockVehicle.engine && <div>Engine: {mockVehicle.engine}</div>}
                {mockVehicle.transmission && <div>Transmission: {mockVehicle.transmission}</div>}
              </div>
            </div>
          </div>

          <div className="services-section">
            <div className="section-title">
              <i className="bx bx-wrench"></i>
              <h3>Services & Labor</h3>
            </div>
            <div className="table-container">
              <table className="services-table">
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Description</th>
                    <th className="text-center">Qty</th>
                    <th className="text-center">Hours</th>
                    <th className="text-right">Rate</th>
                    <th className="text-right">Discount</th>
                    <th className="text-right">Tax</th>
                    <th className="text-right">Total</th>
                    <th>Technician</th>
                  </tr>
                </thead>
                <tbody>
                  {mockServices.map(service => (
                    <tr key={service.id}>
                      <td>
                        <div className="service-name">{service.name}</div>
                        <div className="service-type">{service.type}</div>
                      </td>
                      <td className="service-description">{service.description}</td>
                      <td className="text-center">{service.qty}</td>
                      <td className="text-center">{service.hours ?? '-'}</td>
                      <td className="text-right">${service.rate.toFixed(2)}</td>
                      <td className="text-right">-${service.discount.toFixed(2)}</td>
                      <td className="text-right">${service.tax.toFixed(2)}</td>
                      <td className="text-right font-semibold">${service.lineTotal.toFixed(2)}</td>
                      <td>
                        {service.technician && (
                          <div className="technician-info">
                            <img src={service.technician.avatar} alt={service.technician.name} className="tech-avatar" />
                            <span className="tech-name">{service.technician.name}</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="parts-section">
            <div className="section-title">
              <i className="bx bx-cog"></i>
              <h3>Parts & Materials</h3>
            </div>
            <div className="table-container">
              <table className="parts-table">
                <thead>
                  <tr>
                    <th>Part Name</th>
                    <th>Description</th>
                    <th>Part #</th>
                    <th className="text-center">Qty</th>
                    <th className="text-right">Unit Price</th>
                    <th className="text-right">Total</th>
                    <th>Supplier</th>
                    <th>Warranty</th>
                  </tr>
                </thead>
                <tbody>
                  {mockParts.map(part => (
                    <tr key={part.id}>
                      <td className="part-name">{part.name}</td>
                      <td className="part-description">{part.description}</td>
                      <td className="part-number">{part.partNumber}</td>
                      <td className="text-center">{part.qty}</td>
                      <td className="text-right">${part.unitPrice.toFixed(2)}</td>
                      <td className="text-right font-semibold">${part.lineTotal.toFixed(2)}</td>
                      <td className="supplier">{part.supplier}</td>
                      <td className="warranty">{part.warranty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="inspections-section">
            <div className="section-title">
              <i className="bx bx-search"></i>
              <h3>Inspections</h3>
            </div>
            <div className="table-container">
              <table className="inspections-table">
                <thead>
                  <tr>
                    <th>Inspection</th>
                    <th>Result</th>
                    <th>Notes</th>
                    <th className="text-right">Charge</th>
                  </tr>
                </thead>
                <tbody>
                  {mockInspections.map(inspection => (
                    <tr key={inspection.id}>
                      <td className="inspection-name">{inspection.name}</td>
                      <td>
                        <span className={`result-badge result-${inspection.result.toLowerCase().replace(' ', '-')}`}>
                          {inspection.result}
                        </span>
                      </td>
                      <td className="inspection-notes">{inspection.notes}</td>
                      <td className="text-right">${inspection.charge.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="appointments-section">
            <div className="section-title">
              <i className="bx bx-calendar"></i>
              <h3>Appointments</h3>
            </div>
            <div className="table-container">
              <table className="appointments-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Service</th>
                    <th>Status</th>
                    <th className="text-right">Charge</th>
                  </tr>
                </thead>
                <tbody>
                  {mockAppointments.map(appointment => (
                    <tr key={appointment.id}>
                      <td className="appointment-date">{new Date(appointment.date).toLocaleDateString()}</td>
                      <td className="appointment-time">{appointment.time}</td>
                      <td className="appointment-service">{appointment.service}</td>
                      <td>
                        <span className={`status-badge status-${appointment.status.toLowerCase()}`}>
                          {appointment.status}
                        </span>
                      </td>
                      <td className="text-right">${appointment.charge.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="summary-section">
            <div className="summary-container">
              <div className="summary-title">
                <i className="bx bx-calculator"></i>
                <h3>Bill Summary</h3>
              </div>
              <div className="summary-table">
                <div className="summary-row">
                  <span className="summary-label">Subtotal:</span>
                  <span className="summary-value">${subtotal.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Total Discount:</span>
                  <span className="summary-value discount">-${totalDiscount.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Total Tax:</span>
                  <span className="summary-value">${totalTax.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Inspections:</span>
                  <span className="summary-value">${inspectionsTotal.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Appointments:</span>
                  <span className="summary-value">${appointmentsTotal.toFixed(2)}</span>
                </div>
                <div className="summary-row summary-total">
                  <span className="summary-label">Grand Total:</span>
                  <span className="summary-value">${grandTotal.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Payments:</span>
                  <span className="summary-value">${payments.toFixed(2)}</span>
                </div>
                <div className="summary-row summary-balance">
                  <span className="summary-label">Balance Due:</span>
                  <span className="summary-value">${balanceDue.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="notes-section">
            <div className="section-title">
              <i className="bx bx-note"></i>
              <h3>Notes & Terms</h3>
            </div>
            <div className="notes-content">
              <div className="notes-block">
                <h4>Service Notes</h4>
                <p>Thank you for choosing {shopInfo.name}! All work has been completed according to manufacturer specifications and industry standards.</p>
                <p>All parts and labor come with our standard warranty: 12 months or 12,000 miles, whichever comes first.</p>
              </div>
              <div className="terms-block">
                <h4>Terms & Conditions</h4>
                <ul>
                  <li>Payment is due upon receipt of this invoice</li>
                  <li>Late payments may be subject to additional fees</li>
                  <li>All warranty claims must be presented with this invoice</li>
                  <li>Customer is responsible for personal items left in vehicle</li>
                </ul>
                <p>For questions about this invoice, please contact us at {shopInfo.phone} or {shopInfo.email}.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <div className="footer-actions">
            <button className="btn btn-secondary" onClick={handlePrint}>
              <i className="bx bx-printer"></i>
              Print
            </button>
            <button className="btn btn-secondary" onClick={handleDownloadPDF}>
              <i className="bx bx-download"></i>
              Download PDF
            </button>
            <button className="btn btn-secondary" onClick={handleEmail}>
              <i className="bx bx-envelope"></i>
              Email
            </button>
            <button className="btn btn-primary" onClick={handleMarkAsPaid}>
              <i className="bx bx-check-circle"></i>
              Mark as Paid
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstimateInvoiceModal;