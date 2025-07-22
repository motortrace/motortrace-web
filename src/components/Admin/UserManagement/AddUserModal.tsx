import React, { useState } from 'react';

interface AddUserModalProps {
  open: boolean;
  userType: 'Car Users' | 'Service Centers' | 'Spare Parts Sellers';
  onClose: () => void;
  onCreate: (user: any) => void;
}

const initialFormState = {
  // Common
  name: '',
  email: '',
  phone: '',
  // Car User
  totalVehicles: '',
  // Service Center & Spare Parts Seller
  businessName: '',
  businessRegNo: '',
  location: '',
  contactPerson: '',
  contactNumber: '',
  contactEmail: '',
  defaultPassword: '',
  status: 'Active',
  joinDate: new Date().toISOString().slice(0, 10),
};

const sectionTitleStyle: React.CSSProperties = {
  fontFamily: 'Poppins',
  fontWeight: 600,
  fontSize: 16,
  margin: '18px 0 8px 0',
  color: '#0ea5e9',
};

const sectionDividerStyle: React.CSSProperties = {
  height: 1,
  background: '#e5e7eb',
  border: 'none',
  margin: '12px 0',
};

const AddUserModal: React.FC<AddUserModalProps> = ({ open, userType, onClose, onCreate }) => {
  const [form, setForm] = useState(initialFormState);
  const [error, setError] = useState('');

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validation
    if (userType === 'Service Centers' || userType === 'Spare Parts Sellers') {
      if (!form.businessName || !form.businessRegNo || !form.location || !form.contactPerson || !form.contactNumber || !form.contactEmail || !form.defaultPassword) {
        setError('Please fill in all required fields.');
        return;
      }
    } else if (userType === 'Car Users') {
      if (!form.name || !form.email || !form.phone || !form.totalVehicles) {
        setError('Please fill in all required fields.');
        return;
      }
    }
    setError('');
    // Generate a random id for demo
    const id = Math.random().toString(36).substr(2, 9);
    let newUser: any = { joinDate: form.joinDate, status: form.status };
    if (userType === 'Car Users') {
      newUser = {
        id,
        name: form.name,
        email: form.email,
        phone: form.phone,
        totalVehicles: Number(form.totalVehicles),
        totalBookings: 0,
        status: form.status,
        joinDate: form.joinDate,
      };
    } else {
      newUser = {
        id,
        businessName: form.businessName,
        businessRegNo: form.businessRegNo,
        location: form.location,
        contactPerson: form.contactPerson,
        contactNumber: form.contactNumber,
        contactEmail: form.contactEmail,
        defaultPassword: form.defaultPassword,
        status: form.status,
        joinDate: form.joinDate,
      };
    }
    onCreate(newUser);
    setForm(initialFormState);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.2)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: 'white',
        borderRadius: 12,
        padding: 36,
        minWidth: 420,
        maxWidth: 520,
        width: '100%',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        maxHeight: '90vh',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
      }}>
        <h2 style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 22, marginBottom: 18 }}>{`Add New ${userType.slice(0, -1)}`}</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {userType === 'Car Users' && (
            <>
              <input name="name" value={form.name} onChange={handleChange} placeholder="Name" style={inputStyle} />
              <input name="email" value={form.email} onChange={handleChange} placeholder="Email" style={inputStyle} type="email" />
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" style={inputStyle} />
              <input name="totalVehicles" value={form.totalVehicles} onChange={handleChange} placeholder="Total Vehicles" style={inputStyle} type="number" min={1} />
              <select name="status" value={form.status} onChange={handleChange} style={inputStyle}>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
              </select>
            </>
          )}
          {(userType === 'Service Centers' || userType === 'Spare Parts Sellers') && (
            <>
              {/* Business Details */}
              <div style={sectionTitleStyle}>Business Details</div>
              <input name="businessName" value={form.businessName} onChange={handleChange} placeholder={userType === 'Service Centers' ? 'Service Center Name' : 'Shop Name'} style={inputStyle} />
              <input name="businessRegNo" value={form.businessRegNo} onChange={handleChange} placeholder="Business Registration Number" style={inputStyle} />
              <input name="location" value={form.location} onChange={handleChange} placeholder={userType === 'Service Centers' ? 'Service Center Location' : 'Shop Location'} style={inputStyle} />
              <hr style={sectionDividerStyle} />
              {/* Contact Person Details */}
              <div style={sectionTitleStyle}>Contact Person Details</div>
              <input name="contactPerson" value={form.contactPerson} onChange={handleChange} placeholder="Contact Person Name" style={inputStyle} />
              <input name="contactNumber" value={form.contactNumber} onChange={handleChange} placeholder="Contact Number" style={inputStyle} />
              <input name="contactEmail" value={form.contactEmail} onChange={handleChange} placeholder="Email Address" style={inputStyle} type="email" />
              <hr style={sectionDividerStyle} />
              {/* Account Setup */}
              <div style={sectionTitleStyle}>Account Setup</div>
              <input name="defaultPassword" value={form.defaultPassword} onChange={handleChange} placeholder="Default Password" style={inputStyle} type="password" />
              <select name="status" value={form.status} onChange={handleChange} style={inputStyle}>
                <option value="Pending">Pending</option>
                <option value="Active">Active</option>
              </select>
            </>
          )}
          {error && <div style={{ color: '#dc2626', fontSize: 13, marginTop: 8 }}>{error}</div>}
          <div style={{ display: 'flex', gap: 12, marginTop: 18, justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} style={{ ...buttonStyle, background: '#f3f4f6', color: '#374151' }}>Cancel</button>
            <button type="submit" style={{ ...buttonStyle, background: '#0ea5e9', color: 'white' }}>Add User</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  padding: '10px 12px',
  border: '2px solid #e5e7eb',
  borderRadius: 8,
  fontSize: 15,
  fontFamily: 'Poppins',
  outline: 'none',
  marginBottom: 8,
};

const buttonStyle: React.CSSProperties = {
  border: 'none',
  borderRadius: 8,
  padding: '10px 20px',
  fontFamily: 'Poppins',
  fontWeight: 600,
  fontSize: 15,
  cursor: 'pointer',
};

export default AddUserModal; 