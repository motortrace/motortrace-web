import React, { useState } from 'react';
import './ReportTypeCard.scss';
import { FileText, BarChart2, Package, Users } from 'lucide-react';
import DateRangeModal from '../DateRangeModal/DateRangeModal';
import OrdersReportModal from '../OrdersReportModal/OrdersReportModal';

const reportTypes = [
  {
    id: 'orders',
    name: 'Orders Report',
    description: 'Summary of all placed orders.',
    lastGenerated: '2025-07-10',
    icon: <FileText size={28} strokeWidth={1.5} />,
  },
  {
    id: 'revenue',
    name: 'Revenue Report',
    description: 'Track total earnings and trends.',
    lastGenerated: '2025-07-08',
    icon: <BarChart2 size={28} strokeWidth={1.5} />,
  },
  {
    id: 'inventory',
    name: 'Inventory Report',
    description: 'Monitor product stock levels.',
    lastGenerated: '2025-07-05',
    icon: <Package size={28} strokeWidth={1.5} />,
  },
  {
    id: 'customers',
    name: 'Customer Report',
    description: 'Insights into customer activity.',
    lastGenerated: '2025-07-03',
    icon: <Users size={28} strokeWidth={1.5} />,
  },
];

const ReportTypeCards = () => {
  const [selectedReport, setSelectedReport] = useState<{ id: string; name: string } | null>(null);
  const [dateRange, setDateRange] = useState<{ from: string; to: string } | null>(null);
  const [showDateModal, setShowDateModal] = useState(false);
  const [showOrdersModal, setShowOrdersModal] = useState(false);

  const handleGenerateClick = (id: string, name: string) => {
    setSelectedReport({ id, name });
    setShowDateModal(true);
  };

  const handleGenerateReport = (from: string, to: string) => {
    setDateRange({ from, to });
    setShowDateModal(false);

    if (selectedReport?.id === 'orders') {
      setShowOrdersModal(true);
    }

    // You can conditionally show other report modals here in the future
  };

  return (
    <div className="report-cards">
      {reportTypes.map((report) => (
        <div key={report.id} className="report-card">
          <div className="report-card__header">
            <div className="report-card__icon">{report.icon}</div>
            <div>
              <h3 className="report-card__title">{report.name}</h3>
              <p className="report-card__desc">{report.description}</p>
            </div>
          </div>

          <div className="report-card__footer">
            <button onClick={() => handleGenerateClick(report.id, report.name)}>
              Generate
            </button>
            <span className="report-card__timestamp">
              Last: {report.lastGenerated}
            </span>
          </div>
        </div>
      ))}

      {selectedReport && showDateModal && (
        <DateRangeModal
          isOpen={showDateModal}
          onClose={() => setShowDateModal(false)}
          onGenerate={handleGenerateReport}
          reportName={selectedReport.name}
        />
      )}

      {selectedReport?.id === 'orders' && showOrdersModal && dateRange && (
        <OrdersReportModal
          fromDate={dateRange.from}
          toDate={dateRange.to}
          onClose={() => setShowOrdersModal(false)}
        />
      )}
    </div>
  );
};

export default ReportTypeCards;
