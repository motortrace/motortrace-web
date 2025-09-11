// src/components/reports/ReportCards.tsx
import React from 'react';
import { 
  Package, 
  AlertTriangle, 
  FileText, 
  TrendingUp, 
  DollarSign 
} from 'lucide-react';
// import { ReportType } from '../../../pages/PartVendor/ReportPages/ReportPage';
import './ReportCards.scss';

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

interface ReportCardsProps {
  onGenerateReport: (reportType: ReportType) => void;
}

interface ReportCard {
  id: ReportType;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  category: 'Stock' | 'Issuance' | 'Financial';
}

const reportCards: ReportCard[] = [
  {
    id: 'low-stock',
    title: 'Low Stock Report',
    description: 'Items below minimum stock level with export options',
    icon: <AlertTriangle size={24} />,
    color: '#f59e0b',
    category: 'Stock'
  },
  {
    id: 'out-of-stock',
    title: 'Out of Stock Report',
    description: 'Completely unavailable items requiring immediate attention',
    icon: <Package size={24} />,
    color: '#ef4444',
    category: 'Stock'
  },
  {
    id: 'issuance-history',
    title: 'Issuance History',
    description: 'All issued parts with dates, quantities, and recipients',
    icon: <FileText size={24} />,
    color: '#3b82f6',
    category: 'Issuance'
  },
  {
    id: 'parts-usage',
    title: 'Parts Usage Report',
    description: 'Most frequently issued parts for demand forecasting',
    icon: <TrendingUp size={24} />,
    color: '#10b981',
    category: 'Financial'
  },
  {
    id: 'cost-summary',
    title: 'Cost Summary',
    description: 'Total cost of issued parts for selected time period',
    icon: <DollarSign size={24} />,
    color: '#8b5cf6',
    category: 'Financial'
  }
];

export const ReportCards: React.FC<ReportCardsProps> = ({ onGenerateReport }) => {
  const groupedReports = reportCards.reduce((groups, report) => {
    if (!groups[report.category]) {
      groups[report.category] = [];
    }
    groups[report.category].push(report);
    return groups;
  }, {} as Record<string, ReportCard[]>);

  return (
    <div className="report-cards">
      <div className="section-header">
        <h2>Generate Reports</h2>
        <p>Select a report type to generate comprehensive analysis</p>
      </div>

      {Object.entries(groupedReports).map(([category, reports]) => (
        <div key={category} className="report-category">
          <h3 className="category-title">{category} Reports</h3>
          <div className="cards-grid">
            {reports.map((report) => (
              <div 
                key={report.id} 
                className="report-card"
                onClick={() => onGenerateReport(report.id)}
              >
                <div 
                  className="card-icon" 
                  style={{ backgroundColor: `${report.color}20`, color: report.color }}
                >
                  {report.icon}
                </div>
                <div className="card-content">
                  <h4>{report.title}</h4>
                  <p>{report.description}</p>
                </div>
                <button className="generate-btn">
                  Generate
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};