import React, { useState } from 'react';
import './JobCard.scss';

interface LineItem {
  id: string;
  type: 'Labor' | 'Part' | 'Note';
  name:string;
  description: string;
  cost: number;
  price: number;
  quantity: number;
  hours: number;
  amount: number;
  discount: number;
  netAmount: number;
  taxable: boolean;
  status: 'pending' | 'approved' | 'in-progress' | 'completed' | 'declined';
}

interface ServicePackage {
  id: string;
  name: string;
  authorized: boolean;
  note: string;
  lineItems: LineItem[];
}

interface PartItem {
  id: string;
  partNumber: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  supplier: string;
  availability: 'in-stock' | 'order-required' | 'backordered';
  expectedDelivery?: string;
  markup: number;
}

const initialServices: ServicePackage[] = [
  {
    id: 'service-1',
    name: 'Standard Oil Change Service',
    authorized: false,
    note: 'Customer requested standard 5W-30 synthetic oil. Also check tire pressure.',
    lineItems: [
      {
        id: 'li-1',
        type: 'Labor',
        name: 'Oil & Filter Change',
        description: 'Replace engine oil and filter.',
        cost: 0,
        price: 120.00, // labor rate
        quantity: 0.5, // represents hours for labor
        hours: 0.5,
        amount: 60.00,
        discount: 0,
        netAmount: 60.00,
        taxable: false,
        status: 'pending'
      },
      {
        id: 'li-2',
        type: 'Part',
        name: 'OEM Engine Oil Filter',
        description: 'Part #OF-001',
        cost: 8.00,
        price: 15.00,
        quantity: 1,
        hours: 0,
        amount: 15.00,
        discount: 0,
        netAmount: 15.00,
        taxable: true,
        status: 'pending'
      },
      {
        id: 'li-3',
        type: 'Part',
        name: '5W-30 Synthetic Engine Oil',
        description: '5 Quarts',
        cost: 25.00,
        price: 45.00,
        quantity: 1, // as a single "item"
        hours: 0,
        amount: 45.00,
        discount: 0,
        netAmount: 45.00,
        taxable: true,
        status: 'pending'
      }
    ]
  },
  {
    id: 'service-2',
    name: 'Brake Inspection',
    authorized: true,
    note: 'Customer reports grinding noise from front right.',
    lineItems: [
      {
        id: 'li-4',
        type: 'Labor',
        name: 'Complete Brake System Inspection',
        description: 'Inspect pads, rotors, calipers, and fluid.',
        cost: 0,
        price: 120.00,
        quantity: 1.0, // hours
        hours: 1.0,
        amount: 120.00,
        discount: 0,
        netAmount: 120.00,
        taxable: false,
        status: 'in-progress'
      }
    ]
  }
];

const JobCard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'services' | 'parts' | 'inspections' | 'notes'>('services');
  const statusOptions = [
    { value: 'under-inspection', label: 'Under inspection' },
    { value: 'waiting-for-parts', label: 'Waiting for parts' },
    { value: 'waiting-for-payment', label: 'Waiting for payment' },
    { value: 'completed', label: 'Completed' },
  ];

  const [workflowStatus, setWorkflowStatus] = useState<'under-inspection' | 'waiting-for-parts' | 'waiting-for-payment' | 'completed'>('under-inspection');
  const [estimateGenerated, setEstimateGenerated] = useState(false);
  const [invoiceGenerated, setInvoiceGenerated] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'paid'>('pending');
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [services, setServices] = useState<ServicePackage[]>(initialServices);

  const partItems: PartItem[] = [
    {
      id: '1',
      partNumber: 'OF-001',
      name: 'Engine Oil Filter',
      description: 'OEM oil filter',
      quantity: 1,
      unitPrice: 15.00,
      totalPrice: 15.00,
      supplier: 'AutoParts Direct',
      availability: 'in-stock',
      markup: 1.3
    },
    {
      id: '2',
      partNumber: 'BP-205',
      name: 'Brake Pads - Front Set',
      description: 'Ceramic brake pads',
      quantity: 1,
      unitPrice: 85.00,
      totalPrice: 85.00,
      supplier: 'Brake Specialists',
      availability: 'order-required',
      expectedDelivery: '2024-03-15',
      markup: 1.4
    }
  ];

  const calculateAuthorizedLabor = () => services
    .filter(s => s.authorized)
    .flatMap(s => s.lineItems)
    .filter(li => li.type === 'Labor')
    .reduce((sum, li) => sum + li.netAmount, 0);

  const calculateAuthorizedParts = () => services
    .filter(s => s.authorized)
    .flatMap(s => s.lineItems)
    .filter(li => li.type === 'Part')
    .reduce((sum, li) => sum + li.netAmount, 0);

  const calculateTax = () => {
    const taxableSubtotal = services
      .filter(s => s.authorized)
      .flatMap(s => s.lineItems)
      .filter(li => li.taxable)
      .reduce((sum, li) => sum + li.netAmount, 0);
    return taxableSubtotal * 0.08; // 8% tax rate
  };

  const calculateTotal = () => {
    return calculateAuthorizedLabor() + calculateAuthorizedParts() + calculateTax();
  };

  const calculateGrandTotal = () => services
    .flatMap(s => s.lineItems)
    .reduce((sum, li) => sum + li.netAmount, 0);

  const customerComplaint = "Customer states there is a 'grinding noise' coming from the front right wheel when braking. Also mentions the vehicle pulls to the right on the highway.";
  const vehicleImageUrl = "https://i.redd.it/f0v56ae4s8ce1.png";
  const customerImageUrl = "https://i.pravatar.cc/150?u=a042581f4e29026704d";
  const vehicleArrival = "Mar 1, 2024, 10:30 AM";
  const personalItems = "Sunglasses on dashboard, baby seat in the back.";

  return (
    <div className="job-card">
      {/* Header */}
      <div className="job-card__header">
        <div className="job-card__header-content">
          <div className="job-card__header-info">
            <div className="job-card__title-section">
              <h1 className="job-card__title">Job Card #10012</h1>
              <select
                className="job-card__status-dropdown"
                value={workflowStatus}
                onChange={e => setWorkflowStatus(e.target.value as any)}
              >
                {statusOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="job-card__subtitle">
              Created Mar 1, 2024 by John Wilson • Customer: Amber Miller
            </div>
          </div>
          <div className="job-card__header-actions">
            <button className="btn btn--secondary">Print</button>
            <button className="btn btn--secondary">Email</button>
            {!estimateGenerated ? (
              <button
                className="btn btn--primary"
                onClick={() => setEstimateGenerated(true)}
              >
                Generate and send estimate
              </button>
            ) : !invoiceGenerated ? (
              <button
                className="btn btn--primary"
                onClick={() => setInvoiceGenerated(true)}
              >
                Generate and send invoice
              </button>
            ) : (
              <button className="btn btn--primary" disabled>Invoice Sent</button>
            )}
          </div>
        </div>
      </div>

      <div className="job-card__body">
        {/* Main Content */}
        <div className="job-card__main">
          <div className="job-card__content">
            {/* Vehicle & Customer Info */}
            <div className="job-card__info-section">
              <div className="info-card">
                <h3 className="info-card__title">Customer</h3>
                <div className="info-card__body">
                  <div className="info-card__item info-card__item--image">
                    <img src={customerImageUrl} alt="Amber Miller" className="customer-image"/>
                  </div>
                  <div className="info-card__item">
                    <span className="info-card__label">Name</span>
                    <span className="info-card__value">Amber Miller</span>
                  </div>
                  <div className="info-card__item">
                    <span className="info-card__label">Phone</span>
                    <span className="info-card__value">(555) 123-4567</span>
                  </div>
                  <div className="info-card__item">
                    <span className="info-card__label">Email</span>
                    <span className="info-card__value">amber.miller@email.com</span>
                  </div>
                </div>
              </div>
              <div className="info-card">
                <h3 className="info-card__title">Vehicle</h3>
                <div className="info-card__body">
                  <div className="info-card__item info-card__item--image">
                    <img src={vehicleImageUrl} alt="2020 Audi A4 Premium" className="vehicle-image"/>
                  </div>
                  <div className="info-card__item">
                    <span className="info-card__label">Model</span>
                    <span className="info-card__value">2020 Audi A4 Premium</span>
                  </div>
                  <div className="info-card__item">
                    <span className="info-card__label">VIN</span>
                    <span className="info-card__value">WAUENAF40LN123456</span>
                  </div>
                  <div className="info-card__item">
                    <span className="info-card__label">Mileage</span>
                    <span className="info-card__value">45,250 miles</span>
                  </div>
                  <div className="info-card__item info-card__item--full-width">
                    <span className="info-card__label">Personal Items</span>
                    <p className="info-card__text">{personalItems}</p>
                  </div>
                </div>
              </div>
              <div className="info-card">
                <h3 className="info-card__title">Job Details</h3>
                <div className="info-card__body">
                  <div className="info-card__item">
                    <span className="info-card__label">Created By</span>
                    <span className="info-card__value">John Wilson</span>
                  </div>
                  <div className="info-card__item">
                    <span className="info-card__label">Assigned Tech</span>
                    <span className="info-card__value">Chuck Ivanes</span>
                  </div>
                  <div className="info-card__item">
                    <span className="info-card__label">Arrived</span>
                    <span className="info-card__value">{vehicleArrival}</span>
                  </div>
                  <div className="info-card__item info-card__item--full-width">
                    <span className="info-card__label">Customer Request</span>
                    <p className="info-card__text">{customerComplaint}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="job-card__tabs">
              <nav className="job-card__tab-nav">
                {['services', 'parts', 'inspections', 'notes'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`job-card__tab ${activeTab === tab ? 'job-card__tab--active' : ''}`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            <div className="job-card__tab-content">
              {activeTab === 'services' && (
                <div>
                  <div className="services-header">
                    <div className="services-header__search-bar">
                      <input type="text" placeholder="Search canned services..." className="search-bar__input" />
                      <button className="btn btn--text btn--browse">Browse</button>
                    </div>
                    <div className="services-header__actions">
                      <button className="btn btn--secondary">Add Services</button>
                    </div>
                    <div className="services-header__stats">
                      <div className="stat-box">
                        <span className="stat-box__label">Deferred Services</span>
                        <span className="stat-box__value">0</span>
                      </div>
                      <div className="stat-box">
                        <span className="stat-box__label">Total Charge</span>
                        <span className="stat-box__value">${calculateGrandTotal().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="job-card__services-list">
                    {services.map((service) => (
                      <div key={service.id} className="service-package">
                        <div className="service-package__header">
                          <div className="service-package__header-main">
                            <h3 className="service-package__name">{service.name}</h3>
                            {service.authorized ? (
                              <span className="badge badge--approved">Authorized</span>
                            ) : (
                              <span className="badge badge--pending">Not Authorized</span>
                            )}

                          </div>
                          <div className="service-package__header-actions">
                            <button className="btn btn--text">⚙️</button>
                          </div>
                        </div>

                        <div className="service-package__details">
                          <p className="service-package__note">
                            <strong>Note:</strong> {service.note || 'No notes for this service.'}
                          </p>
                          <div className="service-package__add-ons">
                            <button className="btn btn--secondary-emerald">Add Service Item</button>
                            <button className="btn btn--secondary">Add Inspection Checklist</button>
                          </div>
                        </div>

                        <div className="service-package__items-table">
                          <table className="parts-table__table">
                            <thead className="parts-table__header">
                              <tr>
                                <th>Type</th>
                                <th>Name / Description</th>
                                <th>Cost</th>
                                <th>Price</th>
                                <th>Qty / Hrs</th>
                                <th>Amount</th>
                                <th>Disc</th>
                                <th>Net Amount</th>
                                <th>Tax</th>
                                <th>Status</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody className="parts-table__body">
                              {service.lineItems.map(item => (
                                <tr key={item.id}>
                                  <td>{item.type}</td>
                                  <td>
                                    <div className="parts-table__part-name">{item.name}</div>
                                    <div className="parts-table__part-number">{item.description}</div>
                                  </td>
                                  <td>${item.cost.toFixed(2)}</td>
                                  <td>${item.price.toFixed(2)}</td>
                                  <td>{item.quantity}</td>
                                  <td>${item.amount.toFixed(2)}</td>
                                  <td>${item.discount.toFixed(2)}</td>
                                  <td>${item.netAmount.toFixed(2)}</td>
                                  <td>
                                    <input type="checkbox" checked={item.taxable} readOnly />
                                  </td>
                                  <td><span className={`badge badge--${item.status.toLowerCase()}`}>{item.status}</span></td>
                                  <td>
                                    <div className="parts-table__actions">
                                      <button className="btn btn--small btn--icon" aria-label="Edit item"><i className='bx bxs-edit'></i></button>
                                      <button className="btn btn--small btn--icon btn--danger" aria-label="Remove item"><i className='bx bxs-trash'></i></button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <div className="service-package__summary">
                          <div className="summary-list">
                            <div className="summary-list__item">
                              <span className="summary-list__label">Service Total</span>
                              <span className="summary-list__value">${service.lineItems.reduce((acc, item) => acc + item.amount, 0).toFixed(2)}</span>
                            </div>
                            <div className="summary-list__item">
                              <span className="summary-list__label">Total Discount</span>
                              <span className="summary-list__value">-${service.lineItems.reduce((acc, item) => acc + item.discount, 0).toFixed(2)}</span>
                            </div>
                            <div className="summary-list__total">
                              <span className="summary-list__label">Net Total</span>
                              <span className="summary-list__value">${service.lineItems.reduce((acc, item) => acc + item.netAmount, 0).toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'parts' && (
                <div>
                  <div className="job-card__section-header">
                    <h3 className="job-card__section-title">Parts & Materials</h3>
                    <div className="job-card__section-actions">
                      <button className="btn btn--secondary-emerald">Add Part</button>
                      <button className="btn btn--primary">Order Parts</button>
                    </div>
                  </div>

                  <div className="parts-table">
                    <table className="parts-table__table">
                      <thead className="parts-table__header">
                        <tr>
                          <th>Part</th>
                          <th>Description</th>
                          <th>Qty</th>
                          <th>Unit Price</th>
                          <th>Total</th>
                          <th>Availability</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody className="parts-table__body">
                        {partItems.map((part) => (
                          <tr key={part.id}>
                            <td className="parts-table__part">
                              <div className="parts-table__part-name">{part.name}</div>
                              <div className="parts-table__part-number">{part.partNumber}</div>
                            </td>
                            <td className="parts-table__description">
                              <div className="parts-table__desc-text">{part.description}</div>
                              <div className="parts-table__supplier">Supplier: {part.supplier}</div>
                            </td>
                            <td className="parts-table__quantity">{part.quantity}</td>
                            <td className="parts-table__price">${part.unitPrice.toFixed(2)}</td>
                            <td className="parts-table__total">${part.totalPrice.toFixed(2)}</td>
                            <td className="parts-table__availability">
                              <span className={`badge badge--availability-${part.availability}`}>
                                {part.availability.replace('-', ' ')}
                              </span>
                              {part.expectedDelivery && (
                                <div className="parts-table__eta">ETA: {part.expectedDelivery}</div>
                              )}
                            </td>
                            <td>
                              <div className="parts-table__actions">
                                <button className="btn btn--small btn--icon" aria-label="Edit part"><i className='bx bxs-edit'></i></button>
                                <button className="btn btn--small btn--icon btn--danger" aria-label="Remove part"><i className='bx bxs-trash'></i></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'inspections' && (
                <div>
                  <h3 className="job-card__section-title">Vehicle Inspection</h3>
                  <div className="job-card__placeholder">
                    Inspection features coming soon...
                  </div>
                </div>
              )}

              {activeTab === 'notes' && (
                <div>
                  <h3 className="job-card__section-title">Work Notes & Comments</h3>
                  <textarea
                    className="job-card__notes-textarea"
                    placeholder="Add notes about the work performed, customer concerns, recommendations, etc."
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="job-card__sidebar">
          {/* Work Order Summary */}
          <div className="sidebar-card">
            <h3 className="sidebar-card__title">Job Card Summary</h3>
            
            <div className="summary-list">
              <div className="summary-list__item">
                <span className="summary-list__label">Labor</span>
                <span className="summary-list__value">${calculateAuthorizedLabor().toFixed(2)}</span>
              </div>
              <div className="summary-list__item">
                <span className="summary-list__label">Parts</span>
                <span className="summary-list__value">${calculateAuthorizedParts().toFixed(2)}</span>
              </div>
              <div className="summary-list__item">
                <span className="summary-list__label">Tax (8%)</span>
                <span className="summary-list__value">${calculateTax().toFixed(2)}</span>
              </div>
              <div className="summary-list__total">
                <span className="summary-list__label">Total</span>
                <span className="summary-list__value">${calculateTotal().toFixed(2)}</span>
              </div>
            </div>

            <div className="sidebar-card__payment">
              <div className="sidebar-card__payment-label">Payment Status</div>
              <select
                className="sidebar-card__payment-dropdown"
                value={paymentStatus}
                onChange={e => setPaymentStatus(e.target.value as any)}
              >
                <option value="pending">Pending Payment</option>
                <option value="paid">Paid</option>
              </select>
              {paymentStatus === 'paid' && (
                <div className="sidebar-card__payment-proof">
                  <label htmlFor="payment-proof-upload" className="sidebar-card__payment-proof-label">
                    Attach Payment Proof:
                  </label>
                  <input
                    id="payment-proof-upload"
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={e => setPaymentProof(e.target.files ? e.target.files[0] : null)}
                  />
                  {paymentProof && (
                    <div className="sidebar-card__payment-proof-file">
                      <span>Attached: {paymentProof.name}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Customer Authorization */}
          <div className="sidebar-card">
            <h3 className="sidebar-card__title">Authorization Status</h3>
            
            <div className="auth-status">
              <div className="auth-status__item">
                <div className="auth-status__indicator">
                  <div className="auth-status__dot auth-status__dot--pending"></div>
                  <span>Pending Approval</span>
                </div>
                <span className="auth-status__count">{services.filter(s => !s.authorized).length}</span>
              </div>
              <div className="auth-status__item">
                <div className="auth-status__indicator">
                  <div className="auth-status__dot auth-status__dot--approved"></div>
                  <span>Approved</span>
                </div>
                <span className="auth-status__count">{services.filter(s => s.authorized).length}</span>
              </div>
              <div className="auth-status__item">
                <div className="auth-status__indicator">
                  <div className="auth-status__dot auth-status__dot--declined"></div>
                  <span>Declined</span>
                </div>
                <span className="auth-status__count">0</span>
              </div>
            </div>

            <button className="btn btn--primary btn--full-width">
              Send Authorization Request
            </button>
          </div>

          {/* Quick Actions */}
          <div className="sidebar-card">
            <h3 className="sidebar-card__title">Quick Actions</h3>
            
            <div className="quick-actions">
              <button className="btn btn--secondary-emerald btn--full-width btn--left-aligned">
                📅 Schedule Follow-up
              </button>
              <button className="btn btn--secondary btn--full-width btn--left-aligned">
                📧 Email Customer
              </button>
              <button className="btn btn--secondary btn--full-width btn--left-aligned">
                📞 Call Customer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;