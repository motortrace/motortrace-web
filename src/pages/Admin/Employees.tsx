import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import "../../styles/components/SearchBarAndFilters.scss"
import './UserManagement.scss';
import { Users, Wrench, Search, Plus, UserPlus } from 'lucide-react';
import AddUserModal from '../../components/Admin/UserManagement/AddUserModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Employee {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: 'Service Advisor' | 'Technician';
    status: 'Available' | 'On Work' | 'Unavailable' | 'Suspended' | 'Resigned';
    joinDate: string;
    bookingsHandled?: number;
    jobCardsCreated?: number;
    specialization?: string;
    jobsParticipated?: number;
}

type EmployeeType = 'Service Advisors' | 'Technicians';

const Employees: React.FC = () => {
    const navigate = useNavigate();
    const { employeeType } = useParams<{ employeeType?: string }>();
    const [activeTab, setActiveTab] = useState<EmployeeType>('Service Advisors');
    const [statusFilter, setStatusFilter] = useState('All Statuses');
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [serviceAdvisors, setServiceAdvisors] = useState<Employee[]>([]);
    const [technicians, setTechnicians] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(false);

    // Mapping between URL parameters and display names
    const employeeTypeMap: Record<string, EmployeeType> = {
        'serviceAdvisors': 'Service Advisors',
        'technicians': 'Technicians'
    };

    // Reverse mapping for navigation
    const urlTypeMap: Record<EmployeeType, string> = {
        'Service Advisors': 'serviceAdvisors',
        'Technicians': 'technicians'
    };

    // Set active tab based on URL parameter
    useEffect(() => {
        if (employeeType && employeeTypeMap[employeeType]) {
            setActiveTab(employeeTypeMap[employeeType]);
        } else {
            setActiveTab('Service Advisors');
            navigate('/admin/userManagement/employees/serviceAdvisors', { replace: true });
        }
    }, [employeeType, navigate]);

    // Fetch employees when tab changes or after adding new employee
    useEffect(() => {
        fetchEmployees();
    }, [activeTab]);

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No authentication token found');

            let endpoint = '';
            if (activeTab === 'Service Advisors') {
                endpoint = 'http://localhost:3000/service-advisors';
            } else {
                endpoint = 'http://localhost:3000/technicians'; // You'll need to create this endpoint
            }

            const response = await fetch(endpoint, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch employees');
            }

            const result = await response.json();

            if (result.success) {
                // Transform backend data to frontend Employee format
                const employees = result.data.map((item: any) => transformBackendToFrontend(item, activeTab));

                if (activeTab === 'Service Advisors') {
                    setServiceAdvisors(employees);
                } else {
                    setTechnicians(employees);
                }
            }
        } catch (error: any) {
            console.error('Error fetching employees:', error);
            toast.error('Failed to load employees');
            // Fallback to empty arrays
            if (activeTab === 'Service Advisors') {
                setServiceAdvisors([]);
            } else {
                setTechnicians([]);
            }
        } finally {
            setLoading(false);
        }
    };

    // Transform backend data to frontend Employee format
    const transformBackendToFrontend = (backendData: any, type: EmployeeType): Employee => {
        const baseEmployee = {
            id: backendData.id || backendData.userProfileId,
            name: backendData.userProfile?.name || backendData.name || 'Unknown',
            email: backendData.userProfile?.email || 'No email',
            phone: backendData.userProfile?.phone || backendData.phone || 'No phone',
            role: (type === 'Service Advisors' ? 'Service Advisor' : 'Technician') as Employee['role'],
            status: 'Available' as Employee['status'], // You'll need to map this from backend status
            joinDate: backendData.createdAt ? new Date(backendData.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        };

        if (type === 'Service Advisors') {
            return {
                ...baseEmployee,
                bookingsHandled: backendData._count?.assignedAppointments || 0,
                jobCardsCreated: backendData._count?.advisorWorkOrders || 0,
            };
        } else {
            return {
                ...baseEmployee,
                specialization: backendData.specialization || 'General',
                jobsParticipated: backendData._count?.jobs || 0,
            };
        }
    };

    // Pagination state
    const itemsPerPage = 5;
    const [displayCount, setDisplayCount] = useState(itemsPerPage);

    useEffect(() => {
        setDisplayCount(itemsPerPage); // Reset display count when tab changes
    }, [activeTab]);

    const handleOpenAddModal = () => setIsAddModalOpen(true);
    const handleCloseAddModal = () => setIsAddModalOpen(false);

    const handleCreateUser = async (newUser: any) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No authentication token found');

            // Map frontend role to backend role
            const roleMap: Record<string, string> = {
                'Service Advisor': 'service_advisor',
                'Technician': 'technician'
            };

            const frontendRole = newUser.role as string;
            const backendRole = roleMap[frontendRole];

            if (!backendRole) {
                throw new Error(`Invalid role specified: ${frontendRole}`);
            }

            // Prepare payload for staff user creation
            const staffUserPayload = {
                email: newUser.email,
                password: newUser.password,
                role: backendRole,
                name: newUser.name,
                phone: newUser.phone,
                employeeId: newUser.employeeId
            };

            const response = await fetch('http://localhost:3000/users/staff', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(staffUserPayload),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || data.error || 'Failed to create staff user');
            }

            toast.success(`${newUser.role} profile created successfully!`);
            setIsAddModalOpen(false);

            // Refresh the employee list to show the new user
            fetchEmployees();

        } catch (error: any) {
            toast.error(error.message || 'An error occurred while creating the profile');
        }
    };

    // Handle tab change and update URL
    const handleTabChange = (newTab: EmployeeType) => {
        setActiveTab(newTab);
        const urlType = urlTypeMap[newTab];
        navigate(`/admin/userManagement/employees/${urlType}`, { replace: true });
    };

    const handleViewProfile = (userId: string) => {
        const urlType = urlTypeMap[activeTab];
        navigate(`/admin/userManagement/employees/${urlType}/${userId}/profile`);
    };

    const handleToggleStatus = (userId: string) => {
        console.log('Toggle status for employee:', userId);
        toast.info('Status toggle functionality will be implemented');
    };

    const employeeTypeConfig = {
        'Service Advisors': {
            icon: <Users size={18} strokeWidth={1.5} />,
            data: serviceAdvisors,
            headers: ['NAME', 'PHONE', 'BOOKINGS HANDLED', 'STATUS', 'ACTIONS']
        },
        'Technicians': {
            icon: <Wrench size={18} strokeWidth={1.5} />,
            data: technicians,
            headers: ['NAME', 'PHONE', 'SPECIALIZATION', 'STATUS', 'ACTIONS']
        }
    };

    const renderTableRow = (employee: Employee) => {
        if (employee.role === 'Service Advisor') {
            return (
                <>
                    <div className="user-management__cell">{employee.name}</div>
                    <div className="user-management__cell">{employee.phone}</div>
                    <div className="user-management__cell">{employee.bookingsHandled || 0}</div>
                    <div className="user-management__cell">
                        <span className={`user-management__status user-management__status--${employee.status.toLowerCase().replace(/\s+/g, '-')}`}>
                            {employee.status}
                        </span>
                    </div>
                    <div className="user-management__cell">
                        <div className="user-management__actions">
                            <button className="todays-bookings__action-btn" onClick={() => handleViewProfile(employee.id)}>
                                View
                            </button>
                            {employee.status === 'Available' || employee.status === 'On Work' ? (
                                <button className="todays-bookings__action-btn" onClick={() => handleToggleStatus(employee.id)}>
                                    Disable
                                </button>
                            ) : (
                                <button className="todays-bookings__action-btn" onClick={() => handleToggleStatus(employee.id)}>
                                    Enable
                                </button>
                            )}
                        </div>
                    </div>
                </>
            );
        } else {
            return (
                <>
                    <div className="user-management__cell">{employee.name}</div>
                    <div className="user-management__cell">{employee.phone}</div>
                    <div className="user-management__cell">{employee.specialization || 'N/A'}</div>
                    <div className="user-management__cell">
                        <span className={`user-management__status user-management__status--${employee.status.toLowerCase().replace(/\s+/g, '-')}`}>
                            {employee.status}
                        </span>
                    </div>
                    <div className="user-management__cell">
                        <div className="user-management__actions">
                            <button className="todays-bookings__action-btn" onClick={() => handleViewProfile(employee.id)}>
                                View
                            </button>
                            {employee.status === 'Available' || employee.status === 'On Work' ? (
                                <button className="todays-bookings__action-btn" onClick={() => handleToggleStatus(employee.id)}>
                                    Disable
                                </button>
                            ) : (
                                <button className="todays-bookings__action-btn" onClick={() => handleToggleStatus(employee.id)}>
                                    Enable
                                </button>
                            )}
                        </div>
                    </div>
                </>
            );
        }
    };

    // Filter and search logic
    const currentData = employeeTypeConfig[activeTab].data;
    const filteredEmployees = currentData.filter(employee => {
        const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              employee.phone.includes(searchTerm);

        const matchesStatus = statusFilter === 'All Statuses' || employee.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const displayedEmployees = filteredEmployees.slice(0, displayCount);
    const hasMore = displayCount < filteredEmployees.length;
    
    const handleLoadMore = () => {
        setDisplayCount(prev => Math.min(prev + itemsPerPage, filteredEmployees.length));
    };

    return (
        <div className="user-management">
            <div className="user-management__header">
                <div className="user-management__tabs">
                    {Object.keys(employeeTypeConfig).map((employeeType) => (
                        <button
                            key={employeeType}
                            className={`user-management__tab ${activeTab === employeeType ? 'user-management__tab--active' : ''}`}
                            onClick={() => handleTabChange(employeeType as EmployeeType)}
                        >
                            <span className="user-management__tab-icon">
                                {employeeTypeConfig[employeeType as EmployeeType].icon}
                            </span>
                            {employeeType}
                            {loading && activeTab === employeeType && ' (Loading...)'}
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
                                placeholder={`Search ${activeTab}...`}
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
                                <option value="Available">Available</option>
                                <option value="On Work">On Work</option>
                                <option value="Unavailable">Unavailable</option>
                                <option value="Suspended">Suspended</option>
                                <option value="Resigned">Resigned</option>
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
                        {`Add New ${activeTab.slice(0, -1)}`}
                    </button>
                </div>

                <div className="user-management__table">
                    <div className="user-management__table-header" data-user-type={activeTab}>
                        {employeeTypeConfig[activeTab].headers.map((header, index) => (
                            <div key={index} className="user-management__header-cell">
                                {header}
                            </div>
                        ))}
                    </div>

                    <div className="user-management__table-body">
                        {displayedEmployees.map((employee: Employee) => (
                            <div key={employee.id} className="user-management__row" data-user-type={activeTab}>
                                {renderTableRow(employee)}
                            </div>
                        ))}
                        {hasMore && (
                            <div className="user-management__load-more">
                                <button
                                    className="user-management__load-more-btn"
                                    onClick={handleLoadMore}
                                >
                                    Load More ({filteredEmployees.length - displayCount} remaining)
                                </button>
                            </div>
                        )}
                        {displayedEmployees.length === 0 && (
                            <div className="user-management__no-data">
                                <div className="no-data-icon">
                                    {activeTab === 'Service Advisors' ? (
                                        <Users size={40} strokeWidth={1.5} />
                                    ) : (
                                        <Wrench size={40} strokeWidth={1.5} />
                                    )}
                                </div>
                                <div className="no-data-title">
                                    No {activeTab.slice(0, -1)} Found
                                </div>
                                <div className="no-data-description">
                                    {activeTab === 'Service Advisors' 
                                        ? "There are currently no service advisors in the system. Add your first service advisor to start managing customer bookings and service requests."
                                        : "There are currently no technicians in the system. Add your first technician to start handling repair and maintenance work."
                                    }
                                </div>
                                <button 
                                    className="no-data-action"
                                    onClick={handleOpenAddModal}
                                >
                                    <UserPlus size={16} strokeWidth={2} />
                                    Add Your First {activeTab.slice(0, -1)}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <AddUserModal
                open={isAddModalOpen}
                userType={activeTab}
                onClose={handleCloseAddModal}
                onCreate={handleCreateUser}
            />
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default Employees;