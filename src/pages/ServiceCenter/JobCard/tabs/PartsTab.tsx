import React from 'react';
import type { PartItem } from '../types/jobCard.types';

interface PartsTabProps {
  partItems: PartItem[];
}

const PartsTab: React.FC<PartsTabProps> = ({ partItems }) => (
  <div>
    <div className="job-card__section-header">
      <h3 className="job-card__section-title">Parts & Materials</h3>
      <div className="job-card__section-actions">
        <button className="btn btn--secondary-emerald">Add Part</button>
        <button className="btn btn--primary">Order Parts</button>
      </div>
    </div>
    <div className="parts-table">
      <table className="parts-table__table">
        <thead className="parts-table__header">
          <tr>
            <th>Part</th>
            <th>Description</th>
            <th>Qty</th>
            <th>Unit Price</th>
            <th>Total</th>
            <th>Availability</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody className="parts-table__body">
          {partItems.map((part) => (
            <tr key={part.id}>
              <td className="parts-table__part">
                <div className="parts-table__part-name">{part.name}</div>
                <div className="parts-table__part-number">{part.partNumber}</div>
              </td>
              <td className="parts-table__description">
                <div className="parts-table__desc-text">{part.description}</div>
                <div className="parts-table__supplier">Supplier: {part.supplier}</div>
              </td>
              <td className="parts-table__quantity">{part.quantity}</td>
              <td className="parts-table__price">${part.unitPrice.toFixed(2)}</td>
              <td className="parts-table__total">${part.totalPrice.toFixed(2)}</td>
              <td className="parts-table__availability">
                <span className={`badge badge--availability-${part.availability}`}>
                  {part.availability.replace('-', ' ')}
                </span>
                {part.expectedDelivery && (
                  <div className="parts-table__eta">ETA: {part.expectedDelivery}</div>
                )}
              </td>
              <td>
                <div className="parts-table__actions">
                  <button className="btn btn--small btn--icon" aria-label="Edit part"><i className='bx bxs-edit'></i></button>
                  <button className="btn btn--small btn--icon btn--danger" aria-label="Remove part"><i className='bx bxs-trash'></i></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default PartsTab;
