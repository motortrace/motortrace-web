/**
 * Utility helper functions for ManageWorkOrderModal
 */

/**
 * Get technician display name from various technician object structures
 */
export const getTechnicianDisplayName = (technician: any): string => {
  if (!technician) return 'Unknown';
  if (technician.userProfile?.firstName && technician.userProfile?.lastName) {
    return `${technician.userProfile.firstName} ${technician.userProfile.lastName}`;
  }
  if (technician.userProfile?.name) {
    return technician.userProfile.name;
  }
  if (technician.name) {
    return technician.name;
  }
  if (technician.firstName && technician.lastName) {
    return `${technician.firstName} ${technician.lastName}`;
  }
  return 'Unknown Technician';
};

/**
 * Get user role from localStorage
 */
export const getUserRole = (): string => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user?.role || 'serviceadvisor';
  } catch {
    return 'serviceadvisor';
  }
};

/**
 * Check if user is a service advisor
 */
export const isServiceAdvisorRole = (): boolean => {
  const userRole = getUserRole();
  return userRole === 'serviceadvisor' || userRole === 'service_advisor' || userRole === 'advisor';
};
