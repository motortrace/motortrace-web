import './ShopByCategory.scss';
import { useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import tires from '../../../assets/images/tires.png';
import engineOil from '../../../assets/images/oilBottle.png';
import brakePads from '../../../assets/images/brakePads.png';
import airFilter from '../../../assets/images/airFilter.png';
import batteries from '../../../assets/images/battery.png';
import suspension from '../../../assets/images/shockAbsorber.png';
import sparkPlugs from '../../../assets/images/spark.png';
import wipers from '../../../assets/images/wiper.png';
import lights from '../../../assets/images/light.png';
import radiators from '../../../assets/images/radiator.png';
// import belts from '../../../assets/images/belts.png';
// import filters from '../../../assets/images/filters.png';
// import transmission from '../../../assets/images/transmission.png';
import acParts from '../../../assets/images/AC.png';
// import tools from '../../../assets/images/tools.png';
// import diagnostics from '../../../assets/images/diagnostics.png';
// import lubricants from '../../../assets/images/lubricants.png';


const categories = [
  { name: 'Tires', image: tires },
  { name: 'Engine Oil', image: engineOil },
  { name: 'Brake Pads', image: brakePads },
  { name: 'Air Filters', image: airFilter },
  { name: 'Batteries', image: batteries },
  { name: 'Suspension', image: suspension },
  { name: 'Spark Plugs', image: sparkPlugs },
  { name: 'Wiper Blades', image: wipers },
  { name: 'Headlights & Taillights', image: lights },
  { name: 'Radiators & Cooling', image: radiators },
//   { name: 'Belts & Hoses', image: belts },
//   { name: 'Cabin & Oil Filters', image: filters },
//   { name: 'Transmission Parts', image: transmission },
  { name: 'AC Parts', image: acParts },
//   { name: 'Tools & Equipment', image: tools },
//   { name: 'Diagnostics', image: diagnostics },
//   { name: 'Grease & Lubricants', image: lubricants },
];


function ShopByCategory() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollRef.current;
    if (container) {
      const scrollAmount = container.offsetWidth / 1.5;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="shop-by-category">
      <div className="header">
        <h2>Shop by Category</h2>
        <div className="arrows">
          <button onClick={() => scroll('left')}><FaChevronLeft /></button>
          <button onClick={() => scroll('right')}><FaChevronRight /></button>
        </div>
      </div>

      <div className="category-scroll" ref={scrollRef}>
        {categories.map((cat, index) => (
          <div className="category-card" key={index}>
            <img src={cat.image} alt={cat.name} />
            <p>{cat.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ShopByCategory;
