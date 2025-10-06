import React from 'react';
import './CustomAlert.css';

const CustomAlert = ({ show, message, type = 'info', onConfirm, onCancel, confirmText = 'OK', cancelText = 'Cancel' }) => {
  if (!show) return null;

  return (
    <div className="custom-alert-overlay">
      <div className="custom-alert-container">
        <div className="custom-alert-content">
          <div className="custom-alert-icon">
            {type === 'success' && '✅'}
            {type === 'error' && '❌'}
            {type === 'warning' && '⚠️'}
            {type === 'info' && 'ℹ️'}
            {type === 'delete' && '🗑️'}
          </div>
          <div className="custom-alert-message">
            {message}
          </div>
          <div className="custom-alert-buttons">
            {onCancel && (
              <button 
                className="custom-alert-btn custom-alert-btn-cancel" 
                onClick={onCancel}
              >
                {cancelText}
              </button>
            )}
            <button 
              className="custom-alert-btn custom-alert-btn-confirm" 
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomAlert;
