import React from 'react';
import { FaStar, FaRegStar, FaRegHeart } from 'react-icons/fa';
import './StoreProductGrid.scss';

import brakePad from '../../../assets/images/brakePad.png';
import airFilter from '../../../assets/images/airFilter.png';
import shockAbsorber from '../../../assets/images/shockAbsorber.png';
import light from '../../../assets/images/light.png';
import radiator from '../../../assets/images/radiator.png';

const dummyProducts = [
  {
    id: 1,
    name: 'Brake Pad Set - Toyota Corolla',
    price: '$35.00',
    image: brakePad,
    rating: 4,
    reviewCount: 27,
    badge: 'Hot',
  },
  {
    id: 2,
    name: 'Engine Oil Filter - Nissan',
    price: '$12.00',
    image: airFilter,
    rating: 3,
    reviewCount: 14,
  },
  {
    id: 3,
    name: 'Suspension Arm - Honda Civic',
    price: '$48.00',
    image: shockAbsorber,
    rating: 5,
    reviewCount: 39,
    badge: 'New',
  },
  {
    id: 4,
    name: 'LED Headlight Bulb',
    price: '$19.99',
    image: light,
    rating: 4,
    reviewCount: 21,
  },
  {
    id: 5,
    name: 'Radiator - Hyundai Accent',
    price: '$85.00',
    image: radiator,
    rating: 5,
    reviewCount: 55,
    badge: 'Hot',
  },
  {
    id: 6,
    name: 'Air Filter - Ford Focus',
    price: '$9.50',
    image: airFilter,
    rating: 3,
    reviewCount: 9,
  },
];

const StoreProductGrid = () => {
  return (
    <div className="store-product-grid">
      {dummyProducts.map(({ id, image, name, price, rating, reviewCount, badge }) => (
        <div className="store-product-card" key={id}>
          <div className="store-product-card__image">
            <img src={image} alt={name} />
            {badge && <span className="badge">{badge}</span>}
          </div>
          <div className="store-product-card__info">
            <h3>{name}</h3>
            <div className="store-product-card__rating">
              {Array.from({ length: 5 }, (_, i) =>
                i < rating ? <FaStar key={i} /> : <FaRegStar key={i} />
              )}
              <span className="review-count">({reviewCount} reviews)</span>
            </div>
            <div className="store-product-card__price">{price}</div>
            <div className="store-product-card__actions">
              <button className="add-to-cart">Add to Cart</button>
              <button className="wishlist">
                <FaRegHeart />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StoreProductGrid;
