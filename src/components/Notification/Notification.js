import React from 'react';
import './Notification.css';

const Notification = ({ show, count, onClose }) => {
  if (!show) return null;

  return (
    <div className="notification-overlay">
      <div className="notification-badge">
        <div className="notification-content">
          <div className="notification-icon">🔔</div>
          <div className="notification-text">
            <div className="notification-title">New Orders!</div>
            <div className="notification-count">{count} new order{count > 1 ? 's' : ''}</div>
          </div>
          <button className="notification-close" onClick={onClose}>
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notification;


