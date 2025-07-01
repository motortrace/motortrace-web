import React from 'react';
import './StoreCategoryNav.scss';

const categories = [
  'All',
  'Engine Parts',
  'Electrical',
  'Brakes',
  'Suspension',
  'Cooling System',
  'Body Parts',
  'Accessories',
];

const StoreCategoryNav = () => {
  return (
    <nav className="store-category-nav">
      {categories.map((category, index) => (
        <button className="category-item" key={index}>
          {category}
        </button>
      ))}
    </nav>
  );
};

export default StoreCategoryNav;
