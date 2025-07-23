import React from 'react';
import ReviewMetricCard from '../ReviewMetricsCard/ReviewMetricCard';
import './ReviewsCard.scss';
import ReviewOverallCard from '../ReviewOverallCard/ReviewOverallCard';

const ReviewsCard: React.FC = () => {
  return (
    <div className="reviews-card">
      <ReviewOverallCard/>
      <ReviewMetricCard
        title="New Reviews"
        count="54"
        change="12%"
        changeType="positive"
      />
      <ReviewMetricCard
        title="Unreplied Reviews"
        count="8"
        change="5%"
        changeType="negative"
      />
    </div>
  );
};

export default ReviewsCard;
