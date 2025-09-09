import './BookingDetailsPopup.scss'; // Reusing the same SCSS file for consistent styling

// Define detailed cancelled booking interface
interface CancelledBookingDetails {
    id: string;
    bookedDate: string;
    cancelledDate: string;
    status: 'Cancelled';
    customer: {
        name: string;
        email: string;
        contactNumber: string;
    };
    vehicle: {
        make: string;
        model: string;
        year: number;
        licensePlate: string;
        estimatedMileage?: number;
    };
    bookedServices: {
        serviceId: string;
        name: string;
        description: string;
        estimatedDurationMinutes: number;
        estimatedCost: number;
        category: string;
    }[];
    cancellationDetails: {
        cancelledBy: 'Customer' | 'Service Center';
        cancellationReason: string;
        cancelledAt: string;
        cancellationNotes?: string;
        staffMemberName?: string; // If cancelled by service center
        customerCancellationHistory: number;
        isRepeatCanceller: boolean;
    };
    payments: {
        originalEstimatedAmount: number;
        advanceRequired: boolean;
        advancePaid?: number;
        cancellationFee?: number;
        refundAmount?: number;
        refundStatus?: 'Processed' | 'Pending' | 'Partially Refunded' | 'Not Applicable';
        refundProcessedDate?: string;
        refundMethod?: string;
    };
    bookingConfirmation: {
        confirmationSent: boolean;
        confirmationSentAt?: string;
        customerConfirmed: boolean;
        customerConfirmedAt?: string;
        remindersSent: number;
        lastReminderSentAt?: string;
    };
    bookingNotes?: string;
    preferredCheckInTime: string;
}

interface CancelledBookingDetailsPopupProps {
    booking: CancelledBookingDetails;
    isOpen: boolean;
    onClose: () => void;
}

const CancelledBookingDetailsPopup: React.FC<CancelledBookingDetailsPopupProps> = ({
    booking,
    isOpen,
    onClose
}) => {
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
            day: 'numeric'
        });
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-LK', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDuration = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours > 0) {
            return `${hours}h ${mins > 0 ? `${mins}m` : ''}`;
        }
        return `${mins}m`;
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'cancelled': return 'status--cancelled';
            case 'processed': return 'status--completed';
            case 'pending': return 'status--pending';
            case 'partially refunded': return 'status--in-progress';
            case 'not applicable': return 'status--cancelled';
            case 'no payment required': return 'status--not-applicable';
            default: return 'status--cancelled';
        }
    };

    const getCancelledByColor = (cancelledBy: string) => {
        return cancelledBy === 'Customer' ? 'cancelled-by--customer' : 'cancelled-by--service-center';
    };

    const getCustomerTypeColor = (isRepeatCanceller: boolean, advanceRequired: boolean) => {
        if (isRepeatCanceller) return 'customer-type--repeat-canceller';
        if (advanceRequired) return 'customer-type--advance-required';
        return 'customer-type--regular';
    };

    const getCustomerTypeLabel = (isRepeatCanceller: boolean, advanceRequired: boolean) => {
        if (isRepeatCanceller) return 'Repeat Canceller';
        if (advanceRequired) return 'Advance Required';
        return 'Regular Customer';
    };

    const renderCancelledBookingServices = (services: CancelledBookingDetails['bookedServices']) => {
        return services.map((service) => (
            <div key={service.serviceId} className="booking-popup__service-item booking-popup__cancelled-service">
                <div className="booking-popup__service-header">
                    <div className="booking-popup__service-title">
                        <h4>{service.name}</h4>
                        <span className="booking-popup__service-category">{service.category}</span>
                        <span className="booking-popup__cancelled-tag">Cancelled</span>
                    </div>
                </div>
                {service.description && (
                    <p className="booking-popup__service-description">{service.description}</p>
                )}
                
                <div className="booking-popup__service-details">
                    <div className="booking-popup__info-item">
                        <span className="booking-popup__label">Estimated Duration:</span>
                        <span className="booking-popup__value">{formatDuration(service.estimatedDurationMinutes)}</span>
                    </div>
                    <div className="booking-popup__info-item">
                        <span className="booking-popup__label">Estimated Cost:</span>
                        <span className="booking-popup__value booking-popup__price">{formatCurrency(service.estimatedCost)}</span>
                    </div>
                </div>
            </div>
        ));
    };

    return (
        <div className="booking-popup-overlay" onClick={onClose}>
            <div className="booking-popup" onClick={(e) => e.stopPropagation()}>
                <div className="booking-popup__header">
                    <h2 className="booking-popup__title">Cancelled Booking Details</h2>
                    <button
                        className="booking-popup__close-btn"
                        onClick={onClose}
                        aria-label="Close popup"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <div className="booking-popup__content">
                    <div className="booking-popup__grid">
                        {/* Left Column */}
                        <div className="booking-popup__column">
                            {/* Basic Booking Details */}
                            <div className="booking-popup__card">
                                <h3 className="booking-popup__card-title">Booking Overview</h3>
                                <div className="booking-popup__info-grid">
                                    <div className="booking-popup__info-item">
                                        <span className="booking-popup__label">Booking ID:</span>
                                        <span className="booking-popup__value">{booking.id}</span>
                                    </div>
                                    <div className="booking-popup__info-item">
                                        <span className="booking-popup__label">Status:</span>
                                        <span className={`booking-popup__status ${getStatusColor(booking.status)}`}>
                                            {booking.status}
                                        </span>
                                    </div>
                                    <div className="booking-popup__info-item">
                                        <span className="booking-popup__label">Booked Date:</span>
                                        <span className="booking-popup__value">{formatDate(booking.bookedDate)}</span>
                                    </div>
                                    <div className="booking-popup__info-item">
                                        <span className="booking-popup__label">Cancelled Date:</span>
                                        <span className="booking-popup__value">{formatDateTime(booking.cancelledDate)}</span>
                                    </div>
                                    <div className="booking-popup__info-item">
                                        <span className="booking-popup__label">Preferred Check-in:</span>
                                        <span className="booking-popup__value">{booking.preferredCheckInTime}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Booking Confirmation & Reminders */}
                            <div className="booking-popup__card">
                                <h3 className="booking-popup__card-title">Booking Confirmation & Reminders</h3>
                                <div className="booking-popup__info-grid">
                                    <div className="booking-popup__info-item">
                                        <span className="booking-popup__label">Confirmation Sent:</span>
                                        <span className={`booking-popup__value ${booking.bookingConfirmation.confirmationSent ? 'text-green-600' : 'text-red-600'}`}>
                                            {booking.bookingConfirmation.confirmationSent ? 'Yes' : 'No'}
                                        </span>
                                    </div>
                                    {booking.bookingConfirmation.confirmationSentAt && (
                                        <div className="booking-popup__info-item">
                                            <span className="booking-popup__label">Confirmation Sent At:</span>
                                            <span className="booking-popup__value">{formatDateTime(booking.bookingConfirmation.confirmationSentAt)}</span>
                                        </div>
                                    )}
                                    <div className="booking-popup__info-item">
                                        <span className="booking-popup__label">Customer Confirmed:</span>
                                        <span className={`booking-popup__value ${booking.bookingConfirmation.customerConfirmed ? 'text-green-600' : 'text-red-600'}`}>
                                            {booking.bookingConfirmation.customerConfirmed ? 'Yes' : 'No'}
                                        </span>
                                    </div>
                                    {booking.bookingConfirmation.customerConfirmedAt && (
                                        <div className="booking-popup__info-item">
                                            <span className="booking-popup__label">Confirmed At:</span>
                                            <span className="booking-popup__value">{formatDateTime(booking.bookingConfirmation.customerConfirmedAt)}</span>
                                        </div>
                                    )}
                                    <div className="booking-popup__info-item">
                                        <span className="booking-popup__label">Reminders Sent:</span>
                                        <span className="booking-popup__value">{booking.bookingConfirmation.remindersSent}</span>
                                    </div>
                                    {booking.bookingConfirmation.lastReminderSentAt && (
                                        <div className="booking-popup__info-item">
                                            <span className="booking-popup__label">Last Reminder:</span>
                                            <span className="booking-popup__value">{formatDateTime(booking.bookingConfirmation.lastReminderSentAt)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Cancellation Details */}
                            <div className="booking-popup__card">
                                <h3 className="booking-popup__card-title">Cancellation Details</h3>
                                <div className="booking-popup__info-grid">
                                    <div className="booking-popup__info-item">
                                        <span className="booking-popup__label">Cancelled By:</span>
                                        <span className={`booking-popup__value cancelled-by-tag ${getCancelledByColor(booking.cancellationDetails.cancelledBy)}`}>
                                            {booking.cancellationDetails.cancelledBy}
                                        </span>
                                    </div>
                                    <div className="booking-popup__info-item">
                                        <span className="booking-popup__label">Cancellation Date & Time:</span>
                                        <span className="booking-popup__value">{formatDateTime(booking.cancellationDetails.cancelledAt)}</span>
                                    </div>
                                    <div className="booking-popup__info-item">
                                        <span className="booking-popup__label">Reason:</span>
                                        <span className="booking-popup__value">{booking.cancellationDetails.cancellationReason}</span>
                                    </div>
                                    {booking.cancellationDetails.staffMemberName && (
                                        <div className="booking-popup__info-item">
                                            <span className="booking-popup__label">Staff Member:</span>
                                            <span className="booking-popup__value">{booking.cancellationDetails.staffMemberName}</span>
                                        </div>
                                    )}
                                    <div className="booking-popup__info-item">
                                        <span className="booking-popup__label">Customer Type:</span>
                                        <span className={`booking-popup__value customer-type-tag ${getCustomerTypeColor(booking.cancellationDetails.isRepeatCanceller, booking.payments.advanceRequired)}`}>
                                            {getCustomerTypeLabel(booking.cancellationDetails.isRepeatCanceller, booking.payments.advanceRequired)}
                                        </span>
                                    </div>
                                    <div className="booking-popup__info-item">
                                        <span className="booking-popup__label">Cancellation History:</span>
                                        <span className="booking-popup__value">
                                            {booking.cancellationDetails.customerCancellationHistory} previous cancellation{booking.cancellationDetails.customerCancellationHistory !== 1 ? 's' : ''}
                                        </span>
                                    </div>
                                </div>
                                
                                {booking.cancellationDetails.cancellationNotes && (
                                    <div className="booking-popup__cancellation-notes">
                                        <span className="booking-popup__label">Cancellation Notes:</span>
                                        <p className="booking-popup__notes">{booking.cancellationDetails.cancellationNotes}</p>
                                    </div>
                                )}
                            </div>

                            {/* Customer Details */}
                            <div className="booking-popup__card">
                                <h3 className="booking-popup__card-title">Customer Details</h3>
                                <div className="booking-popup__info-grid">
                                    <div className="booking-popup__info-item">
                                        <span className="booking-popup__label">Name:</span>
                                        <span className="booking-popup__value">{booking.customer.name}</span>
                                    </div>
                                    <div className="booking-popup__info-item">
                                        <span className="booking-popup__label">Email:</span>
                                        <span className="booking-popup__value">{booking.customer.email}</span>
                                    </div>
                                    <div className="booking-popup__info-item">
                                        <span className="booking-popup__label">Contact:</span>
                                        <span className="booking-popup__value">{booking.customer.contactNumber}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Vehicle Details */}
                            <div className="booking-popup__card">
                                <h3 className="booking-popup__card-title">Vehicle Details</h3>
                                <div className="booking-popup__info-grid">
                                    <div className="booking-popup__info-item">
                                        <span className="booking-popup__label">Make & Model:</span>
                                        <span className="booking-popup__value">{booking.vehicle.make} {booking.vehicle.model}</span>
                                    </div>
                                    <div className="booking-popup__info-item">
                                        <span className="booking-popup__label">Year:</span>
                                        <span className="booking-popup__value">{booking.vehicle.year}</span>
                                    </div>
                                    <div className="booking-popup__info-item">
                                        <span className="booking-popup__label">License Plate:</span>
                                        <span className="booking-popup__value">{booking.vehicle.licensePlate}</span>
                                    </div>
                                    {booking.vehicle.estimatedMileage && (
                                        <div className="booking-popup__info-item">
                                            <span className="booking-popup__label">Estimated Mileage:</span>
                                            <span className="booking-popup__value">{booking.vehicle.estimatedMileage.toLocaleString()} km</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Booking Notes */}
                            {booking.bookingNotes && (
                                <div className="booking-popup__card">
                                    <h3 className="booking-popup__card-title">Original Booking Notes</h3>
                                    <p className="booking-popup__notes">{booking.bookingNotes}</p>
                                </div>
                            )}
                        </div>

                        {/* Right Column */}
                        <div className="booking-popup__column">
                            {/* Cancelled Services */}
                            <div className="booking-popup__card">
                                <h3 className="booking-popup__card-title">Cancelled Services</h3>
                                <div className="booking-popup__services">
                                    {renderCancelledBookingServices(booking.bookedServices)}
                                </div>
                            </div>

                            {/* Payment & Refund Details - Only show if advance was required */}
                            {booking.payments.advanceRequired ? (
                            <div className="booking-popup__card">
                                <h3 className="booking-popup__card-title">Payment & Refund Summary</h3>
                                <div className="booking-popup__info-grid">
                                    <div className="booking-popup__info-item">
                                        <span className="booking-popup__label">Original Estimated Amount:</span>
                                        <span className="booking-popup__value booking-popup__price">
                                            {formatCurrency(booking.payments.originalEstimatedAmount)}
                                        </span>
                                    </div>
                                    <div className="booking-popup__info-item">
                                        <span className="booking-popup__label">Advance Required:</span>
                                        <span className="booking-popup__value text-orange-600">Yes (Repeat Canceller)</span>
                                    </div>
                                    <div className="booking-popup__info-item">
                                        <span className="booking-popup__label">Advance Paid:</span>
                                        <span className="booking-popup__value booking-popup__price">
                                            {formatCurrency(booking.payments.advancePaid || 0)}
                                        </span>
                                    </div>
                                    {booking.payments.cancellationFee && booking.payments.cancellationFee > 0 && (
                                        <div className="booking-popup__info-item">
                                            <span className="booking-popup__label">Cancellation Fee:</span>
                                            <span className="booking-popup__value booking-popup__price booking-popup__price--negative">
                                                -{formatCurrency(booking.payments.cancellationFee)}
                                            </span>
                                        </div>
                                    )}
                                    {booking.payments.refundAmount && booking.payments.refundAmount > 0 && (
                                        <div className="booking-popup__info-item booking-popup__info-item--highlight">
                                            <span className="booking-popup__label">Refund Amount:</span>
                                            <span className="booking-popup__value booking-popup__price booking-popup__price--highlight">
                                                {formatCurrency(booking.payments.refundAmount)}
                                            </span>
                                        </div>
                                    )}
                                    {booking.payments.refundStatus && (
                                        <div className="booking-popup__info-item">
                                            <span className="booking-popup__label">Refund Status:</span>
                                            <span className={`booking-popup__status ${getStatusColor(booking.payments.refundStatus)}`}>
                                                {booking.payments.refundStatus}
                                            </span>
                                        </div>
                                    )}
                                    {booking.payments.refundProcessedDate && (
                                        <div className="booking-popup__info-item">
                                            <span className="booking-popup__label">Refund Processed Date:</span>
                                            <span className="booking-popup__value">{formatDateTime(booking.payments.refundProcessedDate)}</span>
                                        </div>
                                    )}
                                    {booking.payments.refundMethod && (
                                        <div className="booking-popup__info-item">
                                            <span className="booking-popup__label">Refund Method:</span>
                                            <span className="booking-popup__value">{booking.payments.refundMethod}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Refund Calculation Breakdown */}
                                {booking.payments.refundAmount && booking.payments.refundAmount > 0 && (
                                <div className="booking-popup__refund-breakdown">
                                    <h4 className="booking-popup__breakdown-title">Refund Calculation</h4>
                                    <div className="booking-popup__calculation">
                                        <div className="booking-popup__calculation-row">
                                            <span>Advance Payment</span>
                                            <span>{formatCurrency(booking.payments.advancePaid || 0)}</span>
                                        </div>
                                        {booking.payments.cancellationFee && booking.payments.cancellationFee > 0 && (
                                            <div className="booking-popup__calculation-row booking-popup__calculation-row--negative">
                                                <span>Cancellation Fee</span>
                                                <span>-{formatCurrency(booking.payments.cancellationFee)}</span>
                                            </div>
                                        )}
                                        <div className="booking-popup__calculation-row booking-popup__calculation-row--total">
                                            <span>Total Refund</span>
                                            <span>{formatCurrency(booking.payments.refundAmount || 0)}</span>
                                        </div>
                                    </div>
                                </div>
                                )}
                            </div>
                            ) : (
                                /* No Payment Required Card */
                                <div className="booking-popup__card">
                                    <h3 className="booking-popup__card-title">Payment Information</h3>
                                    <div className="booking-popup__info-grid">
                                        <div className="booking-popup__info-item">
                                            <span className="booking-popup__label">Estimated Service Cost:</span>
                                            <span className="booking-popup__value booking-popup__price">
                                                {formatCurrency(booking.payments.originalEstimatedAmount)}
                                            </span>
                                        </div>
                                        <div className="booking-popup__info-item">
                                            <span className="booking-popup__label">Advance Required:</span>
                                            <span className="booking-popup__value text-green-600">No</span>
                                        </div>
                                        <div className="booking-popup__info-item">
                                            <span className="booking-popup__label">Payment Method:</span>
                                            <span className="booking-popup__value">Pay after service completion</span>
                                        </div>
                                    </div>
                                    <div className="booking-popup__no-payment-info">
                                        <p className="booking-popup__info-text">
                                            This booking was made without advance payment as part of our frictionless booking experience. 
                                            Payment would have been collected after service completion.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Updated Cancellation Policy Information */}
                            <div className="booking-popup__card booking-popup__policy-card">
                                <h3 className="booking-popup__card-title">Booking & Cancellation Policy</h3>
                                <div className="booking-popup__policy-info">
                                    <div className="booking-popup__policy-section">
                                        <h4 className="booking-popup__policy-subtitle">Standard Booking Process</h4>
                                        <ul className="booking-popup__policy-list">
                                            <li>No advance payment required for first-time customers</li>
                                            <li>Booking confirmation sent via email and SMS</li>
                                            <li>Automated reminders sent 24 hours and 2 hours before appointment</li>
                                            <li>Customer confirmation required within 24 hours of booking</li>
                                        </ul>
                                    </div>
                                    
                                    <div className="booking-popup__policy-section">
                                        <h4 className="booking-popup__policy-subtitle">Repeat Cancellation Policy</h4>
                                        <ul className="booking-popup__policy-list">
                                            <li>Customers with 2+ cancellations may be required to pay advance</li>
                                            <li>Advance amount: 25% of estimated service cost</li>
                                            <li>Advance refunded if service center cancels</li>
                                            <li>10% cancellation fee applies for customer-initiated cancellations</li>
                                        </ul>
                                    </div>

                                    {booking.payments.advanceRequired ? (
                                        <div className="booking-popup__policy-section">
                                            <h4 className="booking-popup__policy-subtitle">This Booking - Advance Required</h4>
                                            <ul className="booking-popup__policy-list">
                                                <li>Advance payment was required due to cancellation history</li>
                                                <li>Customer had {booking.cancellationDetails.customerCancellationHistory} previous cancellation{booking.cancellationDetails.customerCancellationHistory !== 1 ? 's' : ''}</li>
                                                <li>Refund processed according to cancellation timing</li>
                                            </ul>
                                        </div>
                                    ) : (
                                        <div className="booking-popup__policy-section">
                                            <h4 className="booking-popup__policy-subtitle">This Booking - No Advance Required</h4>
                                            <ul className="booking-popup__policy-list">
                                                <li>No advance payment was required</li>
                                                <li>Customer had good booking history</li>
                                                <li>Payment would be collected after service completion</li>
                                                <li>No financial impact from cancellation</li>
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CancelledBookingDetailsPopup;