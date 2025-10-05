// EmailJS Configuration
// You need to set up EmailJS account and get these values from your dashboard

export const EMAILJS_CONFIG = {
  // Replace with your actual EmailJS service ID
  SERVICE_ID: 'service_wallz_orders',
  
  // Replace with your actual EmailJS public key
  PUBLIC_KEY: 'YOUR_EMAILJS_PUBLIC_KEY',
  
  // Email templates
  TEMPLATES: {
    NEW_ORDER: 'template_new_order',
    STATUS_UPDATE: 'template_status_update',
    DAILY_SUMMARY: 'template_daily_summary'
  },
  
  // Admin email
  ADMIN_EMAIL: 'wallz.egy@gmail.com'
};

// Instructions for setting up EmailJS:
/*
1. Go to https://www.emailjs.com/
2. Create a free account
3. Create a new service (Gmail, Outlook, etc.)
4. Create email templates with the following variables:
   
   For NEW_ORDER template:
   - {{to_email}}
   - {{order_id}}
   - {{customer_name}}
   - {{customer_phone}}
   - {{customer_governorate}}
   - {{customer_address}}
   - {{order_date}}
   - {{order_status}}
   - {{order_total}}
   - {{order_subtotal}}
   - {{order_shipping}}
   - {{items_count}}
   - {{items_details}}
   - {{site_url}}
   
   For STATUS_UPDATE template:
   - {{to_email}}
   - {{order_id}}
   - {{customer_name}}
   - {{old_status}}
   - {{new_status}}
   - {{order_date}}
   - {{site_url}}
   
   For DAILY_SUMMARY template:
   - {{to_email}}
   - {{date}}
   - {{total_orders}}
   - {{total_revenue}}
   - {{pending_orders}}
   - {{confirmed_orders}}
   - {{site_url}}

5. Get your Service ID and Public Key from the dashboard
6. Replace the values above with your actual credentials
7. Test the email functionality
*/
