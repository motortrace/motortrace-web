// src/components/reports/StockReport.tsx
import React from 'react';
import { AlertTriangle, Package, Download, FileSpreadsheet } from 'lucide-react';
// import { Product } from '../../types/Product';
import './StockReport.scss';

// import brakePadsImg from '../../../../assets/images/brakePads.png';
// import engineOilImg from '../../../../assets/images/QuartzEngineOil.png';
// import spark from '../../../../assets/images/spark.png';
// import battery from '../../../../assets/images/battery.png';
// import belt from '../../../../assets/images/timingBelt.png';

export interface Product {
  id: string;
  productName: string;
  category: 'Engine & Fluids' | 'Wear & Tear Parts' | 'Exterior & Body Parts' | 'Paints & Coatings' | 'Engine & Drivetrain Components' | 'Electrical Components' | 'Accessories & Add-ons' | 'Tools & Kits';
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
  finish: string;
  material: string;
  surfaceUse: string;
  type: string;
  color: string;
  volume: string;
  mountingFeatures: string;
  colorCode: string;
  quantity: number;
  minQuantity: number;
  discountType: string;
  discountValue: number;
  warranty: string;
  manufacturer: string;
  manufacturedDate: string;
  expiryDate: string;
  notes: string;
  resistance: string;
  dryTime: string;
  applicationMethod: string;
  voltage: string;
  ampRating: string;
  connectorType: string;
}

interface StockReportProps {
  products: Product[];
  reportType: 'low-stock' | 'out-of-stock';
  category?: string;
}


export const StockReport: React.FC<StockReportProps> = ({ 
  products, 
  reportType, 
  category 
}) => {
  console.log('StockReport received:', { products, reportType, category });
  
  const filteredProducts = products.filter(product => {
    const categoryMatch = !category || category === 'All Categories' || product.category === category;
    
    if (reportType === 'low-stock') {
      const isLowStock = product.stock <= product.minQuantity && product.stock > 0;
      console.log(`Product ${product.productName}: stock=${product.stock}, minQuantity=${product.minQuantity}, categoryMatch=${categoryMatch}, isLowStock=${isLowStock}`);
      return categoryMatch && isLowStock;
    } else {
      const isOutOfStock = product.stock === 0;
      console.log(`Product ${product.productName}: stock=${product.stock}, categoryMatch=${categoryMatch}, isOutOfStock=${isOutOfStock}`);
      return categoryMatch && isOutOfStock;
    }
  });

  console.log('Filtered products:', filteredProducts);

  const handleExportPDF = () => {
    console.log('Export to PDF');
  };

  const handleExportExcel = () => {
    console.log('Export to Excel');
  };

  const getStockStatus = (stock: number, minQuantity: number) => {
    if (stock === 0) return 'Out of Stock';
    if (stock <= minQuantity) return 'Low Stock';
    return 'In Stock';
  };

  const getStatusColor = (stock: number, minQuantity: number) => {
    if (stock === 0) return '#ef4444';
    if (stock <= minQuantity) return '#f59e0b';
    return '#10b981';
  };

  return (
    <div className="stock-report">
      <div className="report-header">
        <div className="header-left">
          <div className="report-icon">
            {reportType === 'low-stock' ? 
              <AlertTriangle size={24} /> : 
              <Package size={24} />
            }
          </div>
          <div className="header-text">
            <h2>
              {reportType === 'low-stock' ? 'Low Stock Report' : 'Out of Stock Report'}
            </h2>
            <p>
              {category && category !== 'All Categories' ? `${category} - ` : ''}
              {filteredProducts.length} items found
            </p>
          </div>
        </div>
        
        <div className="export-actions">
          <button className="export-btn pdf-btn" onClick={handleExportPDF}>
            <Download size={16} />
            Export PDF
          </button>
          <button className="export-btn excel-btn" onClick={handleExportExcel}>
            <FileSpreadsheet size={16} />
            Export Excel
          </button>
        </div>
      </div>

      <div className="report-summary">
        <div className="summary-card critical">
          <div className="summary-number">{filteredProducts.filter(p => p.stock === 0).length}</div>
          <div className="summary-label">Out of Stock</div>
        </div>
        <div className="summary-card warning">
          <div className="summary-number">{filteredProducts.filter(p => p.stock <= p.minQuantity && p.stock > 0).length}</div>
          <div className="summary-label">Low Stock</div>
        </div>
        <div className="summary-card info">
          <div className="summary-number">{new Set(filteredProducts.map(p => p.category)).size}</div>
          <div className="summary-label">Categories Affected</div>
        </div>
      </div>

      <div className="products-table">
        <div className="table-header">
          <div className="header-cell">Product</div>
          <div className="header-cell">Category</div>
          <div className="header-cell">Current Stock</div>
          <div className="header-cell">Min Quantity</div>
          <div className="header-cell">Status</div>
          <div className="header-cell">Action Required</div>
        </div>

        <div className="table-body">
          {filteredProducts.map((product) => (
            <div key={product.id} className="table-row">
              <div className="cell product-cell">
                <img 
                  src={product.image} 
                  alt={product.productName}
                  className="product-image"
                />
                <div className="product-info">
                  <div className="product-name">{product.productName}</div>
                  <div className="product-brand">{product.brand}</div>
                </div>
              </div>
              
              <div className="cell">
                <span className="category-badge">{product.category}</span>
              </div>
              
              <div className="cell">
                <span className="stock-number">{product.stock}</span>
              </div>
              
              <div className="cell">
                <span className="min-quantity">{product.minQuantity}</span>
              </div>
              
              <div className="cell">
                <span 
                  className="status-badge"
                  style={{ 
                    backgroundColor: `${getStatusColor(product.stock, product.minQuantity)}20`,
                    color: getStatusColor(product.stock, product.minQuantity)
                  }}
                >
                  {getStockStatus(product.stock, product.minQuantity)}
                </span>
              </div>
              
              <div className="cell">
                <span className="action-required">
                  {product.stock === 0 ? 'Immediate Restock' : `Order ${product.minQuantity - product.stock + 10} units`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {filteredProducts.length === 0 && (
        <div className="empty-state">
          <Package size={48} />
          <h3>No items found</h3>
          <p>
            {reportType === 'low-stock' 
              ? 'All items are above minimum stock levels' 
              : 'No items are currently out of stock'
            }
          </p>
        </div>
      )}
    </div>
  );
};