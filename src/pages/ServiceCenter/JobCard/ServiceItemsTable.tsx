import React from 'react';
import type { ServicePackage } from './types/jobCard.types';

interface ServiceItemsTableProps {
  service: ServicePackage;
  onUpdate: (service: ServicePackage) => void;
}

export const ServiceItemsTable: React.FC<ServiceItemsTableProps> = ({ service }) => (
  <div className="service-package__items-table">
    <table className="parts-table__table">
      <thead className="parts-table__header">
        <tr>
          <th>Type</th>
          <th>Name / Description</th>
          <th>Cost</th>
          <th>Price</th>
          <th>Qty / Hrs</th>
          <th>Amount</th>
          <th>Disc</th>
          <th>Net Amount</th>
          <th>Tax</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody className="parts-table__body">
        {service.lineItems.map(item => (
          <tr key={item.id}>
            <td>{item.type}</td>
            <td>
              <div className="parts-table__part-name">{item.name}</div>
              <div className="parts-table__part-number">{item.description}</div>
            </td>
            <td>${item.cost.toFixed(2)}</td>
            <td>${item.price.toFixed(2)}</td>
            <td>{item.quantity}</td>
            <td>${item.amount.toFixed(2)}</td>
            <td>${item.discount.toFixed(2)}</td>
            <td>${item.netAmount.toFixed(2)}</td>
            <td>
              <input type="checkbox" checked={item.taxable} readOnly />
            </td>
            <td><span className={`badge badge--${item.status.toLowerCase()}`}>{item.status}</span></td>
            <td>
              <div className="parts-table__actions">
                <button className="btn btn--small btn--icon" aria-label="Edit item"><i className='bx bxs-edit'></i></button>
                <button className="btn btn--small btn--icon btn--danger" aria-label="Remove item"><i className='bx bxs-trash'></i></button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
); 