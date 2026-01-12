import { useState, useEffect } from 'react';

interface SetupStatus {
  isRegistrationComplete: boolean;
  isSetupComplete: boolean;
  hasActiveSubscription: boolean;
  missingSteps: string[];
  redirectTo: string;
}

interface UseSetupFlowReturn {
  setupStatus: SetupStatus | null;
  checkSetupStatus: () => Promise<any>;
  completeSetupDetails: (detailsData: any) => Promise<any>;
  canAccessDashboard: () => boolean;
  getNextStep: () => string | null;
  loading: boolean;
}

export const useSetupFlow = (): UseSetupFlowReturn => {
  const [setupStatus, setSetupStatus] = useState<SetupStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const checkSetupStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return null;
      }

      const response = await fetch('http://localhost:3000/auth/setup-status', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSetupStatus(data.setupStatus);
        return data;
      } else {
        console.error('Setup status check failed');
        return null;
      }
    } catch (error) {
      console.error('Setup status check failed:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const completeSetupDetails = async (detailsData: any) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token');

      const response = await fetch('http://localhost:3000/auth/setup/details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(detailsData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Update token and setup status
        localStorage.setItem('token', data.token);
        setSetupStatus(data.setupStatus);
        return data;
      } else {
        throw new Error(data.error || 'Setup details completion failed');
      }
    } catch (error) {
      console.error('Setup details completion failed:', error);
      throw error;
    }
  };

  const canAccessDashboard = () => {
    return setupStatus && setupStatus.missingSteps.length === 0;
  };

  const getNextStep = (): string | null => {
    return setupStatus?.redirectTo || null;
  };

  return {
    setupStatus,
    checkSetupStatus,
    completeSetupDetails,
    canAccessDashboard,
    getNextStep,
    loading
  };
}; 