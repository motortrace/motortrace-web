import React from 'react';
import './BookingDetailsPopup.scss';

// Base interfaces from BookingOversight
interface UpcomingBookingDetails {
    id: string;
    bookedDate: string;
    status: 'Up Coming';
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
    payments: {
        estimatedTotalAmount: number;
        advancePaid?: number; // Optional - only for customers with no-show history
        remainingEstimated?: number;
        paymentRequired: boolean; // Whether advance payment is required
        paymentReason?: string; // Reason for requiring payment (e.g., "History of no-shows")
    };
    bookingNotes?: string;
    preferredCheckInTime: string;
    bookingConfirmation: {
        isConfirmed: boolean;
        confirmedAt?: string;
        confirmationMethod?: 'email' | 'sms' | 'phone';
    };
    customerHistory: {
        totalBookings: number;
        completedBookings: number;
        cancelledBookings: number;
        noShowCount: number;
        lastNoShowDate?: string;
        riskLevel: 'low' | 'medium' | 'high';
    };
    reminders: {
        remindersSent: number;
        lastReminderSent?: string;
        nextReminderScheduled?: string;
    };
}

interface OngoingBookingDetails {
    id: string;
    bookedDate: string;
    checkInDate: string;
    status: 'On Going';
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
        fuelLevel: string;
        vehicleConditionNotes?: string;
    };
    serviceAdvisor: {
        technicianId: string;
        name: string;
        contactNumber: string;
    };
    bookedServices: {
        serviceId: string;
        name: string;
        description: string;
        estimatedDurationMinutes: number;
        estimatedCost: number;
        actualCost?: number;
        status: 'not-started' | 'in-progress' | 'completed';
        subTasks: {
            subTaskId: string;
            description: string;
            assignedTechnician?: {
                technicianId: string;
                name: string;
                contactNumber: string;
            };
            status: 'not-started' | 'in-progress' | 'completed';
            startedAt?: string;
            completedAt?: string;
            estimatedDuration: number;
            partsUsed: {
                partId: string;
                name: string;
                quantity: number;
                costPerUnit: number;
                source: 'inventory' | 'ordered' | 'customer-provided';
                availabilityStatus: 'in-stock' | 'ordered' | 'out-of-stock' | 'provided';
                estimatedArrival?: string;
            }[];
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
        estimatedDuration: number;
        customerApprovalStatus: 'pending' | 'approved' | 'rejected';
        approvedAt?: string;
        rejectedReason?: string;
        recommendationNotes: string;
    }[];
    payments: {
        originalEstimatedAmount: number;
        advancePaid?: number; // Optional - only if advance was required
        additionalServicesAmount: number;
        totalActualAmount?: number;
        remainingAmount?: number;
        paymentRequired: boolean;
        paymentReason?: string;
    };
    jobCardStatus: 'checked-in' | 'inspection-in-progress' | 'work-in-progress' | 'awaiting-parts' | 'awaiting-approval' | 'ready-for-delivery';
    estimatedCompletionTime: string;
    actualProgress: {
        completedTasks: number;
        totalTasks: number;
        overallCompletionPercentage: number;
    };
}

interface BookingDetailsPopupProps {
    booking: UpcomingBookingDetails | OngoingBookingDetails;
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
            case 'up coming': return 'status--pending';
            case 'on going': return 'status--in-progress';
            case 'completed': return 'status--completed';
            case 'cancelled': return 'status--cancelled';
            case 'not-started': return 'status--pending';
            case 'in-progress': return 'status--in-progress';
            case 'pending': return 'status--pending';
            case 'approved': return 'status--completed';
            case 'rejected': return 'status--cancelled';
            default: return 'status--pending';
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

    const getJobCardStatusLabel = (status: string) => {
        switch (status) {
            case 'checked-in': return 'Checked In';
            case 'inspection-in-progress': return 'Inspection in Progress';
            case 'work-in-progress': return 'Work in Progress';
            case 'awaiting-parts': return 'Awaiting Parts';
            case 'awaiting-approval': return 'Awaiting Approval';
            case 'ready-for-delivery': return 'Ready for Delivery';
            default: return status;
        }
    };

    const isUpcomingBooking = (booking: UpcomingBookingDetails | OngoingBookingDetails): booking is UpcomingBookingDetails => {
        return booking.status === 'Up Coming';
    };

    const renderUpcomingBookingServices = (services: UpcomingBookingDetails['bookedServices']) => {
        return services.map((service) => (
            <div key={service.serviceId} className="booking-popup__service-item">
                <div className="booking-popup__service-header">
                    <div className="booking-popup__service-title">
                        <h4>{service.name}</h4>
                        <span className="booking-popup__service-category">{service.category}</span>
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

    const renderOngoingBookingServices = (services: OngoingBookingDetails['bookedServices']) => {
        return services.map((service) => (
            <div key={service.serviceId} className="booking-popup__service-item">
                <div className="booking-popup__service-header">
                    <div className="booking-popup__service-title">
                        <h4>{service.name}</h4>
                        <span className={`booking-popup__service-status ${getStatusColor(service.status)}`}>
                            {service.status.replace('-', ' ')}
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
                        <span className="booking-popup__label">Estimated Cost:</span>
                        <span className="booking-popup__value booking-popup__price">{formatCurrency(service.estimatedCost)}</span>
                    </div>
                    {service.actualCost && (
                        <div className="booking-popup__info-item">
                            <span className="booking-popup__label">Actual Cost:</span>
                            <span className="booking-popup__value booking-popup__price">{formatCurrency(service.actualCost)}</span>
                        </div>
                    )}
                </div>
                
                {/* Sub-tasks for ongoing services */}
                {service.subTasks.length > 0 && (
                    <div className="booking-popup__subtasks">
                        <h5 className="booking-popup__subtasks-title">Tasks:</h5>
                        {service.subTasks.map((subTask) => (
                            <div key={subTask.subTaskId} className="booking-popup__subtask">
                                <div className="booking-popup__subtask-header">
                                    <span className="booking-popup__subtask-description">{subTask.description}</span>
                                    <span className={`booking-popup__subtask-status ${getStatusColor(subTask.status)}`}>
                                        {subTask.status.replace('-', ' ')}
                                    </span>
                                </div>
                                
                                {subTask.assignedTechnician && (
                                    <div className="booking-popup__subtask-details">
                                        <div className="booking-popup__technician">
                                            <span className="booking-popup__label">Technician:</span>
                                            <span className="booking-popup__value">{subTask.assignedTechnician.name}</span>
                                            {subTask.assignedTechnician.contactNumber && (
                                                <span className="booking-popup__contact">({subTask.assignedTechnician.contactNumber})</span>
                                            )}
                                        </div>
                                        <div className="booking-popup__timing">
                                            <span className="booking-popup__label">Estimated Duration:</span>
                                            <span className="booking-popup__value">{formatDuration(subTask.estimatedDuration)}</span>
                                        </div>
                                        {subTask.startedAt && (
                                            <div className="booking-popup__timing">
                                                <span className="booking-popup__label">Started At:</span>
                                                <span className="booking-popup__value">{formatDateTime(subTask.startedAt)}</span>
                                            </div>
                                        )}
                                        {subTask.completedAt && (
                                            <div className="booking-popup__timing">
                                                <span className="booking-popup__label">Completed At:</span>
                                                <span className="booking-popup__value">{formatDateTime(subTask.completedAt)}</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Parts used */}
                                {subTask.partsUsed.length > 0 && (
                                    <div className="booking-popup__parts">
                                        <span className="booking-popup__parts-title">Parts Used:</span>
                                        <div className="booking-popup__parts-list">
                                            {subTask.partsUsed.map((part) => (
                                                <div key={part.partId} className="booking-popup__part">
                                                    <span className="booking-popup__part-name">{part.name}</span>
                                                    <span className="booking-popup__part-qty">Qty: {part.quantity}</span>
                                                    <span className="booking-popup__part-cost">
                                                        {formatCurrency(part.costPerUnit * part.quantity)}
                                                    </span>
                                                    <div className="booking-popup__part-tags">
                                                        <span className={`booking-popup__part-tag source-${part.source}`}>
                                                            {part.source.replace('-', ' ')}
                                                        </span>
                                                        <span className={`booking-popup__part-tag status-${part.availabilityStatus}`}>
                                                            {part.availabilityStatus.replace('-', ' ')}
                                                        </span>
                                                        {part.estimatedArrival && (
                                                            <span className="booking-popup__part-arrival">
                                                                Est. Arrival: {formatDate(part.estimatedArrival)}
                                                            </span>
                                                        )}
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

    const renderAdditionalServices = (services: OngoingBookingDetails['additionalServices']) => {
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
                    <span className={`booking-popup__approval-status ${getStatusColor(service.customerApprovalStatus)}`}>
                        {service.customerApprovalStatus}
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
                        <span className="booking-popup__label">Estimated Duration:</span>
                        <span className="booking-popup__value">{formatDuration(service.estimatedDuration)}</span>
                    </div>
                    <div className="booking-popup__info-item">
                        <span className="booking-popup__label">Estimated Cost:</span>
                        <span className="booking-popup__value booking-popup__price">{formatCurrency(service.estimatedCost)}</span>
                    </div>
                    {service.approvedAt && (
                        <div className="booking-popup__info-item">
                            <span className="booking-popup__label">Approved At:</span>
                            <span className="booking-popup__value">{formatDateTime(service.approvedAt)}</span>
                        </div>
                    )}
                    {service.rejectedReason && (
                        <div className="booking-popup__info-item">
                            <span className="booking-popup__label">Rejection Reason:</span>
                            <span className="booking-popup__value">{service.rejectedReason}</span>
                        </div>
                    )}
                </div>
                
                <div className="booking-popup__recommendation">
                    <span className="booking-popup__label">Recommendation Notes:</span>
                    <p className="booking-popup__recommendation-text">{service.recommendationNotes}</p>
                </div>
            </div>
        ));
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
                                    
                                    {/* Upcoming booking specific fields */}
                                    {isUpcomingBooking(booking) && (
                                        <div className="booking-popup__info-item">
                                            <span className="booking-popup__label">Preferred Check-in:</span>
                                            <span className="booking-popup__value">{booking.preferredCheckInTime}</span>
                                        </div>
                                    )}
                                    
                                    {/* Ongoing booking specific fields */}
                                    {!isUpcomingBooking(booking) && (
                                        <>
                                            <div className="booking-popup__info-item">
                                                <span className="booking-popup__label">Check-in Date:</span>
                                                <span className="booking-popup__value">{formatDateTime(booking.checkInDate)}</span>
                                            </div>
                                            <div className="booking-popup__info-item">
                                                <span className="booking-popup__label">Job Card Status:</span>
                                                <span className={`booking-popup__status ${getStatusColor(booking.jobCardStatus)}`}>
                                                    {getJobCardStatusLabel(booking.jobCardStatus)}
                                                </span>
                                            </div>
                                            <div className="booking-popup__info-item">
                                                <span className="booking-popup__label">Estimated Completion:</span>
                                                <span className="booking-popup__value">{booking.estimatedCompletionTime}</span>
                                            </div>
                                            <div className="booking-popup__info-item">
                                                <span className="booking-popup__label">Service Advisor:</span>
                                                <span className="booking-popup__value">{booking.serviceAdvisor.name}</span>
                                            </div>
                                            {booking.serviceAdvisor.contactNumber && (
                                                <div className="booking-popup__info-item">
                                                    <span className="booking-popup__label">Advisor Contact:</span>
                                                    <span className="booking-popup__value">{booking.serviceAdvisor.contactNumber}</span>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                                
                                {/* Progress bar for ongoing bookings */}
                                {!isUpcomingBooking(booking) && (
                                    <div className="booking-popup__progress">
                                        <span className="booking-popup__label">Overall Progress:</span>
                                        <div className="booking-popup__progress-bar">
                                            <div 
                                                className="booking-popup__progress-fill"
                                                style={{ width: `${booking.actualProgress.overallCompletionPercentage}%` }}
                                            ></div>
                                        </div>
                                        <span className="booking-popup__progress-text">
                                            {booking.actualProgress.completedTasks}/{booking.actualProgress.totalTasks} tasks 
                                            ({booking.actualProgress.overallCompletionPercentage}%)
                                        </span>
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
                                    
                                    {/* Vehicle specific fields based on booking type */}
                                    {isUpcomingBooking(booking) ? (
                                        booking.vehicle.estimatedMileage && (
                                            <div className="booking-popup__info-item">
                                                <span className="booking-popup__label">Estimated Mileage:</span>
                                                <span className="booking-popup__value">{booking.vehicle.estimatedMileage.toLocaleString()} km</span>
                                            </div>
                                        )
                                    ) : (
                                        <>
                                            <div className="booking-popup__info-item">
                                                <span className="booking-popup__label">Mileage at Check-in:</span>
                                                <span className="booking-popup__value">{booking.vehicle.mileageAtCheckIn.toLocaleString()} km</span>
                                            </div>
                                            <div className="booking-popup__info-item">
                                                <span className="booking-popup__label">Fuel Level:</span>
                                                <span className="booking-popup__value">{booking.vehicle.fuelLevel}</span>
                                            </div>
                                            {booking.vehicle.vehicleConditionNotes && (
                                                <div className="booking-popup__info-item">
                                                    <span className="booking-popup__label">Condition Notes:</span>
                                                    <span className="booking-popup__value">{booking.vehicle.vehicleConditionNotes}</span>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Booking Notes for upcoming bookings */}
                            {isUpcomingBooking(booking) && booking.bookingNotes && (
                                <div className="booking-popup__card">
                                    <h3 className="booking-popup__card-title">Booking Notes</h3>
                                    <p className="booking-popup__notes">{booking.bookingNotes}</p>
                                </div>
                            )}
                        </div>

                        {/* Right Column */}
                        <div className="booking-popup__column">
                            {/* Booked Services */}
                            <div className="booking-popup__card">
                                <h3 className="booking-popup__card-title">Booked Services</h3>
                                <div className="booking-popup__services">
                                    {isUpcomingBooking(booking) 
                                        ? renderUpcomingBookingServices(booking.bookedServices)
                                        : renderOngoingBookingServices(booking.bookedServices)
                                    }
                                </div>
                            </div>

                            {/* Additional Services (only for ongoing bookings) */}
                            {!isUpcomingBooking(booking) && booking.additionalServices.length > 0 && (
                                <div className="booking-popup__card">
                                    <h3 className="booking-popup__card-title">Additional Services</h3>
                                    <div className="booking-popup__services">
                                        {renderAdditionalServices(booking.additionalServices)}
                                    </div>
                                </div>
                            )}

                            {/* Payment Details */}
                            <div className="booking-popup__card">
                                <h3 className="booking-popup__card-title">Payment Summary</h3>
                                <div className="booking-popup__info-grid">
                                    {isUpcomingBooking(booking) ? (
                                        <>
                                            <div className="booking-popup__info-item">
                                                <span className="booking-popup__label">Estimated Total:</span>
                                                <span className="booking-popup__value booking-popup__price">
                                                    {formatCurrency(booking.payments.estimatedTotalAmount)}
                                                </span>
                                            </div>
                                            <div className="booking-popup__info-item">
                                                <span className="booking-popup__label">Is Advance Payment Required:</span>
                                                <span className={`booking-popup__status ${booking.payments.paymentRequired ? 'status--pending' : 'status--completed'}`}>
                                                    {booking.payments.paymentRequired ? 'Yes' : 'No'}
                                                </span>
                                            </div>
                                            {booking.payments.paymentRequired && booking.payments.paymentReason && (
                                                <div className="booking-popup__info-item">
                                                    <span className="booking-popup__label">Reason for Advance Payment:</span>
                                                    <span className="booking-popup__value">{booking.payments.paymentReason}</span>
                                                </div>
                                            )}
                                            {booking.payments.advancePaid && (
                                                <>
                                                    <div className="booking-popup__info-item">
                                                        <span className="booking-popup__label">Advance Paid:</span>
                                                        <span className="booking-popup__value booking-popup__price">
                                                            {formatCurrency(booking.payments.advancePaid)}
                                                        </span>
                                                    </div>
                                                    <div className="booking-popup__info-item">
                                                        <span className="booking-popup__label">Remaining Estimated:</span>
                                                        <span className="booking-popup__value booking-popup__price">
                                                            {formatCurrency(booking.payments.remainingEstimated || 0)}
                                                        </span>
                                                    </div>
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <div className="booking-popup__info-item">
                                                <span className="booking-popup__label">Original Estimated:</span>
                                                <span className="booking-popup__value booking-popup__price">
                                                    {formatCurrency(booking.payments.originalEstimatedAmount)}
                                                </span>
                                            </div>
                                            <div className="booking-popup__info-item">
                                                <span className="booking-popup__label">Additional Services:</span>
                                                <span className="booking-popup__value booking-popup__price">
                                                    {formatCurrency(booking.payments.additionalServicesAmount)}
                                                </span>
                                            </div>
                                            {booking.payments.totalActualAmount && (
                                                <div className="booking-popup__info-item">
                                                    <span className="booking-popup__label">Total Actual:</span>
                                                    <span className="booking-popup__value booking-popup__price">
                                                        {formatCurrency(booking.payments.totalActualAmount)}
                                                    </span>
                                                </div>
                                            )}
                                            {booking.payments.advancePaid && (
                                                <div className="booking-popup__info-item">
                                                    <span className="booking-popup__label">Advance Paid:</span>
                                                    <span className="booking-popup__value booking-popup__price">
                                                        {formatCurrency(booking.payments.advancePaid)}
                                                    </span>
                                                </div>
                                            )}
                                            {booking.payments.remainingAmount && (
                                                <div className="booking-popup__info-item">
                                                    <span className="booking-popup__label">Remaining Amount:</span>
                                                    <span className="booking-popup__value booking-popup__price">
                                                        {formatCurrency(booking.payments.remainingAmount)}
                                                    </span>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                            
                            {/* Booking Confirmation & Customer History for upcoming bookings */}
                            {isUpcomingBooking(booking) && (
                                <>
                                    <div className="booking-popup__card">
                                        <h3 className="booking-popup__card-title">Booking Status</h3>
                                        <div className="booking-popup__info-grid">
                                            <div className="booking-popup__info-item">
                                                <span className="booking-popup__label">Confirmation Status:</span>
                                                <span className={`booking-popup__status ${booking.bookingConfirmation.isConfirmed ? 'status--completed' : 'status--pending'}`}>
                                                    {booking.bookingConfirmation.isConfirmed ? 'Confirmed' : 'Pending Confirmation'}
                                                </span>
                                            </div>
                                            {booking.bookingConfirmation.confirmedAt && (
                                                <div className="booking-popup__info-item">
                                                    <span className="booking-popup__label">Confirmed At:</span>
                                                    <span className="booking-popup__value">{formatDateTime(booking.bookingConfirmation.confirmedAt)}</span>
                                                </div>
                                            )}
                                            {booking.bookingConfirmation.confirmationMethod && (
                                                <div className="booking-popup__info-item">
                                                    <span className="booking-popup__label">Confirmation Method:</span>
                                                    <span className="booking-popup__value">{booking.bookingConfirmation.confirmationMethod.toUpperCase()}</span>
                                                </div>
                                            )}
                                            <div className="booking-popup__info-item">
                                                <span className="booking-popup__label">Reminders Sent:</span>
                                                <span className="booking-popup__value">{booking.reminders.remindersSent}</span>
                                            </div>
                                            {booking.reminders.nextReminderScheduled && (
                                                <div className="booking-popup__info-item">
                                                    <span className="booking-popup__label">Next Reminder:</span>
                                                    <span className="booking-popup__value">{formatDateTime(booking.reminders.nextReminderScheduled)}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="booking-popup__card">
                                        <h3 className="booking-popup__card-title">Customer History</h3>
                                        <div className="booking-popup__info-grid">
                                            <div className="booking-popup__info-item">
                                                <span className="booking-popup__label">Total Bookings:</span>
                                                <span className="booking-popup__value">{booking.customerHistory.totalBookings}</span>
                                            </div>
                                            <div className="booking-popup__info-item">
                                                <span className="booking-popup__label">Completed:</span>
                                                <span className="booking-popup__value">{booking.customerHistory.completedBookings}</span>
                                            </div>
                                            <div className="booking-popup__info-item">
                                                <span className="booking-popup__label">Cancelled:</span>
                                                <span className="booking-popup__value">{booking.customerHistory.cancelledBookings}</span>
                                            </div>
                                            <div className="booking-popup__info-item">
                                                <span className="booking-popup__label">No-Shows:</span>
                                                <span className={`booking-popup__value ${booking.customerHistory.noShowCount > 0 ? 'no-show-warning' : ''}`}>
                                                    {booking.customerHistory.noShowCount}
                                                </span>
                                            </div>
                                            <div className="booking-popup__info-item">
                                                <span className="booking-popup__label">Risk Level:</span>
                                                <span className={`booking-popup__status ${
                                                    booking.customerHistory.riskLevel === 'high' ? 'status--cancelled' :
                                                    booking.customerHistory.riskLevel === 'medium' ? 'status--pending' : 'status--completed'
                                                }`}>
                                                    {booking.customerHistory.riskLevel.toUpperCase()}
                                                </span>
                                            </div>
                                            {booking.customerHistory.lastNoShowDate && (
                                                <div className="booking-popup__info-item">
                                                    <span className="booking-popup__label">Last No-Show:</span>
                                                    <span className="booking-popup__value">{formatDate(booking.customerHistory.lastNoShowDate)}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingDetailsPopup;