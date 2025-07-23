import React, { useState } from 'react';
import './OrderHistory.scss';

const COMMON_DELIVERY_ADDRESS = 'No. 123, Main Street, Colombo 03';
const orderHistory = [
  {
    orderId: 'ORD-1001',
    date: '2025-07-18',
    supplier: 'AutoCare Parts Pvt Ltd',
    totalAmount: 24500,
    orderStatus: 'Completed',
    paymentStatus: 'Paid',
    parts: [
      { name: 'Brake Pads', quantity: 2, unitPrice: 3500 },
      { name: 'Oil Filter', quantity: 1, unitPrice: 1200 },
      { name: 'Spark Plug', quantity: 4, unitPrice: 800 },
    ],
    deliveryAddress: COMMON_DELIVERY_ADDRESS,
    expectedDeliveryDate: '2025-07-20',
    supplierContact: {
      name: 'Ruwan Perera',
      phone: '+94 77 123 4567',
      email: 'ruwan@autocareparts.lk',
    },
    paymentMethod: 'Paid at Checkout',
    paymentDate: '2025-07-18',
  },
  {
    orderId: 'ORD-1002',
    date: '2025-07-19',
    supplier: 'Lanka Motor Spares',
    totalAmount: 13800,
    orderStatus: 'Processing',
    paymentStatus: 'Pending',
    parts: [
      { name: 'Air Filter', quantity: 1, unitPrice: 1800 },
      { name: 'Timing Belt', quantity: 1, unitPrice: 12000 },
    ],
    deliveryAddress: COMMON_DELIVERY_ADDRESS,
    expectedDeliveryDate: '2025-07-23',
    supplierContact: {
      name: 'Nimal Silva',
      phone: '+94 71 987 6543',
      email: 'nimal@lankamotors.lk',
    },
    paymentMethod: 'Pay on Delivery',
    paymentDate: '',
  },
  {
    orderId: 'ORD-1003',
    date: '2025-07-20',
    supplier: 'AutoCare Parts Pvt Ltd',
    totalAmount: 18250,
    orderStatus: 'Pending',
    paymentStatus: 'Pending',
    parts: [
      { name: 'Battery', quantity: 1, unitPrice: 15000 },
      { name: 'Wiper Blades', quantity: 2, unitPrice: 1625 },
    ],
    deliveryAddress: COMMON_DELIVERY_ADDRESS,
    expectedDeliveryDate: '2025-07-25',
    supplierContact: {
      name: 'Ruwan Perera',
      phone: '+94 77 123 4567',
      email: 'ruwan@autocareparts.lk',
    },
    paymentMethod: 'Pay on Delivery',
    paymentDate: '',
  },
  {
    orderId: 'ORD-1004',
    date: '2025-07-21',
    supplier: 'Colombo Spare Parts Center',
    totalAmount: 9200,
    orderStatus: 'Completed',
    paymentStatus: 'Paid',
    parts: [
      { name: 'Headlight Bulb', quantity: 2, unitPrice: 2300 },
      { name: 'Coolant', quantity: 2, unitPrice: 2300 },
    ],
    deliveryAddress: COMMON_DELIVERY_ADDRESS,
    expectedDeliveryDate: '2025-07-22',
    supplierContact: {
      name: 'Saman Jayasuriya',
      phone: '+94 76 555 1234',
      email: 'saman@colombospare.lk',
    },
    paymentMethod: 'Paid at Checkout',
    paymentDate: '2025-07-21',
  },
  {
    orderId: 'ORD-1005',
    date: '2025-07-22',
    supplier: 'Lanka Motor Spares',
    totalAmount: 15750,
    orderStatus: 'Processing',
    paymentStatus: 'Pending',
    parts: [
      { name: 'Clutch Plate', quantity: 1, unitPrice: 15750 },
    ],
    deliveryAddress: COMMON_DELIVERY_ADDRESS,
    expectedDeliveryDate: '2025-07-27',
    supplierContact: {
      name: 'Nimal Silva',
      phone: '+94 71 987 6543',
      email: 'nimal@lankamotors.lk',
    },
    paymentMethod: 'Pay on Delivery',
    paymentDate: '',
  },
];

const statusClass = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed': return 'order-history__status--completed';
    case 'processing': return 'order-history__status--processing';
    case 'pending': return 'order-history__status--pending';
    case 'cancelled': return 'order-history__status--cancelled';
    default: return '';
  }
};

const paymentClass = (status: string) => {
  switch (status.toLowerCase()) {
    case 'paid': return 'order-history__payment--paid';
    case 'pending': return 'order-history__payment--pending';
    default: return '';
  }
};

const sortOptions = [
  'Order Date (Newest)',
  'Order Date (Oldest)',
  'Total Amount (High-Low)',
  'Total Amount (Low-High)',
  'Status (A-Z)',
  'Status (Z-A)',
];

const statusFilters = [
  'All Statuses',
  'Pending',
  'Processing',
  'Completed',
  'Cancelled',
];

// OrderDetailsPopup component
const OrderDetailsPopup: React.FC<{
  order: typeof orderHistory[0] | null;
  isOpen: boolean;
  onClose: () => void;
}> = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2,
    }).format(amount);

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-LK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="order-popup-overlay" onClick={onClose}>
      <div className="order-popup" onClick={e => e.stopPropagation()}>
        <div className="order-popup__header">
          <h2 className="order-popup__title">Order Details</h2>
          <button className="order-popup__close-btn" onClick={onClose} aria-label="Close popup">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className="order-popup__content">
          <div className="order-popup__grid">
            <div className="order-popup__column">
              {/* Order Info */}
              <div className="order-popup__card">
                <h3 className="order-popup__card-title">Order Information</h3>
                <div className="order-popup__info-grid">
                  <div className="order-popup__info-item"><span className="order-popup__label">Order ID:</span><span className="order-popup__value">{order.orderId}</span></div>
                  <div className="order-popup__info-item"><span className="order-popup__label">Order Date:</span><span className="order-popup__value">{formatDate(order.date)}</span></div>
                  <div className="order-popup__info-item"><span className="order-popup__label">Order Status:</span><span className={`order-popup__status order-popup__status--${order.orderStatus.toLowerCase()}`}>{order.orderStatus}</span></div>
                  <div className="order-popup__info-item"><span className="order-popup__label">Payment Status:</span><span className={`order-popup__payment-status order-popup__payment-status--${order.paymentStatus.toLowerCase()}`}>{order.paymentStatus}</span></div>
                  <div className="order-popup__info-item"><span className="order-popup__label">Total Amount:</span><span className="order-popup__value">{formatCurrency(order.totalAmount)}</span></div>
                </div>
              </div>
              {/* Parts Ordered */}
              <div className="order-popup__card">
                <h3 className="order-popup__card-title">Parts Ordered</h3>
                <div className="order-popup__info-grid">
                  <div className="order-popup__info-item" style={{ fontWeight: 600, color: '#64748b' }}>
                    <span>Name</span><span>Qty × Unit Price</span>
                  </div>
                  {order.parts.map((part, idx) => (
                    <div className="order-popup__info-item" key={idx}>
                      <span className="order-popup__value">{part.name}</span>
                      <span className="order-popup__value">{part.quantity} × {formatCurrency(part.unitPrice)}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Delivery Info */}
              <div className="order-popup__card">
                <h3 className="order-popup__card-title">Delivery Information</h3>
                <div className="order-popup__info-grid">
                  <div className="order-popup__info-item"><span className="order-popup__label">Delivery Address:</span><span className="order-popup__value">{order.deliveryAddress}</span></div>
                  <div className="order-popup__info-item"><span className="order-popup__label">Expected Delivery Date:</span><span className="order-popup__value">{formatDate(order.expectedDeliveryDate)}</span></div>
                </div>
              </div>
              {/* Supplier Contact */}
              <div className="order-popup__card">
                <h3 className="order-popup__card-title">Supplier Contact</h3>
                <div className="order-popup__info-grid">
                  <div className="order-popup__info-item"><span className="order-popup__label">Name:</span><span className="order-popup__value">{order.supplierContact.name}</span></div>
                  <div className="order-popup__info-item"><span className="order-popup__label">Phone:</span><span className="order-popup__value">{order.supplierContact.phone}</span></div>
                  <div className="order-popup__info-item"><span className="order-popup__label">Email:</span><span className="order-popup__value">{order.supplierContact.email}</span></div>
                </div>
              </div>
              {/* Payment Info */}
              <div className="order-popup__card">
                <h3 className="order-popup__card-title">Payment Information</h3>
                <div className="order-popup__info-grid">
                  <div className="order-popup__info-item"><span className="order-popup__label">Payment Method:</span><span className="order-popup__value">{order.paymentMethod}</span></div>
                  <div className="order-popup__info-item"><span className="order-popup__label">Payment Date:</span><span className="order-popup__value">{order.paymentDate ? formatDate(order.paymentDate) : '-'}</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const OrderHistory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState(sortOptions[0]);
  const [statusFilter, setStatusFilter] = useState(statusFilters[0]);
  const [selectedOrder, setSelectedOrder] = useState<typeof orderHistory[0] | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // --- Filtering, Searching, Sorting Logic ---
  const filteredOrders = orderHistory.filter(order => {
    // Status filter
    if (statusFilter !== 'All Statuses' && order.orderStatus !== statusFilter) return false;
    // Search (by orderId or supplier)
    const search = searchTerm.toLowerCase();
    if (search) {
      const inOrderId = order.orderId.toLowerCase().includes(search);
      const inSupplier = order.supplier.toLowerCase().includes(search);
      return inOrderId || inSupplier;
    }
    return true;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    switch (sortOption) {
      case 'Order Date (Newest)':
        return b.date.localeCompare(a.date);
      case 'Order Date (Oldest)':
        return a.date.localeCompare(b.date);
      case 'Total Amount (High-Low)':
        return b.totalAmount - a.totalAmount;
      case 'Total Amount (Low-High)':
        return a.totalAmount - b.totalAmount;
      case 'Status (A-Z)':
        return a.orderStatus.localeCompare(b.orderStatus);
      case 'Status (Z-A)':
        return b.orderStatus.localeCompare(a.orderStatus);
      default:
        return 0;
    }
  });

  return (
    <div className="order-history">
      <div className="order-history__header">
        {/* <h2 className="order-history__main-title">Order History</h2> */}
      </div>
      {/* Search, Sort, Filter Bar */}
      <div className="search-bar" style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18 }}>
        <div className="search-content" style={{ flex: 1 }}>
          <div className="search-input-container" style={{ display: 'flex', alignItems: 'center', border: 'none', borderRadius: 12, padding: 0, background: 'white', marginTop: 8, marginBottom: 0 }}>
            <span className="search-icon" style={{ marginLeft: 6, marginRight: 6, color: '#9ca3af' }}>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search"><circle cx="8" cy="8" r="7"/><path d="m16 16-3.5-3.5"/></svg>
            </span>
            <input
              type="text"
              placeholder="Search by Order ID or Supplier..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ flex: 1, border: '2px solid #e5e7eb', outline: 'none', fontSize: 15, fontFamily: 'Poppins', background: 'transparent', color: '#374151', padding: '8px 40px' }}
            />
          </div>
          <div className="filters" style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <select
              value={sortOption}
              onChange={e => setSortOption(e.target.value)}
              style={{ padding: '10px 12px', border: '2px solid #e5e7eb', borderRadius: 8, fontSize: 14, color: '#374151', background: 'white', fontFamily: 'Poppins' }}
            >
              {sortOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              style={{ padding: '10px 12px', border: '2px solid #e5e7eb', borderRadius: 8, fontSize: 14, color: '#374151', background: 'white', fontFamily: 'Poppins' }}
            >
              {statusFilters.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="order-history__table">
        <div className="order-history__table-header">
          <div className="order-history__header-cell">ORDER ID</div>
          <div className="order-history__header-cell">ORDER DATE</div>
          <div className="order-history__header-cell">SUPPLIER</div>
          <div className="order-history__header-cell">TOTAL AMOUNT</div>
          <div className="order-history__header-cell">ORDER STATUS</div>
          <div className="order-history__header-cell">PAYMENT STATUS</div>
          <div className="order-history__header-cell">ACTIONS</div>
        </div>
        <div className="order-history__table-body">
          {sortedOrders.map((order) => (
            <div className="order-history__row" key={order.orderId}>
              <div className="order-history__cell">{order.orderId}</div>
              <div className="order-history__cell">{order.date}</div>
              <div className="order-history__cell">{order.supplier}</div>
              <div className="order-history__cell">Rs. {order.totalAmount.toLocaleString()}</div>
              <div className={`order-history__cell order-history__status ${statusClass(order.orderStatus)}`}>{order.orderStatus}</div>
              <div className={`order-history__cell order-history__payment ${paymentClass(order.paymentStatus)}`}>{order.paymentStatus}</div>
              <div className="order-history__cell">
                <button
                  className="order-history__action-btn order-history__action-btn--view"
                  onClick={() => {
                    setSelectedOrder(order);
                    setIsPopupOpen(true);
                  }}
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <OrderDetailsPopup order={selectedOrder} isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
    </div>
  );
};

export default OrderHistory; 