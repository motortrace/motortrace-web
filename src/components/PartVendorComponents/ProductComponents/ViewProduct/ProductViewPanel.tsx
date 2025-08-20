import React, { useState } from 'react';
import './ProductViewPanel.scss';
import { 
  X, 
  Printer, 
  Download, 
  Link, 
  Copy, 
  Edit, 
  Trash2, 
  History, 
  Package, 
  DollarSign,
  User,
  Star,
  Eye,
  Plus,
  Minus,
  ExternalLink,
  AlertTriangle 
} from 'lucide-react';

// interface Product {
//   id: string;
//   productName: string;
//   category: string;
//   subcategory: string;
//   description: string;
//   price: string;
//   rating: number;
//   reviewCount: number;
//   availability: 'In Stock' | 'Low Stock' | 'Out of Stock';
//   image: string;
//   stock: number;
//   compatibility: string;
//   position: string;
//   brand: string;
//   finish: string;
//   material: string;
//   surfaceUse: string;
//   type: string;
//   color: string;
//   volume: string;
// }
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
  finish: string;
  material: string;
  surfaceUse: string;
  type: string;
  color: string;
  volume: string;
  mountingFeatures:string;
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
  onEdit,
  onDelete,
  onDuplicate
}) => {
  const [stockAdjustment, setStockAdjustment] = useState(0);
  const [showStockAdjust, setShowStockAdjust] = useState(false);

  if (!product) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    // Implement PDF export logic
    console.log('Exporting to PDF...');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/products/${product.id}`);
    // Show toast notification
    console.log('Link copied to clipboard');
  };

  const handleStockAdjustment = (change: number) => {
    setStockAdjustment(prev => prev + change);
  };

  const handleSaveStockAdjustment = () => {
    // Implement stock adjustment logic
    console.log(`Adjusting stock by ${stockAdjustment}`);
    setStockAdjustment(0);
    setShowStockAdjust(false);
  };

  const getStatusColor = (availability: string) => {
    switch (availability.toLowerCase()) {
      case 'in stock': return '#10b981';
      case 'low stock': return '#f59e0b';
      case 'out of stock': return '#ef4444';
      default: return '#6b7280';
    }
  };

  // Helper function to check if product is expiring soon (within 30 days)
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
        {/* Header */}
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

        {/* Action Buttons */}
        <div className="product-view-panel__actions">
          <button className="action-btn action-btn--primary" onClick={handlePrint}>
            <Printer size={16} />
            Print
          </button>
          <button className="action-btn action-btn--secondary" onClick={handleExportPDF}>
            <Download size={16} />
            Export PDF
          </button>
        </div>

        {/* Product Content */}
        <div className="product-view-panel__body">
          {/* Product Image and Basic Info */}
          <div className="product-info">
            <div className="product-info__image-section">
              <img 
                src={product.image} 
                alt={product.productName}
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
              <h3 className="product-info__name">{product.productName}</h3>
              <p className="product-info__category">{product.category} • {product.subcategory}</p>
              <p className="product-info__description">{product.description}</p>

              <div className="product-info__price">
                <span className="price-current">{product.price}</span>
              </div>
            </div>
          </div>

          {/* Product Specifications */}
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
              {product.colorCode && (
                <div className="spec-item">
                  <span className="spec-label">Color code:</span>
                  <span className="spec-value">{product.colorCode}</span>
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
              {product.surfaceUse && (
                <div className="spec-item">
                  <span className="spec-label">Surface Use:</span>
                  <span className="spec-value">{product.surfaceUse}</span>
                </div>
              )}
              {product.resistance && (
                <div className="spec-item">
                  <span className="spec-label">Resistance:</span>
                  <span className="spec-value">{product.resistance}</span>
                </div>
              )}
              {product.dryTime && (
                <div className="spec-item">
                  <span className="spec-label">Dry Time:</span>
                  <span className="spec-value">{product.dryTime}</span>
                </div>
              )}
              {product.applicationMethod && (
                <div className="spec-item">
                  <span className="spec-label">Application Method:</span>
                  <span className="spec-value">{product.applicationMethod}</span>
                </div>
              )}
              {product.voltage && (
                <div className="spec-item">
                  <span className="spec-label">Voltage:</span>
                  <span className="spec-value">{product.voltage}</span>
                </div>
              )}
              {product.ampRating && (
                <div className="spec-item">
                  <span className="spec-label">Amp Rating:</span>
                  <span className="spec-value">{product.ampRating}</span>
                </div>
              )}
              {product.connectorType && (
                <div className="spec-item">
                  <span className="spec-label">Connector Type:</span>
                  <span className="spec-value">{product.connectorType}</span>
                </div>
              )}
            </div>
          </div>

          {/* Inventory Management */}
          <div className="inventory-section">
            <h4 className="inventory-section__title">Inventory Management</h4>
            <div className="inventory-grid">
              <div className="inventory-item">
                <div className="inventory-item__icon">
                  <Package size={20} />
                </div>
                <div className="inventory-item__info">
                  <span className="inventory-item__label">Current Stock</span>
                  <span className="inventory-item__value">{product.stock} units</span>
                </div>
              </div>

              <div className="inventory-item">
                <div className="inventory-item__icon">
                  <DollarSign size={20} />
                </div>
                <div className="inventory-item__info">
                  <span className="inventory-item__label">Total Value</span>
                  <span className="inventory-item__value">
                    LKR {(parseFloat(product.price.replace(/[^\d.]/g, '')) * product.stock).toLocaleString()}
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
                    {product.minQuantity} units
                  </span>
                </div>
              </div>
            </div>

            {/* Stock Adjustment */}
            <div className="stock-adjustment">
              <button 
                className="stock-adjustment__toggle"
                onClick={() => setShowStockAdjust(!showStockAdjust)}
              >
                Adjust Stock
              </button>

              {showStockAdjust && (
                <div className="stock-adjustment__controls">
                  <div className="stock-adjustment__input-group">
                    <button 
                      className="stock-btn stock-btn--minus"
                      onClick={() => handleStockAdjustment(-1)}
                    >
                      <Minus size={16} />
                    </button>
                    <input 
                      type="number" 
                      value={stockAdjustment}
                      onChange={(e) => setStockAdjustment(parseInt(e.target.value) || 0)}
                      className="stock-adjustment__input"
                    />
                    <button 
                      className="stock-btn stock-btn--plus"
                      onClick={() => handleStockAdjustment(1)}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <button 
                    className="stock-adjustment__save"
                    onClick={handleSaveStockAdjustment}
                  >
                    Save Adjustment
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Additional Product Details */}
          <div className="product-details">
            <h4 className="product-details__title">Additional Details</h4>
            <div className="product-details__grid">
              {/* Discount Information */}
              {(product.discountType || product.discountValue) && (
                <div className="detail-group">
                  <h5 className="detail-group__subtitle">Discount Information</h5>
                  <div className="detail-group__items">
                    {product.discountType && (
                      <div className="detail-item">
                        <span className="detail-label">Discount Type:</span>
                        <span className="detail-value">{product.discountType}</span>
                      </div>
                    )}
                    {product.discountValue && (
                      <div className="detail-item">
                        <span className="detail-label">Discount Value:</span>
                        <span className="detail-value">
                          {product.discountType === 'percentage' ? `${product.discountValue}%` : `LKR ${product.discountValue}`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Manufacturing Information */}
              {(product.manufacturer || product.manufacturedDate || product.warranty) && (
                <div className="detail-group">
                  <h5 className="detail-group__subtitle">Manufacturing Information</h5>
                  <div className="detail-group__items">
                    {product.manufacturer && (
                      <div className="detail-item">
                        <span className="detail-label">Manufacturer:</span>
                        <span className="detail-value">{product.manufacturer}</span>
                      </div>
                    )}
                    {product.manufacturedDate && (
                      <div className="detail-item">
                        <span className="detail-label">Manufactured Date:</span>
                        <span className="detail-value">{new Date(product.manufacturedDate).toLocaleDateString()}</span>
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
              {product.expiryDate && (
                <div className="detail-group">
                  <h5 className="detail-group__subtitle">Product Lifecycle</h5>
                  <div className="detail-group__items">
                    <div className="detail-item">
                      <span className="detail-label">Expiry Date:</span>
                      <span className={`detail-value ${isExpiringSoon(product.expiryDate) ? 'detail-value--warning' : ''}`}>
                        {new Date(product.expiryDate).toLocaleDateString()}
                        {isExpiringSoon(product.expiryDate) && (
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

          {/* Quick Actions */}
          <div className="quick-actions">
            <h4 className="quick-actions__title">Quick Actions</h4>
            <div className="quick-actions__grid">
              <button className="quick-action-btn">
                <DollarSign size={16} />
                Price History
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductViewPanel;