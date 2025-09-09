export async function fetchUserStatus() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
} 