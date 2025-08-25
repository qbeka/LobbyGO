import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { supabase, auth } from './services/supabase';
import { useAppStore } from './stores/appStore';
import RootNavigator from './navigation/RootNavigator';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

export default function App() {
  const {
    setUser,
    setAuthenticated,
    setLoading,
    setBosses,
    reset,
  } = useAppStore();

  useEffect(() => {
    // Initialize auth state
    const initializeAuth = async () => {
      try {
        setLoading(true);

        // Get current session
        const { data, error } = await auth.getSession();

        if (error) {
          console.error('Error getting session:', error);
          setAuthenticated(false);
        } else if (data?.session?.user) {
          const { user } = data.session;
          setUser({
            id: user.id,
            auth_id: user.id,
            trainer_name: user.user_metadata?.trainer_name || '',
            friend_code: user.user_metadata?.friend_code || '',
            team: user.user_metadata?.team || 'Mystic',
            level: user.user_metadata?.level || 1,
            created_at: user.created_at,
          });
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);

      if (event === 'SIGNED_IN' && session?.user) {
        const { user } = session;
        setUser({
          id: user.id,
          auth_id: user.id,
          trainer_name: user.user_metadata?.trainer_name || '',
          friend_code: user.user_metadata?.friend_code || '',
          team: user.user_metadata?.team || 'Mystic',
          level: user.user_metadata?.level || 1,
          created_at: user.created_at,
        });
        setAuthenticated(true);
      } else if (event === 'SIGNED_OUT') {
        reset();
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser, setAuthenticated, setLoading, reset]);

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="auto" />
        <RootNavigator />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
