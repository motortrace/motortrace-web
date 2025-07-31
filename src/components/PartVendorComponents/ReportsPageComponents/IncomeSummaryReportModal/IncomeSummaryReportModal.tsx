import React, { useRef } from 'react';
import html2pdf from 'html2pdf.js';
import * as XLSX from 'xlsx';
import logo from '../../../../assets/images/autoparts.png'; // adjust path
import './IncomeSummaryReportModal.scss';

interface IncomeRecord {
  id: string;
  date: string;
  customer: string;
  source: 'Order Payment' | 'Monthly Payment' | 'Refund';
  type: 'Customer' | 'Service Center';
  amount: number;
}

interface Props {
  fromDate: string;
  toDate: string;
  onClose: () => void;
}

const sampleIncomes: IncomeRecord[] = [
  { id: 'INC001', date: '2025-07-01', customer: 'John Doe', source: 'Order Payment', type: 'Customer', amount: 15000 },
  { id: 'INC002', date: '2025-07-02', customer: 'FastFix Center', source: 'Monthly Payment', type: 'Service Center', amount: 5000 },
  { id: 'INC003', date: '2025-07-03', customer: 'Jane Smith', source: 'Order Payment', type: 'Customer', amount: 23000 },
  { id: 'INC004', date: '2025-07-04', customer: 'John Doe', source: 'Refund', type: 'Customer', amount: -3000 },
  { id: 'INC005', date: '2025-07-05', customer: 'Prime Auto', source: 'Monthly Payment', type: 'Service Center', amount: 6000 },
  { id: 'INC006', date: '2025-07-06', customer: 'Emily Davis', source: 'Order Payment', type: 'Customer', amount: 12000 },
  { id: 'INC007', date: '2025-07-07', customer: 'FixIt Hub', source: 'Monthly Payment', type: 'Service Center', amount: 5500 },
  { id: 'INC008', date: '2025-07-08', customer: 'Sarah Taylor', source: 'Order Payment', type: 'Customer', amount: 18000 },
  { id: 'INC009', date: '2025-07-09', customer: 'Speedy Garage', source: 'Monthly Payment', type: 'Service Center', amount: 6000 },
  { id: 'INC010', date: '2025-07-10', customer: 'Jane Smith', source: 'Refund', type: 'Customer', amount: -2000 },
];

const IncomeSummaryReportModal: React.FC<Props> = ({ fromDate, toDate, onClose }) => {
  const printRef = useRef<HTMLDivElement>(null);
  const totalAmount = sampleIncomes.reduce((sum, item) => sum + item.amount, 0);

  const handleDownloadPDF = () => {
    if (!printRef.current) return;

    html2pdf()
      .set({
        margin: 0.5,
        filename: `IncomeSummary_${fromDate}_to_${toDate}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, scrollY: 0 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' },
      })
      .from(printRef.current)
      .save();
  };

  const handleDownloadExcel = () => {
    const excelData = sampleIncomes.map((income) => ({
      'Transaction ID': income.id,
      Date: income.date,
      Customer: income.customer,
      Source: income.source,
      Type: income.type,
      'Amount (LKR)': income.amount,
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Income Summary');
    XLSX.writeFile(wb, `IncomeSummary_${fromDate}_to_${toDate}.xlsx`);
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
          <h2>Income Summary Report</h2>
          <p>
            From <strong>{fromDate}</strong> to <strong>{toDate}</strong>
          </p>
          <p>Total Transactions: {sampleIncomes.length}</p>
        </div>

        {/* Table */}
        <div className="modal-table-section">
          <table>
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Date</th>
                <th>Customer / Center</th>
                <th>Source</th>
                <th>Type</th>
                <th>Amount (LKR)</th>
              </tr>
            </thead>
            <tbody>
              {sampleIncomes.map((inc, i) => (
                <tr key={i}>
                  <td>{inc.id}</td>
                  <td>{inc.date}</td>
                  <td>{inc.customer}</td>
                  <td>{inc.source}</td>
                  <td>{inc.type}</td>
                  <td style={{ color: inc.amount < 0 ? '#dc2626' : '#374151' }}>
                    {inc.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
              <tr className="total-row">
                <td colSpan={5} style={{ textAlign: 'right' }}>
                  <strong>Total:</strong>
                </td>
                <td>
                  <strong>{totalAmount.toLocaleString()}</strong>
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
            <a href="mailto:support@motortrace.lk">support@motortrace.lk</a> or call +94 11 234
            5678.
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

export default IncomeSummaryReportModal;
