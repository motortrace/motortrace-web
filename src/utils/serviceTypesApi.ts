export async function getServiceTypes() {
  const res = await fetch('http://localhost:3000/service-types');
  if (!res.ok) throw new Error('Failed to fetch service types');
  return res.json();
} 