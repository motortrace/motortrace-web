import React from 'react';

interface GenerateInvoiceModalProps {
  show: boolean;
  onClose: () => void;
  workOrder?: any;
  invoiceDueDate: string;
  setInvoiceDueDate: (date: string) => void;
  invoiceTerms: string;
  setInvoiceTerms: (terms: string) => void;
  invoiceNotes: string;
  setInvoiceNotes: (notes: string) => void;
  isGeneratingInvoice: boolean;
  onGenerate: () => void;
}

/**
 * GenerateInvoiceModal Component
 * Modal for generating an invoice for a work order with customizable terms and notes
 */
const GenerateInvoiceModal: React.FC<GenerateInvoiceModalProps> = ({
  show,
  onClose,
  workOrder,
  invoiceDueDate,
  setInvoiceDueDate,
  invoiceTerms,
  setInvoiceTerms,
  invoiceNotes,
  setInvoiceNotes,
  isGeneratingInvoice,
  onGenerate,
}) => {
  if (!show) return null;

  const handleTermsChange = (selectedTerm: string) => {
    setInvoiceTerms(selectedTerm);
    
    // Auto-calculate due date and update notes based on payment terms
    const today = new Date();
    let daysToAdd = 14; // default
    let notesText = 'Payment due within 14 days';
    
    if (selectedTerm === 'Net 7') {
      daysToAdd = 7;
      notesText = 'Payment due within 7 days';
    } else if (selectedTerm === 'Net 14') {
      daysToAdd = 14;
      notesText = 'Payment due within 14 days';
    } else if (selectedTerm === 'Net 30') {
      daysToAdd = 30;
      notesText = 'Payment due within 30 days';
    } else if (selectedTerm === 'Net 60') {
      daysToAdd = 60;
      notesText = 'Payment due within 60 days';
    } else if (selectedTerm === 'Due on Receipt') {
      daysToAdd = 0;
      notesText = 'Payment due upon receipt of invoice';
    } else if (selectedTerm === 'COD') {
      daysToAdd = 0;
      notesText = 'Cash on Delivery - payment required at time of service';
    }
    
    const newDueDate = new Date(today);
    newDueDate.setDate(today.getDate() + daysToAdd);
    setInvoiceDueDate(newDueDate.toISOString().split('T')[0]);
    setInvoiceNotes(notesText);
  };

  return (
    <div className="manage-workorder-modal__overlay" onClick={onClose}>
      <div className="manage-workorder-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        {/* Modal Header */}
        <div className="modal-header" style={{ padding: '16px 20px' }}>
          <div className="modal-title">
            <h2 style={{ fontSize: '18px', margin: '0 0 4px 0' }}>Generate Invoice</h2>
            <p className="modal-subtitle" style={{ fontSize: '12px' }}>Set invoice details for Work Order #{workOrder?.workOrderNumber}</p>
          </div>
          <button className="close-btn" onClick={onClose} title="Close">
            <i className="bx bx-x"></i>
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          <div className="main-content" style={{ padding: '20px' }}>
            {/* Due Date */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#374151', fontSize: '13px' }}>
                Due Date <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="date"
                value={invoiceDueDate}
                onChange={(e) => setInvoiceDueDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontFamily: 'inherit'
                }}
              />
              <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#6b7280' }}>
                Select the payment due date for this invoice
              </p>
            </div>

            {/* Payment Terms */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#374151', fontSize: '13px' }}>
                Payment Terms
              </label>
              <select
                value={invoiceTerms}
                onChange={(e) => handleTermsChange(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '13px',
                  backgroundColor: 'white'
                }}
              >
                <option value="Net 7">Net 7 (Due in 7 days)</option>
                <option value="Net 14">Net 14 (Due in 14 days)</option>
                <option value="Net 30">Net 30 (Due in 30 days)</option>
                <option value="Net 60">Net 60 (Due in 60 days)</option>
                <option value="Due on Receipt">Due on Receipt</option>
                <option value="COD">Cash on Delivery (COD)</option>
              </select>
              <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#6b7280' }}>
                Due date will be automatically calculated based on selected terms
              </p>
            </div>

            {/* Notes */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontWeight: '600', color: '#374151', fontSize: '13px' }}>
                Invoice Notes
              </label>
              <textarea
                value={invoiceNotes}
                onChange={(e) => setInvoiceNotes(e.target.value)}
                placeholder="Add any notes for the customer..."
                rows={3}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '13px',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
              <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#6b7280' }}>
                These notes will appear on the invoice sent to the customer
              </p>
            </div>

            {/* Summary Info */}
            <div style={{
              background: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              padding: '12px',
              marginBottom: '18px'
            }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '13px', fontWeight: '600', color: '#374151' }}>
                Invoice Summary
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280' }}>Work Order:</span>
                  <span style={{ fontWeight: '600', color: '#1f2937' }}>#{workOrder?.workOrderNumber}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280' }}>Customer:</span>
                  <span style={{ fontWeight: '600', color: '#1f2937' }}>
                    {workOrder?.customer ? `${workOrder.customer.firstName} ${workOrder.customer.lastName}` : 'N/A'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280' }}>Vehicle:</span>
                  <span style={{ fontWeight: '600', color: '#1f2937' }}>
                    {workOrder?.vehicle ? `${workOrder.vehicle.year} ${workOrder.vehicle.make} ${workOrder.vehicle.model}` : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button 
                className="btn btn--secondary"
                onClick={onClose}
                disabled={isGeneratingInvoice}
                style={{ padding: '8px 16px', fontSize: '13px' }}
              >
                Cancel
              </button>
              <button 
                className="btn btn--primary"
                onClick={onGenerate}
                disabled={!invoiceDueDate || isGeneratingInvoice}
                style={{ 
                  opacity: (!invoiceDueDate || isGeneratingInvoice) ? 0.5 : 1,
                  cursor: (!invoiceDueDate || isGeneratingInvoice) ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  fontSize: '13px'
                }}
              >
                {isGeneratingInvoice ? (
                  <>
                    <i className="bx bx-loader-alt bx-spin" style={{ fontSize: '14px' }}></i>
                    Generating...
                  </>
                ) : (
                  <>
                    <i className="bx bx-receipt" style={{ fontSize: '14px' }}></i>
                    Generate Invoice
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateInvoiceModal;
