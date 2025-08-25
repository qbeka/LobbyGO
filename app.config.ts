import 'dotenv/config';
import fs from 'fs';

const has = (p: string) => fs.existsSync(p);

export default {
  expo: {
    name: process.env.EXPO_PUBLIC_APP_NAME ?? 'LobbyGO',
    slug: 'lobbygo',
    version: '1.0.0',
    orientation: 'portrait',
    userInterfaceStyle: 'light',
    newArchEnabled: true,
    scheme: process.env.EXPO_PUBLIC_APP_SCHEME ?? 'raidlink',

    // Only include assets if you add them later
    icon: has('./assets/icon.png') ? './assets/icon.png' : undefined,
    splash: has('./assets/splash-icon.png')
      ? { image: './assets/splash-icon.png', resizeMode: 'contain', backgroundColor: '#F5F5F5' }
      : undefined,
    web: { favicon: has('./assets/favicon.png') ? './assets/favicon.png' : undefined },
    android: {
      package: 'com.lobbygo.app',
      versionCode: 1,
      edgeToEdgeEnabled: true,
      adaptiveIcon: has('./assets/adaptive-icon.png')
        ? { foregroundImage: './assets/adaptive-icon.png', backgroundColor: '#F5F5F5' }
        : undefined,
      permissions: [
        'ACCESS_COARSE_LOCATION',
        'ACCESS_FINE_LOCATION',
        'FOREGROUND_SERVICE',
        'VIBRATE',
        'WAKE_LOCK',
      ],
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.lobbygo.app',
      buildNumber: '1.0.0',
    },
    plugins: [
      'expo-notifications',
      'sentry-expo'
    ],
    extra: {
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      posthogApiKey: process.env.EXPO_PUBLIC_POSTHOG_API_KEY,
      posthogHost: process.env.EXPO_PUBLIC_POSTHOG_HOST,
      sentryDsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
      projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
      googleClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
      appleClientId: process.env.EXPO_PUBLIC_APPLE_CLIENT_ID,
      enableAnalytics: process.env.EXPO_PUBLIC_ENABLE_ANALYTICS === 'true',
      enablePushNotifications: process.env.EXPO_PUBLIC_ENABLE_PUSH_NOTIFICATIONS === 'true',
      enableSentry: process.env.EXPO_PUBLIC_ENABLE_SENTRY === 'true',
      apiUrl: process.env.EXPO_PUBLIC_API_URL,
      debug: process.env.EXPO_PUBLIC_DEBUG === 'true',
    },
  },
};
