import React from 'react';
import OrderDetailsSidebar from '../../../components/PartVendorComponents/OrderSummaryPageComponents/OrderDetailsSidebar/OrderDetailsSidebar';
import OrderHeaderActions from '../../../components/PartVendorComponents/OrderSummaryPageComponents/OrderHeaderActions/OrderHeaderActions';
import OrderSummary from '../../../components/PartVendorComponents/OrderSummaryPageComponents/OrderSummary/OrderSummary';
import ProductDetailsSection from '../../../components/PartVendorComponents/OrderSummaryPageComponents/ProductDetailsSection/ProductDetailsSection';
import OrderStatusCard from '../../../components/PartVendorComponents/OrderSummaryPageComponents/OrderStatusCard/OrderStatusCard';

const FailedOrderDetailsPage = () => {
  const failureReason = 'Payment failed due to insufficient funds.';

  return (
    <div>
      <OrderHeaderActions
        orderNumber="ORD-1002"
        status="Failed"
        hideActions
      />

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px' }}>
        <div style={{ flex: '1' }}>
          {/* Failure Reason Section */}
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
            <strong>Failure Reason:</strong> {failureReason}
          </div>
          <OrderSummary
            itemsCount={2}
            subtotal={18000}
            discount={0}
            shipping={600}
            tax={300}
            total={18900}
            paymentMethod="MasterCard"
            estimatedDelivery="N/A"
          />
          <ProductDetailsSection orderStatus="Failed" />

          <OrderStatusCard
            steps={[
              {
                status: 'Order Received',
                date: 'July 8, 2025',
                time: '09:30 AM',
                details: 'Order placed successfully',
              },
              {
                status: 'Order Failed',
                date: 'July 8, 2025',
                time: '09:45 AM',
                details: 'Payment failed',
              },
            ]}
          />
        </div>
        <div style={{ flex: '0 0 260px' }}>
          <OrderDetailsSidebar
            customer={{
              name: 'Jane Smith',
              email: 'jane@example.com',
              phone: '+94 987 654 321',
            }}
            payment={{
              method: 'MasterCard',
              status: 'Failed',
            }}
            billing={{
              addressLine1: '789 Billing Lane',
              city: 'Galle',
              country: 'Sri Lanka',
            }}
            shipping={{
              addressLine1: '321 Shipping Blvd',
              city: 'Matara',
              country: 'Sri Lanka',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default FailedOrderDetailsPage; 