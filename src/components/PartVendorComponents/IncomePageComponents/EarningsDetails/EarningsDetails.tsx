import React, { useState } from 'react';
import './EarningsDetails.scss';

interface PaymentRecord {
  id: string;
  date: string;
  paymentType: 'Order Payment' | 'Monthly Payment' | 'Refund';
  customerName: string;
  customerType: 'Customer' | 'Service Center';
  amount: string;
}

const payments: PaymentRecord[] = [
  {
    id: 'PAY-1001',
    date: '2025-07-05',
    paymentType: 'Order Payment',
    customerName: 'A. Fernando',
    customerType: 'Customer',
    amount: 'LKR 32,500',
  },
  {
    id: 'PAY-1002',
    date: '2025-07-05',
    paymentType: 'Monthly Payment',
    customerName: 'AutoFix Garage',
    customerType: 'Service Center',
    amount: 'LKR 45,000',
  },
  {
    id: 'PAY-1003',
    date: '2025-07-04',
    paymentType: 'Refund',
    customerName: 'S. Silva',
    customerType: 'Customer',
    amount: '- LKR 8,750',
  },
  {
    id: 'PAY-1004',
    date: '2025-07-03',
    paymentType: 'Order Payment',
    customerName: 'M. Perera',
    customerType: 'Service Center',
    amount: 'LKR 12,000',
  },
  {
    id: 'PAY-1005',
    date: '2025-07-02',
    paymentType: 'Monthly Payment',
    customerName: 'Speed Motors',
    customerType: 'Service Center',
    amount: 'LKR 55,000',
  },
  {
    id: 'PAY-1006',
    date: '2025-07-01',
    paymentType: 'Refund',
    customerName: 'N. Jayasinghe',
    customerType: 'Customer',
    amount: '- LKR 19,200',
  },
];

const ITEMS_PER_PAGE = 5;

const EarningsDetails: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(payments.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPayments = payments.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  return (
    <div className="earnings-details">
      <div className="earnings-details__header">
        <h2 className="earnings-details__title">Earnings Details</h2>
      </div>

      <div className="earnings-details__table">
        <div className="earnings-details__table-header">
          <div className="earnings-details__header-cell">Payment ID</div>
          <div className="earnings-details__header-cell">Date</div>
          <div className="earnings-details__header-cell">Type</div>
          <div className="earnings-details__header-cell">Customer</div>
          <div className="earnings-details__header-cell">Customer Type</div>
          <div className="earnings-details__header-cell">Amount</div>
        </div>

        <div className="earnings-details__table-body">
          {paginatedPayments.map((payment) => (
            <div key={payment.id} className="earnings-details__row">
              <div className="earnings-details__cell" data-label="Payment ID">
                {payment.id}
              </div>
              <div className="earnings-details__cell" data-label="Date">
                {payment.date}
              </div>
              <div className="earnings-details__cell" data-label="Type">
                <span
                  className={`earnings-details__payment-type earnings-details__payment-type--${payment.paymentType
                    .toLowerCase()
                    .replace(/\s+/g, '-')}`}
                >
                  {payment.paymentType}
                </span>
              </div>
              <div className="earnings-details__cell" data-label="Customer">
                {payment.customerName}
              </div>
              <div className="earnings-details__cell" data-label="Customer Type">
                <span
                  className={`earnings-details__customer-type earnings-details__customer-type--${payment.customerType
                    .toLowerCase()
                    .replace(/\s+/g, '-')}`}
                >
                  {payment.customerType}
                </span>
              </div>
              <div className="earnings-details__cell" data-label="Amount">
                {payment.amount}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="earnings-details__pagination">
        <button
          className="earnings-details__pagination-btn"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="earnings-details__pagination-info">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="earnings-details__pagination-btn"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default EarningsDetails;
