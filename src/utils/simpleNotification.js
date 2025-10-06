// Simple and effective notification system
class SimpleNotification {
  constructor() {
    this.setupNotificationPermission();
    this.setupStorageListener();
  }

  // Request notification permission
  async setupNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  }

  // Listen for storage changes (cross-device sync)
  setupStorageListener() {
    window.addEventListener('storage', (event) => {
      if (event.key === 'orders' && event.newValue) {
        this.handleNewOrders(event.newValue);
      }
    });

    // Also listen for custom events
    window.addEventListener('newOrderAdded', (event) => {
      this.handleNewOrder(event.detail);
    });
  }

  // Handle new orders from storage
  handleNewOrders(ordersData) {
    try {
      const orders = JSON.parse(ordersData);
      if (orders.length > 0) {
        const latestOrder = orders[orders.length - 1];
        this.showOrderNotification(latestOrder);
        this.sendEmailNotification(latestOrder);
      }
    } catch (error) {
      console.error('Error parsing orders:', error);
    }
  }

  // Handle new order from custom event
  handleNewOrder(orderData) {
    // Only show notifications if admin is logged in
    const isAdminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    if (isAdminLoggedIn) {
      this.showOrderNotification(orderData);
    }
    this.sendEmailNotification(orderData);
  }

  // Show visual notification
  showOrderNotification(orderData) {
    const customerName = orderData.customer?.fullName || orderData.customerData?.fullName || 'عميل جديد';
    const orderTotal = orderData.total || orderData.finalTotal || 0;
    const orderId = orderData.id;

    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'order-notification';
    notification.innerHTML = `
      <div class="notification-content">
        <div class="notification-icon">🛍️</div>
        <div class="notification-text">
          <div class="notification-title">طلب جديد!</div>
          <div class="notification-details">
            ${customerName} - ${orderTotal} جنيه
          </div>
          <div class="notification-id">رقم الطلب: ${orderId}</div>
        </div>
        <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;

    // Add styles
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #e1306c, #ff6b6b);
      color: white;
      padding: 20px;
      border-radius: 15px;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
      z-index: 10000;
      max-width: 350px;
      animation: slideInRight 0.5s ease;
      font-family: Arial, sans-serif;
    `;

    // Add animation styles
    if (!document.getElementById('notification-styles')) {
      const style = document.createElement('style');
      style.id = 'notification-styles';
      style.textContent = `
        @keyframes slideInRight {
          from { 
            transform: translateX(100%); 
            opacity: 0; 
          }
          to { 
            transform: translateX(0); 
            opacity: 1; 
          }
        }
        .notification-content {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .notification-icon {
          font-size: 24px;
        }
        .notification-text {
          flex: 1;
        }
        .notification-title {
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 5px;
        }
        .notification-details {
          font-size: 14px;
          opacity: 0.9;
          margin-bottom: 3px;
        }
        .notification-id {
          font-size: 12px;
          opacity: 0.8;
        }
        .notification-close {
          background: none;
          border: none;
          color: white;
          font-size: 20px;
          cursor: pointer;
          padding: 5px;
          border-radius: 50%;
          transition: background 0.3s;
        }
        .notification-close:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `;
      document.head.appendChild(style);
    }

    // Add to page
    document.body.appendChild(notification);

    // Auto remove after 8 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.style.animation = 'slideInRight 0.5s ease reverse';
        setTimeout(() => notification.remove(), 500);
      }
    }, 8000);

    // Play sound notification
    this.playNotificationSound();
  }

  // Play notification sound
  playNotificationSound() {
    try {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7blmGgU5k9n1unEiBjuBzvLZiTYIG2m98OScTgwOUarm7');
      audio.volume = 0.3;
      audio.play().catch(() => {
        // Ignore audio play errors
      });
    } catch (error) {
      // Ignore audio errors
    }
  }

  // Send email notification
  async sendEmailNotification(orderData) {
    try {
      const { sendNewOrderNotification } = await import('./simpleEmailService');
      const result = await sendNewOrderNotification(orderData);
      
      if (result.success) {
        console.log('✅ Email notification sent successfully via', result.method);
      } else {
        console.error('❌ Failed to send email notification:', result.error);
      }
    } catch (error) {
      console.error('❌ Error sending email notification:', error);
    }
  }

  // Show browser notification
  showBrowserNotification(orderData) {
    if (Notification.permission === 'granted') {
      const customerName = orderData.customer?.fullName || orderData.customerData?.fullName || 'عميل جديد';
      const orderTotal = orderData.total || orderData.finalTotal || 0;
      
      new Notification('🛍️ طلب جديد!', {
        body: `${customerName} - ${orderTotal} جنيه`,
        icon: '/favicon.ico',
        tag: 'new-order'
      });
    }
  }

  // Trigger new order event
  triggerNewOrderEvent(orderData) {
    window.dispatchEvent(new CustomEvent('newOrderAdded', {
      detail: orderData
    }));
  }
}

// Create global instance
const simpleNotification = new SimpleNotification();

export default simpleNotification;
