import { useState } from 'react';
import {
  // LayoutDashboard,
  BadgeDollarSign,
  ReceiptCent,
  WalletCards
} from 'lucide-react'
// import Overview from '../../components/Admin/RevenueAndPayout/Tabs/Overview';
import Subscription from '../../components/Admin/RevenueAndPayout/Tabs/Subscription';
import Commission from '../../components/Admin/RevenueAndPayout/Tabs/Commission';
import Payout from '../../components/Admin/RevenueAndPayout/Tabs/Payout';

const RevenueAndPayouts = () => {
  const [activeTab, setActiveTab] = useState('subscription');
  return (
    <div>

      <div className="moderation-dashboard__tabs">

        {/* <button
          className={`moderation-dashboard__tab ${activeTab === 'overview' ? 'moderation-dashboard__tab--active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <span className="moderation-dashboard__tab-icon">
            <LayoutDashboard />
          </span>
          Overview
        </button> */}

        <button
          className={`moderation-dashboard__tab ${activeTab === 'subscription' ? 'moderation-dashboard__tab--active' : ''}`}
          onClick={() => setActiveTab('subscription')}
        >
          <span className="moderation-dashboard__tab-icon">
            <BadgeDollarSign />
          </span>
          Subscription Earnings
        </button>

        <button
          className={`moderation-dashboard__tab ${activeTab === 'commission' ? 'moderation-dashboard__tab--active' : ''}`}
          onClick={() => setActiveTab('commission')}
        >
          <span className="moderation-dashboard__tab-icon">
            <ReceiptCent />
          </span>
          Commission Earnings
        </button>

         <button
          className={`moderation-dashboard__tab ${activeTab === 'payout' ? 'moderation-dashboard__tab--active' : ''}`}
          onClick={() => setActiveTab('payout')}
        >
          <span className="moderation-dashboard__tab-icon">
            <WalletCards />
          </span>
          Payouts
        </button>

      </div>

      <div>
        {/* {activeTab === 'overview' && <Overview />} */}
        {activeTab === 'subscription' && <Subscription />}
        {activeTab === 'commission' && <Commission />}
        {activeTab === 'payout' && <Payout />}
      </div>

    </div>
  )
}

export default RevenueAndPayouts
