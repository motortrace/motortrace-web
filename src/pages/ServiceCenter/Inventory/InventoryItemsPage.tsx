import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Table, { type TableColumn } from '../../../components/Table/Table';
import ConfirmationDialog from '../../../components/ConfirmationDialog';
import CreateInventoryItemModal from '../../../components/CreateInventoryItemModal/CreateInventoryItemModal';
import './InventoryItemsPage.scss';

interface InventoryItem {
  id: string;
  name: string;
  sku: string | null;
  partNumber: string | null;
  manufacturer: string | null;
  location: string | null;
  quantity: number;
  minStockLevel: number | null;
  maxStockLevel: number | null;
  reorderPoint: number | null;
  unitPrice: number;
  supplier: string | null;
  supplierPartNumber: string | null;
  core: boolean;
  corePrice: number | null;
  createdAt: string;
  updatedAt: string;
  categoryId: string;
  category: {
    id: string;
    name: string;
  };
  workOrderParts: any[];
}

const InventoryItemsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  useEffect(() => {
    fetchInventoryItems();
  }, []);

  const fetchInventoryItems = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/inventory');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Handle different response formats
      const items = Array.isArray(data) ? data : (data.data || []);
      setInventoryItems(items);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to fetch inventory items');
      setInventoryItems([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Handler for successful item creation
  const handleItemCreated = async () => {
    // Refresh the list
    fetchInventoryItems();
  };

  // Filtering logic
  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.sku && item.sku.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (item.partNumber && item.partNumber.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = filterCategory === 'all' || item.category?.name === filterCategory;

    return matchesSearch && matchesCategory;
  });

  // Unique filter values
  const uniqueCategories = [...new Set(inventoryItems.map(item => item.category?.name).filter(Boolean))];

  const getStockStatus = (item: InventoryItem) => {
    if (item.quantity <= (item.minStockLevel || 0)) return 'low-stock';
    if (item.quantity >= (item.maxStockLevel || 999)) return 'overstock';
    if (item.quantity === 0) return 'out-of-stock';
    return 'in-stock';
  };

  const getStockStatusBadge = (status: string) => {
    const badgeClass = {
      'in-stock': 'status-badge status-in-stock',
      'low-stock': 'status-badge status-low-stock',
      'out-of-stock': 'status-badge status-out-of-stock',
      'overstock': 'status-badge status-overstock'
    }[status];

    const statusText = {
      'in-stock': 'In Stock',
      'low-stock': 'Low Stock',
      'out-of-stock': 'Out of Stock',
      'overstock': 'Overstock'
    }[status];

    return <span className={badgeClass}>{statusText}</span>;
  };

  const columns: TableColumn<InventoryItem>[] = [
    {
      key: 'name',
      label: 'Item Name',
      sortable: true,
      render: (value: any) => (
        <strong>{value}</strong>
      )
    },
    {
      key: 'sku',
      label: 'SKU',
      sortable: true,
      render: (value: any) => (
        <span>{value || 'N/A'}</span>
      )
    },
    {
      key: 'partNumber',
      label: 'Part Number',
      sortable: true,
      render: (value: any) => (
        <span>{value || 'N/A'}</span>
      )
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
      render: (value: any) => (
        <span>{value?.name || 'N/A'}</span>
      )
    },
    {
      key: 'quantity',
      label: 'Quantity',
      sortable: true,
      align: 'center',
      render: (value: any, row: InventoryItem) => (
        <div>
          <div>{value}</div>
          <small>Min: {row.minStockLevel || 0}</small>
        </div>
      )
    },
    {
      key: 'unitPrice',
      label: 'Unit Price',
      sortable: true,
      align: 'right',
      render: (value: any) => (
        <span>LKR {Number(value).toFixed(2)}</span>
      )
    },
    {
      key: 'stockStatus',
      label: 'Status',
      align: 'center',
      render: (_: any, row: InventoryItem) => (
        getStockStatusBadge(getStockStatus(row))
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'center',
      render: (_: any, row: InventoryItem) => (
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          <button className="btn-icon" title="View" onClick={e => { e.stopPropagation(); navigate(`/${location.pathname.split('/')[1]}/inventory-item/${row.id}`); }}>
            <i className='bx bx-show'></i>
          </button>
          <button className="btn-icon" title="Edit" onClick={e => { e.stopPropagation(); /* handle edit */ }}>
            <i className='bx bx-edit'></i>
          </button>
        </div>
      )
    },
  ];

  return (
    <div className="inventory-items-page">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Inventory Items</h1>
          <p className="page-subtitle">Manage inventory items and stock levels</p>
        </div>
        <div className="header-actions">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="category-filter">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Categories</option>
              {uniqueCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <button className="action-btn primary" onClick={() => setIsConfirmDialogOpen(true)}>
            <i className="bx bx-plus"></i>
            Add Item
          </button>
        </div>
      </div>

      <div className="items-table-container">
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div style={{ color: 'red' }}>{error}</div>
        ) : (
          <Table
            columns={columns}
            data={filteredItems}
            onRowClick={(item: InventoryItem) => navigate(`/${location.pathname.split('/')[1]}/inventory-item/${item.id}`)}
            emptyMessage="No inventory items found matching your search criteria."
          />
        )}
      </div>

      {/* Confirmation Dialog for Create Item */}
      <ConfirmationDialog
        isOpen={isConfirmDialogOpen}
        message="Are you sure you want to add a new inventory item?"
        onConfirm={() => {
          setIsConfirmDialogOpen(false);
          setIsCreateModalOpen(true);
        }}
        onCancel={() => {
          setIsConfirmDialogOpen(false);
        }}
      />

      {/* Create Inventory Item Modal */}
      <CreateInventoryItemModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleItemCreated}
      />
    </div>
  );
};

export default InventoryItemsPage;