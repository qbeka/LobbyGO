# 🔐 OAuth Setup Guide for LobbyGO

## 🚨 **Current Issue Fix**

**Problem**: Getting stuck at localhost black screen after OAuth sign-in.

**Root Cause**: The OAuth redirect URI is not properly configured for Expo Go.

**Solution**: We need to configure both Google Cloud Console and Supabase with the correct Expo Go redirect URIs.

## 📋 **Step-by-Step Setup**

### **1. Google OAuth Setup**

#### **A. Google Cloud Console Setup**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. **Create or Select Project**:
   - Click project dropdown → "New Project"
   - Name: "LobbyGO" 
   - Click "Create"

3. **Enable Required APIs**:
   - Go to "APIs & Services" → "Library"
   - Search and enable:
     - ✅ **Google+ API** 
     - ✅ **Google Identity Services API**

4. **Configure OAuth Consent Screen**:
   - Go to "APIs & Services" → "OAuth consent screen"
   - User Type: **External**
   - Fill out:
     - App name: `LobbyGO`
     - User support email: `your-email@gmail.com`
     - Developer contact: `your-email@gmail.com`
   - Click "Save and Continue" through all steps

5. **Create OAuth 2.0 Credentials**:
   - Go to "APIs & Services" → "Credentials"
   - Click "+ Create Credentials" → "OAuth 2.0 Client ID"
   - Application type: **Web application**
   - Name: `LobbyGO Web Client`
   - **Authorized redirect URIs** (CRITICAL - Add BOTH):
     ```
     https://isfriyfggtqvmoelqbly.supabase.co/auth/v1/callback
     exp://192.168.1.67:8081/--/auth/callback
     ```
     ⚠️ **Replace `192.168.1.67:8081` with your actual Expo dev server IP/port**
   - Click "Create"
   - **Copy the Client ID** (not the secret!)

#### **B. Supabase Google Setup**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project → "Authentication" → "Providers"
3. **Google Provider**:
   - Toggle **ON**
   - Paste your **Google Client ID**
   - Leave **Client Secret** empty
   - Save

#### **C. Supabase Site URL Configuration**
1. In Supabase Dashboard → "Authentication" → "URL Configuration"
2. **Add redirect URLs** (CRITICAL):
   ```
   exp://192.168.1.67:8081/--/auth/callback
   ```
   ⚠️ **Replace with your actual Expo dev server URL**
3. Save configuration

---

### **2. Apple OAuth Setup** (iOS Only)

#### **A. Apple Developer Setup**
1. Go to [Apple Developer Console](https://developer.apple.com/account/)
2. **Create App ID**:
   - Certificates, Identifiers & Profiles → Identifiers
   - Click "+" → App IDs → App
   - Description: "LobbyGO"
   - Bundle ID: `com.lobbygo.app` (must match your app.config.ts)
   - Capabilities: Enable **Sign In with Apple**
   - Save

3. **Create Services ID**:
   - Identifiers → Click "+" → Services IDs
   - Description: "LobbyGO Web Auth"
   - Identifier: `com.lobbygo.auth`
   - Enable **Sign In with Apple**
   - Configure:
     - Primary App ID: Select your LobbyGO App ID
     - Web Domain: `isfriyfggtqvmoelqbly.supabase.co`
     - Return URLs (Add BOTH):
       ```
       https://isfriyfggtqvmoelqbly.supabase.co/auth/v1/callback
       exp://192.168.1.67:8081/--/auth/callback
       ```
       ⚠️ **Replace with your actual Expo dev server URL**
   - Save

4. **Create Private Key**:
   - Keys → Click "+"
   - Name: "LobbyGO Sign In Key"
   - Enable **Sign In with Apple**
   - Configure: Select your Services ID
   - Download the `.p8` file
   - Note the **Key ID**

#### **B. Supabase Apple Setup**
1. In Supabase Dashboard → Authentication → Providers
2. **Apple Provider**:
   - Toggle **ON**
   - **Services ID**: `com.lobbygo.auth`
   - **Private Key**: Paste contents of your `.p8` file
   - **Key ID**: Your key ID from Apple
   - **Team ID**: Your Apple Developer Team ID
   - Save

---

### **3. Test the Setup**

#### **A. Start Your App**
```bash
npm start
```

#### **B. Test Google OAuth**
1. Tap "Continue with Google"
2. You should see alert: "You will be redirected to Safari..."
3. Tap "Continue"
4. Safari opens → Sign in with Google
5. **Return to your app** (manually)
6. App should detect authentication

#### **C. Test Apple OAuth** (iOS only)
1. Tap "Continue with Apple"
2. Follow same process as Google
3. Safari opens → Sign in with Apple
4. Return to app

---

### **4. Troubleshooting**

#### **Common Issues:**

1. **"App doesn't comply with OAuth policy"**
   - ✅ Make sure redirect URI is exactly: `https://isfriyfggtqvmoelqbly.supabase.co/auth/v1/callback`
   - ✅ Check Google Cloud Console → Credentials → Your OAuth Client
   - ✅ Verify Supabase has the correct Google Client ID

2. **"OAuth cancelled or failed"**
   - ✅ Make sure you return to the app after signing in
   - ✅ Check browser console for errors
   - ✅ Verify Supabase provider is enabled

3. **Apple OAuth not working**
   - ✅ Only works on iOS devices/simulators
   - ✅ Check Apple Developer configuration
   - ✅ Verify Services ID and Bundle ID match

4. **Session not detected**
   - ✅ Wait a few seconds after returning to app
   - ✅ Check Supabase Dashboard → Authentication → Users
   - ✅ Look for console logs

#### **Debug Steps:**
1. Check browser network tab for errors
2. Verify Supabase auth settings
3. Test in Supabase Dashboard → Authentication → Settings
4. Check console logs in your app

---

### **5. Current Status**

✅ **OAuth Service**: Updated to work with Supabase  
✅ **Google Setup**: Ready for configuration  
✅ **Apple Setup**: Ready for configuration  
✅ **Error Handling**: Improved user experience  
✅ **Instructions**: Clear user guidance  

---

### **6. Production Notes**

- **Google**: Requires domain verification for production
- **Apple**: Requires paid Apple Developer account
- **Expo Go**: OAuth works but redirects to Safari
- **Standalone Build**: Better OAuth experience with custom URL schemes

---

### **📞 Still Need Help?**

1. **Check Supabase logs**: Dashboard → Logs
2. **Verify credentials**: Double-check all IDs and keys
3. **Test in browser**: Try OAuth flow in Supabase auth UI
4. **Check domains**: Ensure all URLs match exactly

**Remember**: OAuth in Expo Go requires manual return to app after signing in!

🎉 **After setup, you'll be able to test all LobbyGO features with real Google/Apple accounts!**
