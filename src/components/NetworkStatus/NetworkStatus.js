import React, { useState, useEffect } from 'react';
import { FaWifi, FaSpinner } from 'react-icons/fa';
import './NetworkStatus.css';

function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isChecking, setIsChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState(null);
  const [connectionType, setConnectionType] = useState('unknown');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isPersistent, setIsPersistent] = useState(false);

  // Show temporary notification (auto-hide)
  const showTemporaryNotification = (message, duration = 3000) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setIsPersistent(false);
    
    setTimeout(() => {
      setShowNotification(false);
    }, duration);
  };

  // Show persistent notification (stays until manually hidden)
  const showPersistentNotification = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setIsPersistent(true);
  };

  // Hide notification manually
  const hideNotification = () => {
    setShowNotification(false);
  };

  useEffect(() => {
    // Initial check
    checkConnectionStatus();
    
    // Show initial online notification if we're online
    if (navigator.onLine) {
      showTemporaryNotification('🌐 You are online', 5000);
    }
    
    // Mark initial load as complete after first check
    setTimeout(() => {
      setIsInitialLoad(false);
    }, 2000);

    // Listen for online/offline events
    const handleOnline = () => {
      console.log('🌐 Network: Online event detected');
      const wasOffline = !isOnline;
      setIsOnline(true);
      
      if (wasOffline && !isInitialLoad) {
        showTemporaryNotification('🌐 You are back online!', 5000);
      }
      
      checkConnectionStatus();
    };

    const handleOffline = () => {
      console.log('📴 Network: Offline event detected');
      const wasOnline = isOnline;
      setIsOnline(false);
      setConnectionType('offline');
      
      // Always show offline notification and make it persistent
      showPersistentNotification('📴 You are offline');
    };

    // Listen for service worker messages
    const handleServiceWorkerMessage = (event) => {
      if (event.data && event.data.type === 'NETWORK_STATUS') {
        console.log('📡 Network: Service worker status update:', event.data.status);
        
        if (event.data.status === 'online') {
          const wasOffline = !isOnline;
          setIsOnline(true);
          setConnectionType('online');
          
          if (wasOffline && !isInitialLoad) {
            showTemporaryNotification('🌐 Connection restored!', 5000);
          }
        } else if (event.data.status === 'offline') {
          const wasOnline = isOnline;
          setIsOnline(false);
          setConnectionType('offline');
          
          // Always show offline notification and make it persistent
          showPersistentNotification('📴 Connection lost');
        }
      }
    };

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Listen for service worker messages
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);
    }

    // Check connection every 30 seconds
    const interval = setInterval(checkConnectionStatus, 30000);

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage);
      }
      
      clearInterval(interval);
    };
  }, []);

  const checkConnectionStatus = async () => {
    setIsChecking(true);
    const previousStatus = isOnline;
    
    try {
      // Try to fetch a small resource to verify actual connectivity
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch('/manifest.json', {
        method: 'HEAD',
        cache: 'no-cache',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const newStatus = true;
        setIsOnline(newStatus);
        setConnectionType('online');
        console.log('✅ Network: Connection verified');
        
        // Show notification if status changed and not initial load
        if (previousStatus !== newStatus && !isInitialLoad) {
          showTemporaryNotification('🌐 You are back online!', 5000);
        }
      } else {
        const newStatus = false;
        setIsOnline(newStatus);
        setConnectionType('error');
        console.log('❌ Network: Connection failed');
        
        // Show persistent offline notification
        showPersistentNotification('📴 Connection failed');
      }
    } catch (error) {
      console.log('❌ Network: Connection check failed:', error.message);
      const newStatus = false;
      setIsOnline(newStatus);
      
      if (error.name === 'AbortError') {
        setConnectionType('timeout');
        // Show persistent offline notification
        showPersistentNotification('⏱️ Connection timeout');
      } else {
        setConnectionType('error');
        // Show persistent offline notification
        showPersistentNotification('📴 You are now offline');
      }
    } finally {
      setIsChecking(false);
      setLastChecked(new Date());
    }
  };

  const getStatusIcon = () => {
    if (isChecking) {
      return <FaSpinner className="spinning" />;
    }
    return <FaWifi className={isOnline ? 'wifi-online' : 'wifi-offline'} />;
  };

  const getStatusText = () => {
    if (isChecking) {
      return 'Checking...';
    }
    
    if (isOnline) {
      switch (connectionType) {
        case 'online':
          return 'Online';
        case 'slow':
          return 'Slow Connection';
        default:
          return 'Online';
      }
    } else {
      switch (connectionType) {
        case 'offline':
          return 'Offline';
        case 'timeout':
          return 'Connection Timeout';
        case 'error':
          return 'Connection Error';
        default:
          return 'Offline';
      }
    }
  };

  const getStatusColor = () => {
    if (isChecking) {
      return '#f59e0b'; // Yellow
    }
    
    if (isOnline) {
      return '#10b981'; // Green
    } else {
      return '#ef4444'; // Red
    }
  };

  const getStatusClass = () => {
    if (isChecking) {
      return 'checking';
    }
    return isOnline ? 'online' : 'offline';
  };

  // Don't render anything if notification is not showing
  if (!showNotification) {
    return null;
  }

  return (
    <div className={`network-status notification ${getStatusClass()}`}>
      <div className="network-icon" style={{ color: getStatusColor() }}>
        {getStatusIcon()}
      </div>
      <div className="network-info">
        <div className="network-text" style={{ color: getStatusColor() }}>
          {notificationMessage}
        </div>
        {lastChecked && (
          <div className="last-checked">
            Last checked: {lastChecked.toLocaleTimeString()}
          </div>
        )}
      </div>
      {isPersistent && (
        <button 
          className="close-btn"
          onClick={hideNotification}
          title="Close notification"
        >
          ✕
        </button>
      )}
    </div>
  );
}

export default NetworkStatus;
