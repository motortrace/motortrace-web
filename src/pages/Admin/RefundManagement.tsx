import React, { useState } from 'react';
import { Search } from 'lucide-react';
import MetricCard from '../../components/MetricCard/MetricCard';
import RefundDetailsPopup from '../../components/Admin/RefundDetailsPopup/RefundDetailsPopup';

import './RefundManagement.scss';

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
    // serviceCenter: string;
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

const RefundManagement: React.FC = () => {
    const [displayCount, setDisplayCount] = useState(5);
    const [selectedRefundId, setSelectedRefundId] = useState<string | null>(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [eligibilityFilter, setEligibilityFilter] = useState<string>('all');

    const itemsPerPage = 10;

    // Sample refund data
    const refundBookings: RefundBooking[] = [
        {
            id: '1',
            cancelledDate: '2024-12-25T14:30:00Z',
            checkInDate: '2025-01-05T09:00:00Z',
            customerName: 'A. Fernando',
            vehicle: { make: 'Toyota', model: 'Corolla', year: 2012 },
            serviceType: 'Engine Repair',
            // serviceCenter: 'Express Car Care',
            advanceAmount: 11250,
            refundStatus: 'Pending',
            refundEligibility: '100%',
            daysBeforeCheckIn: 11,
            refundBreakdown: {
                customerRefund: 11250,
                platformCommission: 0,
                serviceCenterPayout: 0
            },
            customer: {
                name: 'A. Fernando',
                email: 'a.fernando@email.com',
                contactNumber: '+94 771234567'
            },
            serviceCenter: {
                name: 'Express Car Care',
                email: 'contact@expresscarcare.lk',
                contact: '+94 11 234 5678',
                address: '123 Main Street, Colombo 03'
            },
            service: {
                name: 'Engine Repair',
                description: 'Complete engine diagnostic and repair service including valve adjustment, timing belt replacement, and engine tuning.'
            }
        },
        {
            id: '2',
            cancelledDate: '2024-12-28T16:45:00Z',
            checkInDate: '2025-01-02T10:00:00Z',
            customerName: 'M. Perera',
            vehicle: { make: 'Honda', model: 'Civic', year: 2020 },
            serviceType: 'Oil Change',
            // serviceCenter: 'Quick Fix Motors',
            advanceAmount: 2125,
            refundStatus: 'Processed',
            refundEligibility: '50%',
            daysBeforeCheckIn: 5,
            refundBreakdown: {
                customerRefund: 1062.5,
                platformCommission: 170,
                serviceCenterPayout: 892.5
            },
            customer: {
                name: 'M. Perera',
                email: 'm.perera@email.com',
                contactNumber: '+94 772345678'
            },
            serviceCenter: {
                name: 'Quick Fix Motors',
                email: 'info@quickfixmotors.lk',
                contact: '+94 11 345 6789',
                address: '456 Galle Road, Colombo 04'
            },
            service: {
                name: 'Oil Change',
                description: 'Regular oil change service with high-quality engine oil and filter replacement.'
            }
        },
        {
            id: '3',
            cancelledDate: '2024-12-30T11:20:00Z',
            checkInDate: '2025-01-01T11:00:00Z',
            customerName: 'R. Sirimal',
            vehicle: { make: 'Suzuki', model: 'WagonR', year: 2018 },
            serviceType: 'Brake Inspection',
            // serviceCenter: 'Elite Service Hub',
            advanceAmount: 3000,
            refundStatus: 'Completed',
            refundEligibility: '0%',
            daysBeforeCheckIn: 2,
            refundBreakdown: {
                customerRefund: 0,
                platformCommission: 240,
                serviceCenterPayout: 2760
            },
            customer: {
                name: 'R. Jayawardena',
                email: 'r.jayawardena@email.com',
                contactNumber: '+94 773456789'
            },
            serviceCenter: {
                name: 'Elite Service Hub',
                email: 'service@eliteservicehub.lk',
                contact: '+94 11 456 7890',
                address: '789 Kandy Road, Colombo 07'
            },
            service: {
                name: 'Brake Inspection',
                description: 'Comprehensive brake system inspection including brake pads, rotors, and brake fluid check.'
            }
        },
        {
            id: '4',
            cancelledDate: '2024-12-26T09:15:00Z',
            checkInDate: '2025-01-03T13:00:00Z',
            customerName: 'K. Bandara',
            vehicle: { make: 'Nissan', model: 'Leaf', year: 2021 },
            serviceType: 'Battery Change',
            // serviceCenter: 'Royal Auto Services',
            advanceAmount: 4500,
            refundStatus: 'Pending',
            refundEligibility: '100%',
            daysBeforeCheckIn: 8,
            refundBreakdown: {
                customerRefund: 4500,
                platformCommission: 0,
                serviceCenterPayout: 0
            },
            customer: {
                name: 'K. Bandara',
                email: 'k.bandara@email.com',
                contactNumber: '+94 774567890'
            },
            serviceCenter: {
                name: 'Royal Auto Services',
                email: 'contact@royalautoservices.lk',
                contact: '+94 11 567 8901',
                address: '321 Negombo Road, Colombo 11'
            },
            service: {
                name: 'Battery Replacement',
                description: 'Complete battery replacement service with installation and disposal of old battery.'
            }
        },
        {
            id: '5',
            cancelledDate: '2024-12-29T13:30:00Z',
            checkInDate: '2025-01-04T15:00:00Z',
            customerName: 'C. Divakar',
            vehicle: { make: 'Toyota', model: 'Aqua', year: 2022 },
            serviceType: 'Oil Change',
            // serviceCenter: 'Quick Fix Motors',
            advanceAmount: 2125,
            refundStatus: 'Processed',
            refundEligibility: '50%',
            daysBeforeCheckIn: 6,
            refundBreakdown: {
                customerRefund: 1062.5,
                platformCommission: 170,
                serviceCenterPayout: 892.5
            },
            customer: {
                name: 'C. Divakar',
                email: 'c.divakar@email.com',
                contactNumber: '+94 775678901'
            },
            serviceCenter: {
                name: 'Quick Fix Motors',
                email: 'info@quickfixmotors.lk',
                contact: '+94 11 345 6789',
                address: '456 Galle Road, Colombo 04'
            },
            service: {
                name: 'Oil Change',
                description: 'Regular oil change service with high-quality engine oil and filter replacement.'
            }
        },
        {
            id: '6',
            cancelledDate: '2024-12-31T08:45:00Z',
            checkInDate: '2025-01-02T15:00:00Z',
            customerName: 'S. Silva',
            vehicle: { make: 'Mitsubishi', model: 'Lancer', year: 2019 },
            serviceType: 'Tire Replacement',
            // serviceCenter: 'Express Car Care',
            advanceAmount: 6250,
            refundStatus: 'Completed',
            refundEligibility: '0%',
            daysBeforeCheckIn: 2,
            refundBreakdown: {
                customerRefund: 0,
                platformCommission: 500,
                serviceCenterPayout: 5750
            },
            customer: {
                name: 'S. Silva',
                email: 's.silva@email.com',
                contactNumber: '+94 776789012'
            },
            serviceCenter: {
                name: 'Express Car Care',
                email: 'contact@expresscarcare.lk',
                contact: '+94 11 234 5678',
                address: '123 Main Street, Colombo 03'
            },
            service: {
                name: 'Tire Replacement',
                description: 'Professional tire installation and balancing service with wheel alignment check.'
            }
        }
    ];

    // Filter bookings based on selected filters
    const filteredBookings = refundBookings.filter(booking => {
        const statusMatch = statusFilter === 'all' || booking.refundStatus.toLowerCase() === statusFilter.toLowerCase();
        const eligibilityMatch = eligibilityFilter === 'all' || booking.refundEligibility === eligibilityFilter;
        return statusMatch && eligibilityMatch;
    });

    const displayedBookings = filteredBookings.slice(0, displayCount);
    const hasMore = displayCount < filteredBookings.length;

    const handleLoadMore = () => {
        setDisplayCount(prev => Math.min(prev + itemsPerPage, filteredBookings.length));
    };

    const handleViewRefund = (refundId: string) => {
        setSelectedRefundId(refundId);
        setIsPopupOpen(true);
    };

    const handleClosePopup = () => {
        setIsPopupOpen(false);
        setSelectedRefundId(null);
    };

    // const handleProcessRefund = (refundId: string) => {
    //     // In a real app, this would make an API call
    //     console.log('Processing refund for booking:', refundId);
    //     // Update the refund status or refresh data
    // };

    const selectedRefund = selectedRefundId
        ? refundBookings.find(r => r.id === selectedRefundId)
        : null;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-LK', {
            style: 'currency',
            currency: 'LKR',
            minimumFractionDigits: 2
        }).format(amount);
    };

    // const getRefundStats = () => {
    //     const totalRefunds = refundBookings.length;
    //     const pendingRefunds = refundBookings.filter(r => r.refundStatus === 'Pending').length;
    //     const processedRefunds = refundBookings.filter(r => r.refundStatus === 'Processed').length;
    //     const completedRefunds = refundBookings.filter(r => r.refundStatus === 'Completed').length;

    //     const totalRefundAmount = refundBookings.reduce((sum, r) => sum + r.refundBreakdown.customerRefund, 0);
    //     const totalCommission = refundBookings.reduce((sum, r) => sum + r.refundBreakdown.platformCommission, 0);
    //     const totalServiceCenterPayout = refundBookings.reduce((sum, r) => sum + r.refundBreakdown.serviceCenterPayout, 0);

    //     return {
    //         totalRefunds,
    //         pendingRefunds,
    //         processedRefunds,
    //         completedRefunds,
    //         totalRefundAmount,
    //         totalCommission,
    //         totalServiceCenterPayout
    //     };
    // };

    // const stats = getRefundStats();

    return (

        <>
            <div className="metric-cards-row">
                <div className="booking-oversight__search-container">
                    <input
                        type="text"
                        placeholder="Search Bookings..."
                        className="booking-oversight__search-input"
                    />
                    <button className="booking-oversight__search-btn">
                        <Search size={20} strokeWidth={3} />
                    </button>
                </div>

                <div className="booking-oversight__controls">
                    <select
                        className="booking-oversight__dropdown"
                        value={eligibilityFilter}
                        onChange={(e) => setEligibilityFilter(e.target.value)}
                    >
                        <option value="today" selected disabled>Refund Eligibilty</option>
                        <option value="100%">100% Refund</option>
                        <option value="50%">50% Refund</option>
                        <option value="0%">0% Refund</option>
                    </select>
                </div>

                <div className="booking-oversight__controls">
                    <select
                        className="booking-oversight__dropdown"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="processed">Processed</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
            </div>

            <div className="metric-cards-row">
                <MetricCard
                    title="Total Cancelled Bookings"
                    amount="10"
                    change="2.4%"
                    changeType="positive"
                />
                <MetricCard
                    title="Pending Refunds"
                    amount="3"
                    change="6.3%"
                    changeType="positive"
                />
                <MetricCard
                    title="Processed Refunds"
                    amount="3"
                    change="2.4%"
                    changeType="negative"
                />
                <MetricCard
                    title="Completed Refunds"
                    amount="4"
                    change="12.1%"
                    changeType="positive"
                />
            </div>

            {/* Financial Summary
            <div className="refund-management__financial-summary">
                <div className="refund-management__financial-card">
                    <div className="refund-management__financial-amount">{formatCurrency(stats.totalRefundAmount)}</div>
                    <div className="refund-management__financial-label">Total Customer Refunds</div>
                </div>
                <div className="refund-management__financial-card refund-management__financial-card--commission">
                    <div className="refund-management__financial-amount">{formatCurrency(stats.totalCommission)}</div>
                    <div className="refund-management__financial-label">Platform Commission</div>
                </div>
                <div className="refund-management__financial-card refund-management__financial-card--payout">
                    <div className="refund-management__financial-amount">{formatCurrency(stats.totalServiceCenterPayout)}</div>
                    <div className="refund-management__financial-label">Service Center Payouts</div>
                </div>
            </div> */}

            {/* Refund Table */}
            <div className="metric-cards-row">
                <div className="refund-management__table">
                    <div className="refund-management__table-header">
                        {/* <div className="refund-management__header-cell">Booking ID</div> */}
                        <div className="refund-management__header-cell">Customer</div>
                        <div className="refund-management__header-cell">Vehicle</div>
                        <div className="refund-management__header-cell">Service</div>
                        <div className="refund-management__header-cell">Advance Paid</div>
                        <div className="refund-management__header-cell">Refund Eligibility</div>
                        <div className="refund-management__header-cell">Days Before Check-in</div>
                        <div className="refund-management__header-cell">Customer Refund</div>
                        <div className="refund-management__header-cell">Status</div>
                        <div className="refund-management__header-cell">Actions</div>
                    </div>

                    <div className="refund-management__table-body">
                        {displayedBookings.map((refund) => (
                            <div key={refund.id} className="refund-management__row">
                                {/* <div className="refund-management__cell" data-label="Booking ID">#{refund.id}</div> */}
                                <div className="refund-management__cell" data-label="Customer">{refund.customerName}</div>
                                <div className="refund-management__cell" data-label="Vehicle">
                                    {refund.vehicle.make} {refund.vehicle.model} {refund.vehicle.year}
                                </div>
                                <div className="refund-management__cell" data-label="Service">{refund.serviceType}</div>
                                <div className="refund-management__cell" data-label="Advance Paid">
                                    {formatCurrency(refund.advanceAmount)}
                                </div>
                                <div className="refund-management__cell" data-label="Refund Eligibility">
                                    <span className={`refund-management__eligibility refund-management__eligibility--${refund.refundEligibility.replace('%', '')}`}>
                                        {refund.refundEligibility}
                                    </span>
                                </div>
                                <div className="refund-management__cell" data-label="Days Before Check-in">
                                    {refund.daysBeforeCheckIn} days
                                </div>
                                <div className="refund-management__cell" data-label="Customer Refund">
                                    <span className="refund-management__refund-amount">
                                        {formatCurrency(refund.refundBreakdown.customerRefund)}
                                    </span>
                                </div>
                                <div className="refund-management__cell" data-label="Status">
                                    <span className={`refund-management__status refund-management__status--${refund.refundStatus.toLowerCase()}`}>
                                        {refund.refundStatus}
                                    </span>
                                </div>
                                <div className="refund-management__cell" data-label="Actions">
                                    <div className="refund-management__actions">

                                        {refund.refundStatus === 'Pending' ?
                                            (<button className="refund-management__action-btn" onClick={() => handleViewRefund(refund.id)} >
                                                Process Refund
                                            </button>) :
                                            (<button className="refund-management__action-btn" onClick={() => handleViewRefund(refund.id)} >
                                                View Details
                                            </button>)
                                        }

                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {hasMore && (
                        <div className="refund-management__load-more">
                            <button
                                className="refund-management__load-more-btn"
                                onClick={handleLoadMore}
                            >
                                Load More ({filteredBookings.length - displayCount} remaining)
                            </button>
                        </div>
                    )}
                </div>

                {/* Refund Details Popup */}
                {selectedRefund && (
                    <RefundDetailsPopup
                        refund={selectedRefund}
                        isOpen={isPopupOpen}
                        onClose={handleClosePopup}
                    />
                )}

            </div>

        </>
    );
};

export default RefundManagement;