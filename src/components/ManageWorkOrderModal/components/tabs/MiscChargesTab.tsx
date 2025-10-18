import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../hooks/useAuth';
import { workOrderService } from '../../../../services/workOrderService';
import type { WorkOrderMiscCharge, MiscChargeCategory } from '../../types';

interface MiscChargesTabProps {
  workOrderId: string;
}

/**
 * MiscChargesTab Component
 * Displays and manages work order misc charges
 */
const MiscChargesTab: React.FC<MiscChargesTabProps> = ({ workOrderId }) => {
  const { token } = useAuth();
  const [miscCharges, setMiscCharges] = useState<WorkOrderMiscCharge[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCharge, setEditingCharge] = useState<WorkOrderMiscCharge | null>(null);

  // Form state for add/edit modal
  const [formData, setFormData] = useState({
    category: 'OTHER' as MiscChargeCategory,
    description: '',
    unitPrice: 0,
    quantity: 1,
    notes: ''
  });

  const categories: { value: MiscChargeCategory; label: string }[] = [
    { value: 'DIAGNOSTIC', label: 'Diagnostic' },
    { value: 'LABOR', label: 'Labor' },
    { value: 'TOWING', label: 'Towing' },
    { value: 'STORAGE', label: 'Storage' },
    { value: 'DISPOSAL', label: 'Disposal' },
    { value: 'ENVIRONMENTAL', label: 'Environmental' },
    { value: 'ADMIN', label: 'Admin' },
    { value: 'OTHER', label: 'Other' }
  ];

  useEffect(() => {
    if (workOrderId && token) {
      fetchMiscCharges();
    }
  }, [workOrderId, token]);

  /**
   * Fetch misc charges for the work order
   */
  const fetchMiscCharges = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await workOrderService.getMiscCharges(workOrderId);
      // Ensure numeric fields are properly converted
      const processedData = Array.isArray(data) ? data.map(charge => ({
        ...charge,
        unitPrice: Number(charge.unitPrice) || 0,
        quantity: Number(charge.quantity) || 1,
        subtotal: Number(charge.subtotal) || 0
      })) : [];
      setMiscCharges(processedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching misc charges:', err);
      setMiscCharges([]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle form submission for add/edit
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const chargeData = {
        category: formData.category,
        description: formData.description,
        amount: formData.unitPrice,
        quantity: formData.quantity,
        notes: formData.notes || undefined
      };

      if (editingCharge) {
        await workOrderService.updateMiscCharge(editingCharge.id, chargeData);
      } else {
        await workOrderService.createMiscCharge(workOrderId, chargeData);
      }

      await fetchMiscCharges();
      closeModal();
    } catch (err) {
      console.error('Error saving misc charge:', err);
      setError(err instanceof Error ? err.message : 'Failed to save misc charge');
    }
  };

  /**
   * Handle delete misc charge
   */
  const handleDelete = async (chargeId: string) => {
    if (!confirm('Are you sure you want to delete this misc charge?')) return;

    try {
      await workOrderService.deleteMiscCharge(chargeId);
      await fetchMiscCharges();
    } catch (err) {
      console.error('Error deleting misc charge:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete misc charge');
    }
  };

  /**
   * Open add modal
   */
  const openAddModal = () => {
    setFormData({
      category: 'OTHER',
      description: '',
      unitPrice: 0,
      quantity: 1,
      notes: ''
    });
    setEditingCharge(null);
    setShowAddModal(true);
  };

  /**
   * Open edit modal
   */
  const openEditModal = (charge: WorkOrderMiscCharge) => {
    setFormData({
      category: charge.category,
      description: charge.description,
      unitPrice: Number(charge.unitPrice) || 0, // Unit price
      quantity: Number(charge.quantity) || 1,
      notes: charge.notes || ''
    });
    setEditingCharge(charge);
    setShowAddModal(true);
  };

  /**
   * Close modal
   */
  const closeModal = () => {
    setShowAddModal(false);
    setEditingCharge(null);
    setFormData({
      category: 'OTHER',
      description: '',
      amount: 0,
      quantity: 1,
      notes: ''
    });
  };

  /**
   * Calculate total misc charges
   */
  const totalMiscCharges = miscCharges.reduce((sum, charge) => sum + charge.subtotal, 0);

  if (isLoading) {
    return (
      <div className="tab-content" style={{ padding: '40px', textAlign: 'center' }}>
        <i className="bx bx-loader-alt bx-spin" style={{ fontSize: '32px', color: '#6366f1' }}></i>
        <p style={{ marginTop: '16px', color: '#6b7280' }}>Loading misc charges...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tab-content" style={{ padding: '40px', textAlign: 'center' }}>
        <i className="bx bx-error-circle" style={{ fontSize: '32px', color: '#ef4444' }}></i>
        <p style={{ marginTop: '16px', color: '#ef4444' }}>{error}</p>
        <button className="btn btn--secondary" onClick={fetchMiscCharges} style={{ marginTop: '16px' }}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="tab-content" style={{ padding: '24px' }}>
      {/* Header with summary and add button */}
      <div className="misc-charges-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div className="summary" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ fontSize: '18px', fontWeight: '600', color: '#111827' }}>
            Misc Charges
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>
            Total: LKR {(Number(totalMiscCharges) || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
        </div>
        <button
          onClick={openAddModal}
          className="btn btn--primary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <i className="bx bx-plus"></i>
          Add Misc Charge
        </button>
      </div>

      {/* Misc Charges Table */}
      {miscCharges.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <i className="bx bx-plus-circle" style={{ fontSize: '48px', color: '#d1d5db' }}></i>
          <p style={{ marginTop: '16px', color: '#6b7280', fontSize: '16px' }}>No misc charges added yet</p>
          <p style={{ marginTop: '8px', color: '#9ca3af', fontSize: '14px' }}>
            Misc charges will appear here once they are added to this work order
          </p>
        </div>
      ) : (
        <div className="misc-charges-table-container full-width-table">
          <table className="misc-charges-table styled-table" style={{ width: '100%', minWidth: 600, fontSize: 13, borderCollapse: 'collapse', border: '1px solid #e5e7eb', background: '#fff' }}>
            <thead>
              <tr style={{ background: '#f9fafb' }}>
                <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>Category</th>
                <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>Description</th>
                <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>Quantity</th>
                <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>Unit Price</th>
                <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>Subtotal</th>
                <th style={{ padding: '6px 10px', border: '1px solid #e5e7eb' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {miscCharges.map((charge) => (
                <tr key={charge.id}>
                  <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb', textAlign: 'center', verticalAlign: 'middle' }}>
                    <span style={{ fontSize: '12px', fontWeight: '500', color: '#374151', background: '#f3f4f6', padding: '2px 6px', borderRadius: '4px' }}>
                      {categories.find(c => c.value === charge.category)?.label || charge.category}
                    </span>
                  </td>
                  <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb', textAlign: 'left', verticalAlign: 'middle' }}>
                    <div style={{ fontWeight: '500', color: '#111827', marginBottom: '4px' }}>
                      {charge.description}
                    </div>
                    {charge.notes && (
                      <div style={{ fontSize: '12px', color: '#6b7280', fontStyle: 'italic' }}>
                        {charge.notes}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb', textAlign: 'center', verticalAlign: 'middle' }}>
                    {charge.quantity}
                  </td>
                  <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb', textAlign: 'center', verticalAlign: 'middle' }}>
                    LKR {(Number(charge.unitPrice) || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb', textAlign: 'center', verticalAlign: 'middle' }}>
                    <span style={{ fontWeight: '600', color: '#111827' }}>
                      LKR {(Number(charge.subtotal) || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td style={{ padding: '6px 10px', border: '1px solid #e5e7eb', textAlign: 'center', verticalAlign: 'middle' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button
                        onClick={() => openEditModal(charge)}
                        style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, padding: '6px', fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px' }}
                        title="Edit"
                      >
                        <i className="bx bx-edit"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(charge.id)}
                        style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: 6, padding: '6px', fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px' }}
                        title="Delete"
                      >
                        <i className="bx bx-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="modal-content" style={{ background: '#fff', borderRadius: '12px', padding: '24px', width: '500px', maxWidth: '90vw' }}>
            <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
                {editingCharge ? 'Edit Misc Charge' : 'Add Misc Charge'}
              </h3>
              <button
                onClick={closeModal}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#6b7280' }}
              >
                <i className="bx bx-x"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as MiscChargeCategory })}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
                  required
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
                  Description *
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
                    Quantity *
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
                    required
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
                    Unit Price (LKR) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.unitPrice}
                    onChange={(e) => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) || 0 })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px' }}
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: '500', color: '#374151' }}>
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn btn--secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn--primary"
                >
                  {editingCharge ? 'Update' : 'Add'} Charge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MiscChargesTab;