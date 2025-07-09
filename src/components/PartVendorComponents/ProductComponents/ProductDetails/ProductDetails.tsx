// ProductDetails.tsx (Updated for Products)
import React, { useState } from 'react';
import './ProductDetails.scss';
import { Pencil, Trash2 } from 'lucide-react';
import { categoryConfigs } from './categoryConfigs';

import brakePadsImg from '../../../../assets/images/brakePads.png';
import engineOilImg from '../../../../assets/images/QuartzEngineOil.png';
import spark from '../../../../assets/images/spark.png' ;
import battery from '../../../../assets/images/battery.png' ;
import belt from '../../../../assets/images/timingBelt.png' ;

interface Product {
  id: string;
  productName: string;
  category: 'Engine & Fluids' | 'Wear & Tear Parts' | 'Exterior & Body Parts' | 'Paints & Coatings' | 'Engine & Drivetrain Components' | 'Electrical Components' | 'Accessories & Add-ons' | 'Tools & Kits',
  subcategory: string;
  description: string;
  price: string;
  rating: number;
  reviewCount: number;
  availability: 'In Stock' | 'Low Stock' | 'Out of Stock';
  image: string;
  stock: number;
  compatibility: string;
  position: string;
  brand: string;
  finish:string;
  material:string;
  surfaceUse: string;
  type:string;
  color:string;
  volume:string;
}

const products: Product[] = [
  {
    id: 'PD001',
    productName: 'Castrol GTX Magnatec 10W-30',
    category: 'Engine & Fluids',
    subcategory: 'Engine Oil',
    description: 'High-performance ceramic brake pads.',
    price: 'LKR 15,500',
    rating: 4.5,
    reviewCount: 128,
    availability: 'In Stock',
    image: brakePadsImg,
    stock: 45,
    compatibility: "Petrol Engines (Toyota, Honda)",
    position: '',
    brand: 'Castrol',
    finish:'',
    material:'',
    surfaceUse: '',
    type:'',
    color:'',
    volume:'4 Litres'
  },
  {
    id: 'PD002',
    productName: 'Bosch ESI6 DOT 4 Brake Fluid',
      category: 'Engine & Fluids',
    subcategory: 'Brake Fluid',
    description: 'Full synthetic motor oil providing superior engine protection and performance.',
    price: 'LKR 8,200',
    rating: 4.8,
    reviewCount: 256,
    availability: 'In Stock',
    image: engineOilImg,
    stock: 120,
    compatibility: "Universal (ABS Compatible)",
    position: '',
    brand: 'Bosch',
    finish:'',
    material:'',
    surfaceUse: '',
    type:'',
    color:'',
    volume:'500 ml'
  },
  {
    id: 'PD003',
    productName: 'Prestone All Vehicle Coolant',
    category: 'Engine & Fluids',
    subcategory: 'Coolant',
    description: 'High-efficiency air filter ensuring optimal engine performance and fuel economy.',
    price: 'LKR 3,750',
    rating: 4.2,
    reviewCount: 89,
    availability: 'Low Stock',
    image: spark,
    stock: 8,
    compatibility: "All Makes and Models",
    position: '',
    brand: 'Prestone',
    finish:'',
    material:'',
    surfaceUse: '',
    type:'',
    color:'',
    volume:'3.78 Litres'
  },
  {
    id: 'PD004',
    productName: 'STP Power Steering Fluid',
    category: 'Engine & Fluids',
    subcategory: 'Power Steering Fluid',
    description: 'Iridium spark plugs for enhanced ignition performance and longevity.',
    price: 'LKR 12,000',
    rating: 4.6,
    reviewCount: 164,
    availability: 'In Stock',
    image: spark,
    stock: 32,
    compatibility: "Honda, Nissan, Kia, Hyundai",
    position: '',
    brand: 'STP',
    finish:'',
    material:'',
    surfaceUse: '',
    type:'',
    color:'',
    volume:'946 ml'
  },
  {
    id: 'PD005',
    productName: 'Mobil ATF 3309',
    category: 'Engine & Fluids',
    subcategory: 'Transmission Fluid',
    description: 'Complete timing belt kit with tensioner and idler pulleys for reliable operation.',
    price: 'LKR 28,500',
    rating: 4.4,
    reviewCount: 76,
    availability: 'Out of Stock',
    image: belt,
    stock: 0,
    compatibility: "Toyota, Volvo (automatic gearboxes)",
    position: '',
    brand: 'Mobil',
    finish:'',
    material:'',
    surfaceUse: '',
    type:'',
    color:'',
    volume:'1 Litre'
  },
  {
    id: 'PD006',
    productName: 'Radiator Assembly',
    category: 'Engine & Fluids',
    subcategory: 'Cooling',
    description: 'Aluminum radiator with enhanced cooling capacity for optimal temperature control.',
    price: 'LKR 45,000',
    rating: 4.3,
    reviewCount: 45,
    availability: 'In Stock',
    image: belt,
    stock: 15,
    compatibility: "",
    position: '',
    brand: '',
    finish:'',
    material:'',
    surfaceUse: '',
    type:'',
    color:'',
    volume:''
  },
  {
    id: 'PD007',
    productName: 'Battery 12V 70Ah',
      category: 'Engine & Fluids',
    subcategory: 'Electrical',
    description: 'Maintenance-free lead-acid battery with excellent cold cranking performance.',
    price: 'LKR 18,750',
    rating: 4.7,
    reviewCount: 203,
    availability: 'In Stock',
    image: battery,
    stock: 28,
    compatibility: "",
    position: '',
    brand: '',
    finish:'',
    material:'',
    surfaceUse: '',
    type:'',
    color:'',
    volume:''
  },
  {
    id: 'PD008',
    productName: 'Alternator',
      category: 'Engine & Fluids',
    subcategory: 'Electrical',
    description: 'High-output alternator ensuring reliable electrical system performance.',
    price: 'LKR 35,200',
    rating: 4.1,
    reviewCount: 67,
    availability: 'In Stock',
    image: battery,
    stock: 12,
    compatibility: "",
    position: '',
    brand: '',
    finish:'',
    material:'',
    surfaceUse: '',
    type:'',
    color:'',
    volume:''
  }
];

const ITEMS_PER_PAGE = 5;

const ProductDetails: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof categoryConfigs>("Engine & Fluids");
  const [currentPage, setCurrentPage] = useState(1);

  const currentColumns = categoryConfigs[selectedCategory] || [];
  const filteredProducts = products.filter(
  (product) => product.category.trim().toLowerCase() === selectedCategory.trim().toLowerCase()
);


  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  return (
   <div className="order-details">
    <div className="order-details__header">
      <h2 className="order-details__title">Product List</h2>
      <div className="order-details__actions">
        <button className="btn pdf">PDF</button>
        <button className="btn refresh">⟳</button>
        <button className="btn sort">⇅</button>
        <button className="btn add">+ Add Product</button>
        </div>
    </div>

      <div className="order-details__filters">
      <input className="filter-input" placeholder="Search..." />
      <select
        className="filter-select"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value as keyof typeof categoryConfigs)}

      >
        {Object.keys(categoryConfigs).map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>


      <select className="filter-select">
        <option value="">All Sub-Categories</option>
      </select>

      <select className="filter-select">
        <option value="">All Statuses</option>
        <option value="In Stock">In Stock</option>
        <option value="Low Stock">Low Stock</option>
        <option value="Out of Stock">Out of Stock</option>
      </select>
    </div>

      <div className="order-details__table">        
        <div className="order-details__table-header">
          {currentColumns.map((col) => (
            <div key={col.key} className="order-details__header-cell">{col.label}</div>
          ))}
          <div className="order-details__header-cell">Price</div>
          <div className="order-details__header-cell">Stock</div>
          <div className="order-details__header-cell">Availability</div>
          <div className="order-details__header-cell">Actions</div>
        </div>
        <div className="order-details__table-body">
          {paginatedProducts.map((product) => (
            <div key={product.id} className="order-details__row">
              {currentColumns.map((col) => (
                <div key={col.key} className="order-details__cell">
                  {product[col.key as keyof Product] ?? '—'}
                </div>
              ))}
              <div className="order-details__cell">{product.price}</div>
              <div className="order-details__cell">{product.stock}</div>
              <div className="order-details__cell">
                <span className={`order-details__status order-details__status--${product.availability.toLowerCase().replace(/\s+/g, '-')}`}>
                  {product.availability}
                </span>
              </div>
              <div className="order-details__cell">
                <Pencil size={16} style={{ marginRight: '8px', cursor: 'pointer' }} />
                <Trash2 size={16} style={{ cursor: 'pointer' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      

      <div className="order-details__pagination">
        <button
          className="order-details__pagination-btn"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="order-details__pagination-info">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="order-details__pagination-btn"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
