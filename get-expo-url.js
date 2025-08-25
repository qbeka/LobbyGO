// Quick script to help identify the Expo dev server URL for OAuth configuration
const { execSync } = require('child_process');
const os = require('os');

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  
  for (const devName in interfaces) {
    const iface = interfaces[devName];
    
    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i];
      
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address;
      }
    }
  }
  
  return '127.0.0.1';
}

const localIP = getLocalIP();
const port = '8081'; // Default Expo port

console.log('🔧 Expo Go OAuth Configuration URLs');
console.log('=====================================');
console.log('');
console.log('📱 Your Expo dev server IP:', localIP);
console.log('🔗 OAuth redirect URI for Google Cloud Console:');
console.log(`   exp://${localIP}:${port}/--/auth/callback`);
console.log('');
console.log('🔗 OAuth redirect URI for Supabase:');
console.log(`   exp://${localIP}:${port}/--/auth/callback`);
console.log('');
console.log('📋 Steps to fix OAuth:');
console.log('1. Add the above URL to Google Cloud Console OAuth credentials');
console.log('2. Add the above URL to Supabase Authentication → URL Configuration');
console.log('3. If using Apple OAuth, add to Apple Developer Services ID');
console.log('');
console.log('⚠️  Make sure Expo is running on this IP. Run `npm start` to verify.');
console.log('');

// Try to detect current Expo process
try {
  const expoProcess = execSync('ps aux | grep "expo start" | grep -v grep', { encoding: 'utf8' });
  if (expoProcess.trim()) {
    console.log('✅ Expo appears to be running');
  } else {
    console.log('❌ Expo doesn\'t appear to be running. Start with `npm start`');
  }
} catch (e) {
  console.log('❓ Could not detect Expo process status');
}
