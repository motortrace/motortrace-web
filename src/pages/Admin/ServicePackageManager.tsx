import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Briefcase, Package2, AlertCircle, AlertTriangle } from 'lucide-react';
import type { Service, Package, CreateServiceRequest, UpdateServiceRequest, CreatePackageRequest, UpdatePackageRequest } from '../../types/ServicesAndPackages';
import { useServiceData } from '../../hooks/useServiceData';
import { ServicesList } from '../../components/Admin/ServiceAndPackageManagement/ServicesList';
import { PackagesList } from '../../components/Admin/ServiceAndPackageManagement/PackagesList';
import { ViewModal } from '../../components/Admin/ServiceAndPackageManagement/ViewModal';
import { ServiceForm } from '../../components/Admin/ServiceAndPackageManagement/ServiceForm';
import { PackageForm } from '../../components/Admin/ServiceAndPackageManagement/PackageForm';
import './ServiceAndPackageManager.scss';

type ServicePackageType = 'Services' | 'Packages';

const ServicePackageManager: React.FC = () => {
    const navigate = useNavigate();
    const { tabType } = useParams<{ tabType?: string }>();
    const [activeTab, setActiveTab] = useState<ServicePackageType>('Services');
    const [viewModal, setViewModal] = useState<{ service?: Service; package?: Package } | null>(null);
    const [serviceForm, setServiceForm] = useState<{ open: boolean; service?: Service }>({ open: false });
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
        'services': 'Services',
        'packages': 'Packages'
    };

    const urlTypeMap: Record<ServicePackageType, string> = {
        'Services': 'services',
        'Packages': 'packages'
    };

    useEffect(() => {
        if (tabType && tabTypeMap[tabType]) {
            setActiveTab(tabTypeMap[tabType]);
        } else {
            setActiveTab('Services');
            navigate('/admin/offeringManagement/services', { replace: true });
        }
    }, [tabType, navigate]);

    const {
        services,
        packages,
        loading: dataLoading,
        error: dataError,
        addService,
        updateService,
        deleteService,
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

    const handleAddService = async (data: CreateServiceRequest | UpdateServiceRequest) => {
        try {
            setLoading(true);
            await addService(data as CreateServiceRequest);
            setServiceForm({ open: false });
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Failed to create service');
        } finally {
            setLoading(false);
        }
    };

    const handleEditService = async (data: CreateServiceRequest | UpdateServiceRequest) => {
        if (serviceForm.service) {
            try {
                setLoading(true);
                await updateService(serviceForm.service.id, data as UpdateServiceRequest);
                setServiceForm({ open: false });
                setError(null);
            } catch (err: any) {
                setError(err.message || 'Failed to update service');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleDeleteService = async (id: string) => {
        try {
            setLoading(true);
            await deleteService(id);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Failed to delete service');
        } finally {
            setLoading(false);
        }
    };

    // Separate handler for toggling service availability
    const handleToggleServiceAvailability = (id: string) => {
        const service = services.find(s => s.id === id);
        if (service) {
            setToggleConfirm({
                type: 'service',
                id,
                name: service.name,
                currentStatus: service.isActive
            });
        }
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
            if (toggleConfirm.type === 'service') {
                await updateService(toggleConfirm.id, { isActive: !toggleConfirm.currentStatus });
            } else {
                await togglePackageAvailability(toggleConfirm.id); // Make sure this exists in useServiceData
            }
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
        'Services': {
            icon: <Briefcase size={18} strokeWidth={1.5} />,
            data: services,
            count: services.length
        },
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
                {activeTab === 'Services' && (
                    <ServicesList
                        services={services}
                        loading={loading || dataLoading}
                        onAddNew={() => setServiceForm({ open: true })}
                        onView={(service) => setViewModal({ service })}
                        onEdit={(service) => setServiceForm({ open: true, service })}
                        onToggleAvailability={handleToggleServiceAvailability}
                        onDelete={handleDeleteService}
                    />
                )}

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
                    service={viewModal.service}
                    package={viewModal.package}
                    services={services}
                    onClose={() => setViewModal(null)}
                />
            )}

            {serviceForm.open && (
                <ServiceForm
                    service={serviceForm.service}
                    onClose={() => setServiceForm({ open: false })}
                    onSubmit={serviceForm.service ? handleEditService : handleAddService}
                    loading={loading}
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