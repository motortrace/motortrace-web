import React from 'react';
import './FeaturedBrands.scss';

import toyotaLogo from '../../../assets/images/logos/toyota.png';
import hondaLogo from '../../../assets/images/logos/honda.png';
import boschLogo from '../../../assets/images/logos/toyota.png';
import exideLogo from '../../../assets/images/logos/exide.png';
import ngkLogo from '../../../assets/images/logos/toyota.png';

const brands = [
  { name: 'Toyota', logo: toyotaLogo },
  { name: 'Honda', logo: hondaLogo },
  { name: 'Bosch', logo: boschLogo },
  { name: 'Exide', logo: exideLogo },
  { name: 'NGK', logo: ngkLogo },
];

const FeaturedBrands: React.FC = () => {
  return (
    <section className="featured-brands">
      <h2>Featured Brands</h2>
      <div className="brand-logos">
        {brands.map((brand, idx) => (
          <div className="brand-logo" key={idx}>
            <img src={brand.logo} alt={brand.name} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedBrands;
