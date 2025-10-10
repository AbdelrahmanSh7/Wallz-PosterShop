// Advanced Notification Service for Wallz
class NotificationService {
  constructor() {
    this.isSupported = 'Notification' in window;
    this.permission = 'default';
    this.subscription = null;
    this.vapidPublicKey = 'BEl62iUYgUivxIkv69yViEuiBIa40HI1oOQYJN6QYJN6QYJN6QYJN6QYJN6QYJN6QYJN6QYJN6QYJN6QYJN6Q';
    this.serverUrl = 'http://localhost:3001'; // Local server for development
  }

  // Initialize notification service
  async initialize() {
    try {
      console.log('🔔 Initializing Notification Service...');
      
      if (!this.isSupported) {
        console.log('❌ Notifications not supported in this browser');
        return false;
      }

      // Check current permission
      this.permission = Notification.permission;
      console.log('📋 Current permission:', this.permission);

      // Request permission if needed
      if (this.permission === 'default') {
        this.permission = await this.requestPermission();
      }

      if (this.permission === 'granted') {
        console.log('✅ Notification permission granted');
        
        // Setup push notifications
        await this.setupPushNotifications();
        
        // Setup notification click handler
        this.setupNotificationClickHandler();
        
        return true;
      } else {
        console.log('❌ Notification permission denied');
        return false;
      }
    } catch (error) {
      console.error('❌ Failed to initialize notification service:', error);
      return false;
    }
  }

  // Request notification permission
  async requestPermission() {
    try {
      const permission = await Notification.requestPermission();
      console.log('🔔 Permission request result:', permission);
      return permission;
    } catch (error) {
      console.error('❌ Failed to request permission:', error);
      return 'denied';
    }
  }

  // Setup push notifications
  async setupPushNotifications() {
    try {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.log('❌ Push notifications not supported');
        return false;
      }

      // Get service worker registration
      const registration = await navigator.serviceWorker.ready;
      
      // Subscribe to push notifications
      this.subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey)
      });

      console.log('✅ Push subscription created:', this.subscription);
      
      // Send subscription to server
      await this.sendSubscriptionToServer(this.subscription);
      
      return true;
    } catch (error) {
      console.error('❌ Failed to setup push notifications:', error);
      return false;
    }
  }

  // Send subscription to server
  async sendSubscriptionToServer(subscription) {
    try {
      const response = await fetch(`${this.serverUrl}/api/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription: subscription,
          userId: this.getUserId(),
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        console.log('✅ Subscription sent to server successfully');
        return true;
      } else {
        console.error('❌ Failed to send subscription to server');
        return false;
      }
    } catch (error) {
      console.error('❌ Error sending subscription to server:', error);
      return false;
    }
  }

  // Send local notification
  async sendLocalNotification(title, options = {}) {
    try {
      if (this.permission !== 'granted') {
        console.log('❌ Notification permission not granted');
        return false;
      }

      const notificationOptions = {
        body: options.body || 'New notification from Wallz',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        image: options.image || '/icons/icon-512x512.png',
        vibrate: [200, 100, 200, 100, 200], // Enhanced vibration pattern
        requireInteraction: options.persistent || true, // Make notifications persistent
        silent: false, // Always enable sound
        tag: options.tag || 'wallz-notification',
        data: {
          url: options.url || '/',
          orderId: options.orderId || null,
          timestamp: Date.now(),
          ...options.data
        },
        actions: options.actions || [
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

      const notification = new Notification(title, notificationOptions);
      
      // Play notification sound
      this.playNotificationSound();
      
      console.log('✅ Local notification sent:', title);
      return notification;
    } catch (error) {
      console.error('❌ Failed to send local notification:', error);
      return false;
    }
  }

  // Play notification sound
  playNotificationSound() {
    try {
      // Try to play notification sound
      const audio = new Audio('/sounds/notification.mp3');
      audio.volume = 0.7;
      audio.play().catch(error => {
        console.log('Could not play notification sound:', error);
        // Fallback: use Web Audio API to generate a simple beep
        this.generateBeepSound();
      });
    } catch (error) {
      console.log('Could not create audio:', error);
      // Fallback: use Web Audio API to generate a simple beep
      this.generateBeepSound();
    }
  }

  // Generate a simple beep sound using Web Audio API
  generateBeepSound() {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800; // Frequency in Hz
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.log('Could not generate beep sound:', error);
    }
  }

  // Send new order notification
  async sendNewOrderNotification(order) {
    try {
      console.log('📦 Sending new order notification for order:', order.id);
      
      const title = '🛒 New Order Received!';
      const body = `Order #${order.id} from ${order.customer.fullName} - ${order.total} EGP`;
      
      const options = {
        body: body,
        tag: `order-${order.id}`,
        requireInteraction: true,
        data: {
          orderId: order.id,
          url: '/admin/orders',
          type: 'new_order',
          order: order
        },
        actions: [
          {
            action: 'view_order',
            title: 'View Order',
            icon: '/icons/view-icon.png'
          },
          {
            action: 'mark_read',
            title: 'Mark as Read',
            icon: '/icons/check-icon.png'
          }
        ]
      };

      // Send local notification
      await this.sendLocalNotification(title, options);
      
      // Send to server for push notifications and email
      await this.sendToServer({
        type: 'new_order',
        title: title,
        body: body,
        data: {
          orderId: order.id,
          url: '/admin/orders',
          type: 'new_order',
          order: order
        }
      });

      // Also send specific order notification to server
      try {
        const response = await fetch(`${this.serverUrl}/api/send-order-notification`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            order: order,
            type: 'new_order'
          })
        });

        if (response.ok) {
          console.log('✅ Order notification sent to server successfully');
        } else {
          console.error('❌ Failed to send order notification to server');
        }
      } catch (serverError) {
        console.error('❌ Server notification error:', serverError);
      }

      return true;
    } catch (error) {
      console.error('❌ Failed to send new order notification:', error);
      return false;
    }
  }

  // Send order status update notification
  async sendOrderStatusNotification(order, oldStatus, newStatus) {
    try {
      console.log(`📝 Sending status update notification: ${oldStatus} → ${newStatus}`);
      
      const title = '📦 Order Status Updated';
      const body = `Order #${order.id} status changed to ${newStatus}`;
      
      const options = {
        body: body,
        tag: `order-status-${order.id}`,
        data: {
          orderId: order.id,
          url: '/admin/orders',
          type: 'status_update',
          oldStatus: oldStatus,
          newStatus: newStatus
        }
      };

      await this.sendLocalNotification(title, options);
      return true;
    } catch (error) {
      console.error('❌ Failed to send status update notification:', error);
      return false;
    }
  }

  // Send system notification
  async sendSystemNotification(title, message, type = 'info') {
    try {
      const icons = {
        info: '/icons/info-icon.png',
        success: '/icons/success-icon.png',
        warning: '/icons/warning-icon.png',
        error: '/icons/error-icon.png'
      };

      const options = {
        body: message,
        icon: icons[type] || icons.info,
        tag: `system-${type}-${Date.now()}`,
        data: {
          type: 'system',
          notificationType: type
        }
      };

      await this.sendLocalNotification(title, options);
      return true;
    } catch (error) {
      console.error('❌ Failed to send system notification:', error);
      return false;
    }
  }

  // Send to server for push notifications
  async sendToServer(notificationData) {
    try {
      const response = await fetch(`${this.serverUrl}/api/send-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationData)
      });

      if (response.ok) {
        console.log('✅ Notification sent to server successfully');
        return true;
      } else {
        console.error('❌ Failed to send notification to server');
        return false;
      }
    } catch (error) {
      console.error('❌ Error sending notification to server:', error);
      return false;
    }
  }

  // Setup notification click handler
  setupNotificationClickHandler() {
    // This will be handled by the service worker
    console.log('🔔 Notification click handler setup (handled by service worker)');
  }

  // Test notification
  async testNotification() {
    try {
      await this.sendLocalNotification('🧪 Test Notification', {
        body: 'This is a test notification from Wallz!',
        requireInteraction: true,
        tag: 'test-notification'
      });
      return true;
    } catch (error) {
      console.error('❌ Failed to send test notification:', error);
      return false;
    }
  }

  // Get user ID (you can customize this)
  getUserId() {
    // Try to get from localStorage or generate one
    let userId = localStorage.getItem('wallz_user_id');
    if (!userId) {
      userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('wallz_user_id', userId);
    }
    return userId;
  }

  // Utility function to convert VAPID key
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

  // Get notification status
  getStatus() {
    return {
      isSupported: this.isSupported,
      permission: this.permission,
      isEnabled: this.permission === 'granted',
      hasSubscription: !!this.subscription
    };
  }

  // Unsubscribe from notifications
  async unsubscribe() {
    try {
      if (this.subscription) {
        await this.subscription.unsubscribe();
        this.subscription = null;
        console.log('✅ Unsubscribed from notifications');
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Failed to unsubscribe:', error);
      return false;
    }
  }
}

// Create singleton instance
const notificationService = new NotificationService();

export default notificationService;
