import React, { useRef } from 'react';
import html2pdf from 'html2pdf.js';
import * as XLSX from 'xlsx';
import logo from '../../../../assets/images/autoparts.png';
import '../IncomeSummaryReportModal/IncomeSummaryReportModal.scss';

interface CustomerRecord {
  id: string;
  name: string;
  type: 'Customer' | 'Service Center';
  totalOrders: number;
  totalSpent: number;
  lastOrder: string;
}

interface Props {
  fromDate: string;
  toDate: string;
  onClose: () => void;
}

const sampleCustomers: CustomerRecord[] = [
  { id: 'CUST001', name: 'John Doe', type: 'Customer', totalOrders: 12, totalSpent: 150000, lastOrder: '2025-07-09' },
  { id: 'CUST002', name: 'FastFix Center', type: 'Service Center', totalOrders: 8, totalSpent: 95000, lastOrder: '2025-07-08' },
  { id: 'CUST003', name: 'Jane Smith', type: 'Customer', totalOrders: 10, totalSpent: 120000, lastOrder: '2025-07-07' },
  { id: 'CUST004', name: 'Prime Auto', type: 'Service Center', totalOrders: 6, totalSpent: 80000, lastOrder: '2025-07-06' },
  { id: 'CUST005', name: 'Emily Davis', type: 'Customer', totalOrders: 7, totalSpent: 70000, lastOrder: '2025-07-05' },
];

const CustomerSummaryReportModal: React.FC<Props> = ({ fromDate, toDate, onClose }) => {
  const printRef = useRef<HTMLDivElement>(null);
  const totalSpent = sampleCustomers.reduce((sum, item) => sum + item.totalSpent, 0);

  const handleDownloadPDF = () => {
    if (!printRef.current) return;
    html2pdf()
      .set({
        margin: 0.5,
        filename: `CustomerSummary_${fromDate}_to_${toDate}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, scrollY: 0 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' },
      })
      .from(printRef.current)
      .save();
  };

  const handleDownloadExcel = () => {
    const excelData = sampleCustomers.map((cust) => ({
      'Customer ID': cust.id,
      Name: cust.name,
      Type: cust.type,
      'Total Orders': cust.totalOrders,
      'Total Spent (LKR)': cust.totalSpent,
      'Last Order': cust.lastOrder,
    }));
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Customer Summary');
    XLSX.writeFile(wb, `CustomerSummary_${fromDate}_to_${toDate}.xlsx`);
  };

  return (
    <div className="order-summary-report-modal__backdrop">
      <div className="order-summary-report-modal" ref={printRef}>
        {/* Header */}
        <div className="orders-report-modal__header">
          <img src={logo} alt="Logo" className="orders-report-modal__logo" />
          <div className="orders-report-modal__shop-info">
            <h2>AutoParts HQ</h2>
            <p>Powered by MotorTrace</p>
            <p>789 Service Park, Nugegoda, Sri Lanka</p>
            <p>+94 11 234 5678</p>
            <p>support@motortrace.lk</p>
          </div>
        </div>

        {/* Report Title */}
        <div className="modal-header">
          <h2>Customer Summary Report</h2>
          <p>
            From <strong>{fromDate}</strong> to <strong>{toDate}</strong>
          </p>
          <p>Total Customers: {sampleCustomers.length}</p>
        </div>

        {/* Table */}
        <div className="modal-table-section">
          <table>
            <thead>
              <tr>
                <th>Customer ID</th>
                <th>Name</th>
                <th>Type</th>
                <th>Total Orders</th>
                <th>Total Spent (LKR)</th>
                <th>Last Order</th>
              </tr>
            </thead>
            <tbody>
              {sampleCustomers.map((cust, i) => (
                <tr key={i}>
                  <td>{cust.id}</td>
                  <td>{cust.name}</td>
                  <td>{cust.type}</td>
                  <td>{cust.totalOrders}</td>
                  <td>{cust.totalSpent.toLocaleString()}</td>
                  <td>{cust.lastOrder}</td>
                </tr>
              ))}
              <tr className="total-row">
                <td colSpan={4} style={{ textAlign: 'right' }}>
                  <strong>Total Spent:</strong>
                </td>
                <td colSpan={2}>
                  <strong>{totalSpent.toLocaleString()}</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <hr />
          <p>
            This report was system-generated using <strong>MotorTrace</strong> on{' '}
            {new Date().toLocaleString()}.
            <br />
            For inquiries, contact us at{' '}
            <a href="mailto:support@motortrace.lk">support@motortrace.lk</a> or call +94 11 234 5678.
          </p>
        </div>

        {/* Actions */}
        <div className="modal-actions">
          <button onClick={onClose}>Close</button>
          <button className="dark-button" onClick={handleDownloadPDF}>
            Export as PDF
          </button>
          <button className="dark-button" onClick={handleDownloadExcel}>
            Export as Excel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerSummaryReportModal;
