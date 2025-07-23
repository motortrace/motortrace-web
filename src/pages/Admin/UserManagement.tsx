import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import "../../styles/components/SearchBarAndFilters.scss"
import './UserManagement.scss';
import { Car, Wrench, Store, Search, Plus } from 'lucide-react';
import AddUserModal from '../../components/Admin/UserManagement/AddUserModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface CarUser {
    id: string;
    name: string;
    email: string;
    phone: string;
    totalVehicles: number;
    totalBookings: number;
    status: 'Active' | 'Suspended';
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
    status: 'Active' | 'Inactive' | 'Suspended';
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
            status: 'Suspended',
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
            status: 'Suspended',
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
            id: '4',
            name: 'Elite Service Hub',
            email: 'hello@eliteservice.com',
            phone: '+94 91 345 6789',
            location: 'Galle',
            rating: 3.8,
            totalServices: 67,
            status: 'Inactive',
            joinDate: '2024-01-05'
        },
        {
            id: '5',
            name: 'Express Car Care',
            email: 'support@expresscarcare.com',
            phone: '+94 31 678 1234',
            location: 'Negombo',
            rating: 3.9,
            totalServices: 58,
            status: 'Suspended',
            joinDate: '2023-10-03'
        }
    ],
    sparePartsSellers = [
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
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Handler to open the add user modal
    const handleOpenAddModal = () => setIsAddModalOpen(true);
    const handleCloseAddModal = () => setIsAddModalOpen(false);

    // Handlers to add new user to the correct list
    const [carUsersState, setCarUsersState] = useState(carUsers);
    const [serviceCentersState, setServiceCentersState] = useState(serviceCenters);
    const [sparePartsSellersState, setSparePartsSellersState] = useState(sparePartsSellers);

    // Pagination state
    const itemsPerPage = 5;
    const [displayCount, setDisplayCount] = useState(itemsPerPage);
    useEffect(() => {
        setDisplayCount(itemsPerPage); // Reset display count when tab changes
    }, [activeTab]);

    const handleCreateUser = async (newUser: any) => {
        if (activeTab === 'Service Centers') {
            try {
                const response = await fetch('http://localhost:3000/admin/createServiceCenter', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userType: 'Service Centers', ...newUser }),
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.error || 'Failed to create service center');
                setServiceCentersState([...serviceCentersState, data.user]);
                setIsAddModalOpen(false);
                toast.success('Service Center created successfully!');
            } catch (error: any) {
                toast.error(error.message || 'An error occurred');
            }
        } else if (activeTab === 'Spare Parts Sellers') {
            try {
                const response = await fetch('http://localhost:3000/admin/createSparePartsSeller', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userType: 'Spare Parts Sellers', ...newUser }),
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.error || 'Failed to create spare parts seller');
                setSparePartsSellersState([...sparePartsSellersState, data.user]);
                setIsAddModalOpen(false);
                toast.success('Spare Parts Seller created successfully!');
            } catch (error: any) {
                toast.error(error.message || 'An error occurred');
            }
        }
        // No Car Users creation from admin
    };

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
            data: carUsersState,
            headers: ['NAME', 'EMAIL', 'PHONE', 'VEHICLES', 'BOOKINGS', 'STATUS', 'ACTIONS']
        },
        'Service Centers': {
            icon: <Wrench size={18} strokeWidth={1.5} />,
            data: serviceCentersState,
            headers: ['NAME', 'EMAIL', 'PHONE', 'LOCATION', 'RATING', 'SERVICES', 'STATUS', 'ACTIONS']
        },
        'Spare Parts Sellers': {
            icon: <Store size={18} strokeWidth={1.5} />,
            data: sparePartsSellersState,
            headers: ['NAME', 'EMAIL', 'PHONE', 'LOCATION', 'PRODUCTS', 'SALES', 'STATUS', 'ACTIONS']
        }
    };

    // Handle tab change and update URL
    const handleTabChange = (newTab: UserType) => {
        setActiveTab(newTab);
        const urlType = urlTypeMap[newTab];
        navigate(`/admin/userManagement/${urlType}`, { replace: true });
    };

    // Updated handleViewProfile function to navigate to user profile
    const handleViewProfile = (userId: string) => {
        const urlType = urlTypeMap[activeTab];
        navigate(`/admin/userManagement/${urlType}/${userId}/profile`);
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
                        <button className="todays-bookings__action-btn" onClick={() => handleViewProfile(user.id)}>
                            View
                        </button>
                        {user.status === 'Active' ? (
                            <button className="todays-bookings__action-btn" onClick={() => handleToggleStatus(user.id)}>
                                Disable
                            </button>
                        ) : (
                            <button className="todays-bookings__action-btn" onClick={() => handleToggleStatus(user.id)}>
                                Enable
                            </button>
                        )}
                    </div>
                </div>
            </>
        );
    };

    // Table data for current tab
    const currentData = userTypeConfig[activeTab].data;
    const displayedUsers = currentData.slice(0, displayCount);
    const hasMore = displayCount < currentData.length;
    const handleLoadMore = () => {
        setDisplayCount(prev => Math.min(prev + itemsPerPage, currentData.length));
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
                <div className="search-bar" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div className="search-content" style={{ flex: 1 }}>
                        <div className="search-input-container">
                            <Search className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search Users..."
                            />
                        </div>

                        <div className="filters">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="">Sort By...</option>
                                <option value="Name (A-Z)">Name (A-Z)</option>
                                <option value="Name (Z-A)">Name (Z-A)</option>
                                <option value="Join Date (Newest)">Join Date (Newest)</option>
                                <option value="Join Date (Oldest)">Join Date (Oldest)</option>
                            </select>

                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">Filter By...</option>
                                {activeTab === 'Car Users' ? (
                                    <>
                                        <option value="Active">Active</option>
                                        <option value="Suspended">Suspended</option>
                                    </>
                                ) : activeTab === 'Service Centers' ? (
                                    <>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                        <option value="Suspended">Suspended</option>
                                    </>
                                ) : (
                                    <>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                        <option value="Suspended">Suspended</option>
                                    </>
                                )}
                            </select>
                        </div>
                    </div>
                    {activeTab !== 'Car Users' && (
                        <button
                            className="user-management__add-btn"
                            onClick={handleOpenAddModal}
                            style={{
                                background: '#0ea5e9',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontFamily: 'Poppins',
                                fontWeight: 500,
                                fontSize: '15px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                marginTop: '0px',
                                padding: '7.5px 22.5px',
                                boxSizing: 'border-box',
                            }}
                        >
                            <span style={{ display: 'flex', alignItems: 'center' }}>
                                <Plus size={18} strokeWidth={2} />
                            </span>
                            {`Create New ${activeTab.slice(0, -1)}`}
                        </button>
                    )}
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
                        {displayedUsers.map((user: any) => (
                            <div key={user.id} className="user-management__row" data-user-type={activeTab}>
                                {renderTableRow(user)}
                            </div>
                        ))}
                        {hasMore && (
                            <div className="user-management__load-more">
                                <button
                                    className="user-management__load-more-btn"
                                    onClick={handleLoadMore}
                                >
                                    Load More ({currentData.length - displayCount} remaining)
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <AddUserModal
                open={isAddModalOpen && activeTab !== 'Car Users'}
                userType={activeTab}
                onClose={handleCloseAddModal}
                onCreate={handleCreateUser}
            />
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default UserManagement;