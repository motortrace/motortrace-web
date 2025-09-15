import React, { useMemo, useState, useEffect } from 'react';
import './StockLevelPage.scss';
import StockTabs from './StockTabs';
import StockToolbar from './StockToolBar';
import StockTable from './StockTable';
import { categoryConfigs } from '../ProductComponents/ProductDetails/categoryConfigs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export interface Product {
  id: string;
  productname: string;
  category: 'Engine & Fluids' | 'Wear & Tear Parts' | 'Exterior & Body Parts' | 'Paints & Coatings' | 'Engine & Drivetrain Components' | 'Electrical Components' | 'Accessories & Add-ons' | 'Tools & Kits';
  subcategory: string;
  description: string;
  price: string;
  rating: number;
  reviewcount: number;
  availability: 'In Stock' | 'Low Stock' | 'Out of Stock';
  image: string;
  stock: number;
  compatibility: string;
  position: string;
  brand: string;
  finish: string;
  material: string;
  surfaceuse: string;
  type: string;
  color: string;
  volume: string;
  mountingfeatures: string;
  colorcode: string;
  quantity: number;
  minquantity: number;
  discounttype: string;
  discountvalue: number;
  warranty: string;
  manufacturer: string;
  manufactureddate: string;
  expirydate: string;
  notes: string;
  resistance: string;
  drytime: string;
  applicationmethod: string;
  voltage: string;
  amprating: string;
  connectortype: string;
}

const ITEMS_PER_PAGE = 5;
type TabKey = 'low' | 'out';

const StockLevelPage: React.FC = () => {
  const [tab, setTab] = useState<TabKey>('low');
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof categoryConfigs>('Engine & Fluids');
  const [rows, setRows] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftQty, setDraftQty] = useState<number>(0);
  const [draftAlert, setDraftAlert] = useState<number>(0);

  // Fetch data based on active tab
  useEffect(() => {
    fetchStockData();
  }, [tab]);

  const fetchStockData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const endpoint = tab === 'low' 
        ? 'http://localhost:3000/api/analytics/low-stock'
        : 'http://localhost:3000/api/analytics/out-of-stock';
      
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const products = tab === 'low' ? data.lowStockProducts : data.outOfStockProducts;
      
      setRows(products || []);
    } catch (err) {
      setError('Failed to load stock data');
      console.error('Error fetching stock data:', err);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  const allCategories = Object.keys(categoryConfigs) as (keyof typeof categoryConfigs)[];
  const categoryColumns = categoryConfigs[selectedCategory] || [];

  // const filteredByCategory = useMemo(() => {
  //   const q = search.trim().toLowerCase();
  //   return rows.filter((p) => {
  //     if (p.category.trim().toLowerCase() !== String(selectedCategory).trim().toLowerCase()) return false;
  //     if (!q) return true;
  //     return (
  //       p.productname?.toLowerCase().includes(q) ||
  //       p.id?.toLowerCase().includes(q) ||
  //       (p.subcategory || '').toLowerCase().includes(q) ||
  //       (p.brand || '').toLowerCase().includes(q)
  //     );
  //   });
  // }, [rows, selectedCategory, search]);

  // In StockLevelPage.tsx, update the filteredByCategory useMemo
// const filteredByCategory = useMemo(() => {
//   console.log('Filtering with search:', search, 'category:', selectedCategory);
//   console.log('Total rows:', rows.length);
  
//   const q = search.trim().toLowerCase();
//   const filtered = rows.filter((p) => {
//     // Check if product exists and has required properties
//     if (!p) return false;
    
//     // Category filter
//     if (p.category && selectedCategory) {
//       const productCategory = String(p.category || '').trim().toLowerCase();
//       const selectedCat = String(selectedCategory || '').trim().toLowerCase();
//       if (productCategory !== selectedCat) return false;
//     }
    
//     // Search filter
//     if (q) {
//       const searchableFields = [
//         p.productname || '',
//         p.id || '',
//         p.subcategory || '',
//         p.brand || ''
//       ].map(field => field.toLowerCase());
      
//       return searchableFields.some(field => field.includes(q));
//     }
    
//     return true;
//   });
  
//   console.log('Filtered results:', filtered.length);
//   return filtered;
// }, [rows, selectedCategory, search]);

// Replace the filteredByCategory useMemo with this improved version
const filteredByCategory = useMemo(() => {
  try {
    const q = search.trim().toLowerCase();
    
    return rows.filter((p) => {
      if (!p) return false;
      
      // Category filter - handle case where category might be undefined
      if (p.category && selectedCategory) {
      const productCategory = String(p.category || '').trim().toLowerCase();
      const selectedCat = String(selectedCategory || '').trim().toLowerCase();
      if (productCategory !== selectedCat) return false;
    }
      
      // Search filter
      if (q) {
        const searchText = [
          p.productname || '',
          p.id || '',
          p.subcategory || '',
          p.brand || '',
          p.description || '',
          p.compatibility || '',
          p.position || ''
        ].join(' ').toLowerCase();
        
        return searchText.includes(q);
      }
      
      return true;
    });
  } catch (error) {
    console.error('Error in filtering:', error);
    return rows; // Fallback to all rows if filtering fails
  }
}, [rows, selectedCategory, search]);
  const totalPages = Math.max(1, Math.ceil(filteredByCategory.length / ITEMS_PER_PAGE));
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedRows = filteredByCategory.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const beginEdit = (product: Product) => {
    const qty = product.quantity ?? product.stock ?? 0;
    const alert = product.minquantity ?? 0;
    setEditingId(product.id);
    setDraftQty(qty);
    setDraftAlert(alert);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async (id: string) => {
    try {
      const productToUpdate = rows.find(p => p.id === id);
      if (!productToUpdate) return;

      const updateData = {
        id: id,
        quantity: draftQty,
        minquantity: draftAlert
      };

      const finalData = {
        quantity: updateData.quantity,
        minquantity: updateData.minquantity
      }

      const response = await fetch(`http://localhost:3000/api/inventory/update/${updateData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalData),
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      // Update local state
      setRows(prev =>
        prev.map(p => {
          if (p.id !== id) return p;
          return {
            ...p,
            quantity: draftQty,
            minquantity: draftAlert,
            availability: draftQty === 0 ? 'Out of Stock' : draftQty <= draftAlert ? 'Low Stock' : 'In Stock'
          };
        })
      );
      
      setEditingId(null);
      alert('Product updated successfully!');
      
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product. Please try again.');
    }
  };

  const handleCategoryChange = (cat: keyof typeof categoryConfigs) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
    setEditingId(null);
  };

  const readField = (p: Product, key: string) => {
  const val = (p as any)[key];
  if (val === undefined || val === null) return '—';
  if (key === 'id') return String(val);
  return String(val);
};

  const exportToPDF = () => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(16);
  doc.text(`${tab === 'low' ? 'Low Stock' : 'Out of Stock'} Products - ${selectedCategory}`, 14, 22);
  
  // Prepare table headers
  const headers = [
    ...categoryColumns.map(col => col.label),
    'Quantity',
    'Min Quantity'
  ];
  
  // Prepare table data
  const data = filteredByCategory.map(row => [
    ...categoryColumns.map(col => readField(row, col.key)),
    row.quantity ?? row.stock ?? 0,
    row.minquantity ?? 0
  ]);
  
  // Generate table
  autoTable(doc, {
    head: [headers],
    body: data,
    startY: 30,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [41, 128, 185] }
  });
  
  // Download PDF
  doc.save(`${tab}-stock-${selectedCategory.replace(/\s+/g, '-').toLowerCase()}.pdf`);
};

const exportToXLS = () => {
  // Prepare data for Excel
  const excelData = filteredByCategory.map(row => {
    const rowData: any = {};
    
    // Add category-specific columns
    categoryColumns.forEach(col => {
      rowData[col.label] = readField(row, col.key);
    });
    
    // Add quantity columns
    rowData['Quantity'] = row.quantity ?? row.stock ?? 0;
    rowData['Min Quantity'] = row.minquantity ?? 0;
    
    return rowData;
  });
  
  // Create workbook and worksheet
  const ws = XLSX.utils.json_to_sheet(excelData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, `${tab} Stock`);
  
  // Download Excel file
  XLSX.writeFile(wb, `${tab}-stock-${selectedCategory.replace(/\s+/g, '-').toLowerCase()}.xlsx`);
};

  if (loading) {
    return (
      <div className="stock-level">
        <div className="loading-spinner">Loading stock data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stock-level">
        <div className="error-message">
          {error}
          <button onClick={fetchStockData} className="retry-btn">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="stock-level">
      <div className="stock-level__header">
        <div className="stock-level__title-group">
          <h2 className="stock-level__title">Stock Levels</h2>
          <p className="stock-level__subtitle">Manage your low and out of stock alerts</p>
        </div>

        <div className="stock-level__actions">
          <button className="btn icon" onClick={exportToPDF}>PDF</button>
          <button className="btn icon" onClick={exportToXLS}>XLS</button>
          <button className="btn icon" onClick={fetchStockData}>⟳</button>
        </div>
      </div>

      <StockTabs active={tab} onChange={setTab} />

      <StockToolbar
        search={search}
        onSearch={setSearch}
        categories={allCategories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

      <StockTable
        columns={categoryColumns}
        rows={paginatedRows}
        editingId={editingId}
        draftQty={draftQty}
        draftAlert={draftAlert}
        setDraftQty={setDraftQty}
        setDraftAlert={setDraftAlert}
        onEdit={beginEdit}
        onCancelEdit={cancelEdit}
        onSaveEdit={saveEdit}
      />

      {/* Pagination */}
      <div className="stock-level__pagination">
        <button
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="stock-level__pagination-btn"
        >
          Previous
        </button>
        <span className="stock-level__pagination-info">Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="stock-level__pagination-btn"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default StockLevelPage;