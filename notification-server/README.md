# Wallz Notification Server

This server handles real device notifications (Desktop/Mobile) and email notifications for the Wallz application.

## Features

- 🔔 **Real Push Notifications** - Works even when app is closed
- 📧 **Email Notifications** - Sent to wallz.egy@gmail.com
- 🔊 **Device Sounds** - Uses system notification sounds
- 📱 **Cross-Platform** - Works on Desktop, Android, iOS

## Setup Instructions

### 1. Install Dependencies

```bash
cd notification-server
npm install
```

### 2. Generate VAPID Keys

```bash
npm run generate-vapid
```

Copy the generated keys to your config.

### 3. Set up Gmail App Password

1. **Enable 2-Factor Authentication** on your Gmail account
2. Go to **Google Account Settings > Security**
3. Generate **App Password** for "Mail"
4. Use the generated password (NOT your regular password)

### 4. Configure Server

1. Copy `config.example.js` to `config.js`
2. Update the configuration with your values:

```javascript
module.exports = {
  email: {
    user: 'wallz.egy@gmail.com',
    pass: 'your-generated-app-password',
    to: 'wallz.egy@gmail.com'
  },
  vapid: {
    publicKey: 'your-vapid-public-key',
    privateKey: 'your-vapid-private-key',
    subject: 'mailto:wallz.egy@gmail.com'
  }
};
```

### 5. Update Website VAPID Key

Update `src/services/notificationService.js` with the same VAPID public key:

```javascript
this.vapidPublicKey = 'your-vapid-public-key';
```

### 6. Start the Server

```bash
npm start
```

The server will run on `http://localhost:3001`

## API Endpoints

### Subscribe to Notifications
```
POST /api/subscribe
```

### Send General Notification
```
POST /api/send-notification
```

### Send Order Notification
```
POST /api/send-order-notification
```

### Health Check
```
GET /api/health
```

## Testing

1. **Start the notification server**
2. **Open the website**
3. **Enable notifications** in the browser
4. **Place a test order**
5. **Check for notifications** on your device and email

## Production Deployment

For production, deploy this server to a service like:
- **Heroku**
- **Railway**
- **DigitalOcean**
- **AWS**

Update the `serverUrl` in `notificationService.js` to point to your deployed server.

## Troubleshooting

### Notifications not working?
1. Check browser notification permissions
2. Verify VAPID keys match between server and client
3. Check server logs for errors
4. Ensure HTTPS in production (required for push notifications)

### Email not sending?
1. Verify Gmail App Password is correct
2. Check 2-Factor Authentication is enabled
3. Check server logs for email errors

## Security Notes

- Never commit real VAPID keys or passwords to Git
- Use environment variables in production
- Enable HTTPS for production deployment
- Regularly rotate VAPID keys


