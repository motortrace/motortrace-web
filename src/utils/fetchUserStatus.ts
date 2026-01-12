export async function fetchUserStatus() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const res = await fetch('http://localhost:3000/user/status', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
} 