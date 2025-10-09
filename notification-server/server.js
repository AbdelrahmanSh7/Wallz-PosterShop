const express = require('express');
const webpush = require('web-push');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// VAPID Keys (Generate new ones for production)
const vapidKeys = {
  publicKey: "BEl62iUYgUivxIkv69yViEuiBIa40HI1oOQYJN6QYJN6QYJN6QYJN6QYJN6QYJN6QYJN6QYJN6QYJN6QYJN6Q",
  privateKey: "your-private-key-here"
};

webpush.setVapidDetails(
  'mailto:wallz.egy@gmail.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

// Email configuration
const emailTransporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: 'wallz.egy@gmail.com',
    pass: 'your-app-password-here' // Use App Password, not regular password
  }
});

// Store subscriptions
let subscriptions = [];

// Subscribe endpoint
app.post('/api/subscribe', (req, res) => {
  const subscription = req.body.subscription;
  
  if (subscription && !subscriptions.find(sub => sub.endpoint === subscription.endpoint)) {
    subscriptions.push({
      ...subscription,
      userId: req.body.userId,
      timestamp: new Date().toISOString()
    });
    
    console.log('✅ New subscription added:', subscription.endpoint);
    res.json({ success: true, message: 'Subscription added successfully' });
  } else {
    res.json({ success: false, message: 'Subscription already exists or invalid' });
  }
});

// Send notification endpoint
app.post('/api/send-notification', async (req, res) => {
  const { title, body, data, type } = req.body;
  
  if (!title || !body) {
    return res.status(400).json({ 
      success: false, 
      error: 'Title and body are required' 
    });
  }

  const notificationPayload = {
    title: title,
    body: body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      url: data?.url || '/',
      orderId: data?.orderId || null,
      timestamp: Date.now(),
      type: type || 'general',
      ...data
    },
    actions: [
      {
        action: 'view',
        title: 'View Details',
        icon: '/icons/view-icon.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/icons/dismiss-icon.png'
      }
    ]
  };

  try {
    // Send push notifications
    const pushPromises = subscriptions.map(async (subscription) => {
      try {
        await webpush.sendNotification(
          subscription,
          JSON.stringify(notificationPayload)
        );
        console.log('✅ Push notification sent to:', subscription.endpoint);
        return { success: true, endpoint: subscription.endpoint };
      } catch (error) {
        console.error('❌ Failed to send push notification:', error);
        // Remove invalid subscriptions
        if (error.statusCode === 410 || error.statusCode === 404) {
          subscriptions = subscriptions.filter(sub => sub.endpoint !== subscription.endpoint);
        }
        return { success: false, endpoint: subscription.endpoint, error: error.message };
      }
    });

    const pushResults = await Promise.all(pushPromises);
    const successfulPushes = pushResults.filter(result => result.success).length;

    // Send email notification
    let emailResult = { success: false };
    try {
      const emailOptions = {
        from: 'wallz.egy@gmail.com',
        to: 'wallz.egy@gmail.com',
        subject: `🔔 ${title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 24px;">🔔 Wallz Notification</h1>
            </div>
            <div style="padding: 30px; background: #f8f9fa;">
              <h2 style="color: #333; margin-bottom: 20px;">${title}</h2>
              <p style="color: #666; font-size: 16px; line-height: 1.6;">${body}</p>
              
              ${data?.orderId ? `
                <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
                  <h3 style="color: #333; margin-top: 0;">Order Details</h3>
                  <p><strong>Order ID:</strong> ${data.orderId}</p>
                  ${data.url ? `<p><strong>View Order:</strong> <a href="${data.url}" style="color: #667eea;">Click here</a></p>` : ''}
                </div>
              ` : ''}
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="color: #666; font-size: 14px; margin: 0;">
                  <strong>Time:</strong> ${new Date().toLocaleString('ar-EG', { 
                    timeZone: 'Africa/Cairo',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}<br>
                  <strong>Type:</strong> ${type || 'General'}
                </p>
              </div>
            </div>
            <div style="background: #333; padding: 20px; text-align: center; color: white;">
              <p style="margin: 0; font-size: 14px;">Wallz - Premium Posters Store</p>
            </div>
          </div>
        `
      };

      await emailTransporter.sendMail(emailOptions);
      emailResult = { success: true };
      console.log('✅ Email notification sent successfully');
    } catch (emailError) {
      console.error('❌ Failed to send email notification:', emailError);
      emailResult = { success: false, error: emailError.message };
    }

    res.json({
      success: true,
      message: 'Notifications sent successfully',
      results: {
        pushNotifications: {
          total: subscriptions.length,
          successful: successfulPushes,
          failed: subscriptions.length - successfulPushes
        },
        email: emailResult
      }
    });

  } catch (error) {
    console.error('❌ Error sending notifications:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send notifications',
      details: error.message
    });
  }
});

// Send order notification specifically
app.post('/api/send-order-notification', async (req, res) => {
  const { order, type = 'new_order' } = req.body;
  
  if (!order) {
    return res.status(400).json({ 
      success: false, 
      error: 'Order data is required' 
    });
  }

  const title = type === 'new_order' ? '🛒 New Order Received!' : '📦 Order Status Updated';
  const body = type === 'new_order' 
    ? `Order #${order.id} from ${order.customer?.fullName || 'Customer'} - ${order.total || 0} EGP`
    : `Order #${order.id} status changed to ${order.status || 'Updated'}`;

  const data = {
    orderId: order.id,
    url: '/admin/orders',
    type: type,
    order: order
  };

  // Forward to general notification endpoint
  req.body = { title, body, data, type };
  return app._router.handle(req, res);
});

// Get subscription count
app.get('/api/subscriptions/count', (req, res) => {
  res.json({
    success: true,
    count: subscriptions.length,
    subscriptions: subscriptions.map(sub => ({
      userId: sub.userId,
      timestamp: sub.timestamp,
      endpoint: sub.endpoint.substring(0, 50) + '...'
    }))
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Notification server is running',
    timestamp: new Date().toISOString(),
    subscriptions: subscriptions.length
  });
});

// Serve VAPID public key
app.get('/api/vapid-public-key', (req, res) => {
  res.json({
    success: true,
    publicKey: vapidKeys.publicKey
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Notification server running on port ${PORT}`);
  console.log(`📱 VAPID Public Key: ${vapidKeys.publicKey}`);
  console.log(`📧 Email notifications to: wallz.egy@gmail.com`);
});
