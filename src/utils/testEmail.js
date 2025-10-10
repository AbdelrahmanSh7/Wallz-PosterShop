// Test email functionality
import emailjs from '@emailjs/browser';
import { emailConfig } from '../config/emailConfig';

export const sendTestEmail = async () => {
  try {
    console.log('🧪 Sending test email...');
    
    const templateParams = {
      to_email: emailConfig.adminEmail,
      order_id: 'TEST-' + Date.now(),
      customer_name: 'Test Customer',
      customer_email: 'test@example.com',
      customer_phone: '+20 1112659808',
      customer_governorate: 'Cairo',
      customer_address: 'Test Address',
      order_date: new Date().toLocaleDateString('en-GB'),
      order_status: 'pending',
      total_price: 500,
      items: 'Test Product x1',
      items_count: 1,
      site_url: window.location.origin
    };

    const response = await emailjs.send(
      emailConfig.serviceId,
      emailConfig.templates.newOrder,
      templateParams
    );

    console.log('✅ Test email sent successfully:', response);
    alert('Test email sent successfully! Check your inbox.');
    return { success: true, response };
  } catch (error) {
    console.error('❌ Test email failed:', error);
    alert('Test email failed: ' + error.message);
    return { success: false, error };
  }
};

// Add test button to admin panel (for testing)
export const addTestEmailButton = () => {
  const testButton = document.createElement('button');
  testButton.innerHTML = '🧪 Test Email';
  testButton.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    z-index: 9999;
    padding: 10px 15px;
    background: #ff6b6b;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
  `;
  
  testButton.onclick = sendTestEmail;
  document.body.appendChild(testButton);
  
  return testButton;
};
