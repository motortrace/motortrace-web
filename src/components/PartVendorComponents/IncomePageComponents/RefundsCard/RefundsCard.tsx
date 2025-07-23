import React from 'react';
import './RefundsCard.scss';

interface Refund {
  orderNumber: string;
  amount: number;
  reason: string;
  type: 'customer' | 'service-center';
}

interface RefundsCardProps {
  refunds: Refund[];
  currency?: string;
}

const RefundsCard: React.FC<RefundsCardProps> = ({ refunds, currency = 'LKR' }) => {
  const totalRefundAmount = refunds.reduce((sum, refund) => sum + refund.amount, 0);

  return (
    <div className="refunds-card">
      <div className="refunds-card__header">
        <div className="refunds-card__title">Refunds</div>
        <div className="refunds-card__amount">
          {currency} {totalRefundAmount.toLocaleString()}
        </div>
      </div>
      <div className="refunds-card__table">
        <div className="refunds-card__table-header">
          <div>Order No</div>
          <div>Amount</div>
          <div>Reason</div>
          <div>Type</div>
        </div>
        {refunds.map((refund, idx) => (
          <div key={idx} className="refunds-card__table-row">
            <div>{refund.orderNumber}</div>
            <div>
              {currency} {refund.amount.toLocaleString()}
            </div>
            <div>{refund.reason}</div>
            <div>
              <span
                className={`refunds-card__customer-type refunds-card__customer-type--${refund.type}`}
              >
                {refund.type === 'customer' ? 'Customer' : 'Service Center'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RefundsCard;
