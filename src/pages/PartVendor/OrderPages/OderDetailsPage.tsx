import React from 'react';
import OrderHeaderActions from '../../../components/PartVendorComponents/OrderSummaryPageComponents/OrderHeaderActions/OrderHeaderActions';
import OrderDetailsSidebar from '../../../components/PartVendorComponents/OrderSummaryPageComponents/OrderDetailsSidebar/OrderDetailsSidebar';
import OrderSummary from '../../../components/PartVendorComponents/OrderSummaryPageComponents/OrderSummary/OrderSummary';
import ProductDetailCard from '../../../components/PartVendorComponents/OrderSummaryPageComponents/ProductDetailCard/ProductDetailCard';
// import OrderDetailsSection from '../../../components/PartVendorComponents/OrderSummaryPageComponents/OrderDetailsSection/OrderDetailsSection';
// import OrderProductList from '../../../components/PartVendorComponents/OrderSummaryPageComponents/OrderProductList/OrderProductList';
import brakepad from '../../../assets/images/brakePads.png';
import ProductDetailsSection from '../../../components/PartVendorComponents/OrderSummaryPageComponents/ProductDetailsSection/ProductDetailsSection';
import OrderTimeline from '../../../components/PartVendorComponents/OrderSummaryPageComponents/OrderTimeline/OrderTimeline';
import OrderProgressTracker from '../../../components/PartVendorComponents/OrderSummaryPageComponents/OrderProgressTracker/OrderProgressTracker';

const OderDetailsPage = () => {
    const handleBack = () => {
        console.log('Go back to Order Summary');
    };

    const handleAccept = () => {
        console.log('Order Accepted');
    };

    const handleDecline = () => {
        console.log('Order Declined');
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
                    <ProductDetailsSection />
<OrderProgressTracker
  steps={[
    { label: 'Order Received', status: 'completed' },
    { label: 'Order Confirmed', status: 'completed' },
    { label: 'Order Ready', status: 'current' },
    { label: 'Shipped', status: 'pending' },
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




        </div>
    );
};

export default OderDetailsPage;
