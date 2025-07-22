import React from 'react'
import MetricCard from '../StatCard/StatCard'
import SCSubscriptionPlanChart from '../Graphs/SCSubscriptionPlanChart'
import SPSubscriptionPlanChart from '../Graphs/SPSSubscriptionPlanChart'
import RetentionRateChart from '../Graphs/RetentionRateChart'

const Subscription = () => {
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
                <SCSubscriptionPlanChart />
                <SPSubscriptionPlanChart />
            </div>

            <div style={{margin: '10px 24px'}}>
                <RetentionRateChart />
            </div>
            
            
        </>
    )
}

export default Subscription
