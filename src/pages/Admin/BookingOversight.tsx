import { useState } from 'react';
import { Search } from 'lucide-react';
import '../../layouts/DashboardLayout.scss';
import "../../styles/components/SearchBarAndFilters.scss"
import "./BookingOversight.scss"
import MetricCard from '../../components/MetricCard/MetricCard';
import BookingsTable from '../../components/Admin/BookingsTable/BookingsTable';

const BookingOversight: React.FC = () => {

    const [periodFilter, setPeriodFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    return (

        <>

             <div className="metric-cards-row">
                <MetricCard
                    title="Total Confirmed Bookings"
                    amount="8"
                    change="2.4%"
                    changeType="positive"
                />
                <MetricCard
                    title="Checked-In Bookings"
                    amount="5"
                    change="6.3%"
                    changeType="positive"
                />
                <MetricCard
                    title="Ongoing Bookings"
                    amount="2"
                    change="2.4%"
                    changeType="negative"
                />
                <MetricCard
                    title="Completed Bookings"
                    amount="2"
                    change="12.1%"
                    changeType="positive"
                />
            </div>


            <div className="metric-cards-row">

                <div className="search-bar">
                    <div className="search-content">
                        <div className="search-input-container">
                            <Search className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search Bookings..."
                            // value={searchTerm}
                            // onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="filters">

                            <select
                                value={periodFilter}
                                onChange={(e) => setPeriodFilter(e.target.value)}
                            >
                                <option value="today" selected>Today</option>
                                <option value="thisWeek">This Week</option>
                                <option value="thisMonth">This Month</option>
                                <option value="lastMonth">Last Month</option>
                            </select>

                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all" selected>All</option>
                                <option value="Pending">Pending</option>
                                <option value="Approved">Approved</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="checkedIn">Checked In</option>
                                <option value="inProgress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>

                        </div>

                    </div>
                </div>

            </div>

            <div className="metric-cards-row">
                <BookingsTable />
            </div>

        </>
    )
}

export default BookingOversight