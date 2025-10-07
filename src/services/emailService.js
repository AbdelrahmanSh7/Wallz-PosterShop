import emailjs from '@emailjs/browser';
import emailConfig from '../config/emailConfig';

class EmailService {
  constructor() {
    // EmailJS configuration
    this.serviceId = emailConfig.serviceId;
    this.templateId = emailConfig.templates.newOrder;
    this.publicKey = emailConfig.publicKey;
    this.adminEmail = emailConfig.adminEmail;
    this.settings = emailConfig.settings;
  }

  // Initialize EmailJS
  init() {
    try {
      emailjs.init(this.publicKey);
      console.log('📧 EmailJS initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ EmailJS initialization failed:', error);
      return false;
    }
  }

  // Send new order notification email with retry mechanism
  async sendNewOrderEmail(orderData) {
    return await this.sendEmailWithRetry(
      () => this.sendNewOrderEmailInternal(orderData),
      'new order notification'
    );
  }

  // Internal method to send new order email
  async sendNewOrderEmailInternal(orderData) {
    try {
      console.log('📧 Sending new order email...');
      
      // Prepare email template parameters
      const templateParams = {
        to_email: this.adminEmail,
        to_name: 'WallZ Admin',
        order_id: orderData.id,
        customer_name: `${orderData.customer?.fullName || orderData.customerData?.fullName || 'Unknown'} ${orderData.customer?.lastName || orderData.customerData?.lastName || ''}`,
        customer_phone1: orderData.customer?.phone1 || orderData.customerData?.phone1 || 'N/A',
        customer_phone2: orderData.customer?.phone2 || orderData.customerData?.phone2 || 'N/A',
        customer_address: orderData.customer?.address || orderData.customerData?.address || 'N/A',
        customer_governorate: orderData.customer?.governorate || orderData.customerData?.governorate || 'N/A',
        order_date: new Date(orderData.date || orderData.orderDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        total_amount: orderData.total,
        items_count: orderData.items?.length || 0,
        items_list: this.formatItemsList(orderData.items || []),
        order_status: orderData.status || 'pending'
      };

      // Send email using EmailJS
      const response = await emailjs.send(
        this.serviceId,
        this.templateId,
        templateParams
      );

      console.log('✅ New order email sent successfully:', response);
      return { success: true, response };
    } catch (error) {
      console.error('❌ Failed to send new order email:', error);
      throw error;
    }
  }

  // Format items list for email
  formatItemsList(items) {
    if (!items || items.length === 0) return 'No items';
    
    return items.map(item => {
      const name = item.name || item.title || 'Unknown Item';
      const quantity = item.quantity || 1;
      const price = item.price || 0;
      return `${name} (Qty: ${quantity}) - ${price} EGP`;
    }).join('\n');
  }

  // Send order status update email
  async sendOrderStatusUpdateEmail(orderData, newStatus) {
    try {
      console.log('📧 Sending order status update email...');
      
      const templateParams = {
        to_email: this.adminEmail,
        to_name: 'WallZ Admin',
        order_id: orderData.id,
        customer_name: `${orderData.customer?.fullName || orderData.customerData?.fullName || 'Unknown'} ${orderData.customer?.lastName || orderData.customerData?.lastName || ''}`,
        old_status: orderData.status || 'pending',
        new_status: newStatus,
        order_date: new Date(orderData.date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        total_amount: orderData.total
      };

      const response = await emailjs.send(
        this.serviceId,
        'template_status_update', // Different template for status updates
        templateParams
      );

      console.log('✅ Order status update email sent successfully:', response);
      return { success: true, response };
    } catch (error) {
      console.error('❌ Failed to send order status update email:', error);
      return { success: false, error: error.message };
    }
  }

  // Send email with retry mechanism
  async sendEmailWithRetry(emailFunction, emailType) {
    let lastError;
    
    for (let attempt = 1; attempt <= this.settings.retryAttempts; attempt++) {
      try {
        console.log(`📧 Attempting to send ${emailType} (attempt ${attempt}/${this.settings.retryAttempts})`);
        const result = await emailFunction();
        console.log(`✅ ${emailType} sent successfully on attempt ${attempt}`);
        return result;
      } catch (error) {
        lastError = error;
        console.error(`❌ ${emailType} failed on attempt ${attempt}:`, error.message);
        
        if (attempt < this.settings.retryAttempts) {
          console.log(`⏳ Waiting ${this.settings.retryDelay}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, this.settings.retryDelay));
        }
      }
    }
    
    console.error(`❌ ${emailType} failed after ${this.settings.retryAttempts} attempts`);
    return { success: false, error: lastError.message };
  }

  // Test email functionality
  async testEmail() {
    try {
      console.log('🧪 Testing email functionality...');
      
      const testOrder = {
        id: 'TEST_' + Date.now(),
        customer: {
          fullName: 'Test Customer',
          lastName: 'Test',
          phone1: '01234567890',
          phone2: '01234567891',
          address: 'Test Address',
          governorate: 'Cairo'
        },
        total: 100,
        items: [
          { name: 'Test Item 1', quantity: 1, price: 50 },
          { name: 'Test Item 2', quantity: 2, price: 25 }
        ],
        date: new Date().toISOString(),
        status: 'pending'
      };

      const result = await this.sendNewOrderEmail(testOrder);
      return result;
    } catch (error) {
      console.error('❌ Email test failed:', error);
      return { success: false, error: error.message };
    }
  }
}

// Create and export a singleton instance
const emailService = new EmailService();
export default emailService;
