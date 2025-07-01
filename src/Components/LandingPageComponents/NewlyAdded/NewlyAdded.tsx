import React from 'react';
import './NewlyAdded.scss';
import { FaStar, FaRegStar, FaRegHeart } from 'react-icons/fa';

import airFilter from '../../../assets/images/airFilter-nobackground.png';
import brakePad from '../../../assets/images/battery-nobackground.png';
import oilCan from '../../../assets/images/oilBottle.png';

const newItems = [
  {
    name: 'Bosch Air Filter – Toyota Prius',
    image: airFilter,
    rating: 4,
    price: 'Rs 1,499',
  },
  {
    name: 'Ceramic Brake Pads – Honda Civic',
    image: brakePad,
    rating: 5,
    price: 'Rs 2,999',
  },
  {
    name: 'Shell Helix 5W-30 Engine Oil – 4L',
    image: oilCan,
    rating: 5,
    price: 'Rs 4,199',
  },
    {
    name: 'Bosch Air Filter – Toyota Prius',
    image: airFilter,
    rating: 4,
    price: 'Rs 1,499',
  },
  {
    name: 'Ceramic Brake Pads – Honda Civic',
    image: brakePad,
    rating: 5,
    price: 'Rs 2,999',
  },
  {
    name: 'Shell Helix 5W-30 Engine Oil – 4L',
    image: oilCan,
    rating: 5,
    price: 'Rs 4,199',
  },
  // ...repeat or add more items
];

const NewlyAdded: React.FC = () => {
  return (
    <section className="newly-added">
      <h2>Newly Added</h2>
      <div className="newly-added__list">
        {newItems.map((item, index) => (
          <div className="product-card" key={index}>
            <div className="product-card__image">
              <img src={item.image} alt={item.name} />
            </div>
            <div className="product-card__info">
              <div className="product-card__info-name">{item.name}</div>
              {/* <div className="product-card__info-rating">
                {Array.from({ length: 5 }, (_, i) =>
                  i < item.rating ? <FaStar key={i} /> : <FaRegStar key={i} />
                )}
              </div> */}
              <div className="product-card__info-price">{item.price}</div>
              <div className="product-card__info-actions">
                <button className="btn-primary">Buy Now</button>
                <button className="wishlist" aria-label="Add to wishlist">
                  <FaRegHeart />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default NewlyAdded;
