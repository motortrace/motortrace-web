
import Table from '../../components/Table/Table';
import type { TableColumn } from '../../components/Table/Table';

interface Student {
  id: number;
  name: string;
  course: string;
  grade: string;
  active: boolean;
}

const studentData: Student[] = [
  { id: 1, name: 'Alice Johnson', course: 'Math', grade: 'A', active: true },
  { id: 2, name: 'Bob Smith', course: 'Science', grade: 'B', active: false },
  { id: 3, name: 'Charlie Lee', course: 'History', grade: 'A+', active: true },
  { id: 4, name: 'Diana Adams', course: 'Physics', grade: 'C', active: true },
];

const studentColumns: TableColumn<Student>[] = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'name', label: 'Name', sortable: true },
  { key: 'course', label: 'Course' },
  { key: 'grade', label: 'Grade', sortable: true },
  {
    key: 'active',
    label: 'Status',
    render: (value) => value ? '✅ Active' : '❌ Inactive'
  },
];

const TestTablePage = () => {
  const handleExport = () => {
    console.log('Export clicked');
  };

  const handleAdd = () => {
    console.log('Add new clicked');
  };

  const handleRowClick = (student: Student) => {
    console.log('Clicked student:', student);
  };

  return (
    <div className="dashboard-page">


      <div className="table-test-section">
        <Table
          title="Student Table"
          data={studentData}
          columns={studentColumns}
          showExport
          showAddButton
          onExport={handleExport}
          onAdd={handleAdd}
          onRowClick={handleRowClick}
        />
      </div>
    </div>
  );
};

export default TestTablePage;
