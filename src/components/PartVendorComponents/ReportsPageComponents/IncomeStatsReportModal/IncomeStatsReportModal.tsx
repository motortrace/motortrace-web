import React from 'react';
import './IncomeStatsReportModal.scss';
import logo from '../../../../assets/images/autoparts.png';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend, CartesianGrid
} from 'recharts';
import { Printer, Download } from 'lucide-react';

const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#6B7280'];

// Sample data - replace or extend with real data via props or API
const totalPaymentsData = [
  { name: 'Total Payments', value: 120000 },
  { name: 'Service Center Payments', value: 45000 },
  { name: 'Refunds', value: 8000 },
];

const monthlyPayments = [
  { month: 'Jan', payments: 10000 },
  { month: 'Feb', payments: 12000 },
  { month: 'Mar', payments: 11000 },
  { month: 'Apr', payments: 13000 },
  { month: 'May', payments: 12500 },
  { month: 'Jun', payments: 14000 },
  { month: 'Jul', payments: 14500 },
  { month: 'Aug', payments: 15000 },
];

const serviceCenterPaymentsMonthly = [
  { month: 'Jan', payments: 4000 },
  { month: 'Feb', payments: 4500 },
  { month: 'Mar', payments: 4200 },
  { month: 'Apr', payments: 4600 },
  { month: 'May', payments: 4300 },
  { month: 'Jun', payments: 4800 },
  { month: 'Jul', payments: 5000 },
  { month: 'Aug', payments: 5100 },
];

const refundReasons = [
  { name: 'Product Defect', value: 3000 },
  { name: 'Order Cancellation', value: 2500 },
  { name: 'Late Delivery', value: 1500 },
  { name: 'Other', value: 1000 },
];

const IncomeStatsReportModal = ({ fromDate, toDate, onClose }) => {
  const today = new Date().toLocaleDateString();

  const handleDownloadPDF = () => {
    const element = document.querySelector('.income-stats-report-modal');
    if (!element) return;

    import('html2pdf.js').then((html2pdf) => {
      html2pdf.default()
        .set({
          margin: 0.5,
          filename: `IncomeStatsReport_${fromDate}_to_${toDate}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, scrollY: 0, windowWidth: element.scrollWidth, windowHeight: element.scrollHeight },
          jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        })
        .from(element)
        .save();
    });
  };

  const formatCurrency = (num) => `LKR ${new Intl.NumberFormat().format(num.toFixed(2))}`;

  return (
    <div className="income-stats-report-modal__backdrop">
      <div className="income-stats-report-modal">
        <button className="income-stats-report-modal__close no-print" onClick={onClose}>×</button>

        <div className="income-stats-report-modal__header">
          <img src={logo} alt="Logo" className="income-stats-report-modal__logo" />
          <div className="income-stats-report-modal__shop-info">
            <h2>AutoParts HQ</h2>
            <p>Powered by MotorTrace</p>
            <p>789 Service Park, Nugegoda, Sri Lanka</p>
            <p>+94 11 234 5678</p>
            <p>support@motortrace.lk</p>
          </div>
        </div>

        <div className="income-stats-report-modal__meta">
          <h3>Income Statistics Report</h3>
          <p>{fromDate} — {toDate}</p>
          <p>Generated on {today}</p>
        </div>

        <div className="income-stats-report-modal__summary">
          {totalPaymentsData.map(({ name, value }) => (
            <div className="summary-card" key={name}>
              <h4>{name}</h4>
              <p>{formatCurrency(value)}</p>
            </div>
          ))}
        </div>

        <div className="income-stats-report-modal__section">
          <h4>Monthly Total Payments</h4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyPayments} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `${value / 1000}k`} />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              <Line type="monotone" dataKey="payments" stroke="#2563EB" strokeWidth={2} name="Total Payments" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="income-stats-report-modal__section">
          <h4>Monthly Payments by Service Centers</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={serviceCenterPaymentsMonthly} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `${value / 1000}k`} />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              <Bar dataKey="payments" fill="#10B981" name="Service Center Payments" barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="income-stats-report-modal__section">
          <h4>Refund Breakdown</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={refundReasons}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {refundReasons.map((entry, index) => (
                  <Cell key={`cell-refund-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <p><strong>Total Refunds:</strong> {formatCurrency(refundReasons.reduce((acc, r) => acc + r.value, 0))}</p>
        </div>

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

        <div className="income-stats-report-modal__actions no-print">
          <button onClick={() => window.print()}>
            <Printer size={16} style={{ marginRight: 8 }} />
            Print Report
          </button>
          <button onClick={handleDownloadPDF}>
            <Download size={16} style={{ marginRight: 8 }} />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncomeStatsReportModal;
