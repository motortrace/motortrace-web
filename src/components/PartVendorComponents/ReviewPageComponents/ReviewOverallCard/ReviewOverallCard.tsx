import React from 'react';
import './ReviewOverallCard.scss';
import { Star } from 'lucide-react';
import google from '../../../../assets/images/google.png';
import logo from '../../../../assets/images/motortraceLogo.png';
const ReviewOverallCard: React.FC = () => {
  return (
    <div className="review-overall-card">
      <div className="review-overall-card__header">
        <span className="review-overall-card__title">Overall Rating</span>
        <div className="review-overall-card__rating">
          <Star size={18} fill="#fbbf24" stroke="#fbbf24" />
          <span>4.8</span>
        </div>
      </div>

      <div className="review-overall-card__source">
        <div className="review-overall-card__source-item">
          <div className="review-overall-card__logo">
            <img src={google} alt="Google" />
          </div>
          <div className="review-overall-card__source-info">
            <div className="review-overall-card__source-rating">
              <Star size={14} fill="#fbbf24" stroke="#fbbf24" />
              <span>4.5</span>
            </div>
            <div className="review-overall-card__review-count">234 reviews</div>
          </div>
        </div>

        <div className="review-overall-card__source-item">
          <div className="review-overall-card__logo">
            <img src={logo} alt="Motor Trace" />
          </div>
          <div className="review-overall-card__source-info">
            <div className="review-overall-card__source-rating">
              <Star size={14} fill="#fbbf24" stroke="#fbbf24" />
              <span>4.2</span>
            </div>
            <div className="review-overall-card__review-count">120 reviews</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewOverallCard;
