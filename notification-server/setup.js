#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up Wallz Notification Server...\n');

// Check if config.js exists
const configPath = path.join(__dirname, 'config.js');
const exampleConfigPath = path.join(__dirname, 'config.example.js');

if (!fs.existsSync(configPath)) {
  console.log('📝 Creating config.js from template...');
  fs.copyFileSync(exampleConfigPath, configPath);
  console.log('✅ config.js created!');
} else {
  console.log('⚠️  config.js already exists, skipping...');
}

// Generate VAPID keys
console.log('\n🔑 Generating VAPID keys...');
try {
  const vapidKeys = execSync('npx web-push generate-vapid-keys', { encoding: 'utf8' });
  console.log('✅ VAPID keys generated:');
  console.log(vapidKeys);
  
  // Extract keys from output
  const publicKeyMatch = vapidKeys.match(/Public Key:\s*(.+)/);
  const privateKeyMatch = vapidKeys.match(/Private Key:\s*(.+)/);
  
  if (publicKeyMatch && privateKeyMatch) {
    const publicKey = publicKeyMatch[1].trim();
    const privateKey = privateKeyMatch[1].trim();
    
    console.log('\n📋 Copy these keys to your config.js:');
    console.log(`Public Key: ${publicKey}`);
    console.log(`Private Key: ${privateKey}`);
    
    // Update config.js with generated keys
    let configContent = fs.readFileSync(configPath, 'utf8');
    configContent = configContent.replace('your-vapid-public-key', publicKey);
    configContent = configContent.replace('your-vapid-private-key', privateKey);
    fs.writeFileSync(configPath, configContent);
    
    console.log('\n✅ VAPID keys added to config.js!');
  }
} catch (error) {
  console.error('❌ Failed to generate VAPID keys:', error.message);
  console.log('💡 You can generate them manually with: npx web-push generate-vapid-keys');
}

console.log('\n📧 Email Setup Instructions:');
console.log('1. Enable 2-Factor Authentication on wallz.egy@gmail.com');
console.log('2. Go to Google Account Settings > Security');
console.log('3. Generate App Password for "Mail"');
console.log('4. Update the EMAIL_PASS in config.js with the generated password');

console.log('\n🌐 Website Setup:');
console.log('1. Update src/services/notificationService.js with the VAPID public key');
console.log('2. Update serverUrl to your deployed server URL (for production)');

console.log('\n🚀 Ready to start!');
console.log('Run: npm start');
console.log('\n📱 Test by:');
console.log('1. Opening the website');
console.log('2. Enabling notifications');
console.log('3. Placing a test order');
console.log('4. Checking your device and email for notifications');


