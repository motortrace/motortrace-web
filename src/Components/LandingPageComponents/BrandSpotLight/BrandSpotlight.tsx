import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

import './brandSpotlight.scss';

import boschLogo from '../../../assets/images/logos/bosh.png';
import ngkLogo from '../../../assets/images/logos/ngk.png';
import mobilLogo from '../../../assets/images/logos/mobil.png';

const brandDeals = [
  {
    title: 'Powered by BOSCH Genuine Parts',
    description: 'Top-tier performance starts with the best components. We proudly offer authentic Bosch parts — engineered for precision and durability.',
    image: boschLogo,
    buttonText: 'Explore Bosch Range',
  },
  {
    title: 'Ignite with NGK Spark Plugs',
    description: 'Experience unmatched ignition and fuel efficiency with NGK spark plugs. Trusted by millions of vehicles worldwide.',
    image: ngkLogo,
    buttonText: 'Browse NGK Products',
  },
  {
    title: 'Engineered by Mobil 1®',
    description: 'Protect your engine under extreme conditions. Mobil 1 synthetic oils ensure high performance and extended life.',
    image: mobilLogo,
    buttonText: 'See Mobil Oils',
  },
];

const BrandDealSlider: React.FC = () => {
  return (
    <section className="brand-deal-section">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop={true}
        slidesPerView={1}
        spaceBetween={30}
      >
        {brandDeals.map((deal, index) => (
          <SwiperSlide key={index}>
            <div className="brand-deal">
              <div className="brand-deal__content">
                <h3>{deal.title}</h3>
                <p>{deal.description}</p>
                <button>{deal.buttonText}</button>
              </div>
              <div className="brand-deal__image">
                <img src={deal.image} alt={deal.title} />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default BrandDealSlider;
