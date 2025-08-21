// src/components/IssuanceDetails/IssuanceDetails.tsx
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './IssuanceDetails.scss';
import { issuances } from './issuanceData';
import { Printer, Download, ArrowLeft } from 'lucide-react';

const IssuanceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const issuance = issuances.find(i => i.id === id);

  if (!issuance) {
    return (
      <div className="issuance-details">
        <button className="back-btn" onClick={() => navigate(-1)}>Back</button>
        <div className="not-found">Issuance not found.</div>
      </div>
    );
  }

  const handlePrint = () => window.print();
  const handleDownloadPDF = () => {
    // implement PDF export if needed
    console.log('Export PDF');
  };

  return (
    <div className="issuance-details">
      <div className="issuance-details__header">
        <div className="issuance-details__left">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} /> Back
          </button>
          {/* <button onClick={() => navigate(-1)}>Back</button> */}
          <div className="issuance-details__meta">
            <h2>{issuance.issuanceNumber}</h2>
            <div className="muted">Issued on {issuance.dateIssued} • Issued by {issuance.issuedBy || '—'}</div>
          </div>
        </div>

        <div className="issuance-details__actions">
          <button className="btn" onClick={handlePrint}><Printer size={14} /> Print</button>
          <button className="btn" onClick={handleDownloadPDF}><Download size={14} /> Export PDF</button>
        </div>
      </div>

      <div className="issuance-details__body">
        <section className="card">
          <h3>Overview</h3>
          <div className="grid">
            <div><strong>Technician</strong><div>{issuance.technicianName}</div></div>
            <div><strong>Recipient</strong><div>{issuance.recipient || '—'}</div></div>
            <div><strong>Total Qty</strong><div>{issuance.quantity}</div></div>
            <div><strong>Notes</strong><div>{issuance.notes || '—'}</div></div>
          </div>
        </section>

        <section className="card">
          <h3>Parts Issued</h3>
          <div className="parts-list">
            {issuance.parts.map((p) => (
              <div className="part-row" key={p.id}>
                <img src={p.imageUrl} alt={p.name} />
                <div className="part-row__info">
                  <div className="part-row__title">{p.name}</div>
                  <div className="muted small">SKU: {p.sku || '—'}</div>
                  {p.notes && <div className="muted small">Note: {p.notes}</div>}
                </div>
                <div className="part-row__qty">Qty: <strong>{p.qty}</strong></div>
              </div>
            ))}
          </div>
        </section>

        <section className="card">
          <h3>Audit / Actions</h3>
          <div className="grid">
            <div>
              <strong>Recorded by</strong>
              <div>{issuance.issuedBy || 'Inventory Manager'}</div>
            </div>
            <div>
              <strong>Last updated</strong>
              <div>{issuance.dateIssued}</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default IssuanceDetails;
