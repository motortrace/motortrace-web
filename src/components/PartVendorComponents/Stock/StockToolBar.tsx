import React from 'react';
import './StockToolBar.scss';

interface Props {
  search: string;
  onSearch: (v: string) => void;
  categories: (string | number)[];
  selectedCategory: string | number;
  onCategoryChange: (cat: any) => void;
}

const StockToolbar: React.FC<Props> = ({
  search,
  onSearch,
  categories,
  selectedCategory,
  onCategoryChange
}) => {
  return (
    <div className="stock-toolbar">
      <div className="stock-toolbar__left">
        <input
          type="text"
          placeholder="Search.."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="stock-toolbar__search"
        />
      </div>

      <div className="stock-toolbar__right">
        <select
          value={String(selectedCategory)}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="stock-toolbar__select"
        >
          {categories.map((c) => (
            <option key={String(c)} value={String(c)}>
              {String(c)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default StockToolbar;
