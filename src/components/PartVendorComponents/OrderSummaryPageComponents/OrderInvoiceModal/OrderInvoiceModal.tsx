import React from 'react';
import './OrderInvoiceModal.scss';
import logo from '../../../../assets/images/autoparts.png';
import barcode from '../../../../assets/images/qrcode.png';

const OrderInvoiceModal: React.FC = () => {
  const visible = true;
  const onClose = () => window.alert('Close clicked (demo mode)');

  const products = [
    {
      name: 'Brake Pads',
      description: 'Front brake pads for Toyota Corolla',
      quantity: 2,
      price: 7500,
      markedStatus: 'shippable',
    },
    {
      name: 'Engine Oil',
      description: '5W-30 Fully Synthetic 4L',
      quantity: 1,
      price: 8500,
      markedStatus: 'not-shippable',
      reason: 'Out of stock - refunded',
    },
  ];

  const orderNumber = 'SL-ORD-20250714-001';
  const orderDate = '2025-07-14';
  const customerName = 'Kasun Perera';
  const customerEmail = 'kasun.perera@gmail.com';
  const customerPhone = '+94 77 123 4567';
  const billingAddress = '123 Galle Road, Colombo 03, Sri Lanka';
  const shippingAddress = '456 Kandy Road, Peradeniya, Sri Lanka';

  if (!visible) return null;

  const subtotal = products.reduce((acc, p) => acc + p.price * p.quantity, 0);
  const shippingCost = 1000;
  const total = subtotal + shippingCost;

  return (
    <div className="order-invoice-modal">
      <div className="order-invoice-modal__card" id="invoice-content">
        {/* Header */}
        <div className="order-invoice-modal__header">
          <img src={logo} alt="Logo" className="order-invoice-modal__logo" />
          <div className="order-invoice-modal__shop-info">
            <h2>AutoParts HQ</h2>
            <p>789 Service Park, Nugegoda, Sri Lanka</p>
            <p>+94 11 234 5678</p>
            <p>support@autopartshq.lk</p>
          </div>
        </div>

        <div className="order-invoice-modal__divider" />

        {/* Invoice Meta */}
        <div className="order-invoice-modal__section">
          <div className="order-invoice-modal__info"><span>Order Number:</span><span>{orderNumber}</span></div>
          <div className="order-invoice-modal__info"><span>Order Date:</span><span>{orderDate}</span></div>
        </div>

        <div className="order-invoice-modal__divider" />

        {/* Customer Info */}
        <div className="order-invoice-modal__section">
          <h4 className="order-invoice-modal__section-title">Customer Information</h4>
          <div className="order-invoice-modal__info"><span>Name:</span><span>{customerName}</span></div>
          <div className="order-invoice-modal__info"><span>Email:</span><span>{customerEmail}</span></div>
          <div className="order-invoice-modal__info"><span>Phone:</span><span>{customerPhone}</span></div>
        </div>

        <div className="order-invoice-modal__divider" />

        {/* Addresses */}
        <div className="order-invoice-modal__section order-invoice-modal__addresses">
          <div>
            <h4>Billing Address</h4>
            <p>{billingAddress}</p>
          </div>
          <div>
            <h4>Shipping Address</h4>
            <p>{shippingAddress}</p>
          </div>
        </div>

        <div className="order-invoice-modal__divider" />

        {/* Product Table */}
        <div className="order-invoice-modal__section">
          <h4 className="order-invoice-modal__section-title">Order Summary</h4>
          <table className="order-invoice-modal__table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Description</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Status</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, i) => (
                <tr key={i}>
                  <td>{product.name}</td>
                  <td>{product.description || '-'}</td>
                  <td>{product.quantity}</td>
                  <td>LKR {product.price.toLocaleString()}</td>
                  <td>
                    {product.markedStatus === 'shippable' ? 'Shippable' : 'Refunded'}
                    {product.reason && <div className="order-invoice-modal__reason">{product.reason}</div>}
                  </td>
                  <td>LKR {(product.price * product.quantity).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="order-invoice-modal__divider" />

        {/* Totals */}
        <div className="order-invoice-modal__totals">
          <div><span>Subtotal:</span><span>LKR {subtotal.toLocaleString()}</span></div>
          <div><span>Shipping:</span><span>LKR {shippingCost.toLocaleString()}</span></div>
          <div className="order-invoice-modal__total"><span>Total:</span><span>LKR {total.toLocaleString()}</span></div>
        </div>

        <div className="order-invoice-modal__divider" />

        {/* Signature Line */}
        <div className="order-invoice-modal__signatures">
          <div className="signature-box">
            <div className="signature-line" />
            <div className="signature-label">Seller Signature</div>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="order-invoice-modal__qr-section">
          <img src={barcode} alt="Order Tracking QR Code" />
          <span>Scan To Rate Your Order</span>
        </div>

        {/* Footer Note */}
        <div className="order-invoice-modal__footer-note">
          <p>
            <strong>Terms & Conditions:</strong> All items are sold in accordance with Sri Lankan consumer protection laws.
            Prices may vary based on stock and availability. Goods once sold can be returned within 14 days in original condition.
            Refunds take up to 7 working days. Shipping charges are non-refundable.
          </p>
          <p>
            For queries or assistance, contact us at <strong>support@autopartshq.lk</strong>.
          </p>
          <p className="order-invoice-modal__thank-you">Thank you for shopping with AutoParts HQ!</p>
        </div>

        {/* Action Buttons */}
        <div className="order-invoice-modal__footer no-print">
          <button className="btn btn-outline" onClick={onClose}>Close</button>
          <button className="btn btn-primary" onClick={() => window.print()}>Print Invoice</button>
        </div>
      </div>
    </div>
  );
};

export default OrderInvoiceModal;
