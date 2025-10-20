import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../hooks/useAuth';
import AddPaymentModal from '../modals/AddPaymentModal';

interface Payment {
  id: string;
  workOrderId: string;
  method: string;
  amount: number;
  reference?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface PaymentsTabProps {
  workOrderId: string;
  isServiceAdvisor: boolean;
}

/**
 * PaymentsTab Component
 * Displays work order payments
 */
const PaymentsTab: React.FC<PaymentsTabProps> = ({
  workOrderId,
  isServiceAdvisor
}) => {
  const { token } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);

  // Function to fetch payments
  const fetchPayments = async () => {
    if (!workOrderId || !token) {
      if (!token) {
        setError('Authentication required');
        setLoading(false);
      }
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/payments?workOrderId=${workOrderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiRes = await response.json();
      let paymentsArr = Array.isArray(apiRes.data) ? apiRes.data : [];
      setPayments(paymentsArr || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching payments:', err);
      setError('Failed to fetch payments');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [workOrderId, token]);

  if (loading) return <div className="tab-content payments-tab">Loading payments...</div>;
  if (error) return <div className="tab-content payments-tab" style={{ color: 'red' }}>{error}</div>;

  // Summary calculations
  const totalPayments = payments.length;
  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);
  const cashPayments = payments.filter(p => p.method === 'CASH').length;
  const cardPayments = payments.filter(p => p.method === 'CARD').length;

  const getMethodBadge = (method: string) => {
    const methodConfig = {
      'CASH': { bg: '#d1fae5', color: '#065f46', text: 'Cash' },
      'CARD': { bg: '#dbeafe', color: '#1e40af', text: 'Card' },
      'BANK_TRANSFER': { bg: '#fef3c7', color: '#92400e', text: 'Bank Transfer' },
      'ONLINE': { bg: '#e0e7ff', color: '#3730a3', text: 'Online' }
    };
    const config = methodConfig[method as keyof typeof methodConfig] || { bg: '#f3f4f6', color: '#374151', text: method };
    return (
      <span style={{
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: '500',
        background: config.bg,
        color: config.color
      }}>
        {config.text}
      </span>
    );
  };

  return (
    <div className="tab-content payments-tab">
      {/* Header with search and action buttons */}
      <div className="payments-header" style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
        <div className="search-container" style={{ width: '100%' }}>
          <input
            type="text"
            placeholder="Search payments..."
            className="search-input"
            style={{
              width: '100%',
              padding: '8px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px',
              outline: 'none',
              transition: 'border-color 0.2s ease'
            }}
            onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
          />
        </div>
        <div className="status-and-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
          <div className="status-info" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Status:</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span className="status-badge" style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '500', background: '#f3f4f6', color: '#374151' }}>All</span>
              <span className="status-badge" style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '500', background: '#fef3c7', color: '#92400e' }}>Pending</span>
              <span className="status-badge" style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '500', background: '#d1fae5', color: '#065f46' }}>Paid</span>
            </div>
          </div>
          <div className="action-buttons" style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setShowAddPaymentModal(true)}
              className="btn btn--secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <i className="bx bx-plus"></i>
              Record Payment
            </button>
            <button className="btn btn--primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <i className="bx bx-file"></i>
              Export Report
            </button>
          </div>
        </div>
      </div>

      <div className="payments-summary-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20, marginBottom: 24, width: '100%' }}>
        <div className="payments-summary-card" style={{ background: '#f9fafb', borderRadius: 12, padding: '18px 24px', minWidth: 0, boxShadow: '0 1px 4px #0001', border: '1px solid #e5e7eb', width: '100%' }}>
          <div style={{ color: '#6b7280', fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Total Payments</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#1f2937' }}>{totalPayments}</div>
        </div>
        <div className="payments-summary-card" style={{ background: '#f9fafb', borderRadius: 12, padding: '18px 24px', minWidth: 0, boxShadow: '0 1px 4px #0001', border: '1px solid #e5e7eb', width: '100%' }}>
          <div style={{ color: '#6b7280', fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Cash Payments</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#1f2937' }}>{cashPayments}</div>
        </div>
        <div className="payments-summary-card" style={{ background: '#f9fafb', borderRadius: 12, padding: '18px 24px', minWidth: 0, boxShadow: '0 1px 4px #0001', border: '1px solid #e5e7eb', width: '100%' }}>
          <div style={{ color: '#6b7280', fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Card Payments</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#1f2937' }}>{cardPayments}</div>
        </div>
        <div className="payments-summary-card" style={{ background: '#f9fafb', borderRadius: 12, padding: '18px 24px', minWidth: 0, boxShadow: '0 1px 4px #0001', border: '1px solid #e5e7eb', width: '100%' }}>
          <div style={{ color: '#6b7280', fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Total Amount</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#1f2937' }}>LKR{totalAmount.toFixed(2)}</div>
        </div>
      </div>

      {payments.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6b7280' }}>
          <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 16 }}>No payments found for this work order.</div>
          <div style={{ fontSize: 48, color: '#d1d5db' }}>
            <i className="bx bx-money"></i>
          </div>
        </div>
      ) : (
      <div className="payments-table-container full-width-table">
        <table className="payments-table styled-table" style={{ width: '100%', minWidth: 600, fontSize: 13, borderCollapse: 'collapse', border: '1px solid #e5e7eb', background: '#fff' }}>
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>Payment Method</th>
              <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>Amount</th>
              <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>Date</th>
              <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>Reference</th>
              <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>Notes</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => {
              return (
                <tr key={payment.id}>
                  <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb', textAlign: 'center', verticalAlign: 'middle' }}>
                    {getMethodBadge(payment.method)}
                  </td>
                  <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb', textAlign: 'center', verticalAlign: 'middle', fontWeight: '600' }}>
                    LKR{payment.amount.toFixed(2)}
                  </td>
                  <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb', textAlign: 'center', verticalAlign: 'middle' }}>
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb', textAlign: 'center', verticalAlign: 'middle' }}>
                    {payment.reference || '-'}
                  </td>
                  <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb', textAlign: 'center', verticalAlign: 'middle' }}>
                    {payment.notes || '-'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      )}

      {/* Add Payment Modal */}
      <AddPaymentModal
        show={showAddPaymentModal}
        onClose={() => setShowAddPaymentModal(false)}
        workOrderId={workOrderId}
        onPaymentAdded={fetchPayments}
      />
    </div>
  );
};

export default PaymentsTab;