import React from 'react';
import './EarningsCard.scss';

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

interface EarningsCardProps {
  totalEarnings: number;
  currency?: string;
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
}

const EarningsCard: React.FC<EarningsCardProps> = ({
  totalEarnings,
  currency = 'LKR',
  totalChange,
  totalChangeType,
  serviceCenterPayments,
  serviceCenterTotal,
  serviceCenterChange,
  serviceCenterChangeType,
  customerPayments,
  customerTotal,
  customerChange,
  customerChangeType,
}) => {
  return (
    <div className="earnings-card">
      <div className="earnings-card__header">
        <div className="earnings-card__title">Earnings</div>
        <div className="earnings-card__header-right">
          <div className="earnings-card__amount">
            {currency} {totalEarnings.toLocaleString()}
          </div>
          <span className={`metric-card__change metric-card__change--${totalChangeType}`}>
            {totalChangeType === 'positive' ? '↑' : '↓'} {currency} {totalChange.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="earnings-card__sections">
        <div className="earnings-card__section">
          <div className="earnings-card__section-header">
            <div className="earnings-card__section-title">Service Center</div>
            <div className="earnings-card__section-summary">
              <div className="earnings-card__amount">
                {currency} {serviceCenterTotal.toLocaleString()}
              </div>
              <span className={`metric-card__change metric-card__change--${serviceCenterChangeType}`}>
                {serviceCenterChangeType === 'positive' ? '↑' : '↓'} {currency} {serviceCenterChange.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="earnings-card__table">
            <div className="earnings-card__table-header">
              <div>Payment No</div>
              <div>Month</div>
              <div>Amount</div>
            </div>
            {serviceCenterPayments.map((payment, idx) => (
              <div key={idx} className="earnings-card__table-row">
                <div>{payment.paymentNumber}</div>
                <div>{payment.month}</div>
                <div>{currency} {payment.amount.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="earnings-card__section">
          <div className="earnings-card__section-header">
            <div className="earnings-card__section-title">Customer Payments</div>
            <div className="earnings-card__section-summary">
              <div className="earnings-card__amount">
                {currency} {customerTotal.toLocaleString()}
              </div>
              <span className={`metric-card__change metric-card__change--${customerChangeType}`}>
                {customerChangeType === 'positive' ? '↑' : '↓'} {currency} {customerChange.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="earnings-card__table">
            <div className="earnings-card__table-header">
              <div>Order No</div>
              <div>Time</div>
              <div>Amount</div>
            </div>
            {customerPayments.map((payment, idx) => (
              <div key={idx} className="earnings-card__table-row">
                <div>{payment.orderNumber}</div>
                <div>{payment.time}</div>
                <div>{currency} {payment.amount.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarningsCard;
