// Service Worker Utilities
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      console.log('🔧 Registering Service Worker...');
      
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });
      
      console.log('✅ Service Worker registered successfully:', registration);
      
      // Handle updates
      registration.addEventListener('updatefound', () => {
        console.log('🔄 Service Worker update found');
        const newWorker = registration.installing;
        
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('✅ New Service Worker installed, reloading...');
            window.location.reload();
          }
        });
      });
      
      return registration;
    } catch (error) {
      console.error('❌ Service Worker registration failed:', error);
      return null;
    }
  } else {
    console.log('❌ Service Workers not supported');
    return null;
  }
};

export const unregisterServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      
      for (let registration of registrations) {
        await registration.unregister();
        console.log('🗑️ Service Worker unregistered:', registration.scope);
      }
      
      return true;
    } catch (error) {
      console.error('❌ Failed to unregister Service Worker:', error);
      return false;
    }
  }
  
  return false;
};

export const clearServiceWorkerCache = async () => {
  if ('caches' in window) {
    try {
      const cacheNames = await caches.keys();
      
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      
      console.log('🗑️ All caches cleared');
      return true;
    } catch (error) {
      console.error('❌ Failed to clear caches:', error);
      return false;
    }
  }
  
  return false;
};

export const forceServiceWorkerUpdate = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      
      if (registration) {
        await registration.update();
        console.log('🔄 Service Worker update forced');
        return true;
      }
    } catch (error) {
      console.error('❌ Failed to force Service Worker update:', error);
    }
  }
  
  return false;
};

export const getServiceWorkerStatus = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      
      if (registration) {
        return {
          isSupported: true,
          isRegistered: true,
          isActive: !!navigator.serviceWorker.controller,
          scope: registration.scope,
          state: registration.active?.state || 'unknown'
        };
      } else {
        return {
          isSupported: true,
          isRegistered: false,
          isActive: false,
          scope: null,
          state: 'not_registered'
        };
      }
    } catch (error) {
      console.error('❌ Failed to get Service Worker status:', error);
      return {
        isSupported: true,
        isRegistered: false,
        isActive: false,
        scope: null,
        state: 'error',
        error: error.message
      };
    }
  } else {
    return {
      isSupported: false,
      isRegistered: false,
      isActive: false,
      scope: null,
      state: 'not_supported'
    };
  }
};


