import React from 'react'
import ProductCard from '../components/ProductPageComponents/ProductCard/ProductCard'
import Navbar from '../components/Navbar/Navbar'
import Footer from '../components/Footer/Footer'
import TopBar from '../components/TopBar/TopBar'


const ProductPage = () => {
    return (
        <div>
            <TopBar />
            <Navbar />
            <main>
                <ProductCard />
            </main>
            <Footer />
        </div>
    )
}

export default ProductPage
