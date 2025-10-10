// EmailJS Configuration for WallZ
// You need to set up EmailJS account and get these values

export const emailConfig = {
  // EmailJS Service Configuration
  serviceId: 'service_wallz', // Your EmailJS service ID
  publicKey: 'YOUR_PUBLIC_KEY', // Your EmailJS public key (get from EmailJS dashboard)
  
  // Email Templates
  templates: {
    newOrder: 'template_new_order', // Template for new order notifications
    statusUpdate: 'template_status_update' // Template for status updates
  },
  
  // Admin Email
  adminEmail: 'wallz.egy@gmail.com',
  
  // Email Settings
  settings: {
    autoSend: true, // Automatically send emails
    retryAttempts: 3, // Number of retry attempts if email fails
    retryDelay: 2000 // Delay between retry attempts (ms)
  }
};

// Temporary email service using Gmail SMTP (for testing)
export const gmailConfig = {
  service: 'gmail',
  auth: {
    user: 'wallz.egy@gmail.com',
    pass: 'your-app-password' // Use App Password from Google Account
  }
};

// Instructions for setting up EmailJS:
/*
1. Go to https://www.emailjs.com/
2. Create a free account
3. Create a new service (Gmail, Outlook, etc.)
4. Create email templates:
   - template_new_order: For new order notifications
   - template_status_update: For status update notifications
5. Get your Service ID and Public Key
6. Replace the values above with your actual values
7. Test the email functionality
*/

export default emailConfig;