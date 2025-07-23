import React from 'react';
import IncomeSummaryMetricCard from '../../../components/PartVendorComponents/IncomePageComponents/IncomeSummaryMetricCard/IncomeSummaryMetricCard';
import EarningsDetails from '../../../components/PartVendorComponents/IncomePageComponents/EarningsDetails/EarningsDetails';

const IncomeSummaryPage = () => {
  const refunds = [
    { orderNumber: 'R001', amount: 1500, reason: 'Product Defect', type: 'customer' },
    { orderNumber: 'R002', amount: 1200, reason: 'Late Delivery', type: 'service-center' },
    { orderNumber: 'R003', amount: 2000, reason: 'Out of Stock', type: 'customer' },
        { orderNumber: 'R001', amount: 1500, reason: 'Product Defect', type: 'customer' },
    { orderNumber: 'R002', amount: 1200, reason: 'Late Delivery', type: 'service-center' },
    { orderNumber: 'R003', amount: 2000, reason: 'Out of Stock', type: 'customer' },
  ];

  const earnings = {
    totalEarnings: 153000,
    totalChange: 4500,
    totalChangeType: 'positive',
    serviceCenterPayments: [
      { paymentNumber: 'P001', month: 'June', amount: 12000 },
      { paymentNumber: 'P002', month: 'July', amount: 11000 },
      { paymentNumber: 'P003', month: 'August', amount: 18000 },
      { paymentNumber: 'P004', month: 'September', amount: 22000 },
      { paymentNumber: 'P005', month: 'October', amount: 21000 },
    ],
    serviceCenterTotal: 84000,
    serviceCenterChange: 2000,
    serviceCenterChangeType: 'positive',
    customerPayments: [
      { orderNumber: 'O123', amount: 8000, time: '12:30 AM' },
      { orderNumber: 'O124', amount: 5000, time: '3:30 PM' },
      { orderNumber: 'O125', amount: 7500, time: '9:45 AM' },
      { orderNumber: 'O126', amount: 6000, time: '11:15 AM' },
      { orderNumber: 'O127', amount: 3500, time: '4:00 PM' },
      { orderNumber: 'O128', amount: 4200, time: '6:30 PM' },
    ],
    customerTotal: 69000,
    customerChange: -500,
    customerChangeType: 'negative',
  };

  return (
    <div>
      <IncomeSummaryMetricCard earnings={earnings} refunds={refunds} />
      <EarningsDetails/>
    </div>
  );
};

export default IncomeSummaryPage;
