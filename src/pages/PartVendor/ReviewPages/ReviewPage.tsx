import React from 'react';
import './ReviewPage.scss';
import UnrepliedReviewsCard from '../../../components/PartVendorComponents/ReviewPageComponentsNew/UnrepliedReviewsCard/UnrepliedReviewsCard';
import RatingsOverviewCard from '../../../components/PartVendorComponents/ReviewPageComponentsNew/RatingOverviewCard/RatingOverviewCard';
import RatingComparisonChart from '../../../components/PartVendorComponents/ReviewPageComponentsNew/RatingBreakdownCard/RatingBreakdownCard';
import ReviewTrendsChart from '../../../components/PartVendorComponents/ReviewPageComponentsNew/ReviewTrendsChart/ReviewTrendsChart';
import DetailedReviewsSection from '../../../components/PartVendorComponents/ReviewPageComponentsNew/DetailedReview/DetailedReviewSection';


const ReviewPage = () => {
  return (
    <div>
      <div className="reviews-page">
        <div className="ratings-overview">
          <RatingsOverviewCard />
        </div>
        <div className="rating-stats">
          <RatingComparisonChart />
        </div>
        <div className="unreplied-reviews">
          <UnrepliedReviewsCard />
        </div>
        <div className="review-trends">
          <ReviewTrendsChart />
        </div>
      </div>

      <div className="reviews-detailed-section">
        <DetailedReviewsSection/>
      </div>
    </div>
  );
};

export default ReviewPage;
