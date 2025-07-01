import Footer from '../../components/Footer/Footer'
import Navbar from '../../components/Navbar/Navbar'
import StoreBanner from '../../components/StoreComponents/StoreBanner/StoreBanner'
import StoreCategoryNav from '../../components/StoreComponents/StoreCategoryNav/StoreCategoryNav'
import StorePagination from '../../components/StoreComponents/StorePagination/StorePagination'
import StoreProductGrid from '../../components/StoreComponents/StoreProductGrid/StoreProductGrid'
import StoreSidebar from '../../components/StoreComponents/StoreSidebar/StoreSidebar'
// import StoreStats from '../../components/StoreComponents/StoreStats/StoreStats'
import './StorePage.scss'

const StorePage = () => {
  return (
    <div>
      <Navbar/>
      <main className="store-page">
        <StoreBanner />
        {/* <StoreStats /> */}
        <StoreCategoryNav />

        <div className="store-content-wrapper">
          <StoreSidebar />
          <div className="store-products-wrapper">
            <StoreProductGrid />
            <StorePagination />
          </div>
        </div>
      </main>
      <Footer/>
    </div>
  )
}

export default StorePage
