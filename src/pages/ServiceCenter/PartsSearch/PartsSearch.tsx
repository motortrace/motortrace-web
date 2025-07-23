import React, { useState } from 'react';
import './PartsSearch.scss';

interface Store {
  id: number;
  name: string;
  logo: string;
  address: string;
  distance: string;
  count: number;
}

interface Product {
  id: number;
  brand: string;
  logo: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  inStock: boolean;
  partNumber: string;
  category: string;
}

const vehicleMakes = ['Toyota', 'Honda', 'Ford', 'Chevrolet', 'Nissan', 'BMW', 'Mercedes-Benz', 'Audi'];
const vehicleModels = {
  Toyota: ['Camry', 'Corolla', 'RAV4', 'Highlander', 'Prius', 'Tacoma'],
  Honda: ['Civic', 'Accord', 'CR-V', 'Pilot', 'Fit', 'Ridgeline'],
  Ford: ['F-150', 'Escape', 'Focus', 'Explorer', 'Mustang', 'Edge'],
  Chevrolet: ['Silverado', 'Equinox', 'Malibu', 'Tahoe', 'Cruze', 'Impala'],
  Nissan: ['Altima', 'Sentra', 'Rogue', 'Pathfinder', 'Maxima', 'Frontier'],
  BMW: ['3 Series', '5 Series', 'X3', 'X5', '7 Series', 'Z4'],
  'Mercedes-Benz': ['C-Class', 'E-Class', 'S-Class', 'GLC', 'GLE', 'A-Class'],
  Audi: ['A4', 'A6', 'Q5', 'Q7', 'A3', 'TT'],
};
const vehicleYears = Array.from({length: 25}, (_, i) => (2024 - i).toString());

const PartsSearch: React.FC = () => {
  const [searchType, setSearchType] = useState<'Parts' | 'Tires'>('Parts');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [inStockOnly, setInStockOnly] = useState(false);

  // Staged filter state for Apply button
  const [stagedBrand, setStagedBrand] = useState(selectedBrand);
  const [stagedCategory, setStagedCategory] = useState(selectedCategory);
  const [stagedPriceRange, setStagedPriceRange] = useState(priceRange);
  const [stagedInStockOnly, setStagedInStockOnly] = useState(inStockOnly);

  const stores: Store[] = [
    {
      id: 1,
      name: "Advance Auto Parts",
      logo: "https://marvel-b1-cdn.bc0a.com/f00000000270508/s19526.pcdn.co/wp-content/uploads/2019/07/advance-auto-parts-729.jpg",
      address: "61 East Main St. Forest Hills",
      distance: "0.5 mi",
      count: 12
    },
    {
      id: 2,
      name: "AutoZone",
      logo: "https://surprisetcmp.com/wp-content/uploads/sites/13/2019/09/AutoZone-Logo.png",
      address: "1141 Park Rd. Plains",
      distance: "1.2 mi",
      count: 8
    },
    {
      id: 3,
      name: "NAPA Auto Parts",
      logo: "https://marvel-b1-cdn.bc0a.com/f00000000270502/s19538.pcdn.co/wp-content/uploads/2022/02/NAPA-2022-logo-1024x512.jpg",
      address: "535 Morgan Ave. Brooklyn",
      distance: "1.8 mi",
      count: 15
    },
    {
      id: 4,
      name: "WorldPac",
      logo: "https://billmurrayassociates.com/wp-content/uploads/worldpac-2-e1739136815992-1024x539.png",
      address: "100 Industry Dr. Somerset",
      distance: "2.3 mi",
      count: 32
    },
    {
      id: 5,
      name: "O'Reilly Auto Parts",
      logo: "https://marvel-b1-cdn.bc0a.com/f00000000270502/s19538.pcdn.co/wp-content/uploads/2015/04/OReilly-Logo-e1540487806549.png",
      address: "12 Sessions Ave. Brooklyn",
      distance: "2.7 mi",
      count: 9
    }
  ];

  const products: Product[] = [
    {
      id: 1,
      brand: "Akebono",
      logo: "https://i.ebayimg.com/images/g/GP8AAOSwLDllxP73/s-l500.webp",
      name: "ProACT Ultra-Premium Ceramic Brake Pad Set",
      price: 89990,
      originalPrice: 94990,
      image: 'https://i.ebayimg.com/images/g/GP8AAOSwLDllxP73/s-l500.webp',
      inStock: true,
      partNumber: "ACT1089",
      category: "Brake Pads"
    },
    {
      id: 2,
      brand: "Wagner",
      logo: "/logos/wagner.png",
      name: "Premium Gold Semi-Metallic Disc Brake Pad Set",
      price: 67.99,
      image: "https://i.ebayimg.com/images/g/9XoAAOSwLBZlvxKB/s-l500.webp",
      inStock: true,
      partNumber: "ZD1089",
      category: "Brake System"
    },
    {
      id: 3,
      brand: "ACDelco",
      logo: "/logos/acdelco.png",
      name: "Professional Air Filter",
      price: 24.99,
      image: "https://i.ebayimg.com/images/g/Q0gAAOSw1i9gGXEE/s-l500.webp",
      inStock: true,
      partNumber: "A3139C",
      category: "Engine"
    },
    {
      id: 4,
      brand: "Mobil 1",
      logo: "/logos/mobil1.png",
      name: "Full Synthetic Motor Oil 5W-30 (5 Quart)",
      price: 34.99,
      originalPrice: 39.99,
      image: "https://i.ebayimg.com/images/g/px4AAOSwzgJnxrzB/s-l500.webp",
      inStock: false,
      partNumber: "120766",
      category: "Engine"
    }
  ];

  const brands = Array.from(new Set(products.map(p => p.brand))).sort();
  const categories = Array.from(new Set(products.map(p => p.category))).sort();

  // Compute available brands/categories based on staged filters
  const availableBrands = Array.from(new Set(products
    .filter(p => (!stagedCategory || p.category === stagedCategory))
    .filter(p => (!stagedInStockOnly || p.inStock))
    .filter(p => (!stagedPriceRange.min || p.price >= parseFloat(stagedPriceRange.min)))
    .filter(p => (!stagedPriceRange.max || p.price <= parseFloat(stagedPriceRange.max)))
    .map(p => p.brand)
  ));
  const availableCategories = Array.from(new Set(products
    .filter(p => (!stagedBrand || p.brand === stagedBrand))
    .filter(p => (!stagedInStockOnly || p.inStock))
    .filter(p => (!stagedPriceRange.min || p.price >= parseFloat(stagedPriceRange.min)))
    .filter(p => (!stagedPriceRange.max || p.price <= parseFloat(stagedPriceRange.max)))
    .map(p => p.category)
  ));

  // Filtering logic (applied filters)
  const filteredProducts = products.filter((product) => {
    if (searchQuery && !(
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.partNumber.toLowerCase().includes(searchQuery.toLowerCase())
    )) return false;
    if (selectedBrand && product.brand !== selectedBrand) return false;
    if (selectedCategory && product.category !== selectedCategory) return false;
    if (priceRange.min && product.price < parseFloat(priceRange.min)) return false;
    if (priceRange.max && product.price > parseFloat(priceRange.max)) return false;
    if (inStockOnly && !product.inStock) return false;
    return true;
  });

  // Apply filters handler
  const applyFilters = () => {
    setSelectedBrand(stagedBrand);
    setSelectedCategory(stagedCategory);
    setPriceRange(stagedPriceRange);
    setInStockOnly(stagedInStockOnly);
  };

  // Remove individual filter
  const removeFilter = (filter: string) => {
    if (filter === 'brand') setSelectedBrand('');
    if (filter === 'category') setSelectedCategory('');
    if (filter === 'price') setPriceRange({ min: '', max: '' });
    if (filter === 'inStock') setInStockOnly(false);
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedBrand('');
    setSelectedCategory('');
    setPriceRange({ min: '', max: '' });
    setInStockOnly(false);
    setStagedBrand('');
    setStagedCategory('');
    setStagedPriceRange({ min: '', max: '' });
    setStagedInStockOnly(false);
  };

  const handleSearch = () => {
    console.log('Search initiated with:', {
      type: searchType,
      query: searchQuery,
      vehicle: { make: selectedMake, model: selectedModel, year: selectedYear }
    });
  };

  const handleStoreClick = (store: Store) => {
    console.log('Selected store:', store.name);
  };

  const handleAddToCart = (product: Product) => {
    console.log('Added to cart:', product.name);
  };

  const handleMakeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMake(e.target.value);
    setSelectedModel('');
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedModel(e.target.value);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(e.target.value);
  };

  // Helper for LKR formatting
  const formatLKR = (amount: number) => `LKR ${amount.toLocaleString('en-LK')}`;

  return (
    <div className="parts-search">
      <header className="parts-search__header">
        <div className="parts-search__search-container">
          <select
            className="parts-search__type-dropdown"
            value={searchType}
            onChange={e => setSearchType(e.target.value as 'Parts' | 'Tires')}
          >
            <option value="Parts">Parts</option>
            <option value="Tires">Tires</option>
          </select>
          
          <input
            type="text"
            placeholder="Search by part name, brand, or part number"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="parts-search__search-input"
          />
          
          <div className="parts-search__vehicle-selectors">
            <select value={selectedMake} onChange={handleMakeChange} className="vehicle-dropdown">
              <option value="">Make</option>
              {vehicleMakes.map(make => (
                <option key={make} value={make}>{make}</option>
              ))}
            </select>
            <select value={selectedModel} onChange={handleModelChange} className="vehicle-dropdown" disabled={!selectedMake}>
              <option value="">Model</option>
              {selectedMake && vehicleModels[selectedMake as keyof typeof vehicleModels]?.map(model => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
            <select value={selectedYear} onChange={handleYearChange} className="vehicle-dropdown">
              <option value="">Year</option>
              {vehicleYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          
          <button 
            onClick={handleSearch}
            className="parts-search__search-button"
          >
            SEARCH
          </button>
        </div>
      </header>

      <div className="parts-search__content parts-search__content--with-sidebar">
        <aside className="parts-search__filter-panel">
          <div className="filter-header">
            <h4>Filters</h4>
            <button onClick={clearFilters} className="clear-filters">Clear All</button>
          </div>
          <div className="filter-group">
            <label>Brand</label>
            <select value={stagedBrand} onChange={e => setStagedBrand(e.target.value)}>
              <option value="">All Brands</option>
              {brands.map(brand => (
                <option key={brand} value={brand} disabled={!availableBrands.includes(brand)}>{brand}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label>Category</label>
            <select value={stagedCategory} onChange={e => setStagedCategory(e.target.value)}>
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category} disabled={!availableCategories.includes(category)}>{category}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label>Price Range</label>
            <div className="price-range">
              <input
                type="number"
                placeholder="Min"
                value={stagedPriceRange.min}
                onChange={e => setStagedPriceRange({ ...stagedPriceRange, min: e.target.value })}
              />
              <span>to</span>
              <input
                type="number"
                placeholder="Max"
                value={stagedPriceRange.max}
                onChange={e => setStagedPriceRange({ ...stagedPriceRange, max: e.target.value })}
              />
            </div>
          </div>
          <div className="filter-group">
            <label>
              <input
                type="checkbox"
                checked={stagedInStockOnly}
                onChange={e => setStagedInStockOnly(e.target.checked)}
              /> In Stock Only
            </label>
          </div>
          <button className="apply-filters-btn" onClick={applyFilters}>Apply Filters</button>
        </aside>

        <main className="parts-search__main-panel">
          {/* Active Filters Display */}
          <div className="active-filters">
            {selectedBrand && <span className="active-filter">Brand: {selectedBrand} <button onClick={() => removeFilter('brand')}>×</button></span>}
            {selectedCategory && <span className="active-filter">Category: {selectedCategory} <button onClick={() => removeFilter('category')}>×</button></span>}
            {(priceRange.min || priceRange.max) && <span className="active-filter">Price: {priceRange.min || 'Any'} - {priceRange.max || 'Any'} <button onClick={() => removeFilter('price')}>×</button></span>}
            {inStockOnly && <span className="active-filter">In Stock Only <button onClick={() => removeFilter('inStock')}>×</button></span>}
          </div>
          {/* <div className="parts-search__stores">
            <div className="stores-header">
              <h3>My Suppliers ({stores.length})</h3>
            </div>
            <div className="stores-list">
              {stores.map((store) => (
                <div 
                  key={store.id} 
                  className="store-card"
                  onClick={() => handleStoreClick(store)}
                >
                  <div className="store-info">
                    <div className="store-logo">
                      <img src={store.logo} alt={store.name} />
                    </div>
                    <div className="store-details">
                      <h4>{store.name}</h4>
                      <p>{store.address}</p>
                      <span className="distance">{store.distance}</span>
                    </div>
                  </div>
                  <div className="store-count">
                    <span className="count-badge">{store.count} items</span>
                  </div>
                </div>
              ))}
            </div>
          </div> */}

          <div className="parts-search__results-header">
            <h3>Products ({filteredProducts.length} results)</h3>
          </div>

          <div className="parts-search__products">
            {filteredProducts.length === 0 && (
              <div className="no-results">
                <p>No products found matching your criteria.</p>
                <button onClick={clearFilters} className="clear-filters-btn">Clear Filters</button>
              </div>
            )}
            
            {filteredProducts.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-main">
                  <div className="product-image">
                    <img src={product.image} alt={product.name} />
                  </div>
                  <div className="product-info">
                    <div className="product-brand">
                      <span>{product.brand}</span>
                    </div>
                    <h3 className="product-name">{product.name}</h3>
                    <p className="part-number">Part #: {product.partNumber}</p>
                    <span className="product-category">{product.category}</span>
                    <div className="product-availability">
                      {product.inStock ? (
                        <span className="in-stock-badge">In-Stock</span>
                      ) : (
                        <span className="out-of-stock-badge">Out of stock</span>
                      )}
                    </div>
                  </div>
                  <div className="product-pricing">
                    <div className="price-section">
                      {product.originalPrice && (
                        <span className="original-price">{formatLKR(product.originalPrice)}</span>
                      )}
                      <span className="current-price">{formatLKR(product.price)}</span>
                    </div>
                    <button 
                      className={`add-to-cart-button ${!product.inStock ? 'disabled' : ''}`}
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.inStock}
                    >
                      {product.inStock ? 'View Details' : 'View Details'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PartsSearch;