// Service Worker for WallZ Push Notifications
const CACHE_NAME = 'wallz-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

// Install event
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('✅ Cache opened');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('✅ Service Worker installed');
        return self.skipWaiting();
      })
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Service Worker activated');
      return self.clients.claim();
    })
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Push event - Handle push notifications
self.addEventListener('push', (event) => {
  console.log('📱 Push notification received');
  
  let notificationData = {
    title: '🛒 WallZ - New Order!',
    body: 'You have a new order waiting for you!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    tag: 'wallz-new-order',
    requireInteraction: true,
    vibrate: [200, 100, 200],
    sound: '/sounds/notification.mp3',
    actions: [
      {
        action: 'view',
        title: 'View Order',
        icon: '/icons/view-icon.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/close-icon.png'
      }
    ]
  };

  // Parse push data if available
  if (event.data) {
    try {
      const pushData = event.data.json();
      if (pushData.title) notificationData.title = pushData.title;
      if (pushData.body) notificationData.body = pushData.body;
      if (pushData.icon) notificationData.icon = pushData.icon;
      if (pushData.tag) notificationData.tag = pushData.tag;
      if (pushData.data) notificationData.data = pushData.data;
    } catch (error) {
      console.error('Error parsing push data:', error);
    }
  }

  // Show notification
  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 Notification clicked:', event.action);
  
  event.notification.close();

  if (event.action === 'view' || !event.action) {
    // Open the admin panel
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        // Check if admin panel is already open
        for (const client of clientList) {
          if (client.url.includes('/admin/orders') && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Open new window if no admin panel is open
        if (clients.openWindow) {
          return clients.openWindow('/admin/orders');
        }
      })
    );
  } else if (event.action === 'close') {
    // Just close the notification
    console.log('📱 Notification closed');
  }
});

// Background sync for offline orders
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('🔄 Background sync triggered');
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    // Check for pending orders or notifications
    console.log('🔄 Performing background sync...');
    
    // You can add logic here to sync data when the user comes back online
    // For example, check for new orders, sync local data, etc.
    
  } catch (error) {
    console.error('❌ Background sync failed:', error);
  }
}

// Handle messages from main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('✅ WallZ Service Worker loaded successfully');