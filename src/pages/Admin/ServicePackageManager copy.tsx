import React, { useState, useEffect } from 'react';
import { Package2, AlertCircle, AlertTriangle } from 'lucide-react';
import './ServiceAndPackageManager.scss';

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
                            ({packages.length})
                        </span>
                    </button>
                </div>
            </div>

            <div className="smp-content">
                {/* Simple table implementation for now */}
                <div className="spm-table-container">
                    <table className="spm-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Price</th>
                                <th>Duration</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {packages.map((item: Package) => (
                                <tr key={item.id}>
                                    <td>{item.name}</td>
                                    <td>{item.description}</td>
                                    <td>LKR {item.price.toLocaleString()}</td>
                                    <td>{item.duration} hours</td>
                                    <td>
                                        <span className={`spm-status ${item.isAvailable ? 'available' : 'disabled'}`}>
                                            {item.isAvailable ? 'Available' : 'Disabled'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="spm-actions">
                                            <button
                                                className="spm-action-btn view"
                                                onClick={() => setViewModal({ package: item })}
                                                title="View"
                                            >
                                                👁️
                                            </button>
                                            <button
                                                className="spm-action-btn edit"
                                                onClick={() => setPackageForm({ open: true, package: item })}
                                                title="Edit"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                className="spm-action-btn toggle"
                                                onClick={() => handleTogglePackageAvailability(item.id)}
                                                title={item.isAvailable ? 'Disable' : 'Enable'}
                                            >
                                                🔄
                                            </button>
                                            <button
                                                className="spm-action-btn delete"
                                                onClick={() => handleDeletePackage(item.id)}
                                                title="Delete"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Simple modals for now */}
            {viewModal && (
                <div className="spm-modal-overlay" onClick={() => setViewModal(null)}>
                    <div className="spm-modal" onClick={e => e.stopPropagation()}>
                        <div className="spm-modal-header">
                            <h3>View Package</h3>
                            <button className="spm-modal-close" onClick={() => setViewModal(null)}>×</button>
                        </div>
                        <div className="spm-view-content">
                            {viewModal.package && (
                                <>
                                    <div className="spm-view-field">
                                        <label>Name:</label>
                                        <span>{viewModal.package.name}</span>
                                    </div>
                                    <div className="spm-view-field">
                                        <label>Description:</label>
                                        <span>{viewModal.package.description}</span>
                                    </div>
                                    <div className="spm-view-field">
                                        <label>Price:</label>
                                        <span>LKR {viewModal.package.price.toLocaleString()}</span>
                                    </div>
                                    <div className="spm-view-field">
                                        <label>Duration:</label>
                                        <span>{viewModal.package.duration} hours</span>
                                    </div>
                                    <div className="spm-view-field">
                                        <label>Status:</label>
                                        <span className={`spm-status ${viewModal.package.isAvailable ? 'available' : 'disabled'}`}>
                                            {viewModal.package.isAvailable ? 'Available' : 'Disabled'}
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Package form */}
            {packageForm.open && (
                <div className="spm-modal-overlay" onClick={() => setPackageForm({ open: false })}>
                    <div className="spm-modal" onClick={e => e.stopPropagation()}>
                        <div className="spm-modal-header">
                            <h3>{packageForm.package ? 'Edit' : 'Add'} Package</h3>
                            <button
                                className="spm-modal-close"
                                onClick={() => setPackageForm({ open: false })}
                            >
                                ×
                            </button>
                        </div>
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
                        }} className="spm-form">
                            <div className="spm-form-group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    defaultValue={packageForm.package?.name || ''}
                                    placeholder="Enter name"
                                    required
                                />
                            </div>
                            <div className="spm-form-group">
                                <label>Description</label>
                                <textarea
                                    name="description"
                                    defaultValue={packageForm.package?.description || ''}
                                    placeholder="Enter description"
                                    required
                                />
                            </div>
                            <div className="spm-form-group">
                                <label>Price (LKR)</label>
                                <input
                                    type="number"
                                    name="price"
                                    defaultValue={packageForm.package?.price || ''}
                                    placeholder="Enter price"
                                    required
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                            <div className="spm-form-group">
                                <label>Duration (hours)</label>
                                <input
                                    type="number"
                                    name="duration"
                                    defaultValue={packageForm.package?.duration || ''}
                                    placeholder="Enter duration in hours"
                                    required
                                    min="1"
                                />
                            </div>
                            <div className="spm-form-actions">
                                <button type="button" onClick={() => setPackageForm({ open: false })}>
                                    Cancel
                                </button>
                                <button type="submit">
                                    {packageForm.package ? 'Update' : 'Create'} Package
                                </button>
                            </div>
                        </form>
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

