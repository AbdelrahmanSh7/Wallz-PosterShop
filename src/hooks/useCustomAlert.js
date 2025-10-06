import { useState } from 'react';

export const useCustomAlert = () => {
  const [alertState, setAlertState] = useState({
    show: false,
    message: '',
    type: 'info',
    onConfirm: null,
    onCancel: null,
    confirmText: 'OK',
    cancelText: 'Cancel'
  });

  const showAlert = (message, type = 'info', options = {}) => {
    return new Promise((resolve) => {
      setAlertState({
        show: true,
        message,
        type,
        onConfirm: () => {
          setAlertState(prev => ({ ...prev, show: false }));
          resolve(true);
        },
        onCancel: options.showCancel ? () => {
          setAlertState(prev => ({ ...prev, show: false }));
          resolve(false);
        } : null,
        confirmText: options.confirmText || 'OK',
        cancelText: options.cancelText || 'Cancel'
      });
    });
  };

  const hideAlert = () => {
    setAlertState(prev => ({ ...prev, show: false }));
  };

  return {
    alertState,
    showAlert,
    hideAlert
  };
};
