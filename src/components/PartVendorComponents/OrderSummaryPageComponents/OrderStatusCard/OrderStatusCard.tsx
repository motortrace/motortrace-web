import React from 'react';
import './OrderStatusCard.scss';

interface TimelineStep {
  status: string;
  date: string;
  time: string;
  details?: string;
}

interface OrderStatusCardProps {
  steps: TimelineStep[];
}

const OrderStatusCard: React.FC<OrderStatusCardProps> = ({ steps }) => {
  return (
    <div className="order-status-card">
      <div className="order-status-card__title">Order Status</div>
      <div className="order-status-card__timeline">
        {steps.map((step, index) => (
          <div key={index} className="order-status-card__step">
            <div className="order-status-card__marker" />
            <div className="order-status-card__content">
              <div className="order-status-card__status">{step.status}</div>
              <div className="order-status-card__datetime">
                {step.date} at {step.time}
              </div>
              {step.details && (
                <div className="order-status-card__details">{step.details}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderStatusCard;
