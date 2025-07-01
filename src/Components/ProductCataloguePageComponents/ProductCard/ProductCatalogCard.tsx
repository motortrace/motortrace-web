import React from 'react';
import { FaStar, FaRegStar, FaRegHeart } from 'react-icons/fa';
import './ProductCard.scss';

type ProductProps = {
  name: string;
  image: string;
  price: string;
  rating: number;
  reviews: number;
};

const ProductCard: React.FC<ProductProps> = ({ name, image, price, rating, reviews }) => {
  return (
    <div className="catalogue-product-card">
      <div className="catalogue-product-card__image">
        <img src={image} alt={name} />
      </div>
      <div className="catalogue-product-card__info">
        <h3>{name}</h3>
<div className="catalogue-product-card__rating">
  {Array.from({ length: 5 }, (_, i) =>
    i < rating ? <FaStar key={i} /> : <FaRegStar key={i} />
  )}
  <span className="review-count">({reviews} reviews)</span>
</div>

        <div className="catalogue-product-card__price">{price}</div>
<div className="catalogue-product-card__actions">
  <button className="add-to-cart">Add to Cart</button>
  <button className="wishlist">
    <FaRegHeart />
  </button>
</div>

      </div>
    </div>
  );
};

export default ProductCard;
