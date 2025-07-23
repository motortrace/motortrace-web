import { Reply, Star } from 'lucide-react';
import googleLogo from '../../../../assets/images/google.png';
import motortraceLogo from '../../../../assets/images/motortraceLogo.png';
import { default as user1, default as user2, default as user3 } from '../../../../assets/images/user.png';
import './UnrepliedReviewsCard.scss';

const reviews = {
    Google: [
        {
            id: 1,
            email: 'john.doe@gmail.com',
            rating: 4.5,
            review: 'Service was quick but the garage was hard to find.',
            image: user1,
        },
        {
            id: 2,
            email: 'mark@domain.com',
            rating: 5.0,
            review: 'Absolutely amazing experience. Will return!',
            image: user2,
        },
    ],
    MotorTrace: [
        {
            id: 3,
            email: 'jane.smith@yahoo.com',
            rating: 3.0,
            review: 'Good customer care, but the waiting time was too long.',
            image: user3,

        },
        {
            id: 1,
            email: 'john.doe@gmail.com',
            rating: 4.5,
            review: 'Service was quick but the garage was hard to find.',
            image: user1,
        }
    ],
};

const platformLogos: Record<string, string> = {
    Google: googleLogo,
    MotorTrace: motortraceLogo,
};

const UnrepliedReviewsCard = () => {
    const totalUnreplied = [...reviews.Google, ...reviews.MotorTrace].length;

    return (
        <div className="unreplied-reviews-card">
            <div className="unreplied-reviews-card__header">
                <h3>Unreplied Reviews</h3>
                <span className="unreplied-reviews-card__badge">{totalUnreplied}</span>
            </div>

            {Object.entries(reviews).map(([platform, list]) => (
                <div key={platform} className="unreplied-reviews-card__section">
                    <div className="unreplied-reviews-card__platform">
                        <img src={platformLogos[platform]} alt={`${platform} logo`} className="unreplied-reviews-card__logo" />
                        <span>{platform} ({list.length} unreplied)</span>
                    </div>

                    <div className="unreplied-reviews-card__scroll">
                        {list.map((review) => (
                            <div key={review.id} className="unreplied-reviews-card__item">
                                <div className="unreplied-reviews-card__avatar">
                                    <img src={review.image} alt="avatar" />
                                </div>
                                <div className="unreplied-reviews-card__body">
                                    <div className="unreplied-reviews-card__info">
                                        <span className="unreplied-reviews-card__email">{review.email}</span>
                                        <span className="unreplied-reviews-card__rating">
                                            <Star size={14} fill="#fbbf24" stroke="#fbbf24" />{review.rating} 
                                        </span>
                                    </div>
                                    <p className="unreplied-reviews-card__text">{review.review}</p>
                                </div>
                                <button className="unreplied-reviews-card__reply" title="Reply">
                                    <Reply size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default UnrepliedReviewsCard;
