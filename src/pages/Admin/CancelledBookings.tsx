import { useState, useEffect } from 'react';
import { Search, XCircle } from 'lucide-react';
import CancelledBookingDetailsPopup from '../../components/Admin/BookingDetailsPopup/CancelledBookingDetailsPopup';
import '../../layouts/DashboardLayout.scss';
import "../../styles/components/SearchBarAndFilters.scss"
import "../../components/Admin/BookingsTable/BookingsTable.scss"

// Define interface for cancelled booking data
interface CancelledBooking {
    bookingId: string;
    customer: string;
    vehicle: string;
    bookedDate: string;
    cancelledDate: string;
    serviceType: string;
    cancelledBy: 'Customer' | 'Service Center';
    cancellationReason: string;
    customerCancellationHistory: number; // Number of previous cancellations
    advanceRequired: boolean; // Whether advance was required for this booking
    advancePaid?: number; // Only if advance was required
    refundStatus?: 'Processed' | 'Pending' | 'Partially Refunded' | 'Not Applicable';
}

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

const CancelledBookings: React.FC = () => {
    const [periodFilter, setPeriodFilter] = useState<string>('thisMonth');
    const [cancelledByFilter, setCancelledByFilter] = useState<string>('all');
    const [customerTypeFilter, setCustomerTypeFilter] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState<string>('');

    // State for popup
    const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
    const [selectedBooking, setSelectedBooking] = useState<CancelledBookingDetails | null>(null);
    const [loadingBookingId, setLoadingBookingId] = useState<string | null>(null);

    // Sample cancelled bookings data
    const cancelledBookings: CancelledBooking[] = [
        {
            bookingId: 'BKG-1031',
            customer: 'Samantha De Silva',
            vehicle: 'Toyota Prius 2019',
            bookedDate: '2025-08-01',
            cancelledDate: '2025-08-05',
            serviceType: 'Full Vehicle Service',
            cancelledBy: 'Customer',
            cancellationReason: 'Emergency travel plans',
            customerCancellationHistory: 0,
            advanceRequired: false
        },
        {
            bookingId: 'BKG-1032',
            customer: 'Rohan Jayasuriya',
            vehicle: 'Honda Civic 2020',
            bookedDate: '2025-07-28',
            cancelledDate: '2025-08-02',
            serviceType: 'Engine Tune-Up',
            cancelledBy: 'Service Center',
            cancellationReason: 'Parts unavailable',
            customerCancellationHistory: 1,
            advanceRequired: false
        },
        {
            bookingId: 'BKG-1033',
            customer: 'Priyanka Wickramasinghe',
            vehicle: 'Suzuki Swift 2018',
            bookedDate: '2025-07-30',
            cancelledDate: '2025-08-06',
            serviceType: 'Brake System Repair',
            cancelledBy: 'Customer',
            cancellationReason: 'Found alternative service provider',
            customerCancellationHistory: 3,
            advanceRequired: true,
            advancePaid: 3000,
            refundStatus: 'Pending'
        },
        {
            bookingId: 'BKG-1034',
            customer: 'Nuwan Perera',
            vehicle: 'Nissan March 2017',
            bookedDate: '2025-07-25',
            cancelledDate: '2025-07-29',
            serviceType: 'Air Conditioning Service',
            cancelledBy: 'Customer',
            cancellationReason: 'Financial constraints',
            customerCancellationHistory: 2,
            advanceRequired: true,
            advancePaid: 1750,
            refundStatus: 'Partially Refunded'
        },
        {
            bookingId: 'BKG-1035',
            customer: 'Kavitha Fernando',
            vehicle: 'Mitsubishi Lancer 2016',
            bookedDate: '2025-08-03',
            cancelledDate: '2025-08-07',
            serviceType: 'Clutch Replacement',
            cancelledBy: 'Service Center',
            cancellationReason: 'Technical specialist unavailable',
            customerCancellationHistory: 0,
            advanceRequired: false
        },
        {
            bookingId: 'BKG-1036',
            customer: 'Dinesh Rathnayake',
            vehicle: 'Hyundai i10 2021',
            bookedDate: '2025-07-20',
            cancelledDate: '2025-07-22',
            serviceType: 'Battery Check',
            cancelledBy: 'Customer',
            cancellationReason: 'Vehicle sold',
            customerCancellationHistory: 4,
            advanceRequired: true,
            advancePaid: 750,
            refundStatus: 'Not Applicable'
        }
    ];

    // Function to fetch detailed cancelled booking data
    const fetchCancelledBookingDetails = async (bookingId: string): Promise<CancelledBookingDetails | null> => {
        setLoadingBookingId(bookingId);
        try {
            // Replace this with your actual API call
            // const response = await fetch(`/api/cancelled-bookings/${bookingId}`);
            // const bookingDetails = await response.json();
            // return bookingDetails;

            // For now, return mock data
            const details = getMockCancelledBookingDetails(bookingId);

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));

            return details;
        } catch (error) {
            console.error('Error fetching cancelled booking details:', error);
            return null;
        } finally {
            setLoadingBookingId(null);
        }
    };

    // Mock function for cancelled booking details
    const getMockCancelledBookingDetails = (bookingId: string): CancelledBookingDetails => {
        const booking = cancelledBookings.find(b => b.bookingId === bookingId);
        if (!booking) throw new Error('Booking not found');

        const vehicleParts = booking.vehicle.split(' ');
        const yearMatch = booking.vehicle.match(/\d{4}/);
        const make = vehicleParts[0] || 'Unknown';
        const model = vehicleParts.slice(1, -1).join(' ') || 'Unknown';
        const year = yearMatch ? parseInt(yearMatch[0]) : 2020;

        const estimatedCost = getServiceCost(booking.serviceType);
        const isRepeatCanceller = booking.customerCancellationHistory >= 2;
        const advancePaid = booking.advancePaid || 0;
        const cancellationFee = booking.advanceRequired && booking.cancelledBy === 'Customer' ? 
            Math.round(advancePaid * 0.1) : 0;
        const refundAmount = booking.refundStatus ? calculateRefundAmount(advancePaid, cancellationFee, booking.refundStatus) : 0;

        return {
            id: bookingId,
            bookedDate: booking.bookedDate + 'T09:00:00',
            cancelledDate: booking.cancelledDate + 'T14:30:00',
            status: 'Cancelled',
            customer: {
                name: booking.customer,
                email: `${booking.customer.toLowerCase().replace(/\s+/g, '.')}@email.com`,
                contactNumber: "+94 77 123 4567"
            },
            vehicle: {
                make: make,
                model: model,
                year: year,
                licensePlate: `${['WP', 'CP', 'SG', 'NP'][Math.floor(Math.random() * 4)]} ${['CAR', 'ABC', 'XYZ'][Math.floor(Math.random() * 3)]}-${Math.floor(Math.random() * 9000) + 1000}`,
                estimatedMileage: Math.floor(Math.random() * 50000) + 20000
            },
            bookedServices: [
                {
                    serviceId: `SRV-${Math.floor(Math.random() * 100).toString().padStart(3, '0')}`,
                    name: booking.serviceType,
                    description: getServiceDescription(booking.serviceType),
                    estimatedDurationMinutes: getServiceDuration(booking.serviceType),
                    estimatedCost: estimatedCost,
                    category: getServiceCategory(booking.serviceType)
                }
            ],
            cancellationDetails: {
                cancelledBy: booking.cancelledBy,
                cancellationReason: booking.cancellationReason,
                cancelledAt: booking.cancelledDate + 'T14:30:00',
                cancellationNotes: getCancellationNotes(booking.cancelledBy, booking.cancellationReason),
                staffMemberName: booking.cancelledBy === 'Service Center' ? 'M. Perera' : undefined,
                customerCancellationHistory: booking.customerCancellationHistory,
                isRepeatCanceller: isRepeatCanceller
            },
            payments: {
                originalEstimatedAmount: estimatedCost,
                advanceRequired: booking.advanceRequired,
                advancePaid: booking.advancePaid,
                cancellationFee: cancellationFee > 0 ? cancellationFee : undefined,
                refundAmount: refundAmount > 0 ? refundAmount : undefined,
                refundStatus: booking.refundStatus,
                refundProcessedDate: booking.refundStatus === 'Processed' ? booking.cancelledDate + 'T16:00:00' : undefined,
                refundMethod: booking.refundStatus === 'Processed' ? 'Bank Transfer' : undefined
            },
            bookingConfirmation: {
                confirmationSent: true,
                confirmationSentAt: booking.bookedDate + 'T10:00:00',
                customerConfirmed: !isRepeatCanceller,
                customerConfirmedAt: !isRepeatCanceller ? booking.bookedDate + 'T11:30:00' : undefined,
                remindersSent: isRepeatCanceller ? 3 : 2,
                lastReminderSentAt: booking.bookedDate + 'T08:00:00'
            },
            bookingNotes: "Customer requested early morning slot. Special attention needed for engine diagnostics.",
            preferredCheckInTime: "2025-08-15 09:00 AM"
        };
    };

    // Helper functions
    const getServiceCost = (serviceType: string): number => {
        const costs: Record<string, number> = {
            'Full Vehicle Service': 15000,
            'Engine Tune-Up': 8000,
            'Clutch Replacement': 25000,
            'Battery Check': 3000,
            'Brake System Repair': 12000,
            'Air Conditioning Service': 7000,
            'Suspension Repair': 18000
        };
        return costs[serviceType] || 10000;
    };

    const getServiceDuration = (serviceType: string): number => {
        const durations: Record<string, number> = {
            'Full Vehicle Service': 240,
            'Engine Tune-Up': 180,
            'Clutch Replacement': 360,
            'Battery Check': 60,
            'Brake System Repair': 120,
            'Air Conditioning Service': 90,
            'Suspension Repair': 300
        };
        return durations[serviceType] || 120;
    };

    const getServiceDescription = (serviceType: string): string => {
        const descriptions: Record<string, string> = {
            'Full Vehicle Service': 'Comprehensive vehicle inspection and maintenance including oil change, filter replacements, brake check, and 25-point inspection',
            'Engine Tune-Up': 'Engine performance optimization including spark plug replacement, air filter cleaning, and engine diagnostics',
            'Clutch Replacement': 'Complete clutch system replacement including clutch disc, pressure plate, and release bearing',
            'Battery Check': 'Battery health assessment, terminal cleaning, and charging system check',
            'Brake System Repair': 'Brake pad replacement, brake fluid change, and brake system inspection',
            'Air Conditioning Service': 'AC system cleaning, gas refill, and cooling performance optimization',
            'Suspension Repair': 'Shock absorber replacement and suspension system alignment'
        };
        return descriptions[serviceType] || 'Professional automotive service';
    };

    const getServiceCategory = (serviceType: string): string => {
        const categories: Record<string, string> = {
            'Full Vehicle Service': 'Maintenance',
            'Engine Tune-Up': 'Engine',
            'Clutch Replacement': 'Transmission',
            'Battery Check': 'Electrical',
            'Brake System Repair': 'Safety',
            'Air Conditioning Service': 'Comfort',
            'Suspension Repair': 'Chassis'
        };
        return categories[serviceType] || 'General';
    };

    const getCancellationNotes = (cancelledBy: string, reason: string): string => {
        if (cancelledBy === 'Customer') {
            return `Customer initiated cancellation. Reason: ${reason}. Booking slot released for other customers.`;
        } else {
            return `Service center initiated cancellation due to operational constraints. Reason: ${reason}. Customer notified immediately and alternative slots offered.`;
        }
    };

    const calculateRefundAmount = (advancePaid: number, cancellationFee: number, refundStatus?: string): number => {
        if (!refundStatus || advancePaid === 0) return 0;
        
        switch (refundStatus) {
            case 'Processed':
                return advancePaid - cancellationFee;
            case 'Partially Refunded':
                return Math.round((advancePaid - cancellationFee) * 0.7); // 70% refund
            case 'Not Applicable':
                return 0;
            default:
                return advancePaid - cancellationFee;
        }
    };

    // Handle view details click
    const handleViewDetails = async (bookingId: string) => {
        try {
            const bookingDetails = await fetchCancelledBookingDetails(bookingId);
            if (bookingDetails) {
                setSelectedBooking(bookingDetails);
                setIsPopupOpen(true);
            }
        } catch (error) {
            console.error('Failed to fetch cancelled booking details:', error);
            // You might want to show a toast notification here
        }
    };

    // Handle popup close
    const handleClosePopup = () => {
        setIsPopupOpen(false);
        setSelectedBooking(null);
    };

    // Filter bookings based on search term and filters
    const filterBookings = (bookings: CancelledBooking[]): CancelledBooking[] => {
        return bookings.filter(booking => {
            const matchesSearch = searchTerm === '' ||
                booking.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.cancellationReason.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesCancelledBy = cancelledByFilter === 'all' || 
                booking.cancelledBy.toLowerCase() === cancelledByFilter.toLowerCase();

            const matchesCustomerType = customerTypeFilter === 'all' || 
                (customerTypeFilter === 'repeat-canceller' && booking.customerCancellationHistory >= 2) ||
                (customerTypeFilter === 'first-time-canceller' && booking.customerCancellationHistory === 0) ||
                (customerTypeFilter === 'advance-required' && booking.advanceRequired);

            return matchesSearch && matchesCancelledBy && matchesCustomerType;
        });
    };

    const filteredCancelledBookings = filterBookings(cancelledBookings);

    const getRefundStatusColor = (status?: string) => {
        if (!status) return 'status--not-applicable';
        switch (status.toLowerCase()) {
            case 'processed': return 'status--completed';
            case 'pending': return 'status--pending';
            case 'partially refunded': return 'status--in-progress';
            case 'not applicable': return 'status--cancelled';
            default: return 'status--pending';
        }
    };

    const getCustomerTypeColor = (cancellationHistory: number, advanceRequired: boolean) => {
        if (cancellationHistory >= 2) return 'customer-type--repeat-canceller';
        if (advanceRequired) return 'customer-type--advance-required';
        return 'customer-type--regular';
    };

    const getCustomerTypeLabel = (cancellationHistory: number, advanceRequired: boolean) => {
        if (cancellationHistory >= 2) return 'Repeat Canceller';
        if (advanceRequired) return 'Advance Required';
        return 'Regular Customer';
    };

    const renderCancelledBookingsTable = () => {
        const bookingsToShow = filteredCancelledBookings;

        return (
            <div className="todays-bookings__table">
                <div className="todays-bookings__table-header">
                    <div className="todays-bookings__header-cell">Booking ID</div>
                    <div className="todays-bookings__header-cell">Customer</div>
                    <div className="todays-bookings__header-cell">Vehicle</div>
                    <div className="todays-bookings__header-cell">Service Type</div>
                    <div className="todays-bookings__header-cell">Booked Date</div>
                    <div className="todays-bookings__header-cell">Cancelled Date</div>
                    {/* <div className="todays-bookings__header-cell">Customer Type</div>
                    <div className="todays-bookings__header-cell">Payment Status</div> */}
                    <div className="todays-bookings__header-cell">Actions</div>
                </div>
                <div className="todays-bookings__table-body">
                    {bookingsToShow.length === 0 ? (
                        <div className="todays-bookings__empty-state">
                            <p>No cancelled bookings found matching your criteria.</p>
                        </div>
                    ) : (
                        bookingsToShow.map((booking) => (
                            <div key={booking.bookingId} className="todays-bookings__row">
                                <div className="todays-bookings__cell" data-label="Booking ID">
                                    {booking.bookingId}
                                </div>
                                <div className="todays-bookings__cell" data-label="Customer">
                                    {booking.customer}
                                </div>
                                <div className="todays-bookings__cell" data-label="Vehicle">
                                    {booking.vehicle}
                                </div>
                                <div className="todays-bookings__cell" data-label="Service Type">
                                    {booking.serviceType}
                                </div>
                                <div className="todays-bookings__cell" data-label="Booked Date">
                                    {new Date(booking.bookedDate).toLocaleDateString()}
                                </div>
                                <div className="todays-bookings__cell" data-label="Cancelled Date">
                                    {new Date(booking.cancelledDate).toLocaleDateString()}
                                </div>
                                {/* <div className="todays-bookings__cell" data-label="Customer Type">
                                    <span className={`customer-type-tag ${getCustomerTypeColor(booking.customerCancellationHistory, booking.advanceRequired)}`}>
                                        {getCustomerTypeLabel(booking.customerCancellationHistory, booking.advanceRequired)}
                                    </span>
                                </div>
                                <div className="todays-bookings__cell" data-label="Payment Status">
                                    <span className={`booking-status ${getRefundStatusColor(booking.refundStatus)}`}>
                                        {booking.advanceRequired ? (booking.refundStatus || 'No Advance') : 'No Payment Required'}
                                    </span>
                                </div> */}
                                <div className="todays-bookings__cell" data-label="Actions">
                                    <button
                                        className="todays-bookings__action-btn"
                                        onClick={() => handleViewDetails(booking.bookingId)}
                                        disabled={loadingBookingId === booking.bookingId}
                                    >
                                        {loadingBookingId === booking.bookingId ? 'Loading...' : 'View Details'}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        );
    };

    return (
        <div style={{ padding: '20px 24px' }}>
            {/* <div className="user-management__header">
                <div className="user-management__tabs">
                    <button className="user-management__tab user-management__tab--active">
                        <span className="user-management__tab-icon">
                            <XCircle size={18} strokeWidth={1.5} />
                        </span>
                        Cancelled Bookings ({filteredCancelledBookings.length})
                    </button>
                </div>
            </div> */}

            <div className="search-bar">
                <div className="search-content">
                    <div className="search-input-container">
                        <Search className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search cancelled bookings..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="filters">
                        <select
                            value={periodFilter}
                            onChange={(e) => setPeriodFilter(e.target.value)}
                        >
                            <option value="today">Today</option>
                            <option value="thisWeek">This Week</option>
                            <option value="thisMonth">This Month</option>
                            <option value="lastMonth">Last Month</option>
                            <option value="last3Months">Last 3 Months</option>
                        </select>

                        <select
                            value={cancelledByFilter}
                            onChange={(e) => setCancelledByFilter(e.target.value)}
                        >
                            <option value="all">Cancelled By: All</option>
                            <option value="customer">Customer</option>
                            <option value="service center">Service Center</option>
                        </select>

                        <select
                            value={customerTypeFilter}
                            onChange={(e) => setCustomerTypeFilter(e.target.value)}
                        >
                            <option value="all">Customer Type: All</option>
                            <option value="repeat-canceller">Repeat Cancellers</option>
                            <option value="first-time-canceller">First-time Cancellers</option>
                            <option value="advance-required">Advance Required</option>
                        </select>
                    </div>
                </div>
            </div>

            {renderCancelledBookingsTable()}

            {/* Cancelled Booking Details Popup */}
            {selectedBooking && (
                <CancelledBookingDetailsPopup
                    booking={selectedBooking}
                    isOpen={isPopupOpen}
                    onClose={handleClosePopup}
                />
            )}
        </div>
    );
};

export default CancelledBookings;