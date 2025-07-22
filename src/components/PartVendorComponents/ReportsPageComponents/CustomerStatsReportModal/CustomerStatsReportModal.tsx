import React from 'react';
import './CustomerStatsReportModal.scss';
import logo from '../../../../assets/images/autoparts.png';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Legend } from 'recharts';
import { Printer, Download } from 'lucide-react';

const ADMIN_COLORS = ['#1a1a1a', '#666666', '#999999', '#2563EB', '#10B981', '#F59E0B', '#EF4444', '#6B7280'];

const formatNumber = (num: number) => new Intl.NumberFormat().format(num);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: '#fff',
        border: '1px solid #e0e0e0',
        borderRadius: 8,
        padding: '12px 16px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        zIndex: 1000,
        position: 'relative',
      }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a', margin: '0 0 8px 0', borderBottom: '1px solid #f0f0f0', paddingBottom: 4 }}>{label}</p>
        {payload.map((entry, idx) => (
          <p key={idx} style={{ fontSize: 13, fontWeight: 500, margin: '4px 0', color: entry.color, display: 'flex', alignItems: 'center' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: entry.color, display: 'inline-block', marginRight: 8 }} />
            {`${entry.name}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const CustomerStatsReportModal = ({ fromDate, toDate, onClose }) => {
  const today = new Date().toLocaleDateString();

  // --- Sample Data (replace with props or API data) ---
  const totalCustomers = 325;
  const newCustomers = 48;
  const activeCustomers = 190;
  const inactiveCustomers = 135;
  const repeatCustomers = 89;

  const customerTypeBreakdown = [
    { name: 'Normal Customers', value: 250 },
    { name: 'Service Centers', value: 75 },
  ];

  const topCustomers = [
    { name: 'AutoFix Nugegoda', type: 'Service Center', orders: 6, spent: 153000 },
    { name: 'Ruwantha Perera', type: 'Normal', orders: 5, spent: 128400 },
    { name: 'QuickCare Kandy', type: 'Service Center', orders: 4, spent: 117000 },
    { name: 'Isuru Pathirana', type: 'Normal', orders: 3, spent: 98000 },
    { name: 'ProCare Negombo', type: 'Service Center', orders: 4, spent: 94500 },
  ];

  const signupsByWeek = [
    { week: 'Week 1', signups: 12 },
    { week: 'Week 2', signups: 18 },
    { week: 'Week 3', signups: 11 },
    { week: 'Week 4', signups: 7 },
  ];

  const handleDownloadPDF = () => {
    const element = document.querySelector('.customer-stats-report-modal');
    if (!element) return;
    import('html2pdf.js').then((html2pdf) => {
      html2pdf.default()
        .set({
          margin: 0.5,
          filename: `CustomerStatsReport_${fromDate}_to_${toDate}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
        })
        .from(element)
        .save();
    });
  };

  return (
    <div className="inventory-stats-report-modal__backdrop">
      <div className="inventory-stats-report-modal customer-stats-report-modal">
        <button className="inventory-stats-report-modal__close no-print" onClick={onClose}>×</button>

        {/* Header */}
        <div className="inventory-stats-report-modal__header">
          <img src={logo} alt="Logo" className="logo" />
          <div>
            <h2>AutoParts HQ</h2>
            <p>Powered by MotorTrace</p>
            <p>789 Service Park, Nugegoda, Sri Lanka</p>
            <p>+94 11 234 5678</p>
            <p>support@motortrace.lk</p>
          </div>
        </div>

        {/* Meta */}
        <div className="meta">
          <h3>Customer Statistics Report</h3>
          <p>{fromDate} — {toDate}</p>
          <p>Generated on {today}</p>
        </div>

        {/* Summary Cards */}
        <div className="summary-row">
          <div className="summary-card"><h4>Total Customers</h4><p>{formatNumber(totalCustomers)}</p></div>
          <div className="summary-card"><h4>New Customers</h4><p>{formatNumber(newCustomers)}</p></div>
          <div className="summary-card"><h4>Active Customers</h4><p>{formatNumber(activeCustomers)}</p></div>
          <div className="summary-card"><h4>Inactive Customers</h4><p>{formatNumber(inactiveCustomers)}</p></div>
          <div className="summary-card"><h4>Repeat Customers</h4><p>{formatNumber(repeatCustomers)}</p></div>
        </div>

        {/* Customer Type Breakdown Pie Chart */}
        <div className="section">
          <h4>Customer Type Breakdown</h4>
          <div style={{background:'#fafafa', borderRadius:12, padding:24, border:'1px solid #e8e8e8', marginBottom:24}}>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={customerTypeBreakdown}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
              >
                {customerTypeBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={ADMIN_COLORS[index % ADMIN_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 14, fontWeight: 500 }} />
            </PieChart>
          </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Signups */}
        <div className="section">
          <h4>Customer Signups by Week</h4>
          <div style={{background:'#fafafa', borderRadius:12, padding:24, border:'1px solid #e8e8e8', marginBottom:24}}>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={signupsByWeek} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <XAxis dataKey="week" stroke="#666" fontSize={12} fontWeight={500} tick={{ fill: '#666' }} />
              <YAxis stroke="#666" fontSize={12} fontWeight={500} tick={{ fill: '#666' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: 20, fontSize: 14, fontWeight: 500 }} />
              <Bar dataKey="signups" fill="#1a1a1a" barSize={30} radius={[10,10,0,0]} />
            </BarChart>
          </ResponsiveContainer>
          </div>
        </div>

        {/* Top Customers */}
        <div className="section">
          <h4>Top 5 Customers by Spend</h4>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ddd' }}>
                <th style={{ padding: '8px' }}>Name</th>
                <th style={{ padding: '8px' }}>Type</th>
                <th style={{ padding: '8px', textAlign: 'center' }}>Orders</th>
                <th style={{ padding: '8px', textAlign: 'right' }}>Spent (LKR)</th>
              </tr>
            </thead>
            <tbody>
              {topCustomers.map((cust, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '8px' }}>{cust.name}</td>
                  <td style={{ padding: '8px' }}>{cust.type}</td>
                  <td style={{ padding: '8px', textAlign: 'center' }}>{cust.orders}</td>
                  <td style={{ padding: '8px', textAlign: 'right' }}>{formatNumber(cust.spent)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <hr />
          <p>
            Report generated by <strong>MotorTrace</strong> on {new Date().toLocaleString()}.
            <br />
            Need help? Email <a href="mailto:support@motortrace.lk">support@motortrace.lk</a> or call +94 11 234 5678.
          </p>
        </div>

        {/* Actions */}
        <div className="inventory-stats-report-modal__actions no-print">
          <button onClick={() => window.print()}>
            <Printer size={16} /> Print Report
          </button>
          <button onClick={handleDownloadPDF}>
            <Download size={16} /> Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerStatsReportModal;
