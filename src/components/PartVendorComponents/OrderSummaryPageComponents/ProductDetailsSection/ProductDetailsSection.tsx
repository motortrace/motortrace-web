import React from 'react';
import ProductDetailCard from '../ProductDetailCard/ProductDetailCard';
import './ProductDetailsSection.scss';
import brakePadSet from '../../../../assets/images/brakePad.png' ;
import oilFilter from '../../../../assets/images/airFilter.png' ;

const ProductDetailsSection: React.FC = () => {
  // Example products — replace with real data later
  const products = [
    {
      imageUrl: brakePadSet,
      name: 'Brake Pad Set',
      description: 'High Performance Ceramic Pads',
      size: 'Standard',
      weight: '2kg',
      quantity: 4,
      price: 7500,
    },
    {
      imageUrl: oilFilter,
      name: 'Oil Filter',
      description: 'Durable oil filter for extended performance',
      size: 'Small',
      weight: '0.5kg',
      quantity: 2,
      price: 1500,
    },
  ];

  return (
    <div className="product-details-section">
      <h3 className="product-details-section__title">Product Details</h3>
      <div className="product-details-section__list">
        {products.map((product, index) => (
          <ProductDetailCard key={index} {...product} />
        ))}
      </div>
    </div>
  );
};

export default ProductDetailsSection;
