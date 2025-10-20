import React from 'react';
import './StockTable.scss';

export interface Product {
  id: string;
  productname: string;
  category: 'Engine & Fluids' | 'Wear & Tear Parts' | 'Exterior & Body Parts' | 'Paints & Coatings' | 'Engine & Drivetrain Components' | 'Electrical Components' | 'Accessories & Add-ons' | 'Tools & Kits',
  // category: string;
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
  mountingfeatures:string;
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

type Column = { key: string; label: string };

interface Props {
  columns: Column[];
  rows: Product[];
  editingId: string | null;
  draftQty: number;
  draftAlert: number;
  setDraftQty: (v: number) => void;
  setDraftAlert: (v: number) => void;
  onEdit: (row: Product) => void;
  onCancelEdit: () => void;
  onSaveEdit: (id: string) => void;
}


const readField = (p: Product, key: string) => {
  const val = (p as any)[key];
  if (val === undefined || val === null) return '—';
  
  // Handle ID field specifically
  if (key === 'id') {
    return String(val); // Convert to string for display
  }
  
  return String(val);
};

const getQty = (p: Product) => {
  return p.quantity ?? p.stock ?? 0;
};
const getQtyAlert = (p: Product) => {
  return p.minquantity ?? p.minquantity ?? 0;
};

const StockTable: React.FC<Props> = ({
  columns,
  rows,
  editingId,
  draftQty,
  draftAlert,
  setDraftQty,
  setDraftAlert,
  onEdit,
  onCancelEdit,
  onSaveEdit
}) => {
  return (
    <div className="stock-table">
      <div className="stock-table__header">
        <div className="stock-table__cell cell--checkbox"><input type="checkbox" /></div>
        {columns.map(col => (
          <div key={col.key} className="stock-table__cell">{col.label}</div>
        ))}
        <div className="stock-table__cell">Qty</div>
        <div className="stock-table__cell">Qty Alert</div>
        <div className="stock-table__cell">Actions</div>
      </div>

      <div className="stock-table__body">
        {rows.length === 0 && (
          <div className="stock-table__empty">No items to display.</div>
        )}

        {rows.map(row => {
          const isEditing = editingId === row.id;
          return (
            <div key={row.id} className="stock-table__row">
              <div className="stock-table__cell cell--checkbox"><input type="checkbox" /></div>

              {columns.map(col => (
                <div key={col.key} className="stock-table__cell">
                  {readField(row, col.key)}
                </div>
              ))}

              <div className="stock-table__cell">
                {isEditing ? (
                  <input
                    type="number"
                    className="inline-input"
                    value={draftQty}
                    onChange={(e) => setDraftQty(Number(e.target.value || 0))}
                  />
                ) : (
                  <span>{getQty(row)}</span>
                )}
              </div>

              <div className="stock-table__cell">
                {isEditing ? (
                  <input
                    type="number"
                    className="inline-input"
                    value={draftAlert}
                    onChange={(e) => setDraftAlert(Number(e.target.value || 0))}
                  />
                ) : (
                  <span>{getQtyAlert(row)}</span>
                )}
              </div>

              <div className="stock-table__cell cell--actions">
                {!isEditing ? (
                  <button className="btn edit" onClick={() => onEdit(row)}>Edit</button>
                ) : (
                  <>
                    <button className="btn save" onClick={() => onSaveEdit(row.id)}>Save</button>
                    <button className="btn cancel" onClick={onCancelEdit}>Cancel</button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StockTable;
