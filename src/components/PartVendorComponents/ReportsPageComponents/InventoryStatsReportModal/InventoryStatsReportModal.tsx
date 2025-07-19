import React from 'react';
import './InventoryStatsReportModal.scss';
import logo from '../../../../assets/images/autoparts.png';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend, CartesianGrid
} from 'recharts';
import { Printer, Download } from 'lucide-react';

const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#6B7280'];

// --- Sample data (replace with props or API) ---
const totalInventoryItems = 597;
const totalInventoryValue = 3_450_000; // LKR
const itemsSold = 1250;
const itemsRestocked = 720;

const stockStatus = [
  { name: 'In Stock', value: 540 },
  { name: 'Low Stock', value: 45 },
  { name: 'Out of Stock', value: 12 },
];

const monthlyRestocks = [
  { month: 'Mar', count: 50 },
  { month: 'Apr', count: 65 },
  { month: 'May', count: 70 },
  { month: 'Jun', count: 80 },
  { month: 'Jul', count: 60 },
];

const stockByCategory = [
  { category: 'Engine Parts', quantity: 220 },
  { category: 'Electrical', quantity: 180 },
  { category: 'Brakes', quantity: 90 },
  { category: 'Suspension', quantity: 75 },
];

const lowStockItems = [
  { name: 'Oil Filter', stock: 7 },
  { name: 'Brake Pads', stock: 6 },
  { name: 'Spark Plug', stock: 4 },
  { name: 'Battery', stock: 3 },
  { name: 'Air Filter', stock: 5 },
];

// New: Dead stock (items not sold in last 6 months)
const deadStock = [
  { name: 'Fuel Pump', quantity: 12 },
  { name: 'Alternator', quantity: 8 },
  { name: 'Timing Belt', quantity: 5 },
];

// New: Inventory turnover rate (times sold over period)
const inventoryTurnoverRate = 3.4;

const formatCurrency = (num) => `LKR ${new Intl.NumberFormat().format(num.toFixed(2))}`;

const InventoryStatsReportModal = ({ fromDate, toDate, onClose }) => {
  const today = new Date().toLocaleDateString();

  const handleDownloadPDF = () => {
    const element = document.querySelector('.inventory-stats-report-modal');
    if (!element) return;

    import('html2pdf.js').then((html2pdf) => {
      html2pdf.default()
        .set({
          margin: 0.5,
          filename: `InventoryStatsReport_${fromDate}_to_${toDate}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
        })
        .from(element)
        .save();
    });
  };

  return (
    <div className="income-stats-report-modal__backdrop">
      <div className="income-stats-report-modal inventory-stats-report-modal">
        <button className="income-stats-report-modal__close no-print" onClick={onClose}>×</button>

        {/* Header */}
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

        {/* Report Meta */}
        <div className="income-stats-report-modal__meta">
          <h3>Inventory Statistics Report</h3>
          <p>{fromDate} — {toDate}</p>
          <p>Generated on {today}</p>
        </div>

        {/* Summary Cards */}
        <div className="income-stats-report-modal__summary" style={{ maxWidth: 900, margin: '0 auto', display: 'flex', justifyContent: 'space-around', gap: '1rem', flexWrap: 'wrap' }}>
          <div className="summary-card">
            <h4>Total Inventory Items</h4>
            <p>{totalInventoryItems}</p>
          </div>
          <div className="summary-card">
            <h4>Total Inventory Value</h4>
            <p>{formatCurrency(totalInventoryValue)}</p>
          </div>
          <div className="summary-card">
            <h4>Items Sold (Period)</h4>
            <p>{itemsSold}</p>
          </div>
          <div className="summary-card">
            <h4>Items Restocked (Period)</h4>
            <p>{itemsRestocked}</p>
          </div>
          <div className="summary-card">
            <h4>Inventory Turnover Rate</h4>
            <p>{inventoryTurnoverRate} times</p>
          </div>
        </div>

        {/* Stock Status Pie Chart */}
        <div className="income-stats-report-modal__section" style={{ maxWidth: 420, margin: '2rem auto' }}>
          <h4>Stock Status Overview</h4>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={stockStatus}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {stockStatus.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Restocks Line Chart */}
        <div className="income-stats-report-modal__section" style={{ maxWidth: 700, margin: '0 auto' }}>
          <h4>Monthly Restocks</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlyRestocks} margin={{ top: 5, right: 20, left: 0, bottom: 0 }}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Stock by Category Bar Chart */}
        <div className="income-stats-report-modal__section" style={{ maxWidth: 700, margin: '2rem auto' }}>
          <h4>Stock by Category</h4>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={stockByCategory} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="quantity" fill="#2563EB" barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Low Stock Items Table */}
        <div className="income-stats-report-modal__section" style={{ maxWidth: 500, margin: '2rem auto' }}>
          <h4>Top Low Stock Items (Urgent Restock)</h4>
          <table className="inventory-lowstock-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ccc' }}>
                <th style={{ textAlign: 'left', padding: '8px' }}>Item</th>
                <th style={{ textAlign: 'right', padding: '8px' }}>Stock Left</th>
              </tr>
            </thead>
            <tbody>
              {lowStockItems.map(item => (
                <tr key={item.name} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '8px' }}>{item.name}</td>
                  <td style={{
                    color: item.stock <= 5 ? '#EF4444' : '#F59E0B',
                    fontWeight: 'bold',
                    padding: '8px',
                    textAlign: 'right',
                  }}>
                    {item.stock} units
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Dead Stock Table */}
        <div className="income-stats-report-modal__section" style={{ maxWidth: 500, margin: '2rem auto' }}>
          <h4>Dead Stock (No Sales for 6+ Months)</h4>
          <table className="inventory-deadstock-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ccc' }}>
                <th style={{ textAlign: 'left', padding: '8px' }}>Item</th>
                <th style={{ textAlign: 'right', padding: '8px' }}>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {deadStock.map(item => (
                <tr key={item.name} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '8px' }}>{item.name}</td>
                  <td style={{ padding: '8px', textAlign: 'right' }}>{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="modal-footer" style={{ maxWidth: 900, margin: '3rem auto' }}>
          <hr />
          <p>
            This report was system-generated using <strong>MotorTrace</strong> on {new Date().toLocaleString()}.
            <br />
            For inquiries, contact us at{' '}
            <a href="mailto:support@motortrace.lk">support@motortrace.lk</a> or call +94 11 234 5678.
          </p>
        </div>

        {/* Actions */}
        <div className="income-stats-report-modal__actions no-print" style={{ maxWidth: 900, margin: 'auto', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
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

export default InventoryStatsReportModal;
