
// import React, { useMemo, useState } from 'react';
// import './StockLevelPage.scss';
// import StockTabs from './StockTabs';
// import StockToolbar from './StockToolBar';
// import StockTable from './StockTable';

// import { products as PRODUCTS } from '../ProductComponents/ProductDetails/ProductDetails'; 
// import { categoryConfigs } from '../ProductComponents/ProductDetails/categoryConfigs';

// export interface Product {
//   id: string;
//   productname: string;
//   category: 'Engine & Fluids' | 'Wear & Tear Parts' | 'Exterior & Body Parts' | 'Paints & Coatings' | 'Engine & Drivetrain Components' | 'Electrical Components' | 'Accessories & Add-ons' | 'Tools & Kits',
//   subcategory: string;
//   description: string;
//   price: string;
//   rating: number;
//   reviewcount: number;
//   availability: 'In Stock' | 'Low Stock' | 'Out of Stock';
//   image: string;
//   stock: number;
//   compatibility: string;
//   position: string;
//   brand: string;
//   finish: string;
//   material: string;
//   surfaceuse: string;
//   type: string;
//   color: string;
//   volume: string;
//   mountingfeatures:string;
//   colorcode: string;
//   quantity: number;
//   minquantity: number;
//   discounttype: string;
//   discountvalue: number;
//   warranty: string;
//   manufacturer: string;
//   manufactureddate: string;
//   expirydate: string;
//   notes: string;
//   resistance: string;
//   drytime: string;
//   applicationmethod: string;
//   voltage: string;
//   amprating: string;
//   connectortype: string;
// }

// const ITEMS_PER_PAGE = 5;
// type TabKey = 'low' | 'out';

// const StockLevelPage: React.FC = () => {
//   const [tab, setTab] = useState<TabKey>('low');
//   const [selectedCategory, setSelectedCategory] = useState<keyof typeof categoryConfigs>('Engine & Fluids');
//   const [rows, setRows] = useState<Product[]>(PRODUCTS.slice()); // local editable copy
//   const [search, setSearch] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);

//   // Editing state
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [draftQty, setDraftQty] = useState<number>(0);
//   const [draftAlert, setDraftAlert] = useState<number>(0);

//   // Derived lists for filters (if your products have warehouse/store fields)
//   const allCategories = Object.keys(categoryConfigs) as (keyof typeof categoryConfigs)[];
//   const categoryColumns = categoryConfigs[selectedCategory] || [];

//   // FILTER / SEARCH
//   const filteredByCategory = useMemo(() => {
//     const q = search.trim().toLowerCase();
//     return rows.filter((p) => {
//       if (p.category.trim().toLowerCase() !== String(selectedCategory).trim().toLowerCase()) return false;
//       if (!q) return true;
//       // search fields: productName, id, sku, subcategory
//       return (
//         p.productname?.toLowerCase().includes(q) ||
//         p.id?.toLowerCase().includes(q) ||
//         (p.subcategory || '').toLowerCase().includes(q) ||
//         (p.brand || '').toLowerCase().includes(q)
//       );
//     });
//   }, [rows, selectedCategory, search]);

//   // Split into low / out
//   const lowStockRows = useMemo(
//     () => filteredByCategory.filter(p => {
//       const qty = p.quantity ?? p.stock ?? 0;
//       const min = p.minquantity ?? p.minquantity ?? p.minquantity ?? 0;
//       return qty > 0 && qty <= (min || 0);
//     }),
//     [filteredByCategory]
//   );

//   const outOfStockRows = useMemo(
//     () => filteredByCategory.filter(p => {
//       const qty = p.quantity ?? p.stock ?? 0;
//       return qty === 0;
//     }),
//     [filteredByCategory]
//   );

//   const activeRows = tab === 'low' ? lowStockRows : outOfStockRows;

//   // Pagination
//   const totalPages = Math.max(1, Math.ceil(activeRows.length / ITEMS_PER_PAGE));
//   const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
//   const paginatedRows = activeRows.slice(startIdx, startIdx + ITEMS_PER_PAGE);

//   // Edit handlers
//   const beginEdit = (product: Product) => {
//     const qty = product.quantity ?? product.stock ?? 0;
//     const alert = product.minquantity ?? product.minquantity ?? 0;
//     setEditingId(product.id);
//     setDraftQty(qty);
//     setDraftAlert(alert);
//   };

//   const cancelEdit = () => {
//     setEditingId(null);
//   };

//   const saveEdit = (id: string) => {
//     setRows(prev =>
//       prev.map(p => {
//         if (p.id !== id) return p;
//         // prefer quantity/minQuantity fields if present, else update stock/minQuantity
//         const hasQuantity = typeof p.quantity === 'number';
//         const hasMinQuantity = typeof p.minquantity === 'number';
//         const hasLowStockThreshold = typeof p.minquantity === 'number';
//         const hasStock = typeof p.stock === 'number';
//         const updated: Product = { ...p };

//         if (hasQuantity) {
//           updated.quantity = draftQty;
//         } else if (hasStock) {
//           updated.stock = draftQty;
//         } else {
//           // fallback: write to stock
//           updated.stock = draftQty;
//         }

//         if (hasMinQuantity) {
//           updated.minquantity = draftAlert;
//         } else if (hasLowStockThreshold) {
//           updated.minquantity = draftAlert;
//         } else {
//           // fallback: set minQuantity
//           updated.minquantity = draftAlert;
//         }
//         return updated;
//       })
//     );
//     setEditingId(null);
//   };

//   // When category changes, reset page and editing
//   const handleCategoryChange = (cat: keyof typeof categoryConfigs) => {
//     setSelectedCategory(cat);
//     setCurrentPage(1);
//     setEditingId(null);
//   };
  

//   return (
//     <div className="stock-level">
//       <div className="stock-level__header">
//         <div className="stock-level__title-group">
//           <h2 className="stock-level__title">Stock Levels</h2>
//           <p className="stock-level__subtitle">Manage your low and out of stock alerts</p>
//         </div>

//         <div className="stock-level__actions">
//           {/* actions kept minimal here - wire up as needed */}
//           <button className="btn icon">PDF</button>
//           <button className="btn icon">XLS</button>
//           <button className="btn icon">⟳</button>
//           <button className="btn primary">Send Email</button>
//         </div>
//       </div>

//       <StockTabs active={tab} onChange={setTab} />

//       <StockToolbar
//         search={search}
//         onSearch={setSearch}
//         categories={allCategories}
//         selectedCategory={selectedCategory}
//         onCategoryChange={handleCategoryChange}
//       />

//       <StockTable
//         columns={categoryColumns}
//         rows={paginatedRows}
//         editingId={editingId}
//         draftQty={draftQty}
//         draftAlert={draftAlert}
//         setDraftQty={setDraftQty}
//         setDraftAlert={setDraftAlert}
//         onEdit={beginEdit}
//         onCancelEdit={cancelEdit}
//         onSaveEdit={saveEdit}
//       />

//       {/* Pagination */}
//       <div className="stock-level__pagination">
//         <button
//           onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
//           disabled={currentPage === 1}
//           className="stock-level__pagination-btn"
//         >
//           Previous
//         </button>
//         <span className="stock-level__pagination-info">Page {currentPage} of {totalPages}</span>
//         <button
//           onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
//           disabled={currentPage === totalPages}
//           className="stock-level__pagination-btn"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default StockLevelPage;


// StockLevelPage.tsx
import React, { useMemo, useState, useEffect } from 'react';
import './StockLevelPage.scss';
import StockTabs from './StockTabs';
import StockToolbar from './StockToolBar';
import StockTable from './StockTable';
import { categoryConfigs } from '../ProductComponents/ProductDetails/categoryConfigs';

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

  // Derived lists for filters
  const allCategories = Object.keys(categoryConfigs) as (keyof typeof categoryConfigs)[];
  const categoryColumns = categoryConfigs[selectedCategory] || [];

  // FILTER / SEARCH
  const filteredByCategory = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((p) => {
      if (p.category.trim().toLowerCase() !== String(selectedCategory).trim().toLowerCase()) return false;
      if (!q) return true;
      return (
        p.productname?.toLowerCase().includes(q) ||
        p.id?.toLowerCase().includes(q) ||
        (p.subcategory || '').toLowerCase().includes(q) ||
        (p.brand || '').toLowerCase().includes(q)
      );
    });
  }, [rows, selectedCategory, search]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredByCategory.length / ITEMS_PER_PAGE));
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedRows = filteredByCategory.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  // Edit handlers
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

      console.log(updateData.id)

      const response = await fetch(`http://localhost:3000/api/inventory/update/${updateData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
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

  // When category changes, reset page and editing
  const handleCategoryChange = (cat: keyof typeof categoryConfigs) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
    setEditingId(null);
  };

  // Export functions
  const exportToPDF = () => {
    // Implement PDF export logic here
    alert('PDF export functionality would be implemented here');
  };

  const exportToXLS = () => {
    // Implement Excel export logic here
    alert('Excel export functionality would be implemented here');
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