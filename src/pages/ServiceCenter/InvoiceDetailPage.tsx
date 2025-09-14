import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './InvoiceDetailPage.scss';
import { useAuth } from '../../hooks/useAuth';

// Invoice interface based on the API response
interface Invoice {
  id: string;
  invoiceNumber: string;
  workOrderId: string;
  issueDate: string;
  dueDate: string;
  status: 'DRAFT' | 'SENT' | 'OVERDUE' | 'CANCELLED';
  subtotalServices: number;
  subtotalLabor: number;
  subtotalParts: number;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
  workOrder: {
    id: string;
    workOrderNumber: string;
    createdAt: string;
    updatedAt: string;
    customerId: string;
    vehicleId: string;
    appointmentId: string;
    advisorId: string;
    status: string;
    jobType: string;
    priority: string;
    source: string;
    complaint: string;
    odometerReading: number;
    warrantyStatus: string;
    estimatedTotal: number | null;
    estimateNotes: string | null;
    estimateApproved: boolean;
    subtotalLabor: string;
    subtotalParts: string;
    discountAmount: number | null;
    taxAmount: number | null;
    totalAmount: string;
    paidAmount: string;
    openedAt: string | null;
    promisedAt: string | null;
    closedAt: string | null;
    workflowStep: string;
    internalNotes: string;
    customerNotes: string;
    invoiceNumber: string | null;
    finalizedAt: string | null;
    paymentStatus: string;
    warrantyClaimNumber: string | null;
    thirdPartyApprovalCode: string | null;
    campaignId: string | null;
    servicePackageId: string | null;
    customerSignature: string | null;
    customerFeedback: string | null;
    customer: {
      id: string;
      name: string;
      email: string;
      phone: string;
    };
    vehicle: {
      id: string;
      make: string;
      model: string;
      year: number;
      licensePlate: string;
    };
  };
  lineItems: Array<{
    id: string;
    invoiceId: string;
    type: 'SERVICE' | 'LABOR' | 'PART';
    description: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    workOrderServiceId: string | null;
    workOrderLaborId: string | null;
    workOrderPartId: string | null;
    notes: string;
    createdAt: string;
    updatedAt: string;
  }>;
}

const InvoiceDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    
    setLoading(true);
    fetch(`http://localhost:3000/invoices/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then((response) => {
        // Handle the API response structure with success/data wrapper
        const data = response.success ? response.data : response;
        setInvoice(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching invoice:', err);
        setError('Failed to fetch invoice details');
        setLoading(false);
      });
  }, [id, token]);

  const formatCurrency = (amount: number) => {
    return `LKR ${Number(amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'DRAFT': { class: 'status-draft', text: 'Draft', color: '#6b7280' },
      'SENT': { class: 'status-sent', text: 'Sent', color: '#3b82f6' },
      'OVERDUE': { class: 'status-overdue', text: 'Overdue', color: '#ef4444' },
      'CANCELLED': { class: 'status-cancelled', text: 'Cancelled', color: '#6b7280' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig['DRAFT'];
    
    return (
      <span 
        className={`status-badge ${config.class}`}
        style={{ 
          backgroundColor: `${config.color}20`, 
          color: config.color,
          border: `1px solid ${config.color}40`
        }}
      >
        {config.text}
      </span>
    );
  };

  const handlePrint = () => {
    window.print();
  };

  const handleBack = () => {
    const basePath = window.location.pathname.split('/')[1];
    navigate(`/${basePath}/invoices`);
  };

  if (loading) {
    return (
      <div className="invoice-detail-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading invoice details...</p>
        </div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="invoice-detail-page">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error || 'Invoice not found'}</p>
          <button className="btn btn--primary" onClick={handleBack}>
            Back to Invoices
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="invoice-detail-page">
      {/* Header Actions */}
      <div className="invoice-header-actions">
        <button className="btn btn--ghost" onClick={handleBack}>
          <i className='bx bx-arrow-back'></i>
          Back to Invoices
        </button>
        <div className="action-buttons">
          <button className="btn btn--ghost" onClick={handlePrint}>
            <i className='bx bx-printer'></i>
            Print
          </button>
          <button className="btn btn--primary">
            <i className='bx bx-download'></i>
            Download PDF
          </button>
        </div>
      </div>

      {/* Invoice Document */}
      <div className="invoice-document">
        {/* Invoice Header */}
        <div className="invoice-header">
          <div className="company-info">
            <div className="company-logo">
              <img src="/motortraceLogo.png" alt="MotorTrace" />
            </div>
            <div className="company-details">
              <h1>MotorTrace</h1>
              <p>Professional Auto Service Center</p>
              <div className="contact-info">
                <p><i className='bx bx-map'></i> 123 Service Street, Colombo, Sri Lanka</p>
                <p><i className='bx bx-phone'></i> +94 11 234 5678</p>
                <p><i className='bx bx-envelope'></i> info@motortrace.com</p>
              </div>
            </div>
          </div>
          <div className="invoice-info">
            <h2>INVOICE</h2>
            <div className="invoice-details">
              <div className="detail-row">
                <span className="label">Invoice #:</span>
                <span className="value">{invoice.invoiceNumber}</span>
              </div>
              <div className="detail-row">
                <span className="label">Work Order #:</span>
                <span className="value">{invoice.workOrder.workOrderNumber}</span>
              </div>
              <div className="detail-row">
                <span className="label">Issue Date:</span>
                <span className="value">{formatDate(invoice.issueDate)}</span>
              </div>
              <div className="detail-row">
                <span className="label">Due Date:</span>
                <span className="value">{formatDate(invoice.dueDate)}</span>
              </div>
              <div className="detail-row">
                <span className="label">Status:</span>
                <span className="value">{getStatusBadge(invoice.status)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer & Vehicle Info */}
        <div className="customer-section">
          <div className="customer-info">
            <h3>Bill To:</h3>
            <div className="customer-details">
              <p className="customer-name">{invoice.workOrder.customer.name}</p>
              <p>{invoice.workOrder.customer.email}</p>
              <p>{invoice.workOrder.customer.phone}</p>
            </div>
          </div>
          <div className="vehicle-info">
            <h3>Vehicle:</h3>
            <div className="vehicle-details">
              <p className="vehicle-name">
                {invoice.workOrder.vehicle.year} {invoice.workOrder.vehicle.make} {invoice.workOrder.vehicle.model}
              </p>
              <p>License Plate: {invoice.workOrder.vehicle.licensePlate}</p>
              <p>Odometer: {invoice.workOrder.odometerReading.toLocaleString()} km</p>
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div className="line-items-section">
          <h3>Services & Parts</h3>
          <div className="line-items-table">
            <div className="table-header">
              <div className="col-description">Description</div>
              <div className="col-type">Type</div>
              <div className="col-qty">Qty</div>
              <div className="col-price">Unit Price</div>
              <div className="col-total">Total</div>
            </div>
            {invoice.lineItems.map((item) => (
              <div key={item.id} className="table-row">
                <div className="col-description">
                  <div className="item-description">{item.description}</div>
                  {item.notes && (
                    <div className="item-notes">{item.notes}</div>
                  )}
                </div>
                <div className="col-type">
                  <span className={`type-badge type-${item.type.toLowerCase()}`}>
                    {item.type}
                  </span>
                </div>
                <div className="col-qty">{item.quantity}</div>
                <div className="col-price">{formatCurrency(item.unitPrice)}</div>
                <div className="col-total">{formatCurrency(item.subtotal)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="totals-section">
          <div className="totals-container">
            <div className="totals-table">
              <div className="total-row">
                <span className="label">Subtotal (Services):</span>
                <span className="value">{formatCurrency(invoice.subtotalServices)}</span>
              </div>
              <div className="total-row">
                <span className="label">Subtotal (Labor):</span>
                <span className="value">{formatCurrency(invoice.subtotalLabor)}</span>
              </div>
              <div className="total-row">
                <span className="label">Subtotal (Parts):</span>
                <span className="value">{formatCurrency(invoice.subtotalParts)}</span>
              </div>
              <div className="total-row subtotal-row">
                <span className="label">Subtotal:</span>
                <span className="value">{formatCurrency(invoice.subtotal)}</span>
              </div>
              <div className="total-row">
                <span className="label">Discount:</span>
                <span className="value">-{formatCurrency(invoice.discountAmount)}</span>
              </div>
              <div className="total-row">
                <span className="label">Tax:</span>
                <span className="value">{formatCurrency(invoice.taxAmount)}</span>
              </div>
              <div className="total-row total-row-final">
                <span className="label">Total Amount:</span>
                <span className="value">{formatCurrency(invoice.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="notes-section">
            <h3>Notes</h3>
            <div className="notes-content">
              <p>{invoice.notes}</p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="invoice-footer">
          <div className="payment-info">
            <h4>Payment Information</h4>
            <p>Please make payment by the due date to avoid late fees.</p>
            <p>For payment inquiries, contact us at +94 11 234 5678</p>
          </div>
          <div className="thank-you">
            <p>Thank you for choosing MotorTrace!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetailPage;
