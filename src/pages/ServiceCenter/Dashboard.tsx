import React, { useEffect, useRef } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// MetricCard Component
interface MetricCardProps {
  title: string;
  amount: string;
  change: string;
  changeType: 'positive' | 'negative';
  period?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  amount,
  change,
  changeType,
  period = 'vs last month'
}) => {
  return (
    <div style={{
      backgroundColor: 'white',
      padding: '24px',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      position: 'relative'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '16px'
      }}>
        <h3 style={{
          fontSize: '14px',
          fontWeight: '500',
          color: '#64748b',
          margin: 0
        }}>
          {title}
        </h3>
        <button style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '4px',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <i className='bx bx-right-top-arrow-circle' style={{
            fontSize: '20px',
            color: '#64748b'
          }}></i>
        </button>
      </div>
      
      <div style={{
        fontSize: '28px',
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: '12px'
      }}>
        {amount}
      </div>
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px'
      }}>
        <span style={{
          color: changeType === 'positive' ? '#10b981' : '#ef4444',
          fontWeight: '500'
        }}>
          {changeType === 'positive' ? '↑' : '↓'} {change}
        </span>
        <span style={{
          color: '#64748b'
        }}>
          {period}
        </span>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const revenueChartRef = useRef(null);
  const salesChartRef = useRef(null);
  const appointmentChartRef = useRef(null);
  const customerChartRef = useRef(null);

  const revenueChart = useRef(null);
  const salesChart = useRef(null);
  const appointmentChart = useRef(null);
  const customerChart = useRef(null);

  useEffect(() => {
    // Revenue Chart
    if (revenueChartRef.current) {
      const ctx = revenueChartRef.current.getContext('2d');
      if (revenueChart.current) {
        revenueChart.current.destroy();
      }
      revenueChart.current = new ChartJS(ctx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            data: [25000, 28000, 26000, 32000, 29000, 30000],
            borderColor: '#6366f1',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              display: false
            },
            x: {
              display: false
            }
          },
          elements: {
            point: {
              radius: 0
            }
          }
        }
      });
    }

    // Daily Sales Chart
    if (salesChartRef.current) {
      const ctx = salesChartRef.current.getContext('2d');
      if (salesChart.current) {
        salesChart.current.destroy();
      }
      salesChart.current = new ChartJS(ctx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            data: [8000, 12000, 9000, 11000, 10500, 10000],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              display: false
            },
            x: {
              display: false
            }
          },
          elements: {
            point: {
              radius: 0
            }
          }
        }
      });
    }

    // Appointment Statistics Chart
    if (appointmentChartRef.current) {
      const ctx = appointmentChartRef.current.getContext('2d');
      if (appointmentChart.current) {
        appointmentChart.current.destroy();
      }
      appointmentChart.current = new ChartJS(ctx, {
        type: 'bar',
        data: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [
            {
              label: 'Appointments',
              data: [15, 30, 22, 35, 32, 38, 45],
              backgroundColor: '#6366f1',
              borderRadius: 4
            },
            {
              label: 'Cancelled',
              data: [3, 8, 5, 6, 4, 7, 8],
              backgroundColor: '#ef4444',
              borderRadius: 4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 50,
              grid: {
                color: '#f3f4f6'
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          }
        }
      });
    }

    // Customer Chart
    if (customerChartRef.current) {
      const ctx = customerChartRef.current.getContext('2d');
      if (customerChart.current) {
        customerChart.current.destroy();
      }
      customerChart.current = new ChartJS(ctx, {
        type: 'line',
        data: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [
            {
              label: 'New Customers',
              data: [42, 45, 48, 46, 50, 48, 44],
              borderColor: '#10b981',
              backgroundColor: 'transparent',
              borderWidth: 2,
              tension: 0.4
            },
            {
              label: 'Returning Customers',
              data: [35, 38, 40, 44, 42, 38, 35],
              borderColor: '#6366f1',
              backgroundColor: 'transparent',
              borderWidth: 2,
              tension: 0.4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              max: 60,
              grid: {
                color: '#f3f4f6'
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          },
          elements: {
            point: {
              radius: 4
            }
          }
        }
      });
    }

    return () => {
      if (revenueChart.current) revenueChart.current.destroy();
      if (salesChart.current) salesChart.current.destroy();
      if (appointmentChart.current) appointmentChart.current.destroy();
      if (customerChart.current) customerChart.current.destroy();
    };
  }, []);

  const appointments = [
    {
      id: 1,
      name: 'Devon Lane',
      phone: '(671) 555-0110',
      time: '04:00 PM',
      date: '18th Nov 2022',
      email: 'dolores.chambers@example.com',
      service: 'Car Diagnostic',
      car: 'Toyota Corolla 1.3',
      registration: 'A45-123',
      avatar: 'DL'
    },
    {
      id: 2,
      name: 'Annette Black',
      phone: '(217) 555-0113',
      time: '04:00 PM',
      date: '18th Nov 2022',
      email: 'jessica.hanson@example.com',
      service: 'Inner Cleaning',
      car: 'Honda Yaris',
      registration: 'B45-123',
      avatar: 'AB'
    },
    {
      id: 3,
      name: 'Robert Fox',
      phone: '(209) 555-0104',
      time: '04:00 PM',
      date: '18th Nov 2022',
      email: 'nevaeh.simmons@example.com',
      service: 'Car Diagnostic',
      car: 'Citroen',
      registration: 'C45-123',
      avatar: 'RF'
    }
  ];

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      padding: '24px'
    }}>
      {/* Add Boxicons CSS */}
      <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet' />
      
      {/* Metrics Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '24px',
        marginBottom: '32px'
      }}>
        <MetricCard
          title="Revenue"
          amount="30,000 LKR"
          change="12%"
          changeType="positive"
          period="vs last month"
        />
        <MetricCard
          title="Daily Sales"
          amount="10,000 LKR"
          change="8%"
          changeType="positive"
          period="vs last month"
        />
        <MetricCard
          title="Average Appointment Time"
          amount="3 hrs"
          change="5%"
          changeType="negative"
          period="vs last month"
        />
        <MetricCard
          title="Customer Ratings"
          amount="4.27/5"
          change="2%"
          changeType="positive"
          period="vs last month"
        />
      </div>

      {/* Charts Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px',
        marginBottom: '32px'
      }}>
        {/* Appointment Statistics */}
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '12px',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <div>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: '600', 
                color: '#1e293b', 
                margin: '0 0 8px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <i className='bx bx-calendar' style={{ fontSize: '20px', color: '#6366f1' }}></i>
                Appointment Statistics
              </h3>
            </div>
            <select style={{
              padding: '8px 12px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '14px'
            }}>
              <option>This Week</option>
            </select>
          </div>
          <div style={{
            display: 'flex',
            gap: '16px',
            marginBottom: '16px',
            fontSize: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '8px', height: '8px', backgroundColor: '#6366f1', borderRadius: '50%' }}></div>
              Appointments
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '8px', height: '8px', backgroundColor: '#ef4444', borderRadius: '50%' }}></div>
              Cancelled
            </div>
          </div>
          <div style={{ height: '200px' }}>
            <canvas ref={appointmentChartRef}></canvas>
          </div>
          <div style={{ fontSize: '12px', color: '#64748b', textAlign: 'center', marginTop: '8px' }}>
            Wednesday: Appointments <strong>22</strong>, Cancelled <strong>5</strong>
          </div>
        </div>

        {/* Customers Chart */}
        <div style={{
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '12px',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#1e293b', 
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <i className='bx bx-group' style={{ fontSize: '20px', color: '#6366f1' }}></i>
              Customers
            </h3>
            <select style={{
              padding: '8px 12px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '14px'
            }}>
              <option>Last Week</option>
            </select>
          </div>
          <div style={{
            display: 'flex',
            gap: '16px',
            marginBottom: '16px',
            fontSize: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%' }}></div>
              New Customers
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '8px', height: '8px', backgroundColor: '#6366f1', borderRadius: '50%' }}></div>
              Returning Customers
            </div>
          </div>
          <div style={{ height: '200px' }}>
            <canvas ref={customerChartRef}></canvas>
          </div>
          <div style={{ fontSize: '12px', color: '#64748b', textAlign: 'center', marginTop: '8px' }}>
            Thursday: Returning Customers <strong>44</strong>
          </div>
        </div>
      </div>

      {/* Appointment Table */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '24px 24px 16px'
        }}>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: '600', 
            color: '#1e293b', 
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <i className='bx bx-calendar-check' style={{ fontSize: '20px', color: '#6366f1' }}></i>
            Appointment of the week
          </h3>
          <button style={{
            background: 'none',
            border: 'none',
            color: '#6366f1',
            fontSize: '14px',
            cursor: 'pointer'
          }}>
            See More
          </button>
        </div>
        
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#64748b' }}>Name</th>
              <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#64748b' }}>Time & Date</th>
              <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#64748b' }}>Email</th>
              <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#64748b' }}>Service Required</th>
              <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#64748b' }}>Car Model & Registration No</th>
              <th style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#64748b' }}></th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment, index) => (
              <tr key={appointment.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: '#6366f1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: 'white'
                    }}>
                      {appointment.avatar}
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: '#1e293b' }}>
                        {appointment.name}
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <i className='bx bx-phone' style={{ fontSize: '12px' }}></i>
                        {appointment.phone}
                      </div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '16px 24px', fontSize: '14px', color: '#1e293b' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <i className='bx bx-time' style={{ fontSize: '14px', color: '#64748b' }}></i>
                    {appointment.time}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                    <i className='bx bx-calendar' style={{ fontSize: '12px' }}></i>
                    {appointment.date}
                  </div>
                </td>
                <td style={{ padding: '16px 24px', fontSize: '14px', color: '#1e293b' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <i className='bx bx-envelope' style={{ fontSize: '14px', color: '#64748b' }}></i>
                    {appointment.email}
                  </div>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 12px',
                    backgroundColor: appointment.service === 'Car Diagnostic' ? '#fef3c7' : '#dcfce7',
                    borderRadius: '16px',
                    fontSize: '12px',
                    fontWeight: '500',
                    width: 'fit-content'
                  }}>
                    <i className={appointment.service === 'Car Diagnostic' ? 'bx bx-wrench' : 'bx bx-spray-can'} 
                       style={{ fontSize: '14px' }}></i>
                    {appointment.service}
                  </div>
                </td>
                <td style={{ padding: '16px 24px', fontSize: '14px', color: '#1e293b' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <i className='bx bx-car' style={{ fontSize: '14px', color: '#64748b' }}></i>
                    {appointment.car}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                    {appointment.registration}
                  </div>
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button style={{
                      padding: '8px 12px',
                      backgroundColor: '#343438',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <i className='bx bx-show' style={{ fontSize: '14px' }}></i>
                      View Details
                    </button>
                    <button style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px'
                    }}>
                      <i className='bx bx-dots-horizontal-rounded' style={{ fontSize: '18px', color: '#64748b' }}></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;