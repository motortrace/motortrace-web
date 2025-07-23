import React from 'react';
import { CheckCircle, Clock } from 'lucide-react';
import './OrderProgressTracker.scss';

interface Step {
  label: string;
  status: 'completed' | 'current' | 'pending';
}

interface OrderProgressTrackerProps {
  steps: Step[];
}

const OrderProgressTracker: React.FC<OrderProgressTrackerProps> = ({ steps }) => {
  return (
    <div className="order-progress-tracker">
      {steps.map((step, index) => (
        <div key={index} className={`order-progress-tracker__step order-progress-tracker__step--${step.status}`}>
          <div className="order-progress-tracker__icon">
            {step.status === 'completed' ? (
              <CheckCircle size={20} />
            ) : (
              <Clock size={20} />
            )}
          </div>
          <div className="order-progress-tracker__label">{step.label}</div>
          {index !== steps.length - 1 && <div className="order-progress-tracker__line" />}
        </div>
      ))}
    </div>
  );
};

export default OrderProgressTracker;
