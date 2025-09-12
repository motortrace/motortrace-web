import React, { useState, useMemo } from 'react';
import './Table.scss';

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  title?: string;
  showExport?: boolean;
  showAddButton?: boolean;
  onExport?: () => void;
  onAdd?: () => void;
  onRowClick?: (row: T) => void;
  className?: string;
  emptyMessage?: string;
}

function Table<T extends { [key: string]: any }>({
  columns,
  data,
  title,
  showExport = false,
  showAddButton = false,
  onExport,
  onAdd,
  onRowClick,
  className = '',
  emptyMessage = 'No data available'
}: TableProps<T>) {
  const [sortField, setSortField] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (columnKey: keyof T | string) => {
    const column = columns.find(col => col.key === columnKey);
    if (!column?.sortable) return;

    if (sortField === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(columnKey as keyof T);
      setSortDirection('asc');
    }
  };

  const sortedData = useMemo(() => {
    if (!sortField) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      const aString = String(aValue).toLowerCase();
      const bString = String(bValue).toLowerCase();

      if (aString < bString) return sortDirection === 'asc' ? -1 : 1;
      if (aString > bString) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortField, sortDirection]);

  const renderCell = (column: TableColumn<T>, row: T) => {
    const value = row[column.key as keyof T];

    if (column.render) {
      return column.render(value, row);
    }

    return value;
  };

  const handleRowClick = (row: T) => {
    if (onRowClick) onRowClick(row);
  };

  const getSortIcon = (columnKey: keyof T | string) => {
    if (sortField !== columnKey) {
      return <span className="sort-icon-inactive">↕</span>;
    }
    return (
      <span className={`sort-icon ${sortDirection}`}>
        {sortDirection === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  return (
    <div className="table-container">
    {title && (
        <div className="table-header">
        <h2 className="table-title">{title}</h2>
        <div className="table-actions">
            {showExport && <button className="btn btn-secondary" onClick={onExport}>Export</button>}
            {showAddButton && <button className="btn btn-primary" onClick={onAdd}>+ Add New</button>}
        </div>
        </div>
    )}

    <div className="table-grid-header">
        {columns.map((column) => (
        <div
            key={String(column.key)}
            className={`table-header-cell ${column.align ? `align-${column.align}` : ''}`}
            onClick={() => handleSort(column.key)}
        >
            {column.label}
            {column.sortable && sortField === column.key && (
            <span className={`sort-icon ${sortDirection}`}>⌄</span>
            )}
        </div>
        ))}
    </div>

    <div className="table-grid-body">
        {sortedData.map((row, rowIndex) => (
        <div
            className={`table-row ${onRowClick ? 'clickable' : ''}`}
            key={row.id ?? rowIndex}
            onClick={() => handleRowClick(row)}
        >
            {columns.map((col) => (
            <div key={String(col.key)} className={`table-cell ${col.align ? `align-${col.align}` : ''}`}>
                {renderCell(col, row)}
            </div>
            ))}
        </div>
        ))}
    </div>
    </div>

  );
}

export default Table;