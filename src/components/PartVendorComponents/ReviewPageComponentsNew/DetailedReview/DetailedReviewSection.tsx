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
    {
      id: 3,
      name: 'Lena K.',
      email: 'lena@auto.com',
      rating: 4,
      review: 'Clean interface and smooth checkout.',
      date: '2025-07-06',
      images: [],
      reply: '',
    },
    {
      id: 4,
      name: 'Victor R.',
      email: 'vic@carzone.io',
      rating: 2.5,
      review: 'Product arrived damaged. Was replaced after 5 days.',
      date: '2025-07-04',
      images: [],
      reply: '',
    },
    {
      id: 5,
      name: 'Rita M.',
      email: 'rita@garage.net',
      rating: 5,
      review: 'Perfect fit. Fast shipping. No issues!',
      date: '2025-07-03',
      images: [image1],
      reply: '',
    },
    {
      id: 6,
      name: 'Akhil Verma',
      email: 'akhil@verma.io',
      rating: 3,
      review: 'Expected better packaging. Otherwise great.',
      date: '2025-07-01',
      images: [],
      reply: '',
    },
    {
      id: 7,
      name: 'Sandra Dee',
      email: 'sandra@auto.com',
      rating: 4.2,
      review: 'Great help from support team!',
      date: '2025-06-28',
      images: [image2],
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
    {
      id: 8,
      name: 'Lucas N.',
      email: 'lucasn@techcar.com',
      rating: 5,
      review: 'Found rare parts easily. Kudos!',
      date: '2025-06-25',
      images: [],
      reply: '',
    },
    {
      id: 9,
      name: 'Eva R.',
      email: 'eva@luxurywheels.com',
      rating: 3.5,
      review: 'Website is good but tracking is poor.',
      date: '2025-06-22',
      images: [],
      reply: '',
    },
    {
      id: 10,
      name: 'Brian Fox',
      email: 'bfox@mail.com',
      rating: 4.8,
      review: 'Absolutely seamless. Will buy again!',
      date: '2025-06-20',
      images: [image3],
      reply: '',
    },
  ],
};

const DetailedReviewsSection = () => {
  const [activeTab, setActiveTab] = useState<'google' | 'motortrace'>('google');
  const [replyingTo, setReplyingTo] = useState<any>(null);
  const [replyText, setReplyText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const reviews = reviewsData[activeTab];
  const REVIEWS_PER_PAGE = 4;

  const paginatedReviews = reviews.slice(
    (currentPage - 1) * REVIEWS_PER_PAGE,
    currentPage * REVIEWS_PER_PAGE
  );

  const totalPages = Math.ceil(reviews.length / REVIEWS_PER_PAGE);

  const handleTabSwitch = (tab: 'google' | 'motortrace') => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleReplySubmit = () => {
    console.log(`Replying to review ID: ${replyingTo.id}, Message:`, replyText);
    setReplyingTo(null);
    setReplyText('');
  };

  return (
    <div className="detailed-reviews">
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
        <div className="detailed-reviews__tabs">
          <button
            className={`detailed-reviews__tab ${activeTab === 'google' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('google')}
          >
            Google Reviews
          </button>
          <button
            className={`detailed-reviews__tab ${activeTab === 'motortrace' ? 'active' : ''}`}
            onClick={() => handleTabSwitch('motortrace')}
          >
            MotorTrace Reviews
          </button>
        </div>
        <div style={{ flex: 1 }}>
          <ReviewFilters />
        </div>
      </div>

      <div className="detailed-reviews__list">
        {paginatedReviews.map((review) => (
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
              <p className="detailed-reviews__text">{review.review}</p>

              {review.images.length > 0 && (
                <div className="detailed-reviews__images">
                  {review.images.map((img, idx) => (
                    <img key={idx} src={img} alt={`review-${idx}`} />
                  ))}
                </div>
              )}

              {review.reply ? (
                <div className="detailed-reviews__reply">
                  <div className="detailed-reviews__reply-label">Shop Reply:</div>
                  <div className="detailed-reviews__reply-text">{review.reply}</div>
                  <div className="detailed-reviews__reply-date">{review.replyDate}</div>
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

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={currentPage === i + 1 ? 'active' : ''}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {/* Reply Modal */}
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
