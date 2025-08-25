import { makeRedirectUri } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { supabase } from './supabase';
import { Platform } from 'react-native';

// Configure WebBrowser for better OAuth experience
WebBrowser.maybeCompleteAuthSession();

// Create OAuth helper functions
export const authService = {
  // Sign in with Google using Expo AuthSession
  signInWithGoogle: async () => {
    try {
      // Create redirect URI for Expo Go
      const redirectTo = makeRedirectUri({
        scheme: 'raidlink', // Your app scheme
        path: '/auth/callback',
      });

      console.log('Google OAuth redirect URI:', redirectTo);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        console.error('Google OAuth error:', error);
        return { data: null, error };
      }

      // Open the auth URL in the browser
      if (data?.url) {
        const result = await WebBrowser.openAuthSessionAsync(
          data.url,
          redirectTo
        );

        if (result.type === 'success') {
          // Extract the URL parameters
          const url = result.url;
          const urlParams = new URL(url);
          const accessToken = urlParams.searchParams.get('access_token');
          const refreshToken = urlParams.searchParams.get('refresh_token');

          if (accessToken) {
            // Set the session in Supabase
            const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || '',
            });

            return { data: sessionData, error: sessionError };
          }
        }

        return { data: null, error: new Error('OAuth cancelled or failed') };
      }

      return { data: null, error: new Error('No OAuth URL provided') };
    } catch (error) {
      console.error('Google sign in error:', error);
      return { data: null, error: error as Error };
    }
  },

  // Sign in with Apple using Expo AuthSession
  signInWithApple: async () => {
    try {
      // Apple Sign In is only available on iOS
      if (Platform.OS !== 'ios') {
        return { data: null, error: new Error('Apple Sign In is only available on iOS') };
      }

      // Create redirect URI for Expo Go
      const redirectTo = makeRedirectUri({
        scheme: 'raidlink',
        path: '/auth/callback',
      });

      console.log('Apple OAuth redirect URI:', redirectTo);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo,
        },
      });

      if (error) {
        console.error('Apple OAuth error:', error);
        return { data: null, error };
      }

      // Open the auth URL in the browser
      if (data?.url) {
        const result = await WebBrowser.openAuthSessionAsync(
          data.url,
          redirectTo
        );

        if (result.type === 'success') {
          // Extract the URL parameters
          const url = result.url;
          const urlParams = new URL(url);
          const accessToken = urlParams.searchParams.get('access_token');
          const refreshToken = urlParams.searchParams.get('refresh_token');

          if (accessToken) {
            // Set the session in Supabase
            const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || '',
            });

            return { data: sessionData, error: sessionError };
          }
        }

        return { data: null, error: new Error('OAuth cancelled or failed') };
      }

      return { data: null, error: new Error('No OAuth URL provided') };
    } catch (error) {
      console.error('Apple sign in error:', error);
      return { data: null, error: error as Error };
    }
  },

  // Test authentication with dummy accounts for development
  signInWithTestAccount: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      return { data, error };
    } catch (error) {
      console.error('Test account sign in error:', error);
      return { data: null, error: error as Error };
    }
  },

  // Create test accounts for development
  createTestAccount: async (email: string, password: string, userData?: {
    trainer_name?: string;
    friend_code?: string;
    level?: number;
    team?: 'Mystic' | 'Valor' | 'Instinct';
  }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData || {},
        },
      });

      return { data, error };
    } catch (error) {
      console.error('Test account creation error:', error);
      return { data: null, error: error as Error };
    }
  },

  // Sign out
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error: error as Error };
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      return { user, error };
    } catch (error) {
      console.error('Get current user error:', error);
      return { user: null, error: error as Error };
    }
  },

  // Get current session
  getSession: async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      return { data, error };
    } catch (error) {
      console.error('Get session error:', error);
      return { data: null, error: error as Error };
    }
  },
};

// Test account configurations for development
export const TEST_ACCOUNTS = {
  HOST_1: {
    email: 'host1@lobbygo.test',
    password: 'testhost123',
    userData: {
      trainer_name: 'RaidHost_1',
      friend_code: '1234 5678 9012',
      level: 45,
      team: 'Mystic' as const,
    },
  },
  HOST_2: {
    email: 'host2@lobbygo.test',
    password: 'testhost123',
    userData: {
      trainer_name: 'RaidHost_2',
      friend_code: '2345 6789 0123',
      level: 42,
      team: 'Valor' as const,
    },
  },
  TRADER_1: {
    email: 'trader1@lobbygo.test',
    password: 'testtrader123',
    userData: {
      trainer_name: 'PokéTrader_1',
      friend_code: '3456 7890 1234',
      level: 38,
      team: 'Instinct' as const,
    },
  },
  TRADER_2: {
    email: 'trader2@lobbygo.test',
    password: 'testtrader123',
    userData: {
      trainer_name: 'PokéTrader_2',
      friend_code: '4567 8901 2345',
      level: 40,
      team: 'Mystic' as const,
    },
  },
  GUEST_1: {
    email: 'guest1@lobbygo.test',
    password: 'testguest123',
    userData: {
      trainer_name: 'RaidGuest_1',
      friend_code: '5678 9012 3456',
      level: 35,
      team: 'Valor' as const,
    },
  },
  GUEST_2: {
    email: 'guest2@lobbygo.test',
    password: 'testguest123',
    userData: {
      trainer_name: 'RaidGuest_2',
      friend_code: '6789 0123 4567',
      level: 37,
      team: 'Instinct' as const,
    },
  },
};
