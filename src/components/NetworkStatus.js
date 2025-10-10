import React, { useState, useEffect } from 'react';
import './NetworkStatus.css';

const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showNotification, setShowNotification] = useState(false);
  const [hasShownInitialNotification, setHasShownInitialNotification] = useState(false);

  // Play notification sound
  const playNotificationSound = (type) => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      if (type === 'online') {
        // Success sound - higher pitch
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
      } else if (type === 'offline') {
        // Warning sound - lower pitch
        oscillator.frequency.value = 400;
        oscillator.type = 'sawtooth';
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
      }
    } catch (error) {
      console.log('Could not play notification sound:', error);
    }
  };

  useEffect(() => {
    // Show initial notification when component mounts
    if (!hasShownInitialNotification) {
      setShowNotification(true);
      setHasShownInitialNotification(true);
      
      // Play initial sound based on connection status
      playNotificationSound(isOnline ? 'online' : 'offline');
      
      // Hide notification after 5 seconds
      const hideTimer = setTimeout(() => {
        setShowNotification(false);
      }, 5000);
      
      return () => clearTimeout(hideTimer);
    }

    // Listen for online/offline events
    const handleOnline = () => {
      setIsOnline(true);
      setShowNotification(true);
      
      // Play success sound
      playNotificationSound('online');
      
      // Hide notification after 5 seconds
      setTimeout(() => {
        setShowNotification(false);
      }, 5000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowNotification(true);
      
      // Play warning sound
      playNotificationSound('offline');
      
      // Hide notification after 5 seconds
      setTimeout(() => {
        setShowNotification(false);
      }, 5000);
    };

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup event listeners
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [hasShownInitialNotification]);

  if (!showNotification) {
    return null;
  }

  return (
    <div className={`network-status ${isOnline ? 'online' : 'offline'}`}>
      <div className="network-status-content">
        <div className="network-status-icon">
          {isOnline ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 9L12 2L23 9V20C23 20.5304 22.7893 21.0391 22.4142 21.4142C22.0391 21.7893 21.5304 22 21 22H3C2.46957 22 1.96086 21.7893 1.58579 21.4142C1.21071 21.0391 1 20.5304 1 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 12H18L15 21L9 3L6 12H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
        <div className="network-status-text">
          <span className="network-status-title">
            {isOnline ? 'متصل بالإنترنت' : 'غير متصل بالإنترنت'}
          </span>
          <span className="network-status-subtitle">
            {isOnline ? 'يمكنك استخدام جميع المميزات' : 'تحقق من اتصالك بالإنترنت'}
          </span>
        </div>
        <button 
          className="network-status-close"
          onClick={() => setShowNotification(false)}
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default NetworkStatus;
