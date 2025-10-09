import React, { useState, useEffect } from 'react';
import { FaDownload, FaMobile, FaDesktop } from 'react-icons/fa';
import './InstallButton.css';

function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [platform, setPlatform] = useState('unknown');

  useEffect(() => {
    // Detect platform
    const detectPlatform = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      if (/android/.test(userAgent)) {
        return 'android';
      } else if (/iphone|ipad|ipod/.test(userAgent)) {
        return 'ios';
      } else if (/windows/.test(userAgent)) {
        return 'windows';
      } else if (/macintosh/.test(userAgent)) {
        return 'mac';
      } else if (/linux/.test(userAgent)) {
        return 'linux';
      }
      return 'desktop';
    };

    setPlatform(detectPlatform());

    // Check if already installed
    const checkIfInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
        setShowInstallButton(false);
        return;
      }

      // Check for iOS standalone mode
      if (window.navigator.standalone === true) {
        setIsInstalled(true);
        setShowInstallButton(false);
        return;
      }

      // Check if running in TWA mode (Android)
      if (document.referrer.includes('android-app://')) {
        setIsInstalled(true);
        setShowInstallButton(false);
        return;
      }
    };

    checkIfInstalled();

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      console.log('📱 Install prompt available');
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      console.log('✅ PWA was installed successfully');
      setIsInstalled(true);
      setShowInstallButton(false);
      setDeferredPrompt(null);
    };

    // Add event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Fallback instructions for different platforms
      if (platform === 'ios') {
        alert(`To install this app on iOS:
1. Tap the Share button at the bottom of Safari
2. Scroll down and tap "Add to Home Screen"
3. Tap "Add" to confirm`);
      } else if (platform === 'android') {
        alert(`To install this app on Android:
1. Tap the menu button (⋮) in your browser
2. Select "Add to Home screen" or "Install app"
3. Tap "Add" or "Install" to confirm`);
      } else {
        alert(`To install this app on Desktop:
1. Look for the install icon in your browser's address bar
2. Click on it and select "Install"
3. Follow the prompts to complete installation`);
      }
      return;
    }

    try {
      // Show the install prompt
      deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('✅ User accepted the install prompt');
      } else {
        console.log('❌ User dismissed the install prompt');
      }
      
      // Clear the deferredPrompt
      setDeferredPrompt(null);
      setShowInstallButton(false);
    } catch (error) {
      console.error('❌ Error showing install prompt:', error);
    }
  };

  // Don't show if already installed or not installable
  if (isInstalled || !showInstallButton) {
    return null;
  }

  const getInstallText = () => {
    if (platform === 'ios') {
      return 'Install App';
    } else if (platform === 'android') {
      return 'Install App';
    } else {
      return 'Install App';
    }
  };

  const getInstallIcon = () => {
    if (platform === 'ios' || platform === 'android') {
      return <FaMobile />;
    } else {
      return <FaDesktop />;
    }
  };

  return (
    <div className="install-button-container">
      <button 
        className="install-button"
        onClick={handleInstallClick}
        title="Install Wallz App"
      >
        <div className="install-icon">
          {getInstallIcon()}
        </div>
        <div className="install-text">
          <span className="install-title">{getInstallText()}</span>
          <span className="install-subtitle">
            {platform === 'ios' ? 'Add to Home Screen' : 
             platform === 'android' ? 'Install on Device' : 
             'Install on Desktop'}
          </span>
        </div>
        <FaDownload className="download-icon" />
      </button>
    </div>
  );
}

export default InstallButton;
