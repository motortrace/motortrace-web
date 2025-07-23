import React, { useRef } from 'react';
import html2pdf from 'html2pdf.js';
import * as XLSX from 'xlsx';
import logo from '../../../../assets/images/autoparts.png'; // adjust path
import './InventorySummaryReportModal.scss';

interface InventoryItem {
  id: string;
  name: string;
  retailValue: number;
  wholesaleValue: number;
  currentStock: number;
  sold: number; // in selected period
  lastRestocked: string; // ISO date string
  potentialRestockDate?: string; // ISO date string or undefined
  daysSinceLastSale: number;
  stockStatus: 'In Stock' | 'Low Stock' | 'Critical Low';
}

interface Props {
  fromDate: string;
  toDate: string;
  onClose: () => void;
}

const sampleInventoryData: InventoryItem[] = [
  {
    id: 'ITM001',
    name: 'Oil Filter',
    retailValue: 2500,
    wholesaleValue: 1800,
    currentStock: 7,
    sold: 15,
    lastRestocked: '2025-07-01',
    potentialRestockDate: '2025-07-25',
    daysSinceLastSale: 7,
    stockStatus: 'Low Stock',
  },
  {
    id: 'ITM002',
    name: 'Brake Pads',
    retailValue: 4500,
    wholesaleValue: 3000,
    currentStock: 20,
    sold: 8,
    lastRestocked: '2025-06-28',
    daysSinceLastSale: 5,
    stockStatus: 'In Stock',
  },
  {
    id: 'ITM003',
    name: 'Spark Plug',
    retailValue: 1500,
    wholesaleValue: 900,
    currentStock: 3,
    sold: 25,
    lastRestocked: '2025-06-25',
    potentialRestockDate: '2025-07-22',
    daysSinceLastSale: 1,
    stockStatus: 'Critical Low',
  },
  {
    id: 'ITM004',
    name: 'Air Filter',
    retailValue: 2000,
    wholesaleValue: 1400,
    currentStock: 12,
    sold: 10,
    lastRestocked: '2025-07-05',
    daysSinceLastSale: 3,
    stockStatus: 'In Stock',
  },
];

const formatCurrency = (num: number) =>
  `LKR ${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const formatDate = (isoDate: string) => new Date(isoDate).toLocaleDateString();

const InventorySummaryReportModal: React.FC<Props> = ({ fromDate, toDate, onClose }) => {
  const printRef = useRef<HTMLDivElement>(null);

  // Totals:
  const totalRetailValue = sampleInventoryData.reduce(
    (sum, item) => sum + item.retailValue * item.currentStock,
    0
  );
  const totalWholesaleValue = sampleInventoryData.reduce(
    (sum, item) => sum + item.wholesaleValue * item.currentStock,
    0
  );
  const totalStock = sampleInventoryData.reduce((sum, item) => sum + item.currentStock, 0);
  const totalSold = sampleInventoryData.reduce((sum, item) => sum + item.sold, 0);

  const handleDownloadPDF = () => {
    if (!printRef.current) return;

    html2pdf()
      .set({
        margin: 0.5,
        filename: `InventorySummary_${fromDate}_to_${toDate}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, scrollY: 0 },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' },
      })
      .from(printRef.current)
      .save();
  };

  const handleDownloadExcel = () => {
    const excelData = sampleInventoryData.map((item) => ({
      'Item ID': item.id,
      'Item Name': item.name,
      'Retail Value (LKR)': item.retailValue,
      'Wholesale Value (LKR)': item.wholesaleValue,
      'Current Stock': item.currentStock,
      'Sold (Selected Period)': item.sold,
      'Last Restocked': formatDate(item.lastRestocked),
      'Potential Restock Date': item.potentialRestockDate ? formatDate(item.potentialRestockDate) : 'N/A',
      'Days Since Last Sale': item.daysSinceLastSale,
      'Stock Status': item.stockStatus,
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Inventory Summary');
    XLSX.writeFile(wb, `InventorySummary_${fromDate}_to_${toDate}.xlsx`);
  };

  return (
    <div className="inventory-summary-report-modal__backdrop">
      <div className="inventory-summary-report-modal" ref={printRef}>
        {/* Header */}
        <div className="modal-header-top">
          <img src={logo} alt="Logo" className="modal-logo" />
          <div className="shop-info">
            <h2>AutoParts HQ</h2>
            <p>Powered by MotorTrace</p>
            <p>789 Service Park, Nugegoda, Sri Lanka</p>
            <p>+94 11 234 5678</p>
            <p>support@motortrace.lk</p>
          </div>
        </div>

        {/* Report Title */}
        <div className="modal-header">
          <h2>Inventory Summary Report</h2>
          <p>
            From <strong>{fromDate}</strong> to <strong>{toDate}</strong>
          </p>
          <p>Total Items: {sampleInventoryData.length}</p>
        </div>

        {/* Summary Totals
        <div className="modal-summary-totals">
          <p>
            <strong>Total Retail Value:</strong> {formatCurrency(totalRetailValue)}
          </p>
          <p>
            <strong>Total Wholesale Value:</strong> {formatCurrency(totalWholesaleValue)}
          </p>
          <p>
            <strong>Total Current Stock:</strong> {totalStock}
          </p>
          <p>
            <strong>Total Sold in Period:</strong> {totalSold}
          </p>
        </div> */}

        {/* Table */}
        <div className="modal-table-section">
          <table>
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Retail Value</th>
                <th>Wholesale Value</th>
                <th>Current Stock</th>
                <th>Sold (Period)</th>
                <th>Last Restocked</th>
                <th>Potential Restock Date</th>
                <th>Days Since Last Sale</th>
                <th>Stock Status</th>
              </tr>
            </thead>
            <tbody>
              {sampleInventoryData.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{formatCurrency(item.retailValue)}</td>
                  <td>{formatCurrency(item.wholesaleValue)}</td>
                  <td>{item.currentStock}</td>
                  <td>{item.sold}</td>
                  <td>{formatDate(item.lastRestocked)}</td>
                  <td>{item.potentialRestockDate ? formatDate(item.potentialRestockDate) : 'N/A'}</td>
                  <td>{item.daysSinceLastSale}</td>
                  <td
                    className={`stock-status ${
                      item.stockStatus.toLowerCase().replace(' ', '-')
                    }`}
                    style={{
                      color:
                        item.stockStatus === 'Critical Low'
                          ? '#dc2626'
                          : item.stockStatus === 'Low Stock'
                          ? '#f59e0b'
                          : '#10b981',
                      fontWeight: '600',
                    }}
                  >
                    {item.stockStatus}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <hr />
          <p>
            This report was system-generated using <strong>MotorTrace</strong> on{' '}
            {new Date().toLocaleString()}.
            <br />
            For inquiries, contact us at{' '}
            <a href="mailto:support@motortrace.lk">support@motortrace.lk</a> or call +94 11 234 5678.
          </p>
        </div>

        {/* Actions */}
        <div className="modal-actions">
          <button onClick={onClose}>Close</button>
          <button className="dark-button" onClick={handleDownloadPDF}>
            Export as PDF
          </button>
          <button className="dark-button" onClick={handleDownloadExcel}>
            Export as Excel
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventorySummaryReportModal;
