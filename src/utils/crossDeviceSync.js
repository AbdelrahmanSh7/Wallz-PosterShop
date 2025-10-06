// Cross-device synchronization system
class CrossDeviceSync {
  constructor() {
    this.syncInterval = null;
    this.lastSyncTime = 0;
    this.syncFrequency = 5000; // 5 seconds
    this.setupSync();
  }

  setupSync() {
    // Start periodic sync
    this.startPeriodicSync();
    
    // Sync on page focus
    window.addEventListener('focus', () => {
      this.forceSync();
    });

    // Sync on visibility change
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.forceSync();
      }
    });

    // Sync when coming back online
    window.addEventListener('online', () => {
      this.forceSync();
    });
  }

  startPeriodicSync() {
    this.syncInterval = setInterval(() => {
      this.syncData();
    }, this.syncFrequency);
  }

  stopPeriodicSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  // Force immediate sync
  forceSync() {
    console.log('Forcing data sync...');
    this.syncData();
  }

  // Sync data between devices
  async syncData() {
    try {
      // Get current orders from localStorage
      const currentOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      
      // Check if we have new orders by comparing timestamps
      const lastSync = localStorage.getItem('lastSyncTime') || '0';
      const currentTime = Date.now();
      
      // If enough time has passed, force refresh
      if (currentTime - parseInt(lastSync) > this.syncFrequency) {
        this.refreshOrders();
        localStorage.setItem('lastSyncTime', currentTime.toString());
      }

      // Trigger custom event for components to update
      window.dispatchEvent(new CustomEvent('crossDeviceSync', {
        detail: { 
          type: 'SYNC_UPDATE', 
          orders: currentOrders,
          timestamp: currentTime
        }
      }));

    } catch (error) {
      console.error('Error during cross-device sync:', error);
    }
  }

  // Refresh orders from localStorage
  refreshOrders() {
    console.log('Refreshing orders from localStorage...');
    
    // Trigger refresh event
    window.dispatchEvent(new CustomEvent('ordersRefresh', {
      detail: { 
        type: 'REFRESH_ORDERS',
        timestamp: Date.now()
      }
    }));
  }

  // Enhanced email notification with retry
  async sendEnhancedNotification(orderData) {
    const maxRetries = 3;
    let retryCount = 0;

    while (retryCount < maxRetries) {
      try {
        const { sendNewOrderNotification } = await import('./emailService');
        const result = await sendNewOrderNotification(orderData);
        
        if (result.success) {
          console.log('Enhanced notification sent successfully');
          return result;
        } else {
          throw new Error(result.error || 'Unknown error');
        }
      } catch (error) {
        retryCount++;
        console.error(`Notification attempt ${retryCount} failed:`, error);
        
        if (retryCount < maxRetries) {
          // Wait before retry
          await this.delay(2000 * retryCount);
        } else {
          console.error('All notification attempts failed');
          // Store for later retry
          this.storeFailedNotification(orderData);
        }
      }
    }
  }

  // Store failed notifications for later retry
  storeFailedNotification(orderData) {
    const failedNotifications = JSON.parse(localStorage.getItem('failedNotifications') || '[]');
    failedNotifications.push({
      ...orderData,
      retryTime: Date.now() + 30000, // Retry in 30 seconds
      attempts: 0
    });
    localStorage.setItem('failedNotifications', JSON.stringify(failedNotifications));
  }

  // Retry failed notifications
  async retryFailedNotifications() {
    const failedNotifications = JSON.parse(localStorage.getItem('failedNotifications') || '[]');
    const currentTime = Date.now();
    
    for (let i = failedNotifications.length - 1; i >= 0; i--) {
      const notification = failedNotifications[i];
      
      if (currentTime >= notification.retryTime) {
        try {
          await this.sendEnhancedNotification(notification);
          failedNotifications.splice(i, 1);
          console.log('Failed notification retried successfully');
        } catch (error) {
          notification.attempts++;
          notification.retryTime = currentTime + (30000 * notification.attempts);
          console.error('Retry failed:', error);
        }
      }
    }
    
    localStorage.setItem('failedNotifications', JSON.stringify(failedNotifications));
  }

  // Utility function for delays
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Get sync status
  getSyncStatus() {
    return {
      isRunning: this.syncInterval !== null,
      frequency: this.syncFrequency,
      lastSync: localStorage.getItem('lastSyncTime') || '0',
      failedNotifications: JSON.parse(localStorage.getItem('failedNotifications') || '[]').length
    };
  }

  // Cleanup
  destroy() {
    this.stopPeriodicSync();
  }
}

// Create global instance
const crossDeviceSync = new CrossDeviceSync();

export default crossDeviceSync;
