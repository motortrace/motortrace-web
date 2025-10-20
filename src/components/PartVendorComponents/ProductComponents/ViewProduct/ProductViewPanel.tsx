// import React from 'react';
// import './ProductViewPanel.scss';
// import { 
//   X, 
//   Printer, 
//   Download,  
//   Package, 
//   DollarSign,
//   AlertTriangle 
// } from 'lucide-react';

// interface Product {
//   id: string;
//   productname: string;
//   category: 'Engine & Fluids' | 'Wear & Tear Parts' | 'Exterior & Body Parts' | 'Paints & Coatings' | 'Engine & Drivetrain Components' | 'Electrical Components' | 'Accessories & Add-ons' | 'Tools & Kits',
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
//   mountingfeatures:string;
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

// interface ProductViewPanelProps {
//   isOpen: boolean;
//   onClose: () => void;
//   product: Product | null;
//   onEdit?: (product: Product) => void;
//   onDelete?: (productId: string) => void;
//   onDuplicate?: (product: Product) => void;
// }

// const ProductViewPanel: React.FC<ProductViewPanelProps> = ({
//   isOpen,
//   onClose,
//   product,
// }) => {

//   if (!product) return null;

//   const handlePrint = () => {
//     window.print();
//   };

//   const handleExportPDF = () => {
//     console.log('Exporting to PDF...');
//   };

//   const getStatusColor = (availability: string) => {
//     switch (availability.toLowerCase()) {
//       case 'in stock': return '#10b981';
//       case 'low stock': return '#f59e0b';
//       case 'out of stock': return '#ef4444';
//       default: return '#6b7280';
//     }
//   };

//   const isExpiringSoon = (expiryDate: string | null | undefined): boolean => {
//     if (!expiryDate) return false;
    
//     const expiry = new Date(expiryDate);
//     const today = new Date();
//     const thirtyDaysFromNow = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));
    
//     return expiry <= thirtyDaysFromNow && expiry >= today;
//   };

//   return (
//     <div className={`product-view-panel ${isOpen ? 'product-view-panel--open' : ''}`}>
//       <div className="product-view-panel__overlay" onClick={onClose} />
      
//       <div className="product-view-panel__content">
//         <div className="product-view-panel__header">
//           <div className="product-view-panel__header-left">
//             <h2 className="product-view-panel__title">Product Details</h2>
//             <span className="product-view-panel__id">ID: {product.id}</span>
//           </div>
//           <button 
//             className="product-view-panel__close"
//             onClick={onClose}
//           >
//             <X size={20} />
//           </button>
//         </div>

//         <div className="product-view-panel__actions">
//           <button className="action-btn action-btn--primary" onClick={handlePrint}>
//             <Printer size={16} />
//             Print
//           </button>
//           <button className="action-btn action-btn--secondary" onClick={handleExportPDF}>
//             <Download size={16} />
//             Export PDF
//           </button>
//         </div>

//         <div className="product-view-panel__body">
//           <div className="product-info">
//             <div className="product-info__image-section">
//               <img 
//                 src={product.image} 
//                 alt={product.productname}
//                 className="product-info__image"
//               />
//               <div className="product-info__status">
//                 <span 
//                   className="status-badge"
//                   style={{ backgroundColor: getStatusColor(product.availability) }}
//                 >
//                   {product.availability}
//                 </span>
//               </div>
//             </div>

//             <div className="product-info__details">
//               <h3 className="product-info__name">{product.productname}</h3>
//               <p className="product-info__category">{product.category} • {product.subcategory}</p>
//               <p className="product-info__description">{product.description}</p>

//               <div className="product-info__price">
//                 <span className="price-current">LKR {product.price}</span>
//               </div>
//             </div>
//           </div>

          
//           <div className="product-specs">
//             <h4 className="product-specs__title">Specifications</h4>
//             <div className="product-specs__grid">
//               {product.brand && (
//                 <div className="spec-item">
//                   <span className="spec-label">Brand:</span>
//                   <span className="spec-value">{product.brand}</span>
//                 </div>
//               )}
//               {product.volume && (
//                 <div className="spec-item">
//                   <span className="spec-label">Volume:</span>
//                   <span className="spec-value">{product.volume}</span>
//                 </div>
//               )}
//               {product.material && (
//                 <div className="spec-item">
//                   <span className="spec-label">Material:</span>
//                   <span className="spec-value">{product.material}</span>
//                 </div>
//               )}
//               {product.type && (
//                 <div className="spec-item">
//                   <span className="spec-label">Type:</span>
//                   <span className="spec-value">{product.type}</span>
//                 </div>
//               )}
//               {product.color && (
//                 <div className="spec-item">
//                   <span className="spec-label">Color:</span>
//                   <span className="spec-value">{product.color}</span>
//                 </div>
//               )}
//               {product.colorcode && (
//                 <div className="spec-item">
//                   <span className="spec-label">Color code:</span>
//                   <span className="spec-value">{product.colorcode}</span>
//                 </div>
//               )}
//               {product.finish && (
//                 <div className="spec-item">
//                   <span className="spec-label">Finish:</span>
//                   <span className="spec-value">{product.finish}</span>
//                 </div>
//               )}
//               {product.compatibility && (
//                 <div className="spec-item">
//                   <span className="spec-label">Compatibility:</span>
//                   <span className="spec-value">{product.compatibility}</span>
//                 </div>
//               )}
//               {product.position && (
//                 <div className="spec-item">
//                   <span className="spec-label">Position:</span>
//                   <span className="spec-value">{product.position}</span>
//                 </div>
//               )}
//               {product.surfaceuse && (
//                 <div className="spec-item">
//                   <span className="spec-label">Surface Use:</span>
//                   <span className="spec-value">{product.surfaceuse}</span>
//                 </div>
//               )}
//               {product.resistance && (
//                 <div className="spec-item">
//                   <span className="spec-label">Resistance:</span>
//                   <span className="spec-value">{product.resistance}</span>
//                 </div>
//               )}
//               {product.drytime && (
//                 <div className="spec-item">
//                   <span className="spec-label">Dry Time:</span>
//                   <span className="spec-value">{product.drytime}</span>
//                 </div>
//               )}
//               {product.applicationmethod && (
//                 <div className="spec-item">
//                   <span className="spec-label">Application Method:</span>
//                   <span className="spec-value">{product.applicationmethod}</span>
//                 </div>
//               )}
//               {product.voltage && (
//                 <div className="spec-item">
//                   <span className="spec-label">Voltage:</span>
//                   <span className="spec-value">{product.voltage}</span>
//                 </div>
//               )}
//               {product.amprating && (
//                 <div className="spec-item">
//                   <span className="spec-label">Amp Rating:</span>
//                   <span className="spec-value">{product.amprating}</span>
//                 </div>
//               )}
//               {product.connectortype && (
//                 <div className="spec-item">
//                   <span className="spec-label">Connector Type:</span>
//                   <span className="spec-value">{product.connectortype}</span>
//                 </div>
//               )}
//             </div>
//           </div>

          
//           <div className="inventory-section">
//             <h4 className="inventory-section__title">Inventory Management</h4>
//             <div className="inventory-grid">
//               <div className="inventory-item">
//                 <div className="inventory-item__icon">
//                   <Package size={20} />
//                 </div>
//                 <div className="inventory-item__info">
//                   <span className="inventory-item__label">Current Stock</span>
//                   <span className="inventory-item__value">{product.quantity} units</span>
//                 </div>
//               </div>

//               <div className="inventory-item">
//                 <div className="inventory-item__icon">
//                   <DollarSign size={20} />
//                 </div>
//                 <div className="inventory-item__info">
//                   <span className="inventory-item__label">Total Value</span>
//                   <span className="inventory-item__value">
//                     LKR {(parseFloat(product.price.replace(/[^\d.]/g, '')) * product.quantity).toLocaleString()}
//                   </span>
//                 </div>
//               </div>

//               <div className="inventory-item">
//                 <div className="inventory-item__icon">
//                   <AlertTriangle size={20} />
//                 </div>
//                 <div className="inventory-item__info">
//                   <span className="inventory-item__label">Minimum Stock Level</span>
//                   <span className="inventory-item__value">
//                     {product.minquantity} units
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>

          
//           <div className="product-details">
//             <h4 className="product-details__title">Additional Details</h4>
//             <div className="product-details__grid">
//               {/* Manufacturing Information */}
//               {(product.manufacturer || product.manufactureddate || product.warranty) && (
//                 <div className="detail-group">
//                   <h5 className="detail-group__subtitle">Manufacturing Information</h5>
//                   <div className="detail-group__items">
//                     {product.manufacturer && (
//                       <div className="detail-item">
//                         <span className="detail-label">Manufacturer:</span>
//                         <span className="detail-value">{product.manufacturer}</span>
//                       </div>
//                     )}
//                     {product.manufactureddate && (
//                       <div className="detail-item">
//                         <span className="detail-label">Manufactured Date:</span>
//                         <span className="detail-value">{new Date(product.manufactureddate).toLocaleDateString()}</span>
//                       </div>
//                     )}
//                     {product.warranty && (
//                       <div className="detail-item">
//                         <span className="detail-label">Warranty:</span>
//                         <span className="detail-value">{product.warranty}</span>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}

//               {/* Product Lifecycle */}
//               {product.expirydate && (
//                 <div className="detail-group">
//                   <h5 className="detail-group__subtitle">Product Lifecycle</h5>
//                   <div className="detail-group__items">
//                     <div className="detail-item">
//                       <span className="detail-label">Expiry Date:</span>
//                       <span className={`detail-value ${isExpiringSoon(product.expirydate) ? 'detail-value--warning' : ''}`}>
//                         {new Date(product.expirydate).toLocaleDateString()}
//                         {isExpiringSoon(product.expirydate) && (
//                           <span className="expiry-warning">⚠️ Expiring Soon</span>
//                         )}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {/* Additional Notes */}
//               {product.notes && (
//                 <div className="detail-group detail-group--full-width">
//                   <h5 className="detail-group__subtitle">Notes</h5>
//                   <div className="detail-group__items">
//                     <div className="detail-item detail-item--notes">
//                       <p className="detail-notes">{product.notes}</p>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

          
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductViewPanel;

import React from 'react';
import './ProductViewPanel.scss';
import { 
  X, 
  Printer, 
  Download,  
  Package, 
  DollarSign,
  AlertTriangle 
} from 'lucide-react';

interface Product {
  id: string;
  productname: string;
  category: 'Engine & Fluids' | 'Wear & Tear Parts' | 'Exterior & Body Parts' | 'Paints & Coatings' | 'Engine & Drivetrain Components' | 'Electrical Components' | 'Accessories & Add-ons' | 'Tools & Kits',
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

interface ProductViewPanelProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onEdit?: (product: Product) => void;
  onDelete?: (productId: string) => void;
  onDuplicate?: (product: Product) => void;
}

const ProductViewPanel: React.FC<ProductViewPanelProps> = ({
  isOpen,
  onClose,
  product,
}) => {

  if (!product) return null;

  const generatePrintableHTML = () => {
    const currentDate = new Date().toLocaleDateString();
    const totalValue = (parseFloat(product.price.replace(/[^\d.]/g, '')) * product.quantity).toLocaleString();
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Product Report - ${product.productname}</title>
        <style>
          @page { 
            margin: 20mm; 
            size: A4;
          }
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: white;
          }
          
          .header {
            border-bottom: 3px solid #2563eb;
            padding-bottom: 20px;
            margin-bottom: 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          
          .header-left h1 {
            color: #1f2937;
            font-size: 28px;
            font-weight: 600;
            margin-bottom: 5px;
          }
          
          .header-left .subtitle {
            color: #6b7280;
            font-size: 14px;
          }
          
          .header-right {
            text-align: right;
            color: #6b7280;
            font-size: 12px;
          }
          
          .product-overview {
            display: grid;
            grid-template-columns: 200px 1fr;
            gap: 30px;
            margin-bottom: 30px;
            padding: 20px;
            background: #f8fafc;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
          }
          
          .product-image {
            width: 180px;
            height: 180px;
            object-fit: cover;
            border-radius: 8px;
            border: 2px solid #e2e8f0;
          }
          
          .product-info h2 {
            color: #1f2937;
            font-size: 24px;
            margin-bottom: 8px;
            font-weight: 600;
          }
          
          .category {
            color: #6b7280;
            font-size: 14px;
            margin-bottom: 10px;
            font-weight: 500;
          }
          
          .description {
            color: #4b5563;
            margin-bottom: 15px;
            line-height: 1.5;
          }
          
          .price {
            font-size: 20px;
            font-weight: 700;
            color: #059669;
            margin-bottom: 10px;
          }
          
          .status {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .status.in-stock { background: #dcfce7; color: #166534; }
          .status.low-stock { background: #fef3c7; color: #92400e; }
          .status.out-stock { background: #fee2e2; color: #991b1b; }
          
          .section {
            margin-bottom: 25px;
            page-break-inside: avoid;
          }
          
          .section-title {
            color: #1f2937;
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 2px solid #e5e7eb;
            display: flex;
            align-items: center;
            gap: 8px;
          }
          
          .specs-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
          
          .spec-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 12px;
            background: #f9fafb;
            border-radius: 6px;
            border: 1px solid #e5e7eb;
          }
          
          .spec-label {
            font-weight: 500;
            color: #6b7280;
          }
          
          .spec-value {
            font-weight: 600;
            color: #1f2937;
          }
          
          .inventory-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
          }
          
          .inventory-card {
            text-align: center;
            padding: 20px;
            background: #f8fafc;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
          }
          
          .inventory-icon {
            width: 40px;
            height: 40px;
            margin: 0 auto 10px;
            background: #2563eb;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
          }
          
          .inventory-label {
            display: block;
            font-size: 12px;
            color: #6b7280;
            margin-bottom: 5px;
            font-weight: 500;
          }
          
          .inventory-value {
            font-size: 16px;
            font-weight: 700;
            color: #1f2937;
          }
          
          .details-section {
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
          }
          
          .detail-group {
            margin-bottom: 20px;
          }
          
          .detail-group h4 {
            color: #374151;
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .detail-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            padding: 6px 0;
          }
          
          .detail-label {
            color: #6b7280;
            font-weight: 500;
          }
          
          .detail-value {
            color: #1f2937;
            font-weight: 600;
          }
          
          .warning {
            color: #dc2626 !important;
            font-weight: 700;
          }
          
          .notes {
            background: white;
            padding: 15px;
            border-radius: 6px;
            border: 1px solid #d1d5db;
            margin-top: 10px;
            font-style: italic;
            color: #4b5563;
          }
          
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e5e7eb;
            text-align: center;
            color: #6b7280;
            font-size: 12px;
          }

          @media print {
            body { print-color-adjust: exact; }
            .section { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="header-left">
            <h1>Product Report</h1>
            <div class="subtitle">ID: ${product.id}</div>
          </div>
          <div class="header-right">
            <div>Generated: ${currentDate}</div>
            <div>Page 1 of 1</div>
          </div>
        </div>

        <div class="product-overview">
          <div>
            <img src="${product.image}" alt="${product.productname}" class="product-image" />
          </div>
          <div class="product-info">
            <h2>${product.productname}</h2>
            <div class="category">${product.category} • ${product.subcategory}</div>
            <div class="description">${product.description}</div>
            <div class="price">LKR ${product.price}</div>
            <span class="status ${product.availability.toLowerCase().replace(' ', '-')}">${product.availability}</span>
          </div>
        </div>

        <div class="section">
          <h3 class="section-title">📋 Specifications</h3>
          <div class="specs-grid">
            ${product.brand ? `<div class="spec-item"><span class="spec-label">Brand</span><span class="spec-value">${product.brand}</span></div>` : ''}
            ${product.volume ? `<div class="spec-item"><span class="spec-label">Volume</span><span class="spec-value">${product.volume}</span></div>` : ''}
            ${product.material ? `<div class="spec-item"><span class="spec-label">Material</span><span class="spec-value">${product.material}</span></div>` : ''}
            ${product.type ? `<div class="spec-item"><span class="spec-label">Type</span><span class="spec-value">${product.type}</span></div>` : ''}
            ${product.color ? `<div class="spec-item"><span class="spec-label">Color</span><span class="spec-value">${product.color}</span></div>` : ''}
            ${product.colorcode ? `<div class="spec-item"><span class="spec-label">Color Code</span><span class="spec-value">${product.colorcode}</span></div>` : ''}
            ${product.finish ? `<div class="spec-item"><span class="spec-label">Finish</span><span class="spec-value">${product.finish}</span></div>` : ''}
            ${product.compatibility ? `<div class="spec-item"><span class="spec-label">Compatibility</span><span class="spec-value">${product.compatibility}</span></div>` : ''}
            ${product.position ? `<div class="spec-item"><span class="spec-label">Position</span><span class="spec-value">${product.position}</span></div>` : ''}
            ${product.surfaceuse ? `<div class="spec-item"><span class="spec-label">Surface Use</span><span class="spec-value">${product.surfaceuse}</span></div>` : ''}
            ${product.resistance ? `<div class="spec-item"><span class="spec-label">Resistance</span><span class="spec-value">${product.resistance}</span></div>` : ''}
            ${product.drytime ? `<div class="spec-item"><span class="spec-label">Dry Time</span><span class="spec-value">${product.drytime}</span></div>` : ''}
            ${product.applicationmethod ? `<div class="spec-item"><span class="spec-label">Application Method</span><span class="spec-value">${product.applicationmethod}</span></div>` : ''}
            ${product.voltage ? `<div class="spec-item"><span class="spec-label">Voltage</span><span class="spec-value">${product.voltage}</span></div>` : ''}
            ${product.amprating ? `<div class="spec-item"><span class="spec-label">Amp Rating</span><span class="spec-value">${product.amprating}</span></div>` : ''}
            ${product.connectortype ? `<div class="spec-item"><span class="spec-label">Connector Type</span><span class="spec-value">${product.connectortype}</span></div>` : ''}
          </div>
        </div>

        <div class="section">
          <h3 class="section-title">📦 Inventory Overview</h3>
          <div class="inventory-grid">
            <div class="inventory-card">
              <div class="inventory-icon">📦</div>
              <span class="inventory-label">Current Stock</span>
              <div class="inventory-value">${product.quantity} units</div>
            </div>
            <div class="inventory-card">
              <div class="inventory-icon">💰</div>
              <span class="inventory-label">Total Value</span>
              <div class="inventory-value">LKR ${totalValue}</div>
            </div>
            <div class="inventory-card">
              <div class="inventory-icon">⚠️</div>
              <span class="inventory-label">Min. Stock Level</span>
              <div class="inventory-value">${product.minquantity} units</div>
            </div>
          </div>
        </div>

        <div class="section">
          <h3 class="section-title">ℹ️ Additional Details</h3>
          <div class="details-section">
            ${(product.manufacturer || product.manufactureddate || product.warranty) ? `
              <div class="detail-group">
                <h4>Manufacturing Information</h4>
                ${product.manufacturer ? `<div class="detail-item"><span class="detail-label">Manufacturer</span><span class="detail-value">${product.manufacturer}</span></div>` : ''}
                ${product.manufactureddate ? `<div class="detail-item"><span class="detail-label">Manufactured Date</span><span class="detail-value">${new Date(product.manufactureddate).toLocaleDateString()}</span></div>` : ''}
                ${product.warranty ? `<div class="detail-item"><span class="detail-label">Warranty</span><span class="detail-value">${product.warranty}</span></div>` : ''}
              </div>
            ` : ''}
            
            ${product.expirydate ? `
              <div class="detail-group">
                <h4>Product Lifecycle</h4>
                <div class="detail-item">
                  <span class="detail-label">Expiry Date</span>
                  <span class="detail-value ${isExpiringSoon(product.expirydate) ? 'warning' : ''}">
                    ${new Date(product.expirydate).toLocaleDateString()}
                    ${isExpiringSoon(product.expirydate) ? ' ⚠️ Expiring Soon' : ''}
                  </span>
                </div>
              </div>
            ` : ''}
            
            ${product.notes ? `
              <div class="detail-group">
                <h4>Additional Notes</h4>
                <div class="notes">${product.notes}</div>
              </div>
            ` : ''}
          </div>
        </div>

        <div class="footer">
          <p>This report was generated automatically from the inventory management system.</p>
          <p>For any questions or concerns, please contact the inventory team.</p>
        </div>
      </body>
      </html>
    `;
  };

  const handlePrint = () => {
    const printContent = generatePrintableHTML();
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      
      // Wait for content to load then print
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          printWindow.onafterprint = () => printWindow.close();
        }, 250);
      };
    }
  };

  const handleExportPDF = async () => {
    try {
      const printContent = generatePrintableHTML();
      
      // Create a blob with HTML content
      const blob = new Blob([printContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      // Create temporary link and download
      const link = document.createElement('a');
      link.href = url;
      link.download = `product-report-${product.productname.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${Date.now()}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      // Show success message
      alert('Report downloaded successfully! Open the HTML file in your browser and print to PDF.');
      
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export PDF. Please try again.');
    }
  };

  const getStatusColor = (availability: string) => {
    switch (availability.toLowerCase()) {
      case 'in stock': return '#10b981';
      case 'low stock': return '#f59e0b';
      case 'out of stock': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const isExpiringSoon = (expiryDate: string | null | undefined): boolean => {
    if (!expiryDate) return false;
    
    const expiry = new Date(expiryDate);
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));
    
    return expiry <= thirtyDaysFromNow && expiry >= today;
  };

  return (
    <div className={`product-view-panel ${isOpen ? 'product-view-panel--open' : ''}`}>
      <div className="product-view-panel__overlay" onClick={onClose} />
      
      <div className="product-view-panel__content">
        <div className="product-view-panel__header">
          <div className="product-view-panel__header-left">
            <h2 className="product-view-panel__title">Product Details</h2>
            <span className="product-view-panel__id">ID: {product.id}</span>
          </div>
          <button 
            className="product-view-panel__close"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <div className="product-view-panel__actions">
          <button className="action-btn action-btn--primary" onClick={handlePrint}>
            <Printer size={16} />
            Print/Export PDF
          </button>
          {/* <button className="action-btn action-btn--secondary" onClick={handleExportPDF}>
            <Download size={16} />
            Export PDF
          </button> */}
        </div>

        <div className="product-view-panel__body">
          <div className="product-info">
            <div className="product-info__image-section">
              <img 
                src={product.image} 
                alt={product.productname}
                className="product-info__image"
              />
              <div className="product-info__status">
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(product.availability) }}
                >
                  {product.availability}
                </span>
              </div>
            </div>

            <div className="product-info__details">
              <h3 className="product-info__name">{product.productname}</h3>
              <p className="product-info__category">{product.category} • {product.subcategory}</p>
              <p className="product-info__description">{product.description}</p>

              <div className="product-info__price">
                <span className="price-current">LKR {product.price}</span>
              </div>
            </div>
          </div>

          
          <div className="product-specs">
            <h4 className="product-specs__title">Specifications</h4>
            <div className="product-specs__grid">
              {product.brand && (
                <div className="spec-item">
                  <span className="spec-label">Brand:</span>
                  <span className="spec-value">{product.brand}</span>
                </div>
              )}
              {product.volume && (
                <div className="spec-item">
                  <span className="spec-label">Volume:</span>
                  <span className="spec-value">{product.volume}</span>
                </div>
              )}
              {product.material && (
                <div className="spec-item">
                  <span className="spec-label">Material:</span>
                  <span className="spec-value">{product.material}</span>
                </div>
              )}
              {product.type && (
                <div className="spec-item">
                  <span className="spec-label">Type:</span>
                  <span className="spec-value">{product.type}</span>
                </div>
              )}
              {product.color && (
                <div className="spec-item">
                  <span className="spec-label">Color:</span>
                  <span className="spec-value">{product.color}</span>
                </div>
              )}
              {product.colorcode && (
                <div className="spec-item">
                  <span className="spec-label">Color code:</span>
                  <span className="spec-value">{product.colorcode}</span>
                </div>
              )}
              {product.finish && (
                <div className="spec-item">
                  <span className="spec-label">Finish:</span>
                  <span className="spec-value">{product.finish}</span>
                </div>
              )}
              {product.compatibility && (
                <div className="spec-item">
                  <span className="spec-label">Compatibility:</span>
                  <span className="spec-value">{product.compatibility}</span>
                </div>
              )}
              {product.position && (
                <div className="spec-item">
                  <span className="spec-label">Position:</span>
                  <span className="spec-value">{product.position}</span>
                </div>
              )}
              {product.surfaceuse && (
                <div className="spec-item">
                  <span className="spec-label">Surface Use:</span>
                  <span className="spec-value">{product.surfaceuse}</span>
                </div>
              )}
              {product.resistance && (
                <div className="spec-item">
                  <span className="spec-label">Resistance:</span>
                  <span className="spec-value">{product.resistance}</span>
                </div>
              )}
              {product.drytime && (
                <div className="spec-item">
                  <span className="spec-label">Dry Time:</span>
                  <span className="spec-value">{product.drytime}</span>
                </div>
              )}
              {product.applicationmethod && (
                <div className="spec-item">
                  <span className="spec-label">Application Method:</span>
                  <span className="spec-value">{product.applicationmethod}</span>
                </div>
              )}
              {product.voltage && (
                <div className="spec-item">
                  <span className="spec-label">Voltage:</span>
                  <span className="spec-value">{product.voltage}</span>
                </div>
              )}
              {product.amprating && (
                <div className="spec-item">
                  <span className="spec-label">Amp Rating:</span>
                  <span className="spec-value">{product.amprating}</span>
                </div>
              )}
              {product.connectortype && (
                <div className="spec-item">
                  <span className="spec-label">Connector Type:</span>
                  <span className="spec-value">{product.connectortype}</span>
                </div>
              )}
            </div>
          </div>

          
          <div className="inventory-section">
            <h4 className="inventory-section__title">Inventory Management</h4>
            <div className="inventory-grid">
              <div className="inventory-item">
                <div className="inventory-item__icon">
                  <Package size={20} />
                </div>
                <div className="inventory-item__info">
                  <span className="inventory-item__label">Current Stock</span>
                  <span className="inventory-item__value">{product.quantity} units</span>
                </div>
              </div>

              <div className="inventory-item">
                <div className="inventory-item__icon">
                  <DollarSign size={20} />
                </div>
                <div className="inventory-item__info">
                  <span className="inventory-item__label">Total Value</span>
                  <span className="inventory-item__value">
                    LKR {(parseFloat(product.price.replace(/[^\d.]/g, '')) * product.quantity).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="inventory-item">
                <div className="inventory-item__icon">
                  <AlertTriangle size={20} />
                </div>
                <div className="inventory-item__info">
                  <span className="inventory-item__label">Minimum Stock Level</span>
                  <span className="inventory-item__value">
                    {product.minquantity} units
                  </span>
                </div>
              </div>
            </div>
          </div>

          
          <div className="product-details">
            <h4 className="product-details__title">Additional Details</h4>
            <div className="product-details__grid">
              {/* Manufacturing Information */}
              {(product.manufacturer || product.manufactureddate || product.warranty) && (
                <div className="detail-group">
                  <h5 className="detail-group__subtitle">Manufacturing Information</h5>
                  <div className="detail-group__items">
                    {product.manufacturer && (
                      <div className="detail-item">
                        <span className="detail-label">Manufacturer:</span>
                        <span className="detail-value">{product.manufacturer}</span>
                      </div>
                    )}
                    {product.manufactureddate && (
                      <div className="detail-item">
                        <span className="detail-label">Manufactured Date:</span>
                        <span className="detail-value">{new Date(product.manufactureddate).toLocaleDateString()}</span>
                      </div>
                    )}
                    {product.warranty && (
                      <div className="detail-item">
                        <span className="detail-label">Warranty:</span>
                        <span className="detail-value">{product.warranty}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Product Lifecycle */}
              {product.expirydate && (
                <div className="detail-group">
                  <h5 className="detail-group__subtitle">Product Lifecycle</h5>
                  <div className="detail-group__items">
                    <div className="detail-item">
                      <span className="detail-label">Expiry Date:</span>
                      <span className={`detail-value ${isExpiringSoon(product.expirydate) ? 'detail-value--warning' : ''}`}>
                        {new Date(product.expirydate).toLocaleDateString()}
                        {isExpiringSoon(product.expirydate) && (
                          <span className="expiry-warning">⚠️ Expiring Soon</span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Additional Notes */}
              {product.notes && (
                <div className="detail-group detail-group--full-width">
                  <h5 className="detail-group__subtitle">Notes</h5>
                  <div className="detail-group__items">
                    <div className="detail-item detail-item--notes">
                      <p className="detail-notes">{product.notes}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          
        </div>
      </div>
    </div>
  );
};

export default ProductViewPanel;