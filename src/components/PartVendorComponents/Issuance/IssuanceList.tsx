// // src/components/IssuanceList/IssuanceList.tsx
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import './IssuanceList.scss';
// import { Eye } from "lucide-react";
// import { issuances } from './issuanceData';

// export interface IssuedPart {
//   id: string;
//   sku?: string;
//   name: string;
//   imageUrl?: string;
//   qty: number;
//   notes?: string;
// }

// export interface Issuance {
//   id: string;
//   issuanceNumber: string;
//   dateIssued: string; // ISO-like or display date
//   technicianName: string;
//   recipient?: string; // e.g., workshop/store or customer (used as "To whom")
//   quantity: number; // total quantity issued
//   parts: IssuedPart[];
//   notes?: string;
//   issuedBy?: string; // who created the issuance
// }

// const ITEMS_PER_PAGE = 6;

// const IssuanceList: React.FC = () => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const navigate = useNavigate();

//   const totalPages = Math.ceil(issuances.length / ITEMS_PER_PAGE);
//   const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
//   const paginatedIssuances = issuances.slice(startIdx, startIdx + ITEMS_PER_PAGE);

//   const goToIssuance = (id: string) => {
//     // navigate(`/Inventory/Issuance/${id}`);
//     navigate(`issuance/${id}`);
//   };

//   const handleViewDetails = (id: string) => {
//     navigate(`/partvendor/issuancedetails/${id}`);
//   };

//   return (
//     <div className="issuance-list">
//       <div className="issuance-list__header">
//         <h2 className="issuance-list__title">Recent Part Issuances</h2>
//       </div>

//       <div className="issuance-list__table">
//         <div className="issuance-list__table-header">
//           <div className="issuance-list__header-cell">Issuance #</div>
//           <div className="issuance-list__header-cell">Part(s)</div>
//           <div className="issuance-list__header-cell">Date Issued</div>
//           <div className="issuance-list__header-cell">Technician</div>
//           <div className="issuance-list__header-cell">Qty</div>
//           <div className="issuance-list__header-cell">Actions</div>
//         </div>

//         <div className="issuance-list__table-body">
//           {paginatedIssuances.map((itm: Issuance) => (
//             <div key={itm.id} className="issuance-list__row">
//               <div className="issuance-list__cell" data-label="Issuance #">
//                 {itm.issuanceNumber}
//               </div>

//               <div className="issuance-list__cell" data-label="Part(s)">
//                 <div className="issuance-list__product">
//                   <img src={itm.parts[0].imageUrl} alt={itm.parts[0].name} />
//                   <div className="issuance-list__product-info">
//                     <span className="issuance-list__product-name">{itm.parts[0].name}</span>
//                     {itm.parts.length > 1 && (
//                       <span className="issuance-list__other-products">
//                         +{itm.parts.length - 1} other part{itm.parts.length - 1 > 1 ? 's' : ''}
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               <div className="issuance-list__cell" data-label="Date Issued">
//                 {itm.dateIssued}
//               </div>

//               <div className="issuance-list__cell" data-label="Technician">
//                 {itm.technicianName}
//               </div>

//               <div className="issuance-list__cell" data-label="Qty">
//                 {itm.quantity}
//               </div>

//               <div className="issuance-list__cell" data-label="Actions">
//                 <button
//                   className="issuance-list__action-btn"
//                   title="View Details"
//                 //   onClick={() => goToIssuance(itm.id)}
//                 onClick={() => handleViewDetails(itm.id)}
//                 >
//                   <Eye size={18} stroke="#333" />
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="issuance-list__pagination">
//         <button
//           className="issuance-list__pagination-btn"
//           onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//           disabled={currentPage === 1}
//         >
//           Previous
//         </button>
//         <span className="issuance-list__pagination-info">
//           Page {currentPage} of {totalPages}
//         </span>
//         <button
//           className="issuance-list__pagination-btn"
//           onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//           disabled={currentPage === totalPages}
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default IssuanceList;


// src/components/IssuanceList/IssuanceList.tsx
// src/components/IssuanceList/IssuanceList.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './IssuanceList.scss';
import { Eye, Loader } from "lucide-react";

// Updated interfaces to match your API response
export interface IssuedPart {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  notes?: string;
  image?: string;
  price?: string;
}

export interface Issuance {
  id: number;
  issuance_number: string;
  date_issued: string;
  technician_name: string;
  recipient?: string;
  issued_by?: string;
  service_job?: string;
  car_details?: string;
  notes?: string;
  total_quantity: number;
  created_at: string;
  updated_at: string;
  parts: IssuedPart[];
}

const ITEMS_PER_PAGE = 6;

const IssuanceList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [issuances, setIssuances] = useState<Issuance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch issuances from API
  useEffect(() => {
    fetchIssuances();
  }, []);

  const fetchIssuances = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:3000/api/issuances');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setIssuances(data);
    } catch (err) {
      console.error('Error fetching issuances:', err);
      setError('Failed to load issuances. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(issuances.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedIssuances = issuances.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const handleViewDetails = (id: number) => {
    navigate(`/partvendor/issuancedetails/${id}`);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="issuance-list">
        <div className="issuance-list__header">
          <h2 className="issuance-list__title">Recent Part Issuances</h2>
        </div>
        <div className="issuance-list__loading">
          <Loader size={32} className="spinner" />
          <p>Loading issuances...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="issuance-list">
        <div className="issuance-list__header">
          <h2 className="issuance-list__title">Recent Part Issuances</h2>
          <button 
            className="issuance-list__retry-btn"
            onClick={fetchIssuances}
          >
            Retry
          </button>
        </div>
        <div className="issuance-list__error">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="issuance-list">
      <div className="issuance-list__header">
        <h2 className="issuance-list__title">Recent Part Issuances</h2>
        <button 
          className="issuance-list__refresh-btn"
          onClick={fetchIssuances}
          title="Refresh issuances"
        >
          Refresh
        </button>
      </div>

      {issuances.length === 0 ? (
        <div className="issuance-list__empty">
          <p>No issuances found.</p>
        </div>
      ) : (
        <>
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
                    {itm.issuance_number}
                  </div>

                  <div className="issuance-list__cell" data-label="Part(s)">
                    <div className="issuance-list__product">
                      {itm.parts[0]?.image ? (
                        <img 
                          src={itm.parts[0].image} 
                          alt={itm.parts[0].product_name || 'Part image'} 
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="issuance-list__product-placeholder">
                          No Image
                        </div>
                      )}
                      <div className="issuance-list__product-info">
                        <span className="issuance-list__product-name">
                          {itm.parts[0]?.product_name || 'Unknown Part'}
                        </span>
                        {itm.parts.length > 1 && (
                          <span className="issuance-list__other-products">
                            +{itm.parts.length - 1} other part{itm.parts.length - 1 > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="issuance-list__cell" data-label="Date Issued">
                    {formatDate(itm.date_issued)}
                  </div>

                  <div className="issuance-list__cell" data-label="Technician">
                    {itm.technician_name}
                  </div>

                  <div className="issuance-list__cell" data-label="Qty">
                    {itm.total_quantity}
                  </div>

                  <div className="issuance-list__cell" data-label="Actions">
                    <button
                      className="issuance-list__action-btn"
                      title="View Details"
                      onClick={() => handleViewDetails(itm.id)}
                    >
                      <Eye size={18} stroke="#333" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {totalPages > 1 && (
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
          )}
        </>
      )}
    </div>
  );
};

export default IssuanceList;