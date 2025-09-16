
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
      
      const response = await fetch(`http://localhost:3000/api/issuances/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setIssuance(data);
    } catch (err) {
      console.error('Error fetching issuance details:', err);
      setError('Failed to load issuance details. Please try again.');
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