import React, { useEffect, useState } from 'react';

class PWAManager {
  constructor() {
    this.swRegistration = null;
    this.updateAvailable = false;
    this.listeners = [];
  }

  // Initialize PWA
  async initialize() {
    try {
      console.log('🚀 Initializing PWA...');
      
      // Register service worker
      if ('serviceWorker' in navigator) {
        this.swRegistration = await navigator.serviceWorker.register('/sw.js');
        console.log('✅ Service Worker registered successfully:', this.swRegistration);
        
        // Listen for updates
        this.swRegistration.addEventListener('updatefound', () => {
          console.log('🔄 Service Worker update found');
          this.handleUpdateFound();
        });
        
        // Listen for controller change
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          console.log('🔄 Service Worker controller changed');
          this.notifyListeners('controllerchange');
        });
      } else {
        console.log('❌ Service Worker not supported');
      }
      
      // Setup install prompt
      this.setupInstallPrompt();
      
      // Setup push notifications
      this.setupPushNotifications();
      
      console.log('✅ PWA initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize PWA:', error);
    }
  }

  // Handle update found
  handleUpdateFound() {
    const newWorker = this.swRegistration.installing;
    
    if (newWorker) {
      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed') {
          if (navigator.serviceWorker.controller) {
            // Update available
            this.updateAvailable = true;
            this.notifyListeners('updateavailable');
          } else {
            // App is ready for offline use
            this.notifyListeners('appready');
          }
        }
      });
    }
  }

  // Update the app
  async updateApp() {
    try {
      if (this.swRegistration && this.swRegistration.waiting) {
        // Tell the waiting service worker to skip waiting
        this.swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
        
        // Reload the page
        window.location.reload();
      }
    } catch (error) {
      console.error('❌ Failed to update app:', error);
    }
  }

  // Setup install prompt
  setupInstallPrompt() {
    let deferredPrompt;
    
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      this.notifyListeners('installprompt', { deferredPrompt });
    });
    
    window.addEventListener('appinstalled', () => {
      console.log('✅ PWA was installed');
      this.notifyListeners('appinstalled');
    });
  }

  // Setup push notifications
  async setupPushNotifications() {
    if ('Notification' in window && 'PushManager' in window) {
      // Request permission
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        console.log('✅ Push notifications enabled');
        this.notifyListeners('pushenabled');
      } else {
        console.log('❌ Push notifications denied');
      }
    }
  }

  // Subscribe to push notifications
  async subscribeToPush() {
    try {
      if (!this.swRegistration) {
        throw new Error('Service Worker not registered');
      }
      
      const subscription = await this.swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(
          'BEl62iUYgUivxIkv69yViEuiBIa40HI1oOQYJN6QYJN6QYJN6QYJN6QYJN6QYJN6QYJN6QYJN6QYJN6QYJN6Q'
        )
      });
      
      console.log('✅ Push subscription successful:', subscription);
      return subscription;
    } catch (error) {
      console.error('❌ Failed to subscribe to push:', error);
      throw error;
    }
  }

  // Send push notification
  async sendPushNotification(title, options = {}) {
    try {
      if (!this.swRegistration) {
        throw new Error('Service Worker not registered');
      }
      
      await this.swRegistration.showNotification(title, {
        body: options.body || 'New notification from Wallz',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        vibrate: [100, 50, 100],
        ...options
      });
      
      console.log('✅ Push notification sent');
    } catch (error) {
      console.error('❌ Failed to send push notification:', error);
    }
  }

  // Check if app is installed
  isInstalled() {
    return window.matchMedia('(display-mode: standalone)').matches ||
           window.navigator.standalone === true ||
           document.referrer.includes('android-app://');
  }

  // Check if app is online
  isOnline() {
    return navigator.onLine;
  }

  // Get app info
  getAppInfo() {
    return {
      isInstalled: this.isInstalled(),
      isOnline: this.isOnline(),
      platform: this.getPlatform(),
      updateAvailable: this.updateAvailable,
      swRegistration: this.swRegistration
    };
  }

  // Get platform
  getPlatform() {
    const userAgent = navigator.userAgent.toLowerCase();
    if (/android/.test(userAgent)) return 'android';
    if (/iphone|ipad|ipod/.test(userAgent)) return 'ios';
    if (/windows/.test(userAgent)) return 'windows';
    if (/macintosh/.test(userAgent)) return 'mac';
    if (/linux/.test(userAgent)) return 'linux';
    return 'unknown';
  }

  // Utility function
  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    
    return outputArray;
  }

  // Event listener system
  addEventListener(event, callback) {
    this.listeners.push({ event, callback });
  }

  removeEventListener(event, callback) {
    this.listeners = this.listeners.filter(
      listener => !(listener.event === event && listener.callback === callback)
    );
  }

  notifyListeners(event, data) {
    this.listeners
      .filter(listener => listener.event === event)
      .forEach(listener => listener.callback(data));
  }

  // Background sync
  async syncOfflineData() {
    try {
      if ('serviceWorker' in navigator && this.swRegistration) {
        // Trigger background sync
        const registration = await navigator.serviceWorker.ready;
        await registration.sync.register('background-sync');
        console.log('✅ Background sync registered');
      }
    } catch (error) {
      console.error('❌ Failed to sync offline data:', error);
    }
  }

  // Clear cache
  async clearCache() {
    try {
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
        console.log('✅ Cache cleared successfully');
      }
    } catch (error) {
      console.error('❌ Failed to clear cache:', error);
    }
  }
}

// Create singleton instance
const pwaManager = new PWAManager();

// PWA Hook
export const usePWA = () => {
  const [pwaState, setPwaState] = useState({
    isInstalled: false,
    isOnline: true,
    platform: 'unknown',
    updateAvailable: false,
    swRegistration: null
  });

  useEffect(() => {
    // Initialize PWA
    pwaManager.initialize();

    // Update state
    const updateState = () => {
      setPwaState(pwaManager.getAppInfo());
    };

    updateState();

    // Listen for events
    const handleUpdateAvailable = () => {
      setPwaState(prev => ({ ...prev, updateAvailable: true }));
    };

    const handleAppInstalled = () => {
      setPwaState(prev => ({ ...prev, isInstalled: true }));
    };

    const handleOnline = () => {
      setPwaState(prev => ({ ...prev, isOnline: true }));
    };

    const handleOffline = () => {
      setPwaState(prev => ({ ...prev, isOnline: false }));
    };

    pwaManager.addEventListener('updateavailable', handleUpdateAvailable);
    pwaManager.addEventListener('appinstalled', handleAppInstalled);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return {
    ...pwaState,
    updateApp: () => pwaManager.updateApp(),
    subscribeToPush: () => pwaManager.subscribeToPush(),
    sendPushNotification: (title, options) => pwaManager.sendPushNotification(title, options),
    syncOfflineData: () => pwaManager.syncOfflineData(),
    clearCache: () => pwaManager.clearCache()
  };
};

export default pwaManager;
