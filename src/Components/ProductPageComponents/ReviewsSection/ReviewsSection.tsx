import React from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';
import sampleAvatar from '../../../assets/images/AC.png'; // Placeholder
import reviewImg from '../../../assets/images/Reviews/Review1.png'; // Sample review image
import './ReviewsSection.scss';

const reviews = [
  {
    id: 1,
    name: 'Ahmed Khan',
    avatar: sampleAvatar,
    rating: 5,
    comment:
      'The bumper fits perfectly and matches the original design exactly. Installation was straightforward, and the quality feels solid and durable.',
    images: [reviewImg],
    date: 'June 14, 2025',
  },
  {
    id: 2,
    name: 'Sara Malik',
    avatar: sampleAvatar,
    rating: 4,
    comment:
      'Good quality bumper. The paint finish looks great. Took a bit longer to install than expected but worth it.',
    images: [],
    date: 'June 10, 2025',
  },
  {
    id: 3,
    name: 'Bilal Sheikh',
    avatar: sampleAvatar,
    rating: 5,
    comment:
      'Excellent fit and robust build. Delivery was fast and customer service was helpful with installation tips.',
    images: [],
    date: 'June 8, 2025',
  },
  {
    id: 4,
    name: 'Hina Qureshi',
    avatar: sampleAvatar,
    rating: 3,
    comment:
      'The bumper looks great but I had some issues aligning it perfectly during installation. Otherwise, a solid product.',
    images: [],
    date: 'June 5, 2025',
  },
];


const ReviewSection = () => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) =>
      i < rating ? <FaStar key={i} color="#fbbf24" /> : <FaRegStar key={i} color="#d1d5db" />
    );
  };

  return (
    <div className="review-section">
      {reviews.map((review) => (
        <div key={review.id} className="review-card">
          <div className="review-header">
            <img src={review.avatar} alt={review.name} className="avatar" />
            <div>
              <div className="reviewer-name">{review.name}</div>
              <div className="review-date">{review.date}</div>
            </div>
          </div>

          <div className="stars">{renderStars(review.rating)}</div>

          <p className="review-comment">{review.comment}</p>

          {review.images.length > 0 && (
            <div className="review-images">
              {review.images.map((img, i) => (
                <img key={i} src={img} alt={`Review ${i + 1}`} />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ReviewSection;
