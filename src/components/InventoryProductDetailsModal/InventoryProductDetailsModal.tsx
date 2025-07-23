import React from 'react';
import './InventoryProductDetailsModal.scss';

interface ProductDetails {
  image: string;
  name: string;
  sku: string;
  brand: string;
  category: string;
  supplier: string;
  location: string;
  description: string;
  price: number;
  stock: number;
  minStock: number;
  maxStock: number;
  reorderPoint: number;
  status: 'Active' | 'Inactive' | 'Low Stock' | 'Out of Stock';
  lastRestocked: string;
  lastSold: string;
  warranty: string;
  vehicleApplication: string;
  notes?: string;
}

interface Props {
  product: ProductDetails;
  onClose: () => void;
}

const getStockColor = (stock: number, minStock: number) => {
  if (stock === 0) return '#dc2626'; // red
  if (stock <= minStock) return '#f59e0b'; // orange
  return '#059669'; // green
};

const InventoryProductDetailsModal: React.FC<Props> = ({ product, onClose }) => (
  <div className="inventory-product-modal__backdrop">
    <div className="inventory-product-modal inventory-product-modal--large">
      <button className="inventory-product-modal__close" onClick={onClose}>×</button>
      <div className="inventory-product-modal__header">
        <img src={product.image} alt={product.name} className="inventory-product-modal__image" />
        <div>
          <h2 className="inventory-product-modal__title">{product.name}</h2>
          <div className="inventory-product-modal__meta">
            <span className="inventory-product-modal__sku">SKU: {product.sku}</span>
            <span className={`inventory-product-modal__status inventory-product-modal__status--${product.status.replace(' ', '-').toLowerCase()}`}>{product.status}</span>
          </div>
          <div className="inventory-product-modal__brand">{product.brand} &middot; {product.category}</div>
        </div>
      </div>
      <div className="inventory-product-modal__section-row">
        <div className="inventory-product-modal__section">
          <h4 style={{ color: '#111827' }}>Stock</h4>
          <div style={{ fontWeight: 700, fontSize: 18, color: getStockColor(product.stock, product.minStock) }}>
            {product.stock} units
          </div>
          <div style={{ color: '#6b7280', fontSize: 14 }}>
            Min: {product.minStock} &middot; Max: {product.maxStock} &middot; Reorder: {product.reorderPoint}
          </div>
          <div style={{ color: '#6b7280', fontSize: 14, marginTop: 8 }}>
            <strong>Location:</strong> {product.location}
          </div>
        </div>
        <div className="inventory-product-modal__section">
          <h4 style={{ color: '#111827' }}>Price</h4>
          <div style={{ fontWeight: 700, fontSize: 20, color: '#2563eb' }}>
            LKR {product.price.toLocaleString()}
          </div>
          <div style={{ color: '#6b7280', fontSize: 14, marginTop: 8 }}>
            <strong>Supplier:</strong> {product.supplier}
          </div>
        </div>
        <div className="inventory-product-modal__section">
          <h4 style={{ color: '#111827' }}>Recent Activity</h4>
          <div><strong>Last Restocked:</strong> {product.lastRestocked}</div>
          <div><strong>Last Sold:</strong> {product.lastSold}</div>
        </div>
      </div>
      <div className="inventory-product-modal__section-row">
        <div className="inventory-product-modal__section" style={{ flex: 2 }}>
          <h4 style={{ color: '#111827' }}>Description</h4>
          <div>{product.description}</div>
        </div>
        <div className="inventory-product-modal__section" style={{ flex: 1 }}>
          <h4 style={{ color: '#111827' }}>Vehicle Application</h4>
          <div>{product.vehicleApplication}</div>
          <div style={{ marginTop: 12, color: '#6b7280', fontSize: 14 }}>
            <strong>Warranty:</strong> {product.warranty}
          </div>
        </div>
      </div>
      {product.notes && (
        <div className="inventory-product-modal__section">
          <h4 style={{ color: '#111827' }}>Notes</h4>
          <div>{product.notes}</div>
        </div>
      )}
    </div>
  </div>
);

export default InventoryProductDetailsModal;