// src/components/reports/GeneratedReports.tsx
import React from 'react';
import { Eye, Download, FileText, Calendar } from 'lucide-react';
import './GeneratedReports.scss';

interface GeneratedReport {
  id: string;
  name: string;
  type: string;
  status: 'Completed' | 'Processing' | 'Failed';
  dateGenerated: string;
  category: string;
}

const sampleReports: GeneratedReport[] = [
  {
    id: '1',
    name: 'Low Stock - Engine Parts',
    type: 'Stock Report',
    status: 'Completed',
    dateGenerated: '2025-08-20',
    category: 'Engine & Fluids'
  },
  {
    id: '2',
    name: 'Q3 Issuance History',
    type: 'Issuance Report',
    status: 'Completed',
    dateGenerated: '2025-08-18',
    category: 'All Categories'
  },
  {
    id: '3',
    name: 'August Parts Usage',
    type: 'Usage Report',
    status: 'Completed',
    dateGenerated: '2025-08-15',
    category: 'All Categories'
  },
  {
    id: '4',
    name: 'Cost Summary - July',
    type: 'Financial Report',
    status: 'Completed',
    dateGenerated: '2025-08-10',
    category: 'All Categories'
  }
];

export const GeneratedReports: React.FC = () => {
  const handleView = (reportId: string) => {
    console.log('View report:', reportId);
  };

  const handleDownload = (reportId: string) => {
    console.log('Download report:', reportId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return '#10b981';
      case 'Processing': return '#f59e0b';
      case 'Failed': return '#ef4444';
      default: return '#64748b';
    }
  };

  return (
    <div className="generated-reports">
      <div className="section-header">
        <div className="header-left">
          <h2>Generated Reports</h2>
          <p>Access and download your previously generated reports</p>
        </div>
        <div className="reports-count">
          <FileText size={20} />
          <span>{sampleReports.length} Reports</span>
        </div>
      </div>

      <div className="reports-table">
        <div className="table-header">
          <div className="header-cell">Report Name</div>
          <div className="header-cell">Type</div>
          <div className="header-cell">Status</div>
          <div className="header-cell">Date</div>
          <div className="header-cell">Actions</div>
        </div>

        <div className="table-body">
          {sampleReports.map((report) => (
            <div key={report.id} className="table-row">
              <div className="cell report-name">
                <div className="name-content">
                  <FileText size={16} />
                  <div>
                    <div className="name">{report.name}</div>
                    <div className="category">{report.category}</div>
                  </div>
                </div>
              </div>
              
              <div className="cell">
                <span className="type-badge">{report.type}</span>
              </div>
              
              <div className="cell">
                <span 
                  className="status-badge"
                  style={{ 
                    backgroundColor: `${getStatusColor(report.status)}20`,
                    color: getStatusColor(report.status)
                  }}
                >
                  {report.status}
                </span>
              </div>
              
              <div className="cell">
                <div className="date-content">
                  <Calendar size={14} />
                  <span>{new Date(report.dateGenerated).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="cell actions">
                <button 
                  className="action-btn view-btn"
                  onClick={() => handleView(report.id)}
                >
                  <Eye size={16} />
                  View
                </button>
                <button 
                  className="action-btn download-btn"
                  onClick={() => handleDownload(report.id)}
                >
                  <Download size={16} />
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {sampleReports.length === 0 && (
        <div className="empty-state">
          <FileText size={48} />
          <h3>No reports generated yet</h3>
          <p>Generate your first report using the cards above</p>
        </div>
      )}
    </div>
  );
};