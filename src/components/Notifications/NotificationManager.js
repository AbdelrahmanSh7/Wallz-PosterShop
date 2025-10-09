import React, { useState, useEffect } from 'react';
import { FaBell, FaBellSlash, FaCog, FaCheck, FaTimes } from 'react-icons/fa';
import notificationService from '../../services/notificationService';
import './NotificationManager.css';

function NotificationManager() {
  const [notificationStatus, setNotificationStatus] = useState({
    isSupported: false,
    permission: 'default',
    isEnabled: false,
    hasSubscription: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    initializeNotifications();
  }, []);

  const initializeNotifications = async () => {
    try {
      setIsLoading(true);
      const initialized = await notificationService.initialize();
      
      if (initialized) {
        const status = notificationService.getStatus();
        setNotificationStatus(status);
        console.log('✅ Notifications initialized successfully');
      } else {
        const status = notificationService.getStatus();
        setNotificationStatus(status);
        console.log('❌ Failed to initialize notifications');
      }
    } catch (error) {
      console.error('❌ Error initializing notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnableNotifications = async () => {
    try {
      setIsLoading(true);
      const initialized = await notificationService.initialize();
      
      if (initialized) {
        const status = notificationService.getStatus();
        setNotificationStatus(status);
        setTestResult({ type: 'success', message: 'Notifications enabled successfully!' });
      } else {
        setTestResult({ type: 'error', message: 'Failed to enable notifications. Please check your browser settings.' });
      }
    } catch (error) {
      console.error('❌ Error enabling notifications:', error);
      setTestResult({ type: 'error', message: 'Error enabling notifications: ' + error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestNotification = async () => {
    try {
      setIsLoading(true);
      const success = await notificationService.testNotification();
      
      if (success) {
        setTestResult({ type: 'success', message: 'Test notification sent successfully!' });
      } else {
        setTestResult({ type: 'error', message: 'Failed to send test notification.' });
      }
    } catch (error) {
      console.error('❌ Error sending test notification:', error);
      setTestResult({ type: 'error', message: 'Error sending test notification: ' + error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisableNotifications = async () => {
    try {
      setIsLoading(true);
      await notificationService.unsubscribe();
      
      const status = notificationService.getStatus();
      setNotificationStatus(status);
      setTestResult({ type: 'success', message: 'Notifications disabled successfully!' });
    } catch (error) {
      console.error('❌ Error disabling notifications:', error);
      setTestResult({ type: 'error', message: 'Error disabling notifications: ' + error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const getPermissionStatusText = () => {
    switch (notificationStatus.permission) {
      case 'granted':
        return 'Enabled';
      case 'denied':
        return 'Disabled';
      case 'default':
        return 'Not Set';
      default:
        return 'Unknown';
    }
  };

  const getPermissionStatusColor = () => {
    switch (notificationStatus.permission) {
      case 'granted':
        return '#10b981';
      case 'denied':
        return '#ef4444';
      case 'default':
        return '#f59e0b';
      default:
        return '#6b7280';
    }
  };

  if (!notificationStatus.isSupported) {
    return (
      <div className="notification-manager">
        <div className="notification-card unsupported">
          <div className="notification-icon">
            <FaBellSlash />
          </div>
          <div className="notification-content">
            <h3>Notifications Not Supported</h3>
            <p>Your browser doesn't support notifications. Please use a modern browser like Chrome, Firefox, or Safari.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="notification-manager">
      <div className="notification-card">
        <div className="notification-header">
          <div className="notification-icon">
            {notificationStatus.isEnabled ? <FaBell /> : <FaBellSlash />}
          </div>
          <div className="notification-content">
            <h3>Push Notifications</h3>
            <p>Get notified about new orders and updates</p>
          </div>
          <button 
            className="settings-btn"
            onClick={() => setShowSettings(!showSettings)}
          >
            <FaCog />
          </button>
        </div>

        <div className="notification-status">
          <div className="status-item">
            <span className="status-label">Status:</span>
            <span 
              className="status-value"
              style={{ color: getPermissionStatusColor() }}
            >
              {getPermissionStatusText()}
            </span>
          </div>
          <div className="status-item">
            <span className="status-label">Subscription:</span>
            <span 
              className="status-value"
              style={{ color: notificationStatus.hasSubscription ? '#10b981' : '#ef4444' }}
            >
              {notificationStatus.hasSubscription ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>

        {showSettings && (
          <div className="notification-settings">
            <div className="settings-content">
              {notificationStatus.isEnabled ? (
                <div className="settings-actions">
                  <button 
                    className="action-btn test-btn"
                    onClick={handleTestNotification}
                    disabled={isLoading}
                  >
                    🧪 Test Notification
                  </button>
                  <button 
                    className="action-btn disable-btn"
                    onClick={handleDisableNotifications}
                    disabled={isLoading}
                  >
                    Disable Notifications
                  </button>
                </div>
              ) : (
                <div className="settings-actions">
                  <button 
                    className="action-btn enable-btn"
                    onClick={handleEnableNotifications}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Enabling...' : 'Enable Notifications'}
                  </button>
                </div>
              )}
            </div>

            {testResult && (
              <div className={`test-result ${testResult.type}`}>
                <div className="result-icon">
                  {testResult.type === 'success' ? <FaCheck /> : <FaTimes />}
                </div>
                <span>{testResult.message}</span>
              </div>
            )}
          </div>
        )}

        <div className="notification-info">
          <h4>What you'll receive:</h4>
          <ul>
            <li>🛒 New order notifications</li>
            <li>📦 Order status updates</li>
            <li>🔔 System notifications</li>
            <li>📱 Works even when app is closed</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default NotificationManager;
