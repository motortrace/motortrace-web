import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import FeaturedBanners from '../components/LandingPageComponents/FeaturesBanner/Banner';
import ShopByCategory from '../components/LandingPageComponents/ShopByCategory/ShopByCategory';
import OffersSection from '../components/LandingPageComponents/OffersSection/OffersSection';
import RecentlyViewed from '../components/LandingPageComponents/RecentlyViewed/RecentlyViewed';
import FeaturedBrands from '../components/LandingPageComponents/FeaturedBrands/FeaturedBrands';
import Footer from '../components/Footer/Footer';
import BrandSpotlight from '../components/LandingPageComponents/BrandSpotLight/BrandSpotlight';
import ServiceHighlights from '../components/LandingPageComponents/WhyChooseUs/ServiceHighlights';
import NewlyAdded from '../components/LandingPageComponents/NewlyAdded/NewlyAdded';
import TopBar from '../components/TopBar/TopBar';


const LandingPage: React.FC = () => {
    return (
        <div className="landing-page">
            <TopBar/>
            <Navbar />
            <main>
                <FeaturedBanners />
                <ShopByCategory />
                <BrandSpotlight />
                <RecentlyViewed />
                <OffersSection />
                <NewlyAdded />
                <ServiceHighlights />
                <FeaturedBrands />
            </main>
            <Footer />
        </div>
    );
};


export default LandingPage;
