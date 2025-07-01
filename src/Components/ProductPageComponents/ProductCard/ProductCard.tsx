import React, { useState } from 'react';
import './ProductCard.scss';

import {
  FaRegHeart,
  FaPlus,
  FaMinus,
  FaStar,
  FaRegStar,
  FaStarHalfAlt
} from 'react-icons/fa';

import storeImage from '../../../assets/images/store.png';
import ReviewSection from '../ReviewsSection/ReviewsSection';
import bumper1 from '../../../assets/images/ProductPage/bumper1.png';
import bumper2 from '../../../assets/images/ProductPage/bumper2.png';
import bumper3 from '../../../assets/images/ProductPage/bumper3.png';
import bumper4 from '../../../assets/images/ProductPage/bumper4.png';
import QuestionsAndAnswers from '../QuestionsAndAnswers/QuestionsAndAnswers';
import ShareMenu from '../ShareMenu/ShareMenu';
import RelatedItems from '../RelatedItems/RelatedItems';
import { useNavigate } from 'react-router-dom';


const thumbnails = [bumper1, bumper2, bumper3, bumper4];

const ProductCard = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(bumper1);
  const [quantity, setQuantity] = useState(1);
  const [openSection, setOpenSection] = useState<string | null>(null);

  const averageRating = 4.6;
  const totalReviews = 98;
  const fullStars = Math.floor(averageRating);
  const hasHalfStar = averageRating % 1 >= 0.25 && averageRating % 1 < 0.75;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const toggleSection = (section: string) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  return (
    <div className="product-page-wrapper">
      <div className="single-product-card">
        <div className="single-product-card__gallery">
          <img className="main-image" src={selectedImage} alt="Product" />
          <div className="thumbnails">
            {thumbnails.map((img, i) => (
              <img
                key={i}
                src={img}
                alt="Thumbnail"
                className={img === selectedImage ? 'active' : ''}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>
        </div>

        <div className="single-product-card__info">
          <h1>Toyota Corolla 2018 Front Bumper with Fog Light Cutouts</h1>

          <div className="single-product-card__rating-share">
            <div className="stars">
              {Array.from({ length: fullStars }).map((_, i) => (
                <FaStar key={`full-${i}`} />
              ))}
              {hasHalfStar && <FaStarHalfAlt key="half" />}
              {Array.from({ length: emptyStars }).map((_, i) => (
                <FaRegStar key={`empty-${i}`} />
              ))}
              <span className="rating-text">
                {averageRating.toFixed(1)} ({totalReviews} reviews)
              </span>
            </div>
            <ShareMenu />
          </div>

          <div className="price">Rs 7,499</div>

          <p className="description">
            Durable and OEM-style Toyota Corolla 2018 front bumper with fog light cutouts. Unpainted and includes mounting brackets.
          </p>

          <div className="purchase-controls">
            <div className="quantity">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                <FaMinus />
              </button>
              <input type="number" readOnly value={quantity} />
              <button onClick={() => setQuantity(quantity + 1)}>
                <FaPlus />
              </button>
            </div>

            <button className="add-to-cart">Add to Cart</button>
            <button className="wishlist-button">
              <FaRegHeart />
            </button>
          </div>

          <button className="buy-now" onClick={()=> navigate('/store')}>Buy Now</button>

          <div className="shipping-info">
            <div className="shipping-row">
              <span className="label">Shipping:</span>
              <span className="value">Rs 599</span>
            </div>
            <div className="shipping-row">
              <span className="label">Estimated Delivery:</span>
              <span className="value">Jun 27 – Jul 1</span>
            </div>
            <button className="calculate-shipping">Calculate Shipping</button>
          </div>

          <div className="store-info">
            <div className="store-details">
              <img className="store-logo" src={storeImage} alt="Store Logo" />
              <div className="store-text">
                <div className="store-name">BodyTech Auto Parts</div>
                <div className="store-rating">★ 4.9 (310 reviews)</div>
              </div>
            </div>
            <button className="view-store-button">View Store</button>
          </div>

          <hr />

          <div className="product-meta">
            <div><strong>SKU:</strong> COR-BMP-F18</div>
            <div><strong>Brand:</strong> Aftermarket</div>
            <div><strong>Category:</strong> Body Parts</div>
          </div>

          <div className="accordion-section">
            <div className="accordion-item">
              <div className="accordion-header" onClick={() => toggleSection('details')}>
                <span><strong>Product Details</strong></span>
                {openSection === 'details' ? <FaMinus /> : <FaPlus />}
              </div>
              {openSection === 'details' && (
                <div className="accordion-content">
                  <h4>Key Features:</h4>
                  <ul>
                    <li>Durable polypropylene construction</li>
                    <li>OEM-style fitment</li>
                    <li>Includes mounting brackets</li>
                    <li>Compatible with fog lights</li>
                    <li>Unpainted (ready for color)</li>
                  </ul>
                </div>
              )}
            </div>

            <div className="accordion-item">
              <div className="accordion-header" onClick={() => toggleSection('compatibility')}>
                <span><strong>Compatible Models</strong></span>
                {openSection === 'compatibility' ? <FaMinus /> : <FaPlus />}
              </div>
              {openSection === 'compatibility' && (
                <div className="accordion-content">
                  <ul>
                    <li>• Toyota Corolla 2017 – 2019</li>
                  </ul>
                </div>
              )}
            </div>

            <div className="accordion-item">
              <div className="accordion-header" onClick={() => toggleSection('shipping')}>
                <span><strong>Shipping & Returns</strong></span>
                {openSection === 'shipping' ? <FaMinus /> : <FaPlus />}
              </div>
              {openSection === 'shipping' && (
                <div className="accordion-content">
                  Ships within 2–3 working days. 7-day return policy available on manufacturing faults only.
                </div>
              )}
            </div>

            <div className="accordion-item">
              <div className="accordion-header" onClick={() => toggleSection('questions')}>
                <span><strong>Questions & Answers</strong></span>
                {openSection === 'questions' ? <FaMinus /> : <FaPlus />}
              </div>
              {openSection === 'questions' && (
                <div className="accordion-content">
                  <QuestionsAndAnswers />
                </div>
              )}
            </div>

            <div className="accordion-item">
              <div className="accordion-header" onClick={() => toggleSection('reviews')}>
                <span><strong>Reviews</strong></span>
                {openSection === 'reviews' ? <FaMinus /> : <FaPlus />}
              </div>
              {openSection === 'reviews' && (
                <div className="accordion-content">
                  <ReviewSection />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ✅ This ensures RelatedItems shows below the product card */}
      <div className="related-section-wrapper">
        <RelatedItems />
      </div>
      
    </div>
  );
};

export default ProductCard;
