import React, { useState } from 'react';
import ProductDetailCard from '../ProductDetailCard/ProductDetailCard';
import './ProductDetailsSection.scss';
import brakePadSet from '../../../../assets/images/brakePad.png';
import oilFilter from '../../../../assets/images/airFilter.png';
import OrderInvoiceModal from '../OrderInvoiceModal/OrderInvoiceModal';
import ShippingConfirmationModal from '../ShippingConfirmationModal/ShippingConfirmationModal';
import ShippingStatus from '../ShippingConfirmationModal/ShippingStatus';

interface ProductDetailsSectionProps {
  orderStatus: 'Pending' | 'Accepted' | 'Declined' | 'Completed';
}

interface Product {
  id: number;
  imageUrl: string;
  name: string;
  description: string;
  size?: string;
  weight?: string;
  quantity: number;
  price: number;
}

const ProductDetailsSection: React.FC<ProductDetailsSectionProps> = ({ orderStatus }) => {
  const initialProducts: Product[] = [
    {
      id: 1,
      imageUrl: brakePadSet,
      name: 'Brake Pad Set',
      description: 'High Performance Ceramic Pads',
      size: 'Standard',
      weight: '2kg',
      quantity: 4,
      price: 7500,
    },
    {
      id: 2,
      imageUrl: oilFilter,
      name: 'Oil Filter',
      description: 'Durable oil filter for extended performance',
      size: 'Small',
      weight: '0.5kg',
      quantity: 2,
      price: 1500,
    },
  ];

  const [productStatuses, setProductStatuses] = useState<
    Record<number, { status: 'shippable' | 'not-shippable'; reason?: string }>
  >({});

  const [showInvoice, setShowInvoice] = useState(false);
  const [showShipModal, setShowShipModal] = useState(false);
  const [showShippingStatus, setShowShippingStatus] = useState(false);

  const handleMarkStatus = (
    id: number,
    status: 'shippable' | 'not-shippable',
    reason?: string
  ) => {
    setProductStatuses(prev => ({
      ...prev,
      [id]: { status, reason },
    }));
  };

  const allMarked = initialProducts.every(p => productStatuses[p.id]?.status);
  const handlePrintInvoice = () => setShowInvoice(true);
  const handleReadyForShipping = () => setShowShipModal(true);
  const handleShipNow = () => {
    setShowShipModal(false);
    setShowShippingStatus(true);
    console.log('🚚 Order will be assigned to a driver shortly.');
  };

  const invoiceProducts = initialProducts.map(product => {
    const statusEntry = productStatuses[product.id];
    return {
      name: product.name,
      quantity: product.quantity,
      price: product.price,
      markedStatus: statusEntry?.status,
      reason: statusEntry?.status === 'not-shippable' ? statusEntry.reason : undefined,
    };
  });

  return (
    <div className="product-details-section">
      <h3 className="product-details-section__title">Product Details</h3>

      <div className="product-details-section__list">
        {initialProducts.map(product => (
          <ProductDetailCard
            key={product.id}
            {...product}
            status={orderStatus}
            markedStatus={productStatuses[product.id]?.status}
            onMarkStatus={(status, reason) => handleMarkStatus(product.id, status, reason)}
          />
        ))}
      </div>

      {orderStatus === 'Accepted' && allMarked && (
        <div className="product-details-section__actions">
          <button className="btn btn-outline" onClick={handlePrintInvoice}>Print Invoice</button>
          <button className="btn btn-primary" onClick={handleReadyForShipping}>Ready for Shipping</button>
        </div>
      )}
      {/* <OrderInvoiceModal
        visible={showInvoice}
        onClose={() => setShowInvoice(false)}
        products={invoiceProducts}
      /> */}
      <ShippingConfirmationModal
        visible={showShipModal}
        onClose={() => setShowShipModal(false)}
        onShipNow={handleShipNow}
      />

      {showShippingStatus && <ShippingStatus />}
    </div>
  );
};

export default ProductDetailsSection;
