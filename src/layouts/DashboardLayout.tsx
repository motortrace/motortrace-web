import Sidebar from '../components/Sidebar/sidebar';
import './DashboardLayout.scss'; 

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
