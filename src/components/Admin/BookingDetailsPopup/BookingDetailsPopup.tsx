import React from 'react';
import './BookingDetailsPopup.scss';

interface BookingDetails {
    id: string;
    requestedDate: string;
    approvedDate: string;
    checkInDate?: string;
    completedDate?: string;
    status: 'Pending' | 'Approved' | 'Confirmed' | 'Checked In' | 'In Progress' | 'Completed';

    // Customer Details
    customer: {
        name: string;
        email: string;
        contactNumber: string;
    };

    // Car Details
    vehicle: {
        make: string;
        model: string;
        year: number;
        licensePlate: string;
    };

    // Service Center Details
    serviceCenter: {
        name: string;
        email: string;
        contact: string;
        address: string;
        operatingHours: string;
    };

    // Service Details
    service: {
        name: string;
        description: string;
        estimatedPrice: number;
    };

    // Payment Details
    payment: {
        advanceAmount: number;
        paidDate?: string;
        remainingAmount: number;
        isPaid: boolean;
        breakdown?: PaymentBreakdown;
    };

}

interface PaymentBreakdown {
    totalAmount: number;
    advancePaid: number;
    remainingPaid: number;
    commission: number;
    payoutToServiceCenter: number;
}

interface BookingDetailsPopupProps {
    booking: BookingDetails;
    isOpen: boolean;
    onClose: () => void;
}

const BookingDetailsPopup: React.FC<BookingDetailsPopupProps> = ({
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

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending': return 'status--pending';
            case 'approved': return 'status--approved';
            case 'confirmed': return 'status--confirmed';
            case 'checked in': return 'status--checked-in';
            case 'in progress': return 'status--in-progress';
            case 'completed': return 'status--completed';
            default: return 'status--pending';
        }
    };

    return (
        <div className="booking-popup-overlay" onClick={onClose}>
            <div className="booking-popup" onClick={(e) => e.stopPropagation()}>
                <div className="booking-popup__header">
                    <h2 className="booking-popup__title">Booking Details</h2>
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
                                <h3 className="booking-popup__card-title">Booking Information</h3>
                                <div className="booking-popup__info-grid">
                                    <div className="booking-popup__info-item">
                                        <span className="booking-popup__label">Booking ID:</span>
                                        <span className="booking-popup__value">#{booking.id}</span>
                                    </div>
                                    <div className="booking-popup__info-item">
                                        <span className="booking-popup__label">Status:</span>
                                        <span className={`booking-popup__status ${getStatusColor(booking.status)}`}>
                                            {booking.status}
                                        </span>
                                    </div>
                                    <div className="booking-popup__info-item">
                                        <span className="booking-popup__label">Requested Date:</span>
                                        <span className="booking-popup__value">{formatDate(booking.requestedDate)}</span>
                                    </div>
                                    <div className="booking-popup__info-item">
                                        <span className="booking-popup__label">Approved Date:</span>
                                        <span className="booking-popup__value">{formatDate(booking.approvedDate)}</span>
                                    </div>
                                    {booking.checkInDate && (
                                        <div className="booking-popup__info-item">
                                            <span className="booking-popup__label">Check-in Date:</span>
                                            <span className="booking-popup__value">{formatDate(booking.checkInDate)}</span>
                                        </div>
                                    )}
                                    {booking.completedDate && (
                                        <div className="booking-popup__info-item">
                                            <span className="booking-popup__label">Completed Date:</span>
                                            <span className="booking-popup__value">{formatDate(booking.completedDate)}</span>
                                        </div>
                                    )}
                                </div>
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
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="booking-popup__column">
                            {/* Service Center Details */}
                            <div className="booking-popup__card">
                                <h3 className="booking-popup__card-title">Service Center</h3>
                                <div className="booking-popup__info-grid">
                                    <div className="booking-popup__info-item">
                                        <span className="booking-popup__label">Name:</span>
                                        <span className="booking-popup__value">{booking.serviceCenter.name}</span>
                                    </div>
                                    <div className="booking-popup__info-item">
                                        <span className="booking-popup__label">Email:</span>
                                        <span className="booking-popup__value">{booking.serviceCenter.email}</span>
                                    </div>
                                    <div className="booking-popup__info-item">
                                        <span className="booking-popup__label">Contact:</span>
                                        <span className="booking-popup__value">{booking.serviceCenter.contact}</span>
                                    </div>
                                    <div className="booking-popup__info-item">
                                        <span className="booking-popup__label">Address:</span>
                                        <span className="booking-popup__value">{booking.serviceCenter.address}</span>
                                    </div>
                                    <div className="booking-popup__info-item">
                                        <span className="booking-popup__label">Operating Hours:</span>
                                        <span className="booking-popup__value">{booking.serviceCenter.operatingHours}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Service Details */}
                            <div className="booking-popup__card">
                                <h3 className="booking-popup__card-title">Service Details</h3>
                                <div className="booking-popup__info-grid">
                                    <div className="booking-popup__info-item">
                                        <span className="booking-popup__label">Service:</span>
                                        <span className="booking-popup__value">{booking.service.name}</span>
                                    </div>
                                    <div className="booking-popup__info-item booking-popup__info-item--full">
                                        <span className="booking-popup__label">Description:</span>
                                        <span className="booking-popup__value booking-popup__description">
                                            {booking.service.description}
                                        </span>
                                    </div>
                                    <div className="booking-popup__info-item">
                                        <span className="booking-popup__label">Estimated Price:</span>
                                        <span className="booking-popup__value booking-popup__price">
                                            {formatCurrency(booking.service.estimatedPrice)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Details */}
                            <div className="booking-popup__card">
                                <h3 className="booking-popup__card-title">Payment Details</h3>
                                <div className="booking-popup__info-grid">
                                    <div className="booking-popup__info-item">
                                        <span className="booking-popup__label">Total Amount:</span>
                                        <span className="booking-popup__value booking-popup__price">
                                            {formatCurrency(booking.service.estimatedPrice)}
                                        </span>
                                    </div>

                                    <div className="booking-popup__info-item booking-popup__info-item--full" style={{fontSize: '14px', color: '#334155', fontWeight: '600', marginTop: '10px'}}>
                                        Car User Payments
                                    </div>

                                    <div className="booking-popup__info-item">
                                        <span className="booking-popup__label">Advance Paid (25%):</span>
                                        <span className="booking-popup__value booking-popup__price">
                                            {formatCurrency(booking.payment.advanceAmount)}
                                        </span>
                                    </div>

                                    <div className="booking-popup__info-item">
                                        <span className="booking-popup__label">Advance Payment Status:</span>
                                        <span className={`booking-popup__payment-status ${booking.payment.isPaid ? 'paid' : 'unpaid'}`}>
                                            {booking.payment.isPaid ? 'Paid' : 'Unpaid'}
                                        </span>
                                    </div>

                                    {booking.payment.paidDate && (
                                        <div className="booking-popup__info-item">
                                            <span className="booking-popup__label">Advance Amount Paid Date:</span>
                                            <span className="booking-popup__value">{formatDate(booking.payment.paidDate)}</span>
                                        </div>
                                    )}

                                    <div className="booking-popup__info-item">
                                        <span className="booking-popup__label">
                                            {booking.status === "Completed" ? 'Amount Paid to Service Center:' : 'Remaining Amount:'}
                                        </span>
                                        <span className="booking-popup__value booking-popup__price">
                                            {formatCurrency(booking.payment.remainingAmount)}
                                        </span>
                                    </div>

                                    {/* Show breakdown for completed services */}
                                    {booking.payment.breakdown && (
                                        <>
                                            <div className="booking-popup__info-item booking-popup__info-item--full" style={{fontSize: '14px', color: '#334155', fontWeight: '600', marginTop: '10px'}}>
                                                Platform Earnings
                                            </div>

                                            <div className="booking-popup__info-item">
                                                <span className="booking-popup__label">Platform Commission (8%):</span>
                                                <span className="booking-popup__value booking-popup__price">
                                                    {formatCurrency(booking.payment.breakdown.commission)}
                                                </span>
                                            </div>

                                            <div className="booking-popup__info-item booking-popup__info-item--full" style={{fontSize: '14px', color: '#334155', fontWeight: '600', marginTop: '10px'}}>
                                                Payments Due to Service Center
                                            </div>
                                            <div className="booking-popup__info-item">
                                                <span className="booking-popup__label">Amount Payable to Service Center:</span>
                                                <span className="booking-popup__value" style={{ color: '#DC2626' }}>
                                                    {formatCurrency(booking.payment.breakdown.payoutToServiceCenter)}
                                                </span>
                                            </div>


                                        </>
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

export default BookingDetailsPopup;