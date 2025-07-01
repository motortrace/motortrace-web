// components/ProductGrid.tsx
import React from 'react';
import ProductCard from '../ProductCard/ProductCatalogCard';
import './ProductGrid.scss';

import oil1 from '../../../assets/images/ProductCatalogue/ZIC.png';
import oil2 from '../../../assets/images/ProductCatalogue/Shell.png';
import oil3 from '../../../assets/images/ProductCatalogue/Quartz.png';
import oil4 from '../../../assets/images/ProductCatalogue/Moly.png';
import SortBar from '../SortOptions/SortOptions';
import ProductToolbar from '../ProductToolBar/ProductToolBar';
import ProductPagination from '../ProductPagination/ProductPagination';

const dummyProducts = [
  {
    name: 'ZIC M9 10W-40 Synthetic Engine Oil – 4L',
    image: oil1,
    price: 'Rs 4,299',
    rating: 5,
    reviews: 12,
  },
  {
    name: 'Shell Helix HX5 20W-50 Engine Oil – 3L',
    image: oil2,
    price: 'Rs 3,899',
    rating: 4,
    reviews: 43,
  },
  {
    name: 'Total Quartz 9000 Energy 5W-40 – 4L',
    image: oil3,
    price: 'Rs 5,199',
    rating: 5,
    reviews: 5,
  },
  {
    name: 'Liqui Moly Top Tec 4200 – 5W-30 – 4L',
    image: oil4,
    price: 'Rs 5,499',
    rating: 4,
    reviews: 21,
  },
    {
    name: 'ZIC M9 10W-40 Synthetic Engine Oil – 4L',
    image: oil1,
    price: 'Rs 4,299',
    rating: 5,
    reviews: 7,
  },
  {
    name: 'Shell Helix HX5 20W-50 Engine Oil – 3L',
    image: oil2,
    price: 'Rs 3,899',
    rating: 4,
    reviews: 107,
  },
  {
    name: 'Total Quartz 9000 Energy 5W-40 – 4L',
    image: oil3,
    price: 'Rs 5,199',
    rating: 5,
    reviews: 9,
  },
  {
    name: 'Liqui Moly Top Tec 4200 – 5W-30 – 4L',
    image: oil4,
    price: 'Rs 5,499',
    rating: 4,
    reviews: 36,
  },
];


const ProductGrid: React.FC = () => {
  return (
    <section className="product-grid-wrapper">
      <div className="product-grid">
        {dummyProducts.map((product, index) => (
          <ProductCard
            key={index}
            name={product.name}
            image={product.image}
            price={product.price}
            rating={product.rating}
            reviews={product.reviews}
          />
        ))}
      </div>

      <div className="pagination-container">
        <ProductPagination /> {/* ✅ Add pagination below grid */}
      </div>
    </section>
  );
};

export default ProductGrid;
