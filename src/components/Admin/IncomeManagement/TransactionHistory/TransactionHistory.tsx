import React, { useState } from 'react';
import { Search, Building2, Calendar, CreditCard, DollarSign, FileText, Banknote } from 'lucide-react';
import type { Transaction } from '../../../../pages/Admin/IncomeManagement';
import InvoiceModal from '../InvoiceModal/InvoiceModal';
import './TransactionHistory.scss';

interface TransactionHistoryProps {
  transactions: Transaction[];
  onStatusChange: (id: string, status: Transaction['paymentStatus']) => void;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions, onStatusChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentCaseFilter, setPaymentCaseFilter] = useState<string>('all');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const handleViewInvoice = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowInvoiceModal(true);
  };

  const handleCloseInvoice = () => {
    setShowInvoiceModal(false);
    setSelectedTransaction(null);
  };

  const handleStatusChange = (id: string, newStatus: Transaction['paymentStatus']) => {
    onStatusChange(id, newStatus);
  };

  const getStatusClass = (status: Transaction['paymentStatus']) => {
    const statusMap = {
      completed: 'success',
      pending: 'warning',
      cancelled: 'error',
      'no-show': 'error'
    };
    return statusMap[status] || 'default';
  };

  const getStatusLabel = (status: Transaction['paymentStatus']) => {
    const labelMap = {
      completed: 'Completed',
      pending: 'Pending',
      cancelled: 'Cancelled',
      'no-show': 'No Show'
    };
    return labelMap[status] || status;
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || transaction.paymentStatus === statusFilter;
    const matchesPaymentCase = paymentCaseFilter === 'all' || transaction.paymentCase === paymentCaseFilter;

    return matchesSearch && matchesStatus && matchesPaymentCase;
  });



  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'card':
        return <CreditCard size={16} />;
      case 'bank-transfer':
        return <Building2 size={16} />;
      case 'cash':
        return <Banknote size={16} />;
      default:
        return <DollarSign size={16} />;
    }
  };

  return (
    <div className="transaction-history">
      {/* <div className="transaction-history__header">
        <div className="transaction-history__title-section">
          <h3 className="transaction-history__title">Transaction History</h3>
          <p className="transaction-history__subtitle">
            Complete record of all customer transactions and payments
          </p>
        </div>
        
        <button className="export-button">
          <Download size={16} />
          Export Data
        </button>
      </div> */}

      <div className="transaction-filters">
        <div className="search-box">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search by customer, service, or transaction ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <div className="filter-item">
            {/* <Filter size={16} /> */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
              <option value="no-show">No Show</option>
            </select>
          </div>

          <div className="filter-item">
            <select
              value={paymentCaseFilter}
              onChange={(e) => setPaymentCaseFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Cases</option>
              <option value="normal">Normal</option>
              <option value="advance-required">Advance Required</option>
              <option value="cancelled-with-penalty">Cancelled with Penalty</option>
              <option value="no-show-no-refund">No Show (No Refund)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="transaction-table-container">
        <table className="transaction-table">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Customer</th>
              <th>Service</th>
              <th>Booking Date</th>
              <th>Status</th>
              <th>Final Amount</th>
              <th>Method</th>
              <th>Invoice</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction) => {
              
              return (
                <tr key={transaction.id} className="transaction-row">
                  <td className="transaction-id">{transaction.id}</td>
                  <td>
                    <div className="customer-info">
                      <div className="customer-name">{transaction.customerName}</div>
                      <div className="customer-id">{transaction.customerId}</div>
                    </div>
                  </td>
                  <td className="service-type">{transaction.serviceType}</td>
                  <td>
                    <div className="date-info">
                      <Calendar size={14} />
                      {new Date(transaction.bookingDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td>
                    {transaction.paymentStatus === 'pending' ? (
                      <select
                        value={transaction.paymentStatus}
                        onChange={(e) => handleStatusChange(transaction.id, e.target.value as Transaction['paymentStatus'])}
                        className="status-select"
                        aria-label={`Change status for transaction ${transaction.id}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                      </select>
                    ) : (
                      <span className={`badge badge--${getStatusClass(transaction.paymentStatus)}`}>
                        {getStatusLabel(transaction.paymentStatus)}
                      </span>
                    )}
                  </td>
                  <td className="amount final-amount">
                    LKR {transaction.finalCost.toLocaleString()}
                  </td>
                  <td>
                    {transaction.paymentStatus !== 'pending' && (
                      <div className="payment-method">
                        {getPaymentMethodIcon(transaction.paymentMethod)}
                        {transaction.paymentMethod.replace('-', ' ').toUpperCase()}
                      </div>
                    )}
                  </td>
                  <td>
                    {(transaction.paymentStatus === 'completed' && transaction.serviceDetails) && (
                      <button
                        className="invoice-button"
                        onClick={() => handleViewInvoice(transaction)}
                        title="View/Download Invoice"
                      >
                        <FileText size={16} />
                        Invoice
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredTransactions.length === 0 && (
        <div className="empty-state">
          <div className="empty-state__content">
            <div className="empty-state__icon">
              <Search size={48} />
            </div>
            <h4 className="empty-state__title">No transactions found</h4>
            <p className="empty-state__description">
              Try adjusting your search criteria or filters to find what you're looking for.
            </p>
          </div>
        </div>
      )}

      {showInvoiceModal && selectedTransaction && (
        <InvoiceModal
          transaction={selectedTransaction}
          onClose={handleCloseInvoice}
        />
      )}
    </div>
  );
};

export default TransactionHistory;