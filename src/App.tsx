
import DashboardLayout from './layouts/DashboardLayout';

// import Dashboard from './pages/ServiceCenter/Dashboard';
import KanbanPage from './pages/ServiceCenter/KanbanPage';

function App() {
  return (

        <DashboardLayout>
          {/* <Dashboard /> */}
          <KanbanPage />
        </DashboardLayout>

  );
}

export default App;
