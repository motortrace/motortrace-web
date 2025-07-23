import React from 'react';
import './OrdersReportModal.scss';
import logo from '../../../../assets/images/autoparts.png';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend, CartesianGrid
} from 'recharts';
import { Printer, Download } from 'lucide-react'; 

const fulfillmentData = [
  { name: 'Shipped', value: 75.4 },
  { name: 'Processing', value: 18.4 },
  { name: 'Cancelled', value: 6.1 }
];

const paymentTypeData = [
  { name: 'Immediate (Website)', value: 905 },
  { name: 'End of Month (Service Centers)', value: 437 }
];

const orderTrend = [
  { day: 'Jul 1', orders: 112 },
  { day: 'Jul 2', orders: 125 },
  { day: 'Jul 3', orders: 132 },
  { day: 'Jul 4', orders: 90 },
  { day: 'Jul 5', orders: 142 },
  { day: 'Jul 6', orders: 100 },
  { day: 'Jul 7', orders: 138 },
  { day: 'Jul 8', orders: 115 },
  { day: 'Jul 9', orders: 110 },
  { day: 'Jul 10', orders: 178 }
];

const refundReasons = [
  { name: 'Delivery delay', value: 38 },
  { name: 'Changed mind', value: 27 },
  { name: 'Wrong item ordered', value: 19 }
];

const ADMIN_COLORS = ['#1a1a1a', '#666666', '#999999', '#2563EB', '#10B981', '#F59E0B', '#EF4444', '#6B7280'];

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

const OrdersReportModal = ({ fromDate, toDate, onClose }) => {
  const today = new Date().toLocaleDateString();

const handleDownloadPDF = () => {
  const element = document.querySelector('.orders-report-modal');
  if (!element) return;

  import('html2pdf.js').then((html2pdf) => {
    html2pdf.default()
      .set({
        margin: 0.5,
        filename: `OrdersReport_${fromDate}_to_${toDate}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, scrollY: 0, windowWidth: element.scrollWidth, windowHeight: element.scrollHeight },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      })
      .from(element)
      .save();
  });
};


  const formatNumber = (num) => new Intl.NumberFormat().format(num);

  return (
    <div className="orders-report-modal__backdrop">
      <div className="orders-report-modal">
        <button className="orders-report-modal__close no-print" onClick={onClose}>×</button>

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

        <div className="orders-report-modal__meta">
          <h3>Orders Report</h3>
          <p>{fromDate} — {toDate}</p>
          <p>Generated on {today}</p>
        </div>

        <div className="orders-report-modal__summary">
          {[['Total Orders', 1342], ['Total Revenue', 92410.2], ['Avg. Order Value', 68.87], ['Website Orders', 905], ['Service Center Orders', 437]].map(([label, value]) => (
            <div className="summary-card" key={label}>
              <h4>{label}</h4>
              <p>{formatNumber(value)}</p>
            </div>
          ))}
        </div>

        <div className="orders-report-modal__section">
          <h4>Daily Order Volume</h4>
          <div style={{background:'#fafafa', borderRadius:12, padding:24, border:'1px solid #e8e8e8', marginBottom:24}}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={orderTrend} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" opacity={0.8} />
              <XAxis dataKey="day" stroke="#666" fontSize={12} fontWeight={500} tick={{ fill: '#666' }} />
              <YAxis allowDecimals={false} stroke="#666" fontSize={12} fontWeight={500} tick={{ fill: '#666' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: 20, fontSize: 14, fontWeight: 500 }} />
              <Line type="monotone" dataKey="orders" stroke="#1a1a1a" strokeWidth={3} dot={{ fill: '#1a1a1a', strokeWidth: 2, r: 6 }} activeDot={{ r: 8, fill: '#1a1a1a', strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
          </div>
        </div>

        <div className="orders-report-modal__section">
          <h4>Top Products</h4>
          <table>
            <thead>
              <tr><th>Product</th><th>Orders</th><th>Revenue (LKR)</th></tr>
            </thead>
            <tbody>
              <tr><td>Brake Pads</td><td>{formatNumber(248)}</td><td>{formatNumber(6200)}</td></tr>
              <tr><td>Oil Filter</td><td>{formatNumber(203)}</td><td>{formatNumber(2640)}</td></tr>
              <tr><td>Spark Plugs</td><td>{formatNumber(142)}</td><td>{formatNumber(1420)}</td></tr>
              <tr><td>LED Headlights</td><td>{formatNumber(108)}</td><td>{formatNumber(4320)}</td></tr>
            </tbody>
          </table>
        </div>

        <div className="orders-report-modal__section">
          <h4>Payment Type Split</h4>
          <div style={{background:'#fafafa', borderRadius:12, padding:24, border:'1px solid #e8e8e8', marginBottom:24}}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={paymentTypeData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <XAxis dataKey="name" stroke="#666" fontSize={12} fontWeight={500} tick={{ fill: '#666' }} />
              <YAxis stroke="#666" fontSize={12} fontWeight={500} tick={{ fill: '#666' }} />
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" opacity={0.8} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: 20, fontSize: 14, fontWeight: 500 }} />
              <Bar dataKey="value" fill="#1a1a1a" barSize={32} radius={[10,10,0,0]} />
            </BarChart>
          </ResponsiveContainer>
          </div>
        </div>

        <div className="orders-report-modal__section">
          <h4>Fulfillment Status</h4>
          <div style={{background:'#fafafa', borderRadius:12, padding:24, border:'1px solid #e8e8e8', marginBottom:24}}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={fulfillmentData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} label>
                {fulfillmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={ADMIN_COLORS[index % ADMIN_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 14, fontWeight: 500 }} />
            </PieChart>
          </ResponsiveContainer>
          </div>
        </div>

        <div className="orders-report-modal__section">
          <h4>Refund Breakdown</h4>
          <div style={{background:'#fafafa', borderRadius:12, padding:24, border:'1px solid #e8e8e8', marginBottom:24}}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={refundReasons} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                {refundReasons.map((entry, index) => (
                  <Cell key={`cell-refund-${index}`} fill={ADMIN_COLORS[index % ADMIN_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 14, fontWeight: 500 }} />
            </PieChart>
          </ResponsiveContainer>
          </div>
          <p><strong>Refund Value:</strong> LKR {formatNumber(4020.75)}</p>
        </div>

        <div className="orders-report-modal__footer">
          <p>This report is generated through the AutoParts HQ platform — a spare parts vendor system by MotorTrace. For support, email us at <strong>support@motortrace.lk</strong>.</p>
        </div>

<div className="orders-report-modal__actions no-print">
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

export default OrdersReportModal;
