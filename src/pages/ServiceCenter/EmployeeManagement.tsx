import React, { useState } from 'react';

interface Technician {
  id: string;
  name: string;
  skills: string[];
  workingHours: { start: string; end: string };
  dailyCapacity: number;
  status: 'Active' | 'Inactive' | 'Busy';
  contactNumber?: string;
  contactEmail?: string;
}

const initialTechnicians: Technician[] = [
  {
    id: 'tech1',
    name: 'Alex Chen',
    skills: ['Electrical', 'Diagnostics', 'AC Systems'],
    workingHours: { start: '07:30', end: '16:30' },
    dailyCapacity: 3,
    status: 'Active',
    contactNumber: '+94 70 111 2222',
    contactEmail: 'alex.chen@email.com',
  },
  {
    id: 'tech2',
    name: 'Mike Johnson',
    skills: ['Engine', 'Electrical', 'Diagnostics'],
    workingHours: { start: '08:00', end: '17:00' },
    dailyCapacity: 3,
    status: 'Active',
    contactNumber: '+94 77 123 4567',
    contactEmail: 'mike.johnson@email.com',
  },
  {
    id: 'tech3',
    name: 'Sarah Lee',
    skills: ['Brakes', 'Suspension', 'Alignment'],
    workingHours: { start: '09:00', end: '18:00' },
    dailyCapacity: 4,
    status: 'Busy',
    contactNumber: '+94 71 234 5678',
    contactEmail: 'sarah.lee@email.com',
  },
  {
    id: 'tech4',
    name: 'John Smith',
    skills: ['Engine', 'Transmission', 'Diagnostics'],
    workingHours: { start: '08:00', end: '17:00' },
    dailyCapacity: 2,
    status: 'Inactive',
    contactNumber: '+94 76 345 6789',
    contactEmail: 'john.smith@email.com',
  },
];

const EmployeeManagement: React.FC = () => {
  const [technicians, setTechnicians] = useState<Technician[]>(initialTechnicians);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Search, sort, filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('Name (A-Z)');
  const [statusFilter, setStatusFilter] = useState('All Statuses');

  // Modal form state
  const [form, setForm] = useState({
    name: '',
    skills: '',
    workingStart: '08:00',
    workingEnd: '17:00',
    dailyCapacity: '',
    status: 'Active',
    contactNumber: '',
    contactEmail: '',
  });
  const [error, setError] = useState('');

  const handleOpenAddModal = () => setIsAddModalOpen(true);
  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setForm({
      name: '',
      skills: '',
      workingStart: '08:00',
      workingEnd: '17:00',
      dailyCapacity: '',
      status: 'Active',
      contactNumber: '',
      contactEmail: '',
    });
    setError('');
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddTechnician = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.skills || !form.workingStart || !form.workingEnd || !form.dailyCapacity) {
      setError('Please fill in all required fields.');
      return;
    }
    const newTech: Technician = {
      id: Math.random().toString(36).substr(2, 9),
      name: form.name,
      skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
      workingHours: { start: form.workingStart, end: form.workingEnd },
      dailyCapacity: Number(form.dailyCapacity),
      status: form.status as Technician['status'],
      contactNumber: form.contactNumber,
      contactEmail: form.contactEmail,
    };
    setTechnicians([...technicians, newTech]);
    handleCloseAddModal();
  };

  // For demo: assigned jobs today is random, but 0 for inactive
  const getAssignedJobsToday = (tech: Technician) => {
    if (tech.status === 'Inactive') return 0;
    return Math.floor(Math.random() * (tech.dailyCapacity + 1));
  };

  // --- Filtering, Searching, Sorting Logic ---
  const filteredTechnicians = technicians.filter(tech => {
    // Status filter
    if (statusFilter !== 'All Statuses' && tech.status !== statusFilter) return false;
    // Search
    const search = searchTerm.toLowerCase();
    if (search) {
      const inName = tech.name.toLowerCase().includes(search);
      const inSkills = tech.skills.join(' ').toLowerCase().includes(search);
      const inContact = (tech.contactNumber || '').toLowerCase().includes(search) || (tech.contactEmail || '').toLowerCase().includes(search);
      return inName || inSkills || inContact;
    }
    return true;
  });

  const sortedTechnicians = [...filteredTechnicians].sort((a, b) => {
    switch (sortOption) {
      case 'Name (A-Z)':
        return a.name.localeCompare(b.name);
      case 'Name (Z-A)':
        return b.name.localeCompare(a.name);
      case 'Daily Capacity (High-Low)':
        return b.dailyCapacity - a.dailyCapacity;
      case 'Daily Capacity (Low-High)':
        return a.dailyCapacity - b.dailyCapacity;
      case 'Status (Active > Busy > Inactive)': {
        const order = { 'Active': 0, 'Busy': 1, 'Inactive': 2 };
        return order[a.status] - order[b.status];
      }
      default:
        return 0;
    }
  });

  return (
    <div className="employee-management" style={{ background: 'white', borderRadius: 20, padding: 24, minHeight: 600 }}>
      {/* Search, Sort, Filter Bar */}
      <div className="search-bar" style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18 }}>
        <div className="search-content" style={{ flex: 1 }}>
          <div className="search-input-container" style={{ display: 'flex', alignItems: 'center', border: 'none', borderRadius: 12, padding: 0, background: 'white', marginTop: 8, marginBottom: 0 }}>
            <span className="search-icon" style={{ marginLeft: 6, marginRight: 6, color: '#9ca3af' }}>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search"><circle cx="8" cy="8" r="7"/><path d="m16 16-3.5-3.5"/></svg>
            </span>
            <input
              type="text"
              placeholder="Search technicians..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ flex: 1, border: '2px solid #e5e7eb', outline: 'none', fontSize: 15, fontFamily: 'Poppins', background: 'transparent', color: '#374151', padding: '8px 40px' }}
            />
          </div>
          <div className="filters" style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <select
              value={sortOption}
              onChange={e => setSortOption(e.target.value)}
              style={{ padding: '10px 12px', border: '2px solid #e5e7eb', borderRadius: 8, fontSize: 14, color: '#374151', background: 'white', fontFamily: 'Poppins' }}
            >
              <option value="Name (A-Z)">Sort by Name (A-Z)</option>
              <option value="Name (Z-A)">Sort by Name (Z-A)</option>
              <option value="Daily Capacity (High-Low)">Daily Capacity (High-Low)</option>
              <option value="Daily Capacity (Low-High)">Daily Capacity (Low-High)</option>
              <option value="Status (Active > Busy > Inactive)">Status (Active &gt; Busy &gt; Inactive)</option>
            </select>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              style={{ padding: '10px 12px', border: '2px solid #e5e7eb', borderRadius: 8, fontSize: 14, color: '#374151', background: 'white', fontFamily: 'Poppins' }}
            >
              <option value="All Statuses">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Busy">Busy</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
        <button
          onClick={handleOpenAddModal}
          style={{ background: '#0ea5e9', color: 'white', border: 'none', borderRadius: 8, fontFamily: 'Poppins', fontWeight: 500, fontSize: 15, cursor: 'pointer', padding: '10px 22px', marginTop: 8, marginLeft: 'auto' }}
        >
          + Add New Technician
        </button>
      </div>
      <div className="employee-management__table" style={{ width: '100%', border: '2px solid #e5e7eb', borderRadius: 12, overflow: 'hidden' }}>
        <div className="employee-management__table-header" style={{ display: 'grid', gridTemplateColumns: '1.5fr 2fr 1.2fr 1.2fr 1fr 1.5fr 1.5fr', background: '#f8f9fa', padding: '16px 20px', gap: 16, fontWeight: 600, color: '#656970', fontFamily: 'Poppins', fontSize: 13 }}>
          <div>Name</div>
          <div>Skills</div>
          <div>Status</div>
          <div>Working Hours</div>
          <div>Daily Capacity</div>
          <div>Assigned Jobs Today</div>
          <div>Contact</div>
        </div>
        <div className="employee-management__table-body" style={{ display: 'flex', flexDirection: 'column' }}>
          {sortedTechnicians.map(tech => (
            <div key={tech.id} className="employee-management__row" style={{ display: 'grid', gridTemplateColumns: '1.5fr 2fr 1.2fr 1.2fr 1fr 1.5fr 1.5fr', gap: 16, alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #f1f3f5', fontFamily: 'Poppins', fontSize: 14, color: '#374151' }}>
              <div>{tech.name}</div>
              <div>{tech.skills.join(', ')}</div>
              <div>
                <span style={{
                  fontWeight: 600,
                  padding: '4px 12px',
                  borderRadius: 12,
                  fontSize: 12,
                  backgroundColor: tech.status === 'Active' ? '#d1fae5' : tech.status === 'Busy' ? '#fef9c3' : '#f3f4f6',
                  color: tech.status === 'Active' ? '#10b981' : tech.status === 'Busy' ? '#f59e0b' : '#6b7280',
                }}>{tech.status}</span>
              </div>
              <div>{tech.workingHours.start} - {tech.workingHours.end}</div>
              <div>{tech.dailyCapacity}</div>
              <div>{getAssignedJobsToday(tech)}</div>
              <div>
                <div>{tech.contactNumber}</div>
                <div style={{ fontSize: 13, color: '#6b7280' }}>{tech.contactEmail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Add Technician Modal */}
      {isAddModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.2)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', borderRadius: 12, padding: 36, minWidth: 420, maxWidth: 520, width: '100%', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
            <h2 style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 22, marginBottom: 18 }}>Add New Technician</h2>
            <form onSubmit={handleAddTechnician} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              <input name="name" value={form.name} onChange={handleFormChange} placeholder="Name" style={inputStyle} />
              <input name="skills" value={form.skills} onChange={handleFormChange} placeholder="Skills (comma separated)" style={inputStyle} />
              <div style={{ display: 'flex', gap: 8 }}>
                <input name="workingStart" value={form.workingStart} onChange={handleFormChange} placeholder="Start Time (e.g. 08:00)" style={{ ...inputStyle, flex: 1 }} type="time" />
                <input name="workingEnd" value={form.workingEnd} onChange={handleFormChange} placeholder="End Time (e.g. 17:00)" style={{ ...inputStyle, flex: 1 }} type="time" />
              </div>
              <input name="dailyCapacity" value={form.dailyCapacity} onChange={handleFormChange} placeholder="Maximum Daily Capacity" style={inputStyle} type="number" min={1} />
              <select name="status" value={form.status} onChange={handleFormChange} style={inputStyle}>
                <option value="Active">Active</option>
                <option value="Busy">Busy</option>
                <option value="Inactive">Inactive</option>
              </select>
              <input name="contactNumber" value={form.contactNumber} onChange={handleFormChange} placeholder="Contact Number (optional)" style={inputStyle} />
              <input name="contactEmail" value={form.contactEmail} onChange={handleFormChange} placeholder="Contact Email (optional)" style={inputStyle} type="email" />
              {error && <div style={{ color: '#dc2626', fontSize: 13, marginTop: 8 }}>{error}</div>}
              <div style={{ display: 'flex', gap: 12, marginTop: 18, justifyContent: 'flex-end' }}>
                <button type="button" onClick={handleCloseAddModal} style={{ ...buttonStyle, background: '#f3f4f6', color: '#374151' }}>Cancel</button>
                <button type="submit" style={{ ...buttonStyle, background: '#0ea5e9', color: 'white' }}>Add Technician</button>
              </div>
            </form>
          </div>
        </div>
      )}
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

export default EmployeeManagement; 