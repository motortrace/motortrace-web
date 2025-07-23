import React, { useState } from 'react';
import DashboardHeader from '../../../layouts/DashboardHeader/DashboardHeader';
import MetricCard from '../../../components/MetricCard/MetricCard';
import Table, { type TableColumn } from '../../../components/Table/Table';
import './PartsInventory.scss';
import InventoryProductDetailsModal from '../../../components/InventoryProductDetailsModal/InventoryProductDetailsModal';
import brakePad from '../../../assets/images/manageInventory.jpg';

interface Part {
  id: string;
  partNumber: string;
  partName: string;
  description: string;
  manufacturer: string;
  partType: string;
  quantityOnHand: number;
  reorderPoint: number;
  maxStock: number;
  costPrice: number;
  retailPrice: number;
  markupPercent: number;
  totalCostValue: number;
  totalRetailValue: number;
  supplier: string;
  supplierPartNumber: string;
  binLocation: string;
  lastPurchased: string;
  lastSold: string;
  averageCost: number;
  laborHours?: number;
  warranty: string;
  vehicleApplication: string;
  stockStatus: 'in-stock' | 'low-stock' | 'out-of-stock' | 'overstock';
  isActive: boolean;
  notes?: string;
}

const getStockStatusBadge = (status: Part['stockStatus']) => {
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

const PartsInventory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPartType, setFilterPartType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSupplier, setFilterSupplier] = useState('all');
  const [showProductModal, setShowProductModal] = useState(false);

  // Sample parts data with realistic auto parts
  const [parts, setParts] = useState<Part[]>([
    {
      id: '1',
      partNumber: 'BRK-PAD-001',
      partName: 'Ceramic Brake Pads - Front',
      description: 'Premium ceramic brake pad set for front axle',
      manufacturer: 'Wagner ThermoQuiet',
      partType: 'Brake Components',
      quantityOnHand: 24,
      reorderPoint: 8,
      maxStock: 50,
      costPrice: 42.50,
      retailPrice: 89.99,
      markupPercent: 111.7,
      totalCostValue: 1020.00,
      totalRetailValue: 2159.76,
      supplier: 'AutoZone Distribution',
      supplierPartNumber: 'WAG-QC914',
      binLocation: 'A1-B2-03',
      lastPurchased: '2024-06-15',
      lastSold: '2024-06-28',
      averageCost: 42.50,
      laborHours: 1.5,
      warranty: '12 months / 12,000 miles',
      vehicleApplication: '2018-2023 Honda Accord',
      stockStatus: 'in-stock',
      isActive: true
    },
    {
      id: '2',
      partNumber: 'OIL-FLT-045',
      partName: 'Premium Oil Filter',
      description: 'High-efficiency oil filter with bypass valve',
      manufacturer: 'Fram Ultra',
      partType: 'Engine Components',
      quantityOnHand: 6,
      reorderPoint: 15,
      maxStock: 48,
      costPrice: 8.75,
      retailPrice: 18.99,
      markupPercent: 117.0,
      totalCostValue: 52.50,
      totalRetailValue: 113.94,
      supplier: 'NAPA Auto Parts',
      supplierPartNumber: 'FRAM-XG7317',
      binLocation: 'B2-C1-12',
      lastPurchased: '2024-06-10',
      lastSold: '2024-06-29',
      averageCost: 8.75,
      laborHours: 0.2,
      warranty: '6 months',
      vehicleApplication: '2019-2024 Toyota Camry 2.5L',
      stockStatus: 'low-stock',
      isActive: true
    },
    {
      id: '3',
      partNumber: 'TIR-AS-225',
      partName: 'All-Season Radial Tire',
      description: '225/65R17 102H All-Season Performance Tire',
      manufacturer: 'Michelin Defender T+H',
      partType: 'Tires & Wheels',
      quantityOnHand: 0,
      reorderPoint: 4,
      maxStock: 16,
      costPrice: 165.00,
      retailPrice: 289.99,
      markupPercent: 75.8,
      totalCostValue: 0,
      totalRetailValue: 0,
      supplier: 'Tire Rack',
      supplierPartNumber: 'MICH-97470',
      binLocation: 'C3-D1-01',
      lastPurchased: '2024-05-28',
      lastSold: '2024-06-25',
      averageCost: 165.00,
      laborHours: 0.5,
      warranty: '60,000 miles',
      vehicleApplication: '2017-2022 Honda CR-V',
      stockStatus: 'out-of-stock',
      isActive: true
    },
    {
      id: '4',
      partNumber: 'BAT-AGM-789',
      partName: 'AGM Car Battery',
      description: 'Group 24F AGM Battery 710 CCA',
      manufacturer: 'Interstate Batteries',
      partType: 'Electrical Components',
      quantityOnHand: 12,
      reorderPoint: 3,
      maxStock: 20,
      costPrice: 89.99,
      retailPrice: 179.99,
      markupPercent: 100.0,
      totalCostValue: 1079.88,
      totalRetailValue: 2159.88,
      supplier: 'Interstate Battery System',
      supplierPartNumber: 'INT-24F-AGM',
      binLocation: 'D1-E2-05',
      lastPurchased: '2024-06-20',
      lastSold: '2024-06-27',
      averageCost: 89.99,
      laborHours: 0.3,
      warranty: '4 years free replacement',
      vehicleApplication: 'Most 2015+ vehicles',
      stockStatus: 'in-stock',
      isActive: true
    },
    {
      id: '5',
      partNumber: 'SPK-PLG-341',
      partName: 'Iridium Spark Plugs (Set of 4)',
      description: 'Long-life iridium spark plug set',
      manufacturer: 'NGK Iridium IX',
      partType: 'Engine Components',
      quantityOnHand: 45,
      reorderPoint: 12,
      maxStock: 24,
      costPrice: 45.00,
      retailPrice: 89.99,
      markupPercent: 100.0,
      totalCostValue: 2025.00,
      totalRetailValue: 4049.55,
      supplier: 'NGK Spark Plugs USA',
      supplierPartNumber: 'NGK-5464-4PK',
      binLocation: 'B1-C2-08',
      lastPurchased: '2024-06-18',
      lastSold: '2024-06-26',
      averageCost: 45.00,
      laborHours: 1.0,
      warranty: '100,000 miles',
      vehicleApplication: '2016-2021 Honda Civic 1.5L Turbo',
      stockStatus: 'overstock',
      isActive: true
    }
  ]);

  // Calculate metrics
  const totalPartsInStock = parts.reduce((sum, part) => sum + part.quantityOnHand, 0);
  const totalCostValue = parts.reduce((sum, part) => sum + part.totalCostValue, 0);
  const totalRetailValue = parts.reduce((sum, part) => sum + part.totalRetailValue, 0);
  const lowStockItems = parts.filter(part => part.stockStatus === 'low-stock').length;
  const outOfStockItems = parts.filter(part => part.stockStatus === 'out-of-stock').length;
  const totalSKUs = parts.length;

  // Filter parts based on search and filters
  const filteredParts = parts.filter(part => {
    const matchesSearch = part.partName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         part.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         part.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         part.vehicleApplication.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPartType = filterPartType === 'all' || part.partType === filterPartType;
    const matchesStatus = filterStatus === 'all' || part.stockStatus === filterStatus;
    const matchesSupplier = filterSupplier === 'all' || part.supplier === filterSupplier;
    
    return matchesSearch && matchesPartType && matchesStatus && matchesSupplier;
  });

  const handleAdjustStock = (partId: string) => {
    console.log('Adjust stock for part:', partId);
  };

  const handleReorderPart = (partId: string) => {
    console.log('Reorder part:', partId);
  };

  const handleViewHistory = (partId: string) => {
    console.log('View history for part:', partId);
  };

  const handleDeletePart = (partId: string) => {
    setParts(parts.filter(p => p.id !== partId));
  };

  const handleManagePart = (partId: string) => {
    console.log('Manage part:', partId);
  };

  const columns: TableColumn<Part>[] = [
    { 
      key: 'partNumber', 
      label: 'Part #', 
      sortable: true,
      render: (value, row) => (
        <div className="part-number-cell">
          <strong>{value}</strong>
          <div className="supplier-part">{row.supplierPartNumber}</div>
        </div>
      )
    },
    { 
      key: 'partName', 
      label: 'Part Name', 
      sortable: true,
      render: (_, row) => (
        <div className="part-info-cell">
          <div className="part-name">{row.partName}</div>
        </div>
      )
    },
    { 
      key: 'manufacturer', 
      label: 'Manufacturer', 
      sortable: true,
      render: (value, row) => (
        <div className="manufacturer-cell">
          <div className="manufacturer">{value}</div>
          <div className="part-type">{row.partType}</div>
        </div>
      )
    },
    { 
      key: 'quantityOnHand', 
      label: 'Qty On Hand', 
      sortable: true, 
      align: 'center',
      render: (value, row) => (
        <div className="quantity-cell">
          <div className="qty-main">{value}</div>
          <div className="qty-info">Min: {row.reorderPoint}</div>
        </div>
      )
    },
    { 
      key: 'retailPrice', 
      label: 'Retail Price', 
      sortable: true, 
      align: 'right', 
      render: (value) => `$${Number(value).toFixed(2)}`
    },
    { 
      key: 'stockStatus', 
      label: 'Stock Status', 
      sortable: true, 
      align: 'center',
      render: (status) => getStockStatusBadge(status as Part['stockStatus'])
    },
    { 
      key: 'actions', 
      label: 'Actions', 
      align: 'center',
      render: (_, row) => (
        <div className="action-buttons-cell">
          <button 
            className="btn-icon" 
            title="Reorder" 
            onClick={() => handleReorderPart(row.id)}
          >
            <i className='bx bx-cart-add'></i>
          </button>
          <button 
            className="btn-icon" 
            title="Manage Part" 
            onClick={() => handleManagePart(row.id)}
          >
            <i className='bx bx-cog'></i>
          </button>
        </div>
      )
    }
  ];

  const uniquePartTypes = [...new Set(parts.map(part => part.partType))];
  const uniqueSuppliers = [...new Set(parts.map(part => part.supplier))];

  return (
    <div className="parts-inventory-page">
      <div className="page-header">
        <div className="page-actions">
          <button className="btn btn--secondary">
            <i className='bx bx-import'></i>
            Import Parts
          </button>
          <button className="btn btn--secondary">
            <i className='bx bx-export'></i>
            Export Report
          </button>
          <button className="btn btn--secondary">
            <i className='bx bx-package'></i>
            Receive Shipment
          </button>
          <button className="btn btn--primary">
            <i className='bx bx-plus'></i>
            Add New Part
          </button>
        </div>
      </div>

      <div className="metric-cards-row">
        <MetricCard
          title="Total SKUs"
          amount={totalSKUs.toLocaleString()}
          change={`${totalPartsInStock} units`}
          changeType="positive"
          period="in inventory"
        />
        {/* <MetricCard
          title="Cost Value"
          amount={`$${totalCostValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          change={`Retail: $${totalRetailValue.toLocaleString()}`}
          changeType="positive"
          period="inventory investment"
        /> */}
        <MetricCard
          title="Low Stock Alerts"
          amount={lowStockItems.toString()}
          change="Requires attention"
          changeType={lowStockItems > 0 ? "negative" : "positive"}
          period="below reorder point"
        />
        <MetricCard
          title="Out of Stock"
          amount={outOfStockItems.toString()}
          change="Lost sales risk"
          changeType={outOfStockItems > 0 ? "negative" : "positive"}
          period="unavailable items"
        />
      </div>

      <div className="inventory-controls">
        <div className="search-filters">
          <div className="search-box">
            <i className='bx bx-search search-icon'></i>
            <input
              type="text"
              placeholder="Search by part name, number, manufacturer, or vehicle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <select
            value={filterPartType}
            onChange={(e) => setFilterPartType(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Part Types</option>
            {uniquePartTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Stock Status</option>
            <option value="in-stock">In Stock</option>
            <option value="low-stock">Low Stock</option>
            <option value="out-of-stock">Out of Stock</option>
            <option value="overstock">Overstock</option>
          </select>
          <select
            value={filterSupplier}
            onChange={(e) => setFilterSupplier(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Suppliers</option>
            {uniqueSuppliers.map(supplier => (
              <option key={supplier} value={supplier}>{supplier}</option>
            ))}
          </select>
        </div>
        <div className="quick-actions">
          <button className="btn btn--ghost">
            <i className='bx bx-filter'></i>
            Advanced Filters
          </button>
          <button className="btn btn--ghost">
            <i className='bx bx-refresh'></i>
            Refresh
          </button>
        </div>
      </div>

      <div className="parts-table-container">
        <Table 
          columns={columns}
          data={filteredParts}
          onRowClick={() => setShowProductModal(true)}
          emptyMessage="No parts found matching your search criteria."
        />
      </div>
      {showProductModal && (
        <InventoryProductDetailsModal
          product={{
            image: brakePad,
            name: 'Ceramic Brake Pads - Front',
            sku: 'BRK-PAD-001',
            brand: 'Wagner ThermoQuiet',
            category: 'Brake Components',
            supplier: 'AutoZone Distribution',
            location: 'A1-B2-03',
            description: 'Premium ceramic brake pad set for front axle. Long-lasting, low dust, and quiet operation. Fits 2018-2023 Honda Accord.',
            price: 8999,
            cost: 4250,
            markup: 111.7,
            stock: 24,
            minStock: 8,
            maxStock: 50,
            reorderPoint: 8,
            status: 'Active',
            lastRestocked: '2024-06-15',
            lastSold: '2024-06-28',
            warranty: '12 months / 12,000 miles',
            vehicleApplication: '2018-2023 Honda Accord',
            notes: 'Best seller. Check compatibility before installation.'
          }}
          onClose={() => setShowProductModal(false)}
        />
      )}
    </div>
  );
};

export default PartsInventory;