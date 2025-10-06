import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from '../config/emailConfig';
import { getGovernorateName } from '../data/governorates';

// Initialize EmailJS
emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);

/**
 * Send new order notification email
 * @param {Object} orderData - The order data to send
 */
export const sendNewOrderNotification = async (orderData) => {
  try {
    // Get governorate name
    const governorateName = orderData.customer?.governorate || orderData.customerData?.governorate || 'غير محدد';
    const governorateDisplayName = getGovernorateName(governorateName);
    
    // Prepare email template parameters
    const templateParams = {
      to_email: EMAILJS_CONFIG.ADMIN_EMAIL,
      order_id: orderData.id,
      customer_name: orderData.customer?.fullName || orderData.customerData?.fullName || 'N/A',
      customer_phone: orderData.customer?.phone1 || orderData.customerData?.phone1 || 'N/A',
      customer_governorate: governorateDisplayName,
      customer_address: orderData.customer?.address || orderData.customerData?.address || 'N/A',
      order_date: new Date(orderData.date || orderData.orderDate).toLocaleDateString('en-GB'),
      order_status: orderData.status || 'pending',
      order_total: orderData.total || orderData.finalTotal || 0,
      order_subtotal: orderData.subtotal || 0,
      order_shipping: orderData.shipping || orderData.shippingCost || 0,
      items_count: orderData.items?.length || 0,
      items_details: formatItemsDetails(orderData.items || []),
      site_url: window.location.origin
    };

    // Send email
    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATES.NEW_ORDER,
      templateParams
    );

    console.log('Email sent successfully:', response);
    return { success: true, response };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
};

/**
 * Format items details for email
 * @param {Array} items - Array of order items
 * @returns {String} Formatted items string
 */
const formatItemsDetails = (items) => {
  if (!items || items.length === 0) return 'No items';
  
  return items.map(item => 
    `${item.name} (${item.size}, ${item.color}) x${item.quantity} = ${item.price * item.quantity} EGP`
  ).join('\n');
};

/**
 * Send order status update notification
 * @param {Object} orderData - The order data
 * @param {String} oldStatus - Previous status
 * @param {String} newStatus - New status
 */
export const sendStatusUpdateNotification = async (orderData, oldStatus, newStatus) => {
  try {
    const templateParams = {
      to_email: EMAILJS_CONFIG.ADMIN_EMAIL,
      order_id: orderData.id,
      customer_name: orderData.customer?.fullName || orderData.customerData?.fullName || 'N/A',
      old_status: oldStatus,
      new_status: newStatus,
      order_date: new Date(orderData.date).toLocaleDateString('en-GB'),
      site_url: window.location.origin
    };

    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATES.STATUS_UPDATE,
      templateParams
    );

    console.log('Status update email sent successfully:', response);
    return { success: true, response };
  } catch (error) {
    console.error('Error sending status update email:', error);
    return { success: false, error };
  }
};

/**
 * Send daily orders summary
 * @param {Array} orders - Array of orders for the day
 */
export const sendDailySummary = async (orders) => {
  try {
    const today = new Date().toLocaleDateString('en-GB');
    const todayOrders = orders.filter(order => 
      new Date(order.date).toLocaleDateString('en-GB') === today
    );

    const templateParams = {
      to_email: EMAILJS_CONFIG.ADMIN_EMAIL,
      date: today,
      total_orders: todayOrders.length,
      total_revenue: todayOrders.reduce((sum, order) => 
        sum + (order.total || order.finalTotal || 0), 0
      ),
      pending_orders: todayOrders.filter(order => order.status === 'pending').length,
      confirmed_orders: todayOrders.filter(order => order.status === 'confirmed').length,
      site_url: window.location.origin
    };

    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATES.DAILY_SUMMARY,
      templateParams
    );

    console.log('Daily summary email sent successfully:', response);
    return { success: true, response };
  } catch (error) {
    console.error('Error sending daily summary email:', error);
    return { success: false, error };
  }
};
