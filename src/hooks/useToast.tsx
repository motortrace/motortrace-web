import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  color?: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (type: ToastMessage['type'], title: string, message: string, color?: string, duration?: number) => void;
  hideToast: (id: string) => void;
  toasts: ToastMessage[];
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (
    type: ToastMessage['type'],
    title: string,
    message: string,
    color?: string,
    duration = 5000
  ) => {
    const id = Date.now().toString();
    const toast: ToastMessage = {
      id,
      type,
      title,
      message,
      color,
      duration,
    };

    setToasts(prev => [...prev, toast]);

    // Auto-hide after duration
    setTimeout(() => {
      hideToast(id);
    }, duration);
  };

  const hideToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast, toasts }}>
      {children}
    </ToastContext.Provider>
  );
};