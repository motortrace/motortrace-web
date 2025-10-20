import React from 'react';

interface Payment {
  id: string;
  date: string;
  amount: number;
  method: string;
  status: 'completed' | 'pending' | 'failed';
}

interface PaymentsTabProps {
  payments: Payment[];
}

const PaymentsTab: React.FC<PaymentsTabProps> = ({ payments }) => {
  return (
    <div className="tab-content">
      <div className="card">
        <div className="card-header">
          <h3>Payment History</h3>
        </div>
        <div className="card-body">
          {payments && payments.length > 0 ? (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map(payment => (
                    <tr key={payment.id}>
                      <td>{payment.date}</td>
                      <td>${payment.amount.toFixed(2)}</td>
                      <td>{payment.method}</td>
                      <td>
                        <span className={`badge badge-${payment.status}`}>
                          {payment.status}
                        </span>
                      </td>
                      <td>
                        <button className="btn-icon">
                          <i className="bx bx-show"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <i className="bx bx-credit-card"></i>
              <p>No payments made yet</p>
              <span>This customer hasn't made any payments yet. Payments will appear here once they start making transactions.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentsTab;
