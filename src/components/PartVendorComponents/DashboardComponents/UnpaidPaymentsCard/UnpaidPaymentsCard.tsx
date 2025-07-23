import React from 'react';
import './UnpaidPaymentsCard.scss';

interface PaymentItem {
  serviceCenter: string;
  month: string;
  amount: number;
  status: 'settled' | 'reminder' | 'pending';
}

interface UnpaidPaymentsCardProps {
  payments: PaymentItem[];
}

const UnpaidPaymentsCard: React.FC<UnpaidPaymentsCardProps> = ({ payments }) => {
  return (
    <div className="unpaid-payments-card">
      <div className="unpaid-payments-card__header">
        <h3 className="unpaid-payments-card__title">Unpaid Service Center Payments</h3>
        <span className="unpaid-payments-card__count">{payments.length}</span>
      </div>
      <ul className="unpaid-payments-card__list">
        {payments.map((payment, index) => (
          <li key={index} className="unpaid-payments-card__item">
            <div className="unpaid-payments-card__info">
              <span className="unpaid-payments-card__service-center">{payment.serviceCenter}</span>
              <span className="unpaid-payments-card__month">{payment.month}</span>
            </div>
                          <span className={`badge badge--${payment.status}`}>
                {payment.status === 'settled' ? 'Settled' : payment.status === 'reminder' ? 'Reminder Sent' : 'Pending'}
              </span>
            <div style={{ textAlign: 'right' }}>
              <div className="unpaid-payments-card__amount">
                LKR {payment.amount.toLocaleString()}
              </div>
            </div>

          </li>
        ))}
      </ul>
    </div>
  );
};

export default UnpaidPaymentsCard;
