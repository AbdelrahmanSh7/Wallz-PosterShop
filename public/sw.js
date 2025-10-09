// Wallz PWA Service Worker
const CACHE_NAME = 'wallz-v1.0.0';
const STATIC_CACHE_NAME = 'wallz-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'wallz-dynamic-v1.0.0';

// Files to cache for offline functionality
const STATIC_FILES = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/offline.html'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('📦 Service Worker: Caching static files...');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('✅ Service Worker: Static files cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ Service Worker: Failed to cache static files:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
              console.log('🗑️ Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('✅ Service Worker: Activated successfully');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip Firebase and external API calls
  if (url.hostname.includes('firebase') || 
      url.hostname.includes('googleapis') ||
      url.hostname.includes('googleusercontent') ||
      url.hostname.includes('gstatic')) {
    return;
  }
  
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        // Return cached version if available
        if (cachedResponse) {
          console.log('📦 Service Worker: Serving from cache:', request.url);
          return cachedResponse;
        }
        
        // Otherwise, fetch from network
        console.log('🌐 Service Worker: Fetching from network:', request.url);
        return fetch(request)
          .then((networkResponse) => {
            // Don't cache if not a valid response
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }
            
            // Clone the response
            const responseToCache = networkResponse.clone();
            
            // Cache the response
            caches.open(DYNAMIC_CACHE_NAME)
              .then((cache) => {
                cache.put(request, responseToCache);
              });
            
            return networkResponse;
          })
          .catch((error) => {
            console.log('❌ Service Worker: Network fetch failed:', request.url, error.message);
            
            // Only show offline page if we're actually offline
            if (request.destination === 'document') {
              // Check if we're really offline by trying a simple fetch
              return fetch('/manifest.json', { method: 'HEAD', cache: 'no-cache' })
                .then(() => {
                  // We're actually online, so redirect to the main app
                  console.log('✅ Service Worker: Actually online, redirecting to app');
                  return Response.redirect('/', 302);
                })
                .catch(() => {
                  // We're really offline, show offline page
                  console.log('📴 Service Worker: Really offline, showing offline page');
                  return caches.match('/offline.html');
                });
            }
            
            // For other requests, return a fallback response
            return new Response('Service Unavailable', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});

// Background sync for offline orders
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('🔄 Service Worker: Background sync triggered');
    event.waitUntil(doBackgroundSync());
  }
});

// Network status handling
self.addEventListener('online', (event) => {
  console.log('🌐 Service Worker: Back online');
  // Sync any pending data
  event.waitUntil(doBackgroundSync());
  
  // Notify all clients that we're back online
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'NETWORK_STATUS',
        status: 'online',
        timestamp: Date.now()
      });
      
      // If client is showing offline page, redirect to main app
      if (client.url.includes('offline.html')) {
        client.navigate('/');
      }
    });
  });
});

self.addEventListener('offline', (event) => {
  console.log('📴 Service Worker: Gone offline');
  
  // Notify all clients that we're offline
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'NETWORK_STATUS',
        status: 'offline',
        timestamp: Date.now()
      });
    });
  });
});

// Add a periodic network check
setInterval(async () => {
  try {
    const response = await fetch('/manifest.json', { 
      method: 'HEAD', 
      cache: 'no-cache',
      timeout: 5000 
    });
    
    if (response.ok) {
      // We're online, notify clients
      const clients = await self.clients.matchAll();
      clients.forEach(client => {
        if (client.url.includes('offline.html')) {
          client.navigate('/');
        }
      });
    }
  } catch (error) {
    // We're offline, that's fine
    console.log('📴 Service Worker: Periodic check confirms offline');
  }
}, 10000); // Check every 10 seconds

// Push notifications
self.addEventListener('push', (event) => {
  console.log('📱 Service Worker: Push notification received');
  
  let notificationData = {
    title: 'Wallz - Premium Posters',
    body: 'New notification from Wallz',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'view',
        title: 'View Details',
        icon: '/icons/view-icon.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/icons/dismiss-icon.png'
      }
    ]
  };

  // Parse push data if available
  if (event.data) {
    try {
      const pushData = event.data.json();
      notificationData = {
        ...notificationData,
        ...pushData
      };
      console.log('📦 Parsed push data:', pushData);
    } catch (error) {
      console.log('📝 Using text data:', event.data.text());
      notificationData.body = event.data.text();
    }
  }
  
  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 Service Worker: Notification clicked');
  
  event.notification.close();
  
  const data = event.notification.data || {};
  
  if (event.action === 'view' || event.action === 'view_order') {
    // Open the app and navigate to the specific page
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
        // If app is already open, focus it and navigate
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.focus();
            client.postMessage({
              type: 'NAVIGATE',
              url: data.url || '/admin/orders',
              orderId: data.orderId
            });
            return;
          }
        }
        // If app is not open, open it
        if (clients.openWindow) {
          return clients.openWindow(data.url || '/admin/orders');
        }
      })
    );
  } else if (event.action === 'dismiss') {
    // Just close the notification
    console.log('🔔 Notification dismissed');
  } else if (event.action === 'mark_read') {
    // Mark as read
    console.log('🔔 Notification marked as read');
    // You can implement marking as read logic here
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow(data.url || '/admin/orders')
    );
  }
});

// Background sync function
async function doBackgroundSync() {
  try {
    // Sync offline orders when back online
    const offlineOrders = await getOfflineOrders();
    
    for (const order of offlineOrders) {
      try {
        await syncOrder(order);
        await removeOfflineOrder(order.id);
      } catch (error) {
        console.error('Failed to sync order:', error);
      }
    }
    
    console.log('✅ Background sync completed');
  } catch (error) {
    console.error('❌ Background sync failed:', error);
  }
}

// Helper functions
async function getOfflineOrders() {
  // This would typically read from IndexedDB
  return [];
}

async function syncOrder(order) {
  // This would sync the order to the server
  console.log('Syncing order:', order.id);
}

async function removeOfflineOrder(orderId) {
  // This would remove the order from offline storage
  console.log('Removing offline order:', orderId);
}

// Message handling
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

console.log('🎉 Service Worker: Loaded successfully');
