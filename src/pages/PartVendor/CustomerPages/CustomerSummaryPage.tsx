import React from 'react'
import CustomerActivityChart from '../../../components/PartVendorComponents/CustomerPageComponents/CustomerActivityChart/CustomerActivityChart'
import CustomerMetricsPanel from '../../../components/PartVendorComponents/CustomerPageComponents/CustomerMetricPanelComponent/CustomerMetricsPanel'
import CustomerDetailsTable from '../../../components/PartVendorComponents/CustomerPageComponents/CustomerDetailsTable/CustomerDetailsTable'

const CustomerSummaryPage = () => {
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 0.8fr', gap: '32px', margin: '0 auto', alignItems: 'stretch' }}>
        <CustomerActivityChart />
        <CustomerMetricsPanel />
      </div>
      <div style={{margin: '32px auto 0 auto' }}>
        <CustomerDetailsTable />
      </div>
    </div>
  )
}

export default CustomerSummaryPage
