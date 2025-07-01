import React from 'react';
import './RelatedItems.scss';
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';
import bumper1 from '../../../assets/images/ProductPage/bumper1.png';
import headlight from '../../../assets/images/ProductPage/RelatedItems/headlight.png';
import foglight from '../../../assets/images/ProductPage/RelatedItems/foglight.png';
import mirror from '../../../assets/images/ProductPage/RelatedItems/sidemirror.png';
import grille from '../../../assets/images/ProductPage/RelatedItems/grille.png';

const relatedItems = [
  {
    id: 1,
    name: 'Toyota Corolla 2018 Rear Bumper',
    price: 'Rs 6,999',
    image: bumper1,
    rating: 4.3,
    reviews: 45
  },
  {
    id: 2,
    name: 'Toyota Corolla Headlight Right Side',
    price: 'Rs 4,299',
    image: headlight,
    rating: 4.1,
    reviews: 32
  },
  {
    id: 3,
    name: 'Toyota Corolla Fog Light Kit',
    price: 'Rs 2,199',
    image: foglight,
    rating: 3.9,
    reviews: 21
  },
  {
    id: 4,
    name: 'Toyota Corolla Side Mirror (Left)',
    price: 'Rs 3,499',
    image: mirror,
    rating: 4.4,
    reviews: 29
  },
  {
    id: 5,
    name: 'Toyota Corolla Grille',
    price: 'Rs 5,799',
    image: grille,
    rating: 4.0,
    reviews: 18
  }
];



const RelatedItems = () => {
  return (
    <div className="related-items">
      <h3>Related Items</h3>
      <div className="items-carousel">
        {relatedItems.map((item) => (
          <div className="related-card" key={item.id}>
            <img src={item.image} alt={item.name} />
<div className="related-info">
  <p className="related-name">{item.name}</p>

<div className="related-rating">
  <div className="stars">
    {Array.from({ length: Math.floor(item.rating) }).map((_, i) => (
      <FaStar key={`full-${i}`} color="#fbbf24" size={14} />
    ))}
    {item.rating % 1 >= 0.25 && item.rating % 1 < 0.75 && (
      <FaStarHalfAlt key="half" color="#fbbf24" size={14} />
    )}
    {Array.from({ length: 5 - Math.ceil(item.rating) }).map((_, i) => (
      <FaRegStar key={`empty-${i}`} color="#fbbf24" size={14} />
    ))}
  </div>
  <span className="rating-number">
    {item.rating.toFixed(1)} ({item.reviews} reviews)
  </span>
</div>


  <p className="related-price">{item.price}</p>
  <button className="view-button">View Item</button>
</div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedItems;
