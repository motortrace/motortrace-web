import React from 'react';
import './ReportTypeCard.scss';
import { FileText, BarChart2, Package, Users } from 'lucide-react';

const reportTypes = [
  {
    id: 'orders',
    name: 'Orders Report',
    description: 'Summary of all placed orders.',
    lastGenerated: '2025-07-10',
    icon: <FileText size={28} strokeWidth={1.5} />,
  },
  {
    id: 'revenue',
    name: 'Revenue Report',
    description: 'Track total earnings and trends.',
    lastGenerated: '2025-07-08',
    icon: <BarChart2 size={28} strokeWidth={1.5} />,
  },
  {
    id: 'inventory',
    name: 'Inventory Report',
    description: 'Monitor product stock levels.',
    lastGenerated: '2025-07-05',
    icon: <Package size={28} strokeWidth={1.5} />,
  },
  {
    id: 'customers',
    name: 'Customer Report',
    description: 'Insights into customer activity.',
    lastGenerated: '2025-07-03',
    icon: <Users size={28} strokeWidth={1.5} />,
  },
];

const ReportTypeCards = () => {
  const handleGenerate = (id: string) => {
    console.log(`Generating report: ${id}`);
  };

  return (
    <div className="report-cards">
      {reportTypes.map((report) => (
        <div key={report.id} className="report-card">
          <div className="report-card__header">
            <div className="report-card__icon">{report.icon}</div>
            <div>
              <h3 className="report-card__title">{report.name}</h3>
              <p className="report-card__desc">{report.description}</p>
            </div>
          </div>

          <div className="report-card__footer">
            <button onClick={() => handleGenerate(report.id)}>Generate</button>
            <span className="report-card__timestamp">
              Last: {report.lastGenerated}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReportTypeCards;
