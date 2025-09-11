// src/components/reports/UsageReport.tsx
import React from 'react';
import { TrendingUp, Package, Calendar, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
// import { Issuance } from '../../types/Issuance';
import './UsageReport.scss';

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
  dateIssued: string; // ISO-like or display date
  technicianName: string;
  recipient?: string; // e.g., workshop/store or customer (used as "To whom")
  quantity: number; // total quantity issued
  parts: IssuedPart[];
  notes?: string;
  issuedBy?: string; // who created the issuance
  serviceJob?: string;
  carDetails?: string;
}

interface UsageReportProps {
  issuances: Issuance[];
  dateFrom?: string;
  dateTo?: string;
}

interface UsageData {
  partName: string;
  totalQuantity: number;
  frequency: number;
  category: string;
  averagePerIssuance: number;
}

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

const COLORS = ['#667eea', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16'];

export const UsageReport: React.FC<UsageReportProps> = ({ 
  issuances, 
  dateFrom, 
  dateTo 
}) => {
  const filteredIssuances = issuances.filter(issuance => {
    const issueDate = new Date(issuance.dateIssued);
    const fromDate = dateFrom ? new Date(dateFrom) : null;
    const toDate = dateTo ? new Date(dateTo) : null;
    
    if (fromDate && issueDate < fromDate) return false;
    if (toDate && issueDate > toDate) return false;
    return true;
  });

  const generateUsageData = (): UsageData[] => {
    const partUsage = new Map<string, { quantity: number; frequency: number; category: string }>();
    
    filteredIssuances.forEach(issuance => {
      issuance.parts.forEach(part => {
        const key = part.name;
        const existing = partUsage.get(key) || { quantity: 0, frequency: 0, category: 'General' };
        partUsage.set(key, {
          quantity: existing.quantity + part.qty,
          frequency: existing.frequency + 1,
          category: existing.category
        });
      });
    });

    return Array.from(partUsage.entries())
      .map(([partName, data]) => ({
        partName,
        totalQuantity: data.quantity,
        frequency: data.frequency,
        category: data.category,
        averagePerIssuance: Math.round((data.quantity / data.frequency) * 100) / 100
      }))
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, 10);
  };

  const generateCategoryData = (): CategoryData[] => {
    const categoryUsage = new Map<string, number>();
    
    filteredIssuances.forEach(issuance => {
      issuance.parts.forEach(part => {
        const category = 'General'; // You can map this from part data if available
        categoryUsage.set(category, (categoryUsage.get(category) || 0) + part.qty);
      });
    });

    return Array.from(categoryUsage.entries())
      .map(([name, value], index) => ({
        name,
        value,
        color: COLORS[index % COLORS.length]
      }))
      .sort((a, b) => b.value - a.value);
  };

  const usageData = generateUsageData();
  const categoryData = generateCategoryData();
  const totalPartsIssued = filteredIssuances.reduce((sum, issuance) => sum + issuance.quantity, 0);
  const totalIssuances = filteredIssuances.length;
  const uniqueParts = new Set(filteredIssuances.flatMap(i => i.parts.map(p => p.name))).size;

  return (
    <div className="usage-report">
      <div className="report-header">
        <div className="header-left">
          <div className="report-icon">
            <TrendingUp size={24} />
          </div>
          <div className="header-text">
            <h2>Parts Usage Report</h2>
            <p>
              Analysis of most frequently issued parts
              {dateFrom && ` from ${new Date(dateFrom).toLocaleDateString()}`}
              {dateTo && ` to ${new Date(dateTo).toLocaleDateString()}`}
            </p>
          </div>
        </div>
      </div>

      <div className="report-summary">
        <div className="summary-card">
          <div className="summary-number">{totalPartsIssued}</div>
          <div className="summary-label">Total Parts Issued</div>
          <div className="summary-icon">
            <Package size={20} />
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-number">{totalIssuances}</div>
          <div className="summary-label">Total Issuances</div>
          <div className="summary-icon">
            <Calendar size={20} />
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-number">{uniqueParts}</div>
          <div className="summary-label">Unique Parts</div>
          <div className="summary-icon">
            <BarChart3 size={20} />
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-number">{totalIssuances > 0 ? Math.round(totalPartsIssued / totalIssuances) : 0}</div>
          <div className="summary-label">Avg Parts Per Issuance</div>
          <div className="summary-icon">
            <TrendingUp size={20} />
          </div>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-container">
          <div className="chart-header">
            <h3>Top 10 Most Used Parts</h3>
            <p>Parts ranked by total quantity issued</p>
          </div>
          <div className="chart-content">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={usageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis 
                  dataKey="partName" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="totalQuantity" fill="#667eea" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-container">
          <div className="chart-header">
            <h3>Usage by Category</h3>
            <p>Distribution of parts issued by category</p>
          </div>
          <div className="chart-content">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                //   label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="detailed-table">
        <div className="table-header">
          <h3>Detailed Usage Analysis</h3>
        </div>
        
        <div className="table-content">
          <div className="table-header-row">
            <div className="header-cell">Part Name</div>
            <div className="header-cell">Total Quantity</div>
            <div className="header-cell">Frequency</div>
            <div className="header-cell">Avg per Issuance</div>
            <div className="header-cell">Usage Trend</div>
          </div>

          <div className="table-body">
            {usageData.map((part, index) => (
              <div key={part.partName} className="table-row">
                <div className="cell">
                  <div className="part-info">
                    <div className="rank">#{index + 1}</div>
                    <div className="part-details">
                      <div className="part-name">{part.partName}</div>
                      <div className="part-category">{part.category}</div>
                    </div>
                  </div>
                </div>
                
                <div className="cell">
                  <span className="quantity-badge">{part.totalQuantity}</span>
                </div>
                
                <div className="cell">
                  <span className="frequency-text">{part.frequency} times</span>
                </div>
                
                <div className="cell">
                  <span className="average-text">{part.averagePerIssuance}</span>
                </div>
                
                <div className="cell">
                  <div className="trend-indicator">
                    <TrendingUp size={16} className="trend-up" />
                    <span>High Demand</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {usageData.length === 0 && (
        <div className="empty-state">
          <TrendingUp size={48} />
          <h3>No usage data available</h3>
          <p>No parts have been issued in the selected time period</p>
        </div>
      )}
    </div>
  );
};