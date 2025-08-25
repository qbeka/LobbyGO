# 🧪 LobbyGO Testing Guide

## 🚀 Quick Start for Testing

### 1. **Database Setup**
First, you need to set up the Supabase database tables:

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to SQL Editor
3. Copy and paste the SQL from `setup-database.js` output
4. Run the SQL to create all necessary tables
5. Verify tables are created in the Table Editor

### 2. **OAuth Setup (For Production Testing)**

#### Google OAuth:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to Credentials → Create OAuth 2.0 Client ID
5. Add these redirect URIs:
   ```
   https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback
   raidlink://auth/callback
   ```
6. Copy Client ID to your `.env` file

#### Apple OAuth (iOS only):
1. Go to [Apple Developer Console](https://developer.apple.com/)
2. Create App ID and Service ID
3. Configure Sign in with Apple
4. Add redirect URI: `https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback`
5. Copy Service ID to your `.env` file

### 3. **Development Testing (Recommended)**

For testing without OAuth setup, use the **Test Accounts**:

1. Start the app: `npm start`
2. On the Auth screen, tap "🧪 Development Test Accounts"
3. Choose from 6 pre-configured accounts:
   - **🏠 Host 1 & 2** - For testing raid hosting
   - **🔄 Trader 1 & 2** - For testing trading features
   - **👤 Guest 1 & 2** - For testing raid joining

## 🎯 Multi-User Testing Scenarios

### **Scenario 1: Raid Hosting & Joining**

1. **Device 1**: Sign in as "🏠 Host 1"
   - Go to Home → Host Queue Raid
   - Select a raid boss (e.g., Charizard)
   - Set party size to 5
   - Create the raid

2. **Device 2**: Sign in as "👤 Guest 1"
   - Go to Home → Queue tab
   - Find the raid created by Host 1
   - Tap to join the raid
   - Test the friend code gate

3. **Device 3**: Sign in as "👤 Guest 2"
   - Repeat joining process
   - Test party chat functionality

### **Scenario 2: Trading System**

1. **Device 1**: Sign in as "🔄 Trader 1"
   - Go to Trade → Create Trade
   - Offering: "Charizard"
   - Looking For: "Blastoise"
   - Set friendship level requirement
   - Post the trade

2. **Device 2**: Sign in as "🔄 Trader 2"
   - Go to Trade → Browse
   - Find Trader 1's listing
   - Open trade details
   - Start trade conversation
   - Test coordination features (date/time, location)

### **Scenario 3: Live Raids**

1. **Host**: Create a live raid (happening now)
2. **Guests**: Join the live raid
3. Test real-time updates:
   - Member count
   - Ready status
   - Chat messages
   - Countdown timer

## 📱 Testing on Multiple Devices

### **Option 1: Physical Devices**
- Install Expo Go on multiple phones/tablets
- Sign in with different test accounts
- Test real-time features

### **Option 2: Simulators + Physical Device**
- iOS Simulator + Physical iPhone
- Android Emulator + Physical Android
- Browser (Expo web) + Physical device

### **Option 3: Browser Testing**
- Use different browser profiles
- Sign in with different test accounts
- Test in incognito/private modes

## 🔧 Debugging Tips

### **Common Issues:**

1. **OAuth not working in Expo Go:**
   - Use test accounts instead
   - OAuth works better in standalone builds

2. **Database connection issues:**
   - Check Supabase URL/Key in `.env`
   - Verify tables exist in Supabase dashboard
   - Check RLS policies

3. **Realtime not working:**
   - Ensure Supabase realtime is enabled
   - Check network connection
   - Verify subscription channels

### **Debugging Tools:**

1. **Console Logs:**
   ```bash
   # View logs while testing
   npx expo start --dev-client
   ```

2. **Supabase Dashboard:**
   - Monitor database changes
   - Check auth users
   - View table data

3. **Network Inspector:**
   - Use React Native Debugger
   - Monitor API calls
   - Check WebSocket connections

## 🎮 Test Account Details

| Account | Username | Team | Level | Purpose |
|---------|----------|------|-------|---------|
| Host 1 | RaidHost_1 | Mystic | 45 | Primary raid hosting |
| Host 2 | RaidHost_2 | Valor | 42 | Secondary raid hosting |
| Trader 1 | PokéTrader_1 | Instinct | 38 | Primary trading |
| Trader 2 | PokéTrader_2 | Mystic | 40 | Secondary trading |
| Guest 1 | RaidGuest_1 | Valor | 35 | Raid participation |
| Guest 2 | RaidGuest_2 | Instinct | 37 | Raid participation |

## 📋 Testing Checklist

### **Authentication:**
- [ ] Test account sign in/out
- [ ] Browse without account
- [ ] OAuth redirect (if configured)
- [ ] Session persistence

### **Raids:**
- [ ] Create queue raid
- [ ] Create live raid
- [ ] Join raid as guest
- [ ] Party chat
- [ ] Friend code gate
- [ ] Ready status
- [ ] Leave party

### **Trading:**
- [ ] Create trade listing
- [ ] Browse trades
- [ ] Filter trades
- [ ] Trade chat
- [ ] Coordinate meeting
- [ ] Mark trade complete

### **Navigation:**
- [ ] Tab navigation
- [ ] Stack navigation
- [ ] Deep links
- [ ] Back button behavior

### **Real-time:**
- [ ] Party updates
- [ ] Chat messages
- [ ] Member status changes
- [ ] Live raid countdown

## 🚨 Known Issues

1. **OAuth in Expo Go**: Limited functionality, use test accounts
2. **iOS Simulator**: No camera/location access
3. **Web Browser**: Limited native features
4. **Network Issues**: Real-time may be delayed on slow connections

## 📞 Need Help?

If you encounter issues:
1. Check the console logs
2. Verify Supabase configuration
3. Ensure all dependencies are installed
4. Try restarting the Expo dev server

Happy testing! 🎉
