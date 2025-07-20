import React, { useState } from 'react';
import './PricingPlan.scss';

interface PricingPlanProps {
  onPlanSelect: (plan: { type: 'monthly' | 'yearly'; price: number }) => void;
  selectedPlan?: { type: 'monthly' | 'yearly'; price: number };
}

const PricingPlan: React.FC<PricingPlanProps> = ({ onPlanSelect, selectedPlan }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = {
    monthly: {
      price: 29,
      period: 'month',
      savings: null
    },
    yearly: {
      price: 290,
      period: 'year',
      savings: 58 // 2 months free
    }
  };

  const currentPlan = plans[billingCycle];

  const handlePlanSelect = () => {
    onPlanSelect({
      type: billingCycle,
      price: currentPlan.price
    });
  };

  return (
    <div className="pricing-plan">
      <div className="pricing-header">
        <h2>Choose Your Plan</h2>
        <p>Get started with MotorTrace today</p>
      </div>

      <div className="billing-toggle">
        <span className={billingCycle === 'monthly' ? 'active' : ''}>Monthly</span>
        <button
          className={`toggle-button ${billingCycle === 'yearly' ? 'active' : ''}`}
          onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
        >
          <div className="toggle-slider"></div>
        </button>
        <span className={billingCycle === 'yearly' ? 'active' : ''}>
          Yearly
          {currentPlan.savings && <span className="savings">Save ${currentPlan.savings}</span>}
        </span>
      </div>

      <div className="plan-card">
        <div className="plan-header">
          <h3>MotorTrace Pro</h3>
          <div className="price">
            <span className="currency">$</span>
            <span className="amount">{currentPlan.price}</span>
            <span className="period">/{currentPlan.period}</span>
          </div>
          {currentPlan.savings && (
            <div className="savings-badge">Save ${currentPlan.savings}</div>
          )}
        </div>

        <div className="plan-features">
          <h4>Everything you need to run your business:</h4>
          <ul>
            <li>✓ Unlimited service appointments</li>
            <li>✓ Complete inventory management</li>
            <li>✓ Customer management & history</li>
            <li>✓ Work order & job tracking</li>
            <li>✓ Parts ordering & supplier connections</li>
            <li>✓ Financial reporting & analytics</li>
            <li>✓ Mobile app access</li>
            <li>✓ Priority customer support</li>
          </ul>
        </div>

        <button
          className={`select-plan-btn ${selectedPlan?.type === billingCycle ? 'selected' : ''}`}
          onClick={handlePlanSelect}
        >
          {selectedPlan?.type === billingCycle ? '✓ Selected' : 'Select Plan'}
        </button>
      </div>

      <div className="pricing-footer">
        <p>✓ 14-day free trial • ✓ Cancel anytime • ✓ No setup fees</p>
      </div>
    </div>
  );
};

export default PricingPlan; 