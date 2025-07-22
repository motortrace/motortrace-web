import React, { useState } from 'react';

import OrderDetailsSidebar from '../../../components/PartVendorComponents/OrderSummaryPageComponents/OrderDetailsSidebar/OrderDetailsSidebar';
import OrderHeaderActions from '../../../components/PartVendorComponents/OrderSummaryPageComponents/OrderHeaderActions/OrderHeaderActions';
import OrderSummary from '../../../components/PartVendorComponents/OrderSummaryPageComponents/OrderSummary/OrderSummary';
// import ProductDetailCard from '../../../components/PartVendorComponents/OrderSummaryPageComponents/ProductDetailCard/ProductDetailCard';
// import OrderDetailsSection from '../../../components/PartVendorComponents/OrderSummaryPageComponents/OrderDetailsSection/OrderDetailsSection';
// import OrderProductList from '../../../components/PartVendorComponents/OrderSummaryPageComponents/OrderProductList/OrderProductList';
// import brakepad from '../../../assets/images/brakePads.png';
import ProductDetailsSection from '../../../components/PartVendorComponents/OrderSummaryPageComponents/ProductDetailsSection/ProductDetailsSection';
// import OrderTimeline from '../../../components/PartVendorComponents/OrderSummaryPageComponents/OrderTimeline/OrderTimeline';
// import OrderProgressTracker from '../../../components/PartVendorComponents/OrderSummaryPageComponents/OrderProgressTracker/OrderProgressTracker';
// import VendorOrderTimeline from '../../../components/PartVendorComponents/OrderSummaryPageComponents/OrderTimeline/OrderTimeline';
import OrderStatusCard from '../../../components/PartVendorComponents/OrderSummaryPageComponents/OrderStatusCard/OrderStatusCard';
import ConfirmationModal from '../../../components/PartVendorComponents/OrderSummaryPageComponents/ConfirmationModal/ConfirmationModal';



const AcceptedOrderDetailsPage = () => {
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
        console.log('Order Accepted');
        setAcceptModalOpen(false);
    };

    const confirmDecline = () => {
        console.log('Order Declined with reason:', declineReason);
        setDeclineModalOpen(false);
        setDeclineReason('');
    };


    return (
        <div>
            <OrderHeaderActions
                orderNumber="ORD-1001"
                status="Accepted"
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
                    <ProductDetailsSection orderStatus="Accepted" />
                    <OrderStatusCard
                        steps={[
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
                            // {
                            //     status: 'Packed',
                            //     date: 'July 7, 2025',
                            //     time: '9:00 AM',
                            //     details: 'Ready for dispatch',
                            // },
                            // {
                            //     status: 'Dispatched',
                            //     date: 'July 7, 2025',
                            //     time: '2:30 PM',
                            //     details: 'Shipped via ABC Logistics',
                            // },
                        ]}
                    />
                    <span
                        style={{
                            background: '#c3e3fe',
                            color: '#2563eb',
                            fontWeight: 600,
                            padding: '4px 10px',
                            borderRadius: 12,
                            fontSize: 12,
                            textAlign: 'center',
                            display: 'inline-block',
                            marginBottom: 12,
                            marginLeft: 2
                        }}
                    >
                        Accepted
                    </span>
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
        </div>
    );
};

export default AcceptedOrderDetailsPage;
