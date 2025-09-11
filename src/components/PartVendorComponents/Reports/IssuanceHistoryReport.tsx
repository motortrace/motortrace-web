// src/components/reports/IssuanceHistoryReport.tsx
import React from 'react';
import { FileText, Calendar, Download, FileSpreadsheet, User, Package } from 'lucide-react';
import './IssuanceHistoryReport.scss';

export interface IssuedPart {
  id: string;
  sku?: string;
  name: string;
  imageUrl?: string;
  qty: number;
  notes?: string;
  price?: number;
}

export interface Issuance {
  id: string;
  issuanceNumber: string;
  dateIssued: string;
  technicianName: string;
  recipient?: string;
  quantity: number;
  parts: IssuedPart[];
  notes?: string;
  issuedBy?: string;
  serviceJob?: string;
  carDetails?: string;
}

interface IssuanceHistoryReportProps {
  issuances: Issuance[];
  dateFrom?: string;
  dateTo?: string;
}

export const IssuanceHistoryReport: React.FC<IssuanceHistoryReportProps> = ({ 
  issuances, 
  dateFrom, 
  dateTo 
}) => {
  const filteredIssuances = issuances.filter(issuance => {
    const issueDate = new Date(issuance.dateIssued);
    const fromDate = dateFrom ? new Date(dateFrom) : null;
    const toDate = dateTo ? new Date(toDate) : null;
    
    if (fromDate && issueDate < fromDate) return false;
    if (toDate && issueDate > toDate) return false;
    return true;
  });

  const handleExportPDF = () => {
    console.log('Export Issuance History to PDF');
  };

  const handleExportExcel = () => {
    console.log('Export Issuance History to Excel');
  };

  const getTotalIssuances = () => filteredIssuances.length;

  const getTotalPartsIssued = () => {
    return filteredIssuances.reduce((total, issuance) => {
      return total + issuance.parts.reduce((sum, part) => sum + part.qty, 0);
    }, 0);
  };

  const getTotalValue = () => {
    return filteredIssuances.reduce((total, issuance) => {
      return total + issuance.parts.reduce((sum, part) => {
        return sum + (part.price || 0) * part.qty;
      }, 0);
    }, 0);
  };

  const getUniqueTechnicians = () => {
    return new Set(filteredIssuances.map(issuance => issuance.technicianName)).size;
  };

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
                ? `${new Date(dateFrom).toLocaleDateString()} - ${new Date(dateTo).toLocaleDateString()} - ` 
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
          <div className="summary-number">${getTotalValue().toFixed(2)}</div>
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
                <span className="number">{issuance.issuanceNumber}</span>
              </div>
              
              <div className="cell date-cell">
                <div className="date-content">
                  <Calendar size={14} />
                  {new Date(issuance.dateIssued).toLocaleDateString()}
                </div>
              </div>
              
              <div className="cell technician-cell">
                <div className="technician-content">
                  <User size={14} />
                  {issuance.technicianName}
                </div>
              </div>
              
              <div className="cell recipient-cell">
                {issuance.recipient || 'N/A'}
              </div>
              
              <div className="cell parts-cell">
                <div className="parts-list">
                  {issuance.parts.map((part, index) => (
                    <div key={index} className="part-item">
                      <Package size={12} />
                      <span>{part.name} (x{part.qty})</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="cell quantity-cell">
                <span className="quantity-number">{issuance.quantity}</span>
              </div>
              
              <div className="cell value-cell">
                <span className="value-amount">
                  ${issuance.parts.reduce((sum, part) => sum + (part.price || 0) * part.qty, 0).toFixed(2)}
                </span>
              </div>
              
              <div className="cell service-cell">
                {issuance.serviceJob || 'N/A'}
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
