// src/components/reports/ReportModal.tsx
import React, { useState } from 'react';
import { X, Calendar, Filter, BarChart3 } from 'lucide-react';
// import { ReportType, ReportFilter } from '../../pages/ReportsPage';
import './ReportModal.scss';

export type ReportType = 
  | 'low-stock' 
  | 'out-of-stock' 
  | 'issuance-history' 
  | 'parts-usage' 
  | 'cost-summary';

export interface ReportFilter {
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  reportType: ReportType;
}

interface ReportModalProps {
  reportType: ReportType;
  onClose: () => void;
  onGenerate: (filters: ReportFilter) => void;
}

const categories = [
  'All Categories',
  'Engine & Fluids',
  'Wear & Tear Parts',
  'Exterior & Body Parts',
  'Paints & Coatings',
  'Engine & Drivetrain Components',
  'Electrical Components',
  'Accessories & Add-ons',
  'Tools & Kits'
];

const reportTitles = {
  'low-stock': 'Generate Low Stock Report',
  'out-of-stock': 'Generate Out of Stock Report',
  'issuance-history': 'Generate Issuance History Report',
  'parts-usage': 'Generate Parts Usage Report',
  'cost-summary': 'Generate Cost Summary Report'
};

const reportDescriptions = {
  'low-stock': 'Generate a report showing all items below their minimum stock levels',
  'out-of-stock': 'Generate a report of completely unavailable items requiring immediate attention',
  'issuance-history': 'Generate a comprehensive history of all issued parts with recipient details',
  'parts-usage': 'Generate an analysis of most frequently issued parts for demand forecasting',
  'cost-summary': 'Generate a financial summary of issued parts costs for the selected period'
};

export const ReportModal: React.FC<ReportModalProps> = ({ 
  reportType, 
  onClose, 
  onGenerate 
}) => {
  const [filters, setFilters] = useState<ReportFilter>({
    reportType,
    category: 'All Categories',
    dateFrom: '',
    dateTo: ''
  });

  const handleGenerate = () => {
    onGenerate(filters);
  };

  const showCategoryFilter = reportType === 'low-stock' || reportType === 'out-of-stock';
  const showDateFilter = reportType === 'issuance-history' || 
                         reportType === 'parts-usage' || 
                         reportType === 'cost-summary';

  return (
    <div className="report-modal-overlay" onClick={onClose}>
      <div className="report-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="header-content">
            <div className="header-icon">
              <BarChart3 size={24} />
            </div>
            <div className="header-text">
              <h2>{reportTitles[reportType]}</h2>
              <p>{reportDescriptions[reportType]}</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="filters-section">
            <h3>
              <Filter size={16} />
              Report Filters
            </h3>

            {showCategoryFilter && (
              <div className="filter-group">
                <label htmlFor="category">Product Category</label>
                <select
                  id="category"
                  value={filters.category || ''}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {showDateFilter && (
              <div className="date-filters">
                <div className="filter-group">
                  <label htmlFor="dateFrom">
                    <Calendar size={14} />
                    From Date
                  </label>
                  <input
                    type="date"
                    id="dateFrom"
                    value={filters.dateFrom || ''}
                    onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                  />
                </div>

                <div className="filter-group">
                  <label htmlFor="dateTo">
                    <Calendar size={14} />
                    To Date
                  </label>
                  <input
                    type="date"
                    id="dateTo"
                    value={filters.dateTo || ''}
                    onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="report-preview">
            <h4>Report Summary</h4>
            <div className="preview-content">
              <div className="preview-item">
                <span className="label">Report Type:</span>
                <span className="value">{reportTitles[reportType].replace('Generate ', '')}</span>
              </div>
              {showCategoryFilter && (
                <div className="preview-item">
                  <span className="label">Category:</span>
                  <span className="value">{filters.category}</span>
                </div>
              )}
              {showDateFilter && filters.dateFrom && (
                <div className="preview-item">
                  <span className="label">Date Range:</span>
                  <span className="value">
                    {new Date(filters.dateFrom).toLocaleDateString()} - {' '}
                    {filters.dateTo ? new Date(filters.dateTo).toLocaleDateString() : 'Present'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="generate-btn" onClick={handleGenerate}>
            <BarChart3 size={16} />
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
};