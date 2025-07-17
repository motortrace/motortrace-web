import React from 'react';
import './ReviewFilters.scss';
import { Star } from 'lucide-react';

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
      <div className="review-filters__group">
        <label>Rating:</label>
        <div className="review-filters__stars">
          {ratings.map((star) => (
            <button
              key={star}
              className={selectedRating === star ? 'active' : ''}
              onClick={() => setSelectedRating(selectedRating === star ? null : star)}
            >
              {star} <Star size={14} fill="#fbbf24" stroke="none" />
            </button>
          ))}
        </div>
      </div>

      <div className="review-filters__group">
        <label>Source:</label>
        <select
          value={selectedSource}
          onChange={(e) => setSelectedSource(e.target.value)}
        >
          {sources.map((src) => (
            <option key={src} value={src}>
              {src}
            </option>
          ))}
        </select>
      </div>

      <div className="review-filters__group">
        <label>Status:</label>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="review-filters__group">
        <label>Date:</label>
        <input
          type="month"
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default ReviewFilters;
