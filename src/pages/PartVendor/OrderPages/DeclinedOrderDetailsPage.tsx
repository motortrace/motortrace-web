// File: pages/PartVendorPages/OrderSummaryPages/DeclinedOrderDetailsPage.tsx

import React from 'react';
import { useLocation } from 'react-router-dom';

import OrderDetailsSidebar from '../../../components/PartVendorComponents/OrderSummaryPageComponents/OrderDetailsSidebar/OrderDetailsSidebar';
import OrderHeaderActions from '../../../components/PartVendorComponents/OrderSummaryPageComponents/OrderHeaderActions/OrderHeaderActions';
import OrderSummary from '../../../components/PartVendorComponents/OrderSummaryPageComponents/OrderSummary/OrderSummary';
import ProductDetailsSection from '../../../components/PartVendorComponents/OrderSummaryPageComponents/ProductDetailsSection/ProductDetailsSection';
import OrderStatusCard from '../../../components/PartVendorComponents/OrderSummaryPageComponents/OrderStatusCard/OrderStatusCard';

const DeclinedOrderDetailsPage = () => {
  const location = useLocation();
  const declineReason = location.state?.declineReason || 'No reason provided';

  return (
    <div>
      <OrderHeaderActions
        orderNumber="ORD-1001"
        status="Declined"
        hideActions
      />

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px' }}>
        <div style={{ flex: '1' }}>
          {/* Decline Reason Section */}
          <div style={{
            background: '#fee2e2',
            border: '1px solid #fee2e2',
            borderRadius: 6,
            padding: '16px 20px',
            margin: '0 0 20px 0',
            color: '#dc2626',
            fontWeight: 500,
            fontSize: 16,
            fontFamily: 'Poppins',
          }}>
            <strong>Decline Reason:</strong> {declineReason}
          </div>
          <OrderSummary
            itemsCount={3}
            subtotal={30000}
            discount={1500}
            shipping={800}
            tax={500}
            total={29800}
            paymentMethod="Visa Credit Card"
            estimatedDelivery="N/A"
          />
          <ProductDetailsSection orderStatus="Declined" />

          <OrderStatusCard
            steps={[
              {
                status: 'Order Received',
                date: 'July 6, 2025',
                time: '10:15 AM',
                details: 'Order placed successfully',
              },
              {
                status: 'Order Declined',
                date: 'July 7, 2025',
                time: '11:00 AM',
                details: 'Declined by Vendor',
              },
            ]}
          />
        </div>
        <div style={{ flex: '0 0 260px' }}>
          <OrderDetailsSidebar
            customer={{
              name: 'John Doe',
              email: 'john@example.com',
              phone: '+94 123 456 789',
            }}
            payment={{
              method: 'Credit Card',
              status: 'Declined',
            }}
            billing={{
              addressLine1: '123 Billing Street',
              city: 'Colombo',
              country: 'Sri Lanka',
            }}
            shipping={{
              addressLine1: '456 Shipping Ave',
              city: 'Kandy',
              country: 'Sri Lanka',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DeclinedOrderDetailsPage;