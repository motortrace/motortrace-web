import React from 'react';
import './ShippingConfirmationModal.scss';

interface ShippingConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onShipNow: () => void;
}

const ShippingConfirmationModal: React.FC<ShippingConfirmationModalProps> = ({
  visible,
  onClose,
  onShipNow,
}) => {
  if (!visible) return null;

  return (
    <div className="shipping-confirmation-modal">
      <div className="shipping-confirmation-modal__content">
        <h3>Ready for Shipping</h3>
        <p>Would you like to ship it now or later?</p>
        <div className="shipping-confirmation-modal__actions">
          <button className="btn btn-outline" onClick={onClose}>Ship Later</button>
          <button className="btn btn-primary" onClick={onShipNow}>Ship Now</button>
        </div>
      </div>
    </div>
  );
};

export default ShippingConfirmationModal;
