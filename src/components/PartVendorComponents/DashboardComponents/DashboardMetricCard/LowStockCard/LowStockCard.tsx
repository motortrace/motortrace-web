import React from 'react';
import { PlusCircle } from 'lucide-react';
import './LowStockCard.scss';

interface LowStockItem {
  name: string;
  stockCount: number;
}

interface LowStockCardProps {
  count: number;
  items: LowStockItem[];
}

const LowStockCard: React.FC<LowStockCardProps> = ({ count, items }) => {
  return (
    <div className="low-stock-card">
      <div className="low-stock-card__header">
        <h3 className="low-stock-card__title">Low Stock</h3>
        <span className="low-stock-card__count">{count}</span>
      </div>
      <ul className="low-stock-card__list">
        {items.map((item, index) => (
          <li key={index} className="low-stock-card__item">
            <span>{item.name}</span>
            <div className="low-stock-card__info">
              <span className="badge">{item.stockCount} left</span>
              <PlusCircle size={16} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LowStockCard;
