import "./FeatureCard.scss"

interface FeatureCardProps {
    imageSrc: string;
    header: string;
    description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ imageSrc, header, description }) => {
    return (
        <div className = "landing-feature-card">

            <div className = "landing-feature-card__image-container">
                <img src={imageSrc} alt={header} />
            </div>

            <h3>{header}</h3>

            <div className = "landing-feature-card__description-container">
                {description}
            </div>
            
        </div>
    );
};

export default FeatureCard;

