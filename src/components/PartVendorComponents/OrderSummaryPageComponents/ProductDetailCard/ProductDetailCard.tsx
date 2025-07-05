import React from 'react';
import { Check, X } from 'lucide-react';
import './ProductDetailCard.scss';

interface ProductDetailCardProps {
  imageUrl: string;
  name: string;
  description: string;
  size?: string;
  weight?: string;
  quantity: number;
  price: number;
  currency?: string;
}

const ProductDetailCard: React.FC<ProductDetailCardProps> = ({
  imageUrl,
  name,
  description,
  size,
  weight,
  quantity,
  price,
  currency = 'LKR',
}) => {
  return (
    <div className="product-detail-card">
      <div className="product-detail-card__image">
        <img src={imageUrl} alt={name} />
      </div>

      <div className="product-detail-card__info">
        <div className="product-detail-card__name">{name}</div>
        <div className="product-detail-card__description">
          {description}
          {size && <span> · Size: {size}</span>}
          {weight && <span> · Weight: {weight}</span>}
        </div>

        <div className="product-detail-card__quantity">
          Quantity: {quantity}
        </div>
      </div>

      <div className="product-detail-card__side">
        <div className="product-detail-card__price">
          {currency} {price.toLocaleString()}
        </div>
        <div className="product-detail-card__buttons">
          <button className="product-detail-card__button">
            <span className="product-detail-card__button-icon">
              <Check size={12} />
            </span>
            Shippable
          </button>
          <button className="product-detail-card__button">
            <span className="product-detail-card__button-icon">
              <X size={12} />
            </span>
            Not Shippable
          </button>
        </div>
      </div>

    </div>
  );
};

export default ProductDetailCard;
