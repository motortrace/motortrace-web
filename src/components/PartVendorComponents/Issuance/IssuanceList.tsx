// src/components/IssuanceList/IssuanceList.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './IssuanceList.scss';
import { Eye } from "lucide-react";
import { issuances } from './issuanceData';

export interface IssuedPart {
  id: string;
  sku?: string;
  name: string;
  imageUrl?: string;
  qty: number;
  notes?: string;
}

export interface Issuance {
  id: string;
  issuanceNumber: string;
  dateIssued: string; // ISO-like or display date
  technicianName: string;
  recipient?: string; // e.g., workshop/store or customer (used as "To whom")
  quantity: number; // total quantity issued
  parts: IssuedPart[];
  notes?: string;
  issuedBy?: string; // who created the issuance
}

const ITEMS_PER_PAGE = 6;

const IssuanceList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const totalPages = Math.ceil(issuances.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedIssuances = issuances.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const goToIssuance = (id: string) => {
    // navigate(`/Inventory/Issuance/${id}`);
    navigate(`issuance/${id}`);
  };

  const handleViewDetails = (id: string) => {
    navigate(`/partvendor/issuancedetails/${id}`);
  };

  return (
    <div className="issuance-list">
      <div className="issuance-list__header">
        <h2 className="issuance-list__title">Recent Part Issuances</h2>
      </div>

      <div className="issuance-list__table">
        <div className="issuance-list__table-header">
          <div className="issuance-list__header-cell">Issuance #</div>
          <div className="issuance-list__header-cell">Part(s)</div>
          <div className="issuance-list__header-cell">Date Issued</div>
          <div className="issuance-list__header-cell">Technician</div>
          <div className="issuance-list__header-cell">Qty</div>
          <div className="issuance-list__header-cell">Actions</div>
        </div>

        <div className="issuance-list__table-body">
          {paginatedIssuances.map((itm: Issuance) => (
            <div key={itm.id} className="issuance-list__row">
              <div className="issuance-list__cell" data-label="Issuance #">
                {itm.issuanceNumber}
              </div>

              <div className="issuance-list__cell" data-label="Part(s)">
                <div className="issuance-list__product">
                  <img src={itm.parts[0].imageUrl} alt={itm.parts[0].name} />
                  <div className="issuance-list__product-info">
                    <span className="issuance-list__product-name">{itm.parts[0].name}</span>
                    {itm.parts.length > 1 && (
                      <span className="issuance-list__other-products">
                        +{itm.parts.length - 1} other part{itm.parts.length - 1 > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="issuance-list__cell" data-label="Date Issued">
                {itm.dateIssued}
              </div>

              <div className="issuance-list__cell" data-label="Technician">
                {itm.technicianName}
              </div>

              <div className="issuance-list__cell" data-label="Qty">
                {itm.quantity}
              </div>

              <div className="issuance-list__cell" data-label="Actions">
                <button
                  className="issuance-list__action-btn"
                  title="View Details"
                //   onClick={() => goToIssuance(itm.id)}
                onClick={() => handleViewDetails(itm.id)}
                >
                  <Eye size={18} stroke="#333" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="issuance-list__pagination">
        <button
          className="issuance-list__pagination-btn"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span className="issuance-list__pagination-info">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="issuance-list__pagination-btn"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default IssuanceList;
