import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Package2, AlertCircle, AlertTriangle } from 'lucide-react';
import type { Package, CreatePackageRequest, UpdatePackageRequest } from '../../types/ServicesAndPackages';
import { useServiceData } from '../../hooks/useServiceData';
import { PackagesList } from '../../components/Admin/ServiceAndPackageManagement/PackagesList';
import { ViewModal } from '../../components/Admin/ServiceAndPackageManagement/ViewModal';
import { PackageForm } from '../../components/Admin/ServiceAndPackageManagement/PackageForm';
import './ServiceAndPackageManager.scss';

type ServicePackageType = 'Packages';

const ServicePackageManager: React.FC = () => {
    const navigate = useNavigate();
    const { tabType } = useParams<{ tabType?: string }>();
    const [activeTab, setActiveTab] = useState<ServicePackageType>('Packages');
    const [viewModal, setViewModal] = useState<{ package?: Package } | null>(null);
    const [packageForm, setPackageForm] = useState<{ open: boolean; package?: Package }>({ open: false });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [toggleConfirm, setToggleConfirm] = useState<{
        type: 'service' | 'package';
        id: string;
        name: string;
        currentStatus: boolean;
    } | null>(null);

    const tabTypeMap: Record<string, ServicePackageType> = {
        'packages': 'Packages'
    };

    const urlTypeMap: Record<ServicePackageType, string> = {
        'Packages': 'packages'
    };

    useEffect(() => {
        if (tabType && tabTypeMap[tabType]) {
            setActiveTab(tabTypeMap[tabType]);
        } else {
            setActiveTab('Packages');
            navigate('/admin/offeringManagement/packages', { replace: true });
        }
    }, [tabType, navigate]);

    const {
        services,
        packages,
        loading: dataLoading,
        error: dataError,
        addPackage,
        updatePackage,
        deletePackage,
        togglePackageAvailability,
        refreshData
    } = useServiceData();

    useEffect(() => {
        if (dataError) {
            setError(dataError);
        }
    }, [dataError]);

    const handleTabChange = (newTab: ServicePackageType) => {
        setActiveTab(newTab);
        const urlType = urlTypeMap[newTab];
        navigate(`/admin/offeringManagement/${urlType}`, { replace: true });
    };


    const handleTogglePackageAvailability = (id: string) => {
        const pkg = packages.find(p => p.id === id);
        if (pkg) {
            setToggleConfirm({
                type: 'package',
                id,
                name: pkg.name,
                currentStatus: pkg.isAvailable
            });
        }
    };

    const handleConfirmToggle = async () => {
        if (!toggleConfirm) return;

        try {
            setLoading(true);
            await togglePackageAvailability(toggleConfirm.id);
            setToggleConfirm(null);
            setError(null);
        } catch (err: any) {
            setError(err.message || `Failed to toggle ${toggleConfirm.type} availability`);
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
        } catch (err: any) {
            setError(err.message || 'Failed to create package');
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
            } catch (err: any) {
                setError(err.message || 'Failed to update package');
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
        } catch (err: any) {
            setError(err.message || 'Failed to delete package');
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        try {
            setLoading(true);
            await refreshData();
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Failed to refresh data');
        } finally {
            setLoading(false);
        }
    };

    const tabConfig = {
        'Packages': {
            icon: <Package2 size={18} strokeWidth={1.5} />,
            data: packages,
            count: packages.length
        }
    };

    // Debugging logs
    useEffect(() => {
        console.log('Active tab:', activeTab);
        console.log('Packages count:', packages.length);
        console.log('Packages data:', packages);
        console.log('Services count:', services.length);
        console.log('Services data:', services);
        console.log('Active tab:', activeTab);
        console.log('Data loading:', dataLoading);
        console.log('Error:', error);
    }, [packages, services, activeTab, dataLoading]);

    return (
        <div className="spm-app">
            {(loading || dataLoading) && (
                <div className="spm-loading-overlay">
                    <div className="spm-loading-spinner">
                        <div className="spm-spinner"></div>
                        <p>Loading {activeTab.toLowerCase()}...</p>
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
                    {Object.keys(tabConfig).map((tabType) => (
                        <button
                            key={tabType}
                            className={`user-management__tab ${activeTab === tabType ? 'user-management__tab--active' : ''}`}
                            onClick={() => handleTabChange(tabType as ServicePackageType)}
                        >
                            <span className="user-management__tab-icon">
                                {tabConfig[tabType as ServicePackageType].icon}
                            </span>
                            <span className="spm-nav-tab__text">
                                {tabType}
                            </span>
                            <span className="spm-nav-tab__count">
                                ({tabConfig[tabType as ServicePackageType].count})
                            </span>
                        </button>
                    ))}
                </div>

            </div>

            <div className="smp-content">
                {activeTab === 'Packages' && (
                    <PackagesList
                        packages={packages}
                        loading={loading || dataLoading}
                        services={services}
                        onAddNew={() => setPackageForm({ open: true })}
                        onView={(pkg) => setViewModal({ package: pkg })}
                        onEdit={(pkg) => setPackageForm({ open: true, package: pkg })}
                        onToggleAvailability={handleTogglePackageAvailability}
                        onDelete={handleDeletePackage}
                    />
                )}
            </div>

            {viewModal && (
                <ViewModal
                    package={viewModal.package}
                    services={services}
                    onClose={() => setViewModal(null)}
                />
            )}

            {packageForm.open && (
                <PackageForm
                    package={packageForm.package}
                    services={services}
                    onClose={() => setPackageForm({ open: false })}
                    onSubmit={packageForm.package ? handleEditPackage : handleAddPackage}
                />
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
                                {toggleConfirm.currentStatus ? 'Disable' : 'Enable'} {toggleConfirm.type}?
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