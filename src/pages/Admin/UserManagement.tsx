import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './UserManagement.scss';
import { Car, Wrench, Store, Search } from 'lucide-react';

interface CarUser {
    id: string;
    name: string;
    email: string;
    phone: string;
    totalVehicles: number;
    totalBookings: number;
    status: 'Active' | 'Inactive' | 'Suspended';
    joinDate: string;
}

interface ServiceCenter {
    id: string;
    name: string;
    email: string;
    phone: string;
    location: string;
    rating: number;
    totalServices: number;
    status: 'Active' | 'Inactive' | 'Pending';
    joinDate: string;
}

interface SparePartsSeller {
    id: string;
    name: string;
    email: string;
    phone: string;
    location: string;
    totalProducts: number;
    totalSales: number;
    status: 'Active' | 'Inactive' | 'Suspended';
    joinDate: string;
}

type UserType = 'Car Users' | 'Service Centers' | 'Spare Parts Sellers';

interface UserManagementProps {
    carUsers?: CarUser[];
    serviceCenters?: ServiceCenter[];
    sparePartsSellers?: SparePartsSeller[];
}

const UserManagement: React.FC<UserManagementProps> = ({
    carUsers = [
        // ... your existing carUsers data
        {
            id: '1',
            name: 'K. Gunasekara',
            email: 'gunasekara.k@email.com',
            phone: '+94 77 234 5678',
            totalVehicles: 2,
            totalBookings: 12,
            status: 'Active',
            joinDate: '2024-03-18'
        },
        {
            id: '2',
            name: 'S. Wijesinghe',
            email: 's.wijesinghe@email.com',
            phone: '+94 71 876 5432',
            totalVehicles: 1,
            totalBookings: 6,
            status: 'Active',
            joinDate: '2024-04-05'
        },
        {
            id: '3',
            name: 'R. Abeywardena',
            email: 'abeywardena.r@email.com',
            phone: '+94 76 345 6789',
            totalVehicles: 3,
            totalBookings: 20,
            status: 'Suspended',
            joinDate: '2023-11-28'
        },
        {
            id: '4',
            name: 'D. Herath',
            email: 'd.herath@email.com',
            phone: '+94 78 555 1234',
            totalVehicles: 2,
            totalBookings: 14,
            status: 'Active',
            joinDate: '2024-02-11'
        },
        {
            id: '5',
            name: 'N. Rathnayake',
            email: 'n.rathnayake@email.com',
            phone: '+94 72 654 7890',
            totalVehicles: 1,
            totalBookings: 7,
            status: 'Inactive',
            joinDate: '2023-10-15'
        },
        {
            id: '6',
            name: 'H. Peris',
            email: 'h.peris@email.com',
            phone: '+94 75 456 7890',
            totalVehicles: 2,
            totalBookings: 18,
            status: 'Active',
            joinDate: '2024-01-29'
        },
        {
            id: '7',
            name: 'M. Silva',
            email: 'm.silva@email.com',
            phone: '+94 77 321 6549',
            totalVehicles: 3,
            totalBookings: 23,
            status: 'Active',
            joinDate: '2023-12-20'
        },
        {
            id: '8',
            name: 'L. Jayasuriya',
            email: 'l.jayasuriya@email.com',
            phone: '+94 71 912 3456',
            totalVehicles: 1,
            totalBookings: 5,
            status: 'Inactive',
            joinDate: '2023-09-12'
        },
        {
            id: '9',
            name: 'P. Ekanayake',
            email: 'p.ekanayake@email.com',
            phone: '+94 76 789 0123',
            totalVehicles: 2,
            totalBookings: 16,
            status: 'Suspended',
            joinDate: '2023-08-03'
        },
        {
            id: '10',
            name: 'T. Ranasinghe',
            email: 't.ranasinghe@email.com',
            phone: '+94 78 234 5671',
            totalVehicles: 1,
            totalBookings: 9,
            status: 'Active',
            joinDate: '2024-05-02'
        }
    ],
    serviceCenters = [
        // ... your existing serviceCenters data
        {
            id: '1',
            name: 'AutoCare Plus',
            email: 'info@autocareplus.com',
            phone: '+94 11 234 5678',
            location: 'Colombo 05',
            rating: 4.5,
            totalServices: 145,
            status: 'Active',
            joinDate: '2023-08-15'
        },
        {
            id: '2',
            name: 'Quick Fix Motors',
            email: 'contact@quickfix.com',
            phone: '+94 81 567 8901',
            location: 'Kandy',
            rating: 4.2,
            totalServices: 89,
            status: 'Active',
            joinDate: '2023-11-20'
        },
        {
            id: '3',
            name: 'Elite Service Hub',
            email: 'hello@eliteservice.com',
            phone: '+94 91 345 6789',
            location: 'Galle',
            rating: 3.8,
            totalServices: 67,
            status: 'Pending',
            joinDate: '2024-01-05'
        },
        {
            id: '4',
            name: 'Royal Auto Services',
            email: 'royal@autoservices.lk',
            phone: '+94 66 456 7890',
            location: 'Kurunegala',
            rating: 4.0,
            totalServices: 102,
            status: 'Active',
            joinDate: '2024-02-10'
        },
        {
            id: '5',
            name: 'Express Car Care',
            email: 'support@expresscarcare.com',
            phone: '+94 31 678 1234',
            location: 'Negombo',
            rating: 3.9,
            totalServices: 58,
            status: 'Inactive',
            joinDate: '2023-10-03'
        }
    ],
    sparePartsSellers = [
        // ... your existing sparePartsSellers data
        {
            id: '1',
            name: 'Parts World',
            email: 'sales@partsworld.com',
            phone: '+94 11 456 7890',
            location: 'Colombo 03',
            totalProducts: 1250,
            totalSales: 3540,
            status: 'Active',
            joinDate: '2023-07-10'
        },
        {
            id: '2',
            name: 'AutoSpares Lanka',
            email: 'info@autospares.lk',
            phone: '+94 33 678 9012',
            location: 'Kurunegala',
            totalProducts: 890,
            totalSales: 2180,
            status: 'Active',
            joinDate: '2023-09-25'
        },
        {
            id: '3',
            name: 'Genuine Parts Co.',
            email: 'contact@genuineparts.com',
            phone: '+94 47 234 5678',
            location: 'Matara',
            totalProducts: 567,
            totalSales: 1420,
            status: 'Inactive',
            joinDate: '2023-12-05'
        },
        {
            id: '4',
            name: 'Spare Hub Lanka',
            email: 'sales@sparehublk.com',
            phone: '+94 21 345 6789',
            location: 'Jaffna',
            totalProducts: 745,
            totalSales: 1930,
            status: 'Active',
            joinDate: '2024-01-15'
        },
        {
            id: '5',
            name: 'Auto Parts Express',
            email: 'info@autopartsexpress.lk',
            phone: '+94 38 567 8901',
            location: 'Kalutara',
            totalProducts: 620,
            totalSales: 1570,
            status: 'Suspended',
            joinDate: '2023-11-02'
        }
    ]
}) => {
    const { userType } = useParams<{ userType?: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<UserType>('Car Users');
    const [statusFilter, setStatusFilter] = useState('All Statuses');

    // Mapping between URL parameters and display names
    const userTypeMap: Record<string, UserType> = {
        'carUsers': 'Car Users',
        'serviceCenters': 'Service Centers',
        'sparePartsSellers': 'Spare Parts Sellers'
    };

    // Reverse mapping for navigation
    const urlTypeMap: Record<UserType, string> = {
        'Car Users': 'carUsers',
        'Service Centers': 'serviceCenters',
        'Spare Parts Sellers': 'sparePartsSellers'
    };

    // Set active tab based on URL parameter
    useEffect(() => {
        if (userType && userTypeMap[userType]) {
            setActiveTab(userTypeMap[userType]);
        } else {
            // Default to Car Users if no parameter or invalid parameter
            setActiveTab('Car Users');
            // Optionally redirect to the default route
            navigate('/admin/userManagement/carUsers', { replace: true });
        }
    }, [userType, navigate]);

    const userTypeConfig = {
        'Car Users': {
            icon: <Car size={20} strokeWidth={1.5} />,
            data: carUsers,
            headers: ['NAME', 'EMAIL', 'PHONE', 'VEHICLES', 'BOOKINGS', 'STATUS', 'ACTIONS']
        },
        'Service Centers': {
            icon: <Wrench size={18} strokeWidth={1.5} />,
            data: serviceCenters,
            headers: ['NAME', 'EMAIL', 'PHONE', 'LOCATION', 'RATING', 'SERVICES', 'STATUS', 'ACTIONS']
        },
        'Spare Parts Sellers': {
            icon: <Store size={18} strokeWidth={1.5} />,
            data: sparePartsSellers,
            headers: ['NAME', 'EMAIL', 'PHONE', 'LOCATION', 'PRODUCTS', 'SALES', 'STATUS', 'ACTIONS']
        }
    };

    // Handle tab change and update URL
    const handleTabChange = (newTab: UserType) => {
        setActiveTab(newTab);
        const urlType = urlTypeMap[newTab];
        navigate(`/admin/userManagement/${urlType}`, { replace: true });
    };

    const handleViewProfile = (userId: string) => {
        console.log('View profile for user:', userId);
        // Implement profile view logic
    };

    const handleToggleStatus = (userId: string) => {
        console.log('Toggle status for user:', userId);
        // Implement status toggle logic
    };

    const renderTableRow = (user: any) => {
        const commonFields = (
            <>
                <div className="user-management__cell">{user.name}</div>
                <div className="user-management__cell">{user.email}</div>
                <div className="user-management__cell">{user.phone}</div>
            </>
        );

        let specificFields;
        if (activeTab === 'Car Users') {
            specificFields = (
                <>
                    <div className="user-management__cell">{user.totalVehicles}</div>
                    <div className="user-management__cell">{user.totalBookings}</div>
                </>
            );
        } else if (activeTab === 'Service Centers') {
            specificFields = (
                <>
                    <div className="user-management__cell">{user.location}</div>
                    <div className="user-management__cell">
                        <span className="user-management__rating">
                            {user.rating} ⭐
                        </span>
                    </div>
                    <div className="user-management__cell">{user.totalServices}</div>
                </>
            );
        } else {
            specificFields = (
                <>
                    <div className="user-management__cell">{user.location}</div>
                    <div className="user-management__cell">{user.totalProducts}</div>
                    <div className="user-management__cell">{user.totalSales}</div>
                </>
            );
        }

        return (
            <>
                {commonFields}
                {specificFields}
                <div className="user-management__cell">
                    <span className={`user-management__status user-management__status--${user.status.toLowerCase()}`}>
                        {user.status}
                    </span>
                </div>
                <div className="user-management__cell">
                    <div className="user-management__actions">
                        {/* <button
                            className="user-management__action-btn user-management__action-btn--view"
                            onClick={() => handleViewProfile(user.id)}
                            title="View Profile"
                        >
                            <svg width="16" height="16" viewBox="0 0 16 16">
                                <path d="M8 3C4.5 3 1.73 5.61 1 8c.73 2.39 3.5 5 7 5s6.27-2.61 7-5c-.73-2.39-3.5-5-7-5z" stroke="currentColor" strokeWidth="1.5" fill="none" />
                                <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
                            </svg>
                        </button> */}
                         <button className="todays-bookings__action-btn" onClick={() => handleViewProfile(user.id)}>
                            View
                        </button>
                        {/* <button
                            className={`user-management__action-btn ${user.status === 'Active' ? 'user-management__action-btn--disable' : 'user-management__action-btn--enable'}`}
                            onClick={() => handleToggleStatus(user.id)}
                            title={user.status === 'Active' ? 'Disable User' : 'Enable User'}
                        > */}
                            {user.status === 'Active' ? (
                                // <svg width="16" height="16" viewBox="0 0 16 16">
                                //     <path d="M8 1v14M1 8h14" stroke="currentColor" strokeWidth="1.5" transform="rotate(45 8 8)" />
                                // </svg>
                                <button className="todays-bookings__action-btn" onClick={() => handleToggleStatus(user.id)}>
                                    Disable
                                </button>
                            ) : (
                                // <svg width="16" height="16" viewBox="0 0 16 16">
                                //     <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" />
                                // </svg>
                                <button className="todays-bookings__action-btn" onClick={() => handleToggleStatus(user.id)}>
                                    Enable
                                </button>
                            )}
                        {/* </button> */}
                    </div>
                </div>
            </>
        );
    };

    return (
        <div className="user-management">
            <div className="user-management__header">
                <div className="user-management__tabs">
                    {Object.keys(userTypeConfig).map((userType) => (
                        <button
                            key={userType}
                            className={`user-management__tab ${activeTab === userType ? 'user-management__tab--active' : ''}`}
                            onClick={() => handleTabChange(userType as UserType)}
                        >
                            <span className="user-management__tab-icon">
                                {userTypeConfig[userType as UserType].icon}
                            </span>
                            {userType}
                        </button>
                    ))}
                </div>
            </div>

            <div className="user-management__content">
                <div className="user-management__content-header">
                    <div className="user-management__search-container">
                        <input
                            type="text"
                            placeholder="Search Users..."
                            className="user-management__search-input"
                        />
                        <button className="user-management__search-btn">
                            <Search size={20} strokeWidth={3} />
                        </button>
                    </div>

                    <div className="user-management__controls">
                        <select
                            className="user-management__dropdown"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">Sort By...</option>
                            <option value="Name (A-Z)">Name (A-Z)</option>
                            <option value="Name (Z-A)">Name (Z-A)</option>
                            <option value="Join Date (Newest)">Join Date (Newest)</option>
                            <option value="Join Date (Oldest)">Join Date (Oldest)</option>
                        </select>
                    </div>

                    <div className="user-management__controls">
                        <select
                            className="user-management__dropdown"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="All Statuses">Filter By...</option>
                            <option value="Pending">Pending</option>
                            <option value="Active">Active</option>
                            <option value="Suspended">Suspended</option>
                        </select>
                    </div>
                </div>

                <div className="user-management__table">
                    <div className="user-management__table-header" data-user-type={activeTab}>
                        {userTypeConfig[activeTab].headers.map((header, index) => (
                            <div key={index} className="user-management__header-cell">
                                {header}
                            </div>
                        ))}
                    </div>

                    <div className="user-management__table-body">
                        {userTypeConfig[activeTab].data.map((user: any) => (
                            <div key={user.id} className="user-management__row" data-user-type={activeTab}>
                                {renderTableRow(user)}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;