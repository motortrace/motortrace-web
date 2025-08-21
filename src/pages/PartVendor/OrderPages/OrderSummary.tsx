import OrderDetails from '../../../components/PartVendorComponents/OrderSummaryPageComponents/PendingOrderDetails/OrderDetails'
import OrderMetricCard from '../../../components/PartVendorComponents/OrderSummaryPageComponents/OrderMetricCard/OrderMetricCard'
import IssuanceList from '../../../components/PartVendorComponents/Issuance/IssuanceList'

const OrderSummary = () => {
    return (
        <div>
            <OrderMetricCard/>
            <IssuanceList/>
        </div>
    )
}

export default OrderSummary

// src/pages/PartVendor/OrderSummary.tsx
// import React from 'react';
// import { Outlet } from 'react-router-dom';
// import OrderMetricCard from '../../../components/PartVendorComponents/OrderSummaryPageComponents/OrderMetricCard/OrderMetricCard';

// const OrderSummary: React.FC = () => {
//   return (
//     <div className="order-summary-page">
//       <OrderMetricCard />
//       {/* Outlet will render IssuanceList at index, or IssuanceDetails when route matches /issuance/:id */}
//       <Outlet />
//     </div>
//   );
// };

// export default OrderSummary;
