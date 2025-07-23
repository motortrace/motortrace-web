import React, { useState } from 'react';
import { Inbox, CheckCircle, XCircle, Eye, MapPin, Package, Wrench, Store } from 'lucide-react';
import './RegistrationRequests.scss';

interface RegistrationRequest {
    id: string;
    name: string;
    email: string;
    phone: string;
    businessName?: string;
    location: string;
    description: string;
    documents: string[];
    submittedDate: string;
    type: 'Service Center' | 'Spare Parts Seller';
    businessLicense?: string;
    taxId?: string;
    specializations?: string[];
    experience?: string;
    website?: string;
}

interface RegistrationRequestsProps {
    requests?: RegistrationRequest[];
}

const RegistrationRequests: React.FC<RegistrationRequestsProps> = ({
    requests = [
        {
            id: '1',
            name: 'Kasun Perera',
            email: 'kasun@premiumauto.lk',
            phone: '+94 77 123 4567',
            businessName: 'Premium Auto Service',
            location: 'Colombo 07',
            description: 'Full-service automotive repair shop specializing in luxury vehicles with 15+ years of experience.',
            documents: ['business_license.pdf', 'tax_certificate.pdf', 'insurance_policy.pdf'],
            submittedDate: '2024-01-15',
            type: 'Service Center',
            businessLicense: 'BL-2024-001234',
            taxId: 'TAX-567890123',
            specializations: ['Engine Repair', 'Transmission', 'Electrical Systems', 'AC Service'],
            experience: '15 years',
            website: 'www.premiumauto.lk'
        },
        {
            id: '2',
            name: 'Nimal Silva',
            email: 'nimal@autopartsplus.com',
            phone: '+94 71 987 6543',
            businessName: 'Auto Parts Plus',
            location: 'Kandy',
            description: 'Wholesale and retail automotive parts supplier with extensive inventory of genuine and aftermarket parts.',
            documents: ['business_registration.pdf', 'supplier_agreements.pdf', 'warehouse_lease.pdf'],
            submittedDate: '2024-01-14',
            type: 'Spare Parts Seller',
            businessLicense: 'BL-2024-005678',
            taxId: 'TAX-123456789',
            website: 'www.autopartsplus.com'
        },
        {
            id: '3',
            name: 'Chaminda Rathnayake',
            email: 'info@quickfixgarage.lk',
            phone: '+94 76 555 0123',
            businessName: 'Quick Fix Garage',
            location: 'Galle',
            description: 'Modern automotive service center offering quick turnaround times for routine maintenance and repairs.',
            documents: ['business_license.pdf', 'mechanic_certifications.pdf'],
            submittedDate: '2024-01-13',
            type: 'Service Center',
            businessLicense: 'BL-2024-009876',
            taxId: 'TAX-987654321',
            specializations: ['Oil Changes', 'Brake Service', 'Tire Service', 'Battery Replacement'],
            experience: '8 years'
        },
        {
            id: '4',
            name: 'Ruwan Jayasinghe',
            email: 'ruwan@sparesmart.lk',
            phone: '+94 78 444 5555',
            businessName: 'Spare Smart Lanka',
            location: 'Negombo',
            description: 'Online and physical store specializing in imported automotive parts with competitive pricing.',
            documents: ['import_license.pdf', 'business_registration.pdf', 'quality_certificates.pdf'],
            submittedDate: '2024-01-12',
            type: 'Spare Parts Seller',
            businessLicense: 'BL-2024-112233',
            taxId: 'TAX-445566778',
            website: 'www.sparesmart.lk'
        },
        
    ]
}) => {
    const [selectedRequest, setSelectedRequest] = useState<RegistrationRequest | null>(null);
    const [filter, setFilter] = useState<'all' | 'Service Center' | 'Spare Parts Seller'>('all');

    const filteredRequests = filter === 'all'
        ? requests
        : requests.filter(request => request.type === filter);

    const handleApprove = (requestId: string) => {
        console.log('Approving request:', requestId);
        // Implement approval logic
    };

    const handleReject = (requestId: string) => {
        console.log('Rejecting request:', requestId);
        // Implement rejection logic
    };

    const handleViewDetails = (request: RegistrationRequest) => {
        setSelectedRequest(request);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getTypeIcon = (type: string) => {
        return type === 'Service Center' ? <Wrench size={16} /> : <Store size={16} />;
    };

    return (
        <div className="registration-requests">

            <div className="moderation-dashboard__tabs" style={{marginBottom: '32px'}}>
                <button
                    className={`moderation-dashboard__tab ${filter === 'all' ? 'moderation-dashboard__tab--active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    <span className="moderation-dashboard__tab-icon">
                        <Inbox size={'16px'}/>
                    </span>
                    All Requests
                </button>

                <button
                    className={`moderation-dashboard__tab ${filter === 'Service Center' ? 'moderation-dashboard__tab--active' : ''}`}
                    onClick={() => setFilter('Service Center')}
                >
                    <span className="moderation-dashboard__tab-icon">
                        <Wrench />
                    </span>
                    Service Centers
                </button>

                <button
                    className={`moderation-dashboard__tab ${filter === 'Spare Parts Seller' ? 'moderation-dashboard__tab--active' : ''}`}
                    onClick={() => setFilter('Spare Parts Seller')}
                >
                    <span className="moderation-dashboard__tab-icon">
                        <Store />
                    </span>
                    Spare Parts Sellers
                </button>
            </div>

            <div className="registration-requests__grid">
                {filteredRequests.map((request) => (
                    <div key={request.id} className="registration-requests__card">
                        <div className="registration-requests__card-header">
                            <div className="registration-requests__card-type">
                                {getTypeIcon(request.type)}
                                <span>{request.type}</span>
                            </div>
                            <div className="registration-requests__card-date">
                                {formatDate(request.submittedDate)}
                            </div>
                        </div>

                        <div className="registration-requests__card-content">
                            <h3 className="registration-requests__card-title">{request.businessName}</h3>
                            <div className="registration-requests__card-info">
                                <div className="registration-requests__card-detail">
                                    <strong>Owner:</strong> {request.name}
                                </div>
                                <div className="registration-requests__card-detail">
                                    <strong>Location:</strong> {request.location}
                                </div>
                                <div className="registration-requests__card-detail">
                                    <strong>Email:</strong> {request.email}
                                </div>
                                <div className="registration-requests__card-detail">
                                    <strong>Phone:</strong> {request.phone}
                                </div>
                            </div>

                            <p className="registration-requests__card-description">
                                {request.description}
                            </p>

                            {request.specializations && (
                                <div className="registration-requests__card-specializations">
                                    <strong>Specializations:</strong>
                                    <div className="registration-requests__tags">
                                        {request.specializations.slice(0, 3).map((spec, index) => (
                                            <span key={index} className="registration-requests__tag">
                                                {spec}
                                            </span>
                                        ))}
                                        {request.specializations.length > 3 && (
                                            <span className="registration-requests__tag registration-requests__tag--more">
                                                +{request.specializations.length - 3} more
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="registration-requests__card-documents">
                                <strong>Documents:</strong> {request.documents.length} files submitted
                            </div>
                        </div>

                        <div className="registration-requests__card-actions">
                            <button
                                className="registration-requests__action-btn registration-requests__action-btn--view"
                                onClick={() => handleViewDetails(request)}
                            >
                                <Eye size={16} />
                                View Details
                            </button>
                            <button
                                className="registration-requests__action-btn registration-requests__action-btn--approve"
                                onClick={() => handleApprove(request.id)}
                            >
                                <CheckCircle size={16} />
                                Approve
                            </button>
                            <button
                                className="registration-requests__action-btn registration-requests__action-btn--reject"
                                onClick={() => handleReject(request.id)}
                            >
                                <XCircle size={16} />
                                Reject
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {selectedRequest && (
                <div className="registration-requests__modal-overlay" onClick={() => setSelectedRequest(null)}>
                    <div className="registration-requests__modal" onClick={(e) => e.stopPropagation()}>
                        <div className="registration-requests__modal-header">
                            <h3>Registration Request Details</h3>
                            <button
                                className="registration-requests__modal-close"
                                onClick={() => setSelectedRequest(null)}
                            >
                                ×
                            </button>
                        </div>

                        <div className="registration-requests__modal-content">
                            <div className="registration-requests__modal-section">
                                <h4>Business Information</h4>
                                <div className="registration-requests__modal-grid">
                                    <div>
                                        <strong>Business Name:</strong>
                                        <p>{selectedRequest.businessName}</p>
                                    </div>
                                    <div>
                                        <strong>Type:</strong>
                                        <p>{selectedRequest.type}</p>
                                    </div>
                                    <div>
                                        <strong>Location:</strong>
                                        <p>{selectedRequest.location}</p>
                                    </div>
                                    <div>
                                        <strong>Business License:</strong>
                                        <p>{selectedRequest.businessLicense}</p>
                                    </div>
                                    <div>
                                        <strong>Tax ID:</strong>
                                        <p>{selectedRequest.taxId}</p>
                                    </div>
                                    {selectedRequest.website && (
                                        <div>
                                            <strong>Website:</strong>
                                            <p>{selectedRequest.website}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="registration-requests__modal-section">
                                <h4>Owner Information</h4>
                                <div className="registration-requests__modal-grid">
                                    <div>
                                        <strong>Name:</strong>
                                        <p>{selectedRequest.name}</p>
                                    </div>
                                    <div>
                                        <strong>Email:</strong>
                                        <p>{selectedRequest.email}</p>
                                    </div>
                                    <div>
                                        <strong>Phone:</strong>
                                        <p>{selectedRequest.phone}</p>
                                    </div>
                                    {selectedRequest.experience && (
                                        <div>
                                            <strong>Experience:</strong>
                                            <p>{selectedRequest.experience}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="registration-requests__modal-section">
                                <h4>Description</h4>
                                <p>{selectedRequest.description}</p>
                            </div>

                            {selectedRequest.specializations && (
                                <div className="registration-requests__modal-section">
                                    <h4>Specializations</h4>
                                    <div className="registration-requests__tags">
                                        {selectedRequest.specializations.map((spec, index) => (
                                            <span key={index} className="registration-requests__tag">
                                                {spec}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="registration-requests__modal-section">
                                <h4>Submitted Documents</h4>
                                <div className="registration-requests__documents">
                                    {selectedRequest.documents.map((doc, index) => (
                                        <div key={index} className="registration-requests__document">
                                            <span>{doc}</span>
                                            <button className="registration-requests__document-btn">
                                                Download
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="registration-requests__modal-actions">
                            <button
                                className="registration-requests__action-btn registration-requests__action-btn--approve"
                                onClick={() => {
                                    handleApprove(selectedRequest.id);
                                    setSelectedRequest(null);
                                }}
                            >
                                <CheckCircle size={16} />
                                Approve Request
                            </button>
                            <button
                                className="registration-requests__action-btn registration-requests__action-btn--reject"
                                onClick={() => {
                                    handleReject(selectedRequest.id);
                                    setSelectedRequest(null);
                                }}
                            >
                                <XCircle size={16} />
                                Reject Request
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RegistrationRequests;