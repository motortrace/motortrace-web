import type { WorkOrderInspection } from '../types/WorkOrderInspection';

const API_BASE = `${import.meta.env.VITE_API_BASE_URL}/inspection-templates/work-orders/inspections`;

// API Functions
export async function getWorkOrderInspections(params?: Record<string, any>) {
  const query = params ? '?' + new URLSearchParams(params).toString() : '';
  const res = await fetch(`${API_BASE}${query}`, {
    headers: {
      'Content-Type': 'application/json',
      // TODO: Add auth headers if needed
    },
  });
  if (!res.ok) throw new Error('Failed to fetch work order inspections');
  return res.json();
}

export async function getWorkOrderInspection(inspectionId: string) {
  const res = await fetch(`${API_BASE}/${inspectionId}`, {
    headers: {
      'Content-Type': 'application/json',
      // TODO: Add auth headers if needed
    },
  });
  if (!res.ok) throw new Error('Failed to fetch work order inspection');
  return res.json();
}

export async function getWorkOrderInspectionsByWorkOrder(workOrderId: string) {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/inspection-templates/work-orders/${workOrderId}/inspections`, {
    headers: {
      'Content-Type': 'application/json',
      // TODO: Add auth headers if needed
    },
  });
  if (!res.ok) throw new Error('Failed to fetch work order inspections');
  return res.json();
}

export async function createWorkOrderInspection(data: Partial<WorkOrderInspection>) {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // TODO: Add auth headers if needed
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create work order inspection');
  return res.json();
}

export async function updateWorkOrderInspection(id: string, data: Partial<WorkOrderInspection>) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      // TODO: Add auth headers if needed
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update work order inspection');
  return res.json();
}

export async function deleteWorkOrderInspection(id: string) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      // TODO: Add auth headers if needed
    },
  });
  if (!res.ok) throw new Error('Failed to delete work order inspection');
  return res.json();
}
