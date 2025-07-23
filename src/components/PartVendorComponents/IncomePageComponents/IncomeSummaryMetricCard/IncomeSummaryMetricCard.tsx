import React from 'react';
import EarningsCard from '../EarningsCard/EarningsCard';
import RefundsCard from '../RefundsCard/RefundsCard';
import './IncomeSummaryMetricCard.scss';

interface ServiceCenterPayment {
  paymentNumber: string;
  month: string;
  amount: number;
}

interface CustomerPayment {
  orderNumber: string;
  amount: number;
  time: string;
}

interface Refund {
  orderNumber: string;
  amount: number;
  reason: string;
  type: 'customer' | 'service-center';
}

interface IncomeSummaryMetricCardProps {
  earnings: {
    totalEarnings: number;
    totalChange: number;
    totalChangeType: 'positive' | 'negative';
    serviceCenterPayments: ServiceCenterPayment[];
    serviceCenterTotal: number;
    serviceCenterChange: number;
    serviceCenterChangeType: 'positive' | 'negative';
    customerPayments: CustomerPayment[];
    customerTotal: number;
    customerChange: number;
    customerChangeType: 'positive' | 'negative';
  };
  refunds: Refund[];
}

const IncomeSummaryMetricCard: React.FC<IncomeSummaryMetricCardProps> = ({ earnings, refunds }) => {
  return (
    <div className="income-summary-metric-card">
      <div className="income-summary-metric-card__earnings">
        <EarningsCard {...earnings} />
      </div>
      <div className="income-summary-metric-card__refunds">
        <RefundsCard refunds={refunds} />
      </div>
    </div>
  );
};

export default IncomeSummaryMetricCard;
