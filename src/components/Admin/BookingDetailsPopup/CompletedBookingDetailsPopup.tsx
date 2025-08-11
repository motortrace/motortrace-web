import React from 'react';
import './BookingDetailsPopup.scss'; // Reusing the same styles

// Define detailed completed booking interface
interface CompletedBookingDetails {
    id: string;
    bookedDate: string;
    checkInDate: string;
    completedDate: string;
    status: 'Completed';
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
        mileageAtCheckIn: number;
        mileageAtCompletion: number;
        fuelLevel: string;
        vehicleConditionNotes?: string;
    };
    serviceAdvisor: {
        technicianId: string;
        name: string;
        contactNumber: string;
    };
    completedServices: {
        serviceId: string;
        name: string;
        description: string;
        estimatedDurationMinutes: number;
        actualDurationMinutes: number;
        estimatedCost: number;
        actualCost: number;
        status: 'completed';
        completedTasks: {
            subTaskId: string;
            description: string;
            assignedTechnician: {
                technicianId: string;
                name: string;
                contactNumber: string;
            };
            startedAt: string;
            completedAt: string;
            actualDuration: number;
            partsUsed: {
                partId: string;
                name: string;
                quantity: number;
                costPerUnit: number;
                totalCost: number;
                source: 'inventory' | 'ordered' | 'customer-provided';
            }[];
            notes?: string;
        }[];
    }[];
    additionalServices: {
        serviceId: string;
        name: string;
        description: string;
        priority: 'low' | 'medium' | 'high' | 'critical';
        identifiedBy: string;
        identifiedAt: string;
        estimatedCost: number;
        actualCost: number;
        actualDuration: number;
        customerApprovalStatus: 'approved';
        approvedAt: string;
        recommendationNotes: string;
    }[];
    payments: {
        originalEstimatedAmount: number;
        additionalServicesAmount: number;
        totalAmount: number;
        advancePaid?: number; // Optional - only if advance was required
        finalPayment: number;
        paymentMethod: string;
        paymentStatus: 'paid' | 'partially-paid' | 'pending';
        paymentRequired: boolean;
        paymentReason?: string;
        transactionDetails: {
            transactionId?: string;
            paidAt?: string;
        };
    };
    serviceQuality: {
        rating?: number;
        feedback?: string;
        ratedAt?: string;
    };
    deliveryDetails: {
        deliveredAt: string;
        deliveredTo: string;
        deliveryNotes?: string;
    };
    totalServiceTime: {
        estimatedMinutes: number;
        actualMinutes: number;
    };
    warranty: {
        warrantyPeriodDays: number;
        warrantyItems: string[];
        warrantyExpiresAt: string;
    };
}

interface CompletedBookingDetailsPopupProps {
    booking: CompletedBookingDetails;
    isOpen: boolean;
    onClose: () => void;
}

const CompletedBookingDetailsPopup: React.FC<CompletedBookingDetailsPopupProps> = ({
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
            case 'completed': return 'status--completed';
            case 'paid': return 'status--completed';
            case 'partially-paid': return 'status--pending';
            case 'pending': return 'status--cancelled';
            default: return 'status--completed';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority.toLowerCase()) {
            case 'critical': return 'priority--critical';
            case 'high': return 'priority--high';
            case 'medium': return 'priority--medium';
            case 'low': return 'priority--low';
            default: return 'priority--medium';
        }
    };

    const renderStars = (rating?: number) => {
        if (!rating) return <span className="no-rating">No rating provided</span>;
        
        return (
            <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        className={`star ${star <= rating ? 'star--filled' : 'star--empty'}`}
                    >
                        ★
                    </span>
                ))}
                <span className="rating-number">({rating}/5)</span>
            </div>
        );
    };

    const isWarrantyActive = (warrantyExpiresAt: string) => {
        return new Date(warrantyExpiresAt) > new Date();
    };

    const getDaysUntilWarrantyExpiry = (warrantyExpiresAt: string) => {
        const expiryDate = new Date(warrantyExpiresAt);
        const today = new Date();
        const diffTime = expiryDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const renderCompletedServices = (services: CompletedBookingDetails['completedServices']) => {
        return services.map((service) => (
            <div key={service.serviceId} className="booking-popup__service-item">
                <div className="booking-popup__service-header">
                    <div className="booking-popup__service-title">
                        <h4>{service.name}</h4>
                        <span className={`booking-popup__service-status ${getStatusColor(service.status)}`}>
                            {service.status}
                        </span>
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
                        <span className="booking-popup__label">Actual Duration:</span>
                        <span className="booking-popup__value">{formatDuration(service.actualDurationMinutes)}</span>
                    </div>
                    <div className="booking-popup__info-item">
                        <span className="booking-popup__label">Estimated Cost:</span>
                        <span className="booking-popup__value booking-popup__price">{formatCurrency(service.estimatedCost)}</span>
                    </div>
                    <div className="booking-popup__info-item">
                        <span className="booking-popup__label">Actual Cost:</span>
                        <span className="booking-popup__value booking-popup__price">{formatCurrency(service.actualCost)}</span>
                    </div>
                </div>
                
                {/* Completed tasks */}
                {service.completedTasks.length > 0 && (
                    <div className="booking-popup__subtasks">
                        <h5 className="booking-popup__subtasks-title">Completed Tasks:</h5>
                        {service.completedTasks.map((task) => (
                            <div key={task.subTaskId} className="booking-popup__subtask">
                                <div className="booking-popup__subtask-header">
                                    <span className="booking-popup__subtask-description">{task.description}</span>
                                    <span className={`booking-popup__subtask-status ${getStatusColor('completed')}`}>
                                        completed
                                    </span>
                                </div>
                                
                                <div className="booking-popup__subtask-details">
                                    <div className="booking-popup__technician">
                                        <span className="booking-popup__label">Technician:</span>
                                        <span className="booking-popup__value">{task.assignedTechnician.name}</span>
                                        <span className="booking-popup__contact">({task.assignedTechnician.contactNumber})</span>
                                    </div>
                                    <div className="booking-popup__timing">
                                        <span className="booking-popup__label">Duration:</span>
                                        <span className="booking-popup__value">{formatDuration(task.actualDuration)}</span>
                                    </div>
                                    <div className="booking-popup__timing">
                                        <span className="booking-popup__label">Started:</span>
                                        <span className="booking-popup__value">{formatDateTime(task.startedAt)}</span>
                                    </div>
                                    <div className="booking-popup__timing">
                                        <span className="booking-popup__label">Completed:</span>
                                        <span className="booking-popup__value">{formatDateTime(task.completedAt)}</span>
                                    </div>
                                    
                                </div>
                                {task.notes && (
                                        <div className="booking-popup__notes">
                                            <span className="booking-popup__label" style = {{marginRight: '10px'}}>Notes:</span>
                                            <span className="booking-popup__value">{task.notes}</span>
                                        </div>
                                    )}

                                {/* Parts used */}
                                {task.partsUsed.length > 0 && (
                                    <div className="booking-popup__parts">
                                        <span className="booking-popup__parts-title">Parts Used:</span>
                                        <div className="booking-popup__parts-list">
                                            {task.partsUsed.map((part) => (
                                                <div key={part.partId} className="booking-popup__part">
                                                    <span className="booking-popup__part-name">{part.name}</span>
                                                    <span className="booking-popup__part-qty">Qty: {part.quantity}</span>
                                                    <span className="booking-popup__part-cost">
                                                        {formatCurrency(part.totalCost)}
                                                    </span>
                                                    <div className="booking-popup__part-tags">
                                                        <span className={`booking-popup__part-tag source-${part.source}`}>
                                                            {part.source.replace('-', ' ')}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        ));
    };

    const renderAdditionalServices = (services: CompletedBookingDetails['additionalServices']) => {
        return services.map((service) => (
            <div key={service.serviceId} className="booking-popup__service-item booking-popup__additional-service">
                <div className="booking-popup__service-header">
                    <div className="booking-popup__service-title">
                        <h4>{service.name}</h4>
                        <span className="booking-popup__additional-tag">Additional</span>
                        <span className={`booking-popup__priority-tag ${getPriorityColor(service.priority)}`}>
                            {service.priority}
                        </span>
                    </div>
                    <span className={`booking-popup__approval-status ${getStatusColor('completed')}`}>
                        completed
                    </span>
                </div>
                
                <p className="booking-popup__service-description">{service.description}</p>
                
                <div className="booking-popup__service-details">
                    <div className="booking-popup__info-item">
                        <span className="booking-popup__label">Identified By:</span>
                        <span className="booking-popup__value">{service.identifiedBy}</span>
                    </div>
                    <div className="booking-popup__info-item">
                        <span className="booking-popup__label">Identified At:</span>
                        <span className="booking-popup__value">{formatDateTime(service.identifiedAt)}</span>
                    </div>
                    <div className="booking-popup__info-item">
                        <span className="booking-popup__label">Approved At:</span>
                        <span className="booking-popup__value">{formatDateTime(service.approvedAt)}</span>
                    </div>
                    <div className="booking-popup__info-item">
                        <span className="booking-popup__label">Actual Duration:</span>
                        <span className="booking-popup__value">{formatDuration(service.actualDuration)}</span>
                    </div>
                    <div className="booking-popup__info-item">
                        <span className="booking-popup__label">Estimated Cost:</span>
                        <span className="booking-popup__value booking-popup__price">{formatCurrency(service.estimatedCost)}</span>
                    </div>
                    <div className="booking-popup__info-item">
                        <span className="booking-popup__label">Actual Cost:</span>
                        <span className="booking-popup__value booking-popup__price">{formatCurrency(service.actualCost)}</span>
                    </div>
                </div>
                
                <div className="booking-popup__recommendation">
                    <span className="booking-popup__label">Service Notes:</span>
                    <p className="booking-popup__recommendation-text">{service.recommendationNotes}</p>
                </div>
            </div>
        ));
    };

    return (
        <div className="booking-popup-overlay" onClick={onClose}>
            <div className="booking-popup" onClick={(e) => e.stopPropagation()}>
                <div className="booking-popup__header">
                    <h2 className="booking-popup__title">Completed Booking Details</h2>
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
                                        <span className="booking-popup__label">Check-in Date:</span>
                                        <span className="booking-popup__value">{formatDateTime(booking.checkInDate)}</span>
                                    </div>
                                    <div className="booking-popup__info-item">
                                        <span className="booking-popup__label">Completed Date:</span>
                                        <span className="booking-popup__value">{formatDateTime(booking.completedDate)}</span>
                                    </div>
                                    <div className="booking-popup__info-item">
                                        <span className="booking-popup__label">Service Advisor:</span>
                                        <span className="booking-popup__value">{booking.serviceAdvisor.name}</span>
                                    </div>
                                    <div className="booking-popup__info-item">
                                        <span className="booking-popup__label">Advisor Contact:</span>
                                        <span className="booking-popup__value">{booking.serviceAdvisor.contactNumber}</span>
                                    </div>
                                </div>
                                
                                {/* Service Time Comparison */}
                                <div className="booking-popup__time-comparison">
                                    <h3 className="booking-popup__card-title" style={{marginTop: '20px'}}>Service Time Analysis</h3>
                                    {/* <h4>Service Time Analysis</h4> */}
                                    <div className="booking-popup__info-grid">
                                        <div className="booking-popup__info-item">
                                            <span className="booking-popup__label">Estimated Time:</span>
                                            <span className="booking-popup__value">{formatDuration(booking.totalServiceTime.estimatedMinutes)}</span>
                                        </div>
                                        <div className="booking-popup__info-item">
                                            <span className="booking-popup__label">Actual Time:</span>
                                            <span className="booking-popup__value">{formatDuration(booking.totalServiceTime.actualMinutes)}</span>
                                        </div>
                                        <div className="booking-popup__info-item">
                                            <span className="booking-popup__label">Time Variance:</span>
                                            <span className={`booking-popup__value ${booking.totalServiceTime.actualMinutes > booking.totalServiceTime.estimatedMinutes ? 'time-over' : 'time-under'}`}>
                                                {booking.totalServiceTime.actualMinutes > booking.totalServiceTime.estimatedMinutes ? '+' : ''}
                                                {formatDuration(Math.abs(booking.totalServiceTime.actualMinutes - booking.totalServiceTime.estimatedMinutes))}
                                            </span>
                                        </div>
                                    </div>
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
                                    <div className="booking-popup__info-item">
                                        <span className="booking-popup__label">Mileage (Check-in):</span>
                                        <span className="booking-popup__value">{booking.vehicle.mileageAtCheckIn.toLocaleString()} km</span>
                                    </div>
                                    <div className="booking-popup__info-item">
                                        <span className="booking-popup__label">Mileage (Completion):</span>
                                        <span className="booking-popup__value">{booking.vehicle.mileageAtCompletion.toLocaleString()} km</span>
                                    </div>
                                    <div className="booking-popup__info-item">
                                        <span className="booking-popup__label">Fuel Level:</span>
                                        <span className="booking-popup__value">{booking.vehicle.fuelLevel}</span>
                                    </div>
                                    {booking.vehicle.vehicleConditionNotes && (
                                        <div className="booking-popup__info-item">
                                            <span className="booking-popup__label">Final Condition:</span>
                                            <span className="booking-popup__value">{booking.vehicle.vehicleConditionNotes}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Service Quality & Feedback */}
                            <div className="booking-popup__card">
                                <h3 className="booking-popup__card-title">Service Quality</h3>
                                <div className="booking-popup__info-grid">
                                    <div className="booking-popup__info-item">
                                        <span className="booking-popup__label">Customer Rating:</span>
                                        <div className="booking-popup__value">
                                            {renderStars(booking.serviceQuality.rating)}
                                        </div>
                                    </div>
                                    {booking.serviceQuality.ratedAt && (
                                        <div className="booking-popup__info-item">
                                            <span className="booking-popup__label">Rated At:</span>
                                            <span className="booking-popup__value">{formatDateTime(booking.serviceQuality.ratedAt)}</span>
                                        </div>
                                    )}
                                </div>
                                {booking.serviceQuality.feedback && (
                                    <div className="booking-popup__feedback">
                                        <span className="booking-popup__label">Customer Feedback:</span>
                                        <p className="booking-popup__feedback-text">{booking.serviceQuality.feedback}</p>
                                    </div>
                                )}
                            </div>

                            {/* Delivery Details */}
                            <div className="booking-popup__card">
                                <h3 className="booking-popup__card-title">Delivery Details</h3>
                                <div className="booking-popup__info-grid">
                                    <div className="booking-popup__info-item">
                                        <span className="booking-popup__label">Delivered At:</span>
                                        <span className="booking-popup__value">{formatDateTime(booking.deliveryDetails.deliveredAt)}</span>
                                    </div>
                                    <div className="booking-popup__info-item">
                                        <span className="booking-popup__label">Delivered To:</span>
                                        <span className="booking-popup__value">{booking.deliveryDetails.deliveredTo}</span>
                                    </div>
                                </div>
                                {booking.deliveryDetails.deliveryNotes && (
                                    <div className="booking-popup__delivery-notes">
                                        <span className="booking-popup__label">Delivery Notes:</span>
                                        <p className="booking-popup__notes">{booking.deliveryDetails.deliveryNotes}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="booking-popup__column">
                            {/* Completed Services */}
                            <div className="booking-popup__card">
                                <h3 className="booking-popup__card-title">Completed Services</h3>
                                <div className="booking-popup__services">
                                    {renderCompletedServices(booking.completedServices)}
                                </div>
                            </div>

                            {/* Additional Services */}
                            {booking.additionalServices.length > 0 && (
                                <div className="booking-popup__card">
                                    <h3 className="booking-popup__card-title">Additional Services Completed</h3>
                                    <div className="booking-popup__services">
                                        {renderAdditionalServices(booking.additionalServices)}
                                    </div>
                                </div>
                            )}

                            {/* Payment Details */}
                            <div className="booking-popup__card">
                                <h3 className="booking-popup__card-title">Payment Summary</h3>
                                <div className="booking-popup__info-grid">
                                    <div className="booking-popup__info-item">
                                        <span className="booking-popup__label">Original Estimated:</span>
                                        <span className="booking-popup__value booking-popup__price">
                                            {formatCurrency(booking.payments.originalEstimatedAmount)}
                                        </span>
                                    </div>
                                    {booking.payments.additionalServicesAmount > 0 && (
                                        <div className="booking-popup__info-item">
                                            <span className="booking-popup__label">Additional Services:</span>
                                            <span className="booking-popup__value booking-popup__price">
                                                {formatCurrency(booking.payments.additionalServicesAmount)}
                                            </span>
                                        </div>
                                    )}
                                    <div className="booking-popup__info-item">
                                        <span className="booking-popup__label">Total Amount:</span>
                                        <span className="booking-popup__value booking-popup__price">
                                            {formatCurrency(booking.payments.totalAmount)}
                                        </span>
                                    </div>
                                    {booking.payments.advancePaid && (
                                        <div className="booking-popup__info-item">
                                            <span className="booking-popup__label">Advance Paid:</span>
                                            <span className="booking-popup__value booking-popup__price">
                                                {formatCurrency(booking.payments.advancePaid)}
                                            </span>
                                        </div>
                                    )}
                                    <div className="booking-popup__info-item">
                                        <span className="booking-popup__label">Final Payment:</span>
                                        <span className="booking-popup__value booking-popup__price">
                                            {formatCurrency(booking.payments.finalPayment)}
                                        </span>
                                    </div>
                                    <div className="booking-popup__info-item">
                                        <span className="booking-popup__label">Advance Required:</span>
                                        <span className={`booking-popup__status ${booking.payments.paymentRequired ? 'status--pending' : 'status--completed'}`}>
                                            {booking.payments.paymentRequired ? 'Yes' : 'No'}
                                        </span>
                                    </div>
                                    {booking.payments.paymentReason && (
                                        <div className="booking-popup__info-item">
                                            <span className="booking-popup__label">Payment Reason:</span>
                                            <span className="booking-popup__value">{booking.payments.paymentReason}</span>
                                        </div>
                                    )}
                                    <div className="booking-popup__info-item">
                                        <span className="booking-popup__label">Payment Method:</span>
                                        <span className="booking-popup__value">{booking.payments.paymentMethod}</span>
                                    </div>
                                    <div className="booking-popup__info-item">
                                        <span className="booking-popup__label">Payment Status:</span>
                                        <span className={`booking-popup__status ${getStatusColor(booking.payments.paymentStatus)}`}>
                                            {booking.payments.paymentStatus.replace('-', ' ')}
                                        </span>
                                    </div>
                                    {booking.payments.transactionDetails.transactionId && (
                                        <div className="booking-popup__info-item">
                                            <span className="booking-popup__label">Transaction ID:</span>
                                            <span className="booking-popup__value">{booking.payments.transactionDetails.transactionId}</span>
                                        </div>
                                    )}
                                    {booking.payments.transactionDetails.paidAt && (
                                        <div className="booking-popup__info-item">
                                            <span className="booking-popup__label">Paid At:</span>
                                            <span className="booking-popup__value">{formatDateTime(booking.payments.transactionDetails.paidAt)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Warranty Information */}
                            <div className="booking-popup__card">
                                <h3 className="booking-popup__card-title">Warranty Information</h3>
                                <div className="booking-popup__info-grid">
                                    <div className="booking-popup__info-item">
                                        <span className="booking-popup__label">Warranty Period:</span>
                                        <span className="booking-popup__value">{booking.warranty.warrantyPeriodDays} days</span>
                                    </div>
                                    <div className="booking-popup__info-item">
                                        <span className="booking-popup__label">Warranty Status:</span>
                                        <span className={`booking-popup__status ${isWarrantyActive(booking.warranty.warrantyExpiresAt) ? 'status--completed' : 'status--cancelled'}`}>
                                            {isWarrantyActive(booking.warranty.warrantyExpiresAt) ? 'Active' : 'Expired'}
                                        </span>
                                    </div>
                                    <div className="booking-popup__info-item">
                                        <span className="booking-popup__label">Expires At:</span>
                                        <span className="booking-popup__value">{formatDate(booking.warranty.warrantyExpiresAt)}</span>
                                    </div>
                                    {isWarrantyActive(booking.warranty.warrantyExpiresAt) && (
                                        <div className="booking-popup__info-item">
                                            <span className="booking-popup__label">Days Remaining:</span>
                                            <span className="booking-popup__value">
                                                {getDaysUntilWarrantyExpiry(booking.warranty.warrantyExpiresAt)} days
                                            </span>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="booking-popup__warranty-items">
                                    <span className="booking-popup__label">Covered Items:</span>
                                    <ul className="booking-popup__warranty-list">
                                        {booking.warranty.warrantyItems.map((item, index) => (
                                            <li key={index} className="booking-popup__warranty-item">
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompletedBookingDetailsPopup;