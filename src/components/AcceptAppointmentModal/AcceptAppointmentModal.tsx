import React, { useEffect, useState } from 'react';

interface Technician {
  id: number;
  name: string;
}

interface AcceptAppointmentModalProps {
  open: boolean;
  onClose: () => void;
  appointment: any; // Use a more specific type if available
  onConfirm?: (appointmentId: number, technicianId: number) => void;
}

const AcceptAppointmentModal: React.FC<AcceptAppointmentModalProps> = ({ open, onClose, appointment, onConfirm }) => {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [selectedTechnician, setSelectedTechnician] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const serviceCenterId = 2; // TODO: Replace with actual service center ID from context

  useEffect(() => {
    if (!open) return;
    // Fetch technicians for the service center
    const fetchTechnicians = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3000/api/service-center/${serviceCenterId}/technicians`);
        if (!res.ok) throw new Error('Failed to fetch technicians');
        const data = await res.json();
        setTechnicians(data);
        setLoading(false);
      } catch (err) {
        setTechnicians([]);
        setLoading(false);
      }
    };
    fetchTechnicians();
  }, [open, serviceCenterId]);

  if (!open || !appointment) return null;

  const handleConfirm = () => {
    if (selectedTechnician && onConfirm) {
      onConfirm(appointment.id, selectedTechnician);
    }
    onClose();
  };

  return (
    <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.3)', zIndex: 1000 }} onClick={onClose}>
      <div className="modal" style={{ background: '#fff', borderRadius: 8, maxWidth: 400, margin: '100px auto', padding: 24, position: 'relative' }} onClick={e => e.stopPropagation()}>
        <h2>Accept Appointment</h2>
        <div style={{ marginBottom: 16 }}>
          <strong>Client:</strong> {appointment.customerName}<br />
          <strong>Date:</strong> {appointment.date} {appointment.time}<br />
          <strong>License Plate:</strong> {appointment.licensePlate}
        </div>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="technician-select"><strong>Select Technician:</strong></label><br />
          {loading ? (
            <div style={{ padding: 8 }}>Loading technicians...</div>
          ) : (
            <select
              id="technician-select"
              value={selectedTechnician ?? ''}
              onChange={e => setSelectedTechnician(Number(e.target.value))}
              style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
            >
              <option value="" disabled>Select a technician</option>
              {technicians.map(tech => (
                <option key={tech.id} value={tech.id}>{tech.name}</option>
              ))}
            </select>
          )}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button className="btn btn--secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn--primary" onClick={handleConfirm} disabled={!selectedTechnician}>Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default AcceptAppointmentModal; 