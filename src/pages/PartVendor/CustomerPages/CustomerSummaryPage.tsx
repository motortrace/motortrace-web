import React from 'react'
import CustomerActivityChart from '../../../components/PartVendorComponents/CustomerPageComponents/CustomerActivityChart/CustomerActivityChart'
import CustomerMetricsPanel from '../../../components/PartVendorComponents/CustomerPageComponents/CustomerMetricPanelComponent/CustomerMetricsPanel'
import CustomerDetailsTable from '../../../components/PartVendorComponents/CustomerPageComponents/CustomerDetailsTable/CustomerDetailsTable'

const CustomerSummaryPage = () => {
  return (
    <div>
<div style={{ display: 'flex', gap: '24px' }}>
  <CustomerActivityChart />
      <div style={{ flex: '1' }}>
    <CustomerMetricsPanel />
  </div>
</div>
<CustomerDetailsTable/>


    </div>
  )
}

export default CustomerSummaryPage
