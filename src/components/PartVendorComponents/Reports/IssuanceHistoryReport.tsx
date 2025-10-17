// // src/components/reports/IssuanceHistoryReport.tsx
// import React from 'react';
// import { FileText, Calendar, Download, FileSpreadsheet, User, Package } from 'lucide-react';
// import './IssuanceHistoryReport.scss';

// export interface IssuedPart {
//   id: string;
//   sku?: string;
//   name: string;
//   imageUrl?: string;
//   qty: number;
//   notes?: string;
//   price?: number;
// }

// export interface Issuance {
//   id: string;
//   issuanceNumber: string;
//   dateIssued: string;
//   technicianName: string;
//   recipient?: string;
//   quantity: number;
//   parts: IssuedPart[];
//   notes?: string;
//   issuedBy?: string;
//   serviceJob?: string;
//   carDetails?: string;
// }

// interface IssuanceHistoryReportProps {
//   issuances: Issuance[];
//   dateFrom?: string;
//   dateTo?: string;
// }

// export const IssuanceHistoryReport: React.FC<IssuanceHistoryReportProps> = ({ 
//   issuances, 
//   dateFrom, 
//   dateTo 
// }) => {
//   const filteredIssuances = issuances.filter(issuance => {
//     const issueDate = new Date(issuance.dateIssued);
//     const fromDate = dateFrom ? new Date(dateFrom) : null;
//     const toDate = dateTo ? new Date(dateTo) : null;
    
//     if (fromDate && issueDate < fromDate) return false;
//     if (toDate && issueDate > toDate) return false;
//     return true;
//   });

//   const handleExportPDF = () => {
//     console.log('Export Issuance History to PDF');
//   };

//   const handleExportExcel = () => {
//     console.log('Export Issuance History to Excel');
//   };

//   const getTotalIssuances = () => filteredIssuances.length;

//   const getTotalPartsIssued = () => {
//     return filteredIssuances.reduce((total, issuance) => {
//       return total + issuance.parts.reduce((sum, part) => sum + part.qty, 0);
//     }, 0);
//   };

//   const getTotalValue = () => {
//     return filteredIssuances.reduce((total, issuance) => {
//       return total + issuance.parts.reduce((sum, part) => {
//         return sum + (part.price || 0) * part.qty;
//       }, 0);
//     }, 0);
//   };

//   const getUniqueTechnicians = () => {
//     return new Set(filteredIssuances.map(issuance => issuance.technicianName)).size;
//   };

//   return (
//     <div className="issuance-history-report">
//       <div className="report-header">
//         <div className="header-left">
//           <div className="report-icon">
//             <FileText size={24} />
//           </div>
//           <div className="header-text">
//             <h2>Issuance History Report</h2>
//             <p>
//               {dateFrom && dateTo 
//                 ? `${new Date(dateFrom).toLocaleDateString()} - ${new Date(dateTo).toLocaleDateString()} - ` 
//                 : ''}
//               {filteredIssuances.length} issuances found
//             </p>
//           </div>
//         </div>
        
//         <div className="export-actions">
//           <button className="export-btn pdf-btn" onClick={handleExportPDF}>
//             <Download size={16} />
//             Export PDF
//           </button>
//           <button className="export-btn excel-btn" onClick={handleExportExcel}>
//             <FileSpreadsheet size={16} />
//             Export Excel
//           </button>
//         </div>
//       </div>

//       <div className="report-summary">
//         <div className="summary-card">
//           <div className="summary-number">{getTotalIssuances()}</div>
//           <div className="summary-label">Total Issuances</div>
//         </div>
//         <div className="summary-card">
//           <div className="summary-number">{getTotalPartsIssued()}</div>
//           <div className="summary-label">Parts Issued</div>
//         </div>
//         <div className="summary-card">
//           <div className="summary-number">${getTotalValue().toFixed(2)}</div>
//           <div className="summary-label">Total Value</div>
//         </div>
//         <div className="summary-card">
//           <div className="summary-number">{getUniqueTechnicians()}</div>
//           <div className="summary-label">Technicians</div>
//         </div>
//       </div>

//       <div className="issuances-table">
//         <div className="table-header">
//           <div className="header-cell">Issuance #</div>
//           <div className="header-cell">Date</div>
//           <div className="header-cell">Technician</div>
//           <div className="header-cell">Recipient</div>
//           <div className="header-cell">Parts</div>
//           <div className="header-cell">Total Qty</div>
//           <div className="header-cell">Value</div>
//           <div className="header-cell">Service Job</div>
//         </div>

//         <div className="table-body">
//           {filteredIssuances.map((issuance) => (
//             <div key={issuance.id} className="table-row">
//               <div className="cell issuance-number">
//                 <span className="number">{issuance.issuanceNumber}</span>
//               </div>
              
//               <div className="cell date-cell">
//                 <div className="date-content">
//                   <Calendar size={14} />
//                   {new Date(issuance.dateIssued).toLocaleDateString()}
//                 </div>
//               </div>
              
//               <div className="cell technician-cell">
//                 <div className="technician-content">
//                   <User size={14} />
//                   {issuance.technicianName}
//                 </div>
//               </div>
              
//               <div className="cell recipient-cell">
//                 {issuance.recipient || 'N/A'}
//               </div>
              
//               <div className="cell parts-cell">
//                 <div className="parts-list">
//                   {issuance.parts.map((part, index) => (
//                     <div key={index} className="part-item">
//                       <Package size={12} />
//                       <span>{part.name} (x{part.qty})</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
              
//               <div className="cell quantity-cell">
//                 <span className="quantity-number">{issuance.quantity}</span>
//               </div>
              
//               <div className="cell value-cell">
//                 <span className="value-amount">
//                   ${issuance.parts.reduce((sum, part) => sum + (part.price || 0) * part.qty, 0).toFixed(2)}
//                 </span>
//               </div>
              
//               <div className="cell service-cell">
//                 {issuance.serviceJob || 'N/A'}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {filteredIssuances.length === 0 && (
//         <div className="empty-state">
//           <FileText size={48} />
//           <h3>No issuances found</h3>
//           <p>
//             {dateFrom && dateTo 
//               ? `No issuances found for the selected date range` 
//               : 'No issuance history available'
//             }
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };


// src/components/reports/IssuanceHistoryReport.tsx
import React, { useState, useEffect } from 'react';
import { FileText, Calendar, Download, FileSpreadsheet, User, Package, Loader } from 'lucide-react';
import './IssuanceHistoryReport.scss';

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

interface IssuanceHistoryReportProps {
  dateFrom?: string;
  dateTo?: string;
}

export const IssuanceHistoryReport: React.FC<IssuanceHistoryReportProps> = ({ 
  dateFrom, 
  dateTo 
}) => {
  const [issuances, setIssuances] = useState<Issuance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch issuances from API
  useEffect(() => {
    fetchIssuances();
  }, [dateFrom, dateTo]);

  const fetchIssuances = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build the API endpoint with filters
      let endpoint = 'http://localhost:3000/api/issuances';
      const params = new URLSearchParams();
      
      if (dateFrom) params.append('dateFrom', dateFrom);
      if (dateTo) params.append('dateTo', dateTo);
      
      if (params.toString()) {
        endpoint += `?${params.toString()}`;
      }

      console.log('Fetching issuances from:', endpoint);
      
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched issuances:', data);
      setIssuances(data);
      
    } catch (err) {
      console.error('Error fetching issuances:', err);
      setError('Failed to load issuance data. Please try again.');
      setIssuances([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    fetchIssuances();
  };

  const handleExportPDF = () => {
    console.log('Export Issuance History to PDF');
  };

  const handleExportExcel = () => {
    console.log('Export Issuance History to Excel');
  };

  // Filter issuances client-side (additional filtering)
  const filteredIssuances = issuances.filter(issuance => {
    const issueDate = new Date(issuance.date_issued);
    const fromDate = dateFrom ? new Date(dateFrom) : null;
    const toDate = dateTo ? new Date(dateTo) : null; // Fixed the variable name
    
    if (fromDate && issueDate < fromDate) return false;
    if (toDate && issueDate > toDate) return false;
    return true;
  });

  const getTotalIssuances = () => filteredIssuances.length;

  const getTotalPartsIssued = () => {
    return filteredIssuances.reduce((total, issuance) => {
      return total + issuance.parts.reduce((sum, part) => sum + part.quantity, 0);
    }, 0);
  };

  const getTotalValue = () => {
    return filteredIssuances.reduce((total, issuance) => {
      return total + issuance.parts.reduce((sum, part) => {
        const price = parseFloat(part.price || '0');
        return sum + (price * part.quantity);
      }, 0);
    }, 0);
  };

  const getUniqueTechnicians = () => {
    return new Set(filteredIssuances.map(issuance => issuance.technician_name)).size;
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="issuance-history-report">
        <div className="report-header">
          <div className="header-left">
            <div className="report-icon">
              <FileText size={24} />
            </div>
            <div className="header-text">
              <h2>Issuance History Report</h2>
              <p>Loading issuance data...</p>
            </div>
          </div>
        </div>
        <div className="loading-state">
          <Loader size={32} className="spinner" />
          <p>Fetching issuance history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="issuance-history-report">
        <div className="report-header">
          <div className="header-left">
            <div className="report-icon">
              <FileText size={24} />
            </div>
            <div className="header-text">
              <h2>Issuance History Report</h2>
              <p>Error loading data</p>
            </div>
          </div>
        </div>
        <div className="error-state">
          <p>{error}</p>
          <button onClick={handleRetry} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="issuance-history-report">
      <div className="report-header">
        <div className="header-left">
          <div className="report-icon">
            <FileText size={24} />
          </div>
          <div className="header-text">
            <h2>Issuance History Report</h2>
            <p>
              {dateFrom && dateTo 
                ? `${formatDate(dateFrom)} - ${formatDate(dateTo)} - ` 
                : ''}
              {filteredIssuances.length} issuances found
            </p>
          </div>
        </div>
        
        <div className="export-actions">
          <button className="export-btn pdf-btn" onClick={handleExportPDF}>
            <Download size={16} />
            Export PDF
          </button>
          <button className="export-btn excel-btn" onClick={handleExportExcel}>
            <FileSpreadsheet size={16} />
            Export Excel
          </button>
          <button className="refresh-btn" onClick={fetchIssuances} title="Refresh data">
            ⟳
          </button>
        </div>
      </div>

      <div className="report-summary">
        <div className="summary-card">
          <div className="summary-number">{getTotalIssuances()}</div>
          <div className="summary-label">Total Issuances</div>
        </div>
        <div className="summary-card">
          <div className="summary-number">{getTotalPartsIssued()}</div>
          <div className="summary-label">Parts Issued</div>
        </div>
        <div className="summary-card">
          <div className="summary-number">LKR {getTotalValue().toFixed(2)}</div>
          <div className="summary-label">Total Value</div>
        </div>
        <div className="summary-card">
          <div className="summary-number">{getUniqueTechnicians()}</div>
          <div className="summary-label">Technicians</div>
        </div>
      </div>

      <div className="issuances-table">
        <div className="table-header">
          <div className="header-cell">Issuance #</div>
          <div className="header-cell">Date</div>
          <div className="header-cell">Technician</div>
          <div className="header-cell">Recipient</div>
          <div className="header-cell">Parts</div>
          <div className="header-cell">Total Qty</div>
          <div className="header-cell">Value</div>
          <div className="header-cell">Service Job</div>
        </div>

        <div className="table-body">
          {filteredIssuances.map((issuance) => (
            <div key={issuance.id} className="table-row">
              <div className="cell issuance-number">
                <span className="number">{issuance.issuance_number}</span>
              </div>
              
              <div className="cell date-cell">
                <div className="date-content">
                  <Calendar size={14} />
                  {formatDate(issuance.date_issued)}
                </div>
              </div>
              
              <div className="cell technician-cell">
                <div className="technician-content">
                  <User size={14} />
                  {issuance.technician_name}
                </div>
              </div>
              
              <div className="cell recipient-cell">
                {issuance.recipient || 'N/A'}
              </div>
              
              <div className="cell parts-cell">
                <div className="parts-list">
                  {issuance.parts.map((part, index) => (
                    <div key={part.id} className="part-item">
                      <Package size={12} />
                      <span>{part.product_name} (x{part.quantity})</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="cell quantity-cell">
                <span className="quantity-number">{issuance.total_quantity}</span>
              </div>
              
              <div className="cell value-cell">
                <span className="value-amount">
                  LKR {issuance.parts.reduce((sum, part) => {
                    const price = parseFloat(part.price || '0');
                    return sum + (price * part.quantity);
                  }, 0).toFixed(2)}
                </span>
              </div>
              
              <div className="cell service-cell">
                {issuance.service_job || 'N/A'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {filteredIssuances.length === 0 && (
        <div className="empty-state">
          <FileText size={48} />
          <h3>No issuances found</h3>
          <p>
            {dateFrom && dateTo 
              ? `No issuances found for the selected date range` 
              : 'No issuance history available'
            }
          </p>
        </div>
      )}
    </div>
  );
};