import MetricCard from '../StatCard/StatCard'
import FinancialBarChart from '../Graphs/FinancialBarChart'

interface MonthlyFinancialData {
    month: string;
    advancePayments: number;
    commissions: number;
    payouts: number;
}

interface BarGraphProps {
    data: MonthlyFinancialData[];
    title?: string;
    height?: number;
}

const Payout = () => {

     const generateSampleData = (): MonthlyFinancialData[] => {
        const months = [
            'Jan 2024',
            'Feb 2024',
            'Mar 2024',
            'Apr 2024',
            'May 2024',
            'Jun 2024'
        ];

        return [
            {
                month: 'Jan',
                advancePayments: 1125000,
                commissions: 212500,
                payouts: 912500
            },
            {
                month: 'Feb',
                advancePayments: 1300000,
                commissions: 245000,
                payouts: 1055000
            },
            {
                month: 'Mar',
                advancePayments: 1200000,
                commissions: 230000,
                payouts: 970000
            },
            {
                month: 'Apr',
                advancePayments: 1450000,
                commissions: 280000,
                payouts: 1170000
            },
            {
                month: 'May',
                advancePayments: 1525000,
                commissions: 302500,
                payouts: 1222500
            },
            {
                month: 'Jun',
                advancePayments: 1675000,
                commissions: 337500,
                payouts: 1337500
            }
        ];
    };
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
                <FinancialBarChart
                    data={generateSampleData()}
                />
            </div>
             
    </>
  )
}

export default Payout
