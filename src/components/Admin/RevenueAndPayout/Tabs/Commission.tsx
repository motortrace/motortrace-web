import React from 'react'
import MetricCard from '../StatCard/StatCard'
import CommissionChart from '../Graphs/CommissionChart';
import CommissionBarChart from '../Graphs/CommissionBarChart';

const commissionData = [
  {
    month: 'Jan',
    serviceCenters: 15000,
    sparePartsSellers: 8500,
    total: 23500
  },
  {
    month: 'Feb',
    serviceCenters: 18000,
    sparePartsSellers: 9200,
    total: 27200
  },
  {
    month: 'Mar',
    serviceCenters: 22000,
    sparePartsSellers: 11500,
    total: 33500
  },
  {
    month: 'Apr',
    serviceCenters: 25000,
    sparePartsSellers: 13200,
    total: 38200
  },
  {
    month: 'May',
    serviceCenters: 28500,
    sparePartsSellers: 15800,
    total: 44300
  },
  {
    month: 'Jun',
    serviceCenters: 32000,
    sparePartsSellers: 18200,
    total: 50200
  }
];

const Commission = () => {
  return (
    <>
        <div className="metric-cards-row" style={{ marginTop: '16px' }}>
                <MetricCard
                    title="Escrow Balance"
                    amount="47,500"
                    change="12.5%"
                    changeType="positive"
                    period="vs last month"
                    subtitle="From 23 confirmed bookings"
                    icon="bx bx-wallet"
                    currency="LKR"
                    showTrend={true}
                    actionable={true}
                />

                <MetricCard
                    title="Total Commissions"
                    amount="125,750"
                    change="8.2%"
                    changeType="positive"
                    period="vs last month"
                    subtitle="From 47 completed bookings"
                    icon="bx bx-line-chart"
                    currency="LKR"
                    showTrend={true}
                    actionable={true}
                />

                <MetricCard
                    title="Total Subscriptions"
                    amount="89,250"
                    change="15.4%"
                    changeType="positive"
                    period="vs last month"
                    subtitle="From 69 active providers"
                    icon="bx bx-refresh"
                    currency="LKR"
                    showTrend={true}
                    actionable={true}
                />

                <MetricCard
                    title="Pending Payouts"
                    amount="23,800"
                    change="22.1%"
                    changeType="negative"
                    period="vs last month"
                    subtitle="15 providers awaiting payout"
                    icon="bx bx-credit-card"
                    currency="LKR"
                    showTrend={true}
                    actionable={true}
                    urgency="warning"
                />
            </div>

             <div className="metric-cards-row" style={{ marginTop: '8px' }}>
                <CommissionChart data = {commissionData} />
                <CommissionBarChart data={commissionData} />
             </div>
    </>
  )
}

export default Commission
