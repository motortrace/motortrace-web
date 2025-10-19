import { useState, useEffect } from 'react';
import Table, { type TableColumn } from '../../components/Table/Table';
import './LaborCatalogPage.scss';
import { laborCatalogService } from '../../services/laborCatalogService';

interface LaborItem {
  id: string;
  code: string;
  name: string;
  description: string;
  estimatedMinutes: number;
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const LaborCatalogPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [laborItems, setLaborItems] = useState<LaborItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getCategoryColor = (category: string) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
    const index = category ? category.split('').reduce((a, b) => a + b.charCodeAt(0), 0) % colors.length : 0;
    return colors[index];
  };

  useEffect(() => {
    setLoading(true);
    laborCatalogService.getCatalog()
      .then(data => {
        setLaborItems(data);
        setLoading(false);
      })
      .catch((err: any) => {
        setError(err.message || 'Failed to fetch labor catalog');
        setLoading(false);
      });
  }, []);

  // Filtering logic
  const filteredLaborItems = laborItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.code.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  // Unique filter values
  const uniqueCategories = [...new Set(laborItems.map(item => item.category).filter(Boolean))];

  const handleUpdate = (laborItem: LaborItem) => {
    // TODO: Implement update functionality
    console.log('Update labor item:', laborItem);
  };

  const handleDelete = (laborItemId: string) => {
    // TODO: Implement delete functionality
    console.log('Delete labor item:', laborItemId);
  };

  const handleCreate = () => {
    // TODO: Implement create functionality
    console.log('Create new labor item');
  };

  const columns: TableColumn<LaborItem>[] = [
    {
      key: 'code',
      label: 'Code',
      sortable: true,
      render: (value: any) => (
        <span style={{ fontFamily: 'monospace', fontWeight: '500' }}>{value}</span>
      )
    },
    {
      key: 'name',
      label: 'Labor Name',
      sortable: true,
      render: (value: any) => (
        <strong>{value}</strong>
      )
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
      align: 'center',
      render: (value: any) => (
        <span className="category-badge" style={{ backgroundColor: getCategoryColor(value) }}>{value || 'N/A'}</span>
      )
    },
    {
      key: 'estimatedMinutes',
      label: 'Duration (min)',
      sortable: true,
      align: 'center',
      render: (value: any) => (
        <span>{value}</span>
      )
    },
    {
      key: 'isActive',
      label: 'Status',
      align: 'center',
      render: (value: any) => (
        <span className={`status-indicator ${value ? 'active' : 'inactive'}`}>
          {value ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'center',
      render: (_: any, row: LaborItem) => (
        <div className="action-buttons">
          <button className="action-btn update-btn" onClick={() => handleUpdate(row)}>
            Update
          </button>
          <button className="action-btn delete-btn" onClick={() => handleDelete(row.id)}>
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="labor-catalog-page">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">Labor Catalog</h1>
          <p className="page-subtitle">Browse and manage labor operations</p>
        </div>
        <div className="header-actions">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search labor items..."
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
          <button className="create-btn" onClick={handleCreate}>
            Create Labor Item
          </button>
        </div>
      </div>

      <div className="labor-table-container">
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div style={{ color: 'red' }}>{error}</div>
        ) : (
          <Table
            columns={columns}
            data={filteredLaborItems}
            emptyMessage="No labor items found matching your search criteria."
          />
        )}
      </div>
    </div>
  );
};

export default LaborCatalogPage;