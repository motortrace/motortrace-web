import React from 'react';
import { 
    ClipboardList, 
    User, 
    Building2, 
    Wrench, 
    FileText, 
    DollarSign, 
    BarChart3,
    CheckCircle,
    AlertTriangle,
    XCircle,
    X,
    Undo2

} from 'lucide-react';
import './RefundDetailsPopup.scss';

interface RefundBooking {
    id: string;
    cancelledDate: string;
    checkInDate: string;
    customerName: string;
    vehicle: {
        make: string;
        model: string;
        year: number;
    };
    serviceType: string;
    advanceAmount: number;
    refundStatus: 'Pending' | 'Processed' | 'Completed';
    refundEligibility: '100%' | '50%' | '0%';
    daysBeforeCheckIn: number;
    refundBreakdown: {
        customerRefund: number;
        platformCommission: number;
        serviceCenterPayout: number;
    };
    customer: {
        name: string;
        email: string;
        contactNumber: string;
    };
    serviceCenter: {
        name: string;
        email: string;
        contact: string;
        address: string;
    };
    service: {
        name: string;
        description: string;
    };
}

interface RefundDetailsPopupProps {
    refund: RefundBooking;
    isOpen: boolean;
    onClose: () => void;
}

const RefundDetailsPopup: React.FC<RefundDetailsPopupProps> = ({ refund, isOpen, onClose }) => {
    if (!isOpen) return null;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-LK', {
            style: 'currency',
            currency: 'LKR',
            minimumFractionDigits: 2
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-LK', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getRefundPolicyMessage = () => {
        const days = refund.daysBeforeCheckIn;
        if (days >= 7) {
            return "100% refund applicable - Booking was cancelled 7 or more days before the scheduled check-in date. Full refund will be processed as per our policy.";
        } else if (days >= 3) {
            return "50% refund applicable - Booking was cancelled 3-7 days before check-in. Platform retains 8% commission, 42% goes to service center.";
        } else {
            return "No refund applicable - Booking was cancelled less than 3 days before check-in. 92% goes to service center, 8% platform commission retained.";
        }
    };

    const getRefundPolicyIcon = () => {
        const days = refund.daysBeforeCheckIn;
        if (days >= 7) return <CheckCircle className="refund-popup__policy-icon-svg" />;
        if (days >= 3) return <AlertTriangle className="refund-popup__policy-icon-svg" />;
        return <XCircle className="refund-popup__policy-icon-svg" />;
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };

    React.useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown as any);
            document.body.style.overflow = 'hidden';
        }
        
        return () => {
            document.removeEventListener('keydown', handleKeyDown as any);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <div className="refund-popup-overlay" onClick={handleBackdropClick}>
            <div className="refund-popup" role="dialog" aria-modal="true" aria-labelledby="refund-popup-title">
                <div className="refund-popup__header">
                    <h2 id="refund-popup-title" className="refund-popup__title">
                        <Undo2 />Refund Details
                    </h2>
                    <button 
                        className="refund-popup__close-btn" 
                        onClick={onClose}
                        aria-label="Close refund details popup"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="refund-popup__content">
                    {/* Booking Information */}
                    <div className="refund-popup__section">
                        <h3 className="refund-popup__section-title">
                            <ClipboardList size={18} className="refund-popup__section-icon" />
                            Booking Information
                        </h3>
                        <div className="refund-popup__info-grid">
                            <div className="refund-popup__info-item refund-popup__info-item--highlight">
                                <span className="refund-popup__info-label">Booking ID</span>
                                <span className="refund-popup__info-value">#{refund.id}</span>
                            </div>
                            <div className="refund-popup__info-item">
                                <span className="refund-popup__info-label">Service Type</span>
                                <span className="refund-popup__info-value">{refund.serviceType}</span>
                            </div>
                            <div className="refund-popup__info-item">
                                <span className="refund-popup__info-label">Vehicle</span>
                                <span className="refund-popup__info-value">
                                    {refund.vehicle.make} {refund.vehicle.model} ({refund.vehicle.year})
                                </span>
                            </div>
                            <div className="refund-popup__info-item">
                                <span className="refund-popup__info-label">Check-in Date</span>
                                <span className="refund-popup__info-value">{formatDate(refund.checkInDate)}</span>
                            </div>
                            <div className="refund-popup__info-item">
                                <span className="refund-popup__info-label">Cancellation Date</span>
                                <span className="refund-popup__info-value">{formatDate(refund.cancelledDate)}</span>
                            </div>
                            <div className="refund-popup__info-item">
                                <span className="refund-popup__info-label">Days Before Check-in</span>
                                <span className="refund-popup__info-value">
                                    {refund.daysBeforeCheckIn} {refund.daysBeforeCheckIn === 1 ? 'day' : 'days'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Customer Information */}
                    <div className="refund-popup__section">
                        <h3 className="refund-popup__section-title">
                            <User size={18} className="refund-popup__section-icon" />
                            Customer Information
                        </h3>
                        <div className="refund-popup__info-grid">
                            <div className="refund-popup__info-item">
                                <span className="refund-popup__info-label">Full Name</span>
                                <span className="refund-popup__info-value">{refund.customer.name}</span>
                            </div>
                            <div className="refund-popup__info-item">
                                <span className="refund-popup__info-label">Email Address</span>
                                <span className="refund-popup__info-value">{refund.customer.email}</span>
                            </div>
                            <div className="refund-popup__info-item">
                                <span className="refund-popup__info-label">Contact Number</span>
                                <span className="refund-popup__info-value">{refund.customer.contactNumber}</span>
                            </div>
                        </div>
                    </div>

                    {/* Service Center Information */}
                    <div className="refund-popup__section">
                        <h3 className="refund-popup__section-title">
                            <Building2 size={18} className="refund-popup__section-icon" />
                            Service Center Information
                        </h3>
                        <div className="refund-popup__info-grid">
                            <div className="refund-popup__info-item">
                                <span className="refund-popup__info-label">Service Center Name</span>
                                <span className="refund-popup__info-value">{refund.serviceCenter.name}</span>
                            </div>
                            <div className="refund-popup__info-item">
                                <span className="refund-popup__info-label">Email Address</span>
                                <span className="refund-popup__info-value">{refund.serviceCenter.email}</span>
                            </div>
                            <div className="refund-popup__info-item">
                                <span className="refund-popup__info-label">Contact Number</span>
                                <span className="refund-popup__info-value">{refund.serviceCenter.contact}</span>
                            </div>
                            <div className="refund-popup__info-item refund-popup__info-item--full">
                                <span className="refund-popup__info-label">Service Center Address</span>
                                <span className="refund-popup__info-value">{refund.serviceCenter.address}</span>
                            </div>
                        </div>
                    </div>

                    {/* Service Details */}
                    <div className="refund-popup__section">
                        <h3 className="refund-popup__section-title">
                            <Wrench size={18} className="refund-popup__section-icon" />
                            Service Details
                        </h3>
                        <div className="refund-popup__info-grid">
                            <div className="refund-popup__info-item refund-popup__info-item--full">
                                <span className="refund-popup__info-label">Service Name</span>
                                <span className="refund-popup__info-value">{refund.service.name}</span>
                            </div>
                            <div className="refund-popup__info-item refund-popup__info-item--full">
                                <span className="refund-popup__info-label">Service Description</span>
                                <span className="refund-popup__info-value">{refund.service.description}</span>
                            </div>
                        </div>
                    </div>

                    {/* Refund Policy */}
                    <div className="refund-popup__section">
                        <h3 className="refund-popup__section-title">
                            <FileText size={18} className="refund-popup__section-icon" />
                            Applicable Refund Policy
                        </h3>
                        <div className="refund-popup__policy-message">
                            <div className="refund-popup__policy-icon">
                                {getRefundPolicyIcon()}
                            </div>
                            <div className="refund-popup__policy-text">
                                {getRefundPolicyMessage()}
                            </div>
                        </div>
                    </div>

                    {/* Refund Breakdown */}
                    <div className="refund-popup__section">
                        <h3 className="refund-popup__section-title">
                            <DollarSign size={18} className="refund-popup__section-icon" />
                            Financial Breakdown
                        </h3>
                        <div className="refund-popup__breakdown">
                            <div className="refund-popup__breakdown-item">
                                <span className="refund-popup__breakdown-label">Original Advance Payment</span>
                                <span className="refund-popup__breakdown-value refund-popup__breakdown-value--original">
                                    {formatCurrency(refund.advanceAmount)}
                                </span>
                            </div>
                            <div className="refund-popup__breakdown-item">
                                <span className="refund-popup__breakdown-label">Customer Refund Amount</span>
                                <span className="refund-popup__breakdown-value refund-popup__breakdown-value--customer">
                                    {formatCurrency(refund.refundBreakdown.customerRefund)}
                                </span>
                            </div>
                            <div className="refund-popup__breakdown-item">
                                <span className="refund-popup__breakdown-label">Platform Commission</span>
                                <span className="refund-popup__breakdown-value refund-popup__breakdown-value--commission">
                                    {formatCurrency(refund.refundBreakdown.platformCommission)}
                                </span>
                            </div>
                            <div className="refund-popup__breakdown-item">
                                <span className="refund-popup__breakdown-label">Service Center Payout</span>
                                <span className="refund-popup__breakdown-value refund-popup__breakdown-value--payout">
                                    {formatCurrency(refund.refundBreakdown.serviceCenterPayout)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Current Status */}
                    <div className="refund-popup__section">
                        <h3 className="refund-popup__section-title">
                            <BarChart3 size={18} className="refund-popup__section-icon" />
                            Current Refund Status
                        </h3>
                        <div className="refund-popup__status-container">
                            <span className={`refund-popup__status refund-popup__status--${refund.refundStatus.toLowerCase()}`}>
                                {refund.refundStatus}
                            </span>
                            <span className={`refund-popup__eligibility refund-popup__eligibility--${refund.refundEligibility.replace('%', '')}`}>
                                {refund.refundEligibility} Refund Eligible
                            </span>
                        </div>
                    </div>
                </div>

                <div className="refund-popup__footer">
                    <button 
                        className="refund-popup__btn refund-popup__btn--secondary" 
                        onClick={onClose}
                    >
                        Close
                    </button>
                    {refund.refundStatus === 'Pending' && (
                        <button 
                            className="refund-popup__btn refund-popup__btn--primary"
                            onClick={() => {
                                // Handle refund processing logic here
                                console.log('Processing refund for booking:', refund.id);
                            }}
                        >
                            Process Refund
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RefundDetailsPopup;