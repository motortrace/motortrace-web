const API_BASE = '/service-centers';

export async function getServices(centerId: string, params?: Record<string, any>) {
  const query = params ? '?' + new URLSearchParams(params).toString() : '';
  const res = await fetch(`${API_BASE}/${centerId}/services${query}`);
  if (!res.ok) throw new Error('Failed to fetch services');
  return res.json();
}

export async function createService(centerId: string, data: any) {
  const res = await fetch(`${API_BASE}/${centerId}/services`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    // TODO: Add auth headers if needed
  });
  if (!res.ok) throw new Error('Failed to create service');
  return res.json();
}

export async function getService(centerId: string, serviceId: string) {
  const res = await fetch(`${API_BASE}/${centerId}/services/${serviceId}`);
  if (!res.ok) throw new Error('Failed to fetch service');
  return res.json();
}

export async function updateService(centerId: string, serviceId: string, data: any) {
  const res = await fetch(`${API_BASE}/${centerId}/services/${serviceId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    // TODO: Add auth headers if needed
  });
  if (!res.ok) throw new Error('Failed to update service');
  return res.json();
}

export async function toggleServiceActive(centerId: string, serviceId: string) {
  const res = await fetch(`${API_BASE}/${centerId}/services/${serviceId}/toggle`, {
    method: 'PATCH',
    // TODO: Add auth headers if needed
  });
  if (!res.ok) throw new Error('Failed to toggle service status');
  return res.json();
}

export async function deleteService(centerId: string, serviceId: string) {
  const res = await fetch(`${API_BASE}/${centerId}/services/${serviceId}`, {
    method: 'DELETE',
    // TODO: Add auth headers if needed
  });
  if (!res.ok) throw new Error('Failed to delete service');
  return res.json();
}

export async function getServiceMetrics(centerId: string) {
  const res = await fetch(`${API_BASE}/${centerId}/services/metrics`);
  if (!res.ok) throw new Error('Failed to fetch service metrics');
  return res.json();
}

export async function getServiceAnalytics(centerId: string) {
  const res = await fetch(`${API_BASE}/${centerId}/services/analytics`);
  if (!res.ok) throw new Error('Failed to fetch service analytics');
  return res.json();
} 