import React, { useState } from 'react';
// import type { View } from 'react-big-calendar';
import MetricCard from '../../../components/MetricCard/MetricCard';
import AppointmentCalendar from '../../../components/AppointmentCalendar/AppointmentCalendar';
import type { Appointment } from '../../../components/AppointmentCalendar/AppointmentCalendar';
import Table from '../../../components/Table/Table';
import type { TableColumn } from '../../../components/Table/Table';
import moment from 'moment';
import './AppointmentPage.scss';
import AppointmentModal from '../../../components/AppointmentModel/AppointmentModal';
import type { PendingRequest } from '../../../types/PendingRequest';

const AppointmentPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2024, 3, 15));
  const [currentView, setCurrentView] = useState<'dayGridMonth' | 'timeGridWeek' | 'timeGridDay'>('timeGridDay');
  const [viewedRequest, setViewedRequest] = useState<PendingRequest | null>(null);

  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 'APR#10001',
      title: 'Jack Martin - Oil Change, Brake Service',
      customer: 'Jack Martin',
      phone: '(469) 629-6615',
      email: 'jack.martin@email.com',
      vehicle: '2018 Honda Civic EX',
      start: new Date(2024, 3, 15, 10, 0),
      end: new Date(2024, 3, 15, 11, 0),
      services: ['Oil Change', 'Brake Service'],
      status: 'confirmed',
      priority: 'urgent',
      notes: 'Customer mentioned squeaking brakes',
      dropOff: true,
      technician: 'Mike Johnson',
    },
    {
      id: 'APR#10002',
      title: 'Sarah Connor - Transmission Service',
      customer: 'Sarah Connor',
      phone: '(555) 123-4567',
      email: 'sarah.connor@email.com',
      vehicle: '2020 Toyota Camry',
      start: new Date(2024, 3, 15, 13, 0),
      end: new Date(2024, 3, 15, 15, 0),
      services: ['Transmission Service', 'Brake Fluid Change'],
      status: 'pending',
      priority: 'normal',
      notes: 'Follow up from previous visit',
      dropOff: false,
      technician: 'John Smith',
    },
    {
      id: 'APR#10003',
      title: 'John Doe - Annual Inspection',
      customer: 'John Doe',
      phone: '(555) 987-6543',
      email: 'john.doe@email.com',
      vehicle: '2019 Ford F-150',
      start: new Date(2024, 3, 15, 16, 0),
      end: new Date(2024, 3, 15, 17, 0),
      services: ['Annual Inspection'],
      status: 'confirmed',
      priority: 'normal',
      notes: 'State inspection due this month',
      dropOff: false,
      technician: 'Mike Johnson',
    },
    {
      id: 'APR#10004',
      title: 'Alice Johnson - Tire Rotation',
      customer: 'Alice Johnson',
      phone: '(555) 222-3333',
      email: 'alice.johnson@email.com',
      vehicle: '2017 Toyota Corolla',
      start: new Date(2024, 3, 15, 9, 0),
      end: new Date(2024, 3, 15, 10, 0),
      services: ['Tire Rotation'],
      status: 'confirmed',
      priority: 'moderate',
      notes: '',
      dropOff: true,
      technician: 'Sarah Lee',
    },
    {
      id: 'APR#10005',
      title: 'Bob Lee - Battery Replacement',
      customer: 'Bob Lee',
      phone: '(555) 888-9999',
      email: 'bob.lee@email.com',
      vehicle: '2015 Ford Escape',
      start: new Date(2024, 3, 15, 11, 0),
      end: new Date(2024, 3, 15, 12, 0),
      services: ['Battery Replacement'],
      status: 'pending',
      priority: 'urgent',
      notes: "Car won't start",
      dropOff: false,
      technician: 'Mike Johnson',
    },
    {
      id: 'APR#10006',
      title: 'Cathy Brown - AC Service',
      customer: 'Cathy Brown',
      phone: '(555) 777-8888',
      email: 'cathy.brown@email.com',
      vehicle: '2022 Honda Accord',
      start: new Date(2024, 3, 15, 14, 0),
      end: new Date(2024, 3, 15, 15, 30),
      services: ['AC Service'],
      status: 'confirmed',
      priority: 'normal',
      notes: '',
      dropOff: true,
      technician: 'John Smith',
    },
    {
      id: 'APR#10007',
      title: 'David Kim - Brake Pads Replacement',
      customer: 'David Kim',
      phone: '(555) 111-2222',
      email: 'david.kim@email.com',
      vehicle: '2016 Nissan Altima',
      start: new Date(2024, 3, 15, 15, 0),
      end: new Date(2024, 3, 15, 16, 0),
      services: ['Brake Pads Replacement'],
      status: 'pending',
      priority: 'moderate',
      notes: '',
      dropOff: false,
      technician: 'Sarah Lee',
    },
    {
      id: 'APR#10008',
      title: 'Evelyn White - Engine Diagnostics',
      customer: 'Evelyn White',
      phone: '(555) 333-4444',
      email: 'evelyn.white@email.com',
      vehicle: '2018 Subaru Outback',
      start: new Date(2024, 3, 15, 12, 0),
      end: new Date(2024, 3, 15, 13, 0),
      services: ['Engine Diagnostics'],
      status: 'confirmed',
      priority: 'urgent',
      notes: 'Check engine light on',
      dropOff: true,
      technician: 'Mike Johnson',
    },
  ]);

  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([
    {
      id: 'REQ#001',
      customer: 'Emma Watson',
      phone: '(555) 444-5555',
      vehicle: '2021 BMW X3',
      requestedDate: '2024-04-16',
      requestedTime: '09:00',
      services: ['Oil Change', 'Tire Rotation'],
      priority: 'normal',
      createdAt: '2 hours ago',
    },
    {
      id: 'REQ#002',
      customer: 'Robert Smith',
      phone: '(555) 333-2222',
      vehicle: '2019 Mercedes C-Class',
      requestedDate: '2024-04-15',
      requestedTime: '14:00',
      services: ['Brake Inspection', 'AC Service'],
      priority: 'urgent',
      createdAt: '30 minutes ago',
    },
  ]);

  const handleSelectSlot = ({ start, end }: { start: Date; end: Date }) => {
    console.log('Selected slot:', start, end);
  };

  const handleConfirmAppointment = (confirmedRequest: any) => {
    console.log('Confirmed request:', confirmedRequest);
    // Note: In a real app, you would have more robust logic here,
    // like creating a new appointment and removing the pending request.
    setViewedRequest(null);
  };

  const incomingColumns: TableColumn<PendingRequest>[] = [
    { key: 'id', label: 'Request ID' },
    { key: 'customer', label: 'Customer' },
    { key: 'vehicle', label: 'Vehicle' },
    { key: 'requestedDate', label: 'Date' },
    { key: 'requestedTime', label: 'Time' },
    {
      key: 'actions',
      label: 'Actions',
      render: (_value, row) => (
        <div className="action-btn-group">
          <button className="action-btn view" onClick={e => { e.stopPropagation(); setViewedRequest(row); }}>View</button>
          <button className="action-btn accept">Accept</button>
        </div>
      ),
    },
  ];

  return (
    <div className="appointment-page">
      <div className="metric-cards-row">
        <MetricCard title="Total Appointments" amount="24" change="12%" changeType="positive" />
        <MetricCard title="Today's Schedule" amount="8" change="3" changeType="positive" />
        <MetricCard title="Pending Requests" amount="6" change="2" changeType="negative" />
        <MetricCard title="Completed Today" amount="5" change="1" changeType="positive" />
      </div>

      <div className="incoming-table-section">
        <Table
          title="Incoming Appointment Requests"
          data={pendingRequests}
          columns={incomingColumns}
          showExport={false}
          showAddButton={false}
          onRowClick={(request) => console.log('Clicked request:', request)}
        />
      </div>

      <div className="appointment-content">
        <div className="calendar-container">
          <AppointmentCalendar
            appointments={appointments}
            currentDate={currentDate}
            onDateChange={setCurrentDate}
            currentView={currentView}
            onViewChange={setCurrentView}
            onSelectEvent={() => {}}
            onSelectSlot={handleSelectSlot}
          />
        </div>
      </div>
      <AppointmentModal
        isOpen={viewedRequest !== null}
        request={viewedRequest}
        onClose={() => setViewedRequest(null)}
        onConfirm={handleConfirmAppointment}
      />
    </div>
  );
};

export default AppointmentPage;
