export async function fetchUserStatus() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  try {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (!res.ok) {
      // Clear invalid token
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return null;
    }
    
    const data = await res.json();
    
    // Store the updated user data if needed
    if (data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
  } catch (e) {
    console.error('Error fetching user status:', e);
    return null;
  }
}