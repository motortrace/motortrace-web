import React from 'react';
import './OrderTimeline.scss';

interface TimelineEvent {
  message: string;
  time: string;
  buttonLabel?: string;
  onButtonClick?: () => void;
}

interface VendorOrderTimelineProps {
  events: TimelineEvent[];
}

const VendorOrderTimeline: React.FC<VendorOrderTimelineProps> = ({ events }) => {
  return (
    <div className="vendor-order-timeline">
      {events.map((event, index) => (
        <div className="vendor-order-timeline__event" key={index}>
          <div className="vendor-order-timeline__indicator" />
          <div className="vendor-order-timeline__content">
            <div className="vendor-order-timeline__message">
              {event.message}
            </div>
            {event.buttonLabel && (
              <button
                className="vendor-order-timeline__button"
                onClick={event.onButtonClick}
              >
                {event.buttonLabel}
              </button>
            )}
          </div>
          <div className="vendor-order-timeline__time">{event.time}</div>
        </div>
      ))}
    </div>
  );
};

export default VendorOrderTimeline;
