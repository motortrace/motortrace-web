import React, { useState } from 'react';
import './ReportHistoryTable.scss';
import { Download, Eye, Filter, CalendarDays, FileDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const reportsData = [
  {
    id: 1,
    name: 'July Orders',
    type: 'Orders',
    subtype: 'Summary',
    status: 'Completed',
    date: '2025-07-10',
    file: '/reports/july-orders.pdf',
  },
  {
    id: 2,
    name: 'Revenue Q2',
    type: 'Revenue',
    subtype: 'Stats',
    status: 'Completed',
    date: '2025-07-08',
    file: '/reports/revenue-q2.pdf',
  },
  // Additional rows for demo
  {
    id: 5,
    name: 'August Orders',
    type: 'Orders',
    subtype: 'Stats',
    status: 'Completed',
    date: '2025-08-10',
    file: '/reports/august-orders.pdf',
  },
  {
    id: 6,
    name: 'Revenue Q3',
    type: 'Revenue',
    subtype: 'Summary',
    status: 'Completed',
    date: '2025-08-08',
    file: '/reports/revenue-q3.pdf',
  },
  {
    id: 7,
    name: 'Inventory Final',
    type: 'Inventory',
    subtype: 'Summary',
    status: 'Completed',
    date: '2025-08-05',
    file: '/reports/inventory-final.pdf',
  },
  {
    id: 8,
    name: 'Customer Stats',
    type: 'Customer',
    subtype: 'Stats',
    status: 'Completed',
    date: '2025-08-01',
    file: '/reports/customer-stats.pdf',
  },

  {
    id: 11,
    name: 'Inventory Q4',
    type: 'Inventory',
    subtype: 'Stats',
    status: 'Completed',
    date: '2025-09-05',
    file: '/reports/inventory-q4.pdf',
  },
  {
    id: 12,
    name: 'Customer Q4',
    type: 'Customer',
    subtype: 'Summary',
    status: 'Completed',
    date: '2025-09-01',
    file: '/reports/customer-q4.pdf',
  },
];

interface ReportHistoryTableProps {
  onViewReport?: (report: any) => void;
}

const ReportHistoryTable: React.FC<ReportHistoryTableProps> = ({ onViewReport }) => {
  const navigate = useNavigate();
  const [type, setType] = useState('All');
  const [status, setStatus] = useState('All');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState('date');
  const [sortAsc, setSortAsc] = useState(false);

  const pageSize = 5;

  const filtered = reportsData
    .filter((r) => {
      const matchType = type === 'All' || r.type === type;
      const matchStatus = status === 'All' || r.status === status;
      const matchFrom = fromDate ? new Date(r.date) >= new Date(fromDate) : true;
      const matchTo = toDate ? new Date(r.date) <= new Date(toDate) : true;
      return matchType && matchStatus && matchFrom && matchTo;
    })
    .sort((a, b) => {
      const valA = a[sortKey as keyof typeof a];
      const valB = b[sortKey as keyof typeof b];
      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return 0;
    });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (key: string) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  return (
    <div className="report-history">
<div className="report-history__header">
  <h2>Generated Reports</h2>
  <div className="report-history__filters">
    <div className="filter">
      <Filter size={16} />
      <label>Type:</label>
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="All">All</option>
        <option value="Orders">Orders</option>
        <option value="Revenue">Revenue</option>
        <option value="Inventory">Inventory</option>
        <option value="Customer">Customer</option>
      </select>
    </div>
    <div className="filter">
      <Filter size={16} />
      <label>Status:</label>
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="All">All</option>
        <option value="Completed">Completed</option>
        <option value="In Progress">In Progress</option>
        <option value="Failed">Failed</option>
      </select>
    </div>
    <div className="filter">
      <CalendarDays size={16} />
      <label>From:</label>
      <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
    </div>
    <div className="filter">
      <CalendarDays size={16} />
      <label>To:</label>
      <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
    </div>
  </div>
</div>

      <table className="report-history__table">
        <thead>
          <tr>
            <th onClick={() => handleSort('name')}>Name</th>
            <th onClick={() => handleSort('type')}>Type</th>
            <th onClick={() => handleSort('status')}>Status</th>
            <th onClick={() => handleSort('date')}>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((report) => (
            <tr key={report.id}>
              <td>{report.name}</td>
              <td><span className="type-label">{report.type} - {report.subtype}</span></td>
              <td>
                <span className={`status-label ${report.status.toLowerCase().replace(' ', '-')}`}>{report.status}</span>
              </td>
              <td>{report.date}</td>
              <td>
                <div className="action-buttons">
                  {report.file ? (
                    <>
                      <button
                        className="action-btn"
                        onClick={() => onViewReport && onViewReport(report)}
                        title="View Report"
                        type="button"
                      >
                        <Eye size={16} />
                        View
                      </button>
                      <a
                        className="action-btn download"
                        href={report.file}
                        download
                        title="Download Report"
                      >
                        <Download size={16} />
                        Download
                      </a>
                    </>
                  ) : (
                    <span className="pending-text">Not available</span>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination - match order details table style */}
      <div className="order-details__pagination">
        <button
          className="order-details__pagination-btn"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="order-details__pagination-info">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="order-details__pagination-btn"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ReportHistoryTable;
