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
    department: string;
    totalServices: number;
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
            // Default to Service Advisors if no parameter or invalid parameter
            setActiveTab('Service Advisors');
            // Optionally redirect to the default route
            navigate('/admin/userManagement/employees/serviceAdvisors', { replace: true });
        }
    }, [employeeType, navigate]);

    const serviceAdvisors: Employee[] = [
        {
            id: '1',
            name: 'A. Fernando',
            email: 'a.fernando@servicecenter.com',
            phone: '+94 77 123 4567',
            role: 'Service Advisor',
            department: 'Customer Service',
            totalServices: 45,
            status: 'Available',
            joinDate: '2023-06-15',
            bookingsHandled: 156,
            jobCardsCreated: 89
        },
        {
            id: '2',
            name: 'M. Perera',
            email: 'm.perera@servicecenter.com',
            phone: '+94 71 234 5678',
            role: 'Service Advisor',
            department: 'Customer Service',
            totalServices: 38,
            status: 'On Work',
            joinDate: '2023-08-22',
            bookingsHandled: 142,
            jobCardsCreated: 67
        },
        {
            id: '3',
            name: 'S. Silva',
            email: 's.silva@servicecenter.com',
            phone: '+94 76 345 6789',
            role: 'Service Advisor',
            department: 'Customer Service',
            totalServices: 52,
            status: 'Unavailable',
            joinDate: '2023-05-10',
            bookingsHandled: 203,
            jobCardsCreated: 124
        },
        {
            id: '4',
            name: 'R. Mendis',
            email: 'r.mendis@servicecenter.com',
            phone: '+94 78 456 7890',
            role: 'Service Advisor',
            department: 'Customer Service',
            totalServices: 29,
            status: 'Available',
            joinDate: '2024-01-15',
            bookingsHandled: 78,
            jobCardsCreated: 45
        },
        {
            id: '5',
            name: 'L. Bandara',
            email: 'l.bandara@servicecenter.com',
            phone: '+94 72 567 8901',
            role: 'Service Advisor',
            department: 'Customer Service',
            totalServices: 41,
            status: 'Suspended',
            joinDate: '2023-09-03',
            bookingsHandled: 134,
            jobCardsCreated: 78
        }
    ];

    const technicians: Employee[] = [
        {
            id: '6',
            name: 'K. Jayasuriya',
            email: 'k.jayasuriya@servicecenter.com',
            phone: '+94 77 678 9012',
            role: 'Technician',
            department: 'Mechanical',
            totalServices: 67,
            status: 'Available',
            joinDate: '2023-04-12',
            specialization: 'Engine Repair',
            jobsParticipated: 89
        },
        {
            id: '7',
            name: 'D. Weerasinghe',
            email: 'd.weerasinghe@servicecenter.com',
            phone: '+94 71 789 0123',
            role: 'Technician',
            department: 'Electrical',
            totalServices: 58,
            status: 'On Work',
            joinDate: '2023-07-08',
            specialization: 'Electrical Systems',
            jobsParticipated: 76
        },
        {
            id: '8',
            name: 'N. Rathnayake',
            email: 'n.rathnayake@servicecenter.com',
            phone: '+94 76 890 1234',
            role: 'Technician',
            department: 'Mechanical',
            totalServices: 73,
            status: 'Available',
            joinDate: '2023-03-25',
            specialization: 'Transmission',
            jobsParticipated: 94
        },
        {
            id: '9',
            name: 'H. Ekanayake',
            email: 'h.ekanayake@servicecenter.com',
            phone: '+94 78 901 2345',
            role: 'Technician',
            department: 'Electrical',
            totalServices: 44,
            status: 'Resigned',
            joinDate: '2023-10-18',
            specialization: 'Diagnostics',
            jobsParticipated: 58
        },
        {
            id: '10',
            name: 'P. Wijewardena',
            email: 'p.wijewardena@servicecenter.com',
            phone: '+94 72 012 3456',
            role: 'Technician',
            department: 'Mechanical',
            totalServices: 61,
            status: 'On Work',
            joinDate: '2023-11-30',
            specialization: 'Brake Systems',
            jobsParticipated: 82
        }
    ];

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
            const response = await fetch('http://localhost:3000/admin/createEmployee', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userType: activeTab, ...newUser }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to create employee');
            
            // Add to appropriate list based on role
            if (newUser.role === 'Service Advisor') {
                // Update service advisors list
                toast.success('Service Advisor created successfully!');
            } else {
                // Update technicians list
                toast.success('Technician created successfully!');
            }
            
            setIsAddModalOpen(false);
        } catch (error: any) {
            toast.error(error.message || 'An error occurred');
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
            headers: ['NAME', 'EMAIL', 'PHONE', 'BOOKINGS HANDLED', 'STATUS', 'ACTIONS']
        },
        'Technicians': {
            icon: <Wrench size={18} strokeWidth={1.5} />,
            data: technicians,
            headers: ['NAME', 'EMAIL', 'PHONE', 'SPECIALIZATION', 'STATUS', 'ACTIONS']
        }
    };

    const renderTableRow = (employee: Employee) => {
        if (employee.role === 'Service Advisor') {
            return (
                <>
                    <div className="user-management__cell">{employee.name}</div>
                    <div className="user-management__cell">{employee.email}</div>
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
                    <div className="user-management__cell">{employee.email}</div>
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
                             employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
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