// // src/components/reports/StockReport.tsx
// import React from 'react';
// import { AlertTriangle, Package, Download, FileSpreadsheet } from 'lucide-react';
// // import { Product } from '../../types/Product';
// import './StockReport.scss';

// // import brakePadsImg from '../../../../assets/images/brakePads.png';
// // import engineOilImg from '../../../../assets/images/QuartzEngineOil.png';
// // import spark from '../../../../assets/images/spark.png';
// // import battery from '../../../../assets/images/battery.png';
// // import belt from '../../../../assets/images/timingBelt.png';

// export interface Product {
//   id: string;
//   productname: string;
//   category: 'Engine & Fluids' | 'Wear & Tear Parts' | 'Exterior & Body Parts' | 'Paints & Coatings' | 'Engine & Drivetrain Components' | 'Electrical Components' | 'Accessories & Add-ons' | 'Tools & Kits';
//   subcategory: string;
//   description: string;
//   price: string;
//   rating: number;
//   reviewcount: number;
//   availability: 'In Stock' | 'Low Stock' | 'Out of Stock';
//   image: string;
//   stock: number;
//   compatibility: string;
//   position: string;
//   brand: string;
//   finish: string;
//   material: string;
//   surfaceuse: string;
//   type: string;
//   color: string;
//   volume: string;
//   mountingfeatures: string;
//   colorcode: string;
//   quantity: number;
//   minquantity: number;
//   discounttype: string;
//   discountvalue: number;
//   warranty: string;
//   manufacturer: string;
//   manufactureddate: string;
//   expirydate: string;
//   notes: string;
//   resistance: string;
//   drytime: string;
//   applicationmethod: string;
//   voltage: string;
//   amprating: string;
//   connectortype: string;
// }

// interface StockReportProps {
//   products: Product[];
//   reportType: 'low-stock' | 'out-of-stock';
//   category?: string;
// }


// export const StockReport: React.FC<StockReportProps> = ({ 
//   products, 
//   reportType, 
//   category 
// }) => {
//   console.log('StockReport received:', { products, reportType, category });
  
//   const filteredProducts = products.filter(product => {
//     const categoryMatch = !category || category === 'All Categories' || product.category === category;
    
//     if (reportType === 'low-stock') {
//       const isLowStock = product.stock <= product.minquantity && product.stock > 0;
//       console.log(`Product ${product.productname}: stock=${product.stock}, minquantity=${product.minquantity}, categoryMatch=${categoryMatch}, isLowStock=${isLowStock}`);
//       return categoryMatch && isLowStock;
//     } else {
//       const isOutOfStock = product.stock === 0;
//       console.log(`Product ${product.productname}: stock=${product.stock}, categoryMatch=${categoryMatch}, isOutOfStock=${isOutOfStock}`);
//       return categoryMatch && isOutOfStock;
//     }
//   });

//   console.log('Filtered products:', filteredProducts);

//   const handleExportPDF = () => {
//     console.log('Export to PDF');
//   };

//   const handleExportExcel = () => {
//     console.log('Export to Excel');
//   };

//   const getStockStatus = (stock: number, minquantity: number) => {
//     if (stock === 0) return 'Out of Stock';
//     if (stock <= minquantity) return 'Low Stock';
//     return 'In Stock';
//   };

//   const getStatusColor = (stock: number, minquantity: number) => {
//     if (stock === 0) return '#ef4444';
//     if (stock <= minquantity) return '#f59e0b';
//     return '#10b981';
//   };

//   return (
//     <div className="stock-report">
//       <div className="report-header">
//         <div className="header-left">
//           <div className="report-icon">
//             {reportType === 'low-stock' ? 
//               <AlertTriangle size={24} /> : 
//               <Package size={24} />
//             }
//           </div>
//           <div className="header-text">
//             <h2>
//               {reportType === 'low-stock' ? 'Low Stock Report' : 'Out of Stock Report'}
//             </h2>
//             <p>
//               {category && category !== 'All Categories' ? `${category} - ` : ''}
//               {filteredProducts.length} items found
//             </p>
//           </div>
//         </div>
        
//         <div className="export-actions">
//           <button className="export-btn pdf-btn" onClick={handleExportPDF}>
//             <Download size={16} />
//             Export PDF
//           </button>
//           <button className="export-btn excel-btn" onClick={handleExportExcel}>
//             <FileSpreadsheet size={16} />
//             Export Excel
//           </button>
//         </div>
//       </div>

//       <div className="report-summary">
//         <div className="summary-card critical">
//           <div className="summary-number">{filteredProducts.filter(p => p.stock === 0).length}</div>
//           <div className="summary-label">Out of Stock</div>
//         </div>
//         <div className="summary-card warning">
//           <div className="summary-number">{filteredProducts.filter(p => p.stock <= p.minquantity && p.stock > 0).length}</div>
//           <div className="summary-label">Low Stock</div>
//         </div>
//         <div className="summary-card info">
//           <div className="summary-number">{new Set(filteredProducts.map(p => p.category)).size}</div>
//           <div className="summary-label">Categories Affected</div>
//         </div>
//       </div>

//       <div className="products-table">
//         <div className="table-header">
//           <div className="header-cell">Product</div>
//           <div className="header-cell">Category</div>
//           <div className="header-cell">Current Stock</div>
//           <div className="header-cell">Min Quantity</div>
//           <div className="header-cell">Status</div>
//           <div className="header-cell">Action Required</div>
//         </div>

//         <div className="table-body">
//           {filteredProducts.map((product) => (
//             <div key={product.id} className="table-row">
//               <div className="cell product-cell">
//                 <img 
//                   src={product.image} 
//                   alt={product.productname}
//                   className="product-image"
//                 />
//                 <div className="product-info">
//                   <div className="product-name">{product.productname}</div>
//                   <div className="product-brand">{product.brand}</div>
//                 </div>
//               </div>
              
//               <div className="cell">
//                 <span className="category-badge">{product.category}</span>
//               </div>
              
//               <div className="cell">
//                 <span className="stock-number">{product.stock}</span>
//               </div>
              
//               <div className="cell">
//                 <span className="min-quantity">{product.minquantity}</span>
//               </div>
              
//               <div className="cell">
//                 <span 
//                   className="status-badge"
//                   style={{ 
//                     backgroundColor: `${getStatusColor(product.stock, product.minquantity)}20`,
//                     color: getStatusColor(product.stock, product.minquantity)
//                   }}
//                 >
//                   {getStockStatus(product.stock, product.minquantity)}
//                 </span>
//               </div>
              
//               <div className="cell">
//                 <span className="action-required">
//                   {product.stock === 0 ? 'Immediate Restock' : `Order ${product.minquantity - product.stock + 10} units`}
//                 </span>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {filteredProducts.length === 0 && (
//         <div className="empty-state">
//           <Package size={48} />
//           <h3>No items found</h3>
//           <p>
//             {reportType === 'low-stock' 
//               ? 'All items are above minimum stock levels' 
//               : 'No items are currently out of stock'
//             }
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// src/components/reports/StockReport.tsx
import React, { useState, useEffect } from 'react';
import { AlertTriangle, Package, Download, FileSpreadsheet, Loader } from 'lucide-react';
import './StockReport.scss';

export interface Product {
  id: string;
  productname: string;
  category: 'Engine & Fluids' | 'Wear & Tear Parts' | 'Exterior & Body Parts' | 'Paints & Coatings' | 'Engine & Drivetrain Components' | 'Electrical Components' | 'Accessories & Add-ons' | 'Tools & Kits';
  subcategory: string;
  description: string;
  price: string;
  rating: number;
  reviewcount: number;
  availability: 'In Stock' | 'Low Stock' | 'Out of Stock';
  image: string;
  stock: number;
  compatibility: string;
  position: string;
  brand: string;
  finish: string;
  material: string;
  surfaceuse: string;
  type: string;
  color: string;
  volume: string;
  mountingfeatures: string;
  colorcode: string;
  quantity: number;
  minquantity: number;
  discounttype: string;
  discountvalue: number;
  warranty: string;
  manufacturer: string;
  manufactureddate: string;
  expirydate: string;
  notes: string;
  resistance: string;
  drytime: string;
  applicationmethod: string;
  voltage: string;
  amprating: string;
  connectortype: string;
}

interface StockReportProps {
  reportType: 'low-stock' | 'out-of-stock';
  category?: string;
}

export const StockReport: React.FC<StockReportProps> = ({ 
  reportType, 
  category 
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data based on report type and category
  useEffect(() => {
    fetchStockData();
  }, [reportType, category]);

  const fetchStockData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Determine the API endpoint based on report type
      let endpoint = '';
      if (reportType === 'low-stock') {
        endpoint = 'http://localhost:3000/api/analytics/low-stock';
      } else {
        endpoint = 'http://localhost:3000/api/analytics/out-of-stock';
      }

      // Add category filter if specified and not "All Categories"
      if (category && category !== 'All Categories') {
        const categoryParam = encodeURIComponent(category);
        endpoint += `?category=${categoryParam}`;
      }

      console.log('Fetching from:', endpoint);
      
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Extract products from the API response
      let productsData: Product[] = [];
      if (reportType === 'low-stock') {
        productsData = data.lowStockProducts || [];
      } else {
        productsData = data.outOfStockProducts || [];
      }
      
      console.log('Fetched products:', productsData);
      setProducts(productsData);
      
    } catch (err) {
      console.error('Error fetching stock data:', err);
      setError('Failed to load stock data. Please try again.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    fetchStockData();
  };

  const handleExportPDF = () => {
    console.log('Export to PDF');
    // Implement PDF export logic here
  };

  const handleExportExcel = () => {
    console.log('Export to Excel');
    // Implement Excel export logic here
  };

  const getStockStatus = (stock: number, minquantity: number) => {
    if (stock === 0) return 'Out of Stock';
    if (stock <= minquantity) return 'Low Stock';
    return 'In Stock';
  };

  const getStatusColor = (stock: number, minquantity: number) => {
    if (stock === 0) return '#ef4444';
    if (stock <= minquantity) return '#f59e0b';
    return '#10b981';
  };

  // Filter products based on category (additional client-side filtering)
  const filteredProducts = products.filter(product => {
    if (!category || category === 'All Categories') return true;
    return product.category === category;
  });

  if (loading) {
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
              <p>Loading stock data...</p>
            </div>
          </div>
        </div>
        <div className="loading-state">
          <Loader size={32} className="spinner" />
          <p>Fetching {reportType === 'low-stock' ? 'low stock' : 'out of stock'} data...</p>
        </div>
      </div>
    );
  }

  if (error) {
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
              <p>Error loading data</p>
            </div>
          </div>
        </div>
        <div className="error-state">
          <p>{error}</p>
          <button onClick={handleRetry} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
          <button className="refresh-btn" onClick={fetchStockData} title="Refresh data">
            ⟳
          </button>
        </div>
      </div>

      <div className="report-summary">
        <div className="summary-card critical">
          <div className="summary-number">{filteredProducts.filter(p => p.stock === 0).length}</div>
          <div className="summary-label">Out of Stock</div>
        </div>
        <div className="summary-card warning">
          <div className="summary-number">{filteredProducts.filter(p => p.stock <= p.minquantity && p.stock > 0).length}</div>
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
                {product.image ? (
                  <img 
                    src={product.image} 
                    alt={product.productname}
                    className="product-image"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="product-image-placeholder">
                    No Image
                  </div>
                )}
                <div className="product-info">
                  <div className="product-name">{product.productname}</div>
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
                <span className="min-quantity">{product.minquantity}</span>
              </div>
              
              <div className="cell">
                <span 
                  className="status-badge"
                  style={{ 
                    backgroundColor: `${getStatusColor(product.stock, product.minquantity)}20`,
                    color: getStatusColor(product.stock, product.minquantity)
                  }}
                >
                  {getStockStatus(product.stock, product.minquantity)}
                </span>
              </div>
              
              <div className="cell">
                <span className="action-required">
                  {product.stock === 0 ? 'Immediate Restock' : `Order ${product.minquantity - product.stock + 10} units`}
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
            {category && category !== 'All Categories' ? ` in ${category}` : ''}
          </p>
        </div>
      )}
    </div>
  );
};