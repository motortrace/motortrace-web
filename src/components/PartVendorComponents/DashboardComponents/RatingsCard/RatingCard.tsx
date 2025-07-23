import React from 'react';
import './RatingCard.scss';
import { FaStar } from 'react-icons/fa';

interface RatingBreakdownItem {
  stars: number;
  count: number;
}

interface RatingsCardProps {
  averageRating: number;
  totalRatedOrders: number;
  ratingBreakdown: RatingBreakdownItem[];
  commonFeedbackTags?: { label: string; count: number }[];
  ratingTrend?: number;
}

const RatingsCard: React.FC<RatingsCardProps> = ({
  averageRating,
  totalRatedOrders,
  ratingBreakdown,
  commonFeedbackTags = [],
  ratingTrend,
}) => {
  return (
    <div className="ratings-card">
      <div className="ratings-card__header">
        <div className="ratings-card__average">
          <FaStar className="star-icon" />
          <span>{averageRating.toFixed(1)}</span>
        </div>
        <div className="ratings-card__total">
          {totalRatedOrders} Rated Orders
          {ratingTrend !== undefined && (
            <span className="ratings-card__trend">
              {ratingTrend >= 0 ? '▲' : '▼'} {Math.abs(ratingTrend).toFixed(1)}
            </span>
          )}
        </div>
      </div>

      <div className="ratings-card__breakdown">
        {ratingBreakdown.map((item) => (
          <div key={item.stars} className="ratings-card__bar">
            <span className="ratings-card__stars">
              {item.stars} <FaStar className="star-icon" />
            </span>
            <div className="ratings-card__bar-track">
              <div
                className="ratings-card__bar-fill"
                style={{
                  width: `${
                    (item.count / Math.max(...ratingBreakdown.map((r) => r.count))) * 100
                  }%`,
                }}
              />
            </div>
            <span className="ratings-card__count">{item.count}</span>
          </div>
        ))}
      </div>

      {commonFeedbackTags.length > 0 && (
        <div className="ratings-card__feedback">
          {commonFeedbackTags.map((tag) => (
            <span key={tag.label} className="ratings-card__badge">
              {tag.label} +{tag.count}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default RatingsCard;
