import React, { useState } from 'react';
import ReportTypeCards from '../../../components/PartVendorComponents/ReportsPageComponents/ReportTypeCard/ReportTypeCard'
import ReportHistoryTable from '../../../components/PartVendorComponents/ReportsPageComponents/ReportHistoryTable/ReportHistoryTable'
// Import all modals
import OrdersReportModal from '../../../components/PartVendorComponents/ReportsPageComponents/OrdersReportModal/OrdersReportModal';
import OrderSummaryReportModal from '../../../components/PartVendorComponents/ReportsPageComponents/OrderSummaryReportModal/OrderSummaryReportModal';
import IncomeStatsReportModal from '../../../components/PartVendorComponents/ReportsPageComponents/IncomeStatsReportModal/IncomeStatsReportModal';
import IncomeSummaryReportModal from '../../../components/PartVendorComponents/ReportsPageComponents/IncomeSummaryReportModal/IncomeSummaryReportModal';
import InventoryStatsReportModal from '../../../components/PartVendorComponents/ReportsPageComponents/InventoryStatsReportModal/InventoryStatsReportModal';
import InventorySummaryReportModal from '../../../components/PartVendorComponents/ReportsPageComponents/InventorySummaryReportModal/InventorySummaryReportModal';
import CustomerStatsReportModal from '../../../components/PartVendorComponents/ReportsPageComponents/CustomerStatsReportModal/CustomerStatsReportModal';
import CustomerSummaryReportModal from '../../../components/PartVendorComponents/ReportsPageComponents/CustomerSummaryReportModal/CustomerSummaryReportModal';

const ReportPage = () => {
  // Modal state
  const [modal, setModal] = useState({ open: false, type: '', subtype: '', report: null });

  // Dummy date range for demo; in real use, store per report or prompt user
  const defaultDateRange = { from: '2025-07-01', to: '2025-07-10' };

  const handleViewReport = (report) => {
    setModal({ open: true, type: report.type, subtype: report.subtype, report });
  };

  const handleCloseModal = () => setModal({ open: false, type: '', subtype: '', report: null });

  return (
    <div>
      <ReportTypeCards/>
      <ReportHistoryTable onViewReport={handleViewReport}/>

      {/* Render the correct modal based on modal state */}
      {modal.open && modal.type === 'Orders' && modal.subtype === 'Stats' && (
        <OrdersReportModal fromDate={defaultDateRange.from} toDate={defaultDateRange.to} onClose={handleCloseModal} />
      )}
      {modal.open && modal.type === 'Orders' && modal.subtype === 'Summary' && (
        <OrderSummaryReportModal fromDate={defaultDateRange.from} toDate={defaultDateRange.to} onClose={handleCloseModal} />
      )}
      {modal.open && modal.type === 'Revenue' && modal.subtype === 'Stats' && (
        <IncomeStatsReportModal fromDate={defaultDateRange.from} toDate={defaultDateRange.to} onClose={handleCloseModal} />
      )}
      {modal.open && modal.type === 'Revenue' && modal.subtype === 'Summary' && (
        <IncomeSummaryReportModal fromDate={defaultDateRange.from} toDate={defaultDateRange.to} onClose={handleCloseModal} />
      )}
      {modal.open && modal.type === 'Inventory' && modal.subtype === 'Stats' && (
        <InventoryStatsReportModal fromDate={defaultDateRange.from} toDate={defaultDateRange.to} onClose={handleCloseModal} />
      )}
      {modal.open && modal.type === 'Inventory' && modal.subtype === 'Summary' && (
        <InventorySummaryReportModal fromDate={defaultDateRange.from} toDate={defaultDateRange.to} onClose={handleCloseModal} />
      )}
      {modal.open && modal.type === 'Customer' && modal.subtype === 'Stats' && (
        <CustomerStatsReportModal fromDate={defaultDateRange.from} toDate={defaultDateRange.to} onClose={handleCloseModal} />
      )}
      {modal.open && modal.type === 'Customer' && modal.subtype === 'Summary' && (
        <CustomerSummaryReportModal fromDate={defaultDateRange.from} toDate={defaultDateRange.to} onClose={handleCloseModal} />
      )}
    </div>
  )
}

export default ReportPage
