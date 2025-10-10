// Configuration file for Wallz Notification Server
module.exports = {
  // Email Configuration
  email: {
    user: 'wallz.egy@gmail.com',
    pass: 'your-app-password-here', // Use Gmail App Password
    to: 'wallz.egy@gmail.com'
  },

  // VAPID Keys (Generate new ones for production)
  vapid: {
    publicKey: 'your-vapid-public-key',
    privateKey: 'your-vapid-private-key',
    subject: 'mailto:wallz.egy@gmail.com'
  },

  // Server Configuration
  server: {
    port: 3001,
    environment: 'development'
  },

  // Instructions:
  // 1. Copy this file to config.js
  // 2. Generate VAPID keys: npm run generate-vapid
  // 3. Set up Gmail App Password:
  //    - Enable 2-Factor Authentication
  //    - Go to Google Account > Security
  //    - Generate App Password for "Mail"
  //    - Use the generated password (not regular password)
  // 4. Update the values above
};


