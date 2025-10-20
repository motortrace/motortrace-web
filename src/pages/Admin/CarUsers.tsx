import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../../styles/components/SearchBarAndFilters.scss"
import './UserManagement.scss';
import { Search, UserPlus, Users, Plus } from 'lucide-react';
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

const CarUsers: React.FC = () => {
    const navigate = useNavigate();
    const [statusFilter, setStatusFilter] = useState('All Statuses');
    const [searchTerm, setSearchTerm] = useState('');
    const [carUsers, setCarUsers] = useState<CarUser[]>([]);
    const [loading, setLoading] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Fetch car users from backend
    useEffect(() => {
        fetchCarUsers();
    }, []);

    const fetchCarUsers = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No authentication token found');

            const response = await fetch('http://localhost:3000/customers', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch car users');
            }

            const result = await response.json();

            if (result.success) {
                // Transform backend data to frontend CarUser format
                // The email is now included in the joined userProfile data from the backend
                const users = result.data.map((item: any) => {
                    console.log('Backend item:', item); // Debug log
                    console.log('UserProfile data:', item.userProfile); // Debug log
                    return transformBackendToFrontend(item);
                });

                console.log('Transformed users:', users); // Debug log
                setCarUsers(users);
            }
        } catch (error: any) {
            console.error('Error fetching car users:', error);
            toast.error('Failed to load car users');
            // Fallback to empty array
            setCarUsers([]);
        } finally {
            setLoading(false);
        }
    };

    // Transform backend data to frontend CarUser format
    const transformBackendToFrontend = (backendData: any): CarUser => {
        console.log('Transforming backend data:', backendData); // Debug log
        console.log('UserProfile in backend data:', backendData.userProfile); // Debug log

        const vehicleCount = backendData.vehicles?.length || 0;
        const transformed = {
            id: backendData.id || backendData.userProfileId,
            name: backendData.userProfile?.name || backendData.name || 'Unknown',
            email: backendData.userProfile?.email || backendData.email || 'No email', // Try both sources
            phone: backendData.userProfile?.phone || backendData.phone || 'No phone',
            totalVehicles: vehicleCount === 0 ? 1 : vehicleCount, // Show 1 if 0 vehicles
            totalBookings: backendData.appointments?.length || 0,
            status: 'Active' as CarUser['status'], // You'll need to map this from backend status
            joinDate: backendData.createdAt ? new Date(backendData.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        };

        console.log('Transformed result:', transformed); // Debug log
        return transformed;
    };


    // Removed hardcoded carUsers data - now fetched from backend

    // Pagination state
    const itemsPerPage = 5;
    const [displayCount, setDisplayCount] = useState(itemsPerPage);

    const handleViewProfile = (userId: string) => {
        navigate(`/admin/userManagement/carUsers/${userId}/profile`);
    };

    const handleToggleStatus = (userId: string) => {
        console.log('Toggle status for user:', userId);
        // Implement status toggle logic
        toast.info('Status toggle functionality will be implemented');
    };

    const handleOpenAddModal = () => setIsAddModalOpen(true);
    const handleCloseAddModal = () => setIsAddModalOpen(false);

    const handleCreateUser = async (newUser: any) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No authentication token found');

            // Prepare payload for customer creation (without password)
            const customerPayload = {
                name: newUser.name,
                email: newUser.email,
                phone: newUser.phone,
                totalVehicles: newUser.totalVehicles && newUser.totalVehicles > 0 ? newUser.totalVehicles : 1, // Set to 1 if 0 or undefined
            };

            const response = await fetch('http://localhost:3000/customers/create-without-auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(customerPayload),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || data.error || 'Failed to create customer');
            }

            toast.success('Car User profile created successfully!');
            // Refresh the car users list to show the new user
            fetchCarUsers();

        } catch (error: any) {
            toast.error(error.message || 'An error occurred while creating the profile');
        }
    };

    const renderTableRow = (user: CarUser) => {
        return (
            <>
                <div className="user-management__cell">{user.name}</div>
                <div className="user-management__cell">{user.email}</div>
                <div className="user-management__cell">{user.phone}</div>
                <div className="user-management__cell">{user.totalVehicles}</div>
                <div className="user-management__cell">{user.totalBookings}</div>
                <div className="user-management__cell">
                    <span className={`user-management__status user-management__status--${user.status.toLowerCase().replace(/\s+/g, '-')}`}>
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

    // Filter and search logic
    const filteredUsers = carUsers.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             user.phone.includes(searchTerm);
        
        const matchesStatus = statusFilter === 'All Statuses' || user.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });

    const displayedUsers = filteredUsers.slice(0, displayCount);
    const hasMore = displayCount < filteredUsers.length;
    
    const handleLoadMore = () => {
        setDisplayCount(prev => Math.min(prev + itemsPerPage, filteredUsers.length));
    };

    const headers = ['NAME', 'EMAIL', 'PHONE', 'VEHICLES', 'BOOKINGS', 'STATUS', 'ACTIONS'];

    return (
        <div className="user-management">
            <div className="user-management__content">
                <div className="search-bar" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div className="search-content" style={{ flex: 1 }}>
                        <div className="search-input-container">
                            <Search className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search Car Users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="filters">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="All Statuses">All Statuses</option>
                                <option value="Active">Active</option>
                                <option value="Suspended">Suspended</option>
                            </select>

                            <select
                                onChange={(e) => {
                                    // Implement sorting logic
                                    console.log('Sort by:', e.target.value);
                                }}
                            >
                                <option value="">Sort By...</option>
                                <option value="Name (A-Z)">Name (A-Z)</option>
                                <option value="Name (Z-A)">Name (Z-A)</option>
                                <option value="Join Date (Newest)">Join Date (Newest)</option>
                                <option value="Join Date (Oldest)">Join Date (Oldest)</option>
                            </select>
                        </div>
                    </div>
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
                        Add New Car User
                    </button>
                </div>

                <div className="user-management__table">
                    <div className="user-management__table-header" data-user-type="Car Users">
                        {headers.map((header, index) => (
                            <div key={index} className="user-management__header-cell">
                                {header}
                            </div>
                        ))}
                    </div>

                    <div className="user-management__table-body">
                        {displayedUsers.map((user: CarUser) => (
                            <div key={user.id} className="user-management__row" data-user-type="Car Users">
                                {renderTableRow(user)}
                            </div>
                        ))}
                        {hasMore && (
                            <div className="user-management__load-more">
                                <button
                                    className="user-management__load-more-btn"
                                    onClick={handleLoadMore}
                                >
                                    Load More ({filteredUsers.length - displayCount} remaining)
                                </button>
                            </div>
                        )}
                        {displayedUsers.length === 0 && (
                            <div className="user-management__no-data">
                                <div className="no-data-icon">
                                    <Users size={40} strokeWidth={1.5} />
                                </div>
                                <div className="no-data-title">
                                    No Car Users Found
                                </div>
                                <div className="no-data-description">
                                    There are currently no car users in the system. Add your first car user to start managing vehicle registrations and service bookings.
                                </div>
                                <button 
                                    className="no-data-action"
                                    onClick={handleOpenAddModal}
                                >
                                    <UserPlus size={16} strokeWidth={2} />
                                    Add Your First Car User
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <AddUserModal
                open={isAddModalOpen}
                userType="Car Users"
                onClose={handleCloseAddModal}
                onCreate={handleCreateUser}
            />
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default CarUsers; 