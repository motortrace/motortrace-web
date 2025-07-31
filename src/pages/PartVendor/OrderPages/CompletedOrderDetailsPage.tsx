import React from 'react';
import OrderHeaderActions from '../../../components/PartVendorComponents/OrderSummaryPageComponents/OrderHeaderActions/OrderHeaderActions';
import OrderSummary from '../../../components/PartVendorComponents/OrderSummaryPageComponents/OrderSummary/OrderSummary';
import ProductDetailsSection from '../../../components/PartVendorComponents/OrderSummaryPageComponents/ProductDetailsSection/ProductDetailsSection';
import OrderStatusCard from '../../../components/PartVendorComponents/OrderSummaryPageComponents/OrderStatusCard/OrderStatusCard';
import OrderDetailsSidebar from '../../../components/PartVendorComponents/OrderSummaryPageComponents/OrderDetailsSidebar/OrderDetailsSidebar';
import { Star } from 'lucide-react';

const mockOrder = {
  orderNumber: 'ORD-1001',
  itemsCount: 3,
  subtotal: 30000,
  discount: 1500,
  shipping: 800,
  tax: 500,
  total: 29800,
  paymentMethod: 'Visa Credit Card',
  estimatedDelivery: 'July 13 2025',
  customer: {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+94 123 456 789',
  },
  payment: {
    method: 'Credit Card',
    status: 'Paid',
  },
  billing: {
    addressLine1: '123 Billing Street',
    city: 'Colombo',
    country: 'Sri Lanka',
  },
  shipping: {
    addressLine1: '456 Shipping Ave',
    city: 'Kandy',
    country: 'Sri Lanka',
  },
  rating: 4, // Set to null for unrated
  comment: 'Great service and fast delivery! Highly recommended.' // Set to null or empty for no comment
};

const mockOrderStatus = [
  {
    status: 'Order Received',
    date: 'July 6, 2025',
    time: '10:15 AM',
    details: 'Order placed successfully',
  },
  {
    status: 'Order Accepted',
    date: 'July 6, 2025',
    time: '10:45 AM',
  },
  {
    status: 'Packed',
    date: 'July 7, 2025',
    time: '9:00 AM',
    details: 'Ready for dispatch',
  },
  {
    status: 'Dispatched',
    date: 'July 7, 2025',
    time: '2:30 PM',
    details: 'Shipped via ABC Logistics',
  },
  {
    status: 'Completed',
    date: 'July 10, 2025',
    time: '4:00 PM',
    details: 'Order delivered and completed',
  },
];

const CompletedOrderDetailsPage = () => {
  const { rating } = mockOrder;
  return (
    <div>
      <OrderHeaderActions
        orderNumber={mockOrder.orderNumber}
        status="Completed"
      />
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px' }}>
        <div style={{ flex: '1' }}>
          <OrderSummary
            itemsCount={mockOrder.itemsCount}
            subtotal={mockOrder.subtotal}
            discount={mockOrder.discount}
            shipping={mockOrder.shipping}
            tax={mockOrder.tax}
            total={mockOrder.total}
            paymentMethod={mockOrder.paymentMethod}
            estimatedDelivery={mockOrder.estimatedDelivery}
          />
          {/* Rating & Comment Section */}
          <div
            style={{
              marginBottom: 20,
              background: 'white',
              border: '2px solid #e5e7eb',
              borderRadius: 20,
              padding: 20,
              fontFamily: 'Poppins',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 8,
              marginTop: '20px'
            }}
          >
            <span style={{ fontSize: 16, fontWeight: 600, color: '#111827', marginBottom: 8 }}>Order Rating</span>
            {rating ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} fill={i < rating ? '#facc15' : 'none'} stroke="#facc15" />
                ))}
                <span style={{ marginLeft: 10, color: '#666', fontWeight: 500, fontSize: 15 }}>{rating} / 5</span>
              </div>
            ) : (
              <span style={{ color: '#c53e3e', fontWeight: 500, fontSize: 15 }}>Unrated</span>
            )}
            {mockOrder.comment && (
              <div style={{ marginTop: 10, width: '100%' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 4, display: 'block' }}>Customer Comment</span>
                <span style={{ fontSize: 14, color: '#374151', background: '#f8f9fa', borderRadius: 8, padding: '10px 14px', display: 'block', marginTop: 2 }}>{mockOrder.comment}</span>
              </div>
            )}
          </div>
          <ProductDetailsSection orderStatus="Completed" />
          <OrderStatusCard steps={mockOrderStatus} />
        </div>
        <div style={{ flex: '0 0 260px' }}>
          <OrderDetailsSidebar
            customer={mockOrder.customer}
            payment={mockOrder.payment}
            billing={mockOrder.billing}
            shipping={mockOrder.shipping}
          />
        </div>
      </div>
    </div>
  );
};

export default CompletedOrderDetailsPage;

