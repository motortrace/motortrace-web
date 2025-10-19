// src/components/reports/UsageReport.tsx
import React, { useState, useEffect } from 'react';
import { TrendingUp, Package, Calendar, BarChart3, Loader } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './UsageReport.scss';

interface UsageData {
  product_id: number;
  product_name: string;
  category: string;
  frequency: number;
  total_quantity: number;
  average_per_issuance: number;
}

interface CategoryData {
  category: string;
  quantity: number;
  percentage: number;
}

// UsageApiResponse was removed because the component normalizes responses dynamically

interface UsageReportProps {
  dateFrom?: string;
  dateTo?: string;
}

const COLORS = ['#667eea', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16'];

export const UsageReport: React.FC<UsageReportProps> = ({ 
  dateFrom, 
  dateTo 
}) => {
  const [usageData, setUsageData] = useState<UsageData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [summary, setSummary] = useState({
    totalPartsIssued: 0,
    totalIssuances: 0,
    uniqueParts: 0,
    averagePartsPerIssuance: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch usage data from API
  useEffect(() => {
    fetchUsageData();
  }, [dateFrom, dateTo]);

  const fetchUsageData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build the API endpoint with filters
      let endpoint = 'http://localhost:3000/inventory/analytics/parts-usage';
      const params = new URLSearchParams();
      
      if (dateFrom) params.append('dateFrom', dateFrom);
      if (dateTo) params.append('dateTo', dateTo);
      
      if (params.toString()) {
        endpoint += `?${params.toString()}`;
      }

      console.log('Fetching usage data from:', endpoint);
      
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const dataRaw = await response.json();
      console.log('Fetched usage data:', dataRaw);

      // Normalize response: accept either raw shape or wrapper { success, data }
      const payload = (dataRaw && dataRaw.data) ? dataRaw.data : dataRaw;

      const topParts = Array.isArray(payload?.topParts) ? payload.topParts : (Array.isArray(payload) ? payload : []);
      const categoryDistribution = Array.isArray(payload?.categoryDistribution) ? payload.categoryDistribution : [];
      const summaryPayload = payload?.summary ?? {};

      // Coerce numeric fields and provide defaults
      const normalizedTopParts: UsageData[] = topParts.map((p: any) => ({
        product_id: p.product_id ?? p.productId ?? p.product_id ?? 0,
        product_name: p.product_name ?? p.productName ?? p.productname ?? '',
        category: p.category ?? '',
        frequency: Number(p.frequency ?? 0),
        total_quantity: Number(p.total_quantity ?? p.totalQuantity ?? 0),
        average_per_issuance: Number(p.average_per_issuance ?? p.averagePerIssuance ?? p.average_per_issuance ?? 0)
      }));

      const normalizedCategoryData: CategoryData[] = categoryDistribution.map((c: any) => ({
        category: c.category ?? c.name ?? 'Unknown',
        quantity: Number(c.quantity ?? 0),
        percentage: Number(c.percentage ?? 0)
      }));

      const normalizedSummary = {
        totalPartsIssued: Number(summaryPayload.totalPartsIssued ?? summaryPayload.total_parts_issued ?? 0),
        totalIssuances: Number(summaryPayload.totalIssuances ?? summaryPayload.total_issuances ?? 0),
        uniqueParts: Number(summaryPayload.uniqueParts ?? summaryPayload.unique_parts ?? 0),
        averagePartsPerIssuance: Number(summaryPayload.averagePartsPerIssuance ?? summaryPayload.average_parts_per_issuance ?? 0)
      };

      setUsageData(normalizedTopParts);
      setCategoryData(normalizedCategoryData);
      setSummary(normalizedSummary);
      
    } catch (err) {
      console.error('Error fetching usage data:', err);
      setError('Failed to load usage data. Please try again.');
      setUsageData([]);
      setCategoryData([]);
      setSummary({
        totalPartsIssued: 0,
        totalIssuances: 0,
        uniqueParts: 0,
        averagePartsPerIssuance: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    fetchUsageData();
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
      <div className="usage-report">
        <div className="report-header">
          <div className="header-left">
            <div className="report-icon">
              <TrendingUp size={24} />
            </div>
            <div className="header-text">
              <h2>Parts Usage Report</h2>
              <p>Loading usage data...</p>
            </div>
          </div>
        </div>
        <div className="loading-state">
          <Loader size={32} className="spinner" />
          <p>Analyzing parts usage patterns...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="usage-report">
        <div className="report-header">
          <div className="header-left">
            <div className="report-icon">
              <TrendingUp size={24} />
            </div>
            <div className="header-text">
              <h2>Parts Usage Report</h2>
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
              {dateFrom && ` from ${formatDate(dateFrom)}`}
              {dateTo && ` to ${formatDate(dateTo)}`}
            </p>
          </div>
        </div>
        <div className="header-actions">
          <button className="refresh-btn" onClick={fetchUsageData} title="Refresh data">
            ⟳
          </button>
        </div>
      </div>

      <div className="report-summary">
        <div className="summary-card">
          <div className="summary-number">{summary.totalPartsIssued}</div>
          <div className="summary-label">Total Parts Issued</div>
          <div className="summary-icon">
            <Package size={20} />
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-number">{summary.totalIssuances}</div>
          <div className="summary-label">Total Issuances</div>
          <div className="summary-icon">
            <Calendar size={20} />
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-number">{summary.uniqueParts}</div>
          <div className="summary-label">Unique Parts</div>
          <div className="summary-icon">
            <BarChart3 size={20} />
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-number">
            {summary.averagePartsPerIssuance.toFixed(1)}
          </div>
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
                  dataKey="product_name" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value) => [`${value} units`, 'Quantity']}
                  labelFormatter={(label) => `Part: ${label}`}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="total_quantity" fill="#667eea" radius={[4, 4, 0, 0]} />
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
                  dataKey="quantity"
                  label={({ category, quantity }) => `${category}: ${quantity}`}
                >
                  {categoryData.map((_, i) => (
                    <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} units`, 'Quantity']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="detailed-table">
        <div className="table-header">
          <h3>Detailed Usage Analysis</h3>
          <p>Top performing parts based on usage frequency and quantity</p>
        </div>
        
        <div className="table-content">
          <div className="table-header-row">
            <div className="header-cell">Part Name</div>
            <div className="header-cell">Category</div>
            <div className="header-cell">Total Quantity</div>
            <div className="header-cell">Frequency</div>
            <div className="header-cell">Avg per Issuance</div>
            <div className="header-cell">Demand Level</div>
          </div>

          <div className="table-body">
            {usageData.map((part, index) => {
              const demandLevel = part.total_quantity > 50 ? 'High' : part.total_quantity > 20 ? 'Medium' : 'Low';
              const demandColor = part.total_quantity > 50 ? '#ef4444' : part.total_quantity > 20 ? '#f59e0b' : '#10b981';
              
              return (
                <div key={part.product_id} className="table-row">
                  <div className="cell">
                    <div className="part-info">
                      <div className="rank">#{index + 1}</div>
                      <div className="part-details">
                        <div className="part-name">{part.product_name}</div>
                        <div className="part-id">ID: {part.product_id}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="cell">
                    <span className="category-badge">{part.category}</span>
                  </div>
                  
                  <div className="cell">
                    <span className="quantity-badge">{part.total_quantity}</span>
                  </div>
                  
                  <div className="cell">
                    <span className="frequency-text">{part.frequency} times</span>
                  </div>
                  
                  <div className="cell">
                    <span className="average-text">
                      {part.average_per_issuance.toFixed(1)}
                    </span>
                  </div>
                  
                  <div className="cell">
                    <div 
                      className="demand-indicator"
                      style={{ 
                        backgroundColor: `${demandColor}20`,
                        color: demandColor
                      }}
                    >
                      {demandLevel} Demand
                    </div>
                  </div>
                </div>
              );
            })}
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