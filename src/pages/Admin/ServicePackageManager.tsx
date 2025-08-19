// Enhanced ServicePackageManager.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Briefcase, Package2 } from 'lucide-react';
import type { Service, Package } from '../../types/ServicesAndPackages';
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

    // Mapping between URL parameters and display names
    const tabTypeMap: Record<string, ServicePackageType> = {
        'services': 'Services',
        'packages': 'Packages'
    };

    // Reverse mapping for navigation
    const urlTypeMap: Record<ServicePackageType, string> = {
        'Services': 'services',
        'Packages': 'packages'
    };

    // Set active tab based on URL parameter
    useEffect(() => {
        if (tabType && tabTypeMap[tabType]) {
            setActiveTab(tabTypeMap[tabType]);
        } else {
            // Default to Services if no parameter or invalid parameter
            setActiveTab('Services');
            // Redirect to the default route
            navigate('/admin/offeringManagement/services', { replace: true });
        }
    }, [tabType, navigate]);

    const {
        services,
        packages,
        addService,
        updateService,
        toggleServiceAvailability,
        deleteService,
        addPackage,
        updatePackage,
        deletePackage
    } = useServiceData();

    // Handle tab change and update URL
    const handleTabChange = (newTab: ServicePackageType) => {
        setActiveTab(newTab);
        const urlType = urlTypeMap[newTab];
        navigate(`/admin/offeringManagement/${urlType}`, { replace: true });
    };

    const handleAddService = (newService: Omit<Service, 'id'>) => {
        addService(newService);
        setServiceForm({ open: false });
    };

    const handleEditService = (updatedService: Omit<Service, 'id'>) => {
        if (serviceForm.service) {
            updateService(serviceForm.service.id, updatedService);
            setServiceForm({ open: false });
        }
    };

    const handleAddPackage = (newPackage: Omit<Package, 'id'>) => {
        addPackage(newPackage);
        setPackageForm({ open: false });
    };

    const handleEditPackage = (updatedPackage: Omit<Package, 'id'>) => {
        if (packageForm.package) {
            updatePackage(packageForm.package.id, updatedPackage);
            setPackageForm({ open: false });
        }
    };

    // Tab configuration similar to employee component
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

    return (
        <div className="spm-app">
            {/* Enhanced header with tabs similar to employee component */}
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

            <div className="spm-content">
                {activeTab === 'Services' && (
                    <ServicesList
                        services={services}
                        onAddNew={() => setServiceForm({ open: true })}
                        onView={(service) => setViewModal({ service })}
                        onEdit={(service) => setServiceForm({ open: true, service })}
                        onToggleAvailability={toggleServiceAvailability}
                        onDelete={deleteService}
                    />
                )}

                {activeTab === 'Packages' && (
                    <PackagesList
                        packages={packages}
                        services={services}
                        onAddNew={() => setPackageForm({ open: true })}
                        onView={(pkg) => setViewModal({ package: pkg })}
                        onEdit={(pkg) => setPackageForm({ open: true, package: pkg })}
                        onDelete={deletePackage}
                    />
                )}
            </div>

            {/* Modals */}
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
        </div>
    );
};

export default ServicePackageManager;