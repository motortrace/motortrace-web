import React, { useState } from 'react';
import './DetailedReviewSection.scss';
import { Star, MessageSquareReply, X } from 'lucide-react';

import profilePlaceholder from '../../../../assets/images/user.png';
import image1 from '../../../../assets/images/airFilter.png';
import image2 from '../../../../assets/images/brakePad.png';
import image3 from '../../../../assets/images/spark.png';
import ReviewFilters from '../ReviewFilters/ReviewFilters';

const reviewsData = {
  google: [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@gmail.com',
      rating: 4.5,
      review: 'Very helpful team and the parts were exactly as described. Delivery was fast.',
      date: '2025-07-10',
      images: [image1, image2],
      reply: 'Thanks John! We appreciate your support.',
      replyDate: '2025-07-11',
    },
    {
      id: 2,
      name: 'Mark Smith',
      email: 'mark@gmail.com',
      rating: 5,
      review: 'Got everything I needed for my car in one go. Excellent store!',
      date: '2025-07-08',
      images: [],
      reply: '',
    },
  ],
  motortrace: [
    {
      id: 3,
      name: 'Jane Parker',
      email: 'jane@motor.com',
      rating: 3,
      review: 'Good quality but had to wait longer than expected.',
      date: '2025-07-06',
      images: [image3],
      reply: '',
    },
  ],
};

const DetailedReviewsSection = () => {
  const [activeTab, setActiveTab] = useState<'google' | 'motortrace'>('google');
  const [replyingTo, setReplyingTo] = useState<any>(null);
  const [replyText, setReplyText] = useState('');

  const reviews = reviewsData[activeTab];

  const handleReplySubmit = () => {
    console.log(`Replying to review ID: ${replyingTo.id}, Message:`, replyText);
    setReplyingTo(null);
    setReplyText('');
  };

  return (
    <div className="detailed-reviews">
      
      {/* <div className="detailed-reviews__tabs">
        <button
          className={`detailed-reviews__tab ${activeTab === 'google' ? 'active' : ''}`}
          onClick={() => setActiveTab('google')}
        >
          Google Reviews
        </button>
        <button
          className={`detailed-reviews__tab ${activeTab === 'motortrace' ? 'active' : ''}`}
          onClick={() => setActiveTab('motortrace')}
        >
          MotorTrace Reviews
        </button>
      </div> */}

      <div className="detailed-reviews__list">
        <ReviewFilters/>
        {reviews.map((review) => (
          <div key={review.id} className="detailed-reviews__card">
            <div className="detailed-reviews__header">
              <img src={profilePlaceholder} alt={review.name} className="detailed-reviews__avatar" />
              <div className="detailed-reviews__info">
                <div className="detailed-reviews__name">{review.name}</div>
                <div className="detailed-reviews__meta">
                  <span>{review.email}</span>
                  <span>{review.date}</span>
                </div>
              </div>
              <div className="detailed-reviews__rating">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i < Math.round(review.rating) ? '#fbbf24' : '#e5e7eb'}
                    stroke="none"
                  />
                ))}
                <span>{review.rating.toFixed(1)}</span>
              </div>
            </div>

            <div className="detailed-reviews__content">
              <p>{review.review}</p>

              {review.images.length > 0 && (
                <div className="detailed-reviews__images">
                  {review.images.map((img, idx) => (
                    <img key={idx} src={img} alt={`review-${idx}`} />
                  ))}
                </div>
              )}

              {review.reply ? (
                <div className="detailed-reviews__reply">
                  <strong>Shop Reply:</strong>
                  <p>{review.reply}</p>
                  {review.replyDate && <small>{review.replyDate}</small>}
                </div>
              ) : (
                <button
                  className="detailed-reviews__reply-button"
                  onClick={() => setReplyingTo(review)}
                >
                  <MessageSquareReply size={16} /> Reply
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
{replyingTo && (
  <div className="reply-modal__overlay">
    <div className="reply-modal">
      <div className="reply-modal__header">
        <h4>Reply to {replyingTo.name}</h4>
        <X className="reply-modal__close" onClick={() => setReplyingTo(null)} />
      </div>

<div className="reply-modal__user">
  <img src={profilePlaceholder} alt={replyingTo.name} />
  <div>
    <div className="name">{replyingTo.name}</div>
    <div className="email">{replyingTo.email}</div>

    <div className="reply-modal__review">
      <div className="stars">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            fill={i < Math.round(replyingTo.rating) ? '#fbbf24' : '#e5e7eb'}
            stroke="none"
          />
        ))}
        <span>{replyingTo.rating.toFixed(1)}</span>
      </div>
      <p className="review-text">"{replyingTo.review}"</p>
    </div>
  </div>
</div>


<div className="reply-modal__suggestions">
  <span>Quick Replies:</span>
  <div className="suggestion-buttons">
    {[
      'Thanks for your feedback!',
      'We appreciate your support!',
      'We’ll work on improving that.',
      'Glad you had a great experience!',
    ].map((text, idx) => (
      <button key={idx} onClick={() => setReplyText(text)}>
        {text}
      </button>
    ))}
  </div>
</div>


      <textarea
        placeholder="Type your reply..."
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
        rows={4}
      />

      <div className="reply-modal__actions">
        <button className="cancel" onClick={() => setReplyingTo(null)}>Cancel</button>
        <button className="submit" onClick={handleReplySubmit}>Send Reply</button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default DetailedReviewsSection;
