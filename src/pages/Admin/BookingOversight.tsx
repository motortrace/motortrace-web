import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, CalendarClock, Activity } from 'lucide-react';
import BookingDetailsPopup from '../../components/Admin/BookingDetailsPopup/BookingDetailsPopup';
import '../../layouts/DashboardLayout.scss';
import "../../styles/components/SearchBarAndFilters.scss"
import "../../components/Admin/BookingsTable/BookingsTable.scss"

type BookingType = 'Up Coming' | 'On Going';

// Define interfaces for the booking data
interface UpcomingBooking {
    bookingId: string;
    checkingDateTime: string;
    customer: string;
    vehicle: string;
    bookedDate: string;
    serviceType: string;
}

interface OngoingBooking {
    bookingId: string;
    customer: string;
    vehicle: string;
    serviceType: string;
    serviceAdvisor: string;
    currentTechnician: string;
    currentTask: string;
    elapsedTime: string;
    estimatedCompletion: string;
    jobCardStatus: string;
    checkInDateTime?: string;
}

// Define separate detailed booking interfaces for each type
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
        estimatedMileage?: number; // We might not know exact mileage until check-in
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
        paymentReason?: string; // Reason for requiring payment
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
    // Original booked services - locked and confirmed
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
                estimatedArrival?: string; // For ordered parts
            }[];
        }[];
    }[];
    // Additional services identified during inspection
    additionalServices: {
        serviceId: string;
        name: string;
        description: string;
        priority: 'low' | 'medium' | 'high' | 'critical';
        identifiedBy: string; // Service advisor name
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

const BookingOversight: React.FC = () => {
    const [periodFilter, setPeriodFilter] = useState<string>('today');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [searchTerm, setSearchTerm] = useState<string>('');

    // State for popup
    const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);
    const [selectedBooking, setSelectedBooking] = useState<UpcomingBookingDetails | OngoingBookingDetails | null>(null);
    const [loadingBookingId, setLoadingBookingId] = useState<string | null>(null);

    const { bookingType } = useParams<{ bookingType?: string }>();
    const navigate = useNavigate();

    // URL to tab mapping
    const urlToTabMap: Record<string, BookingType> = {
        'upComing': 'Up Coming',
        'onGoing': 'On Going'
    };

    const tabToUrlMap: Record<BookingType, string> = {
        'Up Coming': 'upComing',
        'On Going': 'onGoing'
    };

    const getInitialTab = (): BookingType => {
        if (bookingType && urlToTabMap[bookingType]) {
            return urlToTabMap[bookingType];
        }
        return 'Up Coming';
    };

    const [activeTab, setActiveTab] = useState<BookingType>(getInitialTab);

    useEffect(() => {
        const newTab = getInitialTab();
        if (newTab !== activeTab) {
            setActiveTab(newTab);
        }
    }, [bookingType]);

    const handleTabChange = (newTab: BookingType) => {
        setActiveTab(newTab);
        const urlType = tabToUrlMap[newTab];
        navigate(`/admin/bookingManagement/${urlType}`, { replace: true });
    };

    // Sample data - In real implementation, this would come from an API
    const upcomingBookings: UpcomingBooking[] = [
        {
            bookingId: 'BKG-1021',
            checkingDateTime: '2025-08-18 09:00 AM',
            customer: 'Ruwan Perera',
            vehicle: 'Toyota Aqua 2018',
            bookedDate: '2025-08-06',
            serviceType: 'Full Vehicle Service'
        },
        {
            bookingId: 'BKG-1022',
            checkingDateTime: '2025-08-20 10:00 AM',
            customer: 'Shenal Fernando',
            vehicle: 'Suzuki Alto 2021',
            bookedDate: '2025-08-08',
            serviceType: 'Engine Tune-Up'
        },
        {
            bookingId: 'BKG-1023',
            checkingDateTime: '2025-08-16 01:00 PM',
            customer: 'Nishadi Jayasinghe',
            vehicle: 'Honda Vezel 2017',
            bookedDate: '2025-08-08',
            serviceType: 'Clutch Replacement'
        },
        {
            bookingId: 'BKG-1024',
            checkingDateTime: '2025-08-20 01:00 PM',
            customer: 'Kasun Wijeratne',
            vehicle: 'Nissan Leaf 2020',
            bookedDate: '2025-08-09',
            serviceType: 'Battery Check'
        },
        {
            bookingId: 'BKG-1025',
            checkingDateTime: '2025-08-21 10:30 AM',
            customer: 'Tharindu Silva',
            vehicle: 'Mitsubishi Outlander 2019',
            bookedDate: '2025-08-10',
            serviceType: 'Engine Tune-Up'
        }
    ];

    const ongoingBookings: OngoingBooking[] = [
        {
            bookingId: 'BKG-1011',
            customer: 'Chamath Abeysekara',
            vehicle: 'Toyota Corolla Axio 2016',
            serviceType: 'Full Vehicle Service',
            serviceAdvisor: 'M. Perera',
            currentTechnician: 'Amal Perera',
            currentTask: 'Engine Oil Change',
            elapsedTime: '45m',
            estimatedCompletion: '12:00 PM',
            jobCardStatus: 'in-progress',
            checkInDateTime: '2025-08-09 08:30 AM'
        },
        {
            bookingId: 'BKG-1012',
            customer: 'Nimali Jayawardena',
            vehicle: 'Honda Grace 2018',
            serviceType: 'Brake System Repair',
            serviceAdvisor: 'R. Mendis',
            currentTechnician: 'Ruwan Silva',
            currentTask: 'Brake Pad Replacement',
            elapsedTime: '1h 10m',
            estimatedCompletion: '11:30 AM',
            jobCardStatus: 'in-progress',
            checkInDateTime: '2025-08-09 09:00 AM'
        },
        {
            bookingId: 'BKG-1013',
            customer: 'Sajith Bandara',
            vehicle: 'Nissan X-Trail 2019',
            serviceType: 'Air Conditioning Service',
            serviceAdvisor: 'M. Perera',
            currentTechnician: 'Kavindu Jayasuriya',
            currentTask: 'AC Gas Refill',
            elapsedTime: '30m',
            estimatedCompletion: '11:15 AM',
            jobCardStatus: 'in-progress',
            checkInDateTime: '2025-08-09 10:00 AM'
        },
        {
            bookingId: 'BKG-1014',
            customer: 'Gayan Kumara',
            vehicle: 'Mazda Demio 2015',
            serviceType: 'Engine Tune-Up',
            serviceAdvisor: 'A. Fernando',
            currentTechnician: 'Tharindu Madushan',
            currentTask: 'Spark Plug Replacement',
            elapsedTime: '20m',
            estimatedCompletion: '12:45 PM',
            jobCardStatus: 'in-progress',
            checkInDateTime: '2025-08-09 11:30 AM'
        },
        {
            bookingId: 'BKG-1015',
            customer: 'Sanduni Perera',
            vehicle: 'Suzuki Wagon R 2020',
            serviceType: 'Suspension Repair',
            serviceAdvisor: 'R. Mendis',
            currentTechnician: 'Nuwan Fernando',
            currentTask: 'Shock Absorber Replacement',
            elapsedTime: '2h 30m',
            estimatedCompletion: '03:30 PM',
            jobCardStatus: 'completed',
            checkInDateTime: '2025-08-09 01:00 PM'
        }
    ];

    // Function to fetch detailed booking data
    const fetchBookingDetails = async (bookingId: string): Promise<UpcomingBookingDetails | OngoingBookingDetails | null> => {
        setLoadingBookingId(bookingId);
        try {
            // Replace this with your actual API call
            // const response = await fetch(`/api/bookings/${bookingId}`);
            // const bookingDetails = await response.json();
            // return bookingDetails;

            // For now, return mock data based on the booking ID and active tab
            const details = activeTab === 'Up Coming' 
                ? getMockUpcomingBookingDetails(bookingId)
                : getMockOngoingBookingDetails(bookingId);

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));

            return details;
        } catch (error) {
            console.error('Error fetching booking details:', error);
            return null;
        } finally {
            setLoadingBookingId(null);
        }
    };

    // Mock function for upcoming booking details
    const getMockUpcomingBookingDetails = (bookingId: string): UpcomingBookingDetails => {
        const booking = upcomingBookings.find(b => b.bookingId === bookingId);
        if (!booking) throw new Error('Booking not found');

        const vehicleParts = booking.vehicle.split(' ');
        const yearMatch = booking.vehicle.match(/\d{4}/);
        const make = vehicleParts[0] || 'Unknown';
        const model = vehicleParts.slice(1, -1).join(' ') || 'Unknown';
        const year = yearMatch ? parseInt(yearMatch[0]) : 2020;

        const estimatedCost = getServiceCost(booking.serviceType);
        
        // Simulate customer history to determine if advance payment is required
        const customerHistory = generateCustomerHistory(booking.customer);
        const paymentRequired = customerHistory.riskLevel === 'high' || customerHistory.noShowCount >= 2;
        const advancePaid = paymentRequired ? Math.round(estimatedCost * 0.25) : undefined;

        return {
            id: bookingId,
            bookedDate: booking.bookedDate + 'T09:00:00',
            status: 'Up Coming',
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
            payments: {
                estimatedTotalAmount: estimatedCost,
                advancePaid: advancePaid,
                remainingEstimated: advancePaid ? estimatedCost - advancePaid : undefined,
                paymentRequired: paymentRequired,
                paymentReason: paymentRequired ? 'History of no-shows detected' : undefined
            },
            bookingNotes: "Customer requested early morning slot. Vehicle has minor scratches on left door.",
            preferredCheckInTime: booking.checkingDateTime,
            bookingConfirmation: {
                isConfirmed: Math.random() > 0.3, // 70% confirmed
                confirmedAt: Math.random() > 0.3 ? `${booking.bookedDate}T10:30:00` : undefined,
                confirmationMethod: Math.random() > 0.5 ? 'email' : 'sms'
            },
            customerHistory: customerHistory,
            reminders: {
                remindersSent: Math.floor(Math.random() * 3),
                lastReminderSent: `${booking.bookedDate}T09:00:00`,
                nextReminderScheduled: `2025-08-17T09:00:00`
            }
        };
    };

    // Mock function for ongoing booking details
    const getMockOngoingBookingDetails = (bookingId: string): OngoingBookingDetails => {
        const booking = ongoingBookings.find(b => b.bookingId === bookingId);
        if (!booking) throw new Error('Booking not found');

        const vehicleParts = booking.vehicle.split(' ');
        const yearMatch = booking.vehicle.match(/\d{4}/);
        const make = vehicleParts[0] || 'Unknown';
        const model = vehicleParts.slice(1, -1).join(' ') || 'Unknown';
        const year = yearMatch ? parseInt(yearMatch[0]) : 2020;

        const originalCost = getServiceCost(booking.serviceType);
        
        // Simulate if advance was required for this booking
        const paymentRequired = Math.random() > 0.7; // 30% chance advance was required
        const advancePaid = paymentRequired ? Math.round(originalCost * 0.25) : undefined;

        // Generate realistic additional services based on vehicle inspection
        const additionalServices = generateAdditionalServices(booking.serviceType, booking.vehicle);
        const additionalServicesAmount = additionalServices.reduce((sum, service) => 
            service.customerApprovalStatus === 'approved' ? sum + service.estimatedCost : sum, 0
        );

        return {
            id: bookingId,
            bookedDate: "2025-08-05T09:00:00",
            checkInDate: booking.checkInDateTime + ":00" || "2025-08-09T10:30:00",
            status: 'On Going',
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
                mileageAtCheckIn: Math.floor(Math.random() * 50000) + 20000,
                fuelLevel: ['1/4', '1/2', '3/4', 'Full'][Math.floor(Math.random() * 4)],
                vehicleConditionNotes: "Minor scratches on bumper, tire pressure low on rear left"
            },
            serviceAdvisor: {
                technicianId: `SA-${Math.floor(Math.random() * 100).toString().padStart(3, '0')}`,
                name: booking.serviceAdvisor,
                contactNumber: "+94 71 987 6543"
            },
            bookedServices: [
                {
                    serviceId: "SRV-001",
                    name: booking.serviceType,
                    description: getServiceDescription(booking.serviceType),
                    estimatedDurationMinutes: getServiceDuration(booking.serviceType),
                    estimatedCost: originalCost,
                    actualCost: booking.jobCardStatus === 'completed' ? originalCost : undefined,
                    status: booking.jobCardStatus === 'completed' ? 'completed' : 'in-progress',
                    subTasks: generateSubTasks(booking.serviceType, booking.currentTask, booking.currentTechnician)
                }
            ],
            additionalServices: additionalServices,
            payments: {
                originalEstimatedAmount: originalCost,
                advancePaid: advancePaid,
                additionalServicesAmount: additionalServicesAmount,
                totalActualAmount: originalCost + additionalServicesAmount,
                remainingAmount: (originalCost + additionalServicesAmount) - (advancePaid || 0),
                paymentRequired: paymentRequired,
                paymentReason: paymentRequired ? 'History of no-shows' : undefined
            },
            jobCardStatus: getJobCardStatus(booking.jobCardStatus),
            estimatedCompletionTime: booking.estimatedCompletion,
            actualProgress: {
                completedTasks: booking.jobCardStatus === 'completed' ? 2 : 1,
                totalTasks: 3,
                overallCompletionPercentage: booking.jobCardStatus === 'completed' ? 100 : 60
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

    const generateSubTasks = (serviceType: string, currentTask: string, currentTechnician: string) => {
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

        const tasks = baseTasks[serviceType as keyof typeof baseTasks] || [currentTask, 'Additional Check', 'Final Inspection'];
        
        return tasks.map((task, index) => ({
            subTaskId: `ST-00${index + 1}`,
            description: task,
            assignedTechnician: task === currentTask ? {
                technicianId: "T-001",
                name: currentTechnician,
                contactNumber: "+94 76 555 0001"
            } : undefined,
            status: task === currentTask ? 'in-progress' as const : 'not-started' as const,
            startedAt: task === currentTask ? "2025-08-09T10:30:00" : undefined,
            estimatedDuration: 60,
            partsUsed: task === currentTask ? generatePartsUsed(serviceType) : []
        }));
    };

    const generatePartsUsed = (serviceType: string) => {
        const partsData = {
            'Full Vehicle Service': [
                {
                    partId: "P-001",
                    name: "Engine Oil 5W-30",
                    quantity: 4,
                    costPerUnit: 800,
                    source: 'inventory' as const,
                    availabilityStatus: 'in-stock' as const
                },
                {
                    partId: "P-002",
                    name: "Oil Filter",
                    quantity: 1,
                    costPerUnit: 1200,
                    source: 'inventory' as const,
                    availabilityStatus: 'in-stock' as const
                }
            ],
            'Brake System Repair': [
                {
                    partId: "P-003",
                    name: "Brake Pads (Front)",
                    quantity: 1,
                    costPerUnit: 4500,
                    source: 'ordered' as const,
                    availabilityStatus: 'ordered' as const,
                    estimatedArrival: "2025-08-10T10:00:00"
                }
            ]
        };

        return partsData[serviceType as keyof typeof partsData] || [];
    };

    // Generate customer history for risk assessment
    const generateCustomerHistory = (customerName: string) => {
        const totalBookings = Math.floor(Math.random() * 20) + 1;
        const noShowCount = Math.floor(Math.random() * 4); // 0-3 no-shows
        const cancelledBookings = Math.floor(Math.random() * 3);
        const completedBookings = totalBookings - noShowCount - cancelledBookings;
        
        let riskLevel: 'low' | 'medium' | 'high' = 'low';
        if (noShowCount >= 3) riskLevel = 'high';
        else if (noShowCount >= 1) riskLevel = 'medium';
        
        return {
            totalBookings,
            completedBookings: Math.max(0, completedBookings),
            cancelledBookings,
            noShowCount,
            lastNoShowDate: noShowCount > 0 ? '2025-07-15' : undefined,
            riskLevel
        };
    };

    const generateAdditionalServices = (originalService: string, vehicle: string) => {
        // Generate realistic additional services that might be discovered during inspection
        const possibleAdditional = [
            {
                serviceId: "ADD-001",
                name: "Tire Replacement",
                description: "Front tires showing excessive wear and need immediate replacement for safety",
                priority: 'high' as const,
                identifiedBy: "Service Advisor",
                identifiedAt: "2025-08-09T11:00:00",
                estimatedCost: 8000,
                estimatedDuration: 45,
                customerApprovalStatus: 'pending' as const,
                recommendationNotes: "Current tire tread depth below safety limit. Recommend immediate replacement."
            },
            {
                serviceId: "ADD-002", 
                name: "Battery Replacement",
                description: "Battery showing weak performance, replacement recommended",
                priority: 'medium' as const,
                identifiedBy: "Service Advisor",
                identifiedAt: "2025-08-09T11:15:00",
                estimatedCost: 5500,
                estimatedDuration: 30,
                customerApprovalStatus: 'approved' as const,
                approvedAt: "2025-08-09T11:45:00",
                recommendationNotes: "Battery voltage test shows declining capacity. Replacement will prevent future breakdowns."
            }
        ];

        // Return a realistic subset based on the service type
        return possibleAdditional.slice(0, Math.random() > 0.5 ? 2 : 1);
    };

    const getJobCardStatus = (status: string): OngoingBookingDetails['jobCardStatus'] => {
        const statusMapping: Record<string, OngoingBookingDetails['jobCardStatus']> = {
            'in-progress': 'work-in-progress',
            'completed': 'ready-for-delivery',
            'pending': 'awaiting-approval'
        };
        return statusMapping[status] || 'work-in-progress';
    };

    // Handle view details click
    const handleViewDetails = async (bookingId: string) => {
        try {
            const bookingDetails = await fetchBookingDetails(bookingId);
            if (bookingDetails) {
                setSelectedBooking(bookingDetails);
                setIsPopupOpen(true);
            }
        } catch (error) {
            console.error('Failed to fetch booking details:', error);
            // You might want to show a toast notification here
        }
    };

    // Handle popup close
    const handleClosePopup = () => {
        setIsPopupOpen(false);
        setSelectedBooking(null);
    };

    // Filter bookings based on search term and filters
    const filterBookings = <T extends UpcomingBooking | OngoingBooking>(bookings: T[]): T[] => {
        return bookings.filter(booking => {
            const matchesSearch = searchTerm === '' ||
                booking.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.serviceType.toLowerCase().includes(searchTerm.toLowerCase());

            // For now, just filter by search term
            // You can add period and status filtering logic here
            return matchesSearch;
        });
    };

    const filteredUpcomingBookings = filterBookings(upcomingBookings);
    const filteredOngoingBookings = filterBookings(ongoingBookings);

    const renderUpcomingBookingsTable = () => {
        const bookingsToShow = filteredUpcomingBookings;

        return (
            <div className="todays-bookings__table">
                <div className="todays-bookings__table-header">
                    <div className="todays-bookings__header-cell">Booking ID</div>
                    <div className="todays-bookings__header-cell">Customer</div>
                    <div className="todays-bookings__header-cell">Vehicle</div>
                    <div className="todays-bookings__header-cell">Booked Date</div>
                    <div className="todays-bookings__header-cell">Checking Date & Time</div>
                    <div className="todays-bookings__header-cell">Service Type</div>
                    <div className="todays-bookings__header-cell">Actions</div>
                </div>
                <div className="todays-bookings__table-body">
                    {bookingsToShow.length === 0 ? (
                        <div className="todays-bookings__empty-state">
                            <p>No upcoming bookings found matching your criteria.</p>
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
                                <div className="todays-bookings__cell" data-label="Booked Date">
                                    {new Date(booking.bookedDate).toLocaleDateString()}
                                </div>
                                <div className="todays-bookings__cell" data-label="Checking Date & Time">
                                    {booking.checkingDateTime}
                                </div>
                                <div className="todays-bookings__cell" data-label="Service Type">
                                    {booking.serviceType}
                                </div>
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

    const renderOngoingBookingsTable = () => {
        const bookingsToShow = filteredOngoingBookings;

        return (
            <div className="todays-bookings__table">
                <div className="todays-bookings__table-header">
                    <div className="todays-bookings__header-cell">Booking ID</div>
                    <div className="todays-bookings__header-cell">Customer</div>
                    <div className="todays-bookings__header-cell">Vehicle</div>
                    <div className="todays-bookings__header-cell">Service Type</div>
                    <div className="todays-bookings__header-cell">Service Advisor</div>
                    <div className="todays-bookings__header-cell">Current Task</div>
                    <div className="todays-bookings__header-cell">Actions</div>
                </div>
                <div className="todays-bookings__table-body">
                    {bookingsToShow.length === 0 ? (
                        <div className="todays-bookings__empty-state">
                            <p>No ongoing bookings found matching your criteria.</p>
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
                                <div className="todays-bookings__cell" data-label="Service Advisor">
                                    {booking.serviceAdvisor}
                                </div>
                                <div className="todays-bookings__cell" data-label="Current Task">
                                    <div className="todays-bookings__task-info">
                                        {booking.currentTask}
                                    </div>
                                </div>

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
            <div className="user-management__header">
                <div className="user-management__tabs">
                    {Object.keys(tabToUrlMap).map((bookingTypeName) => {
                        const bookingTypeKey = bookingTypeName as BookingType;
                        return (
                            <button
                                key={bookingTypeKey}
                                className={`user-management__tab ${activeTab === bookingTypeKey ? 'user-management__tab--active' : ''}`}
                                onClick={() => handleTabChange(bookingTypeKey)}
                            >
                                <span className="user-management__tab-icon">
                                    {bookingTypeKey === 'Up Coming' ?
                                        <CalendarClock size={18} strokeWidth={1.5} /> :
                                        <Activity size={18} strokeWidth={1.5} />
                                    }
                                </span>
                                {bookingTypeKey} ({bookingTypeKey === 'Up Coming' ? filteredUpcomingBookings.length : filteredOngoingBookings.length})
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="search-bar">
                <div className="search-content">
                    <div className="search-input-container">
                        <Search className="search-icon" />
                        <input
                            type="text"
                            placeholder={`Search ${activeTab.toLowerCase()} bookings...`}
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
                        </select>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            {activeTab === 'Up Coming' ? (
                                <>
                                    <option value="pending">Pending</option>
                                    <option value="confirmed">Confirmed</option>
                                </>
                            ) : (
                                <>
                                    <option value="checked-in">Checked In</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="completed">Task Completed</option>
                                </>
                            )}
                        </select>
                    </div>
                </div>
            </div>

            {activeTab === 'Up Coming' ? renderUpcomingBookingsTable() : renderOngoingBookingsTable()}

            {/* Booking Details Popup */}
            {selectedBooking && (
                <BookingDetailsPopup
                    booking={selectedBooking}
                    isOpen={isPopupOpen}
                    onClose={handleClosePopup}
                />
            )}
        </div>
    );
};

export default BookingOversight;