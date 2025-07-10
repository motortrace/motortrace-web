import React from 'react';
import './SubscriptionPlanCard.scss';
import { FaCrown } from 'react-icons/fa';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface SubscriptionPlanCardProps {
  currentPlan: string;
  totalDays: number;
  daysLeft: number;
  suggestion?: {
    planName: string;
    savings: number;
  };
  onUpdatePlan: () => void;
}

const SubscriptionPlanCard: React.FC<SubscriptionPlanCardProps> = ({
  currentPlan,
  totalDays,
  daysLeft,
  suggestion,
  onUpdatePlan,
}) => {
  const percentage = Math.max(
    0,
    Math.min(100, ((totalDays - daysLeft) / totalDays) * 100)
  );

  return (
    <div className="subscription-plan-card">
      <div className="subscription-plan-card__header">
        <div className="subscription-plan-card__icon">
          <FaCrown />
        </div>
        <h3 className="subscription-plan-card__title">Your Plan</h3>
      </div>

      <div className="subscription-plan-card__progress">
        <CircularProgressbar
          value={percentage}
          text={`${daysLeft}d left`}
          styles={buildStyles({
            textColor: '#111827',
            pathColor: '#10b981',
            trailColor: '#e5e7eb',
            textSize: '16px',
          })}
        />
      </div>

      <div className="subscription-plan-card__plan-name">{currentPlan}</div>

      {suggestion && (
        <div className="subscription-plan-card__suggestion">
          Upgrade to <strong>{suggestion.planName}</strong> & save $
          {suggestion.savings}
        </div>
      )}

      <button
        className="subscription-plan-card__button"
        onClick={onUpdatePlan}
      >
        Update Plan
      </button>
    </div>
  );
};

export default SubscriptionPlanCard;
