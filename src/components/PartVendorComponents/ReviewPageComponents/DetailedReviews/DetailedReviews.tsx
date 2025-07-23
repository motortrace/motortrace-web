import React, { useState } from 'react';
import './DetailedReviews.scss';
import googleLogo from '../../../../assets/images/google.png';
import motorTraceLogo from '../../../../assets/images/motortraceLogo.png';
import { Reply } from 'lucide-react';

interface Review {
  id: string;
  platform: 'Google' | 'MotorTrace';
  rating: number;
  review: string;
  customer: string;
  replied: boolean;
}

const reviews: Review[] = [
  {
    id: '1',
    platform: 'Google',
    rating: 5,
    review: 'Excellent service! Highly recommended.',
    customer: 'A. Fernando',
    replied: false,
  },
  {
    id: '2',
    platform: 'MotorTrace',
    rating: 4,
    review: 'Good experience, but waiting time was a bit long.',
    customer: 'M. Perera',
    replied: true,
  },
  {
    id: '3',
    platform: 'Google',
    rating: 3,
    review: 'Average service, can improve.',
    customer: 'S. Silva',
    replied: false,
  },
  {
    id: '4',
    platform: 'MotorTrace',
    rating: 5,
    review: 'Perfect! Will visit again.',
    customer: 'AutoFix Garage',
    replied: true,
  },
];

const DetailedReviews: React.FC = () => {
  const [reviewList, setReviewList] = useState(reviews);

  const handleReply = (id: string) => {
    setReviewList((prev) =>
      prev.map((rev) =>
        rev.id === id ? { ...rev, replied: true } : rev
      )
    );
  };

  return (
    <div className="detailed-reviews">
      <div className="detailed-reviews__header">
        <h2 className="detailed-reviews__title">Customer Reviews</h2>
      </div>

      <div className="detailed-reviews__table">
        <div className="detailed-reviews__table-header">
          <div className="detailed-reviews__header-cell">Platform</div>
          <div className="detailed-reviews__header-cell">Rating</div>
          <div className="detailed-reviews__header-cell">Review</div>
          <div className="detailed-reviews__header-cell">Customer</div>
          <div className="detailed-reviews__header-cell">Actions</div>
        </div>

        <div className="detailed-reviews__table-body">
          {reviewList.map((rev) => (
            <div key={rev.id} className="detailed-reviews__row">
              <div className="detailed-reviews__cell">
                <img
                  src={rev.platform === 'Google' ? googleLogo : motorTraceLogo}
                  alt={rev.platform}
                  className="detailed-reviews__logo"
                />
              </div>
              <div className="detailed-reviews__cell">
                {Array.from({ length: rev.rating }).map((_, idx) => (
                  <span key={idx}>⭐</span>
                ))}
              </div>
              <div className="detailed-reviews__cell">
                {rev.review}
              </div>
              <div className="detailed-reviews__cell">
                {rev.customer}
              </div>
              <div className="detailed-reviews__cell">
                {rev.replied ? (
                  <span className="detailed-reviews__badge">Replied</span>
                ) : (
                  <button
                    className="detailed-reviews__button"
                    onClick={() => handleReply(rev.id)}
                  >
                    <span className="detailed-reviews__button-icon">
                      <Reply size={12} />
                    </span>
                    Reply
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DetailedReviews;
