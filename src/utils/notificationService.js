// Enhanced notification service for cross-device communication
class NotificationService {
  constructor() {
    this.isOnline = navigator.onLine;
    this.setupOnlineStatusListener();
  }

  setupOnlineStatusListener() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      console.log('Device is back online');
      this.syncPendingNotifications();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      console.log('Device is offline');
    });
  }

  // Send notification with retry mechanism
  async sendNotification(type, data, retries = 3) {
    try {
      if (!this.isOnline) {
        console.log('Device is offline, storing notification for later');
        this.storePendingNotification(type, data);
        return { success: false, error: 'Device offline' };
      }

      switch (type) {
        case 'NEW_ORDER':
          return await this.sendNewOrderNotification(data);
        case 'STATUS_UPDATE':
          return await this.sendStatusUpdateNotification(data);
        default:
          return { success: false, error: 'Unknown notification type' };
      }
    } catch (error) {
      console.error('Notification failed:', error);
      
      if (retries > 0) {
        console.log(`Retrying notification, ${retries} attempts left`);
        await this.delay(2000); // Wait 2 seconds before retry
        return await this.sendNotification(type, data, retries - 1);
      }
      
      return { success: false, error: error.message };
    }
  }

  // Store pending notifications for offline devices
  storePendingNotification(type, data) {
    const pendingNotifications = JSON.parse(localStorage.getItem('pendingNotifications') || '[]');
    pendingNotifications.push({
      type,
      data,
      timestamp: Date.now()
    });
    localStorage.setItem('pendingNotifications', JSON.stringify(pendingNotifications));
  }

  // Sync pending notifications when back online
  async syncPendingNotifications() {
    const pendingNotifications = JSON.parse(localStorage.getItem('pendingNotifications') || '[]');
    
    if (pendingNotifications.length === 0) return;

    console.log(`Syncing ${pendingNotifications.length} pending notifications`);

    for (const notification of pendingNotifications) {
      try {
        await this.sendNotification(notification.type, notification.data);
        console.log('Pending notification sent successfully');
      } catch (error) {
        console.error('Failed to send pending notification:', error);
      }
    }

    // Clear pending notifications
    localStorage.removeItem('pendingNotifications');
  }

  // Send new order notification
  async sendNewOrderNotification(orderData) {
    const { sendNewOrderNotification } = await import('./emailService');
    return await sendNewOrderNotification(orderData);
  }

  // Send status update notification
  async sendStatusUpdateNotification(orderData) {
    const { sendStatusUpdateNotification } = await import('./emailService');
    return await sendStatusUpdateNotification(orderData);
  }

  // Utility function for delays
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Check if device is online
  isDeviceOnline() {
    return this.isOnline;
  }

  // Get pending notifications count
  getPendingNotificationsCount() {
    const pendingNotifications = JSON.parse(localStorage.getItem('pendingNotifications') || '[]');
    return pendingNotifications.length;
  }

  // Clear all pending notifications
  clearPendingNotifications() {
    localStorage.removeItem('pendingNotifications');
  }
}

// Create global instance
const notificationService = new NotificationService();

export default notificationService;
