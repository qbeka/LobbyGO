// Database setup script for LobbyGO
// This script creates the necessary tables and inserts test data

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase configuration');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  console.log('🚀 Setting up LobbyGO database...');

  try {
    // Test connection
    const { data, error } = await supabase.from('raid_bosses').select('count').limit(1);
    
    if (error) {
      console.log('📝 Database tables need to be created in Supabase dashboard');
      console.log('Please create the following tables:');
      console.log(`
📊 Required Tables:
1. users (id, auth_id, trainer_name, friend_code, level, team, created_at)
2. raid_bosses (id, name, tier, raid_type, sprite, cp_no_weather, cp_weather_boost, types)
3. parties (id, host_user_id, boss_id, mode, max_size, additional_trainers, status, created_at)
4. party_members (id, party_id, user_id, role, state, created_at)
5. party_messages (id, party_id, user_id, text, created_at)
6. queue_tickets (id, user_id, boss_id, status, created_at)
7. trades (id, poster_id, offering, looking_for, can_fly, registered, friendship_target, notes, status, created_at)
8. trade_messages (id, trade_id, user_id, text, created_at)

🔗 Run this in your Supabase SQL editor to create the tables:
      `);
      
      console.log(`
-- Users table
CREATE TABLE public.users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    trainer_name TEXT NOT NULL,
    friend_code TEXT NOT NULL,
    level INTEGER NOT NULL DEFAULT 1,
    team TEXT NOT NULL CHECK (team IN ('Mystic', 'Valor', 'Instinct')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Raid bosses table
CREATE TABLE public.raid_bosses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    tier TEXT NOT NULL,
    raid_type TEXT,
    sprite TEXT,
    cp_no_weather INTEGER,
    cp_weather_boost INTEGER,
    types TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Parties table
CREATE TABLE public.parties (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    host_user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    boss_id UUID REFERENCES public.raid_bosses(id) ON DELETE CASCADE,
    mode TEXT NOT NULL CHECK (mode IN ('queue', 'live')),
    max_size INTEGER NOT NULL DEFAULT 5,
    additional_trainers INTEGER DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'active', 'closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Party members table
CREATE TABLE public.party_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    party_id UUID REFERENCES public.parties(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('host', 'guest')),
    state TEXT NOT NULL DEFAULT 'joined' CHECK (state IN ('joined', 'ready', 'left')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(party_id, user_id)
);

-- Party messages table
CREATE TABLE public.party_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    party_id UUID REFERENCES public.parties(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Queue tickets table
CREATE TABLE public.queue_tickets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    boss_id UUID REFERENCES public.raid_bosses(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'matched', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trades table
CREATE TABLE public.trades (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    poster_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    offering TEXT[] NOT NULL,
    looking_for TEXT[] NOT NULL,
    can_fly BOOLEAN NOT NULL DEFAULT FALSE,
    registered TEXT NOT NULL CHECK (registered IN ('Registered', 'Unregistered')),
    friendship_target TEXT NOT NULL CHECK (friendship_target IN ('None', 'Good', 'Great', 'Ultra', 'Best')),
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'active', 'closed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trade messages table
CREATE TABLE public.trade_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    trade_id UUID REFERENCES public.trades(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.raid_bosses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.party_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.party_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.queue_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trade_messages ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (adjust as needed)
CREATE POLICY "Public read access" ON public.raid_bosses FOR SELECT USING (true);
CREATE POLICY "Users can read their own data" ON public.users FOR SELECT USING (auth.uid() = auth_id);
CREATE POLICY "Users can update their own data" ON public.users FOR UPDATE USING (auth.uid() = auth_id);
CREATE POLICY "Users can insert their own data" ON public.users FOR INSERT WITH CHECK (auth.uid() = auth_id);
      `);
      
      return;
    }

    console.log('✅ Database connection successful!');
    
    // Check if we have any raid bosses
    const { data: bosses, error: bossError } = await supabase
      .from('raid_bosses')
      .select('*')
      .limit(5);
      
    if (bossError) {
      console.error('❌ Error querying raid bosses:', bossError);
      return;
    }
    
    console.log(`📊 Found ${bosses?.length || 0} raid bosses in database`);
    
    if (bosses && bosses.length > 0) {
      console.log('Sample bosses:');
      bosses.forEach(boss => {
        console.log(`  - ${boss.name} (${boss.tier})`);
      });
    }

    console.log('✅ Database setup complete!');
    
  } catch (error) {
    console.error('❌ Database setup error:', error);
  }
}

setupDatabase();
