// src/pages/ReportsPage.tsx
import React, { useState } from 'react';
import { ReportHeader } from '../../../components/PartVendorComponents/Reports/ReportsHeader';
import { ReportCards } from '../../../components/PartVendorComponents/Reports/ReportCard';
import { GeneratedReports } from '../../../components/PartVendorComponents/Reports/GeneratedReports';
import { ReportModal } from '../../../components/PartVendorComponents/Reports/ReportModal';
import {StockReport}  from '../../../components/PartVendorComponents/Reports/StockReport';
import { UsageReport } from '../../../components/PartVendorComponents/Reports/UsageReport';
import { CostSummaryReport } from '../../../components/PartVendorComponents/Reports/CostSummaryReport';
import { IssuanceHistoryReport } from '../../../components/PartVendorComponents/Reports/IssuanceHistoryReport';
// import './ReportsPage.scss';

export type ReportType =
  | 'low-stock'
  | 'out-of-stock'
  | 'issuance-history'
  | 'parts-usage'
  | 'cost-summary';

export interface ReportFilter {
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  reportType: ReportType;
}

export interface Product {
  id: string;
  productName: string;
  category: 'Engine & Fluids' | 'Wear & Tear Parts' | 'Exterior & Body Parts' | 'Paints & Coatings' | 'Engine & Drivetrain Components' | 'Electrical Components' | 'Accessories & Add-ons' | 'Tools & Kits';
  subcategory: string;
  description: string;
  price: string;
  rating: number;
  reviewCount: number;
  availability: 'In Stock' | 'Low Stock' | 'Out of Stock';
  image: string;
  stock: number;
  compatibility: string;
  position: string;
  brand: string;
  finish: string;
  material: string;
  surfaceUse: string;
  type: string;
  color: string;
  volume: string;
  mountingFeatures: string;
  colorCode: string;
  quantity: number;
  minQuantity: number;
  discountType: string;
  discountValue: number;
  warranty: string;
  manufacturer: string;
  manufacturedDate: string;
  expiryDate: string;
  notes: string;
  resistance: string;
  dryTime: string;
  applicationMethod: string;
  voltage: string;
  ampRating: string;
  connectorType: string;
}

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
  dateIssued: string;
  technicianName: string;
  recipient?: string;
  quantity: number;
  parts: IssuedPart[];
  notes?: string;
  issuedBy?: string;
  serviceJob?: string;
  carDetails?: string;
}

export const ReportPage: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<ReportType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // new: store filters received from modal
  const [currentFilters, setCurrentFilters] = useState<ReportFilter | null>(null);
  // new: whether to show the rendered report view
  const [showReport, setShowReport] = useState(false);

  // ---------------------------
  // Hard-coded product data (put your full objects here)
  // ---------------------------
  const products: Product[] = [
    {
      id: 'brake-001',
      productName: 'Premium Brake Pads',
      category: 'Wear & Tear Parts',
      subcategory: 'Brakes',
      description: 'High friction brake pad set',
      price: '45.00',
      rating: 4.5,
      reviewCount: 120,
      availability: 'Low Stock',
      image: '', // StockReport has fallback mapping by id
      stock: 3,
      compatibility: 'Most sedans',
      position: 'A1',
      brand: 'StopMaster',
      finish: 'Matte',
      material: 'Ceramic',
      surfaceUse: '',
      type: 'Brake Pad',
      color: '',
      volume: '',
      mountingFeatures: '',
      colorCode: '',
      quantity: 3,
      minQuantity: 10,
      discountType: 'none',
      discountValue: 0,
      warranty: '6 months',
      manufacturer: 'StopMaster Ltd.',
      manufacturedDate: '',
      expiryDate: '',
      notes: '',
      resistance: '',
      dryTime: '',
      applicationMethod: '',
      voltage: '',
      ampRating: '',
      connectorType: ''
    },
    {
      id: 'tire-001',
      productName: 'All-Season Tires',
      category: 'Wear & Tear Parts',
      subcategory: 'Tires',
      description: 'High-performance all-season tires',
      price: '120.00',
      rating: 4.8,
      reviewCount: 89,
      availability: 'Low Stock',
      image: '',
      stock: 2,
      compatibility: 'Sedans and SUVs',
      position: 'A2',
      brand: 'TireMax',
      finish: '',
      material: 'Rubber',
      surfaceUse: '',
      type: 'Tire',
      color: '',
      volume: '',
      mountingFeatures: '',
      colorCode: '',
      quantity: 2,
      minQuantity: 8,
      discountType: 'none',
      discountValue: 0,
      warranty: '12 months',
      manufacturer: 'TireMax Corp.',
      manufacturedDate: '',
      expiryDate: '',
      notes: '',
      resistance: '',
      dryTime: '',
      applicationMethod: '',
      voltage: '',
      ampRating: '',
      connectorType: ''
    },
    {
      id: 'filter-001',
      productName: 'Air Filter Premium',
      category: 'Wear & Tear Parts',
      subcategory: 'Filters',
      description: 'High-efficiency air filter',
      price: '15.00',
      rating: 4.3,
      reviewCount: 156,
      availability: 'Out of Stock',
      image: '',
      stock: 0,
      compatibility: 'Most vehicles',
      position: 'A3',
      brand: 'FilterPro',
      finish: '',
      material: 'Paper',
      surfaceUse: '',
      type: 'Air Filter',
      color: '',
      volume: '',
      mountingFeatures: '',
      colorCode: '',
      quantity: 0,
      minQuantity: 20,
      discountType: 'none',
      discountValue: 0,
      warranty: '3 months',
      manufacturer: 'FilterPro Inc.',
      manufacturedDate: '',
      expiryDate: '',
      notes: '',
      resistance: '',
      dryTime: '',
      applicationMethod: '',
      voltage: '',
      ampRating: '',
      connectorType: ''
    },
    {
      id: 'wiper-001',
      productName: 'Windshield Wipers',
      category: 'Wear & Tear Parts',
      subcategory: 'Wipers',
      description: 'Premium windshield wiper blades',
      price: '25.00',
      rating: 4.1,
      reviewCount: 67,
      availability: 'Low Stock',
      image: '',
      stock: 4,
      compatibility: 'Universal fit',
      position: 'A4',
      brand: 'WipeClear',
      finish: '',
      material: 'Rubber',
      surfaceUse: '',
      type: 'Wiper Blade',
      color: '',
      volume: '',
      mountingFeatures: '',
      colorCode: '',
      quantity: 4,
      minQuantity: 12,
      discountType: 'none',
      discountValue: 0,
      warranty: '6 months',
      manufacturer: 'WipeClear Ltd.',
      manufacturedDate: '',
      expiryDate: '',
      notes: '',
      resistance: '',
      dryTime: '',
      applicationMethod: '',
      voltage: '',
      ampRating: '',
      connectorType: ''
    },
    {
      id: 'oil-001',
      productName: 'Quartz Engine Oil 5W-30',
      category: 'Engine & Fluids',
      subcategory: 'Engine Oil',
      description: 'Full synthetic motor oil',
      price: '30.00',
      rating: 4.7,
      reviewCount: 260,
      availability: 'In Stock',
      image: '',
      stock: 25,
      compatibility: 'Most petrol engines',
      position: 'B3',
      brand: 'Quartz',
      finish: '',
      material: '',
      surfaceUse: '',
      type: 'Engine Oil',
      color: '',
      volume: '1L',
      mountingFeatures: '',
      colorCode: '',
      quantity: 25,
      minQuantity: 5,
      discountType: 'percent',
      discountValue: 10,
      warranty: '',
      manufacturer: 'OilWorks',
      manufacturedDate: '',
      expiryDate: '',
      notes: '',
      resistance: '',
      dryTime: '',
      applicationMethod: '',
      voltage: '',
      ampRating: '',
      connectorType: ''
    },
    {
      id: 'spark-001',
      productName: 'Spark Plug XLR',
      category: 'Electrical Components',
      subcategory: 'Spark Plug',
      description: 'High-performance spark plug',
      price: '8.50',
      rating: 4.2,
      reviewCount: 90,
      availability: 'Out of Stock',
      image: '',
      stock: 0,
      compatibility: '4-cylinder engines',
      position: 'C4',
      brand: 'Ignite',
      finish: '',
      material: 'Iridium',
      surfaceUse: '',
      type: 'Spark Plug',
      color: '',
      volume: '',
      mountingFeatures: '',
      colorCode: '',
      quantity: 0,
      minQuantity: 15,
      discountType: 'none',
      discountValue: 0,
      warranty: '',
      manufacturer: 'Ignite Co.',
      manufacturedDate: '',
      expiryDate: '',
      notes: '',
      resistance: '',
      dryTime: '',
      applicationMethod: '',
      voltage: '',
      ampRating: '',
      connectorType: ''
    }
    // add additional product objects here as you want
  ];

  // Sample issuance data for issuance history, parts usage, and cost summary reports
  const issuances: Issuance[] = [
    {
      id: '1',
      issuanceNumber: 'ISS-2024-001',
      dateIssued: '2024-01-15',
      technicianName: 'John Smith',
      recipient: 'Workshop A',
      quantity: 3,
      parts: [
        { id: '1', name: 'Engine Oil', qty: 2, price: 25.99 },
        { id: '2', name: 'Brake Pads', qty: 1, price: 45.99 }
      ],
      notes: 'Regular maintenance',
      issuedBy: 'Manager',
      serviceJob: 'Oil Change & Brake Service',
      carDetails: 'Toyota Camry 2020'
    },
    {
      id: '2',
      issuanceNumber: 'ISS-2024-002',
      dateIssued: '2024-01-18',
      technicianName: 'Sarah Johnson',
      recipient: 'Workshop B',
      quantity: 2,
      parts: [
        { id: '3', name: 'Spark Plug', qty: 4, price: 12.99 },
        { id: '4', name: 'Air Filter', qty: 1, price: 18.99 }
      ],
      notes: 'Engine tune-up',
      issuedBy: 'Supervisor',
      serviceJob: 'Engine Tune-up',
      carDetails: 'Honda Civic 2019'
    },
    {
      id: '3',
      issuanceNumber: 'ISS-2024-003',
      dateIssued: '2024-01-22',
      technicianName: 'Mike Wilson',
      recipient: 'Workshop C',
      quantity: 4,
      parts: [
        { id: '5', name: 'Tires', qty: 4, price: 89.99 },
        { id: '6', name: 'Wipers', qty: 2, price: 15.99 }
      ],
      notes: 'Full tire replacement',
      issuedBy: 'Manager',
      serviceJob: 'Tire Replacement',
      carDetails: 'Ford Focus 2021'
    },
    {
      id: '4',
      issuanceNumber: 'ISS-2024-004',
      dateIssued: '2024-01-25',
      technicianName: 'Emily Davis',
      recipient: 'Workshop A',
      quantity: 1,
      parts: [
        { id: '7', name: 'All-Season Tires', qty: 2, price: 129.99 }
      ],
      notes: 'Premium tire upgrade',
      issuedBy: 'Supervisor',
      serviceJob: 'Tire Upgrade',
      carDetails: 'BMW 3 Series 2022'
    },
    {
      id: '5',
      issuanceNumber: 'ISS-2024-005',
      dateIssued: '2024-01-28',
      technicianName: 'David Brown',
      recipient: 'Workshop B',
      quantity: 2,
      parts: [
        { id: '8', name: 'Air Filter Premium', qty: 1, price: 34.99 },
        { id: '9', name: 'Windshield Wipers', qty: 1, price: 22.99 }
      ],
      notes: 'Premium maintenance',
      issuedBy: 'Manager',
      serviceJob: 'Premium Maintenance',
      carDetails: 'Mercedes C-Class 2023'
    }
  ];

  const handleGenerateReport = (reportType: ReportType) => {
    setSelectedReport(reportType);
    setIsModalOpen(true);
    setShowReport(false); // hide any currently displayed report while user picks filters
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedReport(null);
  };

  // called by ReportModal when user clicks "Generate Report"
  const handleReportGenerated = (filters: ReportFilter) => {
    console.log('Report generated with filters:', filters);
    console.log('Available products:', products);
    console.log('Products with low stock:', products.filter(p => p.stock <= p.minQuantity && p.stock > 0));
    console.log('Products out of stock:', products.filter(p => p.stock === 0));
    setCurrentFilters(filters);
    setIsModalOpen(false);
    setShowReport(true);
  };

  const handleBackFromReport = () => {
    setShowReport(false);
    setSelectedReport(null);
    setCurrentFilters(null);
  };

  return (
    <div className="reports-page">
      {/* optional header */}
      {/* <ReportHeader /> */}

      <div className="reports-content">
        {!showReport && (
          <>
            <ReportCards onGenerateReport={handleGenerateReport} />
            <GeneratedReports />
          </>
        )}

        {isModalOpen && selectedReport && (
          <ReportModal
            reportType={selectedReport}
            onClose={handleCloseModal}
            onGenerate={handleReportGenerated}
          />
        )}

        {/* Render the generated report view */}
        {showReport && selectedReport && currentFilters && (
          <div className="report-viewer">
            <div className="viewer-header">
              <button onClick={handleBackFromReport}>← Back</button>
            </div>

            {/* Low-stock / Out-of-stock reports use StockReport */}
            {(selectedReport === 'low-stock' || selectedReport === 'out-of-stock') && (
              <StockReport
                products={products}
                reportType={selectedReport}
                category={currentFilters.category}
              />
            )}

            {/* Issuance History Report */}
            {selectedReport === 'issuance-history' && (
              <IssuanceHistoryReport
                issuances={issuances}
                dateFrom={currentFilters.dateFrom}
                dateTo={currentFilters.dateTo}
              />
            )}

            {/* Parts Usage Report */}
            {selectedReport === 'parts-usage' && (
              <UsageReport
                issuances={issuances}
                dateFrom={currentFilters.dateFrom}
                dateTo={currentFilters.dateTo}
              />
            )}

            {/* Cost Summary Report */}
            {selectedReport === 'cost-summary' && (
              <CostSummaryReport
                issuances={issuances}
                dateFrom={currentFilters.dateFrom}
                dateTo={currentFilters.dateTo}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportPage;
