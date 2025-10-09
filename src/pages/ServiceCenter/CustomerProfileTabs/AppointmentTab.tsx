import React from 'react';

interface Appointment {
  id: string;
  date: string;
  time: string;
  service: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  customerName?: string;
}

interface AppointmentTabProps {
  appointments: Appointment[];
}


const AppointmentTab: React.FC<AppointmentTabProps> = ({ appointments }) => {
  // Stats calculation
  const total = appointments.length;
  const scheduled = appointments.filter(a => a.status === 'scheduled').length;
  const completed = appointments.filter(a => a.status === 'completed').length;
  const cancelled = appointments.filter(a => a.status === 'cancelled').length;

  return (
    <div className="tab-content">
      {/* Appointment Stats Section */}
      <div className="card appointment-stats-card">
        <div className="card-header">
          <h3>Appointment Details Stats</h3>
        </div>
        <div className="card-body">
          <div className="info-grid-horizontal">
            <div className="info-item">
              <i className="bx bx-calendar"></i>
              <div>
                <span className="info-label">Total Appointments</span>
                <span className="info-value">{total}</span>
              </div>
            </div>
            <div className="info-item">
              <i className="bx bx-time-five"></i>
              <div>
                <span className="info-label">Scheduled</span>
                <span className="info-value">{scheduled}</span>
              </div>
            </div>
            <div className="info-item">
              <i className="bx bx-check-circle"></i>
              <div>
                <span className="info-label">Completed</span>
                <span className="info-value">{completed}</span>
              </div>
            </div>
            <div className="info-item">
              <i className="bx bx-x-circle"></i>
              <div>
                <span className="info-label">Cancelled</span>
                <span className="info-value">{cancelled}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Table Section */}
      <div className="card">
        <div className="card-header">
          <h3>Appointments</h3>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Service</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments && appointments.length > 0 ? (
                  appointments.map(appointment => (
                    <tr key={appointment.id}>
                      <td>{appointment.date}</td>
                      <td>{appointment.time}</td>
                      <td>{appointment.service}</td>
                      <td>
                        <span className={`badge badge-${appointment.status}`}>
                          {appointment.status}
                        </span>
                      </td>
                      <td>
                        <button className="btn-icon">
                          <i className="bx bx-show"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="empty-state">No appointments found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentTab;
