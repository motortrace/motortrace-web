import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../hooks/useAuth';

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  partNumber: string;
  manufacturer?: string;
  isOEM: boolean;
  currentStock: number;
  unitPrice: number;
}

interface AddPartToWorkOrderModalProps {
  open: boolean;
  onClose: () => void;
  workOrderId: string;
  onPartAdded: () => void;
}

const AddPartToWorkOrderModal: React.FC<AddPartToWorkOrderModalProps> = ({
  open,
  onClose,
  workOrderId,
  onPartAdded,
}) => {
  const { token } = useAuth();
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [selectedInventoryItemId, setSelectedInventoryItemId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [description, setDescription] = useState('');
  const [source, setSource] = useState<'INVENTORY' | 'EXTERNAL'>('INVENTORY');

  useEffect(() => {
    if (open) {
      fetchInventoryItems();
      resetForm();
    }
  }, [open]);

  const resetForm = () => {
    setSelectedInventoryItemId('');
    setQuantity(1);
    setDescription('');
    setSource('INVENTORY');
    setError(null);
  };

  const fetchInventoryItems = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3000/inventory', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch inventory items');
      }

      const result = await response.json();
      const items = result.success ? result.data : result;
      setInventoryItems(Array.isArray(items) ? items : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching inventory items:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInventoryItemChange = (itemId: string) => {
    setSelectedInventoryItemId(itemId);
    const selectedItem = inventoryItems.find(item => item.id === itemId);
    if (selectedItem && !description) {
      setDescription(selectedItem.name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedInventoryItemId) {
      setError('Please select an inventory item');
      return;
    }

    if (quantity < 1) {
      setError('Quantity must be at least 1');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: any = {
        inventoryItemId: selectedInventoryItemId,
        quantity,
        source,
      };

      if (description.trim()) {
        payload.description = description.trim();
      }

      const response = await fetch(`http://localhost:3000/work-orders/${workOrderId}/parts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add part');
      }

      onPartAdded();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error adding part:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  const selectedItem = inventoryItems.find(item => item.id === selectedInventoryItemId);

  return (
    <div className="manage-workorder-modal__overlay" onClick={onClose}>
      <div className="manage-workorder-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px', maxHeight: '90vh', overflow: 'auto' }}>
        <div className="modal-header">
          <div className="modal-title">
            <h2>Add Part</h2>
            <p>Add a new part to this work order</p>
          </div>
          <button className="close-btn" onClick={onClose} title="Close">
            <i className="bx bx-x"></i>
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
            {error && (
              <div style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '6px',
                padding: '12px',
                marginBottom: '20px',
                color: '#dc2626',
                fontSize: '14px'
              }}>
                <i className="bx bx-error-circle" style={{ marginRight: '8px' }}></i>
                {error}
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Inventory Item *
              </label>
              <select
                value={selectedInventoryItemId}
                onChange={(e) => handleInventoryItemChange(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  backgroundColor: '#fff'
                }}
                disabled={isLoading}
                required
              >
                <option value="">Select an inventory item...</option>
                {inventoryItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({item.sku}) - Stock: {item.currentStock} - LKR {item.unitPrice}
                  </option>
                ))}
              </select>
            </div>

            {selectedItem && (
              <div style={{
                backgroundColor: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                padding: '12px',
                marginBottom: '20px',
                fontSize: '13px'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <span style={{ color: '#6b7280', fontWeight: '500' }}>SKU:</span>{' '}
                    <span style={{ color: '#111827' }}>{selectedItem.sku}</span>
                  </div>
                  <div>
                    <span style={{ color: '#6b7280', fontWeight: '500' }}>Part #:</span>{' '}
                    <span style={{ color: '#111827' }}>{selectedItem.partNumber}</span>
                  </div>
                  {selectedItem.manufacturer && (
                    <div>
                      <span style={{ color: '#6b7280', fontWeight: '500' }}>Manufacturer:</span>{' '}
                      <span style={{ color: '#111827' }}>{selectedItem.manufacturer}</span>
                    </div>
                  )}
                  <div>
                    <span style={{ color: '#6b7280', fontWeight: '500' }}>Stock:</span>{' '}
                    <span style={{ color: selectedItem.currentStock > 0 ? '#10b981' : '#ef4444', fontWeight: '600' }}>
                      {selectedItem.currentStock}
                    </span>
                  </div>
                </div>
                {selectedItem.isOEM && (
                  <div style={{ marginTop: '8px' }}>
                    <span style={{ background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>
                      OEM Part
                    </span>
                  </div>
                )}
              </div>
            )}

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Quantity *
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  backgroundColor: '#fff'
                }}
                required
              />
              {selectedItem && quantity > selectedItem.currentStock && (
                <p style={{ color: '#f59e0b', fontSize: '12px', marginTop: '4px' }}>
                  <i className="bx bx-info-circle"></i> Quantity exceeds current stock
                </p>
              )}
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Source *
              </label>
              <div style={{ display: 'flex', gap: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    value="INVENTORY"
                    checked={source === 'INVENTORY'}
                    onChange={(e) => setSource(e.target.value as 'INVENTORY')}
                    style={{ marginRight: '8px' }}
                  />
                  <span style={{ fontSize: '14px', color: '#374151' }}>Inventory</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    value="EXTERNAL"
                    checked={source === 'EXTERNAL'}
                    onChange={(e) => setSource(e.target.value as 'EXTERNAL')}
                    style={{ marginRight: '8px' }}
                  />
                  <span style={{ fontSize: '14px', color: '#374151' }}>External</span>
                </label>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Additional description (optional)"
                rows={3}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  resize: 'vertical'
                }}
              />
            </div>

            {selectedItem && (
              <div style={{
                backgroundColor: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: '6px',
                padding: '12px',
                marginBottom: '20px',
                fontSize: '14px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#1e40af', fontWeight: '600' }}>Estimated Total:</span>
                  <span style={{ color: '#1e40af', fontWeight: '700', fontSize: '16px' }}>
                    LKR {(selectedItem.unitPrice * quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
              <button
                type="button"
                onClick={onClose}
                className="btn btn--secondary"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn--primary"
                disabled={isSubmitting}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                {isSubmitting ? (
                  <>
                    <i className="bx bx-loader-alt bx-spin"></i>
                    Adding...
                  </>
                ) : (
                  <>
                    <i className="bx bx-plus"></i>
                    Add Part
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPartToWorkOrderModal;
