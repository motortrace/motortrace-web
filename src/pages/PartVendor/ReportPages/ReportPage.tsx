import React from 'react'
import ReportTypeCards from '../../../components/PartVendorComponents/ReportsPageComponents/ReportTypeCard/ReportTypeCard'
import ReportHistoryTable from '../../../components/PartVendorComponents/ReportsPageComponents/ReportHistoryTable/ReportHistoryTable'

const ReportPage = () => {
  return (
    <div>
      <ReportTypeCards/>
      <ReportHistoryTable/>
    </div>
  )
}

export default ReportPage
