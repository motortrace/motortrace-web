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
  ExternalLink
} from 'lucide-react';

interface Product {
  id: string;
  productName: string;
  category: string;
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
          <button className="action-btn action-btn--secondary" onClick={handleCopyLink}>
            <Link size={16} />
            Copy Link
          </button>
          <button 
            className="action-btn action-btn--secondary"
            onClick={() => onDuplicate?.(product)}
          >
            <Copy size={16} />
            Duplicate
          </button>
          <button 
            className="action-btn action-btn--warning"
            onClick={() => onEdit?.(product)}
          >
            <Edit size={16} />
            Edit
          </button>
          <button 
            className="action-btn action-btn--danger"
            onClick={() => onDelete?.(product.id)}
          >
            <Trash2 size={16} />
            Delete
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
              
              <div className="product-info__rating">
                <div className="rating-stars">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      fill={i < Math.floor(product.rating) ? '#fbbf24' : 'none'}
                      color="#fbbf24"
                    />
                  ))}
                </div>
                <span className="rating-text">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>

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
                  <Eye size={20} />
                </div>
                <div className="inventory-item__info">
                  <span className="inventory-item__label">Views</span>
                  <span className="inventory-item__value">1,234</span>
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

          {/* Quick Actions */}
          <div className="quick-actions">
            <h4 className="quick-actions__title">Quick Actions</h4>
            <div className="quick-actions__grid">
              <button className="quick-action-btn">
                <History size={16} />
                View History
              </button>
              <button className="quick-action-btn">
                <User size={16} />
                Supplier Info
              </button>
              <button className="quick-action-btn">
                <DollarSign size={16} />
                Price History
              </button>
              <button className="quick-action-btn">
                <ExternalLink size={16} />
                View on Site
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductViewPanel;