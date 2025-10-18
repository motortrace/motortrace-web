import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../hooks/useAuth';
import type { Invoice } from '../../types';

interface PaymentsTabProps {
  workOrderId: string;
  isServiceAdvisor: boolean;
}

/**
 * PaymentsTab Component
 * Displays work order invoices with API integration
 */
const PaymentsTab: React.FC<PaymentsTabProps> = ({
  workOrderId,
  isServiceAdvisor
}) => {
  const { token } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Function to fetch invoices (extracted for reuse)
  const fetchInvoices = async () => {
    if (!workOrderId || !token) {
      if (!token) {
        setError('Authentication required');
        setLoading(false);
      }
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/invoices/work-order/${workOrderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiRes = await response.json();
      let invoicesArr = Array.isArray(apiRes.data) ? apiRes.data : [];
      setInvoices(invoicesArr || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching invoices:', err);
      setError('Failed to fetch invoices');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [workOrderId, token]);

  // Function to mark invoice as paid
  const markAsPaid = async (invoiceId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/invoices/${invoiceId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'PAID' })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Refresh the invoices list
      fetchInvoices();
    } catch (err) {
      console.error('Error marking invoice as paid:', err);
      setError('Failed to mark invoice as paid');
    }
  };

  // Function to generate payment link
  const generatePaymentLink = async (invoiceId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/invoices/${invoiceId}/payment-link`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // Copy the link to clipboard or show it
      navigator.clipboard.writeText(data.paymentLink);
      alert('Payment link copied to clipboard!');
    } catch (err) {
      console.error('Error generating payment link:', err);
      setError('Failed to generate payment link');
    }
  };

  if (loading) return <div className="tab-content payments-tab">Loading payments...</div>;
  if (error) return <div className="tab-content payments-tab" style={{ color: 'red' }}>{error}</div>;

  // Summary calculations
  const totalInvoices = invoices.length;
  const sentInvoices = invoices.filter(i => i.status === 'SENT').length;
  const paidInvoices = invoices.filter(i => i.status === 'PAID').length;
  const totalAmount = invoices.reduce((sum, i) => sum + i.totalAmount, 0);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'DRAFT': { bg: '#f3f4f6', color: '#374151', text: 'Draft' },
      'SENT': { bg: '#dbeafe', color: '#1e40af', text: 'Sent' },
      'PAID': { bg: '#d1fae5', color: '#065f46', text: 'Paid' },
      'OVERDUE': { bg: '#fee2e2', color: '#991b1b', text: 'Overdue' },
      'CANCELLED': { bg: '#f3f4f6', color: '#374151', text: 'Cancelled' }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.DRAFT;
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
          <div style={{ color: '#6b7280', fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Total Invoices</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#1f2937' }}>{totalInvoices}</div>
        </div>
        <div className="payments-summary-card" style={{ background: '#f9fafb', borderRadius: 12, padding: '18px 24px', minWidth: 0, boxShadow: '0 1px 4px #0001', border: '1px solid #e5e7eb', width: '100%' }}>
          <div style={{ color: '#6b7280', fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Paid</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#1f2937' }}>{paidInvoices}</div>
        </div>
        <div className="payments-summary-card" style={{ background: '#f9fafb', borderRadius: 12, padding: '18px 24px', minWidth: 0, boxShadow: '0 1px 4px #0001', border: '1px solid #e5e7eb', width: '100%' }}>
          <div style={{ color: '#6b7280', fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Sent</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#1f2937' }}>{sentInvoices}</div>
        </div>
        <div className="payments-summary-card" style={{ background: '#f9fafb', borderRadius: 12, padding: '18px 24px', minWidth: 0, boxShadow: '0 1px 4px #0001', border: '1px solid #e5e7eb', width: '100%' }}>
          <div style={{ color: '#6b7280', fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Total Amount</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#1f2937' }}>LKR{totalAmount.toFixed(2)}</div>
        </div>
      </div>

      {invoices.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6b7280' }}>
          <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 16 }}>No invoices found for this work order.</div>
          <div style={{ fontSize: 48, color: '#d1d5db' }}>
            <i className="bx bx-file"></i>
          </div>
        </div>
      ) : (
      <div className="payments-table-container full-width-table">
        <table className="payments-table styled-table" style={{ width: '100%', minWidth: 600, fontSize: 13, borderCollapse: 'collapse', border: '1px solid #e5e7eb', background: '#fff' }}>
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>Invoice Number</th>
              <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>Issue Date</th>
              <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>Due Date</th>
              <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>Status</th>
              <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>Total Amount</th>
              <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => {
              return (
                <tr key={invoice.id}>
                  <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb', textAlign: 'center', verticalAlign: 'middle' }}>
                    {invoice.invoiceNumber}
                  </td>
                  <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb', textAlign: 'center', verticalAlign: 'middle' }}>
                    {new Date(invoice.issueDate).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb', textAlign: 'center', verticalAlign: 'middle' }}>
                    {new Date(invoice.dueDate).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb', textAlign: 'center', verticalAlign: 'middle' }}>
                    {getStatusBadge(invoice.status)}
                  </td>
                  <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb', textAlign: 'center', verticalAlign: 'middle', fontWeight: '600' }}>
                    LKR{invoice.totalAmount.toFixed(2)}
                  </td>
                  <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb', textAlign: 'center', verticalAlign: 'middle' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      {(invoice.status === 'SENT' || invoice.status === 'OVERDUE') && (
                        <button
                          onClick={() => markAsPaid(invoice.id)}
                          style={{
                            padding: '4px 8px',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px',
                            background: '#f9fafb',
                            color: '#374151',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          Mark as Paid
                        </button>
                      )}
                      {invoice.status !== 'PAID' && (
                        <button
                          onClick={() => generatePaymentLink(invoice.id)}
                          style={{
                            padding: '4px 8px',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px',
                            background: '#3b82f6',
                            color: '#fff',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          Generate Link
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      )}
    </div>
  );
};

export default PaymentsTab;