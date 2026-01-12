import "./MobileFeatureCard.scss"

interface FeatureCardProps {
    imageSrc: string;
    header: string;
    description: string;
}

const MobileFeatureCard: React.FC<FeatureCardProps> = ({ imageSrc, header, description }) => {
    return (

        <div className="mobile-feature-card">
            <div className="mobile-feature-card__image-container">
                <img src={imageSrc} alt={header} />
            </div>

            <div className="mobile-feature-card__headingAndDescription-container">
                <h3>{header}</h3>

                <div className="mobile-feature-card__description-container">
                    {description}
                </div>
            </div>

        </div>

    )
}

export default MobileFeatureCard