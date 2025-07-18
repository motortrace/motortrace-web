import React from 'react';
import './OrdersReportModal.scss';
import logo from '../../../../assets/images/autoparts.png';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';

const regionData = [
  { name: 'US', value: 46 },
  { name: 'Canada', value: 21 },
  { name: 'UK', value: 17 },
  { name: 'Australia', value: 9 },
  { name: 'Other', value: 7 }
];

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

const COLORS = ['#3B82F6', '#34D399', '#FBBF24', '#F87171', '#9CA3AF'];

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
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        })
        .from(element)
        .save();
    });
  };

  return (
    <div className="orders-report-modal__backdrop">
      <div className="orders-report-modal">
        <div className="orders-report-modal__actions">
          <button onClick={() => window.print()}>🖨 Print</button>
          <button onClick={handleDownloadPDF}>⬇ Download PDF</button>
        </div>
        <button className="orders-report-modal__close" onClick={onClose}>×</button>

        <div className="orders-report-modal__header">
          <img src={logo} alt="Logo" className="orders-report-modal__logo" />
          <div className="orders-report-modal__shop-info">
            <h2>AutoParts HQ</h2>
            <p>789 Service Park, Nugegoda, Sri Lanka</p>
            <p>+94 11 234 5678</p>
            <p>support@autopartshq.lk</p>
          </div>
        </div>

        <div className="orders-report-modal__meta">
          <h3>Orders Report</h3>
          <p>{fromDate} — {toDate}</p>
          <p>Generated on {today}</p>
        </div>

        <div className="orders-report-modal__summary">
          {[['Total Orders', '1,342'], ['Total Revenue', '$92,410.20'], ['Avg. Order Value', '$68.87'], ['Website Orders', '905'], ['Service Center Orders', '437']].map(([label, value]) => (
            <div className="summary-card" key={label}>
              <h4>{label}</h4>
              <p>{value}</p>
            </div>
          ))}
        </div>

        <div className="orders-report-modal__section">
          <h4>Daily Order Volume</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={orderTrend}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="orders" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="orders-report-modal__section">
          <h4>Top Products</h4>
          <table>
            <thead>
              <tr><th>Product</th><th>Orders</th><th>Revenue</th></tr>
            </thead>
            <tbody>
              <tr><td>Brake Pads</td><td>248</td><td>$6,200</td></tr>
              <tr><td>Oil Filter</td><td>203</td><td>$2,640</td></tr>
              <tr><td>Spark Plugs</td><td>142</td><td>$1,420</td></tr>
              <tr><td>LED Headlights</td><td>108</td><td>$4,320</td></tr>
            </tbody>
          </table>
        </div>

        <div className="orders-report-modal__section">
          <h4>Orders by Region</h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={regionData} dataKey="value" nameKey="name" outerRadius={80} label>
                {regionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="orders-report-modal__section">
          <h4>Payment Type Split</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={paymentTypeData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#34D399" barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="orders-report-modal__section">
          <h4>Fulfillment Status</h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={fulfillmentData} dataKey="value" nameKey="name" innerRadius={40} outerRadius={70} label>
                {fulfillmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="orders-report-modal__section">
          <h4>Cancellations & Refunds</h4>
          <ul className="cancellation-reasons">
            <li>Delivery delay – 38%</li>
            <li>Changed mind – 27%</li>
            <li>Wrong item ordered – 19%</li>
          </ul>
          <p><strong>Refund Value:</strong> $4,020.75</p>
        </div>

        <div className="orders-report-modal__footer">
          <p>Thank you for using AutoParts HQ. For support, email us at support@autopartshq.lk</p>
        </div>
      </div>
    </div>
  );
};

export default OrdersReportModal;
