import { type TableColumn } from '../Table/Table';
import type { Service } from '../../types/Service';

export const getServiceTableColumns = (
  onToggleAvailability: (serviceId: string) => void
): TableColumn<Service>[] => [
  {
    key: 'name',
    label: 'Service Name',
    sortable: true,
    render: (value: any) => (
      <strong>{value}</strong>
    )
  },
  {
    key: 'category',
    label: 'Category',
    sortable: true,
    render: (value: any) => (
      <span>{value || 'N/A'}</span>
    )
  },
  {
    key: 'description',
    label: 'Description',
    sortable: true,
    render: (value: any) => (
      <span>{value || 'No description'}</span>
    )
  },
  {
    key: 'price',
    label: 'Price (LKR)',
    sortable: true,
    align: 'right',
    render: (value: any) => (
      <span>LKR {value?.toLocaleString() || '0'}</span>
    )
  },
  {
    key: 'duration',
    label: 'Duration (min)',
    sortable: true,
    align: 'center',
    render: (value: any) => (
      <span>{value ? value : 'N/A'}</span>
    )
  },
  {
    key: 'isAvailable',
    label: 'Status',
    align: 'center',
    render: (value: any, row: Service) => (
      <label className="switch switch--dark">
        <input
          type="checkbox"
          checked={!!value}
          onChange={e => {
            e.stopPropagation();
            onToggleAvailability(row.id);
          }}
        />
        <span className="slider round"></span>
      </label>
    ),
  },
  {
    key: 'actions',
    label: 'Actions',
    align: 'center',
    render: (_: any, row: Service) => (
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
        <button className="btn-icon" title="View" onClick={e => { e.stopPropagation(); console.log('View service details:', row.name); }}>
          <i className='bx bx-show'></i>
        </button>
      </div>
    )
  },
];