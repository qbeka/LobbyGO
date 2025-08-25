import { makeRedirectUri } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { supabase } from './supabase';
import { Platform } from 'react-native';

// Configure WebBrowser for better OAuth experience
WebBrowser.maybeCompleteAuthSession();

// Create OAuth helper functions
export const authService = {
  // Sign in with Google using proper Expo flow
  signInWithGoogle: async () => {
    try {
      console.log('Starting Google OAuth...');

      // Create the redirect URI for Expo Go
      const redirectTo = makeRedirectUri({
        scheme: 'exp', // This is critical for Expo Go
        path: 'auth/callback',
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
        console.log('Opening OAuth URL:', data.url);
        
        // Use openAuthSessionAsync for proper OAuth flow
        const result = await WebBrowser.openAuthSessionAsync(
          data.url,
          redirectTo
        );
        
        console.log('OAuth result:', result);
        
        if (result.type === 'success' && result.url) {
          // Parse the URL to extract tokens
          const url = new URL(result.url);
          const fragment = url.hash.substring(1);
          const params = new URLSearchParams(fragment);
          
          const access_token = params.get('access_token');
          const refresh_token = params.get('refresh_token');
          
          if (access_token) {
            // Set the session in Supabase
            const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
              access_token,
              refresh_token: refresh_token || '',
            });
            
            if (sessionError) {
              console.error('Session error:', sessionError);
              return { data: null, error: sessionError };
            }
            
            console.log('Google OAuth successful!');
            return { data: sessionData, error: null };
          }
        }
        
        return { data: null, error: new Error('OAuth was cancelled or failed') };
      }

      return { data: null, error: new Error('No OAuth URL provided') };
    } catch (error) {
      console.error('Google sign in error:', error);
      return { data: null, error: error as Error };
    }
  },

  // Sign in with Apple using proper Expo flow
  signInWithApple: async () => {
    try {
      // Apple Sign In is only available on iOS
      if (Platform.OS !== 'ios') {
        return { data: null, error: new Error('Apple Sign In is only available on iOS') };
      }

      console.log('Starting Apple OAuth...');

      // Create the redirect URI for Expo Go
      const redirectTo = makeRedirectUri({
        scheme: 'exp', // This is critical for Expo Go
        path: 'auth/callback',
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
        console.log('Opening Apple OAuth URL:', data.url);
        
        // Use openAuthSessionAsync for proper OAuth flow
        const result = await WebBrowser.openAuthSessionAsync(
          data.url,
          redirectTo
        );
        
        console.log('Apple OAuth result:', result);
        
        if (result.type === 'success' && result.url) {
          // Parse the URL to extract tokens
          const url = new URL(result.url);
          const fragment = url.hash.substring(1);
          const params = new URLSearchParams(fragment);
          
          const access_token = params.get('access_token');
          const refresh_token = params.get('refresh_token');
          
          if (access_token) {
            // Set the session in Supabase
            const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
              access_token,
              refresh_token: refresh_token || '',
            });
            
            if (sessionError) {
              console.error('Apple session error:', sessionError);
              return { data: null, error: sessionError };
            }
            
            console.log('Apple OAuth successful!');
            return { data: sessionData, error: null };
          }
        }
        
        return { data: null, error: new Error('Apple OAuth was cancelled or failed') };
      }

      return { data: null, error: new Error('No Apple OAuth URL provided') };
    } catch (error) {
      console.error('Apple sign in error:', error);
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