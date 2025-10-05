# 📧 Email Notifications Setup Guide

## Overview
This system automatically sends email notifications to `wallz.egy@gmail.com` when:
- A new order is placed
- Order status is updated
- Daily summary reports (optional)

## 🔧 Setup Instructions

### 1. Create EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

### 2. Create Email Service
1. In your EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail recommended)
4. Follow the setup instructions
5. **Save your Service ID** (e.g., `service_abc123`)

### 3. Create Email Templates
Create the following templates in your EmailJS dashboard:

#### Template 1: New Order Notification
- **Template ID**: `template_new_order`
- **Subject**: `🛍️ New Order #{{order_id}} - {{customer_name}}`
- **Content**:
```
New Order Received!

Order Details:
- Order ID: {{order_id}}
- Customer: {{customer_name}}
- Phone: {{customer_phone}}
- Governorate: {{customer_governorate}}
- Address: {{customer_address}}
- Date: {{order_date}}
- Status: {{order_status}}

Order Summary:
- Items Count: {{items_count}}
- Subtotal: {{order_subtotal}} EGP
- Shipping: {{order_shipping}} EGP
- Total: {{order_total}} EGP

Items Details:
{{items_details}}

View in Admin Panel: {{site_url}}/admin/orders
```

#### Template 2: Status Update Notification
- **Template ID**: `template_status_update`
- **Subject**: `📋 Order #{{order_id}} Status Updated`
- **Content**:
```
Order Status Updated!

Order Details:
- Order ID: {{order_id}}
- Customer: {{customer_name}}
- Date: {{order_date}}
- Status Changed: {{old_status}} → {{new_status}}

View in Admin Panel: {{site_url}}/admin/orders
```

#### Template 3: Daily Summary (Optional)
- **Template ID**: `template_daily_summary`
- **Subject**: `📊 Daily Orders Summary - {{date}}`
- **Content**:
```
Daily Orders Summary

Date: {{date}}
Total Orders: {{total_orders}}
Total Revenue: {{total_revenue}} EGP
Pending Orders: {{pending_orders}}
Confirmed Orders: {{confirmed_orders}}

View in Admin Panel: {{site_url}}/admin/orders
```

### 4. Get Your Public Key
1. In your EmailJS dashboard, go to "Account" → "General"
2. Copy your "Public Key" (e.g., `user_abc123def456`)
3. **Save this key**

### 5. Update Configuration
1. Open `src/config/emailConfig.js`
2. Replace the following values with your actual credentials:

```javascript
export const EMAILJS_CONFIG = {
  SERVICE_ID: 'your_service_id_here',        // From step 2
  PUBLIC_KEY: 'your_public_key_here',       // From step 4
  ADMIN_EMAIL: 'wallz.egy@gmail.com',       // Already set
  TEMPLATES: {
    NEW_ORDER: 'template_new_order',        // From step 3
    STATUS_UPDATE: 'template_status_update', // From step 3
    DAILY_SUMMARY: 'template_daily_summary'  // From step 3
  }
};
```

### 6. Test the System
1. Start your development server: `npm start`
2. Place a test order
3. Check your email (`wallz.egy@gmail.com`) for the notification
4. Check the browser console for any error messages

## 🚨 Troubleshooting

### Common Issues:

1. **"Service not found" error**
   - Check your Service ID in `emailConfig.js`
   - Make sure the service is active in EmailJS dashboard

2. **"Template not found" error**
   - Check your Template IDs in `emailConfig.js`
   - Make sure templates are published in EmailJS dashboard

3. **"Invalid public key" error**
   - Check your Public Key in `emailConfig.js`
   - Make sure the key is correct and active

4. **Emails not being sent**
   - Check browser console for error messages
   - Verify all template variables are correct
   - Check EmailJS dashboard for usage limits

### Debug Mode:
To see detailed error messages, check the browser console when placing orders or updating status.

## 📧 Email Limits
- **Free Plan**: 200 emails/month
- **Paid Plans**: Higher limits available
- Monitor usage in your EmailJS dashboard

## 🔒 Security Notes
- Never commit your actual EmailJS credentials to version control
- Use environment variables for production
- Consider using a separate email service for production

## 📱 Features Included
- ✅ New order notifications
- ✅ Status update notifications  
- ✅ Daily summary reports
- ✅ Error handling and logging
- ✅ Automatic email sending
- ✅ Template-based email formatting

## 🎯 Next Steps
1. Set up your EmailJS account
2. Create the email templates
3. Update the configuration file
4. Test with a real order
5. Monitor email delivery

For any issues, check the browser console and EmailJS dashboard for error messages.
