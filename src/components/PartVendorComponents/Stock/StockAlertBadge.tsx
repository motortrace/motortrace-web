import React from "react";
import "./StockAlertBadge.scss";

interface AlertProps {
  quantity: number;
  minQuantity: number;
}

const StockAlertBadge: React.FC<AlertProps> = ({ quantity, minQuantity }) => {
  if (quantity === 0) {
    return <span className="badge out">Out of Stock</span>;
  }
  if (quantity < minQuantity) {
    return <span className="badge low">Low Stock</span>;
  }
  return <span className="badge ok">In Stock</span>;
};

export default StockAlertBadge;
