import { useState, useEffect } from 'react';
import { Search, CheckCircle, Calendar } from 'lucide-react';
import CompletedBookingDetailsPopup from '../../components/Admin/BookingDetailsPopup/CompletedBookingDetailsPopup';
import '../../layouts/DashboardLayout.scss';
import "../../styles/components/SearchBarAndFilters.scss"
import "../../components/Admin/BookingsTable/BookingsTable.scss"

// Define interface for completed booking list item
interface CompletedBooking {
    bookingId: string;
    customer: string;
    vehicle: string;
    serviceType: string;
    completedDate: string;
    completedTime: string;
    totalAmount: number;
    paymentStatus: 'paid' | 'partially-paid' | 'pending';
    serviceAdvisor: string;
    duration: string; // e.g., "2h 30m"
    rating?: number; // Customer rating 1-5
}

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
        rating?: number; // 1-5 stars
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

const CompletedBookings: React.FC = () => {
    const [periodFilter, setPeriodFilter] = useState<string>('thisMonth');
    const [paymentFilter, setPaymentFilter] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState<string>('');

    // State for popup
    const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
    const [selectedBooking, setSelectedBooking] = useState<CompletedBookingDetails | null>(null);
    const [loadingBookingId, setLoadingBookingId] = useState<string | null>(null);

    // Sample completed bookings data
    const completedBookings: CompletedBooking[] = [
        {
            bookingId: 'BKG-1001',
            customer: 'Ruwan Perera',
            vehicle: 'Toyota Aqua 2018',
            serviceType: 'Full Vehicle Service',
            completedDate: '2025-08-08',
            completedTime: '02:30 PM',
            totalAmount: 16500,
            paymentStatus: 'paid',
            serviceAdvisor: 'M. Perera',
            duration: '2h 45m',
            rating: 5
        },
        {
            bookingId: 'BKG-1002',
            customer: 'Shenal Fernando',
            vehicle: 'Suzuki Alto 2021',
            serviceType: 'Engine Tune-Up',
            completedDate: '2025-08-07',
            completedTime: '11:15 AM',
            totalAmount: 8500,
            paymentStatus: 'paid',
            serviceAdvisor: 'R. Mendis',
            duration: '2h 15m',
            rating: 4
        },
        {
            bookingId: 'BKG-1003',
            customer: 'Nishadi Jayasinghe',
            vehicle: 'Honda Vezel 2017',
            serviceType: 'Clutch Replacement',
            completedDate: '2025-08-06',
            completedTime: '04:45 PM',
            totalAmount: 27000,
            paymentStatus: 'partially-paid',
            serviceAdvisor: 'A. Fernando',
            duration: '4h 30m'
        },
        {
            bookingId: 'BKG-1004',
            customer: 'Kasun Wijeratne',
            vehicle: 'Nissan Leaf 2020',
            serviceType: 'Battery Check',
            completedDate: '2025-08-05',
            completedTime: '10:30 AM',
            totalAmount: 3500,
            paymentStatus: 'paid',
            serviceAdvisor: 'M. Perera',
            duration: '1h 15m',
            rating: 5
        },
        {
            bookingId: 'BKG-1005',
            customer: 'Tharindu Silva',
            vehicle: 'Mitsubishi Outlander 2019',
            serviceType: 'Air Conditioning Service',
            completedDate: '2025-08-04',
            completedTime: '01:20 PM',
            totalAmount: 9200,
            paymentStatus: 'paid',
            serviceAdvisor: 'R. Mendis',
            duration: '1h 45m',
            rating: 4
        },
        {
            bookingId: 'BKG-1006',
            customer: 'Sanduni Perera',
            vehicle: 'Suzuki Wagon R 2020',
            serviceType: 'Brake System Repair',
            completedDate: '2025-08-03',
            completedTime: '03:15 PM',
            totalAmount: 14800,
            paymentStatus: 'pending',
            serviceAdvisor: 'A. Fernando',
            duration: '3h 20m'
        }
    ];

    // Function to fetch detailed completed booking data
    const fetchCompletedBookingDetails = async (bookingId: string): Promise<CompletedBookingDetails | null> => {
        setLoadingBookingId(bookingId);
        try {
            // Replace this with your actual API call
            // const response = await fetch(`/api/completed-bookings/${bookingId}`);
            // const bookingDetails = await response.json();
            // return bookingDetails;

            const details = getMockCompletedBookingDetails(bookingId);

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));

            return details;
        } catch (error) {
            console.error('Error fetching completed booking details:', error);
            return null;
        } finally {
            setLoadingBookingId(null);
        }
    };

    // Mock function for completed booking details
    const getMockCompletedBookingDetails = (bookingId: string): CompletedBookingDetails => {
        const booking = completedBookings.find(b => b.bookingId === bookingId);
        if (!booking) throw new Error('Booking not found');

        const vehicleParts = booking.vehicle.split(' ');
        const yearMatch = booking.vehicle.match(/\d{4}/);
        const make = vehicleParts[0] || 'Unknown';
        const model = vehicleParts.slice(1, -1).join(' ') || 'Unknown';
        const year = yearMatch ? parseInt(yearMatch[0]) : 2020;

        const checkInMileage = Math.floor(Math.random() * 50000) + 20000;
        const completionMileage = checkInMileage + Math.floor(Math.random() * 10) + 1;

        const estimatedCost = getServiceCost(booking.serviceType);
        const actualCost = booking.totalAmount;
        
        // Determine if advance was required based on customer history simulation
        const paymentRequired = Math.random() > 0.7; // 30% chance of requiring advance
        const advancePaid = paymentRequired ? Math.round(estimatedCost * 0.25) : undefined;
        
        const additionalServicesAmount = actualCost - estimatedCost;
        
        return {
            id: bookingId,
            bookedDate: "2025-08-01T09:00:00",
            checkInDate: `${booking.completedDate}T08:30:00`,
            completedDate: `${booking.completedDate}T${booking.completedTime.replace(' ', '')}`,
            status: 'Completed',
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
                mileageAtCheckIn: checkInMileage,
                mileageAtCompletion: completionMileage,
                fuelLevel: ['1/4', '1/2', '3/4', 'Full'][Math.floor(Math.random() * 4)],
                vehicleConditionNotes: "Vehicle returned in excellent condition. No new issues identified."
            },
            serviceAdvisor: {
                technicianId: `SA-${Math.floor(Math.random() * 100).toString().padStart(3, '0')}`,
                name: booking.serviceAdvisor,
                contactNumber: "+94 71 987 6543"
            },
            completedServices: [
                {
                    serviceId: "SRV-001",
                    name: booking.serviceType,
                    description: getServiceDescription(booking.serviceType),
                    estimatedDurationMinutes: getServiceDuration(booking.serviceType),
                    actualDurationMinutes: parseDurationToMinutes(booking.duration),
                    estimatedCost: estimatedCost,
                    actualCost: booking.totalAmount - additionalServicesAmount,
                    status: 'completed',
                    completedTasks: generateCompletedTasks(booking.serviceType)
                }
            ],
            additionalServices: additionalServicesAmount > 0 ? generateCompletedAdditionalServices(booking.serviceType, additionalServicesAmount) : [],
            payments: {
                originalEstimatedAmount: estimatedCost,
                additionalServicesAmount: additionalServicesAmount,
                totalAmount: booking.totalAmount,
                advancePaid: advancePaid,
                finalPayment: booking.totalAmount - (advancePaid || 0),
                paymentMethod: booking.paymentStatus === 'paid' ? 'Credit Card' : 'Cash',
                paymentStatus: booking.paymentStatus,
                paymentRequired: paymentRequired,
                paymentReason: paymentRequired ? 'History of no-shows' : undefined,
                transactionDetails: {
                    transactionId: booking.paymentStatus === 'paid' ? `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}` : undefined,
                    paidAt: booking.paymentStatus === 'paid' ? `${booking.completedDate}T${booking.completedTime.replace(' ', '')}` : undefined
                }
            },
            serviceQuality: {
                rating: booking.rating,
                feedback: booking.rating ? generateFeedback(booking.rating) : undefined,
                ratedAt: booking.rating ? `${booking.completedDate}T${booking.completedTime.replace(' ', '')}` : undefined
            },
            deliveryDetails: {
                deliveredAt: `${booking.completedDate}T${booking.completedTime.replace(' ', '')}`,
                deliveredTo: booking.customer,
                deliveryNotes: "Vehicle delivered with all completed work documentation. Customer satisfied with service quality."
            },
            totalServiceTime: {
                estimatedMinutes: getServiceDuration(booking.serviceType),
                actualMinutes: parseDurationToMinutes(booking.duration)
            },
            warranty: {
                warrantyPeriodDays: getWarrantyPeriod(booking.serviceType),
                warrantyItems: getWarrantyItems(booking.serviceType),
                warrantyExpiresAt: getWarrantyExpiryDate(booking.completedDate, getWarrantyPeriod(booking.serviceType))
            }
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

    const parseDurationToMinutes = (duration: string): number => {
        const hourMatch = duration.match(/(\d+)h/);
        const minuteMatch = duration.match(/(\d+)m/);
        
        const hours = hourMatch ? parseInt(hourMatch[1]) : 0;
        const minutes = minuteMatch ? parseInt(minuteMatch[1]) : 0;
        
        return hours * 60 + minutes;
    };

    const generateCompletedTasks = (serviceType: string) => {
        const baseTasks = {
            'Full Vehicle Service': [
                'Engine Oil Change',
                'Filter Replacements',
                'Brake Inspection'
            ],
            'Brake System Repair': [
                'Brake Pad Replacement',
                'Brake Fluid Change',
                'System Testing'
            ],
            'Engine Tune-Up': [
                'Spark Plug Replacement',
                'Air Filter Cleaning',
                'Engine Diagnostics'
            ]
        };

        const tasks = baseTasks[serviceType as keyof typeof baseTasks] || ['Primary Task', 'Secondary Task', 'Final Inspection'];
        
        return tasks.map((task, index) => ({
            subTaskId: `ST-00${index + 1}`,
            description: task,
            assignedTechnician: {
                technicianId: `T-00${index + 1}`,
                name: ['Amal Perera', 'Ruwan Silva', 'Kavindu Jayasuriya'][index % 3],
                contactNumber: `+94 76 555 000${index + 1}`
            },
            startedAt: `2025-08-0${Math.floor(Math.random() * 7) + 1}T09:${30 + index * 30}:00`,
            completedAt: `2025-08-0${Math.floor(Math.random() * 7) + 1}T${10 + index}:${15 + index * 20}:00`,
            actualDuration: 45 + Math.floor(Math.random() * 30),
            partsUsed: generatePartsUsed(serviceType, index),
            notes: index === 0 ? 'Task completed successfully with no issues' : undefined
        }));
    };

    const generatePartsUsed = (serviceType: string, taskIndex: number) => {
        const partsData = {
            'Full Vehicle Service': [
                [
                    {
                        partId: "P-001",
                        name: "Engine Oil 5W-30",
                        quantity: 4,
                        costPerUnit: 800,
                        totalCost: 3200,
                        source: 'inventory' as const
                    }
                ],
                [
                    {
                        partId: "P-002",
                        name: "Oil Filter",
                        quantity: 1,
                        costPerUnit: 1200,
                        totalCost: 1200,
                        source: 'inventory' as const
                    }
                ],
                []
            ],
            'Brake System Repair': [
                [
                    {
                        partId: "P-003",
                        name: "Brake Pads (Front)",
                        quantity: 1,
                        costPerUnit: 4500,
                        totalCost: 4500,
                        source: 'ordered' as const
                    }
                ],
                [
                    {
                        partId: "P-004",
                        name: "Brake Fluid DOT 4",
                        quantity: 1,
                        costPerUnit: 800,
                        totalCost: 800,
                        source: 'inventory' as const
                    }
                ],
                []
            ]
        };

        const serviceData = partsData[serviceType as keyof typeof partsData];
        return serviceData ? (serviceData[taskIndex] || []) : [];
    };

    const generateCompletedAdditionalServices = (originalService: string, amount: number) => {
        return [
            {
                serviceId: "ADD-001",
                name: "Battery Replacement",
                description: "Battery showing weak performance, replacement completed",
                priority: 'medium' as const,
                identifiedBy: "Service Advisor",
                identifiedAt: "2025-08-05T11:00:00",
                estimatedCost: amount,
                actualCost: amount,
                actualDuration: 30,
                customerApprovalStatus: 'approved' as const,
                approvedAt: "2025-08-05T11:30:00",
                recommendationNotes: "Battery replacement completed successfully. New battery installed with 2-year warranty."
            }
        ];
    };

    const generateFeedback = (rating: number): string => {
        const feedbacks = {
            5: "Excellent service! Very professional and completed on time. Highly recommended.",
            4: "Good service overall. Work quality was satisfactory and staff was friendly.",
            3: "Average service. Work was completed but took longer than expected.",
            2: "Below average service. Had some issues with the work quality.",
            1: "Poor service. Not satisfied with the work done."
        };
        return feedbacks[rating as keyof typeof feedbacks] || '';
    };

    const getWarrantyPeriod = (serviceType: string): number => {
        const periods: Record<string, number> = {
            'Full Vehicle Service': 30,
            'Engine Tune-Up': 90,
            'Clutch Replacement': 365,
            'Battery Check': 7,
            'Brake System Repair': 180,
            'Air Conditioning Service': 60,
            'Suspension Repair': 180
        };
        return periods[serviceType] || 30;
    };

    const getWarrantyItems = (serviceType: string): string[] => {
        const items: Record<string, string[]> = {
            'Full Vehicle Service': ['Oil change', 'Filter replacements', 'General inspection'],
            'Engine Tune-Up': ['Spark plugs', 'Air filter', 'Engine diagnostics'],
            'Clutch Replacement': ['Clutch disc', 'Pressure plate', 'Release bearing'],
            'Battery Check': ['Battery testing'],
            'Brake System Repair': ['Brake pads', 'Brake fluid', 'System testing'],
            'Air Conditioning Service': ['AC gas refill', 'System cleaning'],
            'Suspension Repair': ['Shock absorbers', 'System alignment']
        };
        return items[serviceType] || ['Service work'];
    };

    const getWarrantyExpiryDate = (completedDate: string, warrantyDays: number): string => {
        const date = new Date(completedDate);
        date.setDate(date.getDate() + warrantyDays);
        return date.toISOString();
    };

    // Handle view details click
    const handleViewDetails = async (bookingId: string) => {
        try {
            const bookingDetails = await fetchCompletedBookingDetails(bookingId);
            if (bookingDetails) {
                setSelectedBooking(bookingDetails);
                setIsPopupOpen(true);
            }
        } catch (error) {
            console.error('Failed to fetch completed booking details:', error);
            // You might want to show a toast notification here
        }
    };

    // Handle popup close
    const handleClosePopup = () => {
        setIsPopupOpen(false);
        setSelectedBooking(null);
    };

    // Filter completed bookings
    const filterCompletedBookings = (bookings: CompletedBooking[]): CompletedBooking[] => {
        return bookings.filter(booking => {
            const matchesSearch = searchTerm === '' ||
                booking.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.serviceType.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesPayment = paymentFilter === 'all' || booking.paymentStatus === paymentFilter;

            return matchesSearch && matchesPayment;
        });
    };

    const filteredCompletedBookings = filterCompletedBookings(completedBookings);

    const getPaymentStatusColor = (status: string) => {
        switch (status) {
            case 'paid': return 'status--completed';
            case 'partially-paid': return 'status--pending';
            case 'pending': return 'status--cancelled';
            default: return 'status--pending';
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-LK', {
            style: 'currency',
            currency: 'LKR',
            minimumFractionDigits: 2
        }).format(amount);
    };

    const renderStars = (rating?: number) => {
        if (!rating) return <span className="no-rating">No rating</span>;
        
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
            </div>
        );
    };

    const renderCompletedBookingsTable = () => {
        const bookingsToShow = filteredCompletedBookings;

        return (
            <div className="todays-bookings__table">
                <div className="todays-bookings__table-header">
                    <div className="todays-bookings__header-cell">Booking ID</div>
                    <div className="todays-bookings__header-cell">Customer</div>
                    <div className="todays-bookings__header-cell">Vehicle</div>
                    <div className="todays-bookings__header-cell">Service Type</div>
                    <div className="todays-bookings__header-cell">Completed Date</div>
                    {/* <div className="todays-bookings__header-cell">Duration</div> */}
                    {/* <div className="todays-bookings__header-cell">Total Amount</div> */}
                    <div className="todays-bookings__header-cell">Payment Status</div>
                    {/* <div className="todays-bookings__header-cell">Rating</div> */}
                    <div className="todays-bookings__header-cell">Actions</div>
                </div>
                <div className="todays-bookings__table-body">
                    {bookingsToShow.length === 0 ? (
                        <div className="todays-bookings__empty-state">
                            <p>No completed bookings found matching your criteria.</p>
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
                                <div className="todays-bookings__cell" data-label="Completed Date">
                                    <div className="completed-date">
                                        <div>{new Date(booking.completedDate).toLocaleDateString()}</div>
                                        <div className="completed-time">{booking.completedTime}</div>
                                    </div>
                                </div>
                                {/* <div className="todays-bookings__cell" data-label="Duration">
                                    {booking.duration}
                                </div> */}
                                {/* <div className="todays-bookings__cell" data-label="Total Amount">
                                    <span className="amount">{formatCurrency(booking.totalAmount)}</span>
                                </div> */}
                                <div className="todays-bookings__cell" data-label="Payment Status">
                                    <span className={`todays-bookings__status ${getPaymentStatusColor(booking.paymentStatus)}`}>
                                        {booking.paymentStatus.replace('-', ' ')}
                                    </span>
                                </div>
                                {/* <div className="todays-bookings__cell" data-label="Rating">
                                    {renderStars(booking.rating)}
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
                            <CheckCircle size={18} strokeWidth={1.5} />
                        </span>
                        Completed Bookings ({filteredCompletedBookings.length})
                    </button>
                </div>
            </div> */}

            <div className="search-bar">
                <div className="search-content">
                    <div className="search-input-container">
                        <Search className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search completed bookings..."
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
                            <option value="last6Months">Last 6 Months</option>
                        </select>

                        <select
                            value={paymentFilter}
                            onChange={(e) => setPaymentFilter(e.target.value)}
                        >
                            <option value="all">All Payments</option>
                            <option value="paid">Paid</option>
                            <option value="partially-paid">Partially Paid</option>
                            <option value="pending">Pending</option>
                        </select>
                    </div>
                </div>
            </div>

            {renderCompletedBookingsTable()}

            {/* Completed Booking Details Popup */}
            {selectedBooking && (
                <CompletedBookingDetailsPopup
                    booking={selectedBooking}
                    isOpen={isPopupOpen}
                    onClose={handleClosePopup}
                />
            )}
        </div>
    );
};

export default CompletedBookings;