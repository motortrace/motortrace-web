import React from 'react';
import './OffersSection.scss';
import spareParts from '../../../assets/images/offers/spareParts-removebg-preview.png' ;
import delivery from '../../../assets/images/offers/delivery.png' ;

const OffersSection: React.FC = () => {
  return (
    <section className="offers-section">
      <div className="offer offer--dark">
        <div className="offer__content">
          <h3>Gear Up for Summer Drives</h3>
          <p>Up to 40% off on engine oils, brake pads & accessories. Limited stock available!</p>
          <button>Browse Deals</button>
        </div>
        <div className="offer__image">
          <img src={spareParts} alt="Engine Oil Offer" />
        </div>
      </div>

      <div className="offer offer--light">
        <div className="offer__content">
          <h3>Free Delivery on Bulk Orders</h3>
          <p>Enjoy free shipping on orders above LKR 5,000. No code needed.hi hi hi<br/>hahaahahah<br/></p>
          <button>Shop Now</button>
        </div>
        <div className="offer__image">
          <img src={delivery} alt="Delivery Truck Offer" />
        </div>
      </div>
    </section>
  );
};

export default OffersSection;
