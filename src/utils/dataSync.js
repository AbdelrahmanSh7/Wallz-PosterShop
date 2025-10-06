// Data synchronization between devices using BroadcastChannel
class DataSync {
  constructor() {
    this.channel = new BroadcastChannel('wallsy-orders-sync');
    this.setupListeners();
  }

  setupListeners() {
    // Listen for data changes from other tabs/devices
    this.channel.addEventListener('message', (event) => {
      const { type, data } = event.data;
      
      switch (type) {
        case 'NEW_ORDER':
          this.handleNewOrder(data);
          break;
        case 'ORDER_UPDATE':
          this.handleOrderUpdate(data);
          break;
        case 'ORDER_DELETE':
          this.handleOrderDelete(data);
          break;
        case 'REFRESH_ORDERS':
          this.handleRefreshOrders();
          break;
        default:
          console.log('Unknown message type:', type);
          break;
      }
    });

    // Listen for storage changes (localStorage)
    window.addEventListener('storage', (event) => {
      if (event.key === 'orders' && event.newValue) {
        this.handleStorageChange(event.newValue);
      }
    });
  }

  // Handle new order from other devices
  handleNewOrder(orderData) {
    console.log('New order received from another device:', orderData);
    
    // Update local storage
    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const orderExists = existingOrders.some(order => order.id === orderData.id);
    
    if (!orderExists) {
      existingOrders.push(orderData);
      localStorage.setItem('orders', JSON.stringify(existingOrders));
      
      // Trigger custom event for components to update
      window.dispatchEvent(new CustomEvent('ordersUpdated', {
        detail: { type: 'NEW_ORDER', order: orderData }
      }));
      
      // Show notification to admin
      this.showOrderNotification(orderData);
    }
  }

  // Handle order update from other devices
  handleOrderUpdate(updatedOrder) {
    console.log('Order update received from another device:', updatedOrder);
    
    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const updatedOrders = existingOrders.map(order => 
      order.id === updatedOrder.id ? updatedOrder : order
    );
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    
    // Trigger custom event for components to update
    window.dispatchEvent(new CustomEvent('ordersUpdated', {
      detail: { type: 'ORDER_UPDATE', order: updatedOrder }
    }));
  }

  // Handle order deletion from other devices
  handleOrderDelete(orderId) {
    console.log('Order deletion received from another device:', orderId);
    
    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const filteredOrders = existingOrders.filter(order => order.id !== orderId);
    localStorage.setItem('orders', JSON.stringify(filteredOrders));
    
    // Trigger custom event for components to update
    window.dispatchEvent(new CustomEvent('ordersUpdated', {
      detail: { type: 'ORDER_DELETE', orderId }
    }));
  }

  // Handle refresh request
  handleRefreshOrders() {
    console.log('Refresh orders requested from another device');
    
    // Trigger custom event for components to refresh
    window.dispatchEvent(new CustomEvent('ordersUpdated', {
      detail: { type: 'REFRESH' }
    }));
  }

  // Handle localStorage changes
  handleStorageChange(newValue) {
    try {
      const orders = JSON.parse(newValue);
      console.log('Orders updated in localStorage:', orders);
      
      // Trigger custom event for components to update
      window.dispatchEvent(new CustomEvent('ordersUpdated', {
        detail: { type: 'STORAGE_CHANGE', orders }
      }));
    } catch (error) {
      console.error('Error parsing orders from storage:', error);
    }
  }

  // Broadcast new order to other devices
  broadcastNewOrder(orderData) {
    this.channel.postMessage({
      type: 'NEW_ORDER',
      data: orderData,
      timestamp: Date.now()
    });
  }

  // Broadcast order update to other devices
  broadcastOrderUpdate(updatedOrder) {
    this.channel.postMessage({
      type: 'ORDER_UPDATE',
      data: updatedOrder,
      timestamp: Date.now()
    });
  }

  // Broadcast order deletion to other devices
  broadcastOrderDelete(orderId) {
    this.channel.postMessage({
      type: 'ORDER_DELETE',
      data: orderId,
      timestamp: Date.now()
    });
  }

  // Request refresh from other devices
  requestRefresh() {
    this.channel.postMessage({
      type: 'REFRESH_ORDERS',
      timestamp: Date.now()
    });
  }

  // Show notification for new order
  showOrderNotification(orderData) {
    // Check if user is admin
    const isAdmin = localStorage.getItem('adminLoggedIn') === 'true';
    
    if (isAdmin) {
      const customerName = orderData.customer?.fullName || orderData.customerData?.fullName || 'Unknown';
      const orderTotal = orderData.total || orderData.finalTotal || 0;
      
      // Show browser notification if permission granted
      if (Notification.permission === 'granted') {
        new Notification('🛍️ New Order Received!', {
          body: `Order from ${customerName} - ${orderTotal} EGP`,
          icon: '/favicon.ico',
          tag: 'new-order'
        });
      }
      
      // Show in-page notification
      this.showInPageNotification(`New order from ${customerName} - ${orderTotal} EGP`);
    }
  }

  // Show in-page notification
  showInPageNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'order-notification';
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-icon">🛍️</span>
        <span class="notification-message">${message}</span>
        <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;
    
    // Add styles
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #2c2c2c, #404040);
      color: white;
      padding: 15px 20px;
      border-radius: 10px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
      z-index: 10000;
      animation: slideIn 0.3s ease;
      max-width: 300px;
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
        margin-left: auto;
      }
    `;
    document.head.appendChild(style);
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 5000);
  }

  // Request notification permission
  async requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return Notification.permission === 'granted';
  }

  // Cleanup
  destroy() {
    this.channel.close();
  }
}

// Create global instance
const dataSync = new DataSync();

export default dataSync;
