import React from 'react'
import PartVendorSideBar from '../../../components/PartVendorComponents/SideBar/partVendorSidebar'
import SalesOverviewChart from '../../../components/PartVendorComponents/SalesOverviewChart/SalesOverviewChart'
import InventoryOverview from '../../../components/PartVendorComponents/InventoryOverview/InventoryOverview'
import InventoryMetricCard from '../../../components/PartVendorComponents/InventoryMetricCard/InventoryMetricCard'
import SalesMetricCard from '../../../components/PartVendorComponents/SalesMetricCard/SalesMetricCard'


const PartVendorDashboard = () => {
  return (
    <div>
      {/* <PartVendorSideBar/> */}
      <SalesOverviewChart/>
      {/* <InventoryOverview/> */}
<div className="metric-cards-row">
  <InventoryMetricCard
    title="Low Stock Items"
    description="Items below minimum stock level"
    total={7}
    items={[
      { name: 'Brake Pads', count: 2 },
      { name: 'Oil Filters', count: 3 },
      { name: 'Spark Plugs', count: 2 },
    ]}
  />
  <InventoryMetricCard
    title="Out of Stock Items"
    description="Currently unavailable items"
    total={3}
    items={[
      { name: 'Air Filters', count: 0 },
      { name: 'Timing Belts', count: 0 },
      { name: 'Radiator Caps', count: 0 },
    ]}
  />
  <InventoryMetricCard
    title="Fast-Moving Items"
    description="Top-selling items this month"
    total={5}
    items={[
      { name: 'Wiper Blades', count: 20 },
      { name: 'Engine Oil', count: 15 },
      { name: 'Coolant', count: 10 },
    ]}
  />
  <SalesMetricCard
    title="Total Sales"
    amount="LKR 150,000"
    change="8.5%"
    changeType="positive"
  />
</div>


    </div>
  )
}

export default PartVendorDashboard
