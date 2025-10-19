import React from 'react';
import { useToast } from '../../hooks/useToast';
import type { ToastMessage } from '../../hooks/useToast';

const Toast: React.FC = () => {
  const { toasts, hideToast } = useToast();

  const getIcon = (type: ToastMessage['type']) => {
    switch (type) {
      case 'success':
        return 'bx-check-circle';
      case 'error':
        return 'bx-error-circle';
      case 'warning':
        return 'bx-error';
      case 'info':
        return 'bx-info-circle';
      default:
        return 'bx-bell';
    }
  };

  const getDefaultColor = (type: ToastMessage['type']) => {
    switch (type) {
      case 'success':
        return '#10b981';
      case 'error':
        return '#ef4444';
      case 'warning':
        return '#f59e0b';
      case 'info':
        return '#3b82f6';
      default:
        return '#6b7280';
    }
  };

  if (toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      maxWidth: '400px'
    }}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast-notification ${toast.type}`}
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            border: `1px solid ${toast.color || getDefaultColor(toast.type)}`,
            padding: '16px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            animation: 'slideIn 0.3s ease-out',
            minWidth: '300px',
            maxWidth: '400px'
          }}
        >
          <div
            style={{
              color: toast.color || getDefaultColor(toast.type),
              fontSize: '20px',
              flexShrink: 0,
              marginTop: '2px'
            }}
          >
            <i className={`bx ${getIcon(toast.type)}`}></i>
          </div>

          <div style={{ flex: 1 }}>
            <div
              className="toast-title"
              style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '4px'
              }}
            >
              {toast.title}
            </div>
            <div
              className="toast-message"
              style={{
                fontSize: '14px',
                color: '#6b7280',
                lineHeight: '1.4'
              }}
            >
              {toast.message}
            </div>
          </div>

          <button
            className="toast-close"
            onClick={() => hideToast(toast.id)}
            style={{
              background: 'none',
              border: 'none',
              color: '#9ca3af',
              fontSize: '16px',
              cursor: 'pointer',
              padding: '0',
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
            title="Close"
          >
            <i className="bx bx-x"></i>
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;