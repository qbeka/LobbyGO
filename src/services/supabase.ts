import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Use actual values or safe fallbacks
const finalUrl = supabaseUrl || 'https://placeholder.supabase.co';
const finalKey = supabaseAnonKey || 'placeholder-key';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not found. Using fallback values for development.');
}

// Configure AsyncStorage for React Native
const storage = {
  getItem: async (key: string) => {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error('Error getting item from storage:', error);
      return null;
    }
  },
  setItem: async (key: string, value: string) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error('Error setting item in storage:', error);
    }
  },
  removeItem: async (key: string) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing item from storage:', error);
    }
  },
};

export const supabase = createClient(finalUrl, finalKey, {
  auth: {
    storage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Auth helpers
export const auth = {
  signInWithApple: async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: undefined,
      },
    });
    return { data, error };
  },

  signInWithGoogle: async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: undefined,
      },
    });
    return { data, error };
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  getSession: async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      return { data, error };
    } catch (error) {
      console.error('Error getting session:', error);
      return { data: null, error };
    }
  },
};

// Database helpers
export const db = {
  // User operations
  upsertUser: async (userData: {
    trainer_name: string;
    friend_code: string;
    level: number;
    team: 'Mystic' | 'Valor' | 'Instinct';
  }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('users')
      .upsert({
        auth_id: user.id,
        ...userData,
      })
      .select()
      .single();

    return { data, error };
  },

  // Boss operations
  getBosses: async () => {
    const { data, error } = await supabase
      .from('raid_bosses')
      .select('*')
      .order('tier', { ascending: false });

    return { data, error };
  },

  // Queue operations
  joinQueue: async (bossId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('queue_tickets')
      .insert({
        user_id: user.id,
        boss_id: bossId,
      })
      .select()
      .single();

    return { data, error };
  },

  cancelQueue: async (ticketId: string) => {
    const { data, error } = await supabase
      .from('queue_tickets')
      .update({ status: 'cancelled' })
      .eq('id', ticketId)
      .select()
      .single();

    return { data, error };
  },

  getUserQueueTickets: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('queue_tickets')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'waiting');

    return { data, error };
  },

  // Party operations
  createParty: async (partyData: {
    mode: 'queue' | 'live';
    boss_id: string;
    max_size: number;
    additional_trainers: number;
  }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('parties')
      .insert({
        ...partyData,
        host_user_id: user.id,
      })
      .select()
      .single();

    if (error) return { data: null, error };

    // Add host as member
    const { error: memberError } = await supabase
      .from('party_members')
      .insert({
        party_id: data.id,
        user_id: user.id,
        role: 'host',
        state: 'ready',
      });

    return { data, error: memberError };
  },

  joinParty: async (partyId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('party_members')
      .insert({
        party_id: partyId,
        user_id: user.id,
        role: 'guest',
        state: 'joined',
      })
      .select()
      .single();

    return { data, error };
  },

  setReady: async (partyId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('party_members')
      .update({ state: 'ready' })
      .eq('party_id', partyId)
      .eq('user_id', user.id)
      .select()
      .single();

    return { data, error };
  },

  leaveParty: async (partyId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('party_members')
      .update({ state: 'left' })
      .eq('party_id', partyId)
      .eq('user_id', user.id)
      .select()
      .single();

    return { data, error };
  },

  getParties: async (filters: {
    boss?: string;
    mode?: 'queue' | 'live';
    status?: 'open' | 'active' | 'closed';
    limit?: number;
    offset?: number;
  } = {}) => {
    let query = supabase
      .from('parties')
      .select(`
        *,
        boss:raid_bosses(*),
        members:party_members(*, user:users(*)),
        host:users(*)
      `)
      .eq('status', 'open');

    if (filters.boss) {
      query = query.eq('boss_id', filters.boss);
    }
    if (filters.mode) {
      query = query.eq('mode', filters.mode);
    }
    if (filters.limit) {
      query = query.limit(filters.limit);
    }
    if (filters.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 20) - 1);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    return { data, error };
  },

  getParty: async (partyId: string) => {
    const { data, error } = await supabase
      .from('parties')
      .select(`
        *,
        boss:raid_bosses(*),
        members:party_members(*, user:users(*)),
        messages:party_messages(*, user:users(*))
      `)
      .eq('id', partyId)
      .single();

    return { data, error };
  },

  sendPartyMessage: async (partyId: string, text: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('party_messages')
      .insert({
        party_id: partyId,
        user_id: user.id,
        text,
      })
      .select()
      .single();

    return { data, error };
  },

  // Trade operations
  getTrades: async (filters: {
    offering?: string[];
    looking_for?: string[];
    can_fly?: boolean;
    friendship_target?: string;
    registered?: string;
    status?: 'open' | 'active' | 'closed';
    limit?: number;
    offset?: number;
  } = {}) => {
    let query = supabase
      .from('trades')
      .select(`
        *,
        poster:users(*),
        messages:trade_messages(*, user:users(*))
      `)
      .eq('status', 'open');

    if (filters.offering && filters.offering.length > 0) {
      query = query.contains('offering', filters.offering);
    }
    if (filters.looking_for && filters.looking_for.length > 0) {
      query = query.contains('looking_for', filters.looking_for);
    }
    if (filters.can_fly !== undefined) {
      query = query.eq('can_fly', filters.can_fly);
    }
    if (filters.friendship_target) {
      query = query.eq('friendship_target', filters.friendship_target);
    }
    if (filters.registered) {
      query = query.eq('registered', filters.registered);
    }
    if (filters.limit) {
      query = query.limit(filters.limit);
    }
    if (filters.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 20) - 1);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    return { data, error };
  },

  createTrade: async (tradeData: {
    offering: string[];
    looking_for: string[];
    can_fly: boolean;
    registered: 'Registered' | 'Unregistered';
    friendship_target: 'None' | 'Good' | 'Great' | 'Ultra' | 'Best';
    notes?: string;
  }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('trades')
      .insert({
        poster_id: user.id,
        ...tradeData,
      })
      .select()
      .single();

    return { data, error };
  },

  sendTradeMessage: async (tradeId: string, text: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No authenticated user');

    const { data, error } = await supabase
      .from('trade_messages')
      .insert({
        trade_id: tradeId,
        user_id: user.id,
        text,
      })
      .select()
      .single();

    return { data, error };
  },
};

// Realtime subscriptions
export const realtime = {
  subscribeToParties: (callback: (payload: any) => void) => {
    return supabase
      .channel('list:parties')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'parties'
      }, callback)
      .subscribe();
  },

  subscribeToParty: (partyId: string, callback: (payload: any) => void) => {
    return supabase
      .channel(`party:${partyId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'party_members',
        filter: `party_id=eq.${partyId}`
      }, callback)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'party_messages',
        filter: `party_id=eq.${partyId}`
      }, callback)
      .subscribe();
  },

  subscribeToTrade: (tradeId: string, callback: (payload: any) => void) => {
    return supabase
      .channel(`trade:${tradeId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'trade_messages',
        filter: `trade_id=eq.${tradeId}`
      }, callback)
      .subscribe();
  },
};
