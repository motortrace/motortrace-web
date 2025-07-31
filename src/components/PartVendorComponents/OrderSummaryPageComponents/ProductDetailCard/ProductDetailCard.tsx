import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import './ProductDetailCard.scss';
import NotShippableModal from '../NotShippableModal/NotShippableModal';

interface ProductDetailCardProps {
  imageUrl: string;
  name: string;
  description: string;
  size?: string;
  weight?: string;
  quantity: number;
  price: number;
  currency?: string;
  status?: 'Pending' | 'Accepted' | 'Declined';
  onMarkStatus: (status: 'shippable' | 'not-shippable', reason?: string) => void;
  markedStatus?: 'shippable' | 'not-shippable';
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
  status,
  onMarkStatus,
  markedStatus,
}) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [reason, setReason] = useState('');

  const handleNotShippableClick = () => setModalOpen(true);

  const handleCancel = () => {
    setModalOpen(false);
    setReason('');
  };

  const handleConfirm = () => {
    onMarkStatus('not-shippable', reason);
    setModalOpen(false);
  };

  const handleShippable = () => {
    onMarkStatus('shippable');
  };

  return (
    <>
      <div className={`product-detail-card ${markedStatus ? 'product-detail-card--marked' : ''}`}>
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

          <div className="product-detail-card__quantity">Quantity: {quantity}</div>
        </div>

        <div className="product-detail-card__side">
          <div className="product-detail-card__price">
            {currency} {price.toLocaleString()}
          </div>

          {status === 'Accepted' && !markedStatus && (
            <div className="product-detail-card__buttons">
              <button className="product-detail-card__button" onClick={handleShippable}>
                <span className="product-detail-card__button-icon">
                  <Check size={12} />
                </span>
                Shippable
              </button>
              <button className="product-detail-card__button" onClick={handleNotShippableClick}>
                <span className="product-detail-card__button-icon">
                  <X size={12} />
                </span>
                Not Shippable
              </button>
            </div>
          )}

          {markedStatus === 'shippable' && (
            <div className="product-detail-card__tag product-detail-card__tag--shippable">
              <Check size={12} /> Marked Shippable
            </div>
          )}
          {markedStatus === 'not-shippable' && (
            <div className="product-detail-card__tag product-detail-card__tag--not-shippable">
              <X size={12} /> Not Shippable
            </div>
          )}
        </div>
      </div>

      <NotShippableModal
        visible={isModalOpen}
        reason={reason}
        onReasonChange={setReason}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      />
    </>
  );
};

export default ProductDetailCard;
