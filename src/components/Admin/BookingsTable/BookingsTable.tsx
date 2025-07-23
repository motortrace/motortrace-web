import React, { useState } from 'react';
import BookingDetailsPopup from '../BookingDetailsPopup/BookingDetailsPopup';
import './BookingsTable.scss';

interface Bookings {
    id: string;
    time: string;
    customerName: string;
    vehicle: {
        make: string;
        model: string;
        year: number;
    };
    serviceType: string;
    status: 'Pending' | 'Approved' | 'Confirmed' | 'Checked In' | 'In Progress' | 'Completed';
    serviceCenter?: string;
}

interface BookingsProps {
    bookings?: Bookings[];
}

interface PaymentBreakdown {
    totalAmount: number;
    advancePaid: number;
    remainingPaid: number;
    commission: number;
    payoutToServiceCenter: number;
}

const BookingsTable: React.FC<BookingsProps> = ({
    bookings = [
        {
            id: '1',
            time: '09:00 AM',
            customerName: 'A. Fernando',
            vehicle: { make: 'Toyota', model: 'Corolla', year: 2012 },
            serviceType: 'Engine Repair',
            status: 'In Progress',
            serviceCenter: 'Express Car Care'
        },
        {
            id: '2',
            time: '10:00 AM',
            customerName: 'M. Perera',
            vehicle: { make: 'Honda', model: 'Civic', year: 2020 },
            serviceType: 'Oil Change',
            status: 'Completed',
            serviceCenter: 'Quick Fix Motors'
        },
        {
            id: '3',
            time: '11:00 AM',
            customerName: 'R. Jayawardena',
            vehicle: { make: 'Suzuki', model: 'WagonR', year: 2018 },
            serviceType: 'Brake Inspection',
            status: 'Completed',
            serviceCenter: 'Elite Service Hub'
        },
        {
            id: '4',
            time: '01:00 PM',
            customerName: 'K. Bandara',
            vehicle: { make: 'Nissan', model: 'Leaf', year: 2021 },
            serviceType: 'Battery Replacement',
            status: 'Checked In',
            serviceCenter: 'Royal Auto Services'
        },
        {
            id: '5',
            time: '01:00 PM',
            customerName: 'C. Divakar',
            vehicle: { make: 'Toyota', model: 'Aqua', year: 2022 },
            serviceType: 'Oil Change',
            status: 'In Progress',
            serviceCenter: 'Quick Fix Motors'
        },
        {
            id: '6',
            time: '03:00 PM',
            customerName: 'S. Silva',
            vehicle: { make: 'Mitsubishi', model: 'Lancer', year: 2019 },
            serviceType: 'Tire Replacement',
            status: 'Confirmed',
            serviceCenter: 'Express Car Care'
        },
        {
            id: '7',
            time: '04:00 PM',
            customerName: 'N. Wickramasinghe',
            vehicle: { make: 'Toyota', model: 'Prius', year: 2023 },
            serviceType: 'Maintenance',
            status: 'Confirmed',
            serviceCenter: 'Elite Service Hub'
        },
        {
            id: '8',
            time: '05:00 PM',
            customerName: 'D. Rajapaksa',
            vehicle: { make: 'Honda', model: 'Fit', year: 2017 },
            serviceType: 'AC Repair',
            status: 'Confirmed',
            serviceCenter: 'Royal Auto Services'
        }
    ]
}) => {
    const [displayCount, setDisplayCount] = useState(5);
    const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const itemsPerPage = 5;

    const displayedBookings = bookings.slice(0, displayCount);
    const hasMore = displayCount < bookings.length;

    const handleLoadMore = () => {
        setDisplayCount(prev => Math.min(prev + itemsPerPage, bookings.length));
    };

    const handleViewBooking = (bookingId: string) => {
        setSelectedBookingId(bookingId);
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
        setSelectedBookingId(null);
    };

    // Convert table booking data to detailed booking format for popup
    const convertToDetailedBooking = (booking: Bookings) => {
        const currentDate = new Date();
        const requestedDate = new Date(currentDate.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000);
        const approvedDate = new Date(requestedDate.getTime() + Math.random() * 2 * 24 * 60 * 60 * 1000);

        const serviceCenterData = {
            'Express Car Care': {
                email: 'contact@expresscarcare.lk',
                contact: '+94 11 234 5678',
                address: '123 Main Street, Colombo 03',
                operatingHours: '8:00 AM - 6:00 PM'
            },
            'Quick Fix Motors': {
                email: 'info@quickfixmotors.lk',
                contact: '+94 11 345 6789',
                address: '456 Galle Road, Colombo 04',
                operatingHours: '9:00 AM - 7:00 PM'
            },
            'Elite Service Hub': {
                email: 'service@eliteservicehub.lk',
                contact: '+94 11 456 7890',
                address: '789 Kandy Road, Colombo 07',
                operatingHours: '8:30 AM - 6:30 PM'
            },
            'Royal Auto Services': {
                email: 'contact@royalautoservices.lk',
                contact: '+94 11 567 8901',
                address: '321 Negombo Road, Colombo 11',
                operatingHours: '8:00 AM - 5:30 PM'
            }
        };

        const serviceDescriptions = {
            'Engine Repair': 'Complete engine diagnostic and repair service including valve adjustment, timing belt replacement, and engine tuning.',
            'Oil Change': 'Regular oil change service with high-quality engine oil and filter replacement.',
            'Brake Inspection': 'Comprehensive brake system inspection including brake pads, rotors, and brake fluid check.',
            'Battery Replacement': 'Complete battery replacement service with installation and disposal of old battery.',
            'Tire Replacement': 'Professional tire installation and balancing service with wheel alignment check.',
            'Maintenance': 'Regular maintenance service including oil change, filter replacement, and general inspection.',
            'AC Repair': 'Air conditioning system repair and maintenance including refrigerant refill and compressor check.'
        };

        const servicePrices = {
            'Engine Repair': 45000,
            'Oil Change': 8500,
            'Brake Inspection': 12000,
            'Battery Replacement': 18000,
            'Tire Replacement': 25000,
            'Maintenance': 15000,
            'AC Repair': 22000
        };

        const centerInfo = serviceCenterData[booking.serviceCenter as keyof typeof serviceCenterData] || serviceCenterData['Express Car Care'];
        const estimatedPrice = servicePrices[booking.serviceType as keyof typeof servicePrices] || 15000;
        const advanceAmount = estimatedPrice * 0.25;

        const remainingAmount = estimatedPrice - advanceAmount;

        // Add payment breakdown for completed services
        let paymentBreakdown: PaymentBreakdown | undefined;
        if (booking.status === 'Completed') {
            const commission = estimatedPrice * 0.08; // 8% commission
            const payoutToServiceCenter = advanceAmount - commission;

            paymentBreakdown = {
                totalAmount: estimatedPrice,
                advancePaid: advanceAmount,
                remainingPaid: remainingAmount,
                commission: commission,
                payoutToServiceCenter: payoutToServiceCenter
            };
        }


        return {
            id: booking.id,
            requestedDate: requestedDate.toISOString(),
            approvedDate: approvedDate.toISOString(),
            checkInDate: booking.status === 'Checked In' || booking.status === 'In Progress' || booking.status === 'Completed'
                ? new Date(approvedDate.getTime() + 24 * 60 * 60 * 1000).toISOString() : undefined,
            completedDate: booking.status === 'Completed'
                ? new Date(approvedDate.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString() : undefined,
            status: booking.status,
            customer: {
                name: booking.customerName,
                email: `${booking.customerName.toLowerCase().replace(/\s+/g, '.')}@email.com`,
                contactNumber: `+94 ${Math.floor(Math.random() * 900000000) + 700000000}`
            },
            vehicle: {
                make: booking.vehicle.make,
                model: booking.vehicle.model,
                year: booking.vehicle.year,
                licensePlate: `ABC-${Math.floor(Math.random() * 9000) + 1000}`
            },
            serviceCenter: {
                name: booking.serviceCenter || 'Express Car Care',
                email: centerInfo.email,
                contact: centerInfo.contact,
                address: centerInfo.address,
                operatingHours: centerInfo.operatingHours
            },
            service: {
                name: booking.serviceType,
                description: serviceDescriptions[booking.serviceType as keyof typeof serviceDescriptions] || 'Professional automotive service',
                estimatedPrice: estimatedPrice
            },
            payment: {
                advanceAmount: advanceAmount,
                paidDate: booking.status !== 'Pending' ? approvedDate.toISOString() : undefined,
                remainingAmount: estimatedPrice - advanceAmount,
                isPaid: booking.status !== 'Pending',
                breakdown: paymentBreakdown
            }
        };
    };

    const selectedBooking = selectedBookingId
        ? bookings.find(b => b.id === selectedBookingId)
        : null;

    const detailedBooking = selectedBooking ? convertToDetailedBooking(selectedBooking) : null;

    return (
        <div className="todays-bookings">
            <div className="todays-bookings__table">
                <div className="todays-bookings__table-header">
                    <div className="todays-bookings__header-cell">TIME</div>
                    <div className="todays-bookings__header-cell">CUSTOMER</div>
                    <div className="todays-bookings__header-cell">VEHICLE</div>
                    <div className="todays-bookings__header-cell">SERVICE</div>
                    <div className="todays-bookings__header-cell">STATUS</div>
                    <div className="todays-bookings__header-cell">SERVICE CENTER</div>
                    <div className="todays-bookings__header-cell">ACTIONS</div>
                </div>

                <div className="todays-bookings__table-body">
                    {displayedBookings.map((booking) => (
                        <div key={booking.id} className="todays-bookings__row">
                            <div className="todays-bookings__cell" data-label="Time">{booking.time}</div>
                            <div className="todays-bookings__cell" data-label="Customer">{booking.customerName}</div>
                            <div className="todays-bookings__cell" data-label="Vehicle">
                                {booking.vehicle.make} {booking.vehicle.model} {booking.vehicle.year}
                            </div>
                            <div className="todays-bookings__cell" data-label="Service">{booking.serviceType}</div>
                            <div className="todays-bookings__cell" data-label="Status">
                                <span className={`todays-bookings__status todays-bookings__status--${booking.status.toLowerCase().replace(/\s+/g, '-')}`}>
                                    {booking.status}
                                </span>
                            </div>
                            <div className="todays-bookings__cell" data-label="Service Center">{booking.serviceCenter || 'TBA'}</div>
                            <div className="todays-bookings__cell" data-label="Actions">
                                <button
                                    className="todays-bookings__action-btn"
                                    onClick={() => handleViewBooking(booking.id)}
                                >
                                    View Booking
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {hasMore && (
                    <div className="todays-bookings__load-more">
                        <button
                            className="todays-bookings__load-more-btn"
                            onClick={handleLoadMore}
                        >
                            Load More ({bookings.length - displayCount} remaining)
                        </button>
                    </div>
                )}
            </div>

            {/* Booking Details Popup */}
            {detailedBooking && (
                <BookingDetailsPopup
                    booking={detailedBooking}
                    isOpen={isPopupOpen}
                    onClose={handleClosePopup}
                />
            )}
        </div>
    );
};

export default BookingsTable;