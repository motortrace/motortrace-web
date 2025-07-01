import './Banner.scss';
import bannerMain from '../../../assets/images/tire.png';
import bannerTop from '../../../assets/images/engineOil.png';
import bannerBottom from '../../../assets/images/brakePadKit.png';

function FeaturedBanners() {
  return (
    <section className="featured-banners">
      <div className="banner banner--main">
        <div className="banner-content">
          <h2>Drive Confidently with Premium Spare Parts</h2>
          <p>Top-grade components built for power, precision, and long-lasting performance. Trusted by mechanics and pros.</p>
          <button>SHOP NOW</button>
        </div>
        <img src={bannerMain} alt="Tires and Spare Parts" />
      </div>

      <div className="banner-column">
        <div className="banner banner--small">
          <div className="banner-content">
            <h4>Next-Gen Engine Oils</h4>
            <p>Boost mileage & engine life — starting at just $19.99</p>
            <button>Explore</button>
          </div>
          <img src={bannerTop} alt="Engine Oil Bottle" />
        </div>

        <div className="banner banner--small">
          <div className="banner-content">
            <h4>Reliable Braking, Every Time</h4>
            <p>High-performance pads & kits from $49 — built for safety</p>
            <button>Discover</button>
          </div>
          <img src={bannerBottom} alt="Brake Pad Kit" />
        </div>
      </div>
    </section>
  );
}

export default FeaturedBanners;
