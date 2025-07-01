import React from 'react';
import './CartHeader.scss';
import { FaTrashAlt } from 'react-icons/fa';

type CartHeaderProps = {
  totalItems: number;
  onSelectAll: () => void;
  onDeleteSelected: () => void;
  allSelected: boolean;
};

const CartHeader: React.FC<CartHeaderProps> = ({ totalItems, onSelectAll, onDeleteSelected, allSelected }) => {
  return (
    <div className="cart-header">
      <div className="left">
        <input
          type="checkbox"
          checked={allSelected}
          onChange={onSelectAll}
        />
        <span>Select All</span>
      </div>
      <div className="right">
        <span>{totalItems} item{totalItems !== 1 && 's'}</span>
        <button className="delete-btn" onClick={onDeleteSelected}>
          <FaTrashAlt />
          <span>Delete Selected</span>
        </button>
      </div>
    </div>
  );
};

export default CartHeader;
