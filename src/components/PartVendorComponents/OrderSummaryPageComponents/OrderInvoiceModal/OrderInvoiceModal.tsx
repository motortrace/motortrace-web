import React from 'react';

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface OrderInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  customerName: string;
  customerAddress: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
}

const OrderInvoiceModal: React.FC<OrderInvoiceModalProps> = ({
  isOpen,
  onClose,
  invoiceNumber,
  invoiceDate,
  dueDate,
  customerName,
  customerAddress,
  items,
  subtotal,
  tax,
  total,
}) => {
  if (!isOpen) return null;

  return (
    <div className="order-invoice-modal">
      <div className="invoice-container">
        <header className="invoice-header">
          <h1>Invoice</h1>
          <div className="invoice-info">
            <div>
              <strong>Invoice #: </strong> {invoiceNumber}
            </div>
            <div>
              <strong>Invoice Date: </strong> {invoiceDate}
            </div>
            <div>
              <strong>Due Date: </strong> {dueDate}
            </div>
          </div>
        </header>

        <section className="customer-info">
          <h2>Bill To:</h2>
          <p>{customerName}</p>
          <p>{customerAddress}</p>
        </section>

        <section className="invoice-items">
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map(({ description, quantity, unitPrice, total }, idx) => (
                <tr key={idx}>
                  <td>{description}</td>
                  <td>{quantity}</td>
                  <td>${unitPrice.toFixed(2)}</td>
                  <td>${total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="invoice-summary">
          <div>
            <span>Subtotal:</span> <span>${subtotal.toFixed(2)}</span>
          </div>
          <div>
            <span>Tax:</span> <span>${tax.toFixed(2)}</span>
          </div>
          <div className="total">
            <span>Total:</span> <span>${total.toFixed(2)}</span>
          </div>
        </section>

        <footer className="invoice-footer">
          <button className="close-btn" onClick={onClose}>Close</button>
        </footer>
      </div>
    </div>
  );
};

export default OrderInvoiceModal;
