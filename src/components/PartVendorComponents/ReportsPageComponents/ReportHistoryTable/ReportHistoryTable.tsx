import React, { useState } from 'react';
import './ReportHistoryTable.scss';
import { Download } from 'lucide-react';
import clsx from 'clsx';

const reportsData = [
  {
    id: 1,
    name: 'July Orders',
    type: 'Orders',
    date: '2025-07-10',
    status: 'Completed',
    file: '/reports/july-orders.pdf',
  },
  {
    id: 2,
    name: 'Revenue Q2',
    type: 'Revenue',
    date: '2025-07-08',
    status: 'Completed',
    file: '/reports/revenue-q2.pdf',
  },
  {
    id: 3,
    name: 'Current Inventory',
    type: 'Inventory',
    date: '2025-07-05',
    status: 'Completed',
    file: '/reports/inventory.pdf',
  },
  {
    id: 4,
    name: 'Customer Summary',
    type: 'Customer',
    date: '2025-07-01',
    status: 'Completed',
    file: '/reports/customers.pdf',
  },
];

const typeColors: Record<string, string> = {
  Orders: 'orders',
  Revenue: 'revenue',
  Inventory: 'inventory',
  Customer: 'customer',
};

const ReportHistoryTable = () => {
  const [filterType, setFilterType] = useState('All');

  const filteredReports = filterType === 'All'
    ? reportsData
    : reportsData.filter((r) => r.type === filterType);

  return (
    <div className="report-history">
      <div className="report-history__filters">
        <div className="filter-block">
          <label>Report Type</label>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="All">All</option>
            <option value="Orders">Orders</option>
            <option value="Revenue">Revenue</option>
            <option value="Inventory">Inventory</option>
            <option value="Customer">Customer</option>
          </select>
        </div>
      </div>

      <table className="report-history__table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Date</th>
            <th>Status</th>
            <th>Download</th>
          </tr>
        </thead>
        <tbody>
          {filteredReports.map((report) => (
            <tr key={report.id}>
              <td>{report.name}</td>
              <td>
                <span className={clsx('type-pill', typeColors[report.type])}>
                  {report.type}
                </span>
              </td>
              <td>{report.date}</td>
              <td>
                <span className="status-pill completed">✔ {report.status}</span>
              </td>
              <td>
                <a href={report.file} download>
                  <Download size={16} />
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportHistoryTable;
