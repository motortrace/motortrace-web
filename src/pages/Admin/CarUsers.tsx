import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../../styles/components/SearchBarAndFilters.scss"
import './UserManagement.scss';
import { Search, UserPlus, Users } from 'lucide-react';
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

    const carUsers: CarUser[] = [
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
    ];

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

    const handleOpenAddModal = () => {
        toast.info('Add Car User functionality will be implemented');
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
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default CarUsers; 