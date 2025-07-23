import React, { useRef } from 'react';
import html2pdf from 'html2pdf.js';
import * as XLSX from 'xlsx';
import logo from '../../../../assets/images/autoparts.png'; // adjust path
import './OrderSummaryReportModal.scss';

interface Order {
  orderNo: string;
  date: string;
  customerName: string;
  customerType: string;
  products: number;
  status: string;
  amount: number;
}

interface Props {
  fromDate: string;
  toDate: string;
  onClose: () => void;
}

const sampleOrders: Order[] = [
  { orderNo: 'ORD001', date: '2025-07-01', customerName: 'John Doe', customerType: 'Retail', products: 3, status: 'Completed', amount: 15000 },
  { orderNo: 'ORD002', date: '2025-07-02', customerName: 'Jane Smith', customerType: 'Wholesale', products: 10, status: 'Pending', amount: 45000 },
  { orderNo: 'ORD003', date: '2025-07-05', customerName: 'Bob Johnson', customerType: 'Retail', products: 2, status: 'Completed', amount: 8000 },
  { orderNo: 'ORD004', date: '2025-07-06', customerName: 'Alice Williams', customerType: 'Retail', products: 5, status: 'Completed', amount: 23000 },
  { orderNo: 'ORD005', date: '2025-07-07', customerName: 'Michael Brown', customerType: 'Wholesale', products: 12, status: 'Shipped', amount: 68000 },
  { orderNo: 'ORD006', date: '2025-07-08', customerName: 'Emily Davis', customerType: 'Retail', products: 4, status: 'Cancelled', amount: 0 },
  { orderNo: 'ORD007', date: '2025-07-09', customerName: 'Chris Wilson', customerType: 'Wholesale', products: 7, status: 'Completed', amount: 36000 },
  { orderNo: 'ORD008', date: '2025-07-10', customerName: 'Jessica Lee', customerType: 'Retail', products: 6, status: 'Pending', amount: 27000 },
  { orderNo: 'ORD009', date: '2025-07-10', customerName: 'David Martin', customerType: 'Retail', products: 3, status: 'Completed', amount: 15000 },
  { orderNo: 'ORD010', date: '2025-07-10', customerName: 'Sarah Taylor', customerType: 'Wholesale', products: 15, status: 'Completed', amount: 90000 },
];

const OrderSummaryReportModal: React.FC<Props> = ({ fromDate, toDate, onClose }) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = () => {
    if (!printRef.current) return;

    html2pdf()
      .set({
        margin: 0.5,
        filename: `OrderSummary_${fromDate}_to_${toDate}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, scrollY: 0 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' },
      })
      .from(printRef.current)
      .save();
  };

  const handleDownloadExcel = () => {
    const excelData = sampleOrders.map((order) => ({
      'Order No': order.orderNo,
      Date: order.date,
      'Customer Name': order.customerName,
      'Customer Type': order.customerType,
      'No. of Products': order.products,
      Status: order.status,
      'Amount (LKR)': order.amount,
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Order Summary');
    XLSX.writeFile(wb, `OrderSummary_${fromDate}_to_${toDate}.xlsx`);
  };

  const totalAmount = sampleOrders.reduce((sum, order) => sum + order.amount, 0);

  return (
    <div className="order-summary-report-modal__backdrop">
      <div className="order-summary-report-modal" ref={printRef}>
        <button className="modal-close" onClick={onClose} title="Close">
          &times;
        </button>

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
          <h2>Order Summary Report</h2>
          <p>
            From <strong>{fromDate}</strong> to <strong>{toDate}</strong>
          </p>
          <p>Total Orders: {sampleOrders.length}</p>
        </div>

        {/* Table */}
        <div className="modal-table-section">
          <table>
            <thead>
              <tr>
                <th>Order No</th>
                <th>Date</th>
                <th>Customer Name</th>
                <th>Customer Type</th>
                <th>No. of Products</th>
                <th>Status</th>
                <th>Amount (LKR)</th>
              </tr>
            </thead>
            <tbody>
              {sampleOrders.map((order, i) => (
                <tr key={i}>
                  <td>{order.orderNo}</td>
                  <td>{order.date}</td>
                  <td>{order.customerName}</td>
                  <td>{order.customerType}</td>
                  <td>{order.products}</td>
                  <td>{order.status}</td>
                  <td>{order.amount.toLocaleString()}</td>
                </tr>
              ))}

              {/* Total Row */}
              <tr className="total-row">
                <td colSpan={6} style={{ textAlign: 'right', fontWeight: '600' }}>
                  Total:
                </td>
                <td style={{ fontWeight: '600' }}>{totalAmount.toLocaleString()}</td>
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

        {/* Action Buttons */}
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

export default OrderSummaryReportModal;
