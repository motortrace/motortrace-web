// components/SortBar.tsx
import React from 'react';
import './SortOptions.scss';

const SortBar: React.FC = () => {
  return (
    <div className="sort-bar">
      <span>Sort by:</span>
      <select>
        <option>Most Popular</option>
        <option>Price: Low to High</option>
        <option>Price: High to Low</option>
        <option>Highest Rated</option>
      </select>
    </div>
  );
};

export default SortBar;
