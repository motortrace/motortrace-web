import React from "react";
import "./StockFilter.scss";

interface StockFilterProps {
  category: string;
  setCategory: (category: string) => void;
}

const categories = [
  "All",
  "Engine & Brake Fluids",
  "Exterior & Body Parts",
  "Batteries",
  "Filters",
  "Accessories & Add-ons"
];

const StockFilter: React.FC<StockFilterProps> = ({ category, setCategory }) => {
  return (
    <div className="stock-filter">
      <label>Category:</label>
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        {categories.map((cat, index) => (
          <option key={index} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  );
};

export default StockFilter;
