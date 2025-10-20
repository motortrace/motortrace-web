import React, { useState } from 'react';
import { X, CreditCard, Banknote, Building2, FileText } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  workOrder: {
    id: string;
    workOrderNumber: string;
    customerName: string;
    vehicle: string;
    serviceType: string;
    totalAmount: number;
    paidAmount: number;
    remainingAmount: number;
    completedDate: string;
  };
  onSubmit: (paymentData: any) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  workOrder,
  onSubmit
}) => {
  const [paymentData, setPaymentData] = useState({
    method: 'CASH',
    amount: workOrder.remainingAmount,
    reference: '',
    notes: '',
    processedById: '', // This should be set to current user ID
    paymentImage: ''
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get current user ID (you might need to implement this based on your auth system)
      const currentUserId = localStorage.getItem('userId') || 'admin-user-id';

      await onSubmit({
        ...paymentData,
        processedById: currentUserId
      });
    } catch (error) {
      console.error('Payment submission failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setPaymentData({
      ...paymentData,
      [e.target.name]: e.target.value
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const paymentMethods = [
    { value: 'CASH', label: 'Cash', icon: Banknote },
    { value: 'CREDIT_CARD', label: 'Credit Card', icon: CreditCard },
    { value: 'DEBIT_CARD', label: 'Debit Card', icon: CreditCard },
    { value: 'BANK_TRANSFER', label: 'Bank Transfer', icon: Building2 },
    { value: 'CHEQUE', label: 'Cheque', icon: FileText }
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'white',
        borderRadius: 12,
        padding: 32,
        minWidth: 500,
        maxWidth: 600,
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 4px 24px rgba(0,0,0,0.15)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 24, color: '#0ea5e9' }}>
            Process Payment
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 8,
              borderRadius: 6,
              color: '#6b7280'
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Work Order Summary */}
        <div style={{
          background: '#f8fafc',
          padding: 20,
          borderRadius: 8,
          marginBottom: 24,
          border: '1px solid #e5e7eb'
        }}>
          <h3 style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 16, marginBottom: 12, color: '#374151' }}>
            Work Order Details
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 14 }}>
            <div>
              <strong>Work Order:</strong> {workOrder.workOrderNumber}
            </div>
            <div>
              <strong>Customer:</strong> {workOrder.customerName}
            </div>
            <div>
              <strong>Vehicle:</strong> {workOrder.vehicle}
            </div>
            <div>
              <strong>Service:</strong> {workOrder.serviceType}
            </div>
            <div>
              <strong>Total Amount:</strong> {formatCurrency(workOrder.totalAmount)}
            </div>
            <div>
              <strong>Paid Amount:</strong> {formatCurrency(workOrder.paidAmount)}
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <strong style={{ color: '#dc2626' }}>Remaining Amount:</strong> {formatCurrency(workOrder.remainingAmount)}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Payment Method */}
          <div style={{ marginBottom: 20 }}>
            <label style={{
              display: 'block',
              fontFamily: 'Poppins',
              fontWeight: 500,
              fontSize: 14,
              color: '#374151',
              marginBottom: 8
            }}>
              Payment Method *
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 8 }}>
              {paymentMethods.map((method) => {
                const IconComponent = method.icon;
                return (
                  <button
                    key={method.value}
                    type="button"
                    onClick={() => setPaymentData({ ...paymentData, method: method.value })}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '12px 16px',
                      border: `2px solid ${paymentData.method === method.value ? '#0ea5e9' : '#e5e7eb'}`,
                      borderRadius: 8,
                      background: paymentData.method === method.value ? '#f0f9ff' : 'white',
                      cursor: 'pointer',
                      fontFamily: 'Poppins',
                      fontSize: 14,
                      color: paymentData.method === method.value ? '#0ea5e9' : '#374151'
                    }}
                  >
                    <IconComponent size={16} />
                    {method.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Payment Amount */}
          <div style={{ marginBottom: 20 }}>
            <label style={{
              display: 'block',
              fontFamily: 'Poppins',
              fontWeight: 500,
              fontSize: 14,
              color: '#374151',
              marginBottom: 8
            }}>
              Payment Amount (LKR) *
            </label>
            <input
              type="number"
              name="amount"
              value={paymentData.amount}
              onChange={handleChange}
              min={0}
              max={workOrder.remainingAmount}
              step={0.01}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e5e7eb',
                borderRadius: 8,
                fontSize: 16,
                fontFamily: 'Poppins',
                outline: 'none'
              }}
              required
            />
            <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
              Maximum amount: {formatCurrency(workOrder.remainingAmount)}
            </div>
          </div>

          {/* Reference/Receipt Number */}
          <div style={{ marginBottom: 20 }}>
            <label style={{
              display: 'block',
              fontFamily: 'Poppins',
              fontWeight: 500,
              fontSize: 14,
              color: '#374151',
              marginBottom: 8
            }}>
              Reference/Receipt Number
            </label>
            <input
              type="text"
              name="reference"
              value={paymentData.reference}
              onChange={handleChange}
              placeholder="Enter receipt number or reference"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e5e7eb',
                borderRadius: 8,
                fontSize: 16,
                fontFamily: 'Poppins',
                outline: 'none'
              }}
            />
          </div>

          {/* Notes */}
          <div style={{ marginBottom: 24 }}>
            <label style={{
              display: 'block',
              fontFamily: 'Poppins',
              fontWeight: 500,
              fontSize: 14,
              color: '#374151',
              marginBottom: 8
            }}>
              Notes
            </label>
            <textarea
              name="notes"
              value={paymentData.notes}
              onChange={handleChange}
              placeholder="Additional notes about the payment"
              rows={3}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid #e5e7eb',
                borderRadius: 8,
                fontSize: 14,
                fontFamily: 'Poppins',
                outline: 'none',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '12px 24px',
                border: '2px solid #e5e7eb',
                borderRadius: 8,
                background: 'white',
                color: '#6b7280',
                fontFamily: 'Poppins',
                fontWeight: 500,
                cursor: 'pointer'
              }}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '12px 24px',
                border: 'none',
                borderRadius: 8,
                background: '#0ea5e9',
                color: 'white',
                fontFamily: 'Poppins',
                fontWeight: 500,
                cursor: 'pointer',
                opacity: loading ? 0.7 : 1
              }}
              disabled={loading}
            >
              {loading ? 'Processing...' : `Process Payment - ${formatCurrency(paymentData.amount)}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;