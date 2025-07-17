import React, { useState } from 'react';
import './ReportHistoryTable.scss';
import { Download, Eye } from 'lucide-react';

const reportsData = [
  {
    id: 1,
    name: 'July Orders',
    type: 'Orders',
    date: '2025-07-10',
    file: '/reports/july-orders.pdf',
  },
  {
    id: 2,
    name: 'Revenue Q2',
    type: 'Revenue',
    date: '2025-07-08',
    file: '/reports/revenue-q2.pdf',
  },
  {
    id: 3,
    name: 'Current Inventory',
    type: 'Inventory',
    date: '2025-07-05',
    file: '/reports/inventory.pdf',
  },
  {
    id: 4,
    name: 'Customer Summary',
    type: 'Customer',
    date: '2025-07-01',
    file: '/reports/customers.pdf',
  },
];

const ReportHistoryTable = () => {
  const [filterType, setFilterType] = useState('All');

  const filteredReports =
    filterType === 'All'
      ? reportsData
      : reportsData.filter((r) => r.type === filterType);

  return (
    <div className="report-history">
      <div className="report-history__header">
        <h2>Generated Reports</h2>
        <div className="report-history__filters">
          <div className="filter-block">
            <label>Report Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Orders">Orders</option>
              <option value="Revenue">Revenue</option>
              <option value="Inventory">Inventory</option>
              <option value="Customer">Customer</option>
            </select>
          </div>
        </div>
      </div>

      <table className="report-history__table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredReports.map((report) => (
            <tr key={report.id}>
              <td>{report.name}</td>
              <td>
                <span className="type-label">{report.type}</span>
              </td>
              <td>{report.date}</td>
              <td>
                <div className="action-buttons">
                  <a href={report.file} target="_blank" rel="noopener noreferrer">
                    <Eye size={16} />
                    <span>View</span>
                  </a>
                  <a href={report.file} download>
                    <Download size={16} />
                    <span>Download</span>
                  </a>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportHistoryTable;
