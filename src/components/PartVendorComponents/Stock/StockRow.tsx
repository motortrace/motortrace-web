import React, { useState } from "react";
import StockAlertBadge from "./StockAlertBadge";
import "./StockRow.scss";

interface Product {
  id: number;
  name: string;
  quantity: number;
  minQuantity: number;
}

interface StockRowProps {
  product: Product;
  onUpdate: (id: number, quantity: number, minQuantity: number) => void;
}

const StockRow: React.FC<StockRowProps> = ({ product, onUpdate }) => {
  const [quantity, setQuantity] = useState(product.quantity);
  const [minQuantity, setMinQuantity] = useState(product.minQuantity);

  return (
    <tr className="stock-row">
      <td>{product.name}</td>
      <td>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          onBlur={() => onUpdate(product.id, quantity, minQuantity)}
        />
      </td>
      <td>
        <input
          type="number"
          value={minQuantity}
          onChange={(e) => setMinQuantity(Number(e.target.value))}
          onBlur={() => onUpdate(product.id, quantity, minQuantity)}
        />
      </td>
      <td>
        <StockAlertBadge quantity={quantity} minQuantity={minQuantity} />
      </td>
    </tr>
  );
};

export default StockRow;
