import React from 'react';
import './OrderTimeline.scss';

interface TimelineEvent {
  message: string;
  time: string;
  hasButton?: boolean;
  buttonText?: string;
  onButtonClick?: () => void;
}

interface OrderTimelineProps {
  events: TimelineEvent[];
}

const OrderTimeline: React.FC<OrderTimelineProps> = ({ events }) => {
  return (
    <div className="order-timeline">
      {events.map((event, index) => (
        <div key={index} className="order-timeline__event">
          <div className="order-timeline__dot" />
          <div className="order-timeline__details">
            <div className="order-timeline__message">{event.message}</div>
            {event.hasButton && (
              <button
                className="order-timeline__button"
                onClick={event.onButtonClick}
              >
                {event.buttonText}
              </button>
            )}
          </div>
          <div className="order-timeline__time">{event.time}</div>
        </div>
      ))}
    </div>
  );
};

export default OrderTimeline;
