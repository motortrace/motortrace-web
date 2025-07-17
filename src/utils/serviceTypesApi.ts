export async function getServiceTypes() {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/service-types`);
  if (!res.ok) throw new Error('Failed to fetch service types');
  return res.json();
} 