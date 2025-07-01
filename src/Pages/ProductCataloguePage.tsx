// Pages/ProductCatalogue.tsx
import React from 'react';

import SidebarFilters from '../components/ProductCataloguePageComponents/SideBarFilter/SideBarFilter';
import Footer from '../components/Footer/Footer';
import Navbar from '../components/Navbar/Navbar';
import ProductGrid from '../components/ProductCataloguePageComponents/ProductGrid/ProductGrid';
import './ProductCataloguePage.scss'
import ProductToolbar from '../components/ProductCataloguePageComponents/ProductToolBar/ProductToolBar';
import TopBar from '../components/TopBar/TopBar';

const ProductCatalogue: React.FC = () => {
    return (
        <div className="catalogue-page">
            <TopBar />
            <Navbar />
<main>
  <div className="catalogue-container">
    <SidebarFilters />

    <div className="catalogue-main">
      <ProductToolbar />
      <ProductGrid />
    </div>
  </div>
</main>

            <Footer />
        </div>
    );
};

export default ProductCatalogue;
