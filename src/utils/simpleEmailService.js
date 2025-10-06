// Simple Email Service - Fallback when EmailJS is not configured
// This will show email content in console and can be extended to use other email services

/**
 * Send new order notification
 * @param {Object} orderData - The order data
 */
export const sendNewOrderNotification = async (orderData) => {
  try {
    console.log('📧 NEW ORDER EMAIL NOTIFICATION');
    console.log('=====================================');
    console.log('To: wallz.egy@gmail.com');
    console.log('Subject: 🛒 New Order Received - Order #' + orderData.id);
    console.log('');
    console.log('Order Details:');
    console.log('==============');
    console.log('Order ID:', orderData.id);
    console.log('Customer Name:', orderData.customer?.fullName || orderData.customerData?.fullName || 'N/A');
    console.log('Phone:', orderData.customer?.phone1 || orderData.customerData?.phone1 || 'N/A');
    console.log('Governorate:', orderData.customer?.governorate || orderData.customerData?.governorate || 'N/A');
    console.log('Address:', orderData.customer?.address || orderData.customerData?.address || 'N/A');
    console.log('Order Date:', new Date(orderData.date || orderData.orderDate).toLocaleString());
    console.log('Status:', orderData.status || 'pending');
    console.log('Total Amount:', orderData.total || orderData.finalTotal || 0, 'EGP');
    console.log('Subtotal:', orderData.subtotal || 0, 'EGP');
    console.log('Shipping:', orderData.shipping || orderData.shippingCost || 0, 'EGP');
    console.log('');
    console.log('Items:');
    console.log('======');
    if (orderData.items && orderData.items.length > 0) {
      orderData.items.forEach((item, index) => {
        console.log(`${index + 1}. ${item.name}`);
        console.log(`   Size: ${item.size}`);
        console.log(`   Color: ${item.color}`);
        console.log(`   Quantity: ${item.quantity}`);
        console.log(`   Price: ${item.price} EGP`);
        console.log(`   Total: ${item.price * item.quantity} EGP`);
        console.log('');
      });
    } else {
      console.log('No items found');
    }
    console.log('=====================================');
    
    // Try to send actual email if EmailJS is configured
    try {
      const { sendNewOrderNotification: emailjsSend } = await import('./emailService');
      const result = await emailjsSend(orderData);
      if (result.success) {
        console.log('✅ Email sent successfully via EmailJS');
        return { success: true, method: 'emailjs' };
      } else {
        console.log('⚠️ EmailJS failed, using console fallback');
      }
    } catch (error) {
      console.log('⚠️ EmailJS not configured, using console fallback');
    }
    
    return { success: true, method: 'console' };
  } catch (error) {
    console.error('❌ Error in email notification:', error);
    return { success: false, error };
  }
};

/**
 * Send order status update notification
 * @param {Object} orderData - The order data
 * @param {String} oldStatus - Previous status
 * @param {String} newStatus - New status
 */
export const sendStatusUpdateNotification = async (orderData, oldStatus, newStatus) => {
  try {
    console.log('📧 ORDER STATUS UPDATE EMAIL');
    console.log('=====================================');
    console.log('To: wallz.egy@gmail.com');
    console.log('Subject: 🔄 Order Status Updated - Order #' + orderData.id);
    console.log('');
    console.log('Order ID:', orderData.id);
    console.log('Customer:', orderData.customer?.fullName || orderData.customerData?.fullName || 'N/A');
    console.log('Status Changed From:', oldStatus);
    console.log('Status Changed To:', newStatus);
    console.log('Date:', new Date().toLocaleString());
    console.log('=====================================');
    
    return { success: true, method: 'console' };
  } catch (error) {
    console.error('❌ Error in status update email:', error);
    return { success: false, error };
  }
};

/**
 * Send daily summary
 * @param {Array} orders - Array of orders
 */
export const sendDailySummary = async (orders) => {
  try {
    const today = new Date().toLocaleDateString();
    const todayOrders = orders.filter(order => 
      new Date(order.date || order.orderDate).toLocaleDateString() === today
    );
    
    console.log('📧 DAILY SUMMARY EMAIL');
    console.log('=====================================');
    console.log('To: wallz.egy@gmail.com');
    console.log('Subject: 📊 Daily Orders Summary - ' + today);
    console.log('');
    console.log('Date:', today);
    console.log('Total Orders:', todayOrders.length);
    console.log('Total Revenue:', todayOrders.reduce((sum, order) => 
      sum + (order.total || order.finalTotal || 0), 0), 'EGP');
    console.log('Pending Orders:', todayOrders.filter(order => order.status === 'pending').length);
    console.log('Confirmed Orders:', todayOrders.filter(order => order.status === 'confirmed').length);
    console.log('=====================================');
    
    return { success: true, method: 'console' };
  } catch (error) {
    console.error('❌ Error in daily summary email:', error);
    return { success: false, error };
  }
};
