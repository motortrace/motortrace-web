import React from 'react';
import './ReviewFilters.scss';
import { Star, ChevronDown } from 'lucide-react';



const ReviewFilters = ({
  selectedRating,
  setSelectedRating,
  selectedSource,
  setSelectedSource,
  selectedStatus,
  setSelectedStatus,
  dateRange,
  setDateRange,
}: any) => {
  const ratings = [5, 4, 3, 2, 1];
  const sources = ['All', 'Google', 'MotorTrace'];
  const statuses = ['All', 'Replied', 'Unreplied'];

  return (
    <div className="review-filters">
      <div className="review-filters__block">
        <span className="review-filters__label">Rating</span>
        <div className="review-filters__rating-buttons">
          {ratings.map((r) => (
            <button
              key={r}
              className={`pill ${selectedRating === r ? 'active' : ''}`}
              onClick={() => setSelectedRating(selectedRating === r ? null : r)}
            >
              {r} <Star size={14} fill="#fbbf24" stroke="none" />
            </button>
          ))}
        </div>
      </div>

      {/* <div className="review-filters__block">
        <span className="review-filters__label">Source</span>
        <div className="select-wrapper">
          <select value={selectedSource} onChange={(e) => setSelectedSource(e.target.value)}>
            {sources.map((src) => (
              <option key={src} value={src}>
                {src}
              </option>
            ))}
          </select>
          <ChevronDown size={16} className="chevron" />
        </div>
      </div> */}

      <div className="review-filters__block">
        <span className="review-filters__label">Status</span>
        <div className="select-wrapper">
          <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <ChevronDown size={16} className="chevron" />
        </div>
      </div>

      <div className="review-filters__block">
        <span className="review-filters__label">Month</span>
        <input
          type="month"
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="month-input"
        />
      </div>
    </div>
  );
};

export default ReviewFilters;
