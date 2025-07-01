import { useState, ChangeEvent } from 'react';
import './ProductToolBar.scss';

const ProductToolbar: React.FC = () => {
  const categoryTitle = 'Engine Oil';
  const productCount = 42;

  const [sort, setSort] = useState('');
  const [query, setQuery] = useState('');

  const handleSort = (e: ChangeEvent<HTMLSelectElement>) => {
    setSort(e.target.value);
    // Optional: trigger sorting logic here
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    // Optional: trigger search logic here
  };

  return (
    <div className="product-toolbar">
      <div className="product-toolbar__left">
        <h2 className="product-toolbar__title">{categoryTitle}</h2>
      </div>

      <div className="product-toolbar__right">
        <div className="product-toolbar__count">
          {productCount} product{productCount !== 1 && 's'} found
        </div>

        <div className="product-toolbar__search">
          <input
            type="text"
            value={query}
            onChange={handleSearch}
            placeholder="Search products..."
          />
        </div>

        <div className="product-toolbar__sort">
          <select value={sort} onChange={handleSort}>
            <option value="">Sort by</option>
            <option value="price-low-high">Price: Low to High</option>
            <option value="price-high-low">Price: High to Low</option>
            <option value="rating-high-low">Rating: High to Low</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ProductToolbar;
