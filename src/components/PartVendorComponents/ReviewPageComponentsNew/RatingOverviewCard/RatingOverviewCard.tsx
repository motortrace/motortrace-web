import React from 'react';
import './RatingOverviewCard.scss';
import googleLogo from '../../../../assets/images/google.png';
import mtLogo from '../../../../assets/images/motortraceLogo.png';
import { Star, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface RatingSource {
  label: string;
  logo: string;
  rating: number;
  reviews: number;
  change: number;
}

const sources: RatingSource[] = [
  { label: 'Google', logo: googleLogo, rating: 4.5, reviews: 128, change: 0.2 },
  { label: 'MotorTrace', logo: mtLogo, rating: 4.3, reviews: 85, change: -0.1 },
];

const RatingsOverviewCard = () => (
  <div className="ratings-overview-card">
    <h3 className="ratings-overview-card__title">Current Rating</h3>
    <div className="ratings-overview-card__sources-vertical">
      {sources.map((src) => (
        <div key={src.label} className="ratings-overview-card__source">
          <div className="ratings-overview-card__header">
            <img src={src.logo} alt={`${src.label} logo`} className="ratings-overview-card__logo" />
            <span className="ratings-overview-card__label">{src.label}</span>
          </div>
          <div className="ratings-overview-card__metrics">
            <span className="ratings-overview-card__rating">
              <Star size={16} fill="#fbbf24" stroke="#fbbf24" /> {src.rating.toFixed(1)}
            </span>
            <span className="ratings-overview-card__count">({src.reviews} reviews)</span>
            <span
              className={`ratings-overview-card__change ${
                src.change >= 0 ? 'positive' : 'negative'
              }`}
            >
              {src.change >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              {Math.abs(src.change)} since last month
            </span>
          </div>
        </div>
      ))}
    </div>
    <div className="ratings-overview-card__tags-section">
      
      <div className="ratings-overview-card__tags-list">
        <span className="ratings-overview-card__tag">Perfect Part Match +5</span>
        <span className="ratings-overview-card__tag">Fast Delivery +3</span>
        <span className="ratings-overview-card__tag">Good Packaging +2</span>
        <span className="ratings-overview-card__tag">Helpful Support +1</span>
        <span className="ratings-overview-card__tag">Easy Returns +2</span>
        <span className="ratings-overview-card__tag">Accurate Description +4</span>
        <span className="ratings-overview-card__tag">Friendly Staff +2</span>
        <span className="ratings-overview-card__tag">Affordable Price +3</span>
        <span className="ratings-overview-card__tag">Quick Response +2</span>
      </div>
    </div>
  </div>
);

export default RatingsOverviewCard;
