
// import React from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import './IssuanceDetails.scss';
// import { issuances } from './issuanceData';
// import { Printer, Download, ArrowLeft } from 'lucide-react';

// const IssuanceDetails: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();

//   const issuance = issuances.find(i => i.id === id);

//   if (!issuance) {
//     return (
//       <div className="issuance-details">
//         <button className="back-btn" onClick={() => navigate(-1)}>Back</button>
//         <div className="not-found">Issuance not found.</div>
//       </div>
//     );
//   }

//   const handlePrint = () => window.print();
//   const handleDownloadPDF = () => {
//     console.log('Export PDF');
//   };

//   return (
//     <div className="issuance-details">
//       {/* Header */}
//       <div className="issuance-details__header">
//         <div className="issuance-details__left">
//           <button className="back-btn" onClick={() => navigate(-1)}>
//             <ArrowLeft size={16} /> Back
//           </button>
//           <div className="issuance-details__meta">
//             <h2>{issuance.issuanceNumber}</h2>
//             <div className="muted">Issued on {issuance.dateIssued} • By {issuance.issuedBy || '—'}</div>
//           </div>
//         </div>

//         <div className="issuance-details__actions">
//           <button className="btn" onClick={handlePrint}><Printer size={14} /> Print</button>
//           <button className="btn" onClick={handleDownloadPDF}><Download size={14} /> Export PDF</button>
//         </div>
//       </div>

//       {/* Body */}
//       <div className="issuance-details__body">
//         <section className="card">
//           <h3>Overview</h3>
//           <div className="grid">
//             <div><strong>Technician</strong><div>{issuance.technicianName}</div></div>
//             <div><strong>Service Job</strong><div>{issuance.serviceJob || '—'}</div></div>
//             <div><strong>Car</strong><div>{issuance.carDetails || '—'}</div></div>
//             <div><strong>Date Taken</strong><div>{issuance.dateIssued}</div></div>
//           </div>
//         </section>

//         <section className="card">
//           <h3>Parts Issued</h3>
//           <div className="parts-list">
//             {issuance.parts.map((p) => (
//               <div className="part-row" key={p.id}>
//                 <img src={p.imageUrl} alt={p.name} />
//                 <div className="part-row__info">
//                   <div className="part-row__title">{p.name}</div>
//                   <div className="muted small">Part ID: {p.id || '—'}</div>
//                   <div className="muted small">Price: ${p.price || '—'}</div>
//                 </div>
//                 <div className="part-row__qty">Qty: <strong>{p.qty}</strong></div>
//               </div>
//             ))}
//           </div>
//         </section>

//         <section className="card">
//           <h3>Audit / Actions</h3>
//           <div className="grid">
//             <div><strong>Recorded by</strong><div>{issuance.issuedBy || 'Inventory Manager'}</div></div>
//             <div><strong>Last updated</strong><div>{issuance.dateIssued}</div></div>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// };

// export default IssuanceDetails;


// src/components/IssuanceDetails/IssuanceDetails.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './IssuanceDetails.scss';
import { Printer, Download, ArrowLeft, Loader } from 'lucide-react';

interface IssuedPart {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  notes?: string;
  image?: string;
  price?: string;
}

interface Issuance {
  id: number;
  issuance_number: string;
  date_issued: string;
  technician_name: string;
  recipient?: string;
  issued_by?: string;
  service_job?: string;
  car_details?: string;
  notes?: string;
  total_quantity: number;
  created_at: string;
  updated_at: string;
  parts: IssuedPart[];
}

const IssuanceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [issuance, setIssuance] = useState<Issuance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchIssuanceDetails();
    }
  }, [id]);

  const fetchIssuanceDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`http://localhost:3000/inventory/issuances/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();

      // Normalize detail response: backend may return { success: true, data: {...} } or raw object
      let raw: any = null;
      if (data && data.data) {
        raw = data.data;
      } else {
        raw = data;
      }

      // Ensure parts is an array
      const rawParts = Array.isArray(raw.parts) ? raw.parts : [];

      // Map API camelCase fields to the snake_case shape the component expects
      const normalizedParts = rawParts.map((p: any) => {
        const product = p.product || p.Product || {};
        return {
          id: p.id ?? p.issuanceId ?? 0,
          product_id: p.productId ?? p.product_id ?? product.id ?? 0,
          product_name: product.productname ?? product.productName ?? product.product_name ?? product.name ?? '',
          quantity: p.quantity ?? p.qty ?? 0,
          notes: p.notes ?? '',
          image: product.image ?? '',
          price: product.price ?? p.price ?? ''
        } as IssuedPart;
      });

      const normalized: Issuance = {
        id: raw.id ?? raw.ID ?? 0,
        issuance_number: raw.issuanceNumber ?? raw.issuance_number ?? raw.issuanceId ?? raw.id ?? '',
        date_issued: raw.dateIssued ?? raw.date_issued ?? raw.createdAt ?? raw.created_at ?? '',
        technician_name: raw.technicianName ?? raw.technician_name ?? raw.technician ?? '',
        recipient: raw.recipient ?? raw.to ?? '',
        issued_by: raw.issuedBy ?? raw.issued_by ?? raw.issuedBy ?? '',
        service_job: raw.serviceJob ?? raw.service_job ?? raw.service_job ?? '',
        car_details: raw.carDetails ?? raw.car_details ?? raw.car ?? '',
        notes: raw.notes ?? '',
        total_quantity: raw.totalQuantity ?? raw.total_quantity ?? raw.total_quantity ?? normalizedParts.reduce((s: number, p: IssuedPart) => s + (p.quantity || 0), 0),
        created_at: raw.createdAt ?? raw.created_at ?? '',
        updated_at: raw.updatedAt ?? raw.updated_at ?? '',
        parts: normalizedParts
      };

      setIssuance(normalized);
    } catch (err) {
      console.error('Error fetching issuance details:', err);
      setError(`Failed to load issuance details. Please try again.${id}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => window.print();
  const handleDownloadPDF = () => {
    console.log('Export PDF');
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
      <div className="issuance-details">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Back
        </button>
        <div className="issuance-details__loading">
          <Loader size={32} className="spinner" />
          <p>Loading issuance details...</p>
        </div>
      </div>
    );
  }

  if (error || !issuance) {
    return (
      <div className="issuance-details">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Back
        </button>
        <div className="issuance-details__error">
          <p>{error || 'Issuance not found.'}</p>
          <button onClick={fetchIssuanceDetails} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="issuance-details">
      {/* Header */}
      <div className="issuance-details__header">
        <div className="issuance-details__left">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} /> Back
          </button>
          <div className="issuance-details__meta">
            <h2>{issuance.issuance_number}</h2>
            <div className="muted">Issued on {formatDate(issuance.date_issued)} • By {issuance.issued_by || '—'}</div>
          </div>
        </div>

        <div className="issuance-details__actions">
          <button className="btn" onClick={handlePrint}><Printer size={14} /> Print</button>
          <button className="btn" onClick={handleDownloadPDF}><Download size={14} /> Export PDF</button>
        </div>
      </div>

      {/* Body */}
      <div className="issuance-details__body">
        <section className="card">
          <h3>Overview</h3>
          <div className="grid">
            <div><strong>Technician</strong><div>{issuance.technician_name}</div></div>
            <div><strong>Recipient</strong><div>{issuance.recipient || '—'}</div></div>
            <div><strong>Service Job</strong><div>{issuance.service_job || '—'}</div></div>
            <div><strong>Car Details</strong><div>{issuance.car_details || '—'}</div></div>
            <div><strong>Date Issued</strong><div>{formatDate(issuance.date_issued)}</div></div>
            <div><strong>Total Quantity</strong><div>{issuance.total_quantity}</div></div>
          </div>
        </section>

        <section className="card">
          <h3>Parts Issued</h3>
          <div className="parts-list">
            {issuance.parts.map((part) => (
              <div className="part-row" key={part.id}>
                {part.image ? (
                  <img src={part.image} alt={part.product_name} />
                ) : (
                  <div className="part-image-placeholder">No Image</div>
                )}
                <div className="part-row__info">
                  <div className="part-row__title">{part.product_name}</div>
                  <div className="muted small">Part ID: {part.product_id || '—'}</div>
                  <div className="muted small">Price: LKR {part.price || '—'}</div>
                  {part.notes && <div className="muted small">Notes: {part.notes}</div>}
                </div>
                <div className="part-row__qty">Qty: <strong>{part.quantity}</strong></div>
              </div>
            ))}
          </div>
        </section>

        {issuance.notes && (
          <section className="card">
            <h3>Notes</h3>
            <p>{issuance.notes}</p>
          </section>
        )}

        <section className="card">
          <h3>Audit Information</h3>
          <div className="grid">
            <div><strong>Recorded by</strong><div>{issuance.issued_by || '—'}</div></div>
            <div><strong>Created at</strong><div>{formatDate(issuance.created_at)}</div></div>
            <div><strong>Last updated</strong><div>{formatDate(issuance.updated_at)}</div></div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default IssuanceDetails;