import React from 'react';
import { X, Download, User, Car, FileText, Package, Wrench } from 'lucide-react';
import type { Transaction } from '../../../../pages/Admin/IncomeManagement';
import './InvoiceModal.scss';

interface InvoiceModalProps {
  transaction: Transaction;
  onClose: () => void;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({ transaction, onClose }) => {
  const handleDownloadPDF = async () => {
    try {
      // Create a new window with the invoice content for PDF generation
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert('Please allow popups to download the PDF');
        return;
      }

      // Get the invoice content
      const invoiceContent = document.querySelector('.invoice-modal')?.innerHTML;
      if (!invoiceContent) return;

      // Create the HTML document for PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Service Invoice - Transaction #${transaction.id}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              background: white;
            }
            
            .invoice-modal {
              max-width: 900px;
              margin: 0 auto;
              padding: 20px;
            }
            
            .invoice-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 24px 0;
              border-bottom: 2px solid #e5e7eb;
              margin-bottom: 24px;
            }
            
            .invoice-header__right {
              display: none !important;
            }
            
            .invoice-title {
              font-size: 1.25rem;
              font-weight: 600;
              color: #111827;
            }
            
            .invoice-subtitle {
              font-size: 0.875rem;
              color: #6b7280;
            }
            
            .business-info {
              text-align: center;
              margin-bottom: 32px;
              padding-bottom: 24px;
              border-bottom: 2px solid #e5e7eb;
            }
            
            .business-name {
              font-size: 1.5rem;
              font-weight: 700;
              color: #111827;
              margin-bottom: 8px;
            }
            
            .business-address {
              font-size: 0.875rem;
              color: #6b7280;
              line-height: 1.5;
            }
            
            .invoice-info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 24px;
              margin-bottom: 32px;
            }
            
            .info-section {
              background-color: #f9fafb;
              border-radius: 8px;
              padding: 20px;
            }
            
            .info-title {
              display: flex;
              align-items: center;
              gap: 8px;
              font-size: 1rem;
              font-weight: 600;
              color: #111827;
              margin-bottom: 12px;
            }
            
            .info-row {
              display: flex;
              margin-bottom: 8px;
              font-size: 0.875rem;
            }
            
            .info-label {
              color: #111827;
              font-weight: 500;
              min-width: 140px;
              flex-shrink: 0;
            }
            
            .info-value {
              color: #374151;
              flex: 1;
            }
            
            .section-title {
              display: flex;
              align-items: center;
              gap: 8px;
              font-size: 1.125rem;
              font-weight: 600;
              color: #111827;
              margin-bottom: 16px;
              padding-bottom: 8px;
              border-bottom: 1px solid #e5e7eb;
            }
            
            .breakdown-table {
              width: 100%;
              border-collapse: collapse;
              font-size: 0.875rem;
              margin-bottom: 32px;
            }
            
            .breakdown-table th {
              background-color: #f9fafb;
              color: #374151;
              font-weight: 600;
              padding: 12px;
              text-align: left;
              border: 1px solid #e5e7eb;
            }
            
            .breakdown-table td {
              padding: 12px;
              border: 1px solid #e5e7eb;
              color: #374151;
            }
            
            .text-right {
              text-align: right;
            }
            
            .sub-item {
              padding-left: 24px !important;
              color: #6b7280;
            }
            
            .status-badge,
            .source-badge {
              display: inline-block;
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 0.75rem;
              font-weight: 500;
            }
            
            .status-badge.completed {
              background-color: #ecfdf5;
              color: #065f46;
            }
            
            .source-badge.inventory {
              background-color: #eff6ff;
              color: #1d4ed8;
            }
            
            .source-badge.customer {
              background-color: #fef3c7;
              color: #92400e;
            }
            
            .summary-table {
              background-color: #f9fafb;
              border-radius: 8px;
              padding: 20px;
            }
            
            .summary-row {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 8px 0;
              font-size: 0.875rem;
              color: #374151;
              border-bottom: 1px solid #e5e7eb;
            }
            
            .summary-row:last-child {
              border-bottom: none;
            }
            
            .summary-row.total {
              font-size: 1rem;
              color: #111827;
              font-weight: 600;
              padding-top: 12px;
              margin-top: 8px;
            }
            
            .summary-row.discount {
              color: #10b981;
            }
            
            .summary-row.advance {
              color: #0ea5e9;
            }
            
            .summary-row.balance {
              color: #111827;
              font-size: 1rem;
              font-weight: 600;
              padding-top: 8px;
              border-top: 1px solid #d1d5db;
            }
            
            .invoice-footer {
              margin-top: 40px;
              padding-top: 24px;
              border-top: 2px solid #e5e7eb;
            }
            
            .footer-note {
              margin-bottom: 32px;
            }
            
            .footer-note p {
              margin-bottom: 10px;
              font-size: 0.875rem;
              color: #374151;
              text-align: center;
            }
            
            .warranty-note {
              background-color: #fef3c7;
              padding: 12px;
              border-radius: 6px;
              border-left: 3px solid #f59e0b;
              margin-top: 20px;
            }
            
            .footer-signature {
              display: flex;
              justify-content: flex-end;
            }
            
            .signature-line {
              text-align: center;
              width: 200px;
            }
            
            .signature-space {
              height: 60px;
              border-bottom: 2px solid #374151;
              margin-bottom: 8px;
            }
            
            .signature-text {
              font-size: 0.875rem;
              color: #6b7280;
            }
          </style>
        </head>
        <body>
          ${invoiceContent}
        </body>
        </html>
      `;

      printWindow.document.write(htmlContent);
      printWindow.document.close();

      // Wait for content to load then trigger print dialog
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      }, 500);

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  if (!transaction.serviceDetails) {
    return null;
  }

  const { serviceDetails } = transaction;
  const completedSubTasks = serviceDetails.subTasks.filter(task => task.completed);
  const inventoryParts = serviceDetails.spareParts.filter(part => part.source === 'inventory');
  const customerParts = serviceDetails.spareParts.filter(part => part.source === 'customer-supplied');

  const subtotal = serviceDetails.mainService.cost + 
                  completedSubTasks.reduce((sum, task) => sum + task.cost, 0) +
                  inventoryParts.reduce((sum, part) => sum + part.totalCost, 0) +
                  serviceDetails.laborCost;

  const totalAfterDiscount = subtotal - serviceDetails.discountAmount;
  const finalTotal = totalAfterDiscount + serviceDetails.taxAmount;

  return (
    <div className="invoice-modal-overlay" onClick={onClose}>
      <div className="invoice-modal" onClick={(e) => e.stopPropagation()}>
        <div className="invoice-header">
          <div className="invoice-header__left">
            <FileText size={24} />
            <div>
              <h2 className="invoice-title">Service Invoice</h2>
              <p className="invoice-subtitle">Transaction #{transaction.id}</p>
            </div>
          </div>
          <div className="invoice-header__right">
            <button className="invoice-action-btn" onClick={handleDownloadPDF}>
              <Download size={16} />
              Download PDF
            </button>
            <button className="close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="invoice-content">
          {/* Business Info */}
          <div className="business-info">
            <h3 className="business-name">MotorTrace Service Center</h3>
            <p className="business-address">
              No. 25, Marine Drive, Wellawatte, Colombo 06 Sri Lanka <br />
              Email: motortrace64@gmail.com <br />
              Phone: +94 11 234 5678
            </p>
          </div>

          {/* Customer & Service Info */}
          <div className="invoice-info-grid">
            <div className="info-section">
              <h4 className="info-title">
                <User size={16} />
                Customer Information
              </h4>
              <div className="info-content">
                <div className="info-row">
                  <span className="info-label">Name:</span>
                  <span className="info-value">{transaction.customerName}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Customer ID:</span>
                  <span className="info-value">{transaction.customerId}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Booking Date:</span>
                  <span className="info-value">{new Date(transaction.bookingDate).toLocaleDateString()}</span>
                </div>
                {transaction.completionDate && (
                  <div className="info-row">
                    <span className="info-label">Completion Date:</span>
                    <span className="info-value">{new Date(transaction.completionDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="info-section">
              <h4 className="info-title">
                <Car size={16} />
                Service Information
              </h4>
              <div className="info-content">
                <div className="info-row">
                  <span className="info-label">Main Service:</span>
                  <span className="info-value">{serviceDetails.mainService.name}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Payment Status:</span>
                  <span className="info-value">{transaction.paymentStatus.toUpperCase()}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Payment Method:</span>
                  <span className="info-value">{transaction.paymentMethod.replace('-', ' ').toUpperCase()}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Payment Case:</span>
                  <span className="info-value">{transaction.paymentCase.replace('-', ' ').toUpperCase()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Service Breakdown */}
          <div className="service-breakdown">
            <h4 className="section-title">
              <Wrench size={16} />
              Service Breakdown
            </h4>
            
            <table className="breakdown-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Status</th>
                  <th className="text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>{serviceDetails.mainService.name}</strong></td>
                  <td><span className="status-badge completed">Completed</span></td>
                  <td className="text-right">LKR {serviceDetails.mainService.cost.toLocaleString()}</td>
                </tr>
                {completedSubTasks.map((task) => (
                  <tr key={task.id}>
                    <td className="sub-item">• {task.name}</td>
                    <td><span className="status-badge completed">Completed</span></td>
                    <td className="text-right">LKR {task.cost.toLocaleString()}</td>
                  </tr>
                ))}
                <tr>
                  <td><strong>Labor Cost</strong></td>
                  <td><span className="status-badge completed">Applied</span></td>
                  <td className="text-right">LKR {serviceDetails.laborCost.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Spare Parts */}
          {(inventoryParts.length > 0 || customerParts.length > 0) && (
            <div className="spare-parts">
              <h4 className="section-title">
                <Package size={16} />
                Spare Parts Used
              </h4>
              
              <table className="breakdown-table">
                <thead>
                  <tr>
                    <th>Part Name</th>
                    <th>Qty</th>
                    <th>Unit Cost</th>
                    <th>Source</th>
                    <th className="text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {inventoryParts.map((part) => (
                    <tr key={part.id}>
                      <td>{part.name}</td>
                      <td>{part.quantity}</td>
                      <td>LKR {part.unitCost.toLocaleString()}</td>
                      <td><span className="source-badge inventory">Our Inventory</span></td>
                      <td className="text-right">LKR {part.totalCost.toLocaleString()}</td>
                    </tr>
                  ))}
                  {customerParts.map((part) => (
                    <tr key={part.id}>
                      <td>{part.name}</td>
                      <td>{part.quantity}</td>
                      <td>-</td>
                      <td><span className="source-badge customer">Customer Supplied</span></td>
                      <td className="text-right">LKR 0</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Payment Summary */}
          <div className="payment-summary">
            <h4 className="section-title">Payment Summary</h4>
            
            <div className="summary-table">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>LKR {subtotal.toLocaleString()}</span>
              </div>
              {serviceDetails.discountAmount > 0 && (
                <div className="summary-row discount">
                  <span>Discount</span>
                  <span>-LKR {serviceDetails.discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="summary-row">
                <span>Tax (GST)</span>
                <span>LKR {serviceDetails.taxAmount.toLocaleString()}</span>
              </div>
              <div className="summary-row total">
                <span><strong>Total Amount</strong></span>
                <span><strong>LKR {finalTotal.toLocaleString()}</strong></span>
              </div>
              
              {transaction.advancePaid > 0 && (
                <>
                  <div className="summary-row advance">
                    <span>Advance Paid</span>
                    <span>LKR {transaction.advancePaid.toLocaleString()}</span>
                  </div>
                  <div className="summary-row balance">
                    <span><strong>Balance Paid</strong></span>
                    <span><strong>LKR {(finalTotal - transaction.advancePaid).toLocaleString()}</strong></span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="invoice-footer">
            <div className="footer-note">
              <p><strong>Thank you for choosing MotorTrace!</strong></p>
              <p>For any queries regarding this invoice, please contact us at the above details.</p>
              <div className="warranty-note">
                <strong>Warranty:</strong> All services come with a 30-day warranty. 
                Parts purchased from our inventory have manufacturer warranty.
              </div>
            </div>
            
            <div className="footer-signature">
              <div className="signature-line">
                <div className="signature-space"></div>
                <p className="signature-text">Authorized Signature</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;