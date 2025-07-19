import React, { useState } from 'react';
import './ReportTypeCard.scss';
import { FileText, BarChart2, Package, Users } from 'lucide-react';

import DateRangeModal from '../DateRangeModal/DateRangeModal';
import OrdersReportModal from '../OrdersReportModal/OrdersReportModal';
import OrderSummaryReportModal from '../OrderSummaryReportModal/OrderSummaryReportModal';
import IncomeStatsReportModal from '../IncomeStatsReportModal/IncomeStatsReportModal';
import IncomeSummaryReportModal from '../IncomeSummaryReportModal/IncomeSummaryReportModal';
import InventoryStatsReportModal from '../InventoryStatsReportModal/InventoryStatsReportModal';
import InventorySummaryReportModal from '../InventorySummaryReportModal/InventorySummaryReportModal';

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
  const [reportType, setReportType] = useState<'summary' | 'stats' | null>(null);

  const [showDateModal, setShowDateModal] = useState(false);
  const [showOrdersStatsModal, setShowOrdersStatsModal] = useState(false);
  const [showOrdersSummaryModal, setShowOrdersSummaryModal] = useState(false);
  const [showRevenueStatsModal, setShowRevenueStatsModal] = useState(false);
  const [showRevenueSummaryModal, setShowRevenueSummaryModal] = useState(false);
  const [showInventoryStatsModal, setShowInventoryStatsModal] = useState(false);
  const [showInventorySummaryModal, setShowInventorySummaryModal] = useState(false);

  const handleGenerateClick = (id: string, name: string) => {
    setSelectedReport({ id, name });
    setShowDateModal(true);
  };

  const handleGenerateReport = (from: string, to: string, type: 'summary' | 'stats') => {
    setDateRange({ from, to });
    setReportType(type);
    setShowDateModal(false);

    if (!selectedReport) return;

    switch (selectedReport.id) {
      case 'orders':
        type === 'stats' ? setShowOrdersStatsModal(true) : setShowOrdersSummaryModal(true);
        break;
      case 'revenue':
        type === 'stats' ? setShowRevenueStatsModal(true) : setShowRevenueSummaryModal(true);
        break;
      case 'inventory':
        type === 'stats' ? setShowInventoryStatsModal(true) : setShowInventorySummaryModal(true);
        break;
      default:
        break;
    }
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
            <button onClick={() => handleGenerateClick(report.id, report.name)}>Generate</button>
            <span className="report-card__timestamp">Last: {report.lastGenerated}</span>
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

      {/* Orders */}
      {selectedReport?.id === 'orders' && reportType === 'stats' && showOrdersStatsModal && dateRange && (
        <OrdersReportModal
          fromDate={dateRange.from}
          toDate={dateRange.to}
          onClose={() => setShowOrdersStatsModal(false)}
        />
      )}

      {selectedReport?.id === 'orders' && reportType === 'summary' && showOrdersSummaryModal && dateRange && (
        <OrderSummaryReportModal
          fromDate={dateRange.from}
          toDate={dateRange.to}
          onClose={() => setShowOrdersSummaryModal(false)}
        />
      )}

      {/* Revenue */}
      {selectedReport?.id === 'revenue' && reportType === 'stats' && showRevenueStatsModal && dateRange && (
        <IncomeStatsReportModal
          fromDate={dateRange.from}
          toDate={dateRange.to}
          onClose={() => setShowRevenueStatsModal(false)}
        />
      )}

      {selectedReport?.id === 'revenue' && reportType === 'summary' && showRevenueSummaryModal && dateRange && (
        <IncomeSummaryReportModal
          fromDate={dateRange.from}
          toDate={dateRange.to}
          onClose={() => setShowRevenueSummaryModal(false)}
        />
      )}

      {/* Inventory */}
      {selectedReport?.id === 'inventory' && reportType === 'stats' && showInventoryStatsModal && dateRange && (
        <InventoryStatsReportModal
          fromDate={dateRange.from}
          toDate={dateRange.to}
          onClose={() => setShowInventoryStatsModal(false)}
        />
      )}

      {selectedReport?.id === 'inventory' && reportType === 'summary' && showInventorySummaryModal && dateRange && (
        <InventorySummaryReportModal
          fromDate={dateRange.from}
          toDate={dateRange.to}
          onClose={() => setShowInventorySummaryModal(false)}
        />
      )}
    </div>
  );
};

export default ReportTypeCards;
