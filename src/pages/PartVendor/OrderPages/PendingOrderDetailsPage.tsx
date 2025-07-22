import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import OrderDetailsSidebar from '../../../components/PartVendorComponents/OrderSummaryPageComponents/OrderDetailsSidebar/OrderDetailsSidebar';
import OrderHeaderActions from '../../../components/PartVendorComponents/OrderSummaryPageComponents/OrderHeaderActions/OrderHeaderActions';
import OrderSummary from '../../../components/PartVendorComponents/OrderSummaryPageComponents/OrderSummary/OrderSummary';
import ProductDetailsSection from '../../../components/PartVendorComponents/OrderSummaryPageComponents/ProductDetailsSection/ProductDetailsSection';
import OrderStatusCard from '../../../components/PartVendorComponents/OrderSummaryPageComponents/OrderStatusCard/OrderStatusCard';
import ConfirmationModal from '../../../components/PartVendorComponents/OrderSummaryPageComponents/ConfirmationModal/ConfirmationModal';

const PendingOrderDetailsPage = () => {
  const navigate = useNavigate();

  const [acceptModalOpen, setAcceptModalOpen] = useState(false);
  const [declineModalOpen, setDeclineModalOpen] = useState(false);
  const [declineReason, setDeclineReason] = useState('');

  const handleBack = () => {
    console.log('Go back to Order Summary');
  };

  const handleAccept = () => {
    setAcceptModalOpen(true);
  };

  const handleDecline = () => {
    setDeclineModalOpen(true);
  };

  const confirmAccept = () => {
    setAcceptModalOpen(false);
    // Save state if needed here
    navigate('/PartVendor/AcceptedOrders'); // ✅ redirect to accepted order page
  };

  const confirmDecline = () => {
    setDeclineModalOpen(false);
    const state = { declineReason };
    setDeclineReason('');
    // Save state if needed here
    navigate('/PartVendor/DeclinedOrderDetailsPage', { state }); // Redirect to declined order details page with reason
  };

  return (
    <div>
      <OrderHeaderActions
        orderNumber="ORD-1001"
        status="Pending"
        onBack={handleBack}
        onAccept={handleAccept}
        onDecline={handleDecline}
      />

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px' }}>
        <div style={{ flex: '1' }}>
          <OrderSummary
            itemsCount={3}
            subtotal={30000}
            discount={1500}
            shipping={800}
            tax={500}
            total={29800}
            paymentMethod="Visa Credit Card"
            estimatedDelivery="July 13 2025"
          />
          <ProductDetailsSection orderStatus="Pending" />
          <OrderStatusCard
            steps={[
              {
                status: 'Order Received',
                date: 'July 6, 2025',
                time: '10:15 AM',
                details: 'Order placed successfully',
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
              status: 'Pending',
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

      {/* Accept Modal */}
      <ConfirmationModal
        open={acceptModalOpen}
        title="Confirm Order"
        description="Are you sure you want to confirm this order?"
        onCancel={() => setAcceptModalOpen(false)}
        onConfirm={confirmAccept}
        confirmLabel="Yes, Confirm"
      />

      {/* Decline Modal */}
      <ConfirmationModal
        open={declineModalOpen}
        title="Decline Order"
        description="Please provide a reason for declining this order."
        showReasonInput
        reason={declineReason}
        onReasonChange={setDeclineReason}
        onCancel={() => {
          setDeclineModalOpen(false);
          setDeclineReason('');
        }}
        onConfirm={confirmDecline}
        confirmLabel="Decline Order"
      />
    </div>
  );
};

export default PendingOrderDetailsPage;
