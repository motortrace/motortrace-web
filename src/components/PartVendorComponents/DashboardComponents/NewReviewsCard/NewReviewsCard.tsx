import React from 'react';
import './NewReviewsCard.scss';
import { FaGoogle, FaStar, FaImage } from 'react-icons/fa';
import MotorTraceLogo from '../../../../assets/images/motortraceLogo.png';

interface Review {
  id: number;
  reviewer: string;
  content: string;
  replied: boolean;
  platform: 'Google' | 'MotorTrace';
  rating: number;
  imageCount?: number;
}

interface NewReviewsCardProps {
  googleRating: number;
  googleReviews: number;
  motortraceRating: number;
  motortraceReviews: number;
  newReviewsCount: number;
  reviews: Review[];
  onReply: (id: number) => void;
}

const NewReviewsCard: React.FC<NewReviewsCardProps> = ({
  googleRating,
  googleReviews,
  motortraceRating,
  motortraceReviews,
  newReviewsCount,
  reviews,
  onReply,
}) => {
  return (
    <div className="new-reviews-card">
      {/* Current Rating Title */}
      <h3 className="new-reviews-card__title new-reviews-card__title--center">
        Current Rating
      </h3>

      {/* Current Ratings */}
      <div className="new-reviews-card__ratings">
        <div className="new-reviews-card__rating">
          <div className="new-reviews-card__icon">
            <FaGoogle />
          </div>
          <div>
            <div className="new-reviews-card__stars">
              <FaStar className="star-icon" />
              <span>{googleRating.toFixed(1)}</span>
            </div>
            <div className="new-reviews-card__reviews-count">
              {googleReviews} reviews
            </div>
          </div>
        </div>

        <div className="new-reviews-card__rating">
          <div className="new-reviews-card__icon">
            <img src={MotorTraceLogo} alt="MotorTrace" />
          </div>
          <div>
            <div className="new-reviews-card__stars">
              <FaStar className="star-icon" />
              <span>{motortraceRating.toFixed(1)}</span>
            </div>
            <div className="new-reviews-card__reviews-count">
              {motortraceReviews} reviews
            </div>
          </div>
        </div>
      </div>

      {/* New Reviews Title */}
      <div className="new-reviews-card__header">
        <h3 className="new-reviews-card__title">New Reviews</h3>
        <span className="new-reviews-card__count">{newReviewsCount}</span>
      </div>

      {/* Reviews List */}
<ul className="new-reviews-card__list">
  {reviews.map((rev) => (
    <li key={rev.id} className="new-reviews-card__review">
      {/* Left Section */}
      <div className="new-reviews-card__left">
        {/* Platform Logo */}
        <div className="new-reviews-card__logo">
          {rev.platform === 'Google' ? (
            <FaGoogle />
          ) : (
            <img src={MotorTraceLogo} alt={rev.platform} />
          )}
        </div>

        {/* Main Content */}
        <div className="new-reviews-card__main">
          {/* Review Text */}
          <div className="new-reviews-card__content">{rev.content}</div>

          {/* Rating & Images */}
          <div className="new-reviews-card__meta">
            <FaStar className="star-icon" />
            <span>{rev.rating.toFixed(1)} stars</span>
            {rev.imageCount && rev.imageCount > 0 && (
              <span className="new-reviews-card__images-badge">
                <FaImage style={{ marginRight: '4px' }} />
                +{rev.imageCount} images
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="new-reviews-card__right">
        {rev.replied ? (
          <span className="new-reviews-card__badge">Replied</span>
        ) : (
          <button
            className="new-reviews-card__reply-button"
            onClick={() => onReply(rev.id)}
          >
            Reply
          </button>
        )}
      </div>
    </li>
  ))}
</ul>

    </div>
  );
};

export default NewReviewsCard;
