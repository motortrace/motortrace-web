// src/components/reports/CostSummaryReport.tsx
import React from 'react';
import { DollarSign, TrendingUp, Calendar, Download } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
// import { Issuance } from '../../types/Issuance';
import './CostSummaryReport.scss';

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

interface CostSummaryReportProps {
  issuances: Issuance[];
  dateFrom?: string;
  dateTo?: string;
}

interface MonthlyCost {
  month: string;
  cost: number;
  issuances: number;
}

interface CategoryCost {
  category: string;
  cost: number;
  percentage: number;
}

export const CostSummaryReport: React.FC<CostSummaryReportProps> = ({ 
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

  const calculateTotalCost = (): number => {
    return filteredIssuances.reduce((total, issuance) => {
      const issuanceCost = issuance.parts.reduce((sum, part) => {
        return sum + (part.price || 0) * part.qty;
      }, 0);
      return total + issuanceCost;
    }, 0);
  };

  const generateMonthlyCostData = (): MonthlyCost[] => {
    const monthlyData = new Map<string, { cost: number; issuances: number }>();

    filteredIssuances.forEach(issuance => {
      const date = new Date(issuance.dateIssued);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      
      const issuanceCost = issuance.parts.reduce((sum, part) => {
        return sum + (part.price || 0) * part.qty;
      }, 0);

      const existing = monthlyData.get(monthKey) || { cost: 0, issuances: 0 };
      monthlyData.set(monthKey, {
        cost: existing.cost + issuanceCost,
        issuances: existing.issuances + 1
      });
    });

    return Array.from(monthlyData.entries())
      .map(([key, data]) => {
        const [year, month] = key.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1);
        return {
          month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          cost: Math.round(data.cost * 100) / 100,
          issuances: data.issuances
        };
      })
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
  };

  const generateCategoryCostData = (): CategoryCost[] => {
    const categoryData = new Map<string, number>();
    let totalCost = 0;

    filteredIssuances.forEach(issuance => {
      issuance.parts.forEach(part => {
        const category = 'General'; // Map from part data if available
        const partCost = (part.price || 0) * part.qty;
        categoryData.set(category, (categoryData.get(category) || 0) + partCost);
        totalCost += partCost;
      });
    });

    return Array.from(categoryData.entries())
      .map(([category, cost]) => ({
        category,
        cost: Math.round(cost * 100) / 100,
        percentage: Math.round((cost / totalCost) * 100 * 100) / 100
      }))
      .sort((a, b) => b.cost - a.cost);
  };

  const totalCost = calculateTotalCost();
  const monthlyCostData = generateMonthlyCostData();
  const categoryCostData = generateCategoryCostData();
  const averageCostPerIssuance = filteredIssuances.length > 0 ? totalCost / filteredIssuances.length : 0;
  const highestMonthlyCost = Math.max(...monthlyCostData.map(d => d.cost), 0);
  const totalIssuances = filteredIssuances.length;

  const handleExportReport = () => {
    console.log('Export cost summary report');
  };

  return (
    <div className="cost-summary-report">
      <div className="report-header">
        <div className="header-left">
          <div className="report-icon">
            <DollarSign size={24} />
          </div>
          <div className="header-text">
            <h2>Cost Summary Report</h2>
            <p>
              Financial analysis of issued parts
              {dateFrom && ` from ${new Date(dateFrom).toLocaleDateString()}`}
              {dateTo && ` to ${new Date(dateTo).toLocaleDateString()}`}
            </p>
          </div>
        </div>
        
        <button className="export-btn" onClick={handleExportReport}>
          <Download size={16} />
          Export Report
        </button>
      </div>

      <div className="cost-summary-grid">
        <div className="summary-card total-cost">
          <div className="card-icon">
            <DollarSign size={24} />
          </div>
          <div className="card-content">
            <div className="amount">${totalCost.toLocaleString()}</div>
            <div className="label">Total Cost</div>
          </div>
        </div>

        <div className="summary-card avg-cost">
          <div className="card-icon">
            <TrendingUp size={24} />
          </div>
          <div className="card-content">
            <div className="amount">${averageCostPerIssuance.toFixed(2)}</div>
            <div className="label">Avg per Issuance</div>
          </div>
        </div>

        <div className="summary-card highest-month">
          <div className="card-icon">
            <Calendar size={24} />
          </div>
          <div className="card-content">
            <div className="amount">${highestMonthlyCost.toFixed(2)}</div>
            <div className="label">Highest Monthly Cost</div>
          </div>
        </div>

        <div className="summary-card total-issuances">
          <div className="card-icon">
            <Calendar size={24} />
          </div>
          <div className="card-content">
            <div className="amount">{totalIssuances}</div>
            <div className="label">Total Issuances</div>
          </div>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-container monthly-trend">
          <div className="chart-header">
            <h3>Monthly Cost Trend</h3>
            <p>Track spending patterns over time</p>
          </div>
          <div className="chart-content">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyCostData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                  formatter={(value) => [`$${value}`, 'Cost']}
                />
                <Line 
                  type="monotone" 
                  dataKey="cost" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: '#8b5cf6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-container category-breakdown">
          <div className="chart-header">
            <h3>Cost by Category</h3>
            <p>Breakdown of spending by category</p>
          </div>
          <div className="chart-content">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryCostData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis 
                  dataKey="category" 
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                  formatter={(value) => [`$${value}`, 'Cost']}
                />
                <Bar 
                  dataKey="cost" 
                  fill="#8b5cf6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="detailed-breakdown">
        <div className="breakdown-header">
          <h3>Detailed Cost Breakdown</h3>
        </div>
        
        <div className="breakdown-table">
          <div className="table-header">
            <div className="header-cell">Category</div>
            <div className="header-cell">Total Cost</div>
            <div className="header-cell">Percentage</div>
            <div className="header-cell">Trend</div>
          </div>

          <div className="table-body">
            {categoryCostData.map((category, index) => (
              <div key={category.category} className="table-row">
                <div className="cell category-cell">
                  <div className="category-info">
                    <div className="category-name">{category.category}</div>
                  </div>
                </div>
                
                <div className="cell">
                  <span className="cost-amount">${category.cost.toLocaleString()}</span>
                </div>
                
                <div className="cell">
                  <div className="percentage-bar">
                    <div className="bar-fill" style={{ width: `${category.percentage}%` }}></div>
                    <span className="percentage-text">{category.percentage}%</span>
                  </div>
                </div>
                
                <div className="cell">
                  <div className="trend-indicator positive">
                    <TrendingUp size={16} />
                    <span>Stable</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {filteredIssuances.length === 0 && (
        <div className="empty-state">
          <DollarSign size={48} />
          <h3>No cost data available</h3>
          <p>No issuances found for the selected time period</p>
        </div>
      )}
    </div>
  );
};