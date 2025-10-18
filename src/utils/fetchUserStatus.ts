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
    console.log('fetchUserStatus response:', data);
    
    // Extract user from the response (your API returns it in data.data)
    const userFromApi = data.data || data.user || data;
    
    // Create a consistent user object to store
    const user = {
      id: userFromApi.supabaseUserId || userFromApi.id,
      email: userFromApi.email,
      role: userFromApi.role?.toLowerCase() || userFromApi.role,
      customerId: userFromApi.customerId || null,
      isRegistrationComplete: userFromApi.isRegistrationComplete ?? true
    };
    
    console.log('fetchUserStatus - Normalized user:', user);
    
    // Store the normalized user data if present
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
    
    // Return data in a consistent format
    return {
      user,
      data: data
    };
  } catch (e) {
    console.error('Error fetching user status:', e);
    return null;
  }
}