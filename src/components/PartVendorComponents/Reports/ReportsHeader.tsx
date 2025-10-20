// src/components/reports/ReportHeader.tsx
import React from 'react';
import { FileText, BarChart3 } from 'lucide-react';
import './ReportHeader.scss';

export const ReportHeader: React.FC = () => {
  return (
    <div className="report-header">
      <div className="header-content">
        <div className="header-icon">
          <BarChart3 size={32} />
        </div>
        <div className="header-text">
          <h1>Reports Dashboard</h1>
          <p>Generate comprehensive reports for inventory, issuances, and financial analysis</p>
        </div>
      </div>
      <div className="header-stats">
        <div className="stat-item">
          <FileText size={20} />
          <span>12 Reports Generated</span>
        </div>
      </div>
    </div>
  );
};