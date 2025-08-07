import React, { useState } from 'react';

interface AddUserModalProps {
  open: boolean;
  userType: 'Car Users' | 'Service Centers' | 'Spare Parts Sellers' | 'Service Advisors' | 'Technicians';
  onClose: () => void;
  onCreate: (user: any) => void;
}

const initialFormState = {
  // Common User fields
  name: '',
  email: '',
  phone: '',
  password: '',
  // Service Center Profile fields
  businessName: '',
  address: '',
  businessRegistrationNumber: '',
  contactPersonName: '',
  // Spare Parts Seller fields
  shopName: '',
  inventoryCapacity: '',
  // Car User fields
  totalVehicles: '',
  // Employee fields
  role: '',
  department: '',
  totalServices: '',
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
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    // Validation
    if (userType === 'Service Centers') {
      if (
        !form.name ||
        !form.email ||
        !form.phone ||
        !form.password ||
        !form.businessName ||
        !form.address ||
        !form.businessRegistrationNumber ||
        !form.contactPersonName
      ) {
        setError('Please fill in all required fields.');
        return;
      }
    } else if (userType === 'Spare Parts Sellers') {
      if (
        !form.name ||
        !form.email ||
        !form.phone ||
        !form.password ||
        !form.shopName ||
        !form.address ||
        !form.contactPersonName
      ) {
        setError('Please fill in all required fields.');
        return;
      }
    } else if (userType === 'Car Users') {
      if (!form.name || !form.email || !form.phone || !form.totalVehicles) {
        setError('Please fill in all required fields.');
        return;
      }
    } else if (userType === 'Service Advisors' || userType === 'Technicians') {
      if (!form.name || !form.email || !form.phone || !form.password || !form.department) {
        setError('Please fill in all required fields.');
        return;
      }
    }
    setLoading(true);
    try {
      // Prepare payload for backend
      let payload: any = { ...form };
      if (userType === 'Service Centers') {
        payload = {
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
          businessName: form.businessName,
          address: form.address,
          businessRegistrationNumber: form.businessRegistrationNumber,
          contactPersonName: form.contactPersonName,
        };
      } else if (userType === 'Spare Parts Sellers') {
        payload = {
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
          shopName: form.shopName,
          address: form.address,
          contactPersonName: form.contactPersonName,
          categoriesSold: '[]', // send empty array for now
          inventoryCapacity: form.inventoryCapacity || '',
        };
      } else if (userType === 'Car Users') {
        payload = {
          name: form.name,
          email: form.email,
          phone: form.phone,
          totalVehicles: Number(form.totalVehicles),
        };
      } else if (userType === 'Service Advisors' || userType === 'Technicians') {
        payload = {
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
          role: userType === 'Service Advisors' ? 'Service Advisor' : 'Technician',
          department: form.department,
          totalServices: Number(form.totalServices) || 0,
        };
      }
      await onCreate(payload);
      setForm(initialFormState);
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
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
          {userType === 'Service Centers' && (
            <>
              {/* Account Details */}
              <div style={sectionTitleStyle}>Account Details</div>
              <input name="name" value={form.name} onChange={handleChange} placeholder="Owner Name" style={inputStyle} />
              <input name="email" value={form.email} onChange={handleChange} placeholder="Email" style={inputStyle} type="email" />
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" style={inputStyle} />
              <input name="password" value={form.password} onChange={handleChange} placeholder="Default Password" style={inputStyle} type="password" />
              {/* Business Details */}
              <div style={sectionTitleStyle}>Business Details</div>
              <input name="businessName" value={form.businessName} onChange={handleChange} placeholder="Service Center Name" style={inputStyle} />
              <input name="address" value={form.address} onChange={handleChange} placeholder="Service Center Address" style={inputStyle} />
              <input name="businessRegistrationNumber" value={form.businessRegistrationNumber} onChange={handleChange} placeholder="Business Registration Number" style={inputStyle} />
              {/* Contact Person */}
              <div style={sectionTitleStyle}>Contact Person</div>
              <input name="contactPersonName" value={form.contactPersonName} onChange={handleChange} placeholder="Contact Person Name" style={inputStyle} />
            </>
          )}
          {userType === 'Spare Parts Sellers' && (
            <>
              {/* Account Details */}
              <div style={sectionTitleStyle}>Account Details</div>
              <input name="name" value={form.name} onChange={handleChange} placeholder="Owner Name" style={inputStyle} />
              <input name="email" value={form.email} onChange={handleChange} placeholder="Email" style={inputStyle} type="email" />
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" style={inputStyle} />
              <input name="password" value={form.password} onChange={handleChange} placeholder="Default Password" style={inputStyle} type="password" />
              {/* Business Details */}
              <div style={sectionTitleStyle}>Business Details</div>
              <input name="shopName" value={form.shopName} onChange={handleChange} placeholder="Spare Parts Shop Name" style={inputStyle} />
              <input name="address" value={form.address} onChange={handleChange} placeholder="Shop Address" style={inputStyle} />
              {/* Optional: Inventory Capacity */}
              <input name="inventoryCapacity" value={form.inventoryCapacity} onChange={handleChange} placeholder="Inventory Capacity (optional)" style={inputStyle} />
              {/* Contact Person */}
              <div style={sectionTitleStyle}>Contact Person</div>
              <input name="contactPersonName" value={form.contactPersonName} onChange={handleChange} placeholder="Contact Person Name" style={inputStyle} />
            </>
          )}
          {(userType === 'Service Advisors' || userType === 'Technicians') && (
            <>
              {/* Account Details */}
              <div style={sectionTitleStyle}>Account Details</div>
              <input name="name" value={form.name} onChange={handleChange} placeholder="Employee Name" style={inputStyle} />
              <input name="email" value={form.email} onChange={handleChange} placeholder="Email" style={inputStyle} type="email" />
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" style={inputStyle} />
              <input name="password" value={form.password} onChange={handleChange} placeholder="Default Password" style={inputStyle} type="password" />
              {/* Employee Details */}
              <div style={sectionTitleStyle}>Employee Details</div>
              <select name="department" value={form.department} onChange={handleChange} style={inputStyle}>
                <option value="">Select Department</option>
                <option value="Customer Service">Customer Service</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Electrical">Electrical</option>
                <option value="Body Shop">Body Shop</option>
              </select>
              <input name="totalServices" value={form.totalServices} onChange={handleChange} placeholder="Total Services (optional)" style={inputStyle} type="number" min={0} />
              <select name="status" value={form.status} onChange={handleChange} style={inputStyle}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Suspended">Suspended</option>
              </select>
            </>
          )}
          {error && <div style={{ color: '#dc2626', fontSize: 13, marginTop: 8 }}>{error}</div>}
          <div style={{ display: 'flex', gap: 12, marginTop: 18, justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} style={{ ...buttonStyle, background: '#f3f4f6', color: '#374151' }} disabled={loading}>Cancel</button>
            <button type="submit" style={{ ...buttonStyle, background: '#0ea5e9', color: 'white' }} disabled={loading}>{loading ? 'Adding...' : 'Add User'}</button>
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