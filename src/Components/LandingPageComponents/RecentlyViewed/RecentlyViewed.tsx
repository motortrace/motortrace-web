import React from 'react';
import './RecentlyViewed.scss';
import { FaStar, FaRegStar, FaRegHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import sideMirror from '../../../assets/images/airFilter-nobackground.png';
import brakeDisc from '../../../assets/images/battery-nobackground.png';
import battery from '../../../assets/images/oilBottle.png';

const viewedItems = [
  {
    id: 1,
    name: 'Side Mirror Honda Vezel 2016 Right Side',
    image: sideMirror,
    rating: 5,
    reviews: 23,
    price: 'Rs 3,499',
  },
  {
    id: 2,
    name: 'Bosch Brake Disc – Rear – Toyota Corolla',
    image: brakeDisc,
    rating: 4,
    reviews: 10,
    price: 'Rs 2,299',
  },
  {
    id: 3,
    name: 'Exide Car Battery – 12V 65Ah',
    image: battery,
    rating: 5,
    reviews: 18,
    price: 'Rs 6,899',
  },
    {
    id: 1,
    name: 'Side Mirror Honda Vezel 2016 Right Side',
    image: sideMirror,
    rating: 5,
    reviews: 23,
    price: 'Rs 3,499',
  },
  {
    id: 2,
    name: 'Bosch Brake Disc – Rear – Toyota Corolla',
    image: brakeDisc,
    rating: 4,
    reviews: 10,
    price: 'Rs 2,299',
  },
  {
    id: 3,
    name: 'Exide Car Battery – 12V 65Ah',
    image: battery,
    rating: 5,
    reviews: 18,
    price: 'Rs 6,899',
  },
];

const RecentlyViewed: React.FC = () => {
  const navigate = useNavigate();

  const handleBuyNow = () => {
    navigate('/product');
  };

  return (
    <section className="recently-viewed">
      <h2>Recently Viewed</h2>
      <div className="recently-viewed__list">
        {viewedItems.map((item) => (
          <div className="product-card" key={item.id}>
            <div className="product-card__image">
              <img src={item.image} alt={item.name} />
            </div>
            <div className="product-card__info">
              <h3>{item.name}</h3>
              <div className="product-card__rating">
                {Array.from({ length: 5 }, (_, i) =>
                  i < item.rating ? <FaStar key={i} /> : <FaRegStar key={i} />
                )}
                <span className="review-count">({item.reviews} reviews)</span>
              </div>
              <div className="product-card__price">{item.price}</div>
              <div className="product-card__actions">
                <button className="add-to-cart" onClick={handleBuyNow}>Buy Now</button>
                <button className="wishlist">
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

export default RecentlyViewed;
