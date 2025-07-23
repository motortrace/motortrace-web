import React from 'react';
import './RecentTransactions.scss';

interface Transaction {
  id: string;
  date: string;
  amount: number;
  paymentName: string;
  method: string;
  category: string;
  logo?: string;
}

interface RecentTransactionsProps {
  transactions?: Transaction[];
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ 
  transactions = [
    {
      id: '1',
      date: '25 Jul 12:30',
      amount: -10,
      paymentName: 'YouTube',
      method: 'VISA **3254',
      category: 'Subscription',
      logo: '🔴'
    },
    {
      id: '2',
      date: '26 Jul 15:00',
      amount: -150,
      paymentName: 'Reserved',
      method: 'Mastercard **2154',
      category: 'Shopping',
      logo: '••••••'
    },
    {
      id: '3',
      date: '27 Jul 9:00',
      amount: -80,
      paymentName: 'Yaposhka',
      method: 'Mastercard **2154',
      category: 'Cafe & Restaurants',
      logo: '🍑'
    }
  ]
}) => {
  return (
    <div className="recent-transactions">
      <div className="recent-transactions__header">
        <h2 className="recent-transactions__title">Recent transactions</h2>
        <div className="recent-transactions__controls">
          <button className="recent-transactions__dropdown">
            All accounts
            <svg className="recent-transactions__dropdown-icon" width="16" height="16" viewBox="0 0 16 16">
              <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
          </button>
          <button className="recent-transactions__see-all">
            See all
            <svg className="recent-transactions__arrow" width="16" height="16" viewBox="0 0 16 16">
              <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="2" fill="none"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="recent-transactions__table">
        <div className="recent-transactions__table-header">
          <div className="recent-transactions__header-cell">DATE</div>
          <div className="recent-transactions__header-cell">AMOUNT</div>
          <div className="recent-transactions__header-cell">PAYMENT NAME</div>
          <div className="recent-transactions__header-cell">METHOD</div>
          <div className="recent-transactions__header-cell">CATEGORY</div>
        </div>

        <div className="recent-transactions__table-body">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="recent-transactions__row">
              <div className="recent-transactions__cell recent-transactions__date">
                {transaction.date}
              </div>
              <div className="recent-transactions__cell recent-transactions__amount">
                {transaction.amount < 0 ? '-' : ''}${Math.abs(transaction.amount)}
              </div>
              <div className="recent-transactions__cell recent-transactions__payment">
                <div className="recent-transactions__payment-content">
                  <span className="recent-transactions__payment-name">{transaction.paymentName}</span>
                </div>
              </div>
              <div className="recent-transactions__cell recent-transactions__method">
                {transaction.method}
              </div>
              <div className="recent-transactions__cell recent-transactions__category">
                {transaction.category}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentTransactions;