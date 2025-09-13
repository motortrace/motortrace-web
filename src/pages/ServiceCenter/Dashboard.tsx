import React from 'react';
import DailyCustomersLineChart from '../../components/DailyCustomersLineChart/DailyCustomersLineChart';
import MiniCalendar from '../../components/MiniCalendar/MiniCalendar';

// MetricCard Component
interface MetricCardProps {
  title: string;
  amount: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  amount
}) => {
  return (
    <div style={{
      backgroundColor: 'white',
      padding: '12px',
      borderRadius: '6px',
      border: '1px solid #e2e8f0',
      position: 'relative'
    }}>
      <h3 style={{
        fontSize: '10px',
        fontWeight: '500',
        color: '#64748b',
        margin: '0 0 6px 0'
      }}>
        {title}
      </h3>
      
      <div style={{
        fontSize: '16px',
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: '6px'
      }}>
        {amount}
      </div>
      
    </div>
  );
};

const Dashboard = () => {
  // Fake data for daily customers
  const dailyCustomersData = [
    { date: '2024-01-15', customers: 15 },
    { date: '2024-01-16', customers: 22 },
    { date: '2024-01-17', customers: 18 },
    { date: '2024-01-18', customers: 28 },
    { date: '2024-01-19', customers: 24 },
    { date: '2024-01-20', customers: 31 },
    { date: '2024-01-21', customers: 19 }
  ];

  // Sample appointment data for September 13, 2025
  const sampleAppointments = [
    {
      id: '1',
      customerId: 'cust1',
      vehicleId: 'veh1',
      requestedAt: new Date(),
      startTime: new Date(2025, 8, 13, 9, 0), // Sep 13, 2025 at 9:00 AM
      endTime: new Date(2025, 8, 13, 10, 0), // Sep 13, 2025 at 10:00 AM
      status: 'CONFIRMED' as const,
      priority: 'NORMAL' as const,
      notes: 'Regular maintenance',
      customer: {
        firstName: 'John',
        lastName: 'Smith'
      },
      vehicle: {
        make: 'Toyota',
        model: 'Camry',
        year: 2020
      },
      assignedTo: {
        name: 'Mike Johnson'
      },
      cannedServices: [
        { name: 'Oil Change' },
        { name: 'Filter Replacement' }
      ]
    },
    {
      id: '2',
      customerId: 'cust2',
      vehicleId: 'veh2',
      requestedAt: new Date(),
      startTime: new Date(2025, 8, 13, 14, 0), // Sep 13, 2025 at 2:00 PM
      endTime: new Date(2025, 8, 13, 15, 30), // Sep 13, 2025 at 3:30 PM
      status: 'PENDING' as const,
      priority: 'HIGH' as const,
      notes: 'Brake inspection',
      customer: {
        firstName: 'Sarah',
        lastName: 'Johnson'
      },
      vehicle: {
        make: 'Honda',
        model: 'Civic',
        year: 2019
      },
      cannedServices: [
        { name: 'Brake Inspection' },
        { name: 'Brake Pad Replacement' }
      ]
    },
    {
      id: '3',
      customerId: 'cust3',
      vehicleId: 'veh3',
      requestedAt: new Date(),
      startTime: new Date(2025, 8, 13, 11, 0), // Sep 13, 2025 at 11:00 AM
      endTime: new Date(2025, 8, 13, 12, 0), // Sep 13, 2025 at 12:00 PM
      status: 'IN_PROGRESS' as const,
      priority: 'URGENT' as const,
      notes: 'Engine repair',
      customer: {
        firstName: 'Mike',
        lastName: 'Davis'
      },
      vehicle: {
        make: 'Ford',
        model: 'Focus',
        year: 2021
      },
      assignedTo: {
        name: 'Sarah Wilson'
      },
      cannedServices: [
        { name: 'Engine Diagnostic' },
        { name: 'Engine Repair' }
      ]
    },
    {
      id: '4',
      customerId: 'cust4',
      vehicleId: 'veh4',
      requestedAt: new Date(),
      startTime: new Date(2025, 8, 13, 16, 0), // Sep 13, 2025 at 4:00 PM
      endTime: new Date(2025, 8, 13, 17, 0), // Sep 13, 2025 at 5:00 PM
      status: 'CONFIRMED' as const,
      priority: 'NORMAL' as const,
      notes: 'Tire rotation',
      customer: {
        firstName: 'Lisa',
        lastName: 'Anderson'
      },
      vehicle: {
        make: 'Nissan',
        model: 'Altima',
        year: 2018
      },
      assignedTo: {
        name: 'David Brown'
      },
      cannedServices: [
        { name: 'Tire Rotation' },
        { name: 'Wheel Alignment' }
      ]
    },
    {
      id: '5',
      customerId: 'cust5',
      vehicleId: 'veh5',
      requestedAt: new Date(),
      startTime: new Date(2025, 8, 13, 8, 0), // Sep 13, 2025 at 8:00 AM
      endTime: new Date(2025, 8, 13, 8, 45), // Sep 13, 2025 at 8:45 AM
      status: 'PENDING' as const,
      priority: 'LOW' as const,
      notes: 'AC check',
      customer: {
        firstName: 'Robert',
        lastName: 'Wilson'
      },
      vehicle: {
        make: 'Chevrolet',
        model: 'Malibu',
        year: 2020
      },
      cannedServices: [
        { name: 'AC System Check' },
        { name: 'Refrigerant Top-up' }
      ]
    }
  ];

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      padding: '12px'
    }}>
      {/* Add Boxicons CSS */}
      <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet' />
      
      {/* Main Layout - Two Sections */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
        alignItems: 'start'
      }}>
        {/* Left Section */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {/* Top 3 Metric Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px'
          }}>
            <MetricCard
              title="Revenue"
              amount="30,000 LKR"
            />
            <MetricCard
              title="Daily Sales"
              amount="10,000 LKR"
            />
            <MetricCard
              title="Average Appointment Time"
              amount="3 hrs"
            />
          </div>
          
          {/* Daily Customers Chart */}
          <DailyCustomersLineChart data={dailyCustomersData} />
        </div>

        {/* Right Section - Calendar */}
        <div style={{
          height: '100%'
        }}>
          <MiniCalendar appointments={sampleAppointments} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;