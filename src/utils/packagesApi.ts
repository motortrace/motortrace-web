const API_BASE = '/service-centers';

export async function getPackages(centerId: string, params?: Record<string, any>) {
  const query = params ? '?' + new URLSearchParams(params).toString() : '';
  const res = await fetch(`${API_BASE}/${centerId}/packages${query}`);
  if (!res.ok) throw new Error('Failed to fetch packages');
  return res.json();
}

export async function createPackage(centerId: string, data: any) {
  const res = await fetch(`${API_BASE}/${centerId}/packages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    // TODO: Add auth headers if needed
  });
  if (!res.ok) throw new Error('Failed to create package');
  return res.json();
}

export async function getPackage(centerId: string, packageId: string) {
  const res = await fetch(`${API_BASE}/${centerId}/packages/${packageId}`);
  if (!res.ok) throw new Error('Failed to fetch package');
  return res.json();
}

export async function updatePackage(centerId: string, packageId: string, data: any) {
  const res = await fetch(`${API_BASE}/${centerId}/packages/${packageId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    // TODO: Add auth headers if needed
  });
  if (!res.ok) throw new Error('Failed to update package');
  return res.json();
}

export async function togglePackageActive(centerId: string, packageId: string) {
  const res = await fetch(`${API_BASE}/${centerId}/packages/${packageId}/toggle`, {
    method: 'PATCH',
    // TODO: Add auth headers if needed
  });
  if (!res.ok) throw new Error('Failed to toggle package status');
  return res.json();
}

export async function deletePackage(centerId: string, packageId: string) {
  const res = await fetch(`${API_BASE}/${centerId}/packages/${packageId}`, {
    method: 'DELETE',
    // TODO: Add auth headers if needed
  });
  if (!res.ok) throw new Error('Failed to delete package');
  return res.json();
}

export async function getPackageMetrics(centerId: string) {
  const res = await fetch(`${API_BASE}/${centerId}/packages/metrics`);
  if (!res.ok) throw new Error('Failed to fetch package metrics');
  return res.json();
}

export async function getPackageAnalytics(centerId: string) {
  const res = await fetch(`${API_BASE}/${centerId}/packages/analytics`);
  if (!res.ok) throw new Error('Failed to fetch package analytics');
  return res.json();
} 