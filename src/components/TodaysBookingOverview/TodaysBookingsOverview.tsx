import React from 'react';
import './TodaysBookingsOverview.scss';

interface TodaysBooking {
    id: string;
    time: string;
    customerName: string;
    vehicle: {
        make: string;
        model: string;
        year: number;
    };
    serviceType: string;
    status: 'Completed' | 'Ongoing' | 'Pending' | 'Scheduled';
    technician?: string;
}

interface TodaysBookingsProps {
    bookings?: TodaysBooking[];
}

const TodaysBookingsOverview: React.FC<TodaysBookingsProps> = ({
    bookings = [
        {
            id: '1',
            time: '09:00 AM',
            customerName: 'A. Fernando',
            vehicle: { make: 'Toyota', model: 'Corolla', year: 2012 },
            serviceType: 'Engine Repair',
            status: 'Completed',
            technician: 'T. Silva'
        },
        {
            id: '2',
            time: '10:00 AM',
            customerName: 'M. Perera',
            vehicle: { make: 'Honda', model: 'Civic', year: 2020 },
            serviceType: 'Oil Change',
            status: 'Ongoing',
            technician: 'J. Nuwan'
        },
        {
            id: '3',
            time: '11:00 AM',
            customerName: 'R. Jayawardena',
            vehicle: { make: 'Suzuki', model: 'WagonR', year: 2018 },
            serviceType: 'Brake Inspection',
            status: 'Ongoing',
            technician: 'L. Arun'
        },
        {
            id: '4',
            time: '01:00 PM',
            customerName: 'K. Bandara',
            vehicle: { make: 'Nissan', model: 'Leaf', year: 2021 },
            serviceType: 'Battery Replacement',
            status: 'Scheduled'
        },
        {
            id: '5',
            time: '02:00 PM',
            customerName: 'C. Divakar',
            vehicle: { make: 'Toyota', model: 'Aqua', year: 2022 },
            serviceType: 'Oil Change',
            status: 'Scheduled'
        }

    ]
}) => {
    return (
        <div className="todays-bookings">
            <div className="todays-bookings__header">
                <h2 className="todays-bookings__title">Today's Scheduled Bookings Overview</h2>
                <div className="todays-bookings__controls">
                    <button className="todays-bookings__dropdown">
                        All statuses
                        <svg className="todays-bookings__dropdown-icon" width="16" height="16" viewBox="0 0 16 16">
                            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none" />
                        </svg>
                    </button>
                    <button className="todays-bookings__see-all">
                        View full schedule
                        <svg className="todays-bookings__arrow" width="16" height="16" viewBox="0 0 16 16">
                            <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="2" fill="none" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="todays-bookings__table">
                <div className="todays-bookings__table-header">
                    <div className="todays-bookings__header-cell">TIME</div>
                    <div className="todays-bookings__header-cell">CUSTOMER</div>
                    <div className="todays-bookings__header-cell">VEHICLE</div>
                    <div className="todays-bookings__header-cell">SERVICE</div>
                    <div className="todays-bookings__header-cell">STATUS</div>
                    <div className="todays-bookings__header-cell">TECHNICIAN</div>
                </div>

                <div className="todays-bookings__table-body">
                    {bookings.map((booking) => (
                        <div key={booking.id} className="todays-bookings__row">
                            <div className="todays-bookings__cell">{booking.time}</div>
                            <div className="todays-bookings__cell">{booking.customerName}</div>
                            <div className="todays-bookings__cell">
                                {booking.vehicle.make} {booking.vehicle.model} {booking.vehicle.year}
                            </div>
                            <div className="todays-bookings__cell">{booking.serviceType}</div>
                            <div className="todays-bookings__cell">
                                <span className={`todays-bookings__status todays-bookings__status--${booking.status.toLowerCase()}`}>
                                    {booking.status}
                                </span>
                            </div>
                            <div className="todays-bookings__cell">{booking.technician || 'TBA'}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TodaysBookingsOverview;
