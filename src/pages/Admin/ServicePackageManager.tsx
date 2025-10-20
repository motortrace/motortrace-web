import React, { useState, useEffect } from 'react';
import { Package2, AlertCircle, AlertTriangle, Search } from 'lucide-react';
import { PackageCard } from '../../components/Admin/ServiceAndPackageManagement/PackageCard';
import './ServiceAndPackageManager.scss';

// Modal styles
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

const labelStyle: React.CSSProperties = {
    fontFamily: 'Poppins',
    fontWeight: 600,
    fontSize: 14,
    marginBottom: 4,
    color: '#374151',
    display: 'block',
};

const readOnlyValueStyle: React.CSSProperties = {
    padding: '10px 12px',
    border: '1px solid #e5e7eb',
    borderRadius: 6,
    backgroundColor: '#f9fafb',
    fontSize: 15,
    fontFamily: 'Poppins',
    color: '#374151',
};

// Define interfaces locally
interface Package {
    id: string;
    name: string;
    description: string;
    price: number;
    duration: number;
    isAvailable: boolean;
    createdAt: string;
    updatedAt: string;
    code: string;
    serviceIds: string[];
}

interface CreatePackageRequest {
    name: string;
    description: string;
    price: number;
    duration: number;
}

interface UpdatePackageRequest {
    name?: string;
    description?: string;
    price?: number;
    duration?: number;
    isAvailable?: boolean;
}

const ServicePackageManager: React.FC = () => {
    const [viewModal, setViewModal] = useState<{ package?: Package } | null>(null);
    const [packageForm, setPackageForm] = useState<{ open: boolean; package?: Package }>({ open: false });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');

    const [toggleConfirm, setToggleConfirm] = useState<{
        id: string;
        name: string;
        currentStatus: boolean;
    } | null>(null);

    // State for data
    const [packages, setPackages] = useState<Package[]>([]);
    const [dataLoading, setDataLoading] = useState(false);

    // API endpoints
    const API_BASE = 'http://localhost:3000/canned-services';

    // Fetch packages
    const fetchPackages = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No authentication token found');

            const response = await fetch(`${API_BASE}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error('Failed to fetch packages');
            const data = await response.json();
            setPackages(data.data || data);
        } catch (err) {
            console.error('Error fetching packages:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch packages');
        }
    };

    // Load data on mount
    useEffect(() => {
        const loadData = async () => {
            setDataLoading(true);
            await fetchPackages();
            setDataLoading(false);
        };
        loadData();
    }, []);

    // Handler for toggling package availability
    const handleTogglePackageAvailability = (id: string) => {
        const pkg = packages.find(p => p.id === id);
        if (pkg) {
            setToggleConfirm({
                id,
                name: pkg.name,
                currentStatus: pkg.isAvailable
            });
        }
    };

    // Package CRUD operations
    const addPackage = async (data: CreatePackageRequest) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');

        const response = await fetch(`${API_BASE}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error('Failed to create package');
        await fetchPackages();
    };

    const updatePackage = async (id: string, data: UpdatePackageRequest) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');

        const response = await fetch(`${API_BASE}/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error('Failed to update package');
        await fetchPackages();
    };

    const deletePackage = async (id: string) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');

        const response = await fetch(`${API_BASE}/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Failed to delete package');
        await fetchPackages();
    };

    const togglePackageAvailability = async (id: string) => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');

        const response = await fetch(`${API_BASE}/${id}/toggle-availability`, {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Failed to toggle package availability');
        await fetchPackages();
    };

    const handleConfirmToggle = async () => {
        if (!toggleConfirm) return;

        try {
            setLoading(true);
            await togglePackageAvailability(toggleConfirm.id);
            setToggleConfirm(null);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to toggle package availability');
        } finally {
            setLoading(false);
        }
    };

    const handleAddPackage = async (data: CreatePackageRequest | UpdatePackageRequest) => {
        try {
            setLoading(true);
            await addPackage(data as CreatePackageRequest);
            setPackageForm({ open: false });
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create package');
        } finally {
            setLoading(false);
        }
    };

    const handleEditPackage = async (data: CreatePackageRequest | UpdatePackageRequest) => {
        if (packageForm.package) {
            try {
                setLoading(true);
                await updatePackage(packageForm.package.id, data as UpdatePackageRequest);
                setPackageForm({ open: false });
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to update package');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleDeletePackage = async (id: string) => {
        try {
            setLoading(true);
            await deletePackage(id);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete package');
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        try {
            setLoading(true);
            await fetchPackages();
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to refresh data');
        } finally {
            setLoading(false);
        }
    };

    // Filter packages based on search term
    const filteredPackages = packages.filter(pkg =>
        pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="spm-app">
            {(loading || dataLoading) && (
                <div className="spm-loading-overlay">
                    <div className="spm-loading-spinner">
                        <div className="spm-spinner"></div>
                        <p>Loading packages...</p>
                    </div>
                </div>
            )}

            {error && (
                <div className="spm-error-banner">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                    <div className="spm-error-banner__actions">
                        <button onClick={() => setError(null)}>Dismiss</button>
                        <button onClick={handleRefresh}>Retry</button>
                    </div>
                </div>
            )}

            <div className="user-management__header">
                <div className="user-management__tabs">
                    <button className="user-management__tab user-management__tab--active">
                        <span className="user-management__tab-icon">
                            <Package2 size={18} strokeWidth={1.5} />
                        </span>
                        <span className="spm-nav-tab__text">
                            Packages
                        </span>
                        <span className="spm-nav-tab__count">
                            ({filteredPackages.length})
                        </span>
                    </button>
                </div>

                <div className="user-management__actions">
                    <button
                        className="user-management__add-btn"
                        onClick={() => setPackageForm({ open: true })}
                    >
                        <Package2 size={16} />
                        Add New Package
                    </button>
                </div>
            </div>

            <div className="search-bar">
                <div className="search-content">
                    <div className="search-input-container">
                        <Search className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search packages..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="smp-content">
                <div className="spm-cards-grid">
                    {filteredPackages.map((pkg: Package) => {
                        // Transform our Package to match PackageCard expected format
                        const transformedPkg = {
                            ...pkg,
                            code: pkg.code || `PKG-${pkg.id.slice(-4)}`,
                            serviceIds: pkg.serviceIds || [],
                            description: pkg.description || 'No description available',
                            createdAt: new Date(pkg.createdAt),
                            updatedAt: new Date(pkg.updatedAt)
                        };

                        return (
                            <PackageCard
                                key={pkg.id}
                                package={transformedPkg as any}
                                services={[]} // Empty array since we don't have services in this simple implementation
                                onView={(pkg: any) => setViewModal({ package: pkg })}
                                onEdit={(pkg: any) => setPackageForm({ open: true, package: pkg })}
                                onToggleAvailability={handleTogglePackageAvailability}
                                onDelete={handleDeletePackage}
                            />
                        );
                    })}
                </div>
            </div>

            {/* Package form modal - same modal for Add, Edit, and View */}
            {packageForm.open && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    background: 'rgba(0,0,0,0.2)',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
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
                        <h2 style={{
                            fontFamily: 'Poppins',
                            fontWeight: 600,
                            fontSize: 22,
                            marginBottom: 18
                        }}>
                            {packageForm.package ? 'Edit Package' : 'Add New Package'}
                        </h2>

                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target as HTMLFormElement);
                            const data = {
                                name: formData.get('name') as string,
                                description: formData.get('description') as string,
                                price: parseFloat(formData.get('price') as string),
                                duration: parseInt(formData.get('duration') as string)
                            };

                            if (packageForm.package) {
                                handleEditPackage(data);
                            } else {
                                handleAddPackage(data);
                            }
                        }} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                            <input
                                name="name"
                                defaultValue={packageForm.package?.name || ''}
                                placeholder="Package Name"
                                style={inputStyle}
                                required
                            />
                            <textarea
                                name="description"
                                defaultValue={packageForm.package?.description || ''}
                                placeholder="Package Description"
                                style={{...inputStyle, minHeight: '80px', resize: 'vertical'}}
                                required
                            />
                            <input
                                name="price"
                                type="number"
                                defaultValue={packageForm.package?.price || ''}
                                placeholder="Price (LKR)"
                                style={inputStyle}
                                required
                                min="0"
                                step="0.01"
                            />
                            <input
                                name="duration"
                                type="number"
                                defaultValue={packageForm.package?.duration || ''}
                                placeholder="Duration (hours)"
                                style={inputStyle}
                                required
                                min="1"
                            />

                            <div style={{
                                display: 'flex',
                                gap: 12,
                                marginTop: 18,
                                justifyContent: 'flex-end'
                            }}>
                                <button
                                    type="button"
                                    onClick={() => setPackageForm({ open: false })}
                                    style={{
                                        ...buttonStyle,
                                        background: '#f3f4f6',
                                        color: '#374151'
                                    }}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    style={{
                                        ...buttonStyle,
                                        background: '#0ea5e9',
                                        color: 'white'
                                    }}
                                    disabled={loading}
                                >
                                    {loading ? 'Saving...' : (packageForm.package ? 'Update Package' : 'Create Package')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* View modal - read-only */}
            {viewModal && viewModal.package && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    background: 'rgba(0,0,0,0.2)',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
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
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 18
                        }}>
                            <h2 style={{
                                fontFamily: 'Poppins',
                                fontWeight: 600,
                                fontSize: 22,
                                margin: 0
                            }}>
                                View Package
                            </h2>
                            <button
                                onClick={() => setViewModal(null)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: 24,
                                    cursor: 'pointer',
                                    color: '#6b7280'
                                }}
                            >
                                ×
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                            <div style={{ marginBottom: 16 }}>
                                <label style={labelStyle}>Package Name</label>
                                <div style={readOnlyValueStyle}>{viewModal.package.name}</div>
                            </div>

                            <div style={{ marginBottom: 16 }}>
                                <label style={labelStyle}>Description</label>
                                <div style={readOnlyValueStyle}>{viewModal.package.description}</div>
                            </div>

                            <div style={{ marginBottom: 16 }}>
                                <label style={labelStyle}>Price</label>
                                <div style={readOnlyValueStyle}>LKR {viewModal.package.price.toLocaleString()}</div>
                            </div>

                            <div style={{ marginBottom: 16 }}>
                                <label style={labelStyle}>Duration</label>
                                <div style={readOnlyValueStyle}>{viewModal.package.duration} hours</div>
                            </div>

                            <div style={{ marginBottom: 16 }}>
                                <label style={labelStyle}>Status</label>
                                <div style={readOnlyValueStyle}>
                                    <span style={{
                                        padding: '4px 8px',
                                        borderRadius: '6px',
                                        fontSize: '0.75rem',
                                        fontWeight: 500,
                                        backgroundColor: viewModal.package.isAvailable ? '#ecfdf5' : '#fef2f2',
                                        color: viewModal.package.isAvailable ? '#065f46' : '#991b1b'
                                    }}>
                                        {viewModal.package.isAvailable ? 'Available' : 'Disabled'}
                                    </span>
                                </div>
                            </div>

                            <div style={{
                                display: 'flex',
                                gap: 12,
                                marginTop: 18,
                                justifyContent: 'flex-end'
                            }}>
                                <button
                                    onClick={() => setViewModal(null)}
                                    style={{
                                        ...buttonStyle,
                                        background: '#f3f4f6',
                                        color: '#374151'
                                    }}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}


            {/* Add this to your JSX in ServicePackageManager.tsx */}
            {toggleConfirm && (
                <div className="spm-confirm-overlay" onClick={() => setToggleConfirm(null)}>
                    <div className="spm-confirm-modal" onClick={e => e.stopPropagation()}>
                        <div className="spm-confirm-header">
                            <div className="spm-confirm-icon">
                                <AlertTriangle size={24} />
                            </div>
                            <h3 className="spm-confirm-title">
                                {toggleConfirm.currentStatus ? 'Disable' : 'Enable'} Package?
                            </h3>
                            <p className="spm-confirm-message">
                                Are you sure you want to {toggleConfirm.currentStatus ? 'disable' : 'enable'} "{toggleConfirm.name}"?
                            </p>
                        </div>
                        <div className="spm-confirm-actions">
                            <button
                                className="spm-confirm-cancel"
                                onClick={() => setToggleConfirm(null)}
                            >
                                Cancel
                            </button>
                            <button
                                className="spm-confirm-delete"
                                onClick={handleConfirmToggle}
                            >
                                {toggleConfirm.currentStatus ? 'Disable' : 'Enable'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ServicePackageManager;